#!/usr/bin/env bash
# Everything writable lives in a mktemp copy. The caller's .dev.vars is never read or touched.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
T="$(mktemp -d)"
cleanup() {
  local status=$?
  trap - EXIT
  if [[ -f "$T/cleanup.py" ]]; then python3 "$T/cleanup.py" "$T" || status=1; fi
  rm -rf "$T"
  exit "$status"
}
trap cleanup EXIT
trap 'exit 130' INT TERM
python3 - "$ROOT" "$T" <<'PY'
import json, os, shutil, socket, subprocess, sys, time
from pathlib import Path
from urllib.parse import urlparse

root, temp = map(Path, sys.argv[1:])
work = temp / 'work'
processes, handles = [], []
# The EXIT trap also runs this idempotent, PID/command/group-checked cleanup.
cleanup = r'''
import json, os, signal, subprocess, sys, time
from pathlib import Path
registry = Path(sys.argv[1]) / 'processes.json'
if not registry.exists(): sys.exit(0)
groups = json.loads(registry.read_text())
def members(group):
    result = subprocess.run(['ps', '-ww', '-axo', 'pid=,pgid=,stat=,command='], capture_output=True, text=True, timeout=5, check=True)
    return [(int(p[0]), p[3]) for line in result.stdout.splitlines() if len(p := line.strip().split(None, 3)) == 4 and int(p[1]) == group and not p[2].startswith('Z')]
for group in reversed(groups):
    for sig in (signal.SIGTERM, signal.SIGKILL):
        # Children first. A concurrent exit/exec may change ps's display; never
        # signal that snapshot. Re-snapshot still-owned members on the next pass.
        for pid, command in sorted(members(group), reverse=True):
            result = subprocess.run(['ps', '-ww', '-o', 'command=', '-p', str(pid)], capture_output=True, text=True, timeout=5)
            if not result.stdout.strip(): continue
            if result.stdout.strip() != command: continue
            try:
                if os.getpgid(pid) != group: raise RuntimeError('Process group changed')
                os.kill(pid, sig)
            except ProcessLookupError: pass
        until = time.monotonic() + 5
        while time.monotonic() < until and members(group): time.sleep(.1)
    if members(group): raise RuntimeError('Child process cleanup failed')
registry.unlink(missing_ok=True)
'''
(temp / 'cleanup.py').write_text(cleanup)
# Block accidental Node egress, including Wrangler telemetry/update/auth probes.
# localhost internal plumbing is rewritten to 127.0.0.1; Unix sockets are local.
(temp / 'offline.cjs').write_text(r'''
const net = require('node:net'), dns = require('node:dns');
const allowed = host => !host || host === '127.0.0.1' || host === 'localhost';
const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function(...args) {
  const a = Array.isArray(args[0]) ? args[0] : args;
  const option = a[0];
  const host = option && typeof option === 'object' ? option.host : typeof a[1] === 'string' ? a[1] : undefined;
  if (!allowed(host)) { console.error('OFFLINE socket blocked'); throw new Error('Offline acceptance: non-loopback socket blocked'); }
  if (option && typeof option === 'object' && option.host === 'localhost') option.host = '127.0.0.1';
  if (a[1] === 'localhost') a[1] = '127.0.0.1';
  return connect.apply(this, args);
};
const lookup = dns.lookup;
dns.lookup = function(host, ...args) {
  if (!allowed(host)) { console.error('OFFLINE DNS blocked'); const callback = args.at(-1); return callback(new Error('Offline acceptance: DNS blocked')); }
  return lookup.call(this, host === 'localhost' ? '127.0.0.1' : host, ...args);
};
''')
env = dict(os.environ)
for key in list(env):
    if key.startswith(('CLOUDFLARE_', 'CF_API_', 'GITHUB_', 'OAUTH_', 'SESSION_', 'SUBMIT_')) or key in ('BOTS_DIR', 'IP_SALT', 'NODE_OPTIONS', 'HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy', 'all_proxy'):
        del env[key]
env.update({'WRANGLER_SEND_METRICS': 'false', 'CI': '1', 'WRANGLER_LOG_PATH': str(temp / 'wrangler.log'),
            'CLOUDFLARE_API_BASE_URL': 'http://127.0.0.1:8799/cf-disabled', 'NO_PROXY': '*',
            'NODE_OPTIONS': '--require=' + str(temp / 'offline.cjs'), 'XDG_CONFIG_HOME': str(temp / 'config')})

def require(condition, message):
    if not condition: raise RuntimeError(message)
def run(command, label, timeout=120, capture=False):
    with (temp / (label + '.log')).open('w') as log:
        result = subprocess.run(command, cwd=work, env=env, stdin=subprocess.DEVNULL,
                                stdout=subprocess.PIPE if capture else log, stderr=log, text=True, timeout=timeout)
    require(result.returncode == 0, label + ' failed')
    return result.stdout

