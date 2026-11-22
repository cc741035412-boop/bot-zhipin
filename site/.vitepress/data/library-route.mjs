// VitePress 把动态参数嵌入 SFC；只传当前条目，避免原文被当作标签。
export function libraryPath(item) {
  return { params: { slug: item.slug, entryJson: JSON.stringify(item).replaceAll('<', '\\u003c') } }
}
