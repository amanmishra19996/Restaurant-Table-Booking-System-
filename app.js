'use strict';

// ===== HELPERS =====
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function localISODate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isPastDate(value) {
  return value < localISODate(); // ISO strings compare correctly
}

// "18:00", "21:30", 30 -> ['18:00','18:30',...]
function makeSlots(start, end, stepMin = 30) {
  const toMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const out = [];
  for (let t = toMin(start); t <= toMin(end); t += stepMin) {
    out.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
  }
  return out;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ===== DATA =====

const dishes = [
  { image: 'images/dim sum.jpg', tag: 'Asian Cuisine', name: 'Steamed Dim sum', desc: 'Delicate steamed dumplings served warm with a flavorful dipping sauce.', price: '₹750', badge: "Chef's Choice" },
  { image: 'images/makke roti.jpg', tag: 'Punjabi Special', name: 'Makke ka roti with sarson da saag', desc: 'Traditional Punjabi corn flatbread served with mustard greens and white butter.', price: '₹450', badge: 'Seasonal Favorite' },
  { image: 'images/pav bhaji.jpg', tag: 'Indian Street Food', name: 'Pav Bhaji', desc: 'Spiced vegetable bhaji served with buttery toasted pav, fresh onions and lemon.', price: '₹300', badge: 'Bestseller' },
  { image: 'images/Sushi.jpg', tag: 'Japanese Cuisine', name: 'Avocado Sushi Roll', desc: 'Delicate sushi rolls with creamy avocado, and seasoned rice.', price: '₹900', badge: 'Vegetarian Pick' },
  { image: 'images/gulab jamun.jpg', tag: 'Desserts', name: 'Gulab Jamun', desc: 'Soft, golden milk dumplings soaked in fragrant sugar syrup.', price: '₹150', badge: 'Classic' },
  { image: 'images/paneer tikka.jpg', tag: 'Starters', name: 'Paneer Tikka', desc: 'Smoky, marinated paneer grilled with peppers and served with mint chutney.', price: '₹600', badge: 'Customer Favorite' }
];

const reviews = [
  { text: 'Every course arrived with quiet confidence. Nothing to prove, nothing overdone. A rare evening where I stopped thinking and simply ate.', name: 'Priya Mehta', meta: 'Food Writer · The Hindu', avatar: '👩', stars: 5 },
  { text: 'The kind of restaurant that appears in memories months later. Chef Beaumont\u2019s restraint is what makes everything feel so precise.', name: 'Arjun Kapoor', meta: 'Guest · December 2023', avatar: '👨', stars: 5 },
  { text: 'We celebrated our anniversary here and left changed. The sommelier was exceptional, the halibut was perfect, and the night was ours.', name: 'Deepika Singh', meta: 'Guest · February 2024', avatar: '👩‍🦱', stars: 5 },
  { text: 'Service that anticipates without intruding. The mushroom risotto alone justifies the trip from Mumbai. Already planning the next visit.', name: 'Rahul Varma', meta: 'Guest · March 2024', avatar: '🧑', stars: 5 },
  { text: 'Aurum is exactly what fine dining should be — generous without being excessive. I\u2019ve been to far more expensive, and far less memorable.', name: 'Meera Pillai', meta: 'Culinary Critic', avatar: '👩‍🍳', stars: 5 },
];

// Build a table list from zones: [['Zone name', [seats, seats, ...]], ...]
// `reservedIds` = tables permanently held back (walk-ins etc.). Ids are sequential per venue.
function buildTables(zones, reservedIds = []) {
  const out = [];
  let id = 1;
  zones.forEach(([zone, seatList]) => {
    seatList.forEach(seats => {
      out.push({
        id, seats, zone,
        type: seats <= 2 ? 'round' : seats >= 6 ? 'rectangle' : 'square',
        base: reservedIds.includes(id) ? 'reserved' : 'available',
      });
      id++;
    });
  });
  return out;
}

// ---- VENUES ----
// NOTE: names, addresses, phone numbers and coordinates below are SAMPLE data.
// Replace each with the real venue details (get lat/lng by right-clicking the place in Google Maps).
const venues = [
  {
    id: 'The Brew', name: 'The Brew', type: 'Restaurant', cuisine: 'Fine Dining · Modern European',
    image: 'images/venues/the brew.jpg', rating: 4.9, price: '₹₹₹₹',
    area: 'Connaught Place',
    address: '12 Chandni Chowk Lane, Connaught Place, New Delhi, 110001',
    phone: '+91 11 4567 8900',
    lat: 28.6315, lng: 77.2167,
    hours: 'Tue – Sun · 18:00 – 22:30', closedDays: [1],
    slots: makeSlots('18:00', '21:30'),
    tables: buildTables([['Window', [2, 2, 4, 4]], ['Main Floor', [4, 6, 4, 4, 2]], ['Private Room', [8, 6, 4]]], [2, 6, 11]),
  },
  {
    id: 'The Spice Route', name: 'The Spice Route', type: 'Restaurant', cuisine: 'North Indian · Mughlai',
    image: 'images/venues/spice-route.jpg', rating: 4.6, price: '₹₹₹',
    area: 'Khan Market',
    address: '24 Middle Lane, Khan Market, New Delhi, 110003',
    phone: '+91 11 4123 5500',
    lat: 28.6003, lng: 77.2273,
    hours: 'Daily · 12:00 – 22:30', closedDays: [],
    slots: makeSlots('12:00', '21:30'),
    tables: buildTables([['Main Hall', [2, 2, 4, 4, 4, 6]], ['Terrace', [2, 4, 4]]], [3]),
  },
  {
    id: 'Sakura House', name: 'Sakura House', type: 'Restaurant', cuisine: 'Japanese · Sushi & Ramen',
    image: 'images/venues/sakura-house.jpg', rating: 4.7, price: '₹₹₹',
    area: 'Cyber Hub, Gurugram',
    address: 'DLF Cyber Hub, Sector 24, Gurugram, Haryana, 122002',
    phone: '+91 124 456 7800',
    lat: 28.4957, lng: 77.0889,
    hours: 'Daily · 12:00 – 23:00', closedDays: [],
    slots: makeSlots('12:00', '21:30'),
    tables: buildTables([['Sushi Counter', [2, 2, 2, 2]], ['Dining Room', [4, 4, 4, 6, 8]]], [1, 7]),
  },
  {
    id: 'Brew & Bloom', name: 'Brew & Bloom', type: 'Cafe', cuisine: 'Specialty Coffee · Brunch',
    image: 'images/venues/brew-bloom.jpg', rating: 4.5, price: '₹₹',
    area: 'Hauz Khas Village',
    address: '7 Deer Park Road, Hauz Khas Village, New Delhi, 110016',
    phone: '+91 11 4987 6543',
    lat: 28.5535, lng: 77.1942,
    hours: 'Daily · 09:00 – 20:00', closedDays: [],
    slots: makeSlots('09:00', '19:30'),
    tables: buildTables([['Window Bar', [2, 2, 2]], ['Lounge', [4, 4, 6]], ['Garden', [4, 4, 4, 2]]], [2, 8]),
  },
  {
    id: 'Chai & Chapter', name: 'Chai & Chapter', type: 'Cafe', cuisine: 'Books · Chai · Bakes',
    image: 'images/venues/chai-chapter.jpg', rating: 4.4, price: '₹₹',
    area: 'Lodhi Colony',
    address: 'Shop 14, Lodhi Colony Market, New Delhi, 110003',
    phone: '+91 11 4300 2211',
    lat: 28.5896, lng: 77.2230,
    hours: 'Daily · 10:00 – 21:00', closedDays: [],
    slots: makeSlots('10:00', '20:00'),
    tables: buildTables([['Reading Nook', [2, 2, 2, 4]], ['Courtyard', [4, 4, 6]]], [5]),
  },
];

// ===== STATE =====
let currentVenue = null;      // the venue the guest has chosen
let venueFilter = 'all';
let selectedTable = null;
let currentLightboxIndex = 0;
let carouselIndex = 0;
let carouselPerPage = 0;
let carouselInterval = null;
let countdownInterval = null;
let reservations = [];
try {
  reservations = JSON.parse(localStorage.getItem('aurum_reservations') || '[]');
} catch (err) {
  reservations = [];
}

function saveReservations() {
  try { localStorage.setItem('aurum_reservations', JSON.stringify(reservations)); } catch (err) { /* storage unavailable */ }
}

// Reservations saved before multi-venue support belonged to Aurum
function resVenue(r) { return r.venueId || 'aurum'; }

function venueTables() { return currentVenue ? currentVenue.tables : []; }

function venueById(id) { return venues.find(v => v.id === id); }

function isClosedOn(venue, dateStr) {
  if (!venue || !dateStr) return false;
  const day = new Date(dateStr + 'T12:00:00').getDay();
  return venue.closedDays.includes(day);
}

function closedMessage(venue) {
  const names = venue.closedDays.map(d => DAY_NAMES[d] + 's').join(', ');
  return `${venue.name} is closed on ${names}.`;
}

function directionsUrl(v) { return `https://www.google.com/maps/dir/?api=1&destination=${v.lat},${v.lng}`; }
function mapUrl(v) { return `https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`; }

// ===== LOADER =====
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => { loader.style.display = 'none'; }, 700);
  }
  initRevealAnimations();
}

