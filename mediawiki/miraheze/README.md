# 将 DUI 发布到 Miraheze Developers Wiki

在 `dev.miraheze.org` 按表中顺序保存三个源码页。

| 文件 | 保存到 |
| --- | --- |
| `DUI-runtime.js` | `User:Yatmt/DUI-runtime.js` |
| `DUI.css` | `User:Yatmt/DUI.css` |
| `DUI.js` | `User:Yatmt/DUI.js` |

把 `DUI.mw` 保存为 `DUI`，把 `DUI-Demo.mw` 保存为 `DUI/Demo`。在 Developers Wiki 试用时，把 `install.js` 的内容加到 `User:Yatmt/common.js`，再打开示例页。

其他 Wiki 安装时，把 `install.js` 的内容加到本站的 `MediaWiki:Common.js`。需要用 `{{DUI}}` 写词条时，再把 `Template-DUI.mw` 存为 `Template:DUI`。模板支持中英文参数，直接写 `data-dui` 的词条不需要模板。

升级时先更新 `DUI.css` 和 `DUI-runtime.js`，再更新 `DUI.js`。标题和物品栏角标用 WikiTide 上的 DOORS Remake。要加载 Oswald、Rubik 和 Inconsolata，在使用 DUI 的 Wiki 上打开 ManageWiki，在 CSP 服务列表中启用 **Google Fonts**。

保存 `User:Yatmt/DUI.css` 时遇到 AbuseFilter 拦截，把页面名、时间和截图交给 Developers Wiki 管理员复核。

项目许可见 `LICENSE`，素材来源见 `ASSETS.md`。
