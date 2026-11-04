import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { version } from '../../package.json';
import { Button, Divider, Grid, Icon, Layout, SearchField, Space, Text } from '../components';
import { examples, type ExampleDefinition } from './examples/registry';
import { docOrder, docPages, quickStartCode, type DocId, type DocPage } from './catalog';
import styles from './Documentation.module.css';

function HighlightedCode({ code }: { code: string }) {
  const parts = code.split(/("[^"\n]*"|'[^'\n]*'|\/\/[^\n]*|\b(?:import|from|export|default|return|const|function|true|false)\b|<\/?[A-Za-z][\w.]*)/g);
  return <>{parts.map((part, index) => {
    const kind = part.startsWith('//') ? 'comment'
      : /^["']/.test(part) ? 'string'
      : part.startsWith('<') ? 'tag'
      : /^(import|from|export|default|return|const|function|true|false)$/.test(part) ? 'keyword' : undefined;
    return kind ? <span className={styles[kind]} key={index}>{part}</span> : part;
  })}</>;
}

export function CodeBlock({ code, label = '示例', filename = 'example.tsx' }: {
  code: string; label?: string; filename?: string;
}) {
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(''), 2200);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('已复制');
    } catch {
      setStatus('复制失败，请手动选择代码');
    }
  }

  return <Layout maxWidth="full" padding="none" className={styles.codeBlock}>
    <Space size="xs" align="center" justify="space-between" className={styles.codeToolbar}>
      <Text as="span" variant="caption" tone="inherit">{filename}</Text>
      <Space size="xs" align="center" className={styles.copyAction}>
        <Text as="span" variant="caption" tone="inherit" role="status">{status}</Text>
        <Button variant="secondary" size="sm" onClick={copy} aria-label={`复制${label}代码`}
          leadingIcon={<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="7" y="7" width="9" height="10" rx="1.5" /><path d="M12 4V3H3v10h1" /></svg>}>
          复制
        </Button>
      </Space>
    </Space>
    <pre tabIndex={0} aria-label={`${label}代码`}><code><HighlightedCode code={code} /></code></pre>
  </Layout>;
}

function ExampleFiles({ definition, label }: { definition: ExampleDefinition; label: string }) {
  const uid = useId();
  const [selected, setSelected] = useState(0);
  const file = definition.files[selected];

  return <Layout maxWidth="full" padding="none" className={styles.sourceViewer}>
    <Space size="xs" align="center" className={styles.sourceFiles} role="tablist" aria-label={label + '源文件'}>
      {definition.files.map((source, index) => <Button
        key={source.path} size="sm" variant={selected === index ? 'primary' : 'plain'} role="tab"
        id={uid + '-file-' + index} aria-controls={uid + '-source-panel'}
        aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
        onClick={() => setSelected(index)}
        onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 0
            : event.key === 'End' ? definition.files.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + definition.files.length) % definition.files.length;
          setSelected(next);
          event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next].focus();
        }}
      >{source.filename}</Button>)}
    </Space>
    <Layout maxWidth="full" padding="none" role="tabpanel" id={uid + '-source-panel'} aria-labelledby={uid + '-file-' + selected}>
      <CodeBlock key={file.path} code={file.source} filename={file.filename}
        label={file.language === 'css' ? label + '样式' : label} />
    </Layout>
    <Text as="p" variant="small" tone="inherit" className={styles.sourceNote}>
      预览直接运行此示例。复用时请同时保存 TSX 与 CSS 文件，并保留源码中的相对导入路径。
      <Text variant="code" tone="inherit">{file.path}</Text>
    </Text>
  </Layout>;
}

