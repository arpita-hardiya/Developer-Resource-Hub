/* ===== Developer Resource Hub - main page (index.html) =====
   - Search ALL repositories from the 6 sub pages (+ the ones you add)
   - Add a new repository (saved in the browser, survives refresh)
*/
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'devhub_repos_v2';

  /* ---------- 1. Repositories that are on the 6 sub pages ---------- */
  const PAGES = {
    Frontend: 'frontend.html',
    Backend: 'backend.html',
    DevOps: 'devops.html',
    API: 'api.html',
    'Cloud Computing': 'cloud.html',
    IoT: 'iot.html',
  };

  const BUILT_IN = [
    // Frontend
    { name: 'Front-End Web Development Resources', url: 'https://github.com/RitikPatni/Front-End-Web-Development-Resources', cat: 'Frontend', desc: 'Directory of learning links, tutorial lists and roadmaps for beginners.' },
    { name: 'Front-End Checklist', url: 'https://github.com/thedaviddias/Front-End-Checklist', cat: 'Frontend', desc: 'Checklist of front-end best practices: HTML, CSS, JavaScript, performance, accessibility, SEO, security.' },
    { name: 'Frontend Challenges', url: 'https://github.com/felipefialho/frontend-challenges', cat: 'Frontend', desc: 'Real-world mock assignments that imitate frontend interview tests.' },
    // Backend
    { name: "Backend Engineer's Guide", url: 'https://github.com/djeada/Backend-Engineers-Guide', cat: 'Backend', desc: 'Reference notes on core backend concepts, databases, protocols and performance.' },
    { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', cat: 'Backend', desc: 'Learn to design scalable systems, with interview questions and case studies.' },
    { name: 'Full Stack FastAPI Template', url: 'https://github.com/fastapi/full-stack-fastapi-template', cat: 'Backend', desc: 'Production-ready boilerplate with FastAPI, PostgreSQL, SQLModel, Docker, JWT auth and CI/CD.' },
    // DevOps
    { name: 'devops-exercises', url: 'https://github.com/bregman-arie/devops-exercises', cat: 'DevOps', desc: 'Thousands of exercises and interview questions: Linux, AWS, Docker, Kubernetes, Terraform and more.' },
    { name: 'devops-projects', url: 'https://github.com/techiescamp/devops-projects', cat: 'DevOps', desc: 'Hands-on DevOps projects from beginner to advanced level.' },
    { name: 'The Book of Secret Knowledge', url: 'https://github.com/trimstray/the-book-of-secret-knowledge', cat: 'DevOps', desc: 'Cheat sheets, manuals, one-liners and tools for DevOps engineers and sysadmins.' },
    // API
    { name: 'public-apis', url: 'https://github.com/public-apis/public-apis', cat: 'API', desc: 'Community list of free APIs grouped by topic: sports, finance, weather, games.' },
    { name: 'OpenAPI Specification', url: 'https://github.com/OAI/OpenAPI-Specification', cat: 'API', desc: 'The standard for describing REST APIs; contract-first design and automation.' },
    { name: 'awesome', url: 'https://github.com/sindresorhus/awesome', cat: 'API', desc: 'Curated lists of high-quality resources and developer tools.' },
    // Cloud Computing
    { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', cat: 'Cloud Computing', desc: 'Sharding, load balancing, caching and microservices: the base of cloud architecture.' },
    { name: 'awesome-design-patterns', url: 'https://github.com/DovAmir/awesome-design-patterns', cat: 'Cloud Computing', desc: 'Software and architectural design patterns, useful for microservices and distributed systems.' },
    { name: 'awesome-cloud-architect', url: 'https://github.com/NaurisSadovskis/awesome-cloud-architect', cat: 'Cloud Computing', desc: 'Resources for cloud architects: distributed systems guides and design patterns.' },
    // IoT
    { name: 'IoT For Beginners (Microsoft)', url: 'https://github.com/microsoft/IoT-For-Beginners', cat: 'IoT', desc: 'Project-based curriculum covering farm-to-table IoT applications.' },
    { name: 'Introduction to IoT and Digital Transformation', url: 'https://github.com/rzzel/Introduction-to-IoT-and-Digital-Transformation', cat: 'IoT', desc: 'Foundational concepts of the connected digital ecosystem.' },
    { name: 'IoT-Course (University of Cape Coast)', url: 'https://github.com/uraich/IoT-Course', cat: 'IoT', desc: 'Code companion for an academic IoT course.' },
  ];

  /* ---------- 2. Storage helpers (user-added repos) ---------- */
  const loadAdded = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  };
  const saveAdded = (list) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  };

  /* ---------- 3. Page elements ---------- */
  const inputs = document.querySelectorAll('.search-box input');
  const searchInput = inputs[0];
  const addInput = inputs[1];
  const addBtn = document.querySelector('.search-box button');
  const rows = document.querySelectorAll('.card-row');
  const cards = document.querySelectorAll('.card');

  document.querySelectorAll('.search-box').forEach((f) =>
    f.addEventListener('submit', (e) => e.preventDefault())
  );

  // Make links work outside your own computer (file:///... -> frontend.html)
  document.querySelectorAll('.card a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('file:///')) a.setAttribute('href', decodeURIComponent(href.split('/').pop()));
  });

  // Whole card clickable
  cards.forEach((card) => {
    const link = card.querySelector('a');
    if (!link) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A') window.location.href = link.getAttribute('href');
    });
  });

  /* ---------- 4. Small DOM helper ---------- */
  const el = (tag, css, text) => {
    const n = document.createElement(tag);
    if (css) n.style.cssText = css;
    if (text !== undefined) n.textContent = text;
    return n;
  };

  const repoItem = (repo, removable) => {
    const li = el('li', 'background:#520b19;border:1px solid #6b1224;border-radius:5px;padding:12px 16px;margin-bottom:10px;text-align:left;');
    const top = el('div', 'display:flex;gap:10px;align-items:center;flex-wrap:wrap;');

    const a = el('a', 'color:#FFF1F2;font-weight:bold;font-size:18px;', repo.name);
    a.href = repo.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    const badge = el('a', 'background:#D8C29D;color:#180108;border-radius:12px;padding:2px 10px;font-size:12px;text-decoration:none;', repo.cat);
    if (PAGES[repo.cat]) {
      badge.href = PAGES[repo.cat];
      badge.title = 'Open the ' + repo.cat + ' page';
    }
    top.append(a, badge);

    if (removable) {
      const del = el('button', 'margin-left:auto;background:#f43f5e;color:#fff;border:none;border-radius:4px;cursor:pointer;padding:4px 10px;', 'Remove');
      del.type = 'button';
      del.addEventListener('click', () => {
        saveAdded(loadAdded().filter((r) => r.url !== repo.url));
        refresh();
      });
      top.appendChild(del);
    }

    li.append(top, el('p', 'margin:6px 0 0;color:#fda4af;font-size:14px;', repo.desc));
    return li;
  };

  /* ---------- 5. Results area (search) and "Your repositories" ---------- */
  const wrap = el('div', 'max-width:850px;margin:30px auto;padding:0 16px;color:#FFF1F2;font-family:sans-serif;');
  document.body.appendChild(wrap);

  const resultsBox = el('div', 'display:none;');
  const resultsTitle = el('h2', 'color:#fda4af;text-align:center;');
  const resultsList = el('ul', 'list-style:none;padding:0;');
  const resultsEmpty = el('p', 'text-align:center;color:#D8C29D;display:none;', 'No repository found. Try another keyword, or add it with REPO+.');
  resultsBox.append(resultsTitle, resultsList, resultsEmpty);

  const addedBox = el('div', 'margin-top:30px;');
  addedBox.append(el('h2', 'color:#fda4af;text-align:center;', 'YOUR ADDED REPOSITORIES'));
  const addedList = el('ul', 'list-style:none;padding:0;');
  const addedEmpty = el('p', 'text-align:center;color:#D8C29D;', 'Nothing added yet. Use ADD REPOSITORY above.');
  addedBox.append(addedList, addedEmpty);

  wrap.append(resultsBox, addedBox);

  const allRepos = () => BUILT_IN.concat(loadAdded());

  const renderAdded = () => {
    const added = loadAdded();
    addedList.innerHTML = '';
    added.forEach((r) => addedList.appendChild(repoItem(r, true)));
    addedEmpty.style.display = added.length ? 'none' : 'block';
  };

  const renderSearch = () => {
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const searching = q.length > 0;

    rows.forEach((r) => (r.style.display = searching ? 'none' : ''));
    resultsBox.style.display = searching ? 'block' : 'none';
    if (!searching) return;

    const words = q.split(/\s+/);
    const found = allRepos().filter((r) => {
      const hay = (r.name + ' ' + r.url + ' ' + r.cat + ' ' + r.desc).toLowerCase();
      return words.every((w) => hay.includes(w));
    });

    resultsTitle.textContent = found.length + ' repositor' + (found.length === 1 ? 'y' : 'ies') + ' found';
    resultsList.innerHTML = '';
    found.forEach((r) => resultsList.appendChild(repoItem(r, loadAdded().some((a) => a.url === r.url))));
    resultsEmpty.style.display = found.length ? 'none' : 'block';
  };

  const refresh = () => {
    renderAdded();
    renderSearch();
  };

  if (searchInput) {
    searchInput.addEventListener('input', renderSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.preventDefault();
    });
  }

  /* ---------- 6. Add repository (with category) ---------- */
  let catSelect = null;
  if (addInput) {
    catSelect = el('select', 'padding:6px;border-radius:4px;border:1px solid #6b1224;background:#FFF1F2;');
    Object.keys(PAGES).forEach((c) => {
      const o = document.createElement('option');
      o.value = c;
      o.textContent = c;
      catSelect.appendChild(o);
    });
    addInput.after(catSelect);
  }

  const normalize = (value) => {
    const v = value.trim().replace(/\.git$/i, '').replace(/\/+$/, '');
    let owner, repo;
    let m = v.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)/i);
    if (m) [, owner, repo] = m;
    else if ((m = v.match(/^([\w.-]+)\/([\w.-]+)$/))) [, owner, repo] = m;
    return owner ? { owner, repo, url: 'https://github.com/' + owner + '/' + repo } : null;
  };

  const addRepo = () => {
    const parsed = normalize(addInput.value);
    if (!parsed) {
      alert('Enter a valid GitHub repository, e.g. owner/repo or https://github.com/owner/repo');
      return;
    }
    const exists = allRepos().some((r) => r.url.toLowerCase() === parsed.url.toLowerCase() && r.cat === catSelect.value);
    if (exists) {
      alert('This repository is already in ' + catSelect.value + '.');
      return;
    }
    const added = loadAdded();
    added.push({
      name: parsed.repo,
      url: parsed.url,
      cat: catSelect.value,
      desc: 'Added by you (' + parsed.owner + ')',
    });
    saveAdded(added);
    addInput.value = '';
    refresh();
    addedBox.scrollIntoView({ behavior: 'smooth' });
  };

  if (addBtn && addInput) {
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addRepo();
    });
    addInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addRepo();
      }
    });
  }

  /* ---------- 7. Navigation: HOME | ROADMAP | REPO+ ---------- */
  const goHome = () => {
    if (searchInput) searchInput.value = '';
    renderSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actions = {
    HOME: goHome,
    ROADMAP: () => rows[0] && rows[0].scrollIntoView({ behavior: 'smooth' }),
    'REPO+': () => {
      addedBox.scrollIntoView({ behavior: 'smooth' });
      if (addInput) addInput.focus();
    },
  };
  document.querySelectorAll('.column font').forEach((f) => {
    const fn = actions[f.textContent.trim().toUpperCase()];
    if (fn) {
      f.style.cursor = 'pointer';
      f.addEventListener('click', fn);
    }
  });
  const house = document.querySelector('.fa-house');
  if (house) {
    house.style.cursor = 'pointer';
    house.addEventListener('click', goHome);
  }

  refresh();
});