if (document.readyState === 'complete') {
  setTimeout(hideLoader, 1500);
} else {
  window.addEventListener('load', () => setTimeout(hideLoader, 1500));
  setTimeout(hideLoader, 3000);
}

// ===== THEME =====
const themeToggle = document.getElementById('themeToggle');
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('aurum_theme') || 'dark'; } catch (err) { /* ignore */ }
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('aurum_theme', next); } catch (err) { /* ignore */ }
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeToggle.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀' : '☾';
}

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

// ===== PARTICLES =====
function initParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      animation-duration: ${6 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 6}s;
      width: ${1 + Math.random()}px;
      height: ${1 + Math.random()}px;
    `;
    container.appendChild(p);
  }
}
initParticles();

// ===== VENUES (cards, filter, location panel) =====
function renderVenues() {
  const grid = document.getElementById('venuesGrid');
  const list = venues.filter(v => venueFilter === 'all' || v.type === venueFilter);

  grid.innerHTML = list.map(v => `
    <div class="venue-card ${currentVenue && currentVenue.id === v.id ? 'selected' : ''}"
         data-id="${escapeHtml(v.id)}" role="button" tabindex="0"
         aria-label="Select ${escapeHtml(v.name)}">
      <div class="venue-top">
        <span class="venue-type">${escapeHtml(v.type)}</span>
        <span class="venue-rating">★ ${v.rating.toFixed(1)}</span>
        ${v.emoji}
      </div>
      <div class="venue-body">
        <h3 class="venue-name">${escapeHtml(v.name)}</h3>
        <p class="venue-cuisine">${escapeHtml(v.cuisine)} · ${escapeHtml(v.price)}</p>
        <p class="venue-meta">📍 ${escapeHtml(v.area)}</p>
        <p class="venue-meta">🕐 ${escapeHtml(v.hours)}</p>
        <span class="venue-btn">View location &amp; book</span>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.venue-card').forEach(card => {
    const pick = () => selectVenue(card.dataset.id, { scroll: true });
    card.addEventListener('click', pick);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
    });
  });
}

