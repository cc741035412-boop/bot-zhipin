import { sourceKey } from './records.mjs'
import { textKey } from './textkey.mjs'

// 先收齐同组指纹，再逐字段剔除；择源、许可回溯和排查导出共用同一批干净记录。
export function stripSharePageText(records) {
  const keysByShare = new Map(), sharePageText = {}
  for (const { shareId, extra: { officialKey } } of records) {
    if (!shareId || !officialKey) continue
    if (!keysByShare.has(shareId)) keysByShare.set(shareId, new Set())
    keysByShare.get(shareId).add(officialKey)
  }
  const cleaned = records.map(r => {
    const keys = keysByShare.get(r.shareId), source = sourceKey(r)
    let extra = r.extra
    if (keys) {
      const fields = ['summary']
      if (source === 'grokbotdev') fields.push('tagline')
      if (source === 'botdirectory') fields.push('description')
      for (const field of fields) {
        if (!keys.has(textKey(extra[field]))) continue
        if (extra === r.extra) extra = { ...extra }
        delete extra[field]
      }
    }
    // 按记录计数，同一条的多个命中字段和适配器已扣下的摘要不重复计数。
    if (extra !== r.extra || extra.summaryDropped === 'x.ai 分享页原文') {
      sharePageText[source] = (sharePageText[source] ?? 0) + 1
    }
    return extra === r.extra ? r : { ...r, extra }
  })
  return { records: cleaned, sharePageText }
}