def start(command, label):
    handle = (temp / (label + '.log')).open('w'); handles.append(handle)
    p = subprocess.Popen(command, cwd=work, env=env, stdin=subprocess.DEVNULL, stdout=handle, stderr=subprocess.STDOUT, start_new_session=True)
    processes.append(p)
    (temp / 'processes.json').write_text(json.dumps([p.pid for p in processes]))
    return p

def listening(port):
    try:
        with socket.create_connection(('127.0.0.1', port), timeout=.2): return True
    except OSError: return False

def wait(p, port):
    until = time.monotonic() + 90
    while time.monotonic() < until:
        require(p.poll() is None, 'local server exited')
        if listening(port): return
        time.sleep(.2)
    raise RuntimeError('local server startup timed out')

counter = 0
jar = temp / 'cookies'
def curl(url, args=(), expected=200):
    global counter
    target = urlparse(url)
    require(target.scheme == 'http' and target.hostname == '127.0.0.1' and target.port in (8788, 8799), 'Non-loopback URL refused')
    counter += 1
    headers, body = temp / f'headers-{counter}', temp / f'body-{counter}'
    code = run(['curl', '--noproxy', '*', '--silent', '--show-error', '--max-time', '20', '--proto', '=http',
                '-b', str(jar), '-c', str(jar), '-D', str(headers), '-o', str(body), '-w', '%{http_code}', *args, url], f'curl-{counter}', timeout=25, capture=True)
    require(code == str(expected), f'HTTP step {counter}: expected {expected}, received {code}')
    parsed = {}
    for line in headers.read_text().splitlines():
        if ':' in line:
            key, value = line.split(':', 1); parsed[key.lower()] = value.strip()
    return parsed, body

