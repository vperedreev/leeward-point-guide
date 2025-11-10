/*
 * Core client side logic for the Leeward Point guestbook.  This file
 * fetches the data.json file, applies branding colours, and drives
 * the content on each page.  Where possible the code avoids external
 * dependencies, keeping the site lightweight and fully static.
 */

// Cached copy of the data file
let _cachedData;

// Mapping of category IDs to Font Awesome icon classes for the info page
const CATEGORY_ICONS = {
  'arrival-parking': 'fa-car',
  'access-checkin': 'fa-key',
  'wifi': 'fa-wifi',
  'rules-safety': 'fa-shield-alt',
  'checkout': 'fa-door-open',
  'local-area': 'fa-map',
  'book-again': 'fa-shopping-bag'
};

// Draft data used by the admin panel for editing
let draftData = null;
// Track currently edited entity for admin panel
let currentEdit = null;

/** Fetch and cache the site data. */
async function getData() {
  if (_cachedData) return _cachedData;
  const resp = await fetch('/data.json');
  _cachedData = await resp.json();
  return _cachedData;
}

/** Apply the brand styling from the settings onto CSS variables. */
async function applyBrand() {
  const data = await getData();
  const brand = data.settings?.brand || {};
  const root = document.documentElement;
  if (brand.primary_color) root.style.setProperty('--primary-color', brand.primary_color);
  if (brand.secondary_color) root.style.setProperty('--secondary-color', brand.secondary_color);
  if (brand.font_stack) root.style.setProperty('--font-stack', brand.font_stack);
}

/** Build the navigation bar.  Pass the id of the current page so it
 * can be highlighted. */
function buildNav(current) {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const links = [
    { id: 'home', title: 'HOME', href: '/index.html' },
    { id: 'info', title: 'INFO', href: '/info.html' },
    { id: 'map', title: 'MAP', href: '/map.html' },
    { id: 'search', title: 'SEARCH', href: '/search.html' }
  ];
  nav.innerHTML = '';
  links.forEach(({ id, title, href }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = title;
    if (current === id) a.classList.add('active');
    nav.appendChild(a);
  });
}

/** Helper to parse query parameters from the current URL. */
function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/** Show a QR code for the current page.  This uses an external API
 * (qrserver.com) to generate a PNG.  The QR code is loaded into
 * the #qr-code container and a modal is displayed. */
