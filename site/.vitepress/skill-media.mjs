import { lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { imageSizeFromFile } from 'image-size/fromFile'
import { SKILLS_DIR } from '../../scripts/lib/load-prompts-skills.mjs'
import { schema } from '../../scripts/lib/validate/generated/skill-schema.mjs'

const prefix = '/media/skills/'
const directory = join(SKILLS_DIR, 'media')
const valid = new RegExp(schema.properties.examples.items.properties.images.items.properties.file.pattern)
const stat = path => lstatSync(path, { throwIfNoEntry: false })
const mediaDir = () => stat(SKILLS_DIR)?.isDirectory() && stat(directory)?.isDirectory()
function imagePath(name) {
  if (!valid.test(name) || !mediaDir()) return null
  const path = join(directory, name)
  return stat(path)?.isFile() ? path : null
}
export async function sizeExamples(skill) {
  for (const example of skill.examples ?? []) for (const image of example.images ?? []) {
    const path = imagePath(image.file)
    if (!path) throw Error(`skills/${skill.slug}.yaml: 找不到 media/${image.file}`)
    const { width, height } = await imageSizeFromFile(path)
    Object.assign(image, { width, height })
  }
  return skill
}
// Dev serves only its own media. Never stage fixture assets in shared site/public.
export function skillMedia() {
  let ssr = false
  return {
    name: 'skill-example-media',
    configResolved(config) { ssr = Boolean(config.build.ssr) },
    configureServer(server) {
      server.middlewares.use(prefix, (req, res, next) => {
        const path = imagePath(req.url.slice(1).split('?')[0])
        if (!path) return next()
        res.setHeader('Content-Type', 'image/' + path.split('.').at(-1).replace('jpg', 'jpeg'))
        res.end(readFileSync(path))
      })
    },
    generateBundle() {
      if (ssr || !mediaDir()) return
      for (const name of readdirSync(directory)) {
        const path = imagePath(name)
        if (path) this.emitFile({ type: 'asset', fileName: prefix.slice(1) + name, source: readFileSync(path) })
      }
    },
  }
}
