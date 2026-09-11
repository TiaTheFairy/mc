// 将 Minecraft 的 § 格式代码转换为 HTML
const COLORS = {
  0: '#000000',
  1: '#0000AA',
  2: '#00AA00',
  3: '#00AAAA',
  4: '#AA0000',
  5: '#AA00AA',
  6: '#FFAA00',
  7: '#AAAAAA',
  8: '#555555',
  9: '#5555FF',
  a: '#55FF55',
  b: '#55FFFF',
  c: '#FF5555',
  d: '#FF55FF',
  e: '#FFFF55',
  f: '#FFFFFF',
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function motdToHtml(description = '') {
  return String(description)
    .split('\n')
    .map((line) => {
      let html = ''
      let color = null
      let formats = []
      let lastIndex = 0
      const regex = /§([0-9a-fk-or])/gi
      let match

      const pushText = (text) => {
        if (!text) return
        const style = `color:${color ?? 'inherit'}`
        const cls = formats.join(' ')
        html += `<span style="${style}" class="${cls}">${escapeHtml(text)}</span>`
      }

      while ((match = regex.exec(line))) {
        pushText(line.slice(lastIndex, match.index))
        lastIndex = regex.lastIndex
        const code = match[1].toLowerCase()
        if (code === 'r') {
          color = null
          formats = []
        } else if (code in COLORS) {
          color = COLORS[code]
          formats = []
        } else if (code === 'l') {
          formats.push('font-bold')
        } else if (code === 'o') {
          formats.push('italic')
        } else if (code === 'n') {
          formats.push('underline')
        } else if (code === 'm') {
          formats.push('line-through')
        }
        // §k 随机字符效果不做处理
      }
      pushText(line.slice(lastIndex))
      return html || '&nbsp;'
    })
    .join('<br/>')
}
