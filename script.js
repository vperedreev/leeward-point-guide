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
  ,
  // Additional icons for new info tiles
  'house-tour': 'fa-house'
  ,
  'how-to': 'fa-lightbulb'
};

// Draft data used by the admin panel for editing
let draftData = null;
// Track currently edited entity for admin panel
let currentEdit = null;

// Mapping of how-to guide icons to Font Awesome classes
const HOWTO_ICONS = {
  'hot-tub': 'fa-hot-tub',
  'grill': 'fa-fire-burner',
  'thermostat': 'fa-temperature-high',
  'kitchen': 'fa-utensils',
  'laundry': 'fa-soap',
  'tv': 'fa-tv',
  'key': 'fa-key'
};

// Icons for local area subcategories (restaurants, cafes, bars, etc.)
const SUBCATEGORY_ICONS = {
  'restaurants': 'fa-utensils',
  'cafes': 'fa-mug-saucer',
  'bars': 'fa-beer',
  'breweries': 'fa-beer-mug-empty',
  'day-trips': 'fa-car',
  'walks-trails': 'fa-person-walking',
  'sightseeing': 'fa-binoculars',
  'beaches': 'fa-umbrella-beach',
  'quick-picks': 'fa-star'
};

// Colours for map pins based on map_pin_type
const PIN_COLORS = {
  'restaurant': '#c0392b',    // red
  'cafe': '#2980b9',          // blue
  'bar': '#e67e22',           // orange
  'brewery': '#d35400',       // dark orange
  'trail': '#16a085',         // teal
  'attraction': '#8e44ad',    // purple
  'museum': '#8e44ad',
  'zoo': '#8e44ad',
  'market': '#f1c40f',        // yellow
  'pier': '#27ae60',          // green
  'beach': '#3498db',         // light blue
  'park': '#27ae60',          // green
  'tip': '#7f8c8d'            // grey
};

/** Render the house tour page. Shows image groups and unsorted images. */
async function loadHouseTour() {
  const data = await getData();
  await applyBrand();
  // Highlight the info tab since house tour lives under info
  buildNav('info');
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = 'House Tour';
  main.appendChild(title);
  const ht = data.house_tour || {};
  const groups = ht.groups || [];
  groups.forEach(group => {
    if (group.id === 'unsorted') return; // handle unsorted separately
    const section = document.createElement('section');
    const h3 = document.createElement('h3');
    h3.textContent = group.title;
    section.appendChild(h3);
    const gallery = document.createElement('div');
    gallery.className = 'gallery-grid';
    if (group.tiles && group.tiles.length > 0) {
      group.tiles.forEach(tile => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        const img = document.createElement('img');
        img.src = tile.image_url;
        img.alt = tile.caption || '';
        item.appendChild(img);
        if (tile.caption) {
          const cap = document.createElement('p');
          cap.textContent = tile.caption;
          item.appendChild(cap);
        }
        gallery.appendChild(item);
      });
    } else {
      const p = document.createElement('p');
      p.textContent = 'No images yet.';
      gallery.appendChild(p);
    }
    section.appendChild(gallery);
    main.appendChild(section);
  });
  // Unsorted images
  const incoming = ht.incoming || [];
  if (incoming.length > 0) {
    const section = document.createElement('section');
    const h3 = document.createElement('h3');
    h3.textContent = 'Unsorted';
    section.appendChild(h3);
    const gallery = document.createElement('div');
    gallery.className = 'gallery-grid';
    incoming.forEach(path => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const img = document.createElement('img');
      img.src = path.startsWith('/') ? path : '/' + path;
      img.alt = '';
      item.appendChild(img);
      gallery.appendChild(item);
    });
    section.appendChild(gallery);
    main.appendChild(section);
  }
  const qrBtn = document.getElementById('qr-button');
  if (qrBtn) qrBtn.onclick = showQR;
}

/** Render the How‑To guide list page. */
async function loadHowTo() {
  const data = await getData();
  await applyBrand();
  buildNav('info');
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = 'How‑To Guides';
  main.appendChild(title);
  const items = (data.how_to && data.how_to.items) || [];
  const grid = document.createElement('div');
  grid.className = 'icon-grid';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'icon-card';
    const iconEl = document.createElement('i');
    const faClass = HOWTO_ICONS[item.icon] || 'fa-circle-info';
    iconEl.className = 'fa-solid ' + faClass;
    card.appendChild(iconEl);
    const span = document.createElement('span');
    span.textContent = item.title;
    card.appendChild(span);
    card.onclick = () => {
      window.location.href = '/howto-item.html?id=' + encodeURIComponent(item.id);
    };
    grid.appendChild(card);
  });
  main.appendChild(grid);
  const qrBtn = document.getElementById('qr-button');
  if (qrBtn) qrBtn.onclick = showQR;
}

/** Render an individual How‑To guide details page. */
async function loadHowToItem() {
  const data = await getData();
  await applyBrand();
  buildNav('info');
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = '';
  const id = getQueryParam('id');
  const items = (data.how_to && data.how_to.items) || [];
  const item = items.find(i => i.id === id);
  if (!item) {
    main.textContent = 'Guide not found.';
    return;
  }
  const title = document.createElement('h2');
  title.textContent = item.title;
  main.appendChild(title);
  const ol = document.createElement('ol');
  item.steps.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    ol.appendChild(li);
  });
  main.appendChild(ol);
  const qrBtn = document.getElementById('qr-button');
  if (qrBtn) qrBtn.onclick = showQR;
}

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
    // Click handler to open subcategory or category page
    card.onclick = () => {
      // Navigate using the category id.  If the category has multiple
      // subcategories (e.g. local area), the subcategory page will
      // display a grid of those subcategories.  Otherwise it will
      // fall back to the single subcategory’s topics.
      window.location.href = `/subcategory.html?id=${encodeURIComponent(cat.id)}`;
    };
    grid.appendChild(card);
  });
  main.appendChild(grid);

  // Add additional tiles for House Tour and How‑To Guides
  const extras = document.createElement('div');
  extras.className = 'icon-grid';
  // House Tour card
  const houseCard = document.createElement('div');
  houseCard.className = 'icon-card';
  const houseIcon = document.createElement('i');
  houseIcon.className = 'fa-solid fa-house';
  houseCard.appendChild(houseIcon);
  const houseSpan = document.createElement('span');
  houseSpan.textContent = 'House Tour';
  houseCard.appendChild(houseSpan);
  houseCard.onclick = () => {
    window.location.href = '/house-tour.html';
  };
  extras.appendChild(houseCard);
  // How‑To Guides card
  const howCard = document.createElement('div');
  howCard.className = 'icon-card';
  const howIcon = document.createElement('i');
  howIcon.className = 'fa-solid fa-lightbulb';
  howCard.appendChild(howIcon);
  const howSpan = document.createElement('span');
  howSpan.textContent = 'How‑To Guides';
  howCard.appendChild(howSpan);
  howCard.onclick = () => {
    window.location.href = '/howto.html';
  };
  extras.appendChild(howCard);
  main.appendChild(extras);
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
  const id = getQueryParam('id');
  // Determine whether id refers to a category or a subcategory
  let category = null;
  let subcategory = null;
  // Find a matching category
  if (data.categories) {
    for (const cat of data.categories) {
      if (cat.id === id) {
        category = cat;
        break;
      }
    }
  }
  // Find a matching subcategory only if no category matched
  if (!category) {
    outer: if (data.categories) {
      for (const cat of data.categories) {
        for (const sub of cat.subcategories || []) {
          if (sub.id === id) { subcategory = sub; break outer; }
        }
      }
    }
  }
  // If id matches a category and it has multiple subcategories, show a grid of subcategories
  if (category && (category.subcategories || []).length > 1) {
    const heading = document.createElement('h2');
    heading.textContent = category.title;
    main.appendChild(heading);
    const grid = document.createElement('div');
    grid.className = 'subcategory-grid';
    (category.subcategories || []).forEach(sub => {
      const card = document.createElement('div');
      card.className = 'subcategory-card';
      const icon = document.createElement('i');
      const iconClass = SUBCATEGORY_ICONS[sub.id] || 'fa-folder';
      icon.className = `fa-solid ${iconClass}`;
      card.appendChild(icon);
      const span = document.createElement('span');
      span.textContent = sub.title;
      card.appendChild(span);
      card.onclick = () => {
        window.location.href = `/subcategory.html?id=${encodeURIComponent(sub.id)}`;
      };
      grid.appendChild(card);
    });
    main.appendChild(grid);
  } else {
    // Determine the subcategory to display
    if (!subcategory && category) {
      // Category with a single subcategory
      subcategory = (category.subcategories || [])[0];
    }
    if (!subcategory) {
      main.textContent = 'Subcategory not found.';
      return;
    }
    const h2 = document.createElement('h2');
    h2.textContent = subcategory.title;
    main.appendChild(h2);
    const topics = subcategory.topics || [];
    if (!topics || topics.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'There are no entries for this section yet.';
      main.appendChild(p);
    } else {
      const grid = document.createElement('div');
      grid.className = 'topic-grid';
      topics.forEach(topic => {
        const card = document.createElement('div');
        card.className = 'topic-card';
        // Optional image if provided
        if (topic.image_url) {
          const img = document.createElement('img');
          img.src = topic.image_url;
          img.alt = topic.title;
          card.appendChild(img);
        }
        const ttitle = document.createElement('h4');
        ttitle.textContent = topic.title;
        card.appendChild(ttitle);
        if (topic.body_md || topic.description) {
          const d = document.createElement('p');
          d.textContent = topic.body_md || topic.description;
          card.appendChild(d);
        }
        // Clicking a topic opens the map highlighting this location
        card.onclick = () => {
          window.location.href = `/map.html?topic=${encodeURIComponent(topic.id)}`;
        };
        grid.appendChild(card);
      });
      main.appendChild(grid);
    }
  }
  // Reattach QR code handler
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
  // Load Leaflet library dynamically if it is not already loaded
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
  const params = new URLSearchParams(window.location.search);
  const highlightId = params.get('topic');
  // Property coordinates
  const coords = data.guide.coordinates || { lat: 0, lng: 0 };
  // Create map
  const map = L.map('map').setView([coords.lat, coords.lng], data.settings.map?.zoom || 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  // Marker for the property itself
  L.marker([coords.lat, coords.lng]).addTo(map)
    .bindPopup(data.guide.name || 'Location');
  // Helper to compute distance between two lat/lng points in kilometres
  function computeDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of earth in km
    const toRad = (deg) => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  // Flatten all topics and place markers
  const markers = [];
  let idx = 1;
  (data.categories || []).forEach(cat => {
    (cat.subcategories || []).forEach(sub => {
      (sub.topics || []).forEach(topic => {
        // Only plot if there is a map pin type
        if (!topic.map_pin_type) return;
        let lat = parseFloat(topic.lat);
        let lng = parseFloat(topic.lng);
        // Assign a pseudo-random coordinate near the property if missing
        if (!lat || !lng) {
          const offsetLat = 0.02 * Math.cos(idx);
          const offsetLng = 0.02 * Math.sin(idx);
          lat = coords.lat + offsetLat;
          lng = coords.lng + offsetLng;
          idx++;
        }
        const color = PIN_COLORS[topic.map_pin_type] || '#3498db';
        const marker = L.circleMarker([lat, lng], {
          radius: 8,
          color: color,
          fillColor: color,
          fillOpacity: 0.8
        }).addTo(map);
        const distKm = computeDistance(coords.lat, coords.lng, lat, lng);
        const distMi = (distKm * 0.621371).toFixed(1);
        marker.bindPopup(`<strong>${topic.title}</strong><br>${distMi} mi from house`);
        markers.push({ id: topic.id, marker: marker });
      });
    });
  });
  // Highlight a specific topic if provided
  if (highlightId) {
    const m = markers.find(x => x.id === highlightId);
    if (m) {
      m.marker.openPopup();
      map.setView(m.marker.getLatLng(), 14);
    }
  }
  // Add legend for categories colours
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'info legend');
    const labels = [];
    // Build legend entries based on PIN_COLORS
    for (const [type, col] of Object.entries(PIN_COLORS)) {
      labels.push(`<i style="background:${col}; width:10px; height:10px; display:inline-block; margin-right:4px;"></i>${type}`);
    }
    div.innerHTML = labels.join('<br>');
    return div;
  };
  legend.addTo(map);
  // QR code handler
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

