#!/usr/bin/env python3
"""在 Bot 直聘（https://bot.jiachengbo.com）的收录库里找 Prompt、Skill 和 Grok Bot。

只用 Python 3.8+ 标准库。

  python3 find.py 周报                      搜全部类型
  python3 find.py 代码 审查 --kind skill     只搜 Skill，多个词用空格分开
  python3 find.py --get prompt/<slug>        看一条的详情（正文、安装命令、导入链接）
  python3 find.py --get prompt/<slug> --original   英文 Prompt 打印英文原文

环境变量 BOT_ZHIPIN_URL 可换站点根地址（本地验收用）。
"""
import argparse
import hashlib
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.request

DEFAULT_BASE = 'https://bot.jiachengbo.com'
BASE = os.environ.get('BOT_ZHIPIN_URL', DEFAULT_BASE).rstrip('/')
CACHE_DIR = os.path.join(os.path.expanduser('~'), '.cache', 'bot-zhipin')
TTL = 24 * 3600
KIND_LABEL = {'prompt': 'Prompt', 'skill': 'Skill', 'bot': 'Grok Bot'}
SLUG = re.compile(r'^[a-z0-9][a-z0-9-]*$')
# 字段分组和权重：名字 > 用途 > 场景/标签/分类/开场白 > 作者。
GROUPS = (
    (5.0, ('title', 'name', 'nameZh', 'titleOriginal')),
    (3.0, ('purpose',)),
    (2.0, ('scenarios', 'tags', 'category', 'starters', 'agents')),
    (1.0, ('author', 'slug')),
)

for stream in (sys.stdout, sys.stderr):
    try:
        stream.reconfigure(encoding='utf-8')
    except (AttributeError, ValueError):
        pass


def fail(message):
    print(message, file=sys.stderr)
    sys.exit(2)


def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'bot-zhipin-skill/1.0', 'Accept': 'application/json'})
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as error:
        if error.code == 404:
            raise LookupError('没有这条（404）：' + url)
        raise ConnectionError('Bot 直聘返回了错误 {}：{}'.format(error.code, url))
    except (urllib.error.URLError, OSError) as error:
        reason = getattr(error, 'reason', error)
        raise ConnectionError('连不上 Bot 直聘（{}）。检查网络后再试，或直接打开 {}/prompts/、{}/skills/ 自己翻。'.format(reason, BASE, BASE))
    except ValueError:
        raise ConnectionError('Bot 直聘返回的不是有效的 JSON：' + url)


def cache_path():
    if BASE == DEFAULT_BASE:
        return os.path.join(CACHE_DIR, 'index.json')
    return os.path.join(CACHE_DIR, 'index-{}.json'.format(hashlib.sha1(BASE.encode('utf-8')).hexdigest()[:10]))


def read_cache(path):
    try:
        with open(path, encoding='utf-8') as handle:
            data = json.load(handle)
        return data if isinstance(data.get('items'), list) else None
    except (OSError, ValueError, AttributeError):
        return None


def load_index(refresh=False):
    path = cache_path()
    cached = read_cache(path)
    fresh = cached is not None and time.time() - os.path.getmtime(path) < TTL
    if fresh and not refresh:
        return cached
    try:
        data = fetch(BASE + '/data/index.json')
        if not isinstance(data, dict) or not isinstance(data.get('items'), list):
            raise ConnectionError('索引格式不对：' + BASE + '/data/index.json')
    except (ConnectionError, LookupError) as error:
        if cached is not None:
            print('{}\n（这次先用本机缓存的旧索引，可能不是最新的）'.format(error), file=sys.stderr)
            return cached
        fail(str(error))
    try:
        os.makedirs(CACHE_DIR, exist_ok=True)
        temp = path + '.tmp'
        with open(temp, 'w', encoding='utf-8') as handle:
            json.dump(data, handle, ensure_ascii=False)
        os.replace(temp, path)
    except OSError:
        pass  # 缓存写不进去不影响这次搜索
    return data


def fold(value):
    if isinstance(value, list):
        return '\n'.join(fold(item) for item in value)
    if not isinstance(value, str):
        return ''
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', value).lower()).strip()


