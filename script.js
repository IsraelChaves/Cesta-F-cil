/* =============================================
   CestaFácil — script.js
   Sistema completo: LocalStorage, UI, Animações
   ============================================= */

'use strict';

// ======================== DADOS MOCK ========================
const MOCK_OFFERS = [
  { id:1, name:'Arroz Tipo 1 5kg', market:'Assaí', emoji:'🌾', price:22.90, oldPrice:31.90, discount:28, cat:'graos' },
  { id:2, name:'Feijão Carioca 1kg', market:'Carrefour', emoji:'🫘', price:7.49, oldPrice:10.99, discount:32, cat:'graos' },
  { id:3, name:'Óleo de Soja 900ml', market:'Atacadão', emoji:'🍶', price:5.99, oldPrice:8.50, discount:29, cat:'graos' },
  { id:4, name:'Café Melitta 500g', market:'Extra', emoji:'☕', price:14.90, oldPrice:22.00, discount:32, cat:'bebidas' },
  { id:5, name:'Açúcar Cristal 5kg', market:'Assaí', emoji:'🍬', price:19.90, oldPrice:26.90, discount:26, cat:'graos' },
  { id:6, name:'Leite Integral 1L', market:'Pão de Açúcar', emoji:'🥛', price:3.89, oldPrice:5.49, discount:29, cat:'laticinios' },
  { id:7, name:'Macarrão Espaguete 500g', market:'Carrefour', emoji:'🍝', price:3.49, oldPrice:5.20, discount:33, cat:'graos' },
  { id:8, name:'Detergente Líquido 500ml', market:'Atacadão', emoji:'🧴', price:1.99, oldPrice:3.50, discount:43, cat:'limpeza' },
  { id:9, name:'Iogurte Natural 170g', market:'Extra', emoji:'🥣', price:2.49, oldPrice:3.80, discount:34, cat:'laticinios' },
  { id:10, name:'Sabão em Pó 1kg', market:'Assaí', emoji:'🧹', price:8.90, oldPrice:13.50, discount:34, cat:'limpeza' },
  { id:11, name:'Tomate Italiano kg', market:'Carrefour', emoji:'🍅', price:4.99, oldPrice:7.90, discount:37, cat:'hortifruti' },
  { id:12, name:'Banana Prata kg', market:'Pão de Açúcar', emoji:'🍌', price:3.49, oldPrice:5.20, discount:33, cat:'hortifruti' },
  { id:13, name:'Queijo Mussarela 400g', market:'Atacadão', emoji:'🧀', price:11.90, oldPrice:17.50, discount:32, cat:'laticinios' },
  { id:14, name:'Água Mineral 1,5L', market:'Assaí', emoji:'💧', price:1.79, oldPrice:2.80, discount:36, cat:'bebidas' },
  { id:15, name:'Azeite de Oliva 500ml', market:'Extra', emoji:'🫙', price:19.90, oldPrice:32.00, discount:38, cat:'graos' },
  { id:16, name:'Alface Crespa', market:'Carrefour', emoji:'🥬', price:2.49, oldPrice:3.99, discount:38, cat:'hortifruti' },
];

const MOCK_COUPONS = [
  { id:'c1', code:'CESTA10', market:'Assaí', discount:'10% OFF', desc:'10% de desconto em produtos selecionados', validity:'31/12/2025', color:'#0066ff' },
  { id:'c2', code:'CARR15', market:'Carrefour', discount:'R$15 OFF', desc:'R$15 de desconto em compras acima de R$120', validity:'15/12/2025', color:'#0088ff' },
  { id:'c3', code:'ATAC20', market:'Atacadão', discount:'20% OFF', desc:'20% em grãos e cereais', validity:'28/11/2025', color:'#0055dd' },
  { id:'c4', code:'PAO5', market:'Pão de Açúcar', discount:'R$5 OFF', desc:'R$5 em qualquer compra', validity:'30/11/2025', color:'#0077ff' },
  { id:'c5', code:'EXTRA12', market:'Extra', discount:'12% OFF', desc:'12% em produtos de limpeza', validity:'20/12/2025', color:'#0066ff' },
  { id:'c6', code:'CESTA30', market:'Assaí', discount:'30% OFF', desc:'30% em hortifruti toda semana', validity:'Toda semana', color:'#0044bb' },
];

const COMPARE_DATA = [
  { product:'Arroz 5kg', assai:22.90, carrefour:24.99, atacadao:21.90, extra:25.50, pao:27.90 },
  { product:'Feijão 1kg', assai:7.49, carrefour:8.20, atacadao:6.99, extra:8.90, pao:9.50 },
  { product:'Óleo 900ml', assai:6.50, carrefour:5.99, atacadao:5.80, extra:7.20, pao:7.90 },
  { product:'Café 500g', assai:16.90, carrefour:14.90, atacadao:15.50, extra:18.00, pao:19.90 },
  { product:'Açúcar 5kg', assai:19.90, carrefour:21.50, atacadao:18.90, extra:22.00, pao:23.90 },
  { product:'Leite 1L', assai:4.10, carrefour:3.89, atacadao:3.99, extra:4.50, pao:4.90 },
];

// ======================== LOCAL STORAGE ========================
const LS = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
};

function initLocalStorage() {
  if (!LS.get('cf_offers')) LS.set('cf_offers', MOCK_OFFERS);
  if (!LS.get('cf_coupons')) LS.set('cf_coupons', MOCK_COUPONS);
  if (!LS.get('cf_contacts')) LS.set('cf_contacts', []);
  if (!LS.get('cf_favorites')) LS.set('cf_favorites', []);
  if (!LS.get('cf_newsletter')) LS.set('cf_newsletter', []);
}

