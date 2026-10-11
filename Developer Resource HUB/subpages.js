/* ===== Developer Resource Hub - shared script for all 6 sub pages ===== */
document.addEventListener('DOMContentLoaded', () => {
  const center = document.querySelector('center') || document.body;

  /* ---------- 1. Clean up empty <h2> left by unclosed tags ---------- */
  document.querySelectorAll('h2').forEach((h) => {
    if (!h.textContent.trim() && !h.querySelector('*')) h.remove();
  });

  /* ---------- 2. Open external links safely in a new tab ---------- */
  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });

  /* ---------- 3. Small shared styles (hover, buttons) ---------- */
  const style = document.createElement('style');
  style.textContent = `
    h2 a:hover { color: #f43f5e !important; text-decoration: underline; }
    .hub-bar { display:flex; gap:12px; justify-content:center; align-items:center;
               flex-wrap:wrap; margin:16px auto; max-width:700px; padding:0 12px; }
    .hub-bar input { flex:1; min-width:220px; padding:10px 14px; border-radius:5px;
               border:1px solid #6b1224; background:#520b19; color:#FFF1F2; font-size:16px; }
    .hub-bar input::placeholder { color:#fda4af; }
    .hub-btn { background:#D8C29D; color:#180108; border:none; border-radius:5px;
               padding:8px 14px; cursor:pointer; font-weight:bold; text-decoration:none;
               font-family:sans-serif; font-size:14px; }
    .hub-btn:hover { background:#fda4af; }
    .copy-btn { margin-left:10px; padding:2px 8px; font-size:12px; vertical-align:middle; }
    #hub-top { position:fixed; right:20px; bottom:20px; display:none; z-index:10; }
    #hub-count, #hub-empty { color:#D8C29D; font-family:sans-serif; text-align:center; }
    #hub-empty { display:none; }
  `;
  document.head.appendChild(style);

  /* ---------- 4. Collect repositories and video groups ---------- */
  const repos = [];
  document.querySelectorAll('h2').forEach((h) => {
    const a = h.querySelector('a[href*="github.com"]');
    if (!a) return;
    const items = [h];
    let next = h.nextElementSibling;
    while (next && (next.tagName === 'PRE' || next.tagName === 'BR')) {
      items.push(next);
      next = next.nextElementSibling;
    }
    repos.push({ els: items, text: (h.textContent + ' ' + items.map((e) => e.textContent).join(' ')).toLowerCase() });
  });

  const videos = [];
  document.querySelectorAll('h2').forEach((h) => {
    const f = h.querySelector('font');
    if (!f || !/^\s*\d+\./.test(f.textContent)) return;
    const items = [h];
    let next = h.nextElementSibling;
    while (next && !(next.tagName === 'H2' && next.querySelector('font'))
           && next.tagName !== 'HR' && next.tagName !== 'CENTER') {
      items.push(next);
      const wasBr = next.tagName === 'BR';
      next = next.nextElementSibling;
      if (wasBr) break;
    }
    videos.push({ els: items, text: h.textContent.toLowerCase() });
  });

  /* ---------- 5. Copy-link buttons ---------- */
  document.querySelectorAll('h2 a[href^="http"]').forEach((a) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hub-btn copy-btn';
    btn.textContent = 'Copy link';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(a.href);
        btn.textContent = 'Copied!';
      } catch (e) {
        btn.textContent = 'Press Ctrl+C';
        window.prompt('Copy this link:', a.href);
      }
      setTimeout(() => (btn.textContent = 'Copy link'), 1500);
    });
    a.parentElement.appendChild(btn);
  });

  /* ---------- 6. Search bar + Home button ---------- */
  const bar = document.createElement('div');
  bar.className = 'hub-bar';
  bar.innerHTML =
    '<a class="hub-btn" href="index.html">&larr; Home</a>' +
    '<input id="hub-search" type="search" placeholder="Search repositories and videos (press / to focus)">';
  const firstHr = center.querySelector('hr');
  if (firstHr) firstHr.after(bar);
  else center.prepend(bar);

  const count = document.createElement('p');
  count.id = 'hub-count';
  count.textContent = repos.length + ' repositories | ' + videos.length + ' video sections';
  bar.after(count);

  const empty = document.createElement('p');
  empty.id = 'hub-empty';
  empty.textContent = 'Nothing matches your search.';
  count.after(empty);

  const search = bar.querySelector('#hub-search');
  const setVisible = (group, show) => group.els.forEach((el) => (el.style.display = show ? '' : 'none'));

  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    [...repos, ...videos].forEach((g) => {
      const match = !q || g.text.includes(q);
      setVisible(g, match);
      if (match) shown++;
    });
    empty.style.display = q && !shown ? 'block' : 'none';
  });

  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) {
      e.preventDefault();
      search.focus();
    }
    if (e.key === 'Escape') {
      search.value = '';
      search.dispatchEvent(new Event('input'));
      search.blur();
    }
  });

  /* ---------- 7. Back-to-top button ---------- */
  const top = document.createElement('button');
  top.id = 'hub-top';
  top.type = 'button';
  top.className = 'hub-btn';
  top.textContent = '↑ Top';
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(top);
  window.addEventListener('scroll', () => {
    top.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
});