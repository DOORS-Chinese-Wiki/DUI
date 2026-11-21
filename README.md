<h1 align="center"><img src="docs/dui-banner.png" alt="DUI" width="100%"></h1>

<p align="center">DOORS 风格的 React 组件库</p>
<p align="center">
  <a href="https://doors-chinese-wiki.github.io/DUI/">组件文档</a> ·
  <a href="https://doors-chinese-wiki.github.io/DUI/#lobby">大厅示例</a> ·
  <a href="docs/MEDIAWIKI.md">MediaWiki 安装</a> ·
  <a href="https://doors-chinese-wiki.github.io/DUI/downloads/dui-mediawiki-0.1.2.zip">下载组件包</a>
</p>

## 本地运行

使用 Node.js 24，在仓库目录执行以下命令。

```sh
npm ci
npm run dev
```

打开终端给出的地址可以查看组件文档。要单独试一个按钮，可以把 `src/App.tsx` 换成下面这段。

```tsx
import { Button, Icon } from './components';

export default function App() {
  return (
    <Button leadingIcon={<Icon name="items" size={20} />}>
      打开物品栏
    </Button>
  );
}
```

复制组件到自己的 React 项目时，把同目录的 CSS 模块一起复制，并在应用入口导入 `src/styles/global.css`。

## 接入 MediaWiki

站点装好 DUI 后，把下面这段粘贴到词条源码里，预览时会看到一格打火机物品栏。

```html
<div class="dui-widget" data-dui="inventory"
     data-dui-props='{"items":[{"id":"lighter","icon":"lighter","file":"File:Icon lighter2.png"}]}'>
  物品栏里有一个打火机。
</div>
```

`file` 填本站文件名，`icon` 是找不到文件时用的图标。Miraheze 和自托管站点的安装步骤见 [MediaWiki 安装说明](docs/MEDIAWIKI.md)。

## 开发

组件在 `src/components/`。文档预览和代码标签读同一份示例。修改示例时编辑 `src/docs/examples/` 里的文件，新增示例时再登记到 `registry.ts`。

| 命令 | 用途 |
| --- | --- |
| `npm run storybook` | 在 Storybook 中查看组件 |
| `npm run check` | 运行单元测试，构建文档和 Storybook |
| `npm run test:e2e` | 运行文档浏览器测试。截图基线使用 Windows Chrome |
| `npm run test:mediawiki` | 构建并测试 MediaWiki 组件包 |
| `npm run pack:mediawiki` | 生成 ZIP 和 TGZ，存入 `artifacts/` |
| `npm run pack:miraheze` | 生成 Developers Wiki 的源码页文件 |
| `npm run build:pages` | 将文档与组件包构建到 `dist/` |

首次运行浏览器测试前，执行 `npx playwright install chrome`。发布配置见 [GitHub Pages 部署说明](docs/PAGES.md)。

## 许可

DUI 的原创代码和文档采用 [CC BY-SA 4.0](LICENSE) 许可。转载时注明出处，分发改编版本时注明修改，并使用相同或兼容的许可。

DOORS 的图标、字体、音效和标识沿用原权利人的使用条款。封面使用了 DOORS 字体的门、背包和奖杯字形。第三方依赖的许可证随发行包附带。[素材来源](docs/ASSETS.md)