// ======================== TOAST ========================
function showToast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', info: '📋', warn: '⚠️' };
  const container = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || '💬'}</span> ${msg}`;
  container.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toast-out 0.4s ease forwards';
    setTimeout(() => t.remove(), 400);
  }, 3200);
}

// ======================== PARTÍCULAS ========================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.5,
      a: Math.random() * 0.5 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,102,255,${p.a})`;
      ctx.fill();
    });
    // conexões
    particles.forEach((a, i) => {
      particles.slice(i+1).forEach(b => {
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,102,255,${0.07 * (1 - d/120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); makeParticles(); });
  resize(); makeParticles(); draw();
}

// ======================== NAVBAR ========================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // fechar menu ao clicar em link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ======================== SCROLL REVEAL ========================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.12 });
  elements.forEach(el => obs.observe(el));
}

// ======================== BACK TO TOP ========================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ======================== PHONE MOCKUP ========================
function renderPhoneOffers() {
  const offers = LS.get('cf_offers') || MOCK_OFFERS;
  const container = document.getElementById('phoneOffers');
  if (!container) return;
  const sample = offers.slice(0, 3);
  container.innerHTML = sample.map(o => `
    <div class="phone-offer-item">
      <span class="poi-emoji">${o.emoji}</span>
      <div class="poi-info">
        <div class="poi-name">${o.name}</div>
        <div class="poi-market">${o.market}</div>
      </div>
      <div>
        <div class="poi-price">R$ ${o.price.toFixed(2)}</div>
        <div class="poi-old">R$ ${o.oldPrice.toFixed(2)}</div>
      </div>
      <div class="poi-badge">-${o.discount}%</div>
    </div>
  `).join('');
}

// ======================== OFERTAS ========================
let currentFilter = 'todos';
let currentSearch = '';
let currentSort = 'discount';
let showCount = 8;

function renderOffers() {
  let offers = LS.get('cf_offers') || MOCK_OFFERS;
  const favorites = LS.get('cf_favorites') || [];

  // Filtros
  if (currentFilter !== 'todos') {
    offers = offers.filter(o => o.cat === currentFilter);
  }
  if (currentSearch.trim()) {
    const q = currentSearch.toLowerCase();
    offers = offers.filter(o => o.name.toLowerCase().includes(q) || o.market.toLowerCase().includes(q));
  }

  // Ordenação
  if (currentSort === 'discount') offers.sort((a,b) => b.discount - a.discount);
  else if (currentSort === 'price-asc') offers.sort((a,b) => a.price - b.price);
  else if (currentSort === 'price-desc') offers.sort((a,b) => b.price - a.price);

  const visible = offers.slice(0, showCount);
  const grid = document.getElementById('offersGrid');
  if (!grid) return;

  if (visible.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--gray)">Nenhuma oferta encontrada.</div>';
    return;
  }

  grid.innerHTML = visible.map(o => {
    const isFav = favorites.includes(o.id);
    return `
      <div class="offer-card" data-id="${o.id}">
        <div class="offer-card-img">
          <span>${o.emoji}</span>
          <div class="offer-discount-badge">-${o.discount}%</div>
          <button class="offer-fav-btn ${isFav ? 'active' : ''}" data-id="${o.id}" title="Favoritar">
            ${isFav ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="offer-card-body">
          <div class="offer-market">${o.market}</div>
          <div class="offer-name">${o.name}</div>
          <div class="offer-cat">${catLabel(o.cat)}</div>
          <div class="offer-prices">
            <span class="offer-price">R$ ${o.price.toFixed(2)}</span>
            <span class="offer-old">R$ ${o.oldPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Favoritos
  grid.querySelectorAll('.offer-fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const favs = LS.get('cf_favorites') || [];
      const idx = favs.indexOf(id);
      if (idx === -1) {
        favs.push(id);
        showToast('Adicionado aos favoritos! ❤️');
      } else {
        favs.splice(idx, 1);
        showToast('Removido dos favoritos', 'info');
      }
      LS.set('cf_favorites', favs);
      renderOffers();
    });
  });

  document.getElementById('loadMoreBtn').style.display = offers.length > showCount ? 'inline-flex' : 'none';
}

function catLabel(cat) {
  const map = { graos:'Grãos & Cereais', laticinios:'Laticínios', bebidas:'Bebidas', limpeza:'Limpeza', hortifruti:'Hortifruti' };
  return map[cat] || cat;
}

function initOffers() {
  // Tabs
  document.getElementById('filterTabs').addEventListener('click', e => {
    if (e.target.classList.contains('filter-tab')) {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.cat;
      showCount = 8;
      renderOffers();
    }
  });

  // Busca
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let debounce;
    searchInput.addEventListener('input', e => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        currentSearch = e.target.value;
        showCount = 8;
        renderOffers();
      }, 280);
    });
  }

  // Ordenação
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', e => { currentSort = e.target.value; renderOffers(); });
  }

  // Load more
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => { showCount += 8; renderOffers(); });
  }

  renderOffers();
}

// ======================== CUPONS ========================
function renderCoupons() {
  const coupons = LS.get('cf_coupons') || MOCK_COUPONS;
  const grid = document.getElementById('couponsGrid');
  if (!grid) return;

  grid.innerHTML = coupons.map(c => `
    <div class="coupon-card">
      <div class="coupon-header">
        <span class="coupon-market">${c.market}</span>
        <span class="coupon-discount">${c.discount}</span>
      </div>
      <div class="coupon-desc">${c.desc}</div>
      <div class="coupon-code-row">
        <span class="coupon-code">${c.code}</span>
        <button class="coupon-copy-btn" data-code="${c.code}">📋 Copiar</button>
      </div>
      <div class="coupon-validity">⏰ Válido até: ${c.validity}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.coupon-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = '✅ Copiado!';
        showToast(`Cupom <strong>${code}</strong> copiado!`, 'success');
        setTimeout(() => { btn.innerHTML = '📋 Copiar'; }, 2000);
      }).catch(() => {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = code; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy'); ta.remove();
        showToast(`Cupom <strong>${code}</strong> copiado!`, 'success');
        btn.textContent = '✅ Copiado!';
        setTimeout(() => { btn.innerHTML = '📋 Copiar'; }, 2000);
      });
    });
  });
}

