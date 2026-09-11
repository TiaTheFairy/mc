# FairyLand Minecraft 官网（React 版）

原 Vue 2 + Element UI 项目的 React 19 翻写版本，技术栈：**React 19 + Vite 7 + Tailwind CSS 4 + DaisyUI 5 + react-router 7**。

## 常用命令

```bash
npm install        # 安装依赖
npm run dev        # 本地开发（热更新）
npm run build      # 构建
npm run build:pages  # 构建 + 生成 404.html（GitHub Pages 部署用这个）
npm run preview    # 本地预览构建结果
```

## 热修改数据（无需重新构建）

所有可编辑数据都放在 `public/data/*.jsonc`，支持 `//` 注释。**部署后直接修改服务器上的 `dist/data/` 下对应文件并刷新页面即可生效**（页面每次刷新都会重新拉取，不带缓存）。

| 文件 | 内容 |
| --- | --- |
| `public/data/config.jsonc` | 服务器地址、QQ 群号、加群链接、全部超链接（百科/地图/NameMC/Minecraft/个人主页/Bilibili/赞助等） |
| `public/data/rule.jsonc` | 服务器守则 |
| `public/data/announcement.jsonc` | 免责声明 |
| `public/data/history.jsonc` | 处罚名单 |

## 部署到 GitHub Pages

1. 把本文件夹作为独立仓库推送到 GitHub（内置 `.github/workflows/deploy.yml`，push 到 main 自动构建发布）。
2. **关于跳转到 ttfl.net 的问题**：原 Vue 项目 `public/CNAME` 的内容是 `ttfl.net`，GitHub Pages 检测到 CNAME 文件后会把 `tiathefairy.github.io/root` 的所有访问 301 重定向到 `https://ttfl.net/`（即个人主页），这就是"访问时跳转到 ttfl.net"的原因。本项目 CNAME 已改为 `p.mc.ttfl.net`。
3. 若要使用 `p.mc.ttfl.net` 域名，需在 DNS 服务商处添加一条 CNAME 记录：`p` → `TiaTheFairy.github.io`，然后在仓库 Settings → Pages 中确认自定义域名生效。同理，服务器地图已指向 `map.mc.ttfl.net`（见 `public/data/config.jsonc`），如尚未解析需另加一条 `map` 的 CNAME 记录。

## 与原版的差异

- Header 移除了「项目」下拉（Tia Dos / Tia Mini / 暨小园 / 旧版官网）与「首页」「Coding」，仅保留 地图、文档、相关链接（NameMC / Minecraft），并新增「个人主页」入口（https://ttfl.net）。
- 点击 Logo 回到首页。
- 修正了原项目中 NameMC 链接的拼写错误（`namemc.come` → `namemc.com`）。
- 所有文案数据改为运行时加载的 jsonc，便于热修改。
