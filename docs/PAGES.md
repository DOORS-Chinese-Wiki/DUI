# GitHub Pages 部署

在仓库的 **Settings → Pages → Build and deployment** 中，把 Source 设为 **GitHub Actions**。推送到 `main` 会触发 `Deploy DUI docs`，构建日志和发布结果都在仓库的 Actions 页面。

站点地址是 <https://doors-chinese-wiki.github.io/DUI/>。

## 构建内容

工作流运行单元测试，构建站点和 MediaWiki 包，再用 Chrome 测试 MediaWiki 包。全部通过后发布 `dist/`。

| 地址 | 内容 |
| --- | --- |
| `/DUI/` | 交互式组件文档 |
| `/DUI/mediawiki/` | MediaWiki 验证页、脚本、样式和素材 |
| `/DUI/downloads/dui-mediawiki-0.1.2.zip` | MediaWiki ZIP 包 |

文档的基础路径是 `/DUI/`。MediaWiki 包的资源路径由站点脚本里的 `DUIConfig.baseUrl` 指定。

## 本地检查

```sh
npm ci
npm run build:pages
npm run preview -- --host 127.0.0.1 --base /DUI/
```

打开终端地址下的 `/DUI/`，检查图标、背景、字体和下载链接。再打开 `/DUI/mediawiki/`，检查组件外的文字和按钮是否维持原样。

`dist/`、`dist-mediawiki/` 和 `artifacts/` 都由构建生成。仓库只提交源码。

## 构建失败时

- `npm ci` 失败时，检查 `package-lock.json` 和 `package.json` 是否同步。
- 静态资源返回 404 时，检查地址是否以 `/DUI/` 开头，再看 Pages 是否部署了当前提交。
- 部署报权限错误时，检查 Pages 的发布来源，以及部署任务的 `pages: write` 和 `id-token: write` 权限。

改仓库名或换域名时，按新地址更新 `DUI_BASE_PATH`、README 链接和 MediaWiki 安装地址。
