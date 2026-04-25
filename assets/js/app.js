/* ============================================
   محطة التمويل - Interactive Engine
   GitHub Pages compatible
   ============================================ */

(function () {
  'use strict';

  const trustLinks = [
    ['من نحن', '/about.html'],
    ['منهجية التقييم', '/methodology.html'],
    ['سياسة الخصوصية', '/privacy-policy.html'],
    ['إخلاء المسؤولية', '/disclaimer.html'],
    ['اتصل بنا', '/contact.html']
  ];

  function addTrustLinksToFooter() {
    const footerBottom = document.querySelector('.footer-bottom');
    if (!footerBottom || footerBottom.querySelector('.footer-trust-links')) return;

    const p = document.createElement('p');
    p.className = 'footer-trust-links';
    p.style.cssText = 'display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center;margin-top:1rem;font-size:.9rem;';

    trustLinks.forEach(([label, href], index) => {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      p.appendChild(a);
      if (index < trustLinks.length - 1) {
        const sep = document.createElement('span');
        sep.textContent = '·';
        sep.style.opacity = '.55';
        p.appendChild(sep);
      }
    });

    footerBottom.appendChild(p);
  }

  function addTrustLinksToMobileMenu() {
    const nav = document.querySelector('.main-nav');
    if (!nav || nav.querySelector('.trust-nav-link')) return;

    const linksToAdd = [
      ['من نحن', '/about.html'],
      ['اتصل بنا', '/contact.html']
    ];

    linksToAdd.forEach(([label, href]) => {
      const a = document.createElement('a');
      a.href = href;
      a.className = 'nav-link trust-nav-link';
      a.textContent = label;
      nav.appendChild(a);
    });
  }

  function fixOldCanonical() {
    const canonical = document.querySelector('link[rel="canonical"]');
    const path = window.location.pathname === '/' ? '/' : window.location.pathname;
    const correct = window.location.origin + path;
    if (canonical) canonical.setAttribute('href', correct);

    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        if (data && data.url && String(data.url).includes('prophub.com')) {
          data.url = window.location.origin + '/';
          script.textContent = JSON.stringify(data, null, 2);
        }
      } catch (_) {}
    });
  }

  function addRiskBanner() {
    if (document.querySelector('.risk-banner')) return;
    const main = document.querySelector('main');
    if (!main) return;

    const banner = document.createElement('div');
    banner.className = 'risk-banner';
    banner.style.cssText = 'background:#fff3e0;border-bottom:1px solid #f5c77b;color:#7a3b00;text-align:center;padding:.75rem 1rem;font-weight:700;line-height:1.8;margin-top:72px;';
    banner.innerHTML = '<div class="container">⚠️ التداول والحسابات الممولة تنطوي على مخاطر عالية. المعلومات تعليمية وليست نصيحة مالية. راجع القواعد الرسمية لكل شركة قبل اتخاذ القرار.</div>';

    const first = main.firstElementChild;
    if (first && first.classList.contains('hero')) {
      main.insertBefore(banner, first);
      first.style.paddingTop = '80px';
    } else if (first && first.classList.contains('review-hero')) {
      main.insertBefore(banner, first);
      first.style.paddingTop = '70px';
    } else {
      main.insertBefore(banner, main.firstChild);
    }
  }

  function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    if (!mobileMenuBtn || !mainNav) return;

    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ? '✕' : '☰';
    });
  }

  function setupHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  function setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function setupFiltersAndSearch() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const firmCards = document.querySelectorAll('.firm-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        firmCards.forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.type === filter) ? '' : 'none';
        });
      });
    });

    const searchInput = document.querySelector('.search-input');
    if (searchInput && firmCards.length > 0) {
      searchInput.addEventListener('input', e => {
        const query = e.target.value.toLowerCase().trim();
        firmCards.forEach(card => {
          const name = card.querySelector('.firm-name')?.textContent.toLowerCase() || '';
          const programs = card.querySelector('.firm-plans-preview')?.textContent.toLowerCase() || '';
          card.style.display = (name.includes(query) || programs.includes(query)) ? '' : 'none';
        });
      });
    }
  }

  function setupAnimations() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.firm-card, .category-card, .tool-card, .content-section').forEach(el => observer.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    fixOldCanonical();
    addTrustLinksToFooter();
    addTrustLinksToMobileMenu();
    addRiskBanner();
    setupMobileMenu();
    setupHeaderScroll();
    setupSmoothAnchors();
    setupFiltersAndSearch();
    setupAnimations();
  });
})();

/* ============================================
   FINANCIAL TOOLS
   ============================================ */

function calculateRisk() {
  const accountSize = parseFloat(document.getElementById('risk-account')?.value);
  const riskPercent = parseFloat(document.getElementById('risk-percent')?.value);
  const stopLoss = parseFloat(document.getElementById('risk-sl')?.value);
  if (!accountSize || !riskPercent || !stopLoss) return;
  const riskAmount = accountSize * (riskPercent / 100);
  const lotSize = riskAmount / (stopLoss * 10);
  document.getElementById('risk-result')?.classList.add('active');
  document.getElementById('risk-amount').textContent = '$' + riskAmount.toFixed(2);
  document.getElementById('risk-lot').textContent = lotSize.toFixed(2) + ' lot';
}