function Example({ id, page }: { id: DocId; page: DocPage }) {
  const uid = useId();
  const [mode, setMode] = useState<'preview' | 'code'>('preview');
  const modes = ['preview', 'code'] as const;
  const definition = examples[id];
  const Preview = definition.Component;
  return <Layout maxWidth="full" padding="none" className={styles.example} id={`${id}-examples`}>
    <Space size="md" align="center" justify="space-between" className={styles.exampleToolbar}>
      <Space size="xs" align="center" role="tablist" aria-label={`${page.title}示例`} className={styles.tabs}>
        {modes.map((value, index) => <Button key={value} size="sm" variant={mode === value ? 'primary' : 'plain'} role="tab"
          id={`${uid}-${value}-tab`} aria-controls={`${uid}-${value}-panel`}
          aria-selected={mode === value} tabIndex={mode === value ? 0 : -1}
          onClick={() => setMode(value)} onKeyDown={(event) => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
            setMode(modes[next]);
            event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next].focus();
          }}>
          {value === 'preview' ? '预览' : '代码'}
        </Button>)}
      </Space>
      <Text variant="caption" tone="inherit" className={styles.exampleMeta}><span /> React · TSX</Text>
    </Space>
    <Layout maxWidth="full" padding="none" className={styles.preview} data-example={id} role="tabpanel" tabIndex={0}
      id={`${uid}-preview-panel`} aria-labelledby={`${uid}-preview-tab`} hidden={mode !== 'preview'}>
      <Preview />
    </Layout>
    <Layout maxWidth="full" padding="none" role="tabpanel" id={`${uid}-code-panel`} aria-labelledby={`${uid}-code-tab`} hidden={mode !== 'code'}>
      {mode === 'code' ? <ExampleFiles definition={definition} label={page.title} /> : null}
    </Layout>
  </Layout>;
}

export function DocumentationSection({ id }: { id: DocId }) {
  const page: DocPage = docPages[id];
  return <Layout as="section" maxWidth="full" padding="none" id={id} data-doc-section className={styles.docSection} aria-label={page.title}>
    <Divider className={styles.sectionDivider} />
    <Text as="div" variant="caption" tone="inherit" className={styles.sectionEyebrow}>{page.group}</Text>
    <Text as="h2" variant="h2" tone="inherit" id={`${id}-title`}><span>{page.component}</span><Text as="span" variant="caption" tone="inherit" className={styles.chineseTitle}>{page.title}</Text>
      <a href={`#${id}`} aria-label={`链接到${page.title}`} className={styles.anchor}>#</a>
    </Text>
    <Text as="p" variant="small" tone="inherit" className={styles.description}>{page.description}</Text>
    <Space size="md" align="center" className={styles.importLine}><Text as="code" variant="code" tone="inherit">{page.imports}</Text><Text variant="caption" tone="inherit">源码导入</Text></Space>
    <Text as="h3" variant="h3" tone="inherit" className={styles.subheading}>交互示例</Text>
    <Example id={id} page={page} />
    <Space size="sm" align="baseline" className={styles.usageNote} id={`${id}-usage`}>
      <span aria-hidden="true">i</span>
      <Text as="p" variant="small" tone="inherit">{page.note ?? '支持 className、style 和对应原生元素的 HTML 属性，可在不修改组件内部实现的情况下扩展样式。'}</Text>
    </Space>
    {page.api.length > 0 ? <Layout maxWidth="full" padding="none" id={`${id}-api`} className={styles.apiSection}>
      <Text as="h3" variant="h3" tone="inherit">API 参考</Text>
      <Text as="p" variant="small" tone="inherit">以下列出组件扩展属性；原生元素属性可直接传入。</Text>
      {page.api.map(api => <Layout maxWidth="full" padding="none" key={api.component} className={styles.apiGroup}>
        {page.api.length > 1 ? <Text as="h4" variant="h3" tone="inherit">{api.component}</Text> : null}
        <Layout maxWidth="full" padding="none" className={styles.tableScroll} tabIndex={0} role="region" aria-label={`${page.title}：${api.component}属性表`}>
          <table>
            <caption className="sr-only">{page.title}：{api.component} API 参数</caption>
            <thead><tr><th scope="col">属性</th><th scope="col">类型</th><th scope="col">默认值</th><th scope="col">说明</th></tr></thead>
            <tbody>{api.props.map(prop => <tr key={prop.name}>
              <th scope="row"><Text as="code" variant="code" tone="inherit">{prop.name}</Text></th><td><Text as="code" variant="code" tone="inherit">{prop.type}</Text></td>
              <td><Text as="code" variant="code" tone="inherit">{prop.defaultValue}</Text></td><td>{prop.description}</td>
            </tr>)}</tbody>
          </table>
        </Layout>
      </Layout>)}
    </Layout> : null}
  </Layout>;
}