function showQR() {
  const modal = document.getElementById('qr-modal');
  const container = document.getElementById('qr-code');
  if (!modal || !container) return;
  const url = window.location.href;
  const encoded = encodeURIComponent(url);
  const img = document.createElement('img');
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`;
  img.alt = 'QR code';
  container.innerHTML = '';
  container.appendChild(img);
  modal.classList.remove('hidden');
}

/** Close the QR modal. */
function closeQR() {
  const modal = document.getElementById('qr-modal');
  if (modal) modal.classList.add('hidden');
}

/** Render the home page. */
async function loadHome() {
  const data = await getData();
  await applyBrand();
  buildNav('home');
  const main = document.querySelector('main');
  if (!main) return;
  const guide = data.guide || {};
  main.innerHTML = '';
  // Build hero banner
  const hero = document.getElementById('hero') || document.createElement('div');
  hero.id = 'hero';
  hero.className = 'hero';
  // Use hero_image from settings or fallback
  const heroImg = data.settings?.hero_image || '';
  if (heroImg) {
    hero.style.backgroundImage = `url('${heroImg}')`;
  }
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';
  const hTitle = document.createElement('h2');
  hTitle.textContent = guide.name || 'Guestbook';
  heroContent.appendChild(hTitle);
  if (guide.address) {
    const addr = document.createElement('p');
    addr.textContent = guide.address;
    heroContent.appendChild(addr);
  }
  const welcome = document.createElement('p');
  welcome.textContent = 'Welcome to your digital guestbook and guide.';
  heroContent.appendChild(welcome);
  const btnWrapper = document.createElement('div');
  btnWrapper.className = 'hero-buttons';
  // View Info button
  const infoBtn = document.createElement('button');
  infoBtn.textContent = 'View Info';
  infoBtn.onclick = () => {
    window.location.href = '/info.html';
  };
  btnWrapper.appendChild(infoBtn);
  // Open Map button
  const mapBtn = document.createElement('button');
  mapBtn.textContent = 'Open Map';
  mapBtn.onclick = () => {
    window.location.href = '/map.html';
  };
  btnWrapper.appendChild(mapBtn);
  heroContent.appendChild(btnWrapper);
  hero.innerHTML = '';
  hero.appendChild(heroContent);
  // Append hero to main
  main.appendChild(hero);
  // Contact information below hero
  if (guide.contact) {
    const contact = document.createElement('div');
    contact.innerHTML = `<p><strong>Host phone:</strong> ${guide.contact.host_phone || ''}</p>` +
                        `<p><strong>Host email:</strong> ${guide.contact.host_email || ''}</p>`;
    main.appendChild(contact);
  }
  // QR code button
  const qrBtn = document.getElementById('qr-button');
  if (qrBtn) {
    qrBtn.onclick = showQR;
  }
}

/** Render the info page listing categories and subcategories. */
async function loadInfo() {
  const data = await getData();
  await applyBrand();
  buildNav('info');
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = '';
  const categories = data.categories || [];
  // Build an icon grid for categories
  const grid = document.createElement('div');
  grid.className = 'icon-grid';
  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'icon-card';
    // Icon element
    const iconEl = document.createElement('i');
    const iconClass = CATEGORY_ICONS[cat.id] || 'fa-folder';
    iconEl.className = `fa-solid ${iconClass}`;
    card.appendChild(iconEl);
    // Title
    const span = document.createElement('span');
    span.textContent = cat.title;
    card.appendChild(span);
    // Click handler to open subcategory list
    card.onclick = () => {
      window.location.href = `/subcategory.html?id=${encodeURIComponent(cat.subcategories && cat.subcategories[0]?.id || '')}`;
    };
    grid.appendChild(card);
  });
  main.appendChild(grid);
  const qrBtn = document.getElementById('qr-button');
  if (qrBtn) {
    qrBtn.onclick = showQR;
  }
}

/** Render an individual subcategory page.  The subcategory id is read
 * from the query string.  It displays the title and items. */
async function loadSubcategory() {
  const data = await getData();
  await applyBrand();
  buildNav('info');
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = '';
  const subId = getQueryParam('id');
  let subcategory;
  outer: for (const cat of data.categories || []) {
    for (const sub of cat.subcategories || []) {
      if (sub.id === subId) { subcategory = sub; break outer; }
    }
  }
  if (!subcategory) {
    main.textContent = 'Subcategory not found.';
    return;
  }
  const title = document.createElement('h2');
  title.textContent = subcategory.title;
  main.appendChild(title);
  // Use topics array from data instead of items
  const topics = subcategory.topics || subcategory.items || [];
  if (!topics || topics.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'There are no entries for this section yet.';
    main.appendChild(p);
  } else {
    const ul = document.createElement('ul');
    ul.classList.add('list');
    topics.forEach(topic => {
      const li = document.createElement('li');
      const h = document.createElement('h4');
      h.textContent = topic.title;
      li.appendChild(h);
      if (topic.body_md || topic.description) {
        const d = document.createElement('p');
        d.textContent = topic.body_md || topic.description;
        li.appendChild(d);
      }
      ul.appendChild(li);
    });
    main.appendChild(ul);
  }
  const qrBtn = document.getElementById('qr-button');
  if (qrBtn) {
    qrBtn.onclick = showQR;
  }
}

/** Render the search page.  Allows user to search across categories,
 * subcategories and items.  It builds a simple index at runtime. */
async function loadSearch() {
  const data = await getData();
  await applyBrand();
  buildNav('search');
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = '';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type to search...';
  main.appendChild(input);
  const resultsDiv = document.createElement('div');
  main.appendChild(resultsDiv);
  function performSearch(q) {
    q = q.toLowerCase();
    resultsDiv.innerHTML = '';
    if (q.length < 2) return;
    const results = [];
    // Search categories
    for (const cat of data.categories || []) {
      if (cat.title.toLowerCase().includes(q)) {
        results.push({ type: 'Category', title: cat.title, href: `/info.html` });
      }
      for (const sub of cat.subcategories || []) {
        if (sub.title.toLowerCase().includes(q)) {
          results.push({ type: 'Section', title: sub.title, href: `/subcategory.html?id=${encodeURIComponent(sub.id)}` });
        }
        const topicList = sub.topics || sub.items || [];
        for (const item of topicList) {
          const titleStr = (item.title || '').toLowerCase();
          const bodyStr = (item.body_md || item.description || '').toLowerCase();
          if (titleStr.includes(q) || bodyStr.includes(q)) {
            results.push({ type: 'Topic', title: item.title, href: `/subcategory.html?id=${encodeURIComponent(sub.id)}` });
          }
        }
      }
    }
    if (results.length === 0) {
      resultsDiv.textContent = 'No results found.';
    } else {
      const ul = document.createElement('ul');
      ul.classList.add('list');
      results.forEach(r => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = `${r.type}: ${r.title}`;
        a.href = r.href;
        a.classList.add('item-link');
        li.appendChild(a);
        ul.appendChild(li);
      });
      resultsDiv.appendChild(ul);
    }
  }
  input.addEventListener('input', () => performSearch(input.value));
  const qrBtn = document.getElementById('qr-button');
  if (qrBtn) {
    qrBtn.onclick = showQR;
  }
}

/** Render the map page.  This page uses Leaflet to display the
 * coordinates defined in the data file.  The map library is loaded
 * from a CDN and will show a marker at the property location. */
async function loadMap() {
  const data = await getData();
  await applyBrand();
  buildNav('map');
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = '<div id="map" style="height: 60vh; width: 100%;"></div>';
  // Load Leaflet if not already present
  if (typeof L === 'undefined') {
    await new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Leaflet'));
      document.body.appendChild(script);
    });
  }
  const coords = data.guide.coordinates || { lat: 0, lng: 0 };
  const map = L.map('map').setView([coords.lat, coords.lng], data.settings.map?.zoom || 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  L.marker([coords.lat, coords.lng]).addTo(map)
    .bindPopup(data.guide.name || 'Location')
    .openPopup();
  const qrBtn = document.getElementById('qr-button');
  if (qrBtn) {
    qrBtn.onclick = showQR;
  }
}

/** Hash a passcode using SHA-256 via the browser crypto API. Returns
 * a hex string. */
async function hashPasscode(pass) {
  const enc = new TextEncoder().encode(pass);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Render the admin page.  Provides passcode setup, Git publish and
 * rollback actions, plus simple AI suggestions.  Sensitive values
 * (passcodes and tokens) are stored in localStorage on the user’s
 * device and never transmitted to the server. */
async function loadAdmin() {
  const data = await getData();
  await applyBrand();
  buildNav('admin');
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = '';
  // Check if a passcode hash exists
  const storedHash = localStorage.getItem('adminPasscode');
  // Show passcode setup or login
  if (!storedHash) {
    const h = document.createElement('h2');
    h.textContent = 'Set Admin Passcode';
    main.appendChild(h);
    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'Enter new passcode';
    main.appendChild(input);
    const btn = document.createElement('button');
    btn.textContent = 'Set Passcode';
    btn.onclick = async () => {
      const hash = await hashPasscode(input.value);
      localStorage.setItem('adminPasscode', hash);
      alert('Passcode set. Please refresh the page.');
    };
    main.appendChild(btn);
  } else {
    const h = document.createElement('h2');
    h.textContent = 'Admin Login';
    main.appendChild(h);
    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'Enter passcode';
    main.appendChild(input);
    const btn = document.createElement('button');
    btn.textContent = 'Login';
    btn.onclick = async () => {
      const hash = await hashPasscode(input.value);
      if (hash === localStorage.getItem('adminPasscode')) {
        // Initialise draft data and render admin panel
        draftData = JSON.parse(JSON.stringify(data));
        initAdminPanel();
      } else {
        alert('Incorrect passcode');
      }
    };
    main.appendChild(btn);
  }
  const qrBtn = document.getElementById('qr-button');
  if (qrBtn) {
    qrBtn.onclick = showQR;
  }
}

/** Generate simple suggestions based on missing entries in the data. */
function generateSuggestions(data) {
  const suggestions = [];
  if (!data.categories || data.categories.length === 0) {
    suggestions.push('Add categories to your guide.');
    return suggestions;
  }
  data.categories.forEach(cat => {
    if (!cat.subcategories || cat.subcategories.length === 0) {
      suggestions.push(`Add sections within "${cat.title}".`);
    } else {
      cat.subcategories.forEach(sub => {
        const topics = sub.topics || sub.items || [];
        if (!topics || topics.length === 0) {
          suggestions.push(`Add topics to the section "${sub.title}".`);
        }
      });
    }
  });
  if (suggestions.length === 0) {
    suggestions.push('Everything looks good! Consider adding more local tips.');
  }
  return suggestions;
}

/**
 * Initialise the admin panel UI once the user has authenticated.  This
 * function builds a sidebar listing all categories, subcategories and
 * topics and an editor pane for editing titles, bodies and map types.
 */
function initAdminPanel() {
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = '';
  // Container for the admin interface
  const container = document.createElement('div');
  container.className = 'admin-container';
  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'admin-sidebar';
  container.appendChild(sidebar);
  // Editor area
  const editor = document.createElement('div');
  editor.className = 'admin-editor';
  container.appendChild(editor);
  main.appendChild(container);
  // Controls container
  const controls = document.createElement('div');
  controls.className = 'admin-controls';
  // GitHub token input
  const tokenLabel = document.createElement('label');
  tokenLabel.textContent = 'GitHub Personal Access Token:';
  controls.appendChild(tokenLabel);
  const tokenInput = document.createElement('input');
  tokenInput.type = 'password';
  tokenInput.value = localStorage.getItem('githubToken') || '';
  controls.appendChild(tokenInput);
  const saveTokenBtn = document.createElement('button');
  saveTokenBtn.textContent = 'Save Token';
  saveTokenBtn.onclick = () => {
    localStorage.setItem('githubToken', tokenInput.value);
    alert('Token saved locally.');
  };
  controls.appendChild(saveTokenBtn);
  // Save draft button
  const saveDraftBtn = document.createElement('button');
  saveDraftBtn.textContent = 'Save Draft';
  saveDraftBtn.onclick = () => {
    if (draftData) {
      localStorage.setItem('draftData', JSON.stringify(draftData));
      alert('Draft saved locally.');
    }
  };
  controls.appendChild(saveDraftBtn);
  // Download JSON button
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'Download JSON';
  downloadBtn.onclick = () => {
    if (!draftData) return;
    const dataStr = JSON.stringify(draftData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  controls.appendChild(downloadBtn);
  // Publish site button
  const publishBtn = document.createElement('button');
  publishBtn.textContent = 'Publish';
  publishBtn.onclick = async () => {
    await publishSite(true);
  };
  controls.appendChild(publishBtn);
  // Rollback button
  const rollbackBtn = document.createElement('button');
  rollbackBtn.textContent = 'Rollback';
  rollbackBtn.onclick = () => {
    rollbackSite();
  };
  controls.appendChild(rollbackBtn);
  main.appendChild(controls);
  // Generate suggestions section
  const suggestionsDiv = document.createElement('div');
  suggestionsDiv.style.marginTop = '1rem';
  const sTitle = document.createElement('h3');
  sTitle.textContent = 'Suggestions';
  suggestionsDiv.appendChild(sTitle);
  const sugList = document.createElement('ul');
  sugList.className = 'list';
  generateSuggestions(draftData).forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    sugList.appendChild(li);
  });
  suggestionsDiv.appendChild(sugList);
  main.appendChild(suggestionsDiv);
  // Build sidebar listing
  buildAdminSidebar(sidebar, editor);
  // Autosave draft every 5 seconds
  setInterval(() => {
    if (draftData) {
      localStorage.setItem('draftData', JSON.stringify(draftData));
    }
  }, 5000);
}

/**
 * Build the sidebar listing all categories, subcategories and topics.
 * Clicking an entry populates the editor pane with editable fields.
 *
 * @param {HTMLElement} sidebar The container for the navigation list
 * @param {HTMLElement} editor The container for the editor form
 */
function buildAdminSidebar(sidebar, editor) {
  sidebar.innerHTML = '';
  const list = document.createElement('ul');
  // Iterate categories
  draftData.categories?.forEach((cat, cIndex) => {
    const catItem = document.createElement('li');
    catItem.textContent = cat.title;
    catItem.onclick = () => {
      selectEdit('category', cIndex, null, null, editor);
      setActive(catItem);
    };
    list.appendChild(catItem);
    // Subcategories
    cat.subcategories?.forEach((sub, sIndex) => {
      const subItem = document.createElement('li');
      subItem.style.paddingLeft = '1rem';
      subItem.textContent = '– ' + sub.title;
      subItem.onclick = () => {
        selectEdit('subcategory', cIndex, sIndex, null, editor);
        setActive(subItem);
      };
      list.appendChild(subItem);
      // Topics
      (sub.topics || sub.items || []).forEach((topic, tIndex) => {
        const topicItem = document.createElement('li');
        topicItem.style.paddingLeft = '2rem';
        topicItem.textContent = '• ' + topic.title;
        topicItem.onclick = () => {
          selectEdit('topic', cIndex, sIndex, tIndex, editor);
          setActive(topicItem);
        };
        list.appendChild(topicItem);
      });
    });
  });
  sidebar.appendChild(list);

  // Helper to highlight active item
  function setActive(item) {
    const items = sidebar.querySelectorAll('li');
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  }
}

/**
 * Populate the editor pane based on the selected entity type.
 * This function binds change events to update draftData.
 *
 * @param {string} type One of 'category', 'subcategory' or 'topic'
 * @param {number} cIndex Index of category
 * @param {number|null} sIndex Index of subcategory
 * @param {number|null} tIndex Index of topic
 * @param {HTMLElement} editor The editor container
 */
function selectEdit(type, cIndex, sIndex, tIndex, editor) {
  currentEdit = { type, cIndex, sIndex, tIndex };
  editor.innerHTML = '';
  const dataRef = getDataRef(type, cIndex, sIndex, tIndex);
  if (!dataRef) return;
  // Title field
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Title';
  editor.appendChild(titleLabel);
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = dataRef.title || '';
  titleInput.oninput = () => {
    dataRef.title = titleInput.value;
  };
  editor.appendChild(titleInput);
  // Body/Description for topics
  if (type === 'topic') {
    const bodyLabel = document.createElement('label');
    bodyLabel.textContent = 'Body';
    editor.appendChild(bodyLabel);
    const bodyArea = document.createElement('textarea');
    bodyArea.rows = 6;
    bodyArea.value = dataRef.body_md || dataRef.description || '';
    bodyArea.oninput = () => {
      dataRef.body_md = bodyArea.value;
    };
    editor.appendChild(bodyArea);
    // Map pin type selector
    const typeLabel = document.createElement('label');
    typeLabel.textContent = 'Map Pin Type';
    editor.appendChild(typeLabel);
    const typeSelect = document.createElement('select');
    const options = ['text', 'location', 'cafe', 'bar', 'trail', 'beach'];
    options.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      if (dataRef.type === opt) o.selected = true;
      typeSelect.appendChild(o);
    });
    typeSelect.onchange = () => {
      dataRef.type = typeSelect.value;
    };
    editor.appendChild(typeSelect);
  }
}

/**
 * Helper to return a reference to the object in draftData for the
 * requested entity.  Returns null if not found.
 */
function getDataRef(type, cIndex, sIndex, tIndex) {
  if (!draftData) return null;
  const cat = draftData.categories?.[cIndex];
  if (!cat) return null;
  if (type === 'category') return cat;
  const sub = cat.subcategories?.[sIndex ?? 0];
  if (!sub) return null;
  if (type === 'subcategory') return sub;
  const topics = sub.topics || sub.items || [];
  const topic = topics?.[tIndex ?? 0];
  if (!topic) return null;
  return topic;
}

/** Placeholder publish implementation.  It calls GitHub’s REST API to
 * create a commit that touches an empty file with a timestamp.  This
 * requires that the user has provided a personal access token and the
 * repository is already configured.  If the call fails an alert is
 * shown. */
async function publishSite(updateData = false) {
  const token = localStorage.getItem('githubToken');
  if (!token) {
    alert('No GitHub token saved. Please save your personal access token.');
    return;
  }
  const data = await getData();
  const repo = data.settings?.publish?.github_repo;
  const branch = data.settings?.publish?.github_branch || 'main';
  if (!repo) {
    alert('GitHub repository not configured in data.json.');
    return;
  }
  const apiBase = 'https://api.github.com';
  if (updateData && draftData) {
    // Publish updated data.json to the repository
    try {
      // Fetch current file to obtain its SHA
      const fileResp = await fetch(`${apiBase}/repos/${repo}/contents/data.json?ref=${branch}`, {
        headers: { 'Authorization': `token ${token}` }
      });
      if (!fileResp.ok) {
        const text = await fileResp.text();
        alert('Failed to fetch data.json: ' + text);
        return;
      }
      const fileInfo = await fileResp.json();
      const sha = fileInfo.sha;
      const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(draftData, null, 2))));
      const commitMessage = `Update data.json via admin panel at ${new Date().toISOString()}`;
      const putResp = await fetch(`${apiBase}/repos/${repo}/contents/data.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: newContent,
          sha: sha,
          branch: branch
        })
      });
      if (putResp.ok) {
        alert('data.json updated successfully. Vercel redeploy will trigger shortly.');
      } else {
        const text = await putResp.text();
        alert('Failed to update data.json: ' + text);
      }
    } catch (err) {
      alert('Publish failed: ' + err);
    }
  } else {
    // Trigger a dummy commit to redeploy
    const path = `deploy-${Date.now()}.txt`;
    const message = `Automated publish at ${new Date().toISOString()}`;
    const content = btoa('published');
    try {
      const resp = await fetch(`${apiBase}/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          content: content,
          branch: branch
        })
      });
      if (resp.ok) {
        alert('Publish triggered successfully.');
      } else {
        const text = await resp.text();
        alert('Publish failed: ' + text);
      }
    } catch (err) {
      alert('Publish failed: ' + err);
    }
  }
}

/** Placeholder rollback implementation.  It lists the commits on
 * GitHub and attempts to revert to the previous one. */
async function rollbackSite() {
  const token = localStorage.getItem('githubToken');
  if (!token) {
    alert('No GitHub token saved.');
    return;
  }
  const data = await getData();
  const repo = data.settings?.publish?.github_repo;
  const branch = data.settings?.publish?.github_branch || 'main';
  if (!repo) {
    alert('Repository not configured.');
    return;
  }
  const apiBase = 'https://api.github.com';
  try {
    // Get the list of commits
    const commitsResp = await fetch(`${apiBase}/repos/${repo}/commits?sha=${branch}`, {
      headers: { 'Authorization': `token ${token}` }
    });
    const commits = await commitsResp.json();
    if (!Array.isArray(commits) || commits.length < 2) {
      alert('Not enough commit history to rollback.');
      return;
    }
    const latest = commits[0].sha;
    const previous = commits[1].sha;
    // Create a branch update (force) to previous commit
    const refUrl = `${apiBase}/repos/${repo}/git/refs/heads/${branch}`;
    const resp = await fetch(refUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sha: previous, force: true })
    });
    if (resp.ok) {
      alert('Rollback successful.');
    } else {
      const text = await resp.text();
      alert('Rollback failed: ' + text);
    }
  } catch (err) {
    alert('Rollback failed: ' + err);
  }
}

// Detect the page from body dataset attribute and load appropriate
// content.  Also hook up the QR modal close button.  This runs after
// DOMContentLoaded.
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  switch (page) {
    case 'home': loadHome(); break;
    case 'info': loadInfo(); break;
    case 'subcategory': loadSubcategory(); break;
    case 'search': loadSearch(); break;
    case 'map': loadMap(); break;
    case 'admin': loadAdmin(); break;
  }
  const qrCloseBtn = document.getElementById('qr-close');
  if (qrCloseBtn) {
    qrCloseBtn.onclick = closeQR;
  }
});