document.getElementById('venueFilters').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  venueFilter = chip.dataset.filter;
  document.querySelectorAll('#venueFilters .chip').forEach(c => c.classList.toggle('active', c === chip));
  renderVenues();
});

function renderLocationPanel() {
  const panel = document.getElementById('locationPanel');
  const v = currentVenue;
  if (!v) { panel.classList.add('hidden'); return; }

  document.getElementById('locationMap').src = `https://maps.google.com/maps?q=${v.lat},${v.lng}&z=16&output=embed`;
  document.getElementById('locationDetails').innerHTML = `
    <div>
      <span class="venue-type" style="position:static;display:inline-block;margin-bottom:10px">${escapeHtml(v.type)}</span>
      <h3>${escapeHtml(v.name)}</h3>
      <p class="venue-cuisine">${escapeHtml(v.cuisine)}</p>
    </div>
    <div class="detail-row"><span>📍</span><div><b>Address</b>${escapeHtml(v.address)}</div></div>
    <div class="detail-row"><span>🕐</span><div><b>Opening hours</b>${escapeHtml(v.hours)}${v.closedDays.length ? ' · Closed ' + v.closedDays.map(d => DAY_NAMES[d] + 's').join(', ') : ''}</div></div>
    <div class="detail-row"><span>📞</span><div><b>Phone</b><a href="tel:${escapeHtml(v.phone.replace(/[^+\d]/g, ''))}">${escapeHtml(v.phone)}</a></div></div>
    <div class="detail-row"><span>🪑</span><div><b>Tables</b>${v.tables.length} tables · ${v.tables.reduce((s, t) => s + t.seats, 0)} seats</div></div>
    <div class="location-actions">
      <a class="btn-ghost" href="${directionsUrl(v)}" target="_blank" rel="noopener">Get Directions</a>
      <a class="btn-ghost" href="${mapUrl(v)}" target="_blank" rel="noopener">Open in Maps</a>
      <a class="btn-primary" href="#reservations">Reserve a Table</a>
    </div>
  `;
  panel.classList.remove('hidden');
}

