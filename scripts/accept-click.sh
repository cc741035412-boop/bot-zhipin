#!/usr/bin/env bash
# 真 HTTP + 本地 D1 验收；所有构建产物、变量、数据库和日志均在临时副本。
# 用法：PORT=8795 INSPECTOR_PORT=9335 bash scripts/accept-click.sh
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
T="$(mktemp -d)"
python3 - "$ROOT" "$T" "${PORT:-8790}" "${INSPECTOR_PORT:-9330}" <<'PY'
import json
import os
from pathlib import Path
import re
import secrets
import shutil
import signal
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request

root, temporary = map(Path, sys.argv[1:3])
port, inspector = map(int, sys.argv[3:5])
work = temporary / 'work'
server = None
server_log = None
success = False
base = f'http://127.0.0.1:{port}'
# Never send local requests through a configured HTTP proxy.
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
environment = {name: os.environ[name] for name in os.environ
               if not name.startswith(('CLOUDFLARE_', 'CF_API_')) and name not in ('IP_SALT', 'ALLOW_TEST_IP')}
environment.update(BOTS_DIR='tests/fixtures/bots', SQUADS_DIR='tests/fixtures/squads',
                   CURATION_FILE='tests/fixtures/curation/shelf.yaml', WRANGLER_SEND_METRICS='false',
                   WRANGLER_LOG_PATH=str(temporary / 'wrangler.log'), CI='1')


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def run(command, log_name, timeout=120, capture=False):
    with (temporary / log_name).open('w') as log:
        result = subprocess.run(command, cwd=work, env=environment, stdin=subprocess.DEVNULL,
                                stdout=subprocess.PIPE if capture else log, stderr=log,
                                text=True, timeout=timeout)
    require(result.returncode == 0, f'{log_name} 对应命令失败')
    return result.stdout


def listening(number):
    try:
        with socket.create_connection(('127.0.0.1', number), timeout=0.2):
            return True
    except OSError:
        return False


def group_members():
    # Only consider the process group created by this script, never match by name.
    result = subprocess.run(['ps', '-ww', '-axo', 'pid=,pgid=,command='],
                            capture_output=True, text=True, timeout=5, check=True)
    members = []
    for line in result.stdout.splitlines():
        fields = line.strip().split(None, 2)
        if len(fields) == 3 and int(fields[1]) == server.pid:
            members.append((int(fields[0]), fields[2]))
    return members


def signal_group(sig):
    members = group_members()
    if not members:
        return
    # Recheck each recorded PID's command and group immediately before signalling.
    for pid, command in members:
        result = subprocess.run(['ps', '-ww', '-o', 'command=', '-p', str(pid)],
                                capture_output=True, text=True, timeout=5)
        if not result.stdout.strip():
            continue
        require(result.stdout.strip() == command, '进程身份发生变化，拒绝清理')
        try:
            require(os.getpgid(pid) == server.pid, '进程组发生变化，拒绝清理')
        except ProcessLookupError:
            continue
    try:
        os.killpg(server.pid, sig)
    except ProcessLookupError:
        pass


def cleanup():
    if server is None:
        return
    signal_group(signal.SIGTERM)
    deadline = time.monotonic() + 5
    while time.monotonic() < deadline:
        server.poll()
        if not group_members():
            break
        time.sleep(0.1)
    signal_group(signal.SIGKILL)
    server.wait(timeout=5)
    require(not listening(port) and not listening(inspector), '验收端口仍有监听进程')


def interrupted(_signum, _frame):
    raise RuntimeError('验收中断')


for sig in (signal.SIGTERM, signal.SIGINT):
    signal.signal(sig, interrupted)


def request(path, method='GET', body=None, test_ip=None):
    headers = {'Content-Type': 'application/json'}
    if test_ip is not None:
        headers['X-Test-IP'] = test_ip
    data = body.encode('utf8') if isinstance(body, str) else None
    if body is not None and not isinstance(body, str):
        data = json.dumps(body).encode('utf8')
    req = urllib.request.Request(base + path, data=data, headers=headers, method=method)
    try:
        response = opener.open(req, timeout=5)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        require(response.headers.get('Cache-Control') == 'no-store', '缺少 no-store')
        require(response.headers.get('Content-Type') == 'application/json; charset=utf-8', 'JSON Content-Type 不正确')
        payload = json.loads(response.read()) if method != 'HEAD' else None
        return response.status, payload, response.headers


def click(address, slug, kind, counted, heat):
    status, payload, _ = request('/api/click', 'POST', {'slug': slug, 'kind': kind}, address)
    require(status == 200 and payload == {'ok': True, 'counted': counted, 'heat': heat}, '点击计数不符合预期')


