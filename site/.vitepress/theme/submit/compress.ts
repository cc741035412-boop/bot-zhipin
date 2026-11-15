const MAX_BYTES = 2_097_152
const THUMB_BYTES = 30 * 1024

export function planCompression(size: number, type: string): 'none' | 'compress' | 'gif-too-large' {
  if (size <= MAX_BYTES) return 'none'
  return type.toLowerCase() === 'image/gif' ? 'gif-too-large' : 'compress'
}

async function withImage<T>(file: Blob, run: (image: HTMLImageElement) => Promise<T> | T): Promise<T> {
  const url = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => image.naturalWidth && image.naturalHeight ? resolve(image) : reject({ error: 'unsupported_type' })
      image.onerror = () => reject({ error: 'unsupported_type' })
      image.src = url
    })
    return await run(image)
  } finally { URL.revokeObjectURL(url) }
}
function canvasFor(image: HTMLImageElement, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  const context = canvas.getContext('2d')
  if (!context) throw { error: 'unsupported_type' }
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas
}

export async function compressImage(file: File): Promise<File> {
  const plan = planCompression(file.size, file.type)
  if (plan === 'none') return file
  if (plan === 'gif-too-large') throw { error: 'gif-too-large' }
  return withImage(file, async (image) => {
    const scale = Math.min(1, 2560 / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = canvasFor(image, image.naturalWidth * scale, image.naturalHeight * scale)
    for (const quality of [0.9, 0.8, 0.7, 0.6]) {
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
        (value) => value ? resolve(value) : reject({ error: 'unsupported_type' }), 'image/jpeg', quality,
      ))
      if (blob.size <= MAX_BYTES) return new File([blob], file.name.replace(/\.[^.]*$/, '') + '.jpg', { type: 'image/jpeg', lastModified: file.lastModified })
    }
    throw { error: 'too-large' }
  })
}

export async function makeThumb(file: Blob): Promise<string> {
  return withImage(file, (image) => {
    const canvas = canvasFor(image, 320, image.naturalHeight * 320 / image.naturalWidth)
    for (const quality of [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]) {
      const data = canvas.toDataURL('image/jpeg', quality)
      if (data.startsWith('data:image/jpeg;') && data.length <= THUMB_BYTES) return data
    }
    // 极高的长截图可能任何质量都超限；不向 localStorage 写入超过约定的缩略图。
    throw { error: 'thumb-too-large' }
  })
}
