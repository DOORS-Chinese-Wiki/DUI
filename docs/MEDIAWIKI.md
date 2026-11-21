# MediaWiki 安装说明

站点管理员在 `MediaWiki:Common.js` 安装 DUI。站点已装好 DUI 时，直接看[词条里的写法](#词条里怎么写)。

## Miraheze 安装

Developers Wiki 上的三个源码页发布后，把下面这行加到本站的 `MediaWiki:Common.js`。先用自己的账号试装时，把它加到 `Special:MyPage/common.js`。

```js
mw.loader.load('https://dev.miraheze.org/w/index.php?title=User:Yatmt/DUI.js&action=raw&ctype=text/javascript');
```

打开本站含 DUI 组件的页面。占位文字换成按钮或物品栏，就说明组件已加载。在 Developers Wiki 上可以打开 `DUI/Demo` 测试。

### 发布源码页

在项目目录运行 `npm ci` 和 `npm run pack:miraheze`。从生成的 `artifacts/dui-miraheze-submission-<版本>/` 复制文件内容，按表里的顺序发布到 `dev.miraheze.org`。

| 文件 | Developers Wiki 页面 |
| --- | --- |
| `DUI-runtime.js` | `User:Yatmt/DUI-runtime.js` |
| `DUI.css` | `User:Yatmt/DUI.css` |
| `DUI.js` | `User:Yatmt/DUI.js` |

发布介绍和示例时，把 `DUI.mw` 存到 `DUI`，把 `DUI-Demo.mw` 存到 `DUI/Demo`。脚本和样式由 Developers Wiki 提供，图标和音效默认从 WikiTide 读取。

### 字体

标题和物品栏角标使用 DOORS Remake。发布 `DUI.css` 后，浏览器会从 WikiTide 读取字体。[DOORS Remake 字体文件](https://static.wikitide.net/stackdwiki/0/0c/DOORSRemake-Regular.woff2)

要使用 Oswald、Rubik 和 Inconsolata，在使用 DUI 的站点打开 ManageWiki，在 CSP 服务列表中启用 **Google Fonts**。字体加载失败时，浏览器会接着使用样式表里列出的后备字体。

## 静态部署

站点允许从 GitHub Pages 加载脚本和样式时，可以直接使用下文的 `baseUrl`。自行托管时，下载 ZIP 或在项目目录打包。

```sh
npm ci
npm run pack:mediawiki
```

上传整个 `dist-mediawiki/`，或解压 `artifacts/dui-mediawiki-<版本>.zip` 后上传里面的 `dui-mediawiki/`。保留子目录，打开部署地址下的 `index.html` 检查图标和字体。`artifacts/dui-mediawiki-<版本>.tgz` 是 npm 本地包，用 `npm install /绝对路径/文件.tgz` 安装。

### Common.js

在 `MediaWiki:Common.js` 加上这段配置，把 `baseUrl` 改成包的部署地址。接着粘贴发行包中 `integration/bootstrap.js` 的内容。

```js
window.DUIConfig = {
  baseUrl: 'https://doors-chinese-wiki.github.io/DUI/mediawiki/',
  sound: false, // 改为 true 可开启交互音效
  volume: 0.42
};
// 在这里接上 integration/bootstrap.js 的内容。
```

引导脚本会加载同一目录下的 `dui.css` 和 `dui.js`。自托管时，把样式、脚本和素材域名加入站点的 CSP。用另一个域名托管字体时，字体服务器还要允许跨域读取。

### Gadget（已安装 Gadgets 扩展时）

把上面的配置和 `integration/bootstrap.js` 一起存到 `MediaWiki:Gadget-DUI.js`。在 `MediaWiki:Gadgets-definition` 加入这一行。

```text
* DUI[ResourceLoader|default]|DUI.js
```

在 `MediaWiki:Gadget-DUI` 填写小工具说明。要让用户在参数设置里自行开启，删掉定义里的 `|default`。Gadget 仍从 `baseUrl` 读取组件包。

## 词条里怎么写

在词条的源码编辑器里粘贴下面的物品栏。`data-dui` 写组件名，`data-dui-props` 写 JSON 参数。预览页面就能看到打火机、骷髅钥匙和指南针三个槽位。

```html
<div class="dui-widget" data-dui="inventory"
  data-dui-props='{"label":"随身物品栏","defaultValue":null,"items":[{"id":"lighter","icon":"lighter","label":"打火机","charge":0.8},{"id":"key","icon":"skeletonKey","label":"骷髅钥匙","count":1,"size":"sm"},{"id":"compass","icon":"compass","label":"指南针","size":"sm","shape":"circle"}]}'>
  随身物品包括打火机、骷髅钥匙和指南针。
</div>
```

脚本加载前，读者会看到 `<div>` 里的文字。外层属性值用单引号括起来，JSON 字符串用双引号。值里本来就有单引号时，在词条源码里写成 `&#39;`。

### 可选模板

经常在词条里用 DUI 的站点可以建一个 `Template:DUI`。静态包用 `integration/Template-DUI.wikitext`，Miraheze 投稿包用 `Template-DUI.mw`。建好模板后，词条里可以这样放按钮。

```wikitext
{{DUI
|组件=button
|参数={"label":"开始游戏","action":"host-game"}
|后备文字=开始游戏
}}
```

模板把 `|` 当成参数分隔符。JSON 的文字里要显示竖线时，在模板参数中写 `{{!}}`。

### 组合面板

要把滑块和开关放进同一个面板，把它们写进面板的 JSON `children`。这里可以填文字、一个组件对象，或由它们组成的数组。每个组件对象用 `component` 指定类型，用 `props` 传参数，也可以继续写 `children`。

```html
<div class="dui-widget" data-dui="panel"
  data-dui-props='{"title":"设置","children":[{"component":"slider","props":{"label":"大厅音乐","defaultValue":20}},{"component":"switch","props":{"label":"减小动作幅度","defaultChecked":true}}]}'>
  大厅音乐设为 20，已开启减小动作幅度。
</div>
```

物品栏、大厅、弹窗和成就还有几组例子，见静态包的 `integration/examples.wikitext`。

## 使用 Wiki 文件

要给物品栏里的打火机换一张图，把 Wiki 文件名填进 `file`。下面的写法保留了 `icon: "lighter"`，站内文件找不到时还能显示默认图片。

```wikitext
{{DUI|组件=inventory
|参数={"items":[{"id":"lighter","icon":"lighter","file":"File:Icon lighter2.png","label":"打火机"}]}
|后备文字=物品栏里有一只打火机
}}
```

`icon`、`item-slot` 和物品栏里的每个物品都支持 `file`。图标默认可以随文字着色。要显示原图的颜色，在 `icon` 组件上设 `"mask": false`。

一组组件要一起换图，可以给模板加 `素材={"icons/settings.svg":"File:Settings icon.svg"}`。直接写 HTML 时，把同一份 JSON 放进 `data-dui-assets`。脚本调用 `DUI.mount` 时，把 `assets` 和 `props` 放在同一级。这几种写法都只影响当前组件和它的子组件。

全站都用同一张图时，在加载 DUI 之前配置 `wikiAssets`。

```js
window.DUIConfig = {
  ...window.DUIConfig,
  wikiAssets: {
    'items/lighter.png': 'File:Icon lighter2.png',
    'audio/hover.mp3': 'File:SoundHover.mp3'
  }
};
```

左边填 `assets/doors/` 下的相对路径，右边填本站文件名。DUI 按 `file`、当前组件的素材配置、全站 `wikiAssets`、DOORS Wiki 默认文件、发行包默认素材的顺序查找。MediaWiki 的共享文件库也可以解析。中英文 DOORS Wiki 默认查本站文件，管理员可用 `preferWikiAssets: false` 关闭这一步。脚本加载后，仍可通过 `DUI.configure({ wikiAssets: ... })` 更新全站映射。

## 组件参数

左边的名称填进 `data-dui` 或模板的 `组件`，右边的参数填进 JSON。

| `data-dui` | 主要 JSON 参数 |
| --- | --- |
| `button` | `label`、`variant`、`size`、`disabled`、`loading`、`fullWidth`、`action` |
| `icon` | `name`、`file`、`alt`、`size`、`tone`、`mask` |
| `lobby-icon` | `icon`（素材名或 `codes`）、`label`、`disabled` |
| `lobby` | `showStore`、`items`（图标名数组）、`label` |
| `text` | `text`、`variant`、`tone`、`align`、`truncate`、`as`（仅 span/p/strong/em/h2/h3/code） |
| `kbd` | `text`、`size` |
| `space` | `direction`、`size`、`align`、`justify`、`wrap`、`children` |
| `grid` | `columns`（1–12）、`minItemWidth`（正数 px）、`gap`、`responsive`、`children` |
| `layout` | `maxWidth`、`padding`、`children` |
| `divider` | `orientation`、`tone`、`label` |
| `slider` | `label`、`description`、`min`、`max`、`step`、`defaultValue`、`disabled` |
| `switch` | `label`、`description`、`defaultChecked`、`size`、`disabled` |
| `search` | `label`、`placeholder`、`defaultValue`、`shortcut`、`size`、`disabled` |
| `panel` | `title`、`description`、`footer`（文本）、`closable`、`closeLabel`、`children` |
| `panel-section` | `title`、`children` |
| `tabs` | `label`、`defaultValue`、`items`：每项 `value`、`label`、`disabled`、`content`（子节点） |
| `item-slot` | `icon`、`file`、`label`、`count`、`shortcut`（文本）、`selected`、`disabled`、`size`、`shape`、`charge` |
| `inventory` | `label`、`defaultValue`（id 或 null）、`items`：每项唯一 `id`，以及 `icon`、`file`、`label`、`count`、`disabled`、`size`、`shape`、`charge` |
| `currency` | `kind`（knobs/gold/revive/candy）、`value`、`label`、`size`、`showLabel` |
| `currency-group` | `children` |
| `shop-item` | `item`（素材名）、`name`、`description`、`price`、`currency`、`owned`、`available`、`disabled` |
| `achievement` | `achievement`（welcome/outOfMyWay/rockBottom）、`title`、`description`、`unlocked`、`progress`、`max` |
| `dialog` | `title`、`description`、`triggerLabel`、`defaultOpen`、`closeLabel`、`closeOnBackdrop`、`footer`（文本）、`children` |

常用的图标名有 `settings`、`backpack`、`lighter` 和 `skeletonKey`。完整名单见 `src/components/Icon/assets.ts`。词条参数只接受 JSON，多余的字段不会写进 DOM。组合组件用 `children`，不要在一个 `dui-widget` 容器里再嵌另一个容器。

## 站点脚本接收操作

组件的状态留在当前页面，刷新就会重置。商店卡里的“已拥有”用来演示购买结果。搜索框负责输入，快捷键标记只负责显示。要让组件执行本站的操作，在站点脚本里监听 `dui:action`。

事件的 `target` 是最外层的 `dui-widget`，`detail` 有 `component` 和 `action`，部分事件还带 `value`。按钮发出 `click` 或指定的 `action`，输入和选择发出 `change`，大厅入口发出 `action` 并把图标名放进 `value`。商店用 `purchase`，弹窗用 `open` 和 `close`。

```js
document.addEventListener('dui:action', function (event) {
  var detail = event.detail;
  if (detail.component === 'lobby' && detail.value === 'settings') {
    // 由本站脚本打开设置界面。
  }
});
document.addEventListener('dui:error', function (event) {
  console.warn('DUI:', event.detail.message);
});
```

### 手动挂载和更新

第一次加载页面或 MediaWiki 触发 `wikipage.content` 时，DUI 会自动查找新组件。站点脚本直接插入了一段内容时，可以调用 `DUI.scan(container)`。反复扫描不会清掉读者已经选中的物品或设置。组件从页面移除后会自动卸载。

下面这段代码把货币计数挂到 `id="my-widget"` 的元素上，再把数值从 1250 更新到 1300。

```js
const element = document.getElementById('my-widget');
const handle = DUI.mount(element, {
  component: 'currency',
  props: { kind: 'knobs', value: 1250 }
});

handle.update({
  component: 'currency',
  props: { kind: 'knobs', value: 1300 }
});
```

`update()` 会按新参数重新初始化组件。直接改已挂载节点的 `data-*` 时，可以先 `DUI.unmount(element)`，再 `DUI.scan(element)`。`handle.unmount()` 会恢复占位内容，`DUI.destroy()` 会卸载所有组件并停止自动扫描。需要打开交互音效时，用 `DUI.configure({ sound: true })`，已挂载的组件会保留当前状态。

静态包的 `dui.js` 把这套 API 挂在 `window.DUI`。用模块脚本时，先加载同目录的 `dui.css`，再从 `dui.mjs` 导入所需的函数。两种入口都在浏览器运行，包里已经包含 React。

## 样式和部署限制

组件主题用 `.dui-scope` 限定范围，大厅组合布局用 `.dui-lobby-example`。弹窗在组件内用原生 `<dialog>` 打开，组件支持键盘操作和系统的“减少动态效果”设置。

静态包用 `baseUrl` 找图片、遮罩图标和音效，字体按 `dui.css` 的位置查找。换部署地址时，把样式和素材一起迁过去。中文用站点或系统字体，背景图由本站 CSS 设置。发行包内的 `LICENSE` 是 DUI 的项目许可，`ASSETS.md` 记录素材来源，`licenses/` 存放第三方依赖和字体许可。

页面上只剩占位文字时，先检查加载脚本和样式的请求。容器带 `data-dui-state="error"` 时，检查词条里的 JSON 和组件参数。JSON 解析失败会保留占位文字，渲染出错会显示提示，两种情况都可以从 `dui:error` 读取错误信息。

## 从 0.1.0 更新大厅菜单

手机端大厅的换行和溢出在 0.1.1 修复。更新时把脚本和样式一起换掉。静态部署替换整个发行目录，使用 Pages 地址时确认 `dui.js` 和 `dui.css` 都已刷新缓存。Miraheze 版先更新 `DUI.css` 和 `DUI-runtime.js`，最后更新 `DUI.js`。

有 `HOST GAME` 按钮的词条可以沿用下面的结构。按钮、文字和播放图标会一起按容器宽度缩放，下面的菜单图标保持一排。页面只放大厅菜单时，保留 `data-dui="lobby"` 的容器就够了。

```html
<div class="dui-lobby-example">
  <div class="dui-lobby-host">
    <div class="dui-widget" data-dui="button"
      data-dui-props='{"label":"HOST GAME","action":"host-game"}'>HOST GAME</div>
  </div>
  <div class="dui-lobby-navigation">
    <div class="dui-widget" data-dui="lobby"
      data-dui-props='{"showStore":true}'>大厅菜单</div>
  </div>
</div>
```

删掉旧站点样式里给手机端写死的宽高、字号和菜单换行规则。背景和外边距按词条需要保留。用手机预览，检查 `HOST GAME` 的比例、图标是否排成一行，以及按下放大、松手恢复的效果。维基工作人员确认显示正常后，再处理模板上的 `nomobile`。

## MediaWiki 参考

- [ResourceLoader](https://www.mediawiki.org/wiki/ResourceLoader/Developing_with_ResourceLoader)
- [内容钩子](https://doc.wikimedia.org/mediawiki-core/master/js/Hooks.html)
- [Gadgets 扩展](https://www.mediawiki.org/wiki/Extension:Gadgets)
- [魔术字](https://www.mediawiki.org/wiki/Help:Magic_words#Miscellaneous)