// ======================== COMPARADOR ========================
function renderCompareTable(data) {
  const tbody = document.getElementById('compareBody');
  const summary = document.getElementById('compareSummary');
  if (!tbody) return;

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--gray);padding:32px">Nenhum produto encontrado. Digite para comparar.</td></tr>`;
    summary.innerHTML = '';
    return;
  }

  const markets = ['assai','carrefour','atacadao','extra','pao'];
  let totalSavings = 0;

  tbody.innerHTML = data.map(row => {
    const prices = markets.map(m => row[m]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const cells = markets.map(m => {
      const isBest = row[m] === minPrice;
      return `<td class="${isBest ? 'price-best' : 'price-normal'}">
        R$ ${row[m].toFixed(2)} ${isBest ? '✓' : ''}
      </td>`;
    });
    totalSavings += maxPrice - minPrice;
    return `<tr><td style="font-weight:600">${row.product}</td>${cells.join('')}</tr>`;
  }).join('');

  summary.innerHTML = `💡 Ao escolher o menor preço em cada produto, você economiza até <strong style="color:#00c864">R$ ${totalSavings.toFixed(2)}</strong> nesta lista.`;
}

function initComparator() {
  // Mostrar todos por padrão
  renderCompareTable(COMPARE_DATA);

  const btn = document.getElementById('compareBtn');
  const input = document.getElementById('compareSearch');
  if (!btn || !input) return;

  function doCompare() {
    const q = input.value.trim().toLowerCase();
    if (!q) { renderCompareTable(COMPARE_DATA); return; }
    const filtered = COMPARE_DATA.filter(r => r.product.toLowerCase().includes(q));
    renderCompareTable(filtered.length ? filtered : []);
  }

  btn.addEventListener('click', doCompare);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doCompare(); });
}

// ======================== CONTATO ========================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const msg = document.getElementById('contactMsg').value.trim();
    if (!name || !email || !msg) {
      showToast('Preencha todos os campos.', 'warn'); return;
    }
    const contacts = LS.get('cf_contacts') || [];
    contacts.push({ name, email, msg, date: new Date().toISOString() });
    LS.set('cf_contacts', contacts);
    showToast('Mensagem enviada com sucesso! 🎉', 'success');
    form.reset();
  });
}

// ======================== NEWSLETTER ========================
function initNewsletter() {
  const btn = document.getElementById('newsletterBtn');
  const input = document.getElementById('newsletterEmail');
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      showToast('Digite um e-mail válido.', 'warn'); return;
    }
    const list = LS.get('cf_newsletter') || [];
    if (list.includes(email)) {
      showToast('Este e-mail já está cadastrado.', 'info'); return;
    }
    list.push(email);
    LS.set('cf_newsletter', list);
    showToast('Cadastrado com sucesso! Fique de olho nas ofertas. 📧', 'success');
    input.value = '';
  });
}

// ======================== COUNTER ANIMATION ========================
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target.toLocaleString('pt-BR');
        }
        requestAnimationFrame(update);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// ======================== SMOOTH SCROLL ========================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ======================== ACTIVE NAV LINK ========================
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const links = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.style.color = l.getAttribute('href') === `#${current}` ? 'var(--neon)' : '';
    });
  });
}

// ======================== INIT ========================
document.addEventListener('DOMContentLoaded', () => {
  initLocalStorage();
  initParticles();
  initNavbar();
  initScrollReveal();
  initBackToTop();
  initSmoothScroll();
  initActiveNav();
  renderPhoneOffers();
  initOffers();
  renderCoupons();
  initComparator();
  initContactForm();
  initNewsletter();
  initCounters();
  console.log('%c🛒 CestaFácil carregado com sucesso!', 'color:#0066ff;font-size:14px;font-weight:bold;');
});