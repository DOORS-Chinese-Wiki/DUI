# DUI · MediaWiki 部署

DUI 的浏览器包可以放进 MediaWiki 页面。管理员加载 JS 和 CSS 后，页面作者写一个带 `data-dui` 的容器，就能使用物品栏、设置面板或其他组件。React 已包含在包内。

## 获取组件包

可以从组件文档下载 ZIP，也可以在项目目录自行构建：

```sh
npm ci
npm run pack:mediawiki
```

输出：

- `dist-mediawiki/`：可直接部署的目录。
- `artifacts/dui-mediawiki-0.1.0.zip`：静态部署压缩包。
- `artifacts/dui-mediawiki-0.1.0.tgz`：可用 `npm install /绝对路径/文件.tgz` 本地安装的包；未发布到 npm。

GitHub Pages 已托管可直接加载的版本：`https://doors-chinese-wiki.github.io/DUI/mediawiki/`。下面的安装配置使用这个地址。需要自行托管时，解压 ZIP，把 `dui-mediawiki` 目录内的全部文件放到静态目录，保留子目录结构，再访问其中的 `index.html` 检查图标和字体。

`dui.js` 是可直接加载的脚本，挂在 `window.DUI` 下；`dui.mjs` 用于 ES Module。两者选一种，样式使用同目录的 `dui.css`。

## 管理员安装

在 Common.js 和 Gadget 中选一种方式安装。

### Common.js

在 `MediaWiki:Common.js` 中先配置实际部署地址，再粘贴发行包中的 `integration/bootstrap.js`：

```js
window.DUIConfig = {
  baseUrl: 'https://doors-chinese-wiki.github.io/DUI/mediawiki/',
  sound: false, // 默认静音；需要交互音效时改为 true
  volume: 0.42
};
// 在这里接上 integration/bootstrap.js 的内容。
```

bootstrap 使用 `mw.loader.load` 加载外部 CSS 与 IIFE 脚本。运行时订阅 `mw.hook('wikipage.content')`：首次打开页面、预览或其他触发此内容钩子的更新会扫描组件；重复扫描保留已挂载组件的状态。对于没有触发该钩子的第三方内容更新，可主动调用 `DUI.scan(container)`。被移除的根节点会自动卸载。

### Gadget（已安装 Gadgets 扩展时）

将上面的配置和 bootstrap 内容放进 `MediaWiki:Gadget-DUI.js`，并在 `MediaWiki:Gadgets-definition` 加入：

```text
* DUI[ResourceLoader|default]|DUI.js
```

可在 `MediaWiki:Gadget-DUI` 写上“DOORS 风格交互组件”。去掉 `default` 可改为用户按需启用。此方案是一个小型 ResourceLoader 引导 Gadget，完整组件和字体仍由静态发行目录提供。

## 页面中使用

在 Wiki 页面的源代码编辑器中加入下面的内容，保存后应出现物品栏：

```html
<div class="dui-widget" data-dui="inventory" data-dui-props='{"label":"随身物品栏","defaultValue":null,"items":[{"id":"lighter","icon":"lighter","charge":0.8},{"id":"key","icon":"skeletonKey","count":1,"size":"sm"},{"id":"compass","icon":"compass","size":"sm","shape":"circle"}]}'>随身物品：打火机、骷髅钥匙、指南针。</div>
```

容器中的文字在脚本未加载时显示。`data-dui` 指定组件，`data-dui-props` 填 JSON 参数。属性外层使用单引号，参数文本中的单引号写成 `&#39;`；也可以使用下面的模板处理属性。

### 可选模板

将 `integration/Template-DUI.wikitext` 内容保存为 `Template:DUI`，之后页面中可写：

```wikitext
{{DUI
|组件=button
|参数={"label":"开始游戏","action":"host-game"}
|后备文字=开始游戏
}}
```

JSON 文本中如果需要字面量 `|`，在模板参数中写成 `{{!}}`。不要在已挂载的容器内部再嵌套 `dui-widget` HTML；组合组件使用 JSON `children`。

### 组合面板

`data-dui-props` 的 `children` 可写文本、组件对象或数组；子节点结构是 `{ "component": "名称", "props": {...}, "children": ... }`：

```html
<div class="dui-widget" data-dui="panel" data-dui-props='{"title":"设置","children":[{"component":"slider","props":{"label":"大厅音乐","defaultValue":20}},{"component":"switch","props":{"label":"减小动作幅度","defaultChecked":true}}]}'>大厅音乐：20；减小动作幅度：开启。</div>
```

更多可复制的物品栏、大厅、弹窗和成就例子在 `integration/examples.wikitext`。

## 组件参数

这些入口调用项目中同一套 React 组件。下表列出 Wiki 页面可以传入的参数。

