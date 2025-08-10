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
  const toggleBtn = document.getElementById('toggleTheme');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      root.classList.toggle('dark');
      const mode = root.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', mode);
    });
  }

  // Smooth scroll fix for sticky bar
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

  // Init
  loadMenu();
});

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

function itemRow(item) {
  const tagHtml = (item.tags || []).map(t => `<span class="text-[11px] rounded-full border border-gray-300 dark:border-gray-700 px-2 py-0.5">${badge(t)}</span>`).join(' ');
  const allergenHtml = (item.allergens && item.allergens.length)
    ? `<p class="mt-1 text-xs text-amber-700 dark:text-amber-400">⚠️ Allergens: ${item.allergens.join(', ')}</p>`
    : '';
  return `
    <div class="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-soft hover:shadow-md transition">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h4 class="font-semibold truncate">${item.name}</h4>
          ${item.desc ? `<p class="text-sm text-gray-600 dark:text-gray-400">${item.desc}</p>` : ''}
          ${allergenHtml}
          ${tagHtml ? `<div class="mt-2 flex flex-wrap gap-1 text-gray-700 dark:text-gray-300">${tagHtml}</div>` : ''}
        </div>
        <div class="text-right min-w-16 font-semibold whitespace-nowrap">${formatPrice(item.price)}</div>
      </div>
    </div>
  `;
}

function sectionTemplate(cat) {
  const items = (cat.items || []).map(itemRow).join('');
  return `
    <section id="${cat.id}" aria-labelledby="heading-${cat.id}">
      <div class="flex items-baseline justify-between mb-4">
        <h2 id="heading-${cat.id}" class="text-2xl font-bold">${cat.title}</h2>
        <a href="#top" class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Back to top</a>
      </div>
      <div class="flex flex-col gap-4">${items}</div>
    </section>
  `;
}

function buildCategoryButtons(categories) {
  const container = document.querySelector('#categoryMenu [role="tablist"]');
  if (!container) return;
  container.className = 'flex justify-center flex-wrap gap-2 py-3';
  container.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('a');
    btn.href = `#${cat.id}`;
    btn.className = 'px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500';
    btn.textContent = cat.title;
    btn.setAttribute('role', 'tab');
    container.appendChild(btn);
  });
}

function renderMenu(data) {
  const order = ['pizza', 'kebab', 'burgers', 'small-orders'];
  const cats = [...data.categories];
  cats.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
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
    if (sections) sections.innerHTML = `<div class="text-center text-sm text-red-600 dark:text-red-400">Could not load <code>menu.json</code>. Make sure it is placed next to <code>index.html</code>.</div>`;
    console.error(e);
  }
}