function renderVenueBanner() {
  const el = document.getElementById('venueBanner');
  if (!currentVenue) {
    el.innerHTML = `<span>No restaurant or cafe selected yet.</span><a href="#restaurants">Choose a venue →</a>`;
    return;
  }
  el.innerHTML = `
    <span>Booking at <strong>${escapeHtml(currentVenue.name)}</strong> · ${escapeHtml(currentVenue.area)} · ${escapeHtml(currentVenue.hours)}</span>
    <a href="#restaurants">Change venue</a>`;
}

function populateTimeSelects() {
  const slots = currentVenue ? currentVenue.slots : [];
  ['searchTime', 'bookingTime'].forEach(id => {
    const el = document.getElementById(id);
    const prev = el.value;
    el.innerHTML = `<option value="">${id === 'searchTime' ? 'Select time' : 'Select a time'}</option>` +
      slots.map(s => `<option>${s}</option>`).join('');
    if (slots.includes(prev)) el.value = prev;
  });
}

function selectVenue(id, { scroll = false } = {}) {
  const v = venueById(id);
  if (!v) return;
  const changed = !currentVenue || currentVenue.id !== v.id;
  currentVenue = v;
  if (changed) {
    selectedTable = null;
    updateSelectedTableUI();
  }
  populateTimeSelects();
  renderVenues();
  renderLocationPanel();
  renderVenueBanner();
  renderFloorPlan();
  if (changed) showToast('success', `${v.name} selected`, `${v.area} · ${v.tables.length} tables`);
  if (scroll) {
    const panel = document.getElementById('locationPanel');
    const top = panel.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// ===== DISHES =====
function renderDishes() {
  const grid = document.getElementById('dishesGrid');

  grid.innerHTML = dishes.map((d, i) => `
    <div class="dish-card reveal reveal-delay-${(i % 3) + 1}">
      <div class="dish-img">
        <img src="${d.image}" alt="${escapeHtml(d.name)}" loading="lazy">
      </div>
      <div class="dish-body">
        <p class="dish-tag">${d.tag}</p>
        <h3 class="dish-name">${d.name}</h3>
        <p class="dish-desc">${d.desc}</p>
        <div class="dish-footer">
          <span class="dish-price">${d.price}</span>
          <span class="dish-badge">${d.badge}</span>
        </div>
      </div>
    </div>
  `).join('');
}
renderDishes();

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current >= target) clearInterval(interval);
    }, 16);
  });
}

let countersFired = false;
const aboutSection = document.getElementById('about');
const aboutObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersFired) {
    countersFired = true;
    animateCounters();
  }
}, { threshold: 0.4 });
aboutObserver.observe(aboutSection);

// ===== AVAILABILITY (venue + slot aware) =====
function getCurrentSlot() {
  return {
    date: document.getElementById('bookingDate').value,
    time: document.getElementById('bookingTime').value,
  };
}

// Guests needed: the booking form's guest count if filled, otherwise the top of the search range.
function getGuestsNeeded() {
  const n = parseInt(document.getElementById('guestCount').value);
  if (n >= 1) return n;
  const range = document.getElementById('searchGuests').value; // e.g. "3–4"
  const nums = range.match(/\d+/g);
  return nums ? parseInt(nums[nums.length - 1]) : 1;
}

