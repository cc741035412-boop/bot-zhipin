// WHATWG URL 在 Node 与 Workers 中都能规范化 IPv6（含 ::、大小写和嵌入 IPv4）。
// 不存完整 IPv6：同一 /64 的临时地址共享去重桶；映射 IPv4 与原 IPv4 共桶。
export function normalizeIp(ip: string): string {
  if (!ip.includes(':')) return ip
  if (!/^[0-9a-f:.]+$/i.test(ip)) return '0.0.0.0'
  try {
    const host = new URL(`http://[${ip}]/`).hostname.slice(1, -1)
    const halves = host.split('::')
    const left = halves[0] ? halves[0].split(':') : []
    const right = halves[1] ? halves[1].split(':') : []
    const words = (halves.length === 2
      ? [...left, ...Array(8 - left.length - right.length).fill('0'), ...right]
      : left).map((word) => parseInt(word, 16))
    if (words.length !== 8) return '0.0.0.0'
    if (words.slice(0, 5).every((word) => word === 0) && words[5] === 0xffff) {
      return [words[6] >> 8, words[6] & 255, words[7] >> 8, words[7] & 255].join('.')
    }
    return words.slice(0, 4).map((word) => word.toString(16).padStart(4, '0')).join(':') + '::/64'
  } catch {
    // CF 头正常不会出现非法 IP；本地测试头也不能用非法 IPv6 制造任意去重桶。
    return '0.0.0.0'
  }
}
