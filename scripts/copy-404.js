// 构建后把 dist/index.html 复制为 dist/404.html，
// 这样 GitHub Pages 上直接访问 /rule 等路径刷新时也能正常加载 SPA。
import { copyFileSync, existsSync } from 'fs'

if (existsSync('dist/index.html')) {
  copyFileSync('dist/index.html', 'dist/404.html')
  console.log('dist/404.html 已生成')
} else {
  console.error('未找到 dist/index.html，请先执行 vite build')
  process.exit(1)
}
