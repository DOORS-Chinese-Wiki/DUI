# DUI

DUI 是一套 DOORS 风格的网页组件。按钮、物品栏和设置控件用 React 编写，也可以打成独立的 JS/CSS 包，嵌入 MediaWiki 页面。

[组件文档](https://doors-chinese-wiki.github.io/DUI/) · [MediaWiki 安装说明](docs/MEDIAWIKI.md) · [下载组件包](https://doors-chinese-wiki.github.io/DUI/downloads/dui-mediawiki-0.1.2.zip)

文档里的预览可以直接操作。切到代码页看到的 TSX 和 CSS，就是该预览使用的文件。

## 本地运行

使用 Node.js 24。在项目目录执行：

```sh
npm ci
npm run dev
```

打开终端给出的地址。单独查看 Storybook 时运行 `npm run storybook`。

组件源码在 `src/components`，文档示例在 `src/docs/examples`。React 项目可以从源码引入：

```tsx
import { Button, Icon } from './components';

<Button leadingIcon={<Icon name="items" size={20} />}>
  打开物品栏
</Button>
```

项目入口 `src/main.tsx` 已加载主题和字体。复制组件到其他项目时，还需要保留 CSS 模块，并加载 `src/styles/global.css`。

## 放进 MediaWiki

运行 `npm run pack:mediawiki`，生成的 ZIP 在 `artifacts/`。包内含组件脚本、样式、字体、图标，以及 Common.js / Gadget 引导脚本。Wiki 页面通过 `data-dui` 和 JSON 参数配置组件：

```html
<div class="dui-widget" data-dui="button" data-dui-props='{"label":"开始游戏"}'>开始游戏</div>
```

站点管理员先安装脚本，页面中的组件才会生效。[安装说明](docs/MEDIAWIKI.md) 包含可直接复制的配置、Wiki 模板和组合面板例子。

## 组件

已有按钮、图标、大厅菜单、滑动条、开关、搜索框、按键提示、面板和标签页。物品栏支持大小槽位、圆形槽位、数量和资源条；悬停时放大并推开旁边的物品。商店卡、货币展示、成就卡和弹窗可与这些控件组合使用。

文档还列出了文字、间距、网格和布局组件的参数。新增示例时，把文件注册到 `src/docs/examples/registry.ts`，预览与代码页会使用同一份源码。

## 检查和构建

```sh
npm run check            # 单测、文档生产构建和 Storybook 构建
npm run test:e2e         # 文档浏览器测试，截图基线使用 Windows Chrome
npm run test:mediawiki   # 构建独立包，再测试 Wiki 适配层
npm run build:pages      # 生成 GitHub Pages 站点，输出到 dist/
```

首次运行浏览器测试前，执行 `npx playwright install chrome`。GitHub Pages 由 `.github/workflows/pages.yml` 构建，推送到 `main` 后更新；仓库的 Pages 发布来源使用 GitHub Actions。部署目录和排错步骤见 [Pages 部署说明](docs/PAGES.md)。

## 素材

DOORS 字体、声音与图片的来源列在 [ATTRIBUTION.md](ATTRIBUTION.md)，发行包附带所用依赖的许可证。代码尚未指定开源许可证；DOORS 的美术和标识仍归原作者所有。
