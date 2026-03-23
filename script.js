(() => {
  const list       = document.getElementById('project-list');
  const emptyState = document.getElementById('empty-state');
  const searchEl   = document.getElementById('search');
  const totalEl    = document.getElementById('total-count');
  const liveEl     = document.getElementById('live-count');
  const filterGroup= document.getElementById('category-filters');

  let projects = [];
  let activeCategory = 'all';

  // ── FETCH DATA ──────────────────────────────────────────────
  fetch('./indexing.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      projects = data;
      init();
    })
    .catch(err => {
      list.innerHTML = `<div class="empty-state">failed to load indexing.json — ${err.message}</div>`;
    });

  // ── INIT ────────────────────────────────────────────────────
  function init() {
    updateMeta();
    buildCategoryFilters();
    render();

    searchEl.addEventListener('input', render);
  }

  // ── META COUNTS ─────────────────────────────────────────────
  function updateMeta() {
    const live = projects.filter(p => p.status === 'live').length;
    totalEl.textContent = `${projects.length} project${projects.length !== 1 ? 's' : ''}`;
    liveEl.textContent  = `${live} live`;
  }

  // ── CATEGORY FILTER BUTTONS ─────────────────────────────────
  function buildCategoryFilters() {
    const cats = [...new Set(projects.map(p => p.category).filter(Boolean))].sort();
    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.cat = cat;
      btn.textContent = cat;
      btn.addEventListener('click', () => setCategory(cat));
      filterGroup.appendChild(btn);
    });

    // wire up 'all' button
    filterGroup.querySelector('[data-cat="all"]').addEventListener('click', () => setCategory('all'));
  }

  function setCategory(cat) {
    activeCategory = cat;
    filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    render();
  }

  // ── RENDER ──────────────────────────────────────────────────
  function render() {
    const query = searchEl.value.trim().toLowerCase();

    const filtered = projects.filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      if (!matchCat) return false;
      if (!query) return true;

      return (
        (p.name        || '').toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query) ||
        (p.deployed_on || '').toLowerCase().includes(query) ||
        (p.subdomain   || '').toLowerCase().includes(query) ||
        (p.category    || '').toLowerCase().includes(query) ||
        (p.tags || []).some(t => t.toLowerCase().includes(query))
      );
    });

    list.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    filtered.forEach(p => list.appendChild(buildRow(p)));
  }

  // ── BUILD ROW ────────────────────────────────────────────────
  function buildRow(p) {
    const row = document.createElement('div');
    row.className = 'project-row';

    // name + optional repo link
    const repoHtml = p.repo
      ? `<a class="repo-link" href="${esc(p.repo)}" target="_blank" rel="noopener">${esc(p.repo.replace('https://github.com/', 'gh/'))}</a>`
      : '';

    // tags
    const tagsHtml = (p.tags || [])
      .map(t => `<span class="tag">${esc(t)}</span>`)
      .join('');

    // status
    const statusClass = `status-${(p.status || 'unknown').toLowerCase()}`;

    // subdomain — use explicit p.subdomain field, fallback to extracting from p.url
    let subdomainDisplay = '—';
    let subdomainHref = p.url || null;

    if (p.subdomain) {
      subdomainDisplay = p.subdomain;
      // if subdomain doesn't have a protocol, use p.url as the href
      subdomainHref = p.url || `https://${p.subdomain}`;
    } else if (p.url) {
      try {
        subdomainDisplay = new URL(p.url).hostname;
      } catch (_) {
        subdomainDisplay = p.url;
      }
    }

    const subdomainHtml = subdomainHref
      ? `<a href="${esc(subdomainHref)}" target="_blank" rel="noopener">${esc(subdomainDisplay)}</a>`
      : subdomainDisplay;

    row.innerHTML = `
      <div class="col-name">
        <a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a>
        ${repoHtml}
      </div>
      <div class="col-desc">${esc(p.description || '—')}</div>
      <div class="col-platform">${esc(p.deployed_on || '—')}</div>
      <div class="col-subdomain">${subdomainHtml}</div>
      <div class="col-tags">${tagsHtml || '<span class="tag" style="opacity:0.3">—</span>'}</div>
      <div class="col-status"><span class="status-badge ${statusClass}">${esc(p.status || '?')}</span></div>
    `;

    return row;
  }

  // ── UTILS ────────────────────────────────────────────────────
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