export function DocumentationIntro() {
  return <Layout as="section" maxWidth="full" padding="none" id="overview" data-doc-section className={styles.introduction} aria-labelledby="overview-title">
    <Space size="sm" align="center" className={styles.breadcrumb}>文档 <span>/</span> 开始使用</Space>
    <Space size="md" align="center" className={styles.introTitle}><Text as="h1" variant="h1" tone="inherit" id="overview-title">组件文档</Text><Text as="span" variant="caption" tone="inherit" className={styles.version}>v{version}</Text></Space>
    <Text as="p" variant="small" tone="inherit" className={styles.introLead}>DOORS 风格的按钮、物品栏和设置界面。</Text>
    <Text as="p" variant="small" tone="inherit" className={styles.description}>DUI 用 React 和 TypeScript 编写。这份文档可以直接操作组件、查看对应源码，也可以下载浏览器包，在 MediaWiki 页面中使用。</Text>
    <Space size="md" align="center" wrap className={styles.introLinks}>
      <Button asChild trailingIcon={<span aria-hidden="true">→</span>}><a href="#actions">浏览组件</a></Button>
      <Button asChild variant="secondary" trailingIcon={<span aria-hidden="true">↗</span>}><a href="#lobby">查看大厅示例</a></Button>
      <Button asChild variant="plain"><a href="https://github.com/DOORS-Chinese-Wiki/DUI/blob/main/docs/MEDIAWIKI.md">MediaWiki 安装说明</a></Button>
      <Button asChild variant="plain"><a href={`${import.meta.env.BASE_URL}downloads/dui-mediawiki-${version}.zip`}>下载 Wiki 组件包</a></Button>
    </Space>
    <Layout maxWidth="full" padding="none" className={styles.projectNote}><Text variant="caption" tone="inherit">使用方式</Text><Text as="p" variant="small" tone="inherit">React 项目从 <Text as="code" variant="code" tone="inherit">src/components</Text> 引入组件。MediaWiki 使用单独构建的 JS、CSS 和素材包，页面通过 <Text as="code" variant="code" tone="inherit">data-dui</Text> 配置组件。</Text></Layout>
    <Layout maxWidth="full" padding="none" id="quick-start" className={styles.quickStart}>
      <Text as="h2" variant="h2" tone="inherit">开始使用</Text>
      <Text as="p" variant="small" tone="inherit">入口 <Text as="code" variant="code" tone="inherit">src/main.tsx</Text> 已加载 <Text as="code" variant="code" tone="inherit">./styles/global.css</Text>，包含字体、颜色和间距 token。直接从 <Text as="code" variant="code" tone="inherit">./components</Text> 引入需要的组件。</Text>
      <CodeBlock code={quickStartCode} label="快速开始" filename="src/App.tsx" />
      <Space size="lg" align="center" wrap className={styles.quickPreview}><Text variant="caption" tone="inherit">运行效果</Text><Button leadingIcon={<Icon name="items" size={20} />}>打开物品栏</Button></Space>
    </Layout>
    <Layout maxWidth="full" padding="none" className={styles.conventions} id="conventions">
      <Text as="h2" variant="h2" tone="inherit">设计与交互约定</Text>
      <Grid as="dl" columns={1} gap="none" responsive={false}><Grid columns={2} gap="none" responsive={false}><Text as="dt" variant="small" tone="inherit">视觉</Text><Text as="dd" variant="small" tone="inherit">深棕底色、奶油描边、DOORS 展示字体。</Text></Grid>
        <Grid columns={2} gap="none" responsive={false}><Text as="dt" variant="small" tone="inherit">操作</Text><Text as="dd" variant="small" tone="inherit">原生输入语义、可见键盘焦点、可选交互音效。</Text></Grid>
        <Grid columns={2} gap="none" responsive={false}><Text as="dt" variant="small" tone="inherit">状态</Text><Text as="dd" variant="small" tone="inherit">Slider 与 Switch 同时支持受控和非受控用法。</Text></Grid>
      </Grid>
    </Layout>
  </Layout>;
}


