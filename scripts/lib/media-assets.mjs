import { copyFileSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { imageSize } from 'image-size'
import { schema } from './validate/generated/prompt-schema.mjs'

const filename = new RegExp(schema.properties.images.items.properties.file.pattern)
const stat = path => lstatSync(path, { throwIfNoEntry: false })
function mediaDirectory(dir) {
  return stat(dir)?.isDirectory() && stat(join(dir, 'media'))?.isDirectory()
}
function regularImage(dir, file) {
  return typeof file === 'string' && filename.test(file) && stat(join(dir, 'media', file))?.isFile()
}

export function measureImage(dir, file) {
  if (!mediaDirectory(dir) || !regularImage(dir, file)) return null
  try {
    const { width, height, type } = imageSize(readFileSync(join(dir, 'media', file)))
    return width > 0 && height > 0 && file.endsWith('.' + type) ? { width, height } : null
  } catch { return null } // 文件头损坏：由校验器报到具体图片。
}

// dir 与 dest 都由当前库决定；清掉上次（可能来自样例站）的文件，不跟随符号链接。
export function syncMedia(dir, dest) {
  rmSync(dest, { recursive: true, force: true })
  if (!mediaDirectory(dir)) return
  for (const file of readdirSync(join(dir, 'media'))) {
    if (!regularImage(dir, file)) continue
    mkdirSync(dest, { recursive: true })
    copyFileSync(join(dir, 'media', file), join(dest, file))
  }
}