| `data-dui` | 主要 JSON 参数 |
| --- | --- |
| `button` | `label`、`variant`、`size`、`disabled`、`loading`、`fullWidth`、`action` |
| `icon` | 素材 `name`、`alt`、`size`、`tone` |
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
| `item-slot` | `icon`、`label`、`count`、`shortcut`（文本）、`selected`、`disabled`、`size`、`shape`、`charge` |
| `inventory` | `label`、`defaultValue`（id 或 null）、`items`：每项唯一 `id`、`icon`、`label`、`count`、`disabled`、`size`、`shape`、`charge` |
| `currency` | `kind`（knobs/gold/revive/candy）、`value`、`label`、`size`、`showLabel` |
| `currency-group` | `children` |
| `shop-item` | `item`（素材名）、`name`、`description`、`price`、`currency`、`owned`、`available`、`disabled` |
| `achievement` | `achievement`（welcome/outOfMyWay/rockBottom）、`title`、`description`、`unlocked`、`progress`、`max` |
| `dialog` | `title`、`description`、`triggerLabel`、`defaultOpen`、`closeLabel`、`closeOnBackdrop`、`footer`（文本）、`children` |

未列出的参数不会转交给 DOM。图标可用：items、gallery、achievements、settings、player、search、backpack、journal、inventorySlot、close、revive、knobs、gold、candy、flashlight、compass、crucifix、candle、lighter、vitamins、lockpick、skeletonKey；完整列表以项目 `src/components/Icon/assets.ts` 为准。

滑动条/开关/标签页/物品栏保持本地状态；商店卡点击后仅展示“已拥有”，**不会扣款、保存账号数据或调用游戏/Wiki 的购买接口**。刷新页面重置。搜索框仅提供输入和事件，按键提示不会抢占 Wiki 的全局搜索快捷键。需要业务行为时由站点脚本处理事件。

## 站点脚本接收操作

监听冒泡的 `dui:action`，`event.target` 是最外层宿主容器；`detail` 是 `{component, action, value?}`。`change` 用于输入/选择、`click` 或按钮指定的 `action` 用于按钮、`action` 用于大厅入口、`purchase` 用于商店、`open` / `close` 用于弹窗。

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

全局 API（IIFE）与具名 ES Module 导出相同：

```js
DUI.scan(document);                       // 幂等扫描
DUI.configure({ sound: true });           // 不重置已挂载组件状态
var handle = DUI.mount(document.getElementById('my-widget'), {
  component: 'currency', props: { kind: 'knobs', value: 1250 }
});
handle.update({ component: 'currency', props: { kind: 'knobs', value: 1300 } });
handle.unmount();                             // 恢复原来的后备内容
DUI.unmount(document.getElementById('my-widget'));
// DUI.destroy()：停止内容钩子与清理监听，卸载当前所有组件。
```

`mount` / `update` 校验根节点。显式 `update` 重置该实例的本地状态；`scan` 重复执行不会重置。修改已有节点的 `data-*` 不会隐式覆盖用户操作，需要用 `update` 或先 `unmount` 再 `scan`。异常解析会保留原后备内容并标记 `data-dui-state="error"`；渲染参数异常由错误边界显示提示并发出 `dui:error`。

ES Module：加载 `dui.css` 后，用 `<script type="module">` 导入 `dui.mjs`。IIFE 和 ES Module 都只在浏览器运行。发行包不依赖外部 React 全局变量。

## 样式和部署限制

所有组件规则及主题变量被限定在 `.dui-scope` 内，CSS Modules 类名也仍然保留；包不会修改 Wiki 的 `html`、`body`、全局标题、链接或原生按钮。弹窗保留在宿主作用域内，并使用原生 dialog 顶层模态显示。组件支持键盘操作和系统“减少动态效果”偏好。

图像、mask 图标与可选声音通过 `baseUrl` 解析；CSS 字体相对 `dui.css` 文件解析。发行包里的背景素材是可选素材，没有将任何展示页或用户截图 UI 烘焙进组件。中文优先使用站点/系统可用字体；包附带 DOORS 字体和拉丁字体，不包含整套 MiSans 字库。

词条中的配置只接受 JSON，不执行字符串回调或插入 HTML；脚本由管理员安装。CSS 需要保留为独立文件，字体相对它解析。自建跨域服务器要为字体设置 CORS，站点 CSP 也需要允许所用的静态域名。

素材出处见 `ATTRIBUTION.md`，依赖与拉丁字体许可证见 `licenses/`。TGZ 包用于本地安装，尚未发布到 npm。

官方接入参考：

- https://www.mediawiki.org/wiki/ResourceLoader/Developing_with_ResourceLoader
- https://doc.wikimedia.org/mediawiki-core/master/js/Hooks.html
- https://www.mediawiki.org/wiki/Extension:Gadgets
- https://www.mediawiki.org/wiki/Help:Magic_words#Miscellaneous
