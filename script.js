/*
 * Core client side logic for the Leeward Point guestbook.  This file
 * fetches the data.json file, applies branding colours, and drives
 * the content on each page.  Where possible the code avoids external
 * dependencies, keeping the site lightweight and fully static.
 */

// Cached copy of the data file
let _cachedData;

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
  const title = document.createElement('h2');
  title.textContent = guide.name || 'Guestbook';
  main.appendChild(title);
  const welcome = document.createElement('p');
  welcome.textContent = 'Welcome to your digital guestbook and guide.';
  main.appendChild(welcome);
  // Contact information
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
  categories.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.classList.add('category');
    const catTitle = document.createElement('h3');
    catTitle.textContent = cat.title;
    catDiv.appendChild(catTitle);
    if (cat.subcategories && cat.subcategories.length > 0) {
      const ul = document.createElement('ul');
      ul.classList.add('list');
      cat.subcategories.forEach(sub => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = sub.title;
        a.href = `/subcategory.html?id=${encodeURIComponent(sub.id)}`;
        a.classList.add('item-link');
        li.appendChild(a);
        ul.appendChild(li);
      });
      catDiv.appendChild(ul);
    }
    main.appendChild(catDiv);
  });
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
  const items = subcategory.items || [];
  if (items.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'There are no entries for this section yet.';
    main.appendChild(p);
  } else {
    const ul = document.createElement('ul');
    ul.classList.add('list');
    items.forEach(item => {
      const li = document.createElement('li');
      const h = document.createElement('h4');
      h.textContent = item.title;
      li.appendChild(h);
      if (item.description) {
        const d = document.createElement('p');
        d.textContent = item.description;
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
        for (const item of sub.items || []) {
          if ((item.title || '').toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q)) {
            results.push({ type: 'Item', title: item.title, href: `/subcategory.html?id=${encodeURIComponent(sub.id)}` });
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
  buildNav();
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = '';
  // Check if a passcode hash exists
  const storedHash = localStorage.getItem('adminPasscode');
  async function renderAdminPanel() {
    main.innerHTML = '';
    const h = document.createElement('h2');
    h.textContent = 'Admin Panel';
    main.appendChild(h);
    // GitHub Token setup
    const tokenLabel = document.createElement('label');
    tokenLabel.textContent = 'GitHub Personal Access Token:';
    main.appendChild(tokenLabel);
    const tokenInput = document.createElement('input');
    tokenInput.type = 'password';
    tokenInput.value = localStorage.getItem('githubToken') || '';
    main.appendChild(tokenInput);
    const saveTokenBtn = document.createElement('button');
    saveTokenBtn.textContent = 'Save Token';
    saveTokenBtn.onclick = () => {
      localStorage.setItem('githubToken', tokenInput.value);
      alert('Token saved locally.');
    };
    main.appendChild(saveTokenBtn);
    // Publish and rollback buttons
    const publishBtn = document.createElement('button');
    publishBtn.textContent = 'Publish Site';
    publishBtn.onclick = () => {
      publishSite();
    };
    main.appendChild(publishBtn);
    const rollbackBtn = document.createElement('button');
    rollbackBtn.textContent = 'Rollback';
    rollbackBtn.onclick = () => {
      rollbackSite();
    };
    main.appendChild(rollbackBtn);
    // AI suggestions
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.style.marginTop = '1rem';
    const sTitle = document.createElement('h3');
    sTitle.textContent = 'Suggestions';
    suggestionsDiv.appendChild(sTitle);
    const ul = document.createElement('ul');
    ul.classList.add('list');
    generateSuggestions(data).forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      ul.appendChild(li);
    });
    suggestionsDiv.appendChild(ul);
    main.appendChild(suggestionsDiv);
  }
  if (!storedHash) {
    // No passcode set yet, prompt user to set one
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
    // Passcode exists; ask user to enter it
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
        renderAdminPanel();
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
        if (!sub.items || sub.items.length === 0) {
          suggestions.push(`Add items to the section "${sub.title}".`);
        }
      });
    }
  });
  if (suggestions.length === 0) {
    suggestions.push('Everything looks good! Consider adding more local tips.');
  }
  return suggestions;
}

/** Placeholder publish implementation.  It calls GitHub’s REST API to
 * create a commit that touches an empty file with a timestamp.  This
 * requires that the user has provided a personal access token and the
 * repository is already configured.  If the call fails an alert is
 * shown. */
async function publishSite() {
  const token = localStorage.getItem('githubToken');
  if (!token) {
    alert('No GitHub token saved. Please save your personal access token.');
    return;
  }
  // Determine repo from settings
  const data = await getData();
  const repo = data.settings?.publish?.github_repo;
  const branch = data.settings?.publish?.github_branch || 'main';
  if (!repo) {
    alert('GitHub repository not configured in data.json.');
    return;
  }
  const apiBase = 'https://api.github.com';
  // Create a file path with timestamp
  const path = `deploy-${Date.now()}.txt`;
  const message = `Automated publish at ${new Date().toISOString()}`;
  const content = btoa('published');
  const url = `${apiBase}/repos/${repo}/contents/${path}`;
  try {
    const resp = await fetch(url, {
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