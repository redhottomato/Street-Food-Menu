// ----------------------
// Theme: dark / light
// ----------------------
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
  root.classList.add('dark');
}

window.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const toggleBtn = document.getElementById('toggleTheme');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      root.classList.toggle('dark');
      const mode = root.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', mode);
    });
  }

  // Smooth scroll fix
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  // Dynamic scroll offset for navbar height
  const nav = document.getElementById('categoryMenu');
  const applyNavHeight = () => {
    if (!nav) return;
    const h = nav.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--nav-h', `${Math.ceil(h)}px`);
  };
  applyNavHeight();
  window.addEventListener('resize', applyNavHeight);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(applyNavHeight);
    ro.observe(nav);
  }

  // Phone toggle depending on header visibility
  const navPhone = document.getElementById('navPhone');
  const header = document.querySelector('header');
  if (navPhone && header) {
    const updatePhone = () => {
      const threshold = header.offsetHeight - 60;
      const show = window.scrollY > threshold;
      navPhone.classList.toggle('hidden', !show);
      applyNavHeight(); // recalc height when phone appears/disappears
    };
    updatePhone();
    window.addEventListener('scroll', updatePhone, { passive: true });
    window.addEventListener('resize', updatePhone);
  }

  // Init menu
  loadMenu();
});



const categoryIcons = {
  pizza: "🍕",
  calzone: "🥟",
  kebab: "🥙",
  burgers: "🍔",
  tillegg: "➕",
  falafel: "🧆",
  drikke: "🥤"
};


// ----------------------
// Render helpers
// ----------------------
function badge(tag) {
  const map = { vegetarian: '🌱 Vegetarian', vegan: '🟢 Vegan', spicy: '🌶 Spicy' };
  return map[tag] || tag;
}

function formatPrice(nok) {
  return `kr ${nok}`;
}

// Supports either { price } or { prices: { regular, large } }
// Supports either { price } or { prices: { regular, large } }
function itemRow(item, categoryId) {
  const tagHtml = (item.tags || [])
    .map(t => `<span class="text-[11px] rounded-full border border-gray-300 dark:border-gray-700 px-2 py-0.5">${badge(t)}</span>`)
    .join(' ');

  const allergenHtml = (item.allergens && item.allergens.length)
    ? `<p class="mt-1 text-xs text-amber-700 dark:text-amber-400">⚠️ Allergens: ${item.allergens.join(', ')}</p>`
    : '';

  const icon = categoryIcons[categoryId] || "";

  let priceHtml = '';
  if (item.prices && typeof item.prices === 'object') {
    const { regular, large } = item.prices;
    priceHtml = `
      <div class="flex gap-4 text-right font-semibold whitespace-nowrap">
        ${regular != null ? `<span>${formatPrice(regular)} <span class="text-xs text-gray-500 dark:text-gray-400">reg</span></span>` : ''}
        ${large != null ? `<span>${formatPrice(large)} <span class="text-xs text-gray-500 dark:text-gray-400">large</span></span>` : ''}
      </div>
    `;
  } else {
    priceHtml = `<div class="text-right min-w-16 font-semibold whitespace-nowrap">${formatPrice(item.price)}</div>`;
  }

  return `
    <div class="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-soft hover:shadow-md transition">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h4 class="font-semibold truncate">${item.name} <span class="ml-1">${icon}</span></h4>
          ${item.desc ? `<p class="text-sm text-gray-600 dark:text-gray-400">${item.desc}</p>` : ''}
          ${allergenHtml}
          ${tagHtml ? `<div class="mt-2 flex flex-wrap gap-1 text-gray-700 dark:text-gray-300">${tagHtml}</div>` : ''}
        </div>
        ${priceHtml}
      </div>
    </div>
  `;
}



function sectionTemplate(cat) {
  const items = (cat.items || []).map(i => itemRow(i, cat.id)).join('');
  const icon = categoryIcons[cat.id] || "";
  return `
    <section id="${cat.id}" aria-labelledby="heading-${cat.id}">
      <div class="flex items-baseline justify-between mb-4">
        <h2 id="heading-${cat.id}" class="text-2xl font-bold">
          ${cat.title} <span class="ml-2">${icon}</span>
        </h2>
        <a href="#top" class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Back to top</a>
      </div>
      <div class="flex flex-col gap-4">${items}</div>
    </section>
  `;
}



function buildCategoryButtons(categories) {
  const container = document.querySelector('#categoryMenu [role="tablist"]');
  if (!container) return;
  container.innerHTML = '';

  categories.forEach(cat => {
    const icon = categoryIcons[cat.id] || '';
    const btn = document.createElement('a');
    btn.href = `#${cat.id}`;
    btn.className = 'px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500';
    btn.innerHTML = `${cat.title} <span class="ml-1">${icon}</span>`;
    btn.setAttribute('role', 'tab');
    container.appendChild(btn);
  });
}





function renderMenu(data) {
  // Desired arrangement:
  const order = ['pizza', 'calzone', 'kebab', 'burgers', 'tillegg', 'falafel', 'drikke'];

  const idx = id => {
    const i = order.indexOf(id);
    return i === -1 ? 999 : i; // unknown categories go last
  };

  const cats = [...data.categories].sort((a, b) => idx(a.id) - idx(b.id));

  buildCategoryButtons(cats);
  const html = cats.map(sectionTemplate).join('');
  const sections = document.getElementById('sections');
  if (sections) sections.innerHTML = html;
}

async function loadMenu() {
  const sections = document.getElementById('sections');
  try {
    const res = await fetch('menu.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('menu.json not found');
    const data = await res.json();
    renderMenu(data);
  } catch (e) {
    if (sections) {
      sections.innerHTML = `
        <div class="text-center text-sm text-red-600 dark:text-red-400">
          Could not load <code>menu.json</code>. Make sure it is placed next to <code>index.html</code>.
        </div>`;
    }
    console.error(e);
  }
}
