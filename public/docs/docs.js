(async function(){
    const loadingEl = document.getElementById('docs-loading');
    const errorEl = document.getElementById('docs-error');
    const contentEl = document.getElementById('docs-content');

    function showError(msg){
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
        errorEl.textContent = msg;
    }

    try {
        // Load highlight.js and theme dynamically
        if (!window.hljs) {
            await new Promise((resolve, reject) => {
                // Load CSS
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css';
                document.head.appendChild(link);

                // Load JS
                const s = document.createElement('script');
                s.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
                s.onload = resolve;
                s.onerror = reject;
                document.head.appendChild(s);
            });
        }

        // Load marked.js dynamically
        if (!window.marked) {
            await new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
                s.onload = resolve;
                s.onerror = reject;
                document.head.appendChild(s);
            });
        }

        // Fetch README.md (root) as the primary documentation source
        const res = await fetch('README.md');
        if (!res.ok) throw new Error('Failed to fetch README.md (' + res.status + ')');
        const md = await res.text();

        // Configure marked with highlight.js
        if (window.marked && window.hljs) {
            window.marked.setOptions({
                highlight: function(code, lang) {
                    const language = window.hljs.getLanguage(lang) ? lang : 'plaintext';
                    return window.hljs.highlight(code, { language }).value;
                },
                langPrefix: 'hljs language-'
            });
        }

        // Convert to HTML and sanitize
        const raw = (window.marked && window.marked.parse) ? window.marked.parse(md) : window.marked(md);
        const safe = DOMPurify.sanitize(raw);

        // Build layout: sidebar + content
        const wrapper = document.createElement('div');
        wrapper.className = 'docs-wrap';
        const sidebar = document.createElement('aside');
        sidebar.className = 'docs-sidebar';
        const tocTitle = document.createElement('h4'); tocTitle.textContent = 'On this page';
        const tocNav = document.createElement('nav'); tocNav.className = 'docs-toc'; tocNav.id = 'docs-toc';
        sidebar.appendChild(tocTitle); sidebar.appendChild(tocNav);

        const main = document.createElement('main');
        main.className = 'docs-content';

        // Constrain content width for cleaner hierarchy and whitespace
        const contentInner = document.createElement('div');
        contentInner.className = 'docs-main-container';
        contentInner.innerHTML = safe;
        main.appendChild(contentInner);

        // Mobile toolbar (visible on small screens) to toggle sidebar
        const mobileToolbar = document.createElement('div');
        mobileToolbar.className = 'docs-mobile-toolbar';
        mobileToolbar.innerHTML = `<div style="font-weight:700;color:#0f172a">On this page</div><button class="docs-toggle-btn" aria-expanded="false" style="background:transparent;border:1px solid rgba(15,23,42,0.06);padding:.35rem .6rem;border-radius:6px;cursor:pointer">Show</button>`;

        wrapper.appendChild(mobileToolbar);
        wrapper.appendChild(sidebar);
        wrapper.appendChild(main);

        contentEl.innerHTML = '';
        contentEl.appendChild(wrapper);
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');

        // Create TOC from headings
        const headings = main.querySelectorAll('h1, h2, h3');
        headings.forEach(h => { if (!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-'); });

        // Build nested, collapsible TOC: h1 -> h2 -> h3
        const rootUL = document.createElement('ul'); rootUL.style.listStyle = 'none'; rootUL.style.padding = '0'; rootUL.style.margin = '0';
        let lastH1Li = null;
        let lastH2Li = null;

        headings.forEach(h => {
            const level = parseInt(h.tagName.substr(1), 10);
            const link = document.createElement('a');
            link.href = '#' + h.id;
            link.textContent = h.textContent;
            link.className = 'toc-link';
            link.addEventListener('click', function(ev){ ev.preventDefault(); document.getElementById(h.id).scrollIntoView({behavior:'smooth', block:'start'}); setActiveTOCLink(link); if (window.innerWidth <= 900) { sidebar.classList.remove('open'); toggleBtn.textContent = 'Show'; toggleBtn.setAttribute('aria-expanded','false'); } });

            const li = document.createElement('li');
            li.style.marginBottom = '6px';

            if (level === 1) {
                // Level 1: Simple link, always expanded children
                li.appendChild(link);
                
                const childrenUL = document.createElement('ul'); 
                childrenUL.style.listStyle = 'none'; 
                childrenUL.style.padding = '0 0 0 6px';
                childrenUL.style.margin = '6px 0 0 0';
                childrenUL.className = 'children';
                
                li.appendChild(childrenUL);
                rootUL.appendChild(li);
                lastH1Li = li; lastH2Li = null;

            } else if (level === 2) {
                // Level 2: Collapsible
                const parentUL = (lastH1Li && lastH1Li.querySelector('.children')) || rootUL;
                
                const container = document.createElement('div'); 
                container.style.display = 'flex'; 
                container.style.alignItems = 'center'; 
                container.style.justifyContent = 'space-between';
                
                const left = document.createElement('div'); 
                link.classList.add('toc-h2');
                left.appendChild(link);
                
                const toggle = document.createElement('button');
                toggle.type = 'button'; 
                toggle.className = 'toc-toggle'; 
                toggle.textContent = '▾'; // Default open
                toggle.style.border = 'none'; toggle.style.background = 'transparent'; toggle.style.cursor = 'pointer'; toggle.style.padding = '0 6px'; toggle.style.color = 'var(--muted)';
                toggle.style.display = 'none'; // Hidden until child added

                const childrenUL = document.createElement('ul'); 
                childrenUL.style.listStyle = 'none'; 
                childrenUL.style.padding = '0 0 0 8px'; 
                childrenUL.style.margin = '4px 0 0 0'; 
                childrenUL.className = 'children';
                childrenUL.style.display = 'block'; // Default open

                container.appendChild(left); 
                container.appendChild(toggle);
                li.appendChild(container);
                li.appendChild(childrenUL);
                parentUL.appendChild(li);
                lastH2Li = li;

                toggle.addEventListener('click', () => {
                    const open = childrenUL.style.display !== 'none';
                    childrenUL.style.display = open ? 'none' : 'block';
                    toggle.textContent = open ? '▸' : '▾';
                });

            } else if (level === 3) {
                // Level 3: Simple link
                const parentUL = (lastH2Li && lastH2Li.querySelector('.children')) || (lastH1Li && lastH1Li.querySelector('.children')) || rootUL;
                
                // Show parent H2 toggle if applicable
                if (lastH2Li && parentUL === lastH2Li.querySelector('.children')) {
                    const t = lastH2Li.querySelector('.toc-toggle');
                    if (t) t.style.display = 'block';
                }

                const innerLi = document.createElement('li'); 
                innerLi.style.marginBottom = '3px';
                link.classList.add('toc-h3');
                innerLi.appendChild(link);
                parentUL.appendChild(innerLi);
            }
        });

        tocNav.appendChild(rootUL);

        // Mark first link active
        function setActiveTOCLink(link){
            tocNav.querySelectorAll('a').forEach(x => x.classList.remove('active'));
            if (link) link.classList.add('active');
        }
        // set first active
        const firstLink = tocNav.querySelector('a'); if (firstLink) setActiveTOCLink(firstLink);

        // Mobile toggle behavior
        const toggleBtn = mobileToolbar.querySelector('.docs-toggle-btn');
        toggleBtn.addEventListener('click', () => {
            const isOpen = sidebar.classList.toggle('open');
            toggleBtn.textContent = isOpen ? 'Hide' : 'Show';
            toggleBtn.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) sidebar.scrollIntoView({behavior:'smooth', block:'start'});
        });

        // Update active link on scroll (basic)
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking){
                window.requestAnimationFrame(() => {
                    let current = null;
                    headings.forEach(h => { if (h.getBoundingClientRect().top <= 120) current = h; });
                    if (current){
                        const link = tocNav.querySelector('a[href="#'+current.id+'"]');
                        if (link) setActiveTOCLink(link);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Open external links in new tab
        main.querySelectorAll('a').forEach(a => { const href = a.getAttribute('href')||''; if (href.startsWith('http')) a.setAttribute('target','_blank'); });

    } catch (e) {
        console.error('[Docs] load failed', e);
        showError('Could not load documentation: ' + (e && e.message ? e.message : String(e)));
    }
})();