function isBooked(venueId, tableId, date, time) {
  return reservations.some(r => resVenue(r) === venueId && r.tableId === tableId && r.date === date && r.time === time);
}

function getTableStatus(table) {
  if (table.base === 'reserved') return 'reserved';
  const { date, time } = getCurrentSlot();
  if (currentVenue && date && time && isBooked(currentVenue.id, table.id, date, time)) return 'reserved';
  if (selectedTable === table.id) return 'selected';
  return 'available';
}

function tableFitsParty(table) {
  return table.seats >= getGuestsNeeded();
}

// ===== FLOOR PLAN =====
function renderFloorPlan() {
  const plan = document.getElementById('floorPlan');
  const tables = venueTables();

  if (!currentVenue) {
    plan.innerHTML = `<div class="floor-empty">Select a restaurant or cafe first to see its tables.<br><a href="#restaurants">Browse venues</a></div>`;
    return;
  }

  // Drop the selection if the slot changed and that table is now taken
  if (selectedTable) {
    const sel = tables.find(t => t.id === selectedTable);
    if (!sel || getTableStatus(sel) === 'reserved') {
      selectedTable = null;
      updateSelectedTableUI();
    }
  }

  const zones = [...new Set(tables.map(t => t.zone))];
  plan.innerHTML = zones.map(zone => {
    const zoneTables = tables.filter(t => t.zone === zone);
    return `
      <div class="floor-zone">
        <div class="floor-zone-label">${escapeHtml(zone)}</div>
        <div class="floor-row">
          ${zoneTables.map(t => {
            const status = getTableStatus(t);
            const tooSmall = status !== 'reserved' && !tableFitsParty(t);
            const interactive = status !== 'reserved' && !tooSmall;
            const label = tooSmall
              ? `Table ${t.id} · ${t.seats} seats · too small for ${getGuestsNeeded()} guests`
              : `Table ${t.id} · ${t.seats} seats · ${status}`;
            return `
            <div class="table-item ${t.type === 'round' ? 'round' : ''} ${status} ${tooSmall ? 'too-small' : ''}"
                 data-id="${t.id}" data-seats="${t.seats}" data-zone="${escapeHtml(t.zone)}"
                 title="${label}"
                 ${interactive ? 'role="button" tabindex="0"' : 'aria-disabled="true"'}>
              <span class="table-num">${t.id}</span>
              <span class="table-seats">${t.seats}p</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');

  plan.querySelectorAll('.table-item:not(.reserved):not(.too-small)').forEach(el => {
    el.addEventListener('click', () => selectTable(parseInt(el.dataset.id)));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectTable(parseInt(el.dataset.id));
      }
    });
  });
}

function updateSelectedTableUI() {
  const table = venueTables().find(t => t.id === selectedTable);
  const text = document.getElementById('selectedTableText');
  const info = document.getElementById('tableInfo');
  if (!table) {
    text.textContent = 'No table selected — choose from the floor plan above.';
    info.classList.add('hidden');
    return;
  }
  text.textContent = `Table ${table.id} selected at ${currentVenue.name} — ${table.zone}, seats up to ${table.seats} guests.`;
  document.getElementById('tableInfoText').textContent = `Table ${table.id}: ${table.zone} · ${table.seats} seats · ${table.type}`;
  info.classList.remove('hidden');
}

function selectTable(id) {
  const table = venueTables().find(t => t.id === id);
  if (!table || getTableStatus(table) === 'reserved') return;

  if (selectedTable === id) {
    selectedTable = null; // toggle off
  } else {
    if (!tableFitsParty(table)) {
      showToast('error', 'Table too small', `Table ${id} seats up to ${table.seats} guests.`);
      return;
    }
    selectedTable = id;
    showToast('success', `Table ${id} selected`, `${table.zone} · up to ${table.seats} guests`);
  }
  updateSelectedTableUI();
  renderFloorPlan();
}

// ===== TABLE SEARCH =====
document.getElementById('searchBtn').addEventListener('click', () => {
  const date = document.getElementById('searchDate').value;
  const time = document.getElementById('searchTime').value;

  if (!currentVenue) { showToast('error', 'Choose a venue', 'Select a restaurant or cafe first.'); return; }
  if (!date) { showToast('error', 'Select a date', 'Please choose a date to check availability.'); return; }
  if (isPastDate(date)) { showToast('error', 'Invalid date', 'Please select a future date.'); return; }
  if (isClosedOn(currentVenue, date)) { showToast('error', 'Closed that day', closedMessage(currentVenue)); return; }

  document.getElementById('bookingDate').value = date;
  if (time) document.getElementById('bookingTime').value = time;

  renderFloorPlan();

  const available = venueTables().filter(t => getTableStatus(t) !== 'reserved' && tableFitsParty(t)).length;
  showToast('success', `${available} tables available`, `${currentVenue.name} · ${date}${time ? ' at ' + time : ''}.`);
  document.getElementById('reservations').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Keep the floor plan in sync whenever the slot or party size changes
document.getElementById('searchGuests').addEventListener('change', renderFloorPlan);
document.getElementById('searchDate').addEventListener('change', e => {
  document.getElementById('bookingDate').value = e.target.value;
  renderFloorPlan();
});
document.getElementById('searchTime').addEventListener('change', e => {
  document.getElementById('bookingTime').value = e.target.value;
  renderFloorPlan();
});

// ===== FORM VALIDATION =====
function validateField(id, errorId, validate) {
  const el = document.getElementById(id);
  const err = document.getElementById(errorId);
  const msg = validate(el.value);
  if (msg) {
    el.classList.add('error');
    err.textContent = msg;
    return false;
  } else {
    el.classList.remove('error');
    err.textContent = '';
    return true;
  }
}

['guestName', 'guestEmail', 'guestPhone', 'bookingDate', 'bookingTime', 'guestCount'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => validateFormField(id));
  document.getElementById(id).addEventListener('change', () => validateFormField(id));
});

// Slot / party-size changes in the booking form refresh the floor plan
['bookingDate', 'bookingTime', 'guestCount'].forEach(id => {
  document.getElementById(id).addEventListener('change', renderFloorPlan);
});
document.getElementById('guestCount').addEventListener('input', renderFloorPlan);

function validateFormField(id) {
  switch (id) {
    case 'guestName': return validateField('guestName', 'nameError', v => !v.trim() ? 'Name is required.' : v.trim().length < 2 ? 'Name is too short.' : '');
    case 'guestEmail': return validateField('guestEmail', 'emailError', v => !v.trim() ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address.' : '');
    case 'guestPhone': return validateField('guestPhone', 'phoneError', v => !v.trim() ? 'Phone number is required.' : !/^[+\d\s\-()]{7,}$/.test(v) ? 'Enter a valid phone number.' : '');
    case 'bookingDate': return validateField('bookingDate', 'dateError', v => {
      if (!v) return 'Date is required.';
      if (isPastDate(v)) return 'Date cannot be in the past.';
      if (isClosedOn(currentVenue, v)) return closedMessage(currentVenue);
      return '';
    });
    case 'bookingTime': return validateField('bookingTime', 'timeError', v => !v ? 'Please select a time slot.' : '');
    case 'guestCount': return validateField('guestCount', 'guestError', v => {
      const n = parseInt(v);
      if (!v) return 'Number of guests is required.';
      if (n < 1) return 'Minimum 1 guest.';
      if (n > 8) return 'Maximum 8 guests per booking.';
      if (selectedTable) {
        const t = venueTables().find(t => t.id === selectedTable);
        if (t && n > t.seats) return `Table ${selectedTable} seats up to ${t.seats} guests.`;
      }
      return '';
    });
  }
}

// ===== BOOKING SUBMIT =====
document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();

  if (!currentVenue) {
    showToast('error', 'Choose a venue', 'Select a restaurant or cafe before booking.');
    document.getElementById('restaurants').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const fields = ['guestName', 'guestEmail', 'guestPhone', 'bookingDate', 'bookingTime', 'guestCount'];
  const valid = fields.map(f => validateFormField(f)).every(Boolean);
  if (!valid) {
    showToast('error', 'Please fix the errors', 'Check all required fields before submitting.');
    return;
  }

  if (!selectedTable) {
    showToast('error', 'No table selected', 'Please select a table from the floor plan.');
    return;
  }

  const venue = currentVenue;
  const tableId = selectedTable;
  const btn = document.getElementById('submitBtn');
  btn.querySelector('.btn-text').classList.add('hidden');
  btn.querySelector('.btn-loader').classList.add('visible');
  btn.disabled = true;

  setTimeout(() => {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;

    const resetButton = () => {
      btn.querySelector('.btn-text').classList.remove('hidden');
      btn.querySelector('.btn-loader').classList.remove('visible');
      btn.disabled = false;
    };

    // Guard against double-booking the same table and slot at this venue
    if (isBooked(venue.id, tableId, date, time)) {
      resetButton();
      selectedTable = null;
      updateSelectedTableUI();
      renderFloorPlan();
      showToast('error', 'Table just taken', 'That table is already booked for this slot. Please pick another.');
      return;
    }

    const bookingData = {
      id: generateBookingId(),
      venueId: venue.id,
      venueName: venue.name,
      venueAddress: venue.address,
      name: document.getElementById('guestName').value.trim(),
      email: document.getElementById('guestEmail').value.trim(),
      phone: document.getElementById('guestPhone').value.trim(),
      date,
      time,
      guests: document.getElementById('guestCount').value,
      tableId,
      specialRequest: document.getElementById('specialRequest').value.trim(),
      createdAt: new Date().toISOString(),
    };

    reservations.push(bookingData);
    saveReservations();

    selectedTable = null;
    resetButton();

    document.getElementById('bookingForm').reset();
    updateSelectedTableUI();
    renderFloorPlan();

    showConfirmationModal(bookingData);
  }, 1800);
});