try:
    require(1 <= port <= 65535 and 1 <= inspector <= 65535 and port != inspector, '端口配置无效')
    require(not listening(port) and not listening(inspector), '验收端口已被占用，未启动或清理任何已有进程')
    work.mkdir()
    for name in ('functions', 'migrations', 'scripts', 'site', 'schema', 'bots', 'integrations', 'tests/fixtures'):
        shutil.copytree(root / name, work / name,
                        ignore=shutil.ignore_patterns('dist', 'cache', 'bot-assets', 'api-data', '__pycache__'))
    for name in ('package.json', 'package-lock.json', 'wrangler.toml'):
        shutil.copy2(root / name, work / name)
    (work / 'node_modules').symlink_to(root / 'node_modules', target_is_directory=True)
    # Generate a disposable salt; never read/copy the developer's .dev.vars or print it.
    (work / '.dev.vars').write_text('IP_SALT=' + secrets.token_hex(32) + '\nALLOW_TEST_IP=1\n')
    (work / '.dev.vars').chmod(0o600)
    run(['npm', 'run', 'build'], 'build.log')
    run(['npx', '--no-install', 'wrangler', 'd1', 'migrations', 'apply', 'DB', '--local'], 'migrate.log')
    server_log = (temporary / 'dev.log').open('w')
    server = subprocess.Popen(['npx', '--no-install', 'wrangler', 'pages', 'dev', '--ip', '127.0.0.1',
                               '--port', str(port), '--inspector-port', str(inspector)],
                              cwd=work, env=environment, stdin=subprocess.DEVNULL,
                              stdout=server_log, stderr=subprocess.STDOUT, start_new_session=True)
    deadline = time.monotonic() + 90
    ready = False
    while time.monotonic() < deadline:
        require(server.poll() is None, 'wrangler 提前退出')
        try:
            with opener.open(base + '/', timeout=1) as response:
                ready = response.status == 200
            if ready:
                break
        except (OSError, urllib.error.URLError):
            time.sleep(0.2)
    require(ready, 'wrangler 未在 90 秒内就绪')

    slug = 'demo-prd-reviewer'
    click('10.0.0.1', slug, 'import', True, 1)
    click('10.0.0.1', slug, 'import', False, 1)
    click('10.0.0.1', slug, 'prompt', False, 1)
    click('10.0.0.2', slug, 'prompt', True, 2)
    click('10.0.0.1', 'demo-weekly-digest', 'prompt', True, 1)
    click('10.0.0.3', 'demo-external', 'import', True, 1)
    # Header probe is a duplicate click; it must not add a fifth dedupe row.
    click('10.0.0.1', slug, 'import', False, 2)
    squad = 'demo-squad'
    click('10.0.0.1', slug, 'starter', True, 2)
    click('10.0.0.1', slug, 'starter', False, 2)
    click('10.0.0.1', squad, 'kickoff', True, 0)
    click('10.0.0.1', squad, 'kickoff', False, 0)
    for body, expected_status, error in [
        ({'slug': squad, 'kind': 'starter'}, 404, 'unknown_slug'),
        ({'slug': squad, 'kind': 'import'}, 404, 'unknown_slug'),
        ({'slug': slug, 'kind': 'kickoff'}, 404, 'unknown_slug'),
        ({'slug': 'no-such-bot', 'kind': 'import'}, 404, 'unknown_slug'),
        ('not json', 400, 'bad_request'),
        ({'slug': slug, 'kind': 'like'}, 400, 'bad_request'),
        ({'slug': '../etc', 'kind': 'import'}, 400, 'bad_request'),
        ({'slug': slug, 'kind': 'import', 'x': 'a' * 3000}, 400, 'bad_request'),
    ]:
        status, payload, _ = request('/api/click', 'POST', body)
        require(status == expected_status and payload == {'ok': False, 'error': error}, '错误响应不符合约定')
    for path, allow, methods in [('/api/click', 'POST', ('GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD')),
                                 ('/api/stats', 'GET', ('POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'))]:
        for method in methods:
            status, payload, headers = request(path, method)
            require(status == 405 and headers.get('Allow') == allow, '405 或 Allow 不正确')
            if method != 'HEAD':
                require(payload == {'ok': False, 'error': 'method_not_allowed'}, '405 body 不正确')
    status, payload, _ = request('/api/stats')
    require(status == 200 and payload == {
        'ok': True,
        'heat': {slug: 2, 'demo-weekly-digest': 1, 'demo-external': 1},
        'byKind': {slug: {'import': 1, 'prompt': 1, 'starter': 1},
                   'demo-weekly-digest': {'import': 0, 'prompt': 1, 'starter': 0},
                   'demo-external': {'import': 1, 'prompt': 0, 'starter': 0}},
        'squads': {squad: {'kickoff': 1}},
    }, 'stats 聚合不正确')
    rows_text = run(['npx', '--no-install', 'wrangler', 'd1', 'execute', 'DB', '--local', '--json',
                     '--command', 'SELECT * FROM click_dedupe'], 'inspect.log', capture=True)
    # Do not echo query results, even on failure.
    require('10.0.0.' not in rows_text, '数据库出现原始 IP')
    rows = json.loads(rows_text)[0]['results']
    require(len(rows) == 6, 'click_dedupe 应有 6 行')
    require(all(re.fullmatch('[0-9a-f]{64}', row['ip_hash']) for row in rows), '哈希格式错误')
    print('HTTP 点击、校验、方法、响应头、stats：通过')
    print('本地 D1：6 条去重记录，均为 HMAC 哈希，无原始 IP')
    success = True
except Exception as error:
    # Our messages contain no request bodies, addresses, salt or database values.
    print(f'FAIL: {error}（日志在 {temporary}）', file=sys.stderr)
finally:
    try:
        cleanup()
    except Exception as error:
        success = False
        print(f'FAIL: 清理失败：{error}（日志在 {temporary}）', file=sys.stderr)
    if server_log:
        server_log.close()
    # A failed run retains diagnostic logs, but not its disposable secret.
    (work / '.dev.vars').unlink(missing_ok=True)
    if success:
        shutil.rmtree(temporary)

if not success:
    sys.exit(1)
print('ACCEPT-CLICK OK')
PY
