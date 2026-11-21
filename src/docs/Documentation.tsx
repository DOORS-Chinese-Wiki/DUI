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
    <Text as="h2" variant="h2" tone="inherit" id={`${id}-title`}><span>{page.title}</span>{page.component !== page.title && id !== 'settings' && <code className={styles.componentName}>{page.component}</code>}
      <a href={`#${id}`} aria-label={`链接到${page.title}`} className={styles.anchor}>#</a>
    </Text>
    <Text as="p" variant="body" tone="inherit" className={styles.description}>{page.description}</Text>
    <Text as="h3" variant="h3" tone="inherit" className={styles.subheading} id={`${id}-usage`}>用法</Text>
    <pre className={styles.importLine}><code><HighlightedCode code={page.imports} /></code></pre>
    {page.note && <Text as="p" variant="body" tone="inherit" className={styles.description}>{page.note}</Text>}
    <Text as="h3" variant="h3" tone="inherit" className={styles.subheading}>示例</Text>
    <Example id={id} page={page} />
    {page.api.length > 0 ? <Layout maxWidth="full" padding="none" id={`${id}-api`} className={styles.apiSection}>
      <Text as="h3" variant="h3" tone="inherit">API</Text>
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
    <div className={styles.introTitle}>
      <Text as="h1" variant="h1" tone="inherit" id="overview-title">DUI</Text>
      <Text as="p" variant="body" tone="inherit" className={styles.introLead}>DOORS 风格的 React 组件库</Text>
    </div>
    <Space size="md" align="center" wrap className={styles.introLinks}>
      <Button asChild><a href="#quick-start">开始使用</a></Button>
      <Button asChild variant="secondary"><a href="#actions">浏览组件</a></Button>
    </Space>
    <Layout maxWidth="full" padding="none" id="quick-start" className={styles.quickStart}>
      <Text as="h2" variant="h2" tone="inherit">在 React 中使用</Text>
      <Text as="p" variant="body" tone="inherit">在仓库目录运行 <code>npm ci</code> 和 <code>npm run dev</code>。项目入口已加载主题样式。在 <code>src/App.tsx</code> 中导入组件。</Text>
      <CodeBlock code={quickStartCode} label="快速开始" filename="src/App.tsx" />
      <Space size="lg" align="center" className={styles.quickPreview}><Button leadingIcon={<Icon name="items" size={20} />}>打开物品栏</Button></Space>
    </Layout>
    <Layout maxWidth="full" padding="none" className={styles.quickStart} id="conventions">
      <Text as="h2" variant="h2" tone="inherit">接入 MediaWiki</Text>
      <Text as="p" variant="body" tone="inherit">管理员加载 <code>dui.js</code> 和 <code>dui.css</code> 后，在词条中用 <code>data-dui</code> 指定组件，用 JSON 填写参数。</Text>
      <Space size="sm" wrap>
        <Button asChild variant="secondary"><a href="https://github.com/DOORS-Chinese-Wiki/DUI/blob/main/docs/MEDIAWIKI.md">安装说明</a></Button>
        <Button asChild variant="plain"><a href={`${import.meta.env.BASE_URL}downloads/dui-mediawiki-${version}.zip`}>下载 Wiki 组件包</a></Button>
      </Space>
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
        <a className={styles.brand} href="#overview" aria-label="DUI 文档首页">DUI</a>
        <nav className={styles.topNav} aria-label="站点导航">
          <Button asChild variant="plain" size="sm"><a href="#conventions">MediaWiki</a></Button>
          <Button asChild variant="plain" size="sm"><a href="https://github.com/DOORS-Chinese-Wiki/DUI">GitHub</a></Button>
        </nav>
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
          {!needle && <Space direction="vertical" size="none" className={styles.navGroup}>
            <Text as="h2" variant="body" tone="inherit">入门</Text>
            <Button asChild variant="plain" size="sm"><a href="#quick-start" onClick={() => select('overview')}>React</a></Button>
            <Button asChild variant="plain" size="sm"><a href="#conventions" onClick={() => select('overview')}>MediaWiki</a></Button>
          </Space>}
          {groups.map(group => <Space direction="vertical" size="none" className={styles.navGroup} key={group}>
            <Text as="h2" variant="body" tone="inherit">{group}</Text>
            {entries.filter(id => docPages[id].group === group).map(id => <Button key={id} asChild variant={active === id ? 'primary' : 'plain'} size="sm">
              <a href={`#${id}`} onClick={() => select(id)} aria-current={active === id ? 'location' : undefined}>{docPages[id].title}</a>
            </Button>)}
          </Space>)}
          {entries.length === 0 && <Text as="p" variant="body" tone="inherit" role="status" className={styles.emptySearch}>没有匹配的组件。</Text>}
        </Space>
      </Space>
      <Layout as="main" maxWidth="full" padding="none" className={styles.main} id="main-content">{children}
        <Space as="footer" size="sm" wrap className={styles.footer}>
          <Button asChild variant="plain" size="sm"><a href="https://github.com/DOORS-Chinese-Wiki/DUI/blob/main/docs/ASSETS.md">素材来源</a></Button>
          <Button asChild variant="plain" size="sm"><a href="#overview">回到顶部 ↑</a></Button>
        </Space>
      </Layout>
      <aside className={styles.toc} aria-label="本节目录"><Text variant="body" tone="inherit">本节目录</Text>
        {active === 'overview' || !currentPage ? <Space as="nav" direction="vertical" size="xs">
          <Button asChild variant="plain" size="sm"><a href="#quick-start">React</a></Button>
          <Button asChild variant="plain" size="sm"><a href="#conventions">MediaWiki</a></Button>
        </Space> : <Space as="nav" direction="vertical" size="xs">
          <Button asChild variant="plain" size="sm"><a href={`#${active}`}>{currentPage.title}</a></Button>
          <Button asChild variant="plain" size="sm"><a href={`#${active}-usage`}>用法</a></Button>
          <Button asChild variant="plain" size="sm"><a href={`#${active}-examples`}>示例</a></Button>
          {currentPage.api.length > 0 ? <Button asChild variant="plain" size="sm"><a href={`#${active}-api`}>API</a></Button> : null}
        </Space>}
      </aside>
    </Grid>
  </Layout>;
}