/**
 * Render an Image Sorter overlay for assigning incoming house tour
 * images to groups.  Only available in the admin panel.  Allows
 * dragging images from the Unsorted list into group containers.  On
 * save, the assignments are written into draftData.house_tour.groups
 * and removed from draftData.house_tour.incoming.
 */
function renderImageSorter() {
  // Ensure we have draft data and a house_tour section
  if (!draftData || !draftData.house_tour) {
    alert('House tour data not loaded.');
    return;
  }
  const ht = draftData.house_tour;
  // Create overlay
  let overlay = document.getElementById('image-sorter-overlay');
  if (overlay) overlay.remove();
  overlay = document.createElement('div');
  overlay.id = 'image-sorter-overlay';
  overlay.className = 'image-sorter-overlay';
  // Close on click outside
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  };
  // Modal container
  const modal = document.createElement('div');
  modal.className = 'image-sorter';
  overlay.appendChild(modal);
  // Header
  const header = document.createElement('h2');
  header.textContent = 'Image Sorter';
  modal.appendChild(header);
  // Description
  const desc = document.createElement('p');
  desc.textContent = 'Drag images from Unsorted into the appropriate group. Click Save when finished.';
  modal.appendChild(desc);
  // Groups container
  const groupsContainer = document.createElement('div');
  groupsContainer.className = 'groups-container';
  modal.appendChild(groupsContainer);
  // Build group columns (excluding unsorted)
  ht.groups.forEach(group => {
    if (group.id === 'unsorted') return;
    const gDiv = document.createElement('div');
    gDiv.className = 'group';
    gDiv.dataset.groupId = group.id;
    // Header
    const gHeader = document.createElement('div');
    gHeader.className = 'group-header';
    gHeader.textContent = group.title;
    gDiv.appendChild(gHeader);
    // Existing tiles in group (if any)
    const tileList = document.createElement('div');
    tileList.className = 'tile-list';
    // Populate existing assigned tiles
    if (group.tiles) {
      group.tiles.forEach(tile => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'image-item';
        itemDiv.draggable = true;
        itemDiv.dataset.imagePath = tile.image_url;
        itemDiv.dataset.groupId = group.id;
        const img = document.createElement('img');
        img.src = tile.image_url;
        img.alt = tile.caption || '';
        itemDiv.appendChild(img);
        tileList.appendChild(itemDiv);
      });
    }
    gDiv.appendChild(tileList);
    // Drag events
    gDiv.addEventListener('dragover', e => {
      e.preventDefault();
    });
    gDiv.addEventListener('drop', e => {
      e.preventDefault();
      const path = e.dataTransfer.getData('text/plain');
      if (!path) return;
      // Create tile in UI
      const newItem = document.createElement('div');
      newItem.className = 'image-item';
      newItem.draggable = true;
      newItem.dataset.imagePath = path;
      newItem.dataset.groupId = group.id;
      const imgEl = document.createElement('img');
      imgEl.src = path.startsWith('/') ? path : '/' + path;
      imgEl.alt = '';
      newItem.appendChild(imgEl);
      // Append to this group
      tileList.appendChild(newItem);
      // Remove from unsorted UI
      const sourceEl = groupsContainer.querySelector(`.unsorted .image-item[data-image-path="${path}"]`);
      if (sourceEl) sourceEl.remove();
      // Update draftData assignments
      // Remove from incoming
      const idx = ht.incoming.findIndex(p => p === path || p === '/' + path);
      if (idx !== -1) {
        ht.incoming.splice(idx, 1);
      }
      // Add to group's tiles if not already present
      const tileObj = { image_url: path.startsWith('/') ? path : '/' + path, caption: '' };
      if (!group.tiles) group.tiles = [];
      group.tiles.push(tileObj);
    });
    groupsContainer.appendChild(gDiv);
  });
  // Unsorted column
  const unsortedDiv = document.createElement('div');
  unsortedDiv.className = 'group unsorted';
  unsortedDiv.dataset.groupId = 'unsorted';
  const unsortedHeader = document.createElement('div');
  unsortedHeader.className = 'group-header';
  unsortedHeader.textContent = 'Unsorted';
  unsortedDiv.appendChild(unsortedHeader);
  const unsortedList = document.createElement('div');
  unsortedList.className = 'tile-list';
  ht.incoming.forEach(path => {
    const item = document.createElement('div');
    item.className = 'image-item';
    item.draggable = true;
    item.dataset.imagePath = path;
    const img = document.createElement('img');
    img.src = path.startsWith('/') ? path : '/' + path;
    img.alt = '';
    item.appendChild(img);
    unsortedList.appendChild(item);
  });
  unsortedDiv.appendChild(unsortedList);
  // Drag start for unsorted items
  unsortedDiv.addEventListener('dragstart', e => {
    const target = e.target.closest('.image-item');
    if (!target) return;
    e.dataTransfer.setData('text/plain', target.dataset.imagePath);
  });
  // Drag events for unsorted (allow dragging back? optional)
  unsortedDiv.addEventListener('dragover', e => {
    e.preventDefault();
  });
  unsortedDiv.addEventListener('drop', e => {
    e.preventDefault();
    const path = e.dataTransfer.getData('text/plain');
    if (!path) return;
    // Move from group back to unsorted UI
    const allGroupItems = groupsContainer.querySelectorAll('.group:not(.unsorted) .image-item');
    allGroupItems.forEach(item => {
      if (item.dataset.imagePath === path) {
        // Remove from group's UI
        item.remove();
      }
    });
    // Add to unsorted if not present
    const exists = unsortedList.querySelector(`.image-item[data-image-path="${path}"]`);
    if (!exists) {
      const newItem = document.createElement('div');
      newItem.className = 'image-item';
      newItem.draggable = true;
      newItem.dataset.imagePath = path;
      const imgEl = document.createElement('img');
      imgEl.src = path.startsWith('/') ? path : '/' + path;
      imgEl.alt = '';
      newItem.appendChild(imgEl);
      unsortedList.appendChild(newItem);
    }
    // Update draftData assignments: remove from all group tiles and add back to incoming
    ht.groups.forEach(g => {
      if (g.id === 'unsorted') return;
      if (g.tiles) {
        const index = g.tiles.findIndex(t => t.image_url === path || t.image_url === '/' + path);
        if (index !== -1) {
          g.tiles.splice(index, 1);
        }
      }
    });
    // Add back to incoming if not exist
    if (!ht.incoming.includes(path) && !ht.incoming.includes('/' + path)) {
      ht.incoming.push(path);
    }
  });
  groupsContainer.appendChild(unsortedDiv);
  // Save & Close buttons
  const actionsDiv = document.createElement('div');
  actionsDiv.style.marginTop = '1rem';
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.onclick = () => {
    // Save assignments already updated in drop events
    alert('Assignments saved in draft. Remember to Publish to commit changes.');
    overlay.remove();
  };
  actionsDiv.appendChild(saveBtn);
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.onclick = () => {
    overlay.remove();
  };
  actionsDiv.appendChild(closeBtn);
  modal.appendChild(actionsDiv);
  document.body.appendChild(overlay);
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

  // Image Sorter button
  const sorterBtn = document.createElement('button');
  sorterBtn.textContent = 'Image Sorter';
  sorterBtn.onclick = () => {
    renderImageSorter();
  };
  controls.appendChild(sorterBtn);
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
    // Bump data_version prior to publishing
    if (!draftData.settings) draftData.settings = {};
    draftData.settings.data_version = new Date().toISOString();
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
    case 'house-tour': loadHouseTour(); break;
    case 'howto': loadHowTo(); break;
    case 'howto-item': loadHowToItem(); break;
  }
  const qrCloseBtn = document.getElementById('qr-close');
  if (qrCloseBtn) {
    qrCloseBtn.onclick = closeQR;
  }
});