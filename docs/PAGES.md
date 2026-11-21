# GitHub Pages 部署

推送到 `main` 后，仓库中的 `Deploy DUI docs` 工作流会构建文档并发布到：

https://doors-chinese-wiki.github.io/DUI/

首次启用时，在仓库的 Settings → Pages → Build and deployment 中，将 Source 选为 GitHub Actions。之后打开 Actions → Deploy DUI docs，可以查看每次构建的日志；部署成功后，工作流的 deployment 项目会给出站点地址。

## 构建内容

工作流先运行单元测试，构建 MediaWiki 包和文档，再用 Chrome 检查独立包。构建通过后才部署 `dist/`。

| 地址 | 内容 |
| --- | --- |
| `/DUI/` | 交互式组件文档 |
| `/DUI/mediawiki/` | 独立包的接入验证页与 JS/CSS/素材 |
| `/DUI/downloads/dui-mediawiki-0.1.2.zip` | MediaWiki ZIP 包 |

文档的基础路径是 `/DUI/`。`src/main.tsx` 用这个路径解析图片和声音，构建后的 CSS 也会使用对应路径。Wiki 独立包则通过 `DUIConfig.baseUrl` 指定自己的部署目录。

## 本地检查

```sh
npm ci
npm run build:pages
npm run preview -- --host 127.0.0.1 --base /DUI/
```

打开终端地址下的 `/DUI/`，检查物品图标、背景、字体和下载链接。访问 `/DUI/mediawiki/`，可以在白色页面中检查组件样式是否影响外部内容。

只有生成的 `dist/` 会上传到 Pages，源码留在 Git 仓库。`dist-mediawiki/` 和 `artifacts/` 由构建生成，不提交到仓库。

## 构建失败时

依赖安装失败，先确认仓库中的 `package-lock.json` 与 `package.json` 同步；本地使用 `npm ci` 重现。资源出现 404 时，检查访问地址是否带 `/DUI/`，以及 Pages 是否部署了当前提交。部署权限错误时，检查 Pages 发布来源和工作流中的 `pages: write`、`id-token: write` 权限。

项目改用其他仓库名或自定义域名后，需要调整 `DUI_BASE_PATH`、README 中的站点地址和 Wiki 安装地址。