function calculatePip() {
  const lotSize = parseFloat(document.getElementById('pip-lot')?.value);
  const pair = document.getElementById('pip-pair')?.value;
  if (!lotSize) return;
  let pipValue = 10;
  if (pair === 'jpy') pipValue = 8.5;
  if (pair === 'xau') pipValue = 10;
  document.getElementById('pip-result')?.classList.add('active');
  document.getElementById('pip-value').textContent = '$' + (lotSize * pipValue).toFixed(2);
}

function calculateMargin() {
  const accountSize = parseFloat(document.getElementById('margin-account')?.value);
  const leverage = parseFloat(document.getElementById('margin-leverage')?.value);
  const lotSize = parseFloat(document.getElementById('margin-lot')?.value);
  if (!accountSize || !leverage || !lotSize) return;
  const marginRequired = (lotSize * 100000) / leverage;
  const marginPercent = (marginRequired / accountSize) * 100;
  document.getElementById('margin-result')?.classList.add('active');
  document.getElementById('margin-required').textContent = '$' + marginRequired.toFixed(2);
  document.getElementById('margin-percent').textContent = marginPercent.toFixed(1) + '%';
}

function calculatePayout() {
  const accountSize = parseFloat(document.getElementById('payout-account')?.value);
  const profitTarget = parseFloat(document.getElementById('payout-target')?.value);
  const split = document.getElementById('payout-split')?.value || '80/20';
  if (!accountSize || !profitTarget) return;
  const profit = accountSize * (profitTarget / 100);
  let traderShare = 80;
  if (split.includes('90')) traderShare = 90;
  if (split.includes('100')) traderShare = 100;
  if (split.includes('70')) traderShare = 70;
  const traderProfit = profit * (traderShare / 100);
  document.getElementById('payout-result')?.classList.add('active');
  document.getElementById('payout-profit').textContent = '$' + profit.toFixed(2);
  document.getElementById('payout-trader').textContent = '$' + traderProfit.toFixed(2);
  document.getElementById('payout-share').textContent = traderShare + '%';
}

function simulatePropFirm() {
  const accountSize = parseFloat(document.getElementById('sim-account')?.value);
  const monthlyReturn = parseFloat(document.getElementById('sim-return')?.value);
  const split = parseFloat(document.getElementById('sim-split')?.value);
  const months = parseInt(document.getElementById('sim-months')?.value);
  if (!accountSize || !monthlyReturn || !split || !months) return;

  let totalProfit = 0;
  const monthlyData = [];
  for (let i = 1; i <= months; i++) {
    const traderShare = accountSize * (monthlyReturn / 100) * (split / 100);
    totalProfit += traderShare;
    monthlyData.push({ month: i, cumulative: totalProfit });
  }

  document.getElementById('sim-result')?.classList.add('active');
  document.getElementById('sim-total').textContent = '$' + totalProfit.toFixed(2);
  document.getElementById('sim-monthly-avg').textContent = '$' + (totalProfit / months).toFixed(2);

  const chartContainer = document.getElementById('sim-chart');
  if (!chartContainer) return;
  chartContainer.innerHTML = '';
  const maxVal = Math.max(...monthlyData.map(d => d.cumulative));
  monthlyData.forEach(d => {
    const bar = document.createElement('div');
    const height = maxVal > 0 ? (d.cumulative / maxVal * 100) : 0;
    bar.style.cssText = 'display:flex;align-items:flex-end;flex-direction:column;gap:4px;flex:1;';
    bar.innerHTML = `<div style="width:100%;background:linear-gradient(to top,#1a73e8,#1557b0);height:${Math.max(height, 5)}px;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#5f6368;">${d.month}</span>`;
    chartContainer.appendChild(bar);
  });
}

function calculateDrawdown() {
  const accountSize = parseFloat(document.getElementById('dd-account')?.value);
  const maxDD = parseFloat(document.getElementById('dd-max')?.value);
  const dailyDD = parseFloat(document.getElementById('dd-daily')?.value);
  if (!accountSize || !maxDD || !dailyDD) return;
  const maxDDAmount = accountSize * (maxDD / 100);
  const dailyDDAmount = accountSize * (dailyDD / 100);
  const safeZone = accountSize - maxDDAmount;
  document.getElementById('dd-result')?.classList.add('active');
  document.getElementById('dd-max-amount').textContent = '$' + maxDDAmount.toFixed(2);
  document.getElementById('dd-daily-amount').textContent = '$' + dailyDDAmount.toFixed(2);
  document.getElementById('dd-safe').textContent = '$' + safeZone.toFixed(2);
}