def pieces(term):
    """英文和数字整段算一块；汉字两两一组（单字就是它自己）。"""
    out = []
    for run in re.findall(r'[a-z0-9][a-z0-9.+#-]*|[㐀-鿿豈-﫿]+', term):
        if run[0].isascii() or len(run) < 2:
            out.append(run)
        else:
            out.extend(run[i:i + 2] for i in range(len(run) - 1))
    return out


def score(item, terms, phrase):
    texts = [(weight, '\n'.join(fold(item.get(key)) for key in keys)) for weight, keys in GROUPS]
    total, missed = 0.0, 0
    for term in terms:
        parts = pieces(term)
        best = 0.0
        for weight, text in texts:
            if term in text:
                hit = 1.0
            elif parts:
                ratio = sum(1 for part in parts if part in text) / len(parts)
                hit = ratio * 0.6 if ratio >= 0.5 else 0.0
            else:
                hit = 0.0
            best += weight * hit
        if best == 0:
            missed += 1
        total += best
    if not total:
        return 0.0
    if len(terms) > 1 and phrase in texts[0][1]:
        total += 3.0
    return total * (0.5 ** missed)


def search(args):
    index = load_index(args.refresh)
    terms = [term for term in fold(' '.join(args.words)).replace('，', ' ').replace('、', ' ').split(' ') if term]
    if not terms:
        fail('给几个关键词，比如：python3 find.py 周报')
    phrase = ' '.join(terms)
    items = [item for item in index['items'] if not args.kind or item.get('kind') == args.kind]
    ranked = sorted(((score(item, terms, phrase), order, item) for order, item in enumerate(items)), key=lambda row: (-row[0], row[1]))
    hits = [row for row in ranked if row[0] > 0]
    if hits:
        floor = hits[0][0] * 0.2
        hits = [row for row in hits if row[0] >= floor]
    if not hits:
        print('「{}」没找到{}。换个说法再搜，或者打开 {}/prompts/、{}/skills/、{}/ 自己翻。'.format(
            ' '.join(args.words), ' ' + KIND_LABEL[args.kind] if args.kind else '', BASE, BASE, BASE))
        return
    shown = hits[:args.limit]
    print('「{}」找到 {} 条{}：'.format(' '.join(args.words), len(hits), '，列出前 {} 条'.format(len(shown)) if len(hits) > len(shown) else ''))
    for number, (_, _, item) in enumerate(shown, 1):
        kind = item.get('kind')
        title = item.get('title') or item.get('slug')
        if kind == 'bot' and item.get('name') and item.get('name') != title:
            title = '{}（{}）'.format(title, item['name'])
        elif kind == 'skill' and item.get('name') and item.get('name') != title:
            title = '{}（{}）'.format(title, item['name'])
        extra = [item.get('category'), item.get('author')]
        if kind == 'skill' and item.get('agents'):
            extra.append('/'.join(item['agents']))
        if kind == 'prompt' and item.get('hasBody') is False:
            extra.append('仅摘要')
        if kind == 'prompt' and item.get('lang') == 'en':
            extra.append('英文原文')
        print('{}. [{}] {}/{}  {} · {}'.format(number, KIND_LABEL.get(kind, kind), kind, item.get('slug'), title, ' · '.join(x for x in extra if x)))
        print('   {}  {}'.format(item.get('purpose', ''), item.get('detailUrl', '')))


def parse_target(value):
    value = value.strip().rstrip('/')
    match = re.search(r'(prompt|skill|bot)s?/([^/?#]+?)(?:\.json)?$', value)
    if not match or not SLUG.match(match.group(2)):
        fail('--get 要写成 <类型>/<slug>，比如 prompt/weekly-report；类型是 prompt、skill、bot 之一')
    return match.group(1), match.group(2)


def section(title, body):
    if body:
        print('\n## ' + title)
        print(body.rstrip())


def show_prompt(data, original):
    head = data.get('title', '')
    if data.get('titleOriginal'):
        head += '（{}）'.format(data['titleOriginal'])
    print('# ' + head)
    print('类型：Prompt · {} · 正文语言 {}'.format(data.get('category', ''), data.get('lang', '')))
    print('用途：' + data.get('purpose', ''))
    print('详情页：' + data.get('detailUrl', ''))
    text = data.get('body') if original else data.get('text')
    if text:
        note = ''
        if data.get('bodyZh') and not original:
            note = '（原文是英文，下面是本站译的中文版；要英文原文加 --original）'
        print('\n## 正文{}'.format(note))
        print('----- 正文开始 -----')
        print(text.rstrip('\n'))
        print('----- 正文结束 -----')
    else:
        source = (data.get('source') or {}).get('url') or data.get('detailUrl', '')
        print('\n这条只收了摘要，没有正文，原文在：' + source)
        section('摘要', data.get('summary'))
    section('怎么用', data.get('usage'))
    section('署名', data.get('credit'))


def show_skill(data):
    head = data.get('title', '')
    if data.get('name') and data['name'] != head:
        head += '（{}）'.format(data['name'])
    print('# ' + head)
    print('类型：Skill · {} · 适用：{}'.format(data.get('category', ''), '、'.join(data.get('agents') or []) or '未注明'))
    print('用途：' + data.get('purpose', ''))
    print('详情页：' + data.get('detailUrl', ''))
    section('介绍', data.get('summary'))
    installs = data.get('install') or []
    if installs:
        print('\n## 安装（按你用的工具挑一条）')
        for entry in installs:
            print('- [{}] {}'.format(entry.get('agent') or '通用', entry.get('command', '')))
            if entry.get('note'):
                print('  说明：' + entry['note'])
    if data.get('requires'):
        section('依赖', '\n'.join('- ' + item for item in data['requires']))
    section('署名', data.get('credit'))


def show_bot(data):
    head = data.get('title') or data.get('name', '')
    if data.get('name') and data['name'] != head:
        head += '（{}）'.format(data['name'])
    print('# ' + head)
    print('类型：Grok Bot 模板 · {}'.format(data.get('category', '')))
    print('一句话：' + data.get('tagline', ''))
    print('导入：在 Grok Bot App 里打开这个模板页导入 → ' + data.get('templateUrl', ''))
    print('详情页：' + data.get('detailUrl', ''))
    facts = []
    if data.get('permissions'):
        facts.append('会用到：' + '、'.join(data['permissions']))
    if data.get('quotaCost'):
        facts.append('额度消耗：' + data['quotaCost'])
    cn = data.get('cn') or {}
    if cn.get('fit') or cn.get('note'):
        facts.append('国内好不好用：{}{}'.format(cn.get('fit') or '', '，' + cn['note'] if cn.get('note') else ''))
    if facts:
        print('\n'.join(facts))
    if data.get('starters'):
        section('导入后可以直接发给它', '\n'.join('- ' + line for line in data['starters']))
    section('编辑点评', data.get('editorNote'))
    section('署名', data.get('credit'))


def get(args):
    kind, slug = parse_target(args.get)
    try:
        data = fetch('{}/data/{}s/{}.json'.format(BASE, kind, slug))
    except LookupError as error:
        fail('{}\n先用 python3 find.py <关键词> 搜一下，确认类型和 slug。'.format(error))
    except ConnectionError as error:
        fail(str(error))
    if args.json:
        print(json.dumps(data, ensure_ascii=False, indent=2))
    elif kind == 'prompt':
        show_prompt(data, args.original)
    elif kind == 'skill':
        show_skill(data)
    else:
        show_bot(data)


def main():
    parser = argparse.ArgumentParser(description='在 Bot 直聘的收录库里找 Prompt、Skill 和 Grok Bot')
    parser.add_argument('words', nargs='*', help='关键词，多个用空格分开')
    parser.add_argument('--kind', choices=sorted(KIND_LABEL), help='只搜一种')
    parser.add_argument('--limit', type=int, default=8, help='最多列几条（默认 8）')
    parser.add_argument('--refresh', action='store_true', help='不用缓存，重新拉索引')
    parser.add_argument('--get', metavar='类型/slug', help='看一条的详情，如 prompt/<slug>')
    parser.add_argument('--original', action='store_true', help='配合 --get：英文 Prompt 打印英文原文')
    parser.add_argument('--json', action='store_true', help='配合 --get：原样打印详情 JSON')
    args = parser.parse_args()
    args.limit = max(1, args.limit)
    if args.get:
        get(args)
    else:
        search(args)


if __name__ == '__main__':
    main()