export function DocumentationShell({ children, actions }: { children: ReactNode; actions: ReactNode }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string>('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const needle = query.trim().toLocaleLowerCase();
  const entries = docOrder.filter(id => {
    const page = docPages[id];
    return [page.title, page.component, page.group, ...page.api.map(api => api.component)].join(' ').toLocaleLowerCase().includes(needle);
  });
  const groups = [...new Set(entries.map(id => docPages[id].group))];
  const currentPage: DocPage | undefined = active in docPages ? docPages[active as DocId] : undefined;

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      const editing = event.target instanceof HTMLElement && (event.target.matches('input, textarea') || event.target.isContentEditable);
      if ((event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !editing)) {
        event.preventDefault(); searchRef.current?.focus();
      }
      if (event.key === 'Escape') { setMenuOpen(false); setQuery(''); }
    }
    window.addEventListener('keydown', shortcut);
    if (typeof IntersectionObserver === 'undefined') return () => window.removeEventListener('keydown', shortcut);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-72px 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('[data-doc-section]').forEach(section => observer.observe(section));
    return () => { observer.disconnect(); window.removeEventListener('keydown', shortcut); };
  }, []);

  function select(id: string) { setActive(id); setMenuOpen(false); }

  return <Layout maxWidth="full" padding="none" className={styles.site}>
    <a className={styles.skipLink} href="#main-content">跳到主要内容</a>
    <header className={styles.header}>
      <Layout maxWidth="full" padding="none" className={styles.headerInner}>
        <a className={styles.brand} href="#overview" aria-label="DUI 文档首页"><span className={styles.brandMark} aria-hidden="true">01</span><span>DUI</span><Text as="span" variant="caption" tone="inherit" className={styles.docsBadge}>文档</Text></a>
        <nav className={styles.topNav} aria-label="站点导航"><Button asChild variant="primary" size="sm"><a href="#overview" aria-current="page">文档</a></Button><Button asChild variant="plain" size="sm"><a href="#lobby">组合示例</a></Button></nav>
        <SearchField ref={searchRef} className={styles.searchBox} aria-label="搜索组件文档" placeholder="搜索组件文档…" value={query}
          aria-keyshortcuts="/ Control+k Meta+k" title="按 /、Ctrl+K 或 ⌘K 搜索组件文档"
          onChange={event => { setQuery(event.target.value); setMenuOpen(Boolean(event.target.value)); }}
          onKeyDown={event => {
            if (event.key === 'Enter' && entries[0]) {
              const id = entries[0];
              window.location.hash = id; select(id); searchRef.current?.blur();
            }
          }} />
        <Space size="xs" align="center" className={styles.headerActions}>{actions}</Space>
        <Button className={styles.menuToggle} variant="secondary" size="sm" iconOnly aria-label={menuOpen ? '关闭文档导航' : '打开文档导航'} aria-expanded={menuOpen} aria-controls="docs-sidebar" onClick={() => setMenuOpen(open => !open)}>{menuOpen ? <Icon name="close" size={16} /> : <span aria-hidden="true">☰</span>}</Button>
      </Layout>
    </header>
    <Grid gap="none" responsive={false} className={styles.frame}>
      <Space as="aside" direction="vertical" size="none" className={styles.sidebar} id="docs-sidebar" data-open={menuOpen}>
        <Space as="nav" direction="vertical" size="xs" aria-label="组件文档导航">
          {!needle ? <Space direction="vertical" size="none" className={styles.navGroup}><Text as="h2" variant="h2" tone="inherit">开始</Text><Button asChild variant={active === 'overview' ? 'primary' : 'plain'} size="sm"><a href="#overview" aria-current={active === 'overview' ? 'location' : undefined} onClick={() => select('overview')}><span>概览</span><Text as="span" variant="caption" tone="inherit" className={styles.navHint}>Introduction</Text></a></Button><Button asChild variant="plain" size="sm"><a href="#quick-start" onClick={() => select('overview')}>快速开始</a></Button><Button asChild variant="plain" size="sm"><a href="#conventions" onClick={() => select('overview')}>设计约定</a></Button></Space> : <Text as="p" variant="small" tone="inherit" className={styles.searchSummary} role="status">找到 {entries.length} 个条目</Text>}
          {groups.map(group => <Space direction="vertical" size="none" className={styles.navGroup} key={group}><Text as="h2" variant="h2" tone="inherit">{group}</Text>{entries.filter(id => docPages[id].group === group).map(id => <Button key={id} asChild variant={active === id ? 'primary' : 'plain'} size="sm"><a href={`#${id}`} onClick={() => select(id)} aria-current={active === id ? 'location' : undefined}><span>{docPages[id].component}</span><Text as="span" variant="caption" tone="inherit" className={styles.navHint}>{docPages[id].title}</Text></a></Button>)}</Space>)}
          {entries.length === 0 ? <Text as="p" variant="small" tone="inherit" className={styles.emptySearch}>没有匹配的组件。试试 Button、滑动条或图标。</Text> : null}
        </Space>
        <Space size="xs" align="center" className={styles.sidebarFooter}><span className={styles.statusDot} /><span>源码文档</span><Text as="code" variant="code" tone="inherit">v{version}</Text></Space>
      </Space>
      <Layout as="main" maxWidth="full" padding="none" className={styles.main} id="main-content">{children}
        <Space as="footer" direction="vertical" size="xxs" className={styles.footer}><Text as="p" variant="small" tone="inherit">DUI · React + TypeScript</Text><Text as="p" variant="small" tone="inherit">素材出处见仓库的 ATTRIBUTION.md。</Text><Button asChild variant="plain" size="sm"><a href="#overview">回到文档顶部 ↑</a></Button></Space>
      </Layout>
      <aside className={styles.toc} aria-label="本节目录"><Text variant="caption" tone="inherit">本节目录</Text>
        {active === 'overview' || !currentPage ? <Space as="nav" direction="vertical" size="xs">
          <Button asChild variant="plain" size="sm"><a href="#overview">概览</a></Button>
          <Button asChild variant="plain" size="sm"><a href="#quick-start">开始使用</a></Button>
          <Button asChild variant="plain" size="sm"><a href="#conventions">设计与交互约定</a></Button>
        </Space> : <Space as="nav" direction="vertical" size="xs">
          <Button asChild variant="plain" size="sm"><a href={`#${active}`}>{currentPage.component}</a></Button>
          <Button asChild variant="plain" size="sm"><a href={`#${active}-examples`}>交互示例</a></Button>
          <Button asChild variant="plain" size="sm"><a href={`#${active}-usage`}>使用说明</a></Button>
          {currentPage.api.length > 0 ? <Button asChild variant="plain" size="sm"><a href={`#${active}-api`}>API 参考</a></Button> : null}
        </Space>}
        <Text as="div" variant="caption" tone="inherit" className={styles.tocNote}>预览中的控件可直接操作。切换到「代码」查看对应写法。</Text>
      </aside>
    </Grid>
  </Layout>;
}