function generateBookingId() {
  return 'AUR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

// ===== CONFIRMATION MODAL =====
function showConfirmationModal(data) {
  const modal = document.getElementById('confirmModal');
  const venue = venueById(data.venueId) || currentVenue;
  const table = (venue ? venue.tables : []).find(t => t.id === data.tableId) || {};

  // All guest-supplied values are escaped before going into innerHTML
  document.getElementById('modalBody').innerHTML = `
    <div class="modal-row"><span>Booking ID</span><span class="booking-id">${escapeHtml(data.id)}</span></div>
    <div class="modal-row"><span>Restaurant</span><span>${escapeHtml(data.venueName)}</span></div>
    <div class="modal-row"><span>Address</span><span style="font-size:0.8rem;max-width:230px;text-align:right">${escapeHtml(data.venueAddress)}</span></div>
    <div class="modal-row"><span>Guest</span><span>${escapeHtml(data.name)}</span></div>
    <div class="modal-row"><span>Date</span><span>${escapeHtml(formatDate(data.date))}</span></div>
    <div class="modal-row"><span>Time</span><span>${escapeHtml(data.time)}</span></div>
    <div class="modal-row"><span>Table</span><span>Table ${escapeHtml(data.tableId)} · ${escapeHtml(table.zone || 'Dining Room')}</span></div>
    <div class="modal-row"><span>Guests</span><span>${escapeHtml(data.guests)} ${data.guests == 1 ? 'person' : 'people'}</span></div>
    ${data.specialRequest ? `<div class="modal-row"><span>Special Requests</span><span style="font-size:0.8rem;max-width:200px;text-align:right">${escapeHtml(data.specialRequest)}</span></div>` : ''}
  `;

  const dir = document.getElementById('modalDirections');
  if (venue) { dir.href = directionsUrl(venue); dir.style.display = ''; }
  else { dir.style.display = 'none'; }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  startCountdown(data.date, data.time);
  showToast('success', 'Reservation confirmed!', `${data.venueName} · Booking ID: ${data.id}`);
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function startCountdown(date, time) {
  if (countdownInterval) clearInterval(countdownInterval);
  const target = new Date(`${date}T${time}:00`);

  function update() {
    const diff = target - new Date();
    if (diff <= 0) {
      document.getElementById('countdownDisplay').textContent = 'Now!';
      clearInterval(countdownInterval);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    parts.push(`${m}m`);
    document.getElementById('countdownDisplay').textContent = parts.join(' ');
  }
  update();
  countdownInterval = setInterval(update, 60000);
}

function closeConfirmModal() {
  document.getElementById('confirmModal').classList.remove('open');
  document.body.style.overflow = '';
  if (countdownInterval) clearInterval(countdownInterval);
}
document.getElementById('modalClose').addEventListener('click', closeConfirmModal);
document.getElementById('modalOverlay').addEventListener('click', closeConfirmModal);

// ===== REVIEWS CAROUSEL =====
function getReviewsPerPage() {
  return window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
}

function renderReviews() {
  const track = document.getElementById('carouselTrack');

  track.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.stars)}</div>
      <p class="review-text">"${escapeHtml(r.text)}"</p>
      <div class="reviewer">
        <div class="reviewer-avatar">${r.avatar}</div>
        <div>
          <div class="reviewer-name">${escapeHtml(r.name)}</div>
          <div class="reviewer-meta">${escapeHtml(r.meta)}</div>
        </div>
      </div>
    </div>
  `).join('');

  buildCarouselDots();
  goToReviewPage(Math.min(carouselIndex, Math.ceil(reviews.length / carouselPerPage) - 1), false);
  startCarousel();
}

function buildCarouselDots() {
  carouselPerPage = getReviewsPerPage();
  const pages = Math.ceil(reviews.length / carouselPerPage);
  const dots = document.getElementById('carouselDots');
  dots.innerHTML = Array.from({ length: pages }, (_, i) => `<div class="dot ${i === carouselIndex ? 'active' : ''}" data-index="${i}"></div>`).join('');
  dots.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      goToReviewPage(parseInt(dot.dataset.index));
      startCarousel();
    });
  });
}

function goToReviewPage(page, animate = true) {
  carouselIndex = page;
  const track = document.getElementById('carouselTrack');
  const cardWidth = document.querySelector('.review-card')?.offsetWidth || 0;
  const gap = 24;
  const offset = page * carouselPerPage * (cardWidth + gap);

  if (!animate) track.style.transition = 'none';
  track.style.transform = `translateX(-${offset}px)`;
  if (!animate) {
    void track.offsetWidth;
    track.style.transition = '';
  }
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === page));
}

function startCarousel() {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(() => {
    const pages = Math.ceil(reviews.length / carouselPerPage);
    goToReviewPage((carouselIndex + 1) % pages);
  }, 5000);
}

renderReviews();

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (getReviewsPerPage() !== carouselPerPage) {
      const firstVisible = carouselIndex * carouselPerPage;
      carouselPerPage = getReviewsPerPage();
      carouselIndex = Math.floor(firstVisible / carouselPerPage);
      buildCarouselDots();
    }
    goToReviewPage(carouselIndex, false);
  }, 150);
});

// ===== TOAST =====
function showToast(type, title, msg) {
  const container = document.getElementById('toast-container');
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '✦'}</span>
    <div>
      <div style="font-weight:600;font-size:0.875rem;color:var(--text-primary);margin-bottom:2px">${escapeHtml(title)}</div>
      <div class="toast-msg">${escapeHtml(msg)}</div>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

// ===== SCROLL REVEAL =====
function initRevealAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== NEWSLETTER =====
document.getElementById('newsletterBtn').addEventListener('click', () => {
  const emailEl = document.getElementById('newsletterEmail');
  const val = emailEl.value.trim();
  if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    showToast('error', 'Invalid email', 'Please enter a valid email address.');
    return;
  }
  showToast('success', 'You\'re subscribed', `${val} is now on our list.`);
  emailEl.value = '';
});

// ===== SMOOTH SCROLL =====
// Delegated so links created later (venue banner, location panel, empty floor plan) also work
document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (href === '#') return; // placeholder links
  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
});

// ===== MIN DATE (no past dates, local time) =====
const today = localISODate();
document.getElementById('bookingDate').min = today;
document.getElementById('searchDate').min = today;

// ===== INIT =====
renderVenues();
renderVenueBanner();
renderFloorPlan();
populateTimeSelects();