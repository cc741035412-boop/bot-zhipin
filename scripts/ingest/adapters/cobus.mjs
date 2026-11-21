import { readdirSync, readFileSync } from 'node:fs'
import { join, posix } from 'node:path'
import { firstHeading, parseYaml, splitFrontmatter } from '../lib/frontmatter.mjs'
import { githubBlobUrl, makeRecord, shareIdOf } from '../lib/record.mjs'

const AUTHOR = { name: 'Cobus Greyling', url: 'https://github.com/cobusgreyling' }
const PROFILE = /^templates\/(?:[^/]+\/)*PROFILE\.md$/
const SKILL = /^skills\/[^/]+\/SKILL\.md$/
const ROUTINE = /^routines\/[^/]+\/ROUTINE\.md$/
const TEAM = /^teams\/[^/]+\/team\.yaml$/
const PATTERN = /^patterns\/[^/]+\/pattern\.yaml$/
const list = (value) => Array.isArray(value) ? value : []

export function adapt({ root, source }) {
  const records = []
  const dropped = []
  const files = new Map()
  const directories = new Set()
  function walk(dir = '') {
    for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
      if (!dir && entry.name === '.git') continue
      const path = posix.join(dir, entry.name)
      if (entry.isDirectory()) {
        directories.add(path)
        walk(path)
      } else {
        files.set(path, entry)
      }
    }
  }
  walk()
  const paths = [...files.keys()].sort()
  const used = new Set()
  // 不跟随符号链接读取来源以外的文件。
  const read = (path) => {
    if (!files.get(path)?.isFile()) throw new Error(`${path} 不是普通文件`)
    return readFileSync(join(root, path), 'utf8')
  }

  for (const sourcePath of paths) {
    const dir = posix.dirname(sourcePath)
    const adjacent = (name) => posix.join(dir, name)
    const sidecar = (name) => {
      const path = adjacent(name)
      if (!files.has(path)) return ''
      used.add(path)
      return read(path)
    }
    const yaml = (path, text) => {
      try {
        return parseYaml(text)
      } catch (error) {
        throw new Error(`${path} 不是合法 YAML：${error.message}`)
      }
    }

    let fields
    try {
      if (PROFILE.test(sourcePath)) {
        used.add(sourcePath)
        const template = sidecar('template.yaml')
        const readme = sidecar('README.md')
        const setup = sidecar('SETUP.md')
        const { data, body } = splitFrontmatter(read(sourcePath))
        const { tagline } = yaml(adjacent('template.yaml'), template)
        fields = {
          kind: 'profile', title: data.name, body, integrations: data.plugins,
          shareId: shareIdOf(template) ?? shareIdOf(readme) ?? shareIdOf(setup),
          extra: {
            category: data.category, autonomy: data.autonomy, templateId: data.id, tagline,
            hasSetup: files.has(adjacent('SETUP.md')),
            hasExamples: directories.has(adjacent('examples')) || files.has(adjacent('EXAMPLES.md')),
          },
        }
      } else if (SKILL.test(sourcePath) || ROUTINE.test(sourcePath)) {
        used.add(sourcePath)
        const kind = SKILL.test(sourcePath) ? 'skill' : 'routine'
        const name = `${kind}.yaml`
        const data = yaml(adjacent(name), sidecar(name))
        const body = read(sourcePath)
        fields = { kind, title: data.name || firstHeading(body), body }
        if (kind === 'skill' && data.when_to_use !== undefined) fields.extra = { whenToUse: data.when_to_use }
      } else if (TEAM.test(sourcePath) || PATTERN.test(sourcePath)) {
        used.add(sourcePath)
        const body = read(sourcePath)
        const data = yaml(sourcePath, body)
        const isTeam = TEAM.test(sourcePath)
        fields = {
          kind: isTeam ? 'team' : 'recipe',
          title: data.name || data.title || (!isTeam && data.rule) || posix.basename(dir),
          body,
        }
        if (isTeam) {
          // 来源用顶层 plugins 列出团队依赖；也合并内联成员声明的依赖。
          fields.integrations = [
            ...list(data.plugins),
            ...[...list(data.bots), ...list(data.members)].flatMap((member) => list(member?.plugins)),
          ]
        }
      }
      if (fields) {
        records.push(makeRecord({
          ...fields, sourceKey: source.key, sourceRepo: source.repo, sourcePath,
          sourceUrl: githubBlobUrl(source.repo, source.commit, sourcePath),
          author: AUTHOR, license: source.license, fetchedAt: source.fetchedAt,
        }))
      }
    } catch (error) {
      dropped.push({ sourcePath, reason: `解析失败：${error.message}` })
    }
  }
  const unused = files.size - used.size
  if (unused) dropped.push({ sourcePath: '.', reason: '未收录说明文档、示例和其他非入库文件', count: unused })
  return { records, dropped }
}
