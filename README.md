# DUI

DUI 是一套 DOORS 风格的 React 组件。库中有按钮、物品栏、设置控件，以及大厅菜单等组合示例。MediaWiki 使用独立的浏览器包。

[组件文档](https://doors-chinese-wiki.github.io/DUI/) · [MediaWiki 安装说明](docs/MEDIAWIKI.md) · [下载组件包](https://doors-chinese-wiki.github.io/DUI/downloads/dui-mediawiki-0.1.2.zip)

## React

使用 Node.js 24。在项目目录执行：

```sh
npm ci
npm run dev
```

打开终端显示的地址。在 `src/App.tsx` 中导入组件。

```tsx
import { Button, Icon } from './components';

<Button leadingIcon={<Icon name="items" size={20} />}>
  打开物品栏
</Button>
```

项目入口 `src/main.tsx` 加载主题和字体。将组件复制到其他 React 项目时，保留 CSS 模块，并在入口加载 `src/styles/global.css`。

## MediaWiki

管理员安装浏览器包后，在词条中用 `data-dui` 指定组件，用 `data-dui-props` 填写 JSON 参数。

```html
<div class="dui-widget" data-dui="button" data-dui-props='{"label":"开始游戏"}'>开始游戏</div>
```

安装、模板和站内素材配置见 [MediaWiki 安装说明](docs/MEDIAWIKI.md)。运行 `npm run pack:mediawiki` 在 `artifacts/` 下生成发行包。

## 开发

组件位于 `src/components`。文档预览和代码标签共用 `src/docs/examples` 下的源文件。新增示例时在 `src/docs/examples/registry.ts` 注册。运行 `npm run storybook` 查看 Storybook。

```sh
npm run check            # 单测、文档生产构建和 Storybook 构建
npm run test:e2e         # 文档浏览器测试，截图基线使用 Windows Chrome
npm run test:mediawiki   # 构建独立包，再测试 Wiki 适配层
npm run build:pages      # 生成 GitHub Pages 站点，输出到 dist/
```

首次运行浏览器测试前，执行 `npx playwright install chrome`。推送到 `main` 后，GitHub Actions 构建并部署文档。部署地址和排错步骤见 [Pages 部署说明](docs/PAGES.md)。

## 素材

发行包附带依赖的许可证。DOORS 美术和标识归原作者所有。项目代码尚未指定开源许可证。字体、音效和图片见 [素材来源](ATTRIBUTION.md)。