try:
    for port in (8788, 8799, 9338): require(not listening(port), 'Acceptance port occupied; existing processes untouched')
    work.mkdir()
    for name in ('functions', 'migrations', 'scripts', 'site', 'schema', 'bots', 'integrations', 'tests/fixtures'):
        shutil.copytree(root / name, work / name, ignore=shutil.ignore_patterns('dist', 'cache', 'bot-assets', 'api-data', '__pycache__'))
    for name in ('package.json', 'package-lock.json', 'wrangler.toml'): shutil.copy2(root / name, work / name)
    (work / 'node_modules').symlink_to(root / 'node_modules', target_is_directory=True)
    run(['npm', 'run', 'build'], 'build')
    print('npm run build: OK', flush=True)
    # Private key and all other credentials are generated inside the disposable copy,
    # never printed, logged or copied from a real account.
    run(['node', '--input-type=module', '-e', r'''
import { generateKeyPairSync, randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
const pem = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' });
const values = { ALLOW_TEST_ENDPOINTS: '1', GITHUB_API_BASE: 'http://127.0.0.1:8799', GITHUB_OAUTH_BASE: 'http://127.0.0.1:8799', SUBMIT_REPO: 'owner/repo', GITHUB_APP_ID: '42', GITHUB_APP_INSTALLATION_ID: '777', GITHUB_APP_BOT_LOGIN: 'local[bot]', OAUTH_CLIENT_ID: 'local-client', OAUTH_CLIENT_SECRET: randomBytes(32).toString('hex'), SESSION_SECRET: randomBytes(32).toString('hex'), IP_SALT: randomBytes(32).toString('hex'), GITHUB_APP_PRIVATE_KEY: pem };
writeFileSync('.dev.vars', Object.entries(values).map(([k,v]) => `${k}=${JSON.stringify(v)}`).join('\n') + '\n', { mode: 0o600 });
'''], 'vars')
    wrangler = str(root / 'node_modules/wrangler/bin/wrangler.js')
    run(['node', wrangler, 'd1', 'migrations', 'apply', 'DB', '--local'], 'migrations')
    print('wrangler d1 migrations apply DB --local: OK', flush=True)
    fake = start(['node', 'scripts/fake-github.mjs', str(temp / 'github.jsonl')], 'fake-github'); wait(fake, 8799)
    server = start(['node', wrangler, 'pages', 'dev', '--ip', '127.0.0.1', '--port', '8788', '--inspector-port', '9338'], 'pages'); wait(server, 8788)
    base = 'http://127.0.0.1:8788'
    headers, _ = curl(base + '/api/auth/start', expected=302)
    headers, _ = curl(headers['location'], expected=302)
    headers, _ = curl(headers['location'], expected=302)
    if headers.get('location') != '/submit?login=ok':
        # Only fixed callback outcomes and path/method pairs, never query/cookies/bodies.
        outcome = headers.get('location')
        if outcome in ('/submit?login=failed', '/submit?login=expired', '/submit?login=cancelled'): print(outcome, file=sys.stderr)
        logged = temp / 'github.jsonl'
        if logged.exists():
            for line in logged.read_text().splitlines():
                item = json.loads(line); print(item['method'] + ' ' + item['path'], file=sys.stderr)
        if 'OFFLINE' in (temp / 'pages.log').read_text(): print('Offline egress guard blocked a non-loopback probe.', file=sys.stderr)
        raise RuntimeError('OAuth callback failed')
    _, me = curl(base + '/api/auth/me')
    require(json.loads(me.read_text()) == {'ok': True, 'id': 123, 'login': 'Alice'}, 'Session identity failed')
    print('curl OAuth → callback → /api/auth/me: OK', flush=True)
    headers, shot = curl(base + '/api/submit/screenshot', ['-H', 'Origin: ' + base, '-H', 'Content-Type: image/png', '--data-binary', '@tests/fixtures/bots/demo-prd-reviewer/screenshots/review-result.png'])
    implementation = headers.get('x-base64-impl')
    require(implementation in ('native', 'buffer'), 'Native base64 probe missing')
    print('base64-impl=' + implementation, flush=True)
    # CLI packaging uses the actual pack implementation; fixture originals stay untouched.
    run(['node', '--input-type=module', '-e', r'''
import { readFileSync, writeFileSync } from 'node:fs';
import { pack } from './scripts/submission/bundle-core.mjs';
const slug = 'accept-demo';
const rels = ['bot.yaml', 'ROLE.md', 'DESIGN.md', 'routines.md', 'skills/checklist-review/SKILL.md', 'skills/issue-ranking/SKILL.md'];
const files = Object.fromEntries(rels.map(rel => [`bots/${slug}/${rel}`, readFileSync(`tests/fixtures/bots/demo-prd-reviewer/${rel}`, 'utf8').replaceAll('demo-prd-reviewer', slug)]));
const bundle = pack({ slug, files, screenshots: ['review-result.png'] });
const receipt = JSON.parse(readFileSync(process.argv[1], 'utf8')).receipt;
writeFileSync('request.json', JSON.stringify({ bundle, screenshots: [receipt], license: true }));
''', str(shot)], 'pack')
    _, submitted = curl(base + '/api/submit', ['-H', 'Origin: ' + base, '-H', 'Content-Type: application/json', '--data-binary', '@request.json'])
    result = json.loads(submitted.read_text())
    require(result.get('ok') and result.get('autoMerge') and result.get('pr', {}).get('number') == 7, 'Submission result failed')
    require(result.get('liveUrl') == base + '/bots/accept-demo', 'liveUrl must use request origin')
    _, state = curl(base + '/api/submit/status?pr=7')
    require(json.loads(state.read_text()).get('state') == 'waiting_review', 'Status endpoint failed')
    entries = [json.loads(line) for line in (temp / 'github.jsonl').read_text().splitlines()]
    writes = [entry for entry in entries if entry['method'] in ('POST', 'PATCH')]
    def at(suffix): return [entry for entry in writes if entry['path'].endswith(suffix)]
    require(len(at('/git/trees')) == 2 and len(at('/git/commits')) == 1 and len(at('/git/refs')) == 1 and len(at('/pulls')) == 1 and len(at('/graphql')) == 1, 'GitHub write counts failed')
    trees = at('/git/trees')
    require(all(e['mode'] in ('100644', '040000') for t in trees for e in t['body']['tree']), 'Unsafe tree mode')
    require(trees[1]['body']['tree'] == [{'path': 'bots/accept-demo', 'mode': '040000', 'type': 'tree', 'sha': '3' * 40}], 'Outer tree escaped slug scope')
    require(at('/git/commits')[0]['body']['author']['email'] == '123+Alice@users.noreply.github.com', 'Commit author failed')
    require('committer' not in at('/git/commits')[0]['body'], 'Unexpected committer override')
    require(any(e['method'] == 'DELETE' and e['path'] == '/applications/local-client/token' for e in entries), 'OAuth token not revoked')
    require('MERGE' in at('/graphql')[0]['body']['query'], 'Auto-merge method failed')
    print('curl screenshot → submit → status: OK', flush=True)
    print('GitHub log: trees=2 commits=1 refs=1 pulls=1 graphql=1; noreply author; safe modes: OK', flush=True)
except Exception as error:
    # No response bodies/logs/keys are printed on failure.
    print('ACCEPT-SUBMIT FAILED: ' + str(error), file=sys.stderr)
    raise SystemExit(1)
finally:
    subprocess.run([sys.executable, str(temp / 'cleanup.py'), str(temp)], timeout=30, check=True)
    for p in processes: p.wait(timeout=5)
    for handle in handles: handle.close()
print('ACCEPT-SUBMIT OK')
PY
