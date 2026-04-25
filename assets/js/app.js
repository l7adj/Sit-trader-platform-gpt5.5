// ============================================
// محطة التمويل - App.js
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', function() {
      mainNav.classList.toggle('active');
    });
  }

  // Header scroll effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(17, 24, 39, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
      } else {
        header.style.background = '';
        header.style.backdropFilter = '';
      }
    });
  }

  // Smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// ============================================
// Financial Tools Calculators
// ============================================

function calculateRisk() {
  const accountSize = parseFloat(document.getElementById('risk-account')?.value);
  const riskPercent = parseFloat(document.getElementById('risk-percent')?.value);
  const stopLoss = parseFloat(document.getElementById('risk-sl')?.value);
  const resultEl = document.getElementById('risk-result');

  if (!accountSize || !riskPercent || !stopLoss || !resultEl) return;

  const riskAmount = accountSize * (riskPercent / 100);
  const positionSize = riskAmount / stopLoss;

  resultEl.innerHTML = `
    <p>مبلغ المخاطرة: <strong>$${riskAmount.toFixed(2)}</strong></p>
    <p>حجم المركز: <strong>${positionSize.toFixed(2)} لوت</strong></p>
  `;
}

function calculatePip() {
  const lotSize = parseFloat(document.getElementById('pip-lot')?.value);
  const pipCount = parseFloat(document.getElementById('pip-count')?.value);
  const resultEl = document.getElementById('pip-result');

  if (!lotSize || !pipCount || !resultEl) return;

  const pipValue = lotSize * 10;
  const totalValue = pipValue * pipCount;

  resultEl.innerHTML = `
    <p>قيمة النقطة: <strong>$${pipValue.toFixed(2)}</strong></p>
    <p>الإجمالي: <strong>$${totalValue.toFixed(2)}</strong></p>
  `;
}

function calculateMargin() {
  const accountSize = parseFloat(document.getElementById('margin-account')?.value);
  const leverage = parseFloat(document.getElementById('margin-leverage')?.value);
  const resultEl = document.getElementById('margin-result');

  if (!accountSize || !leverage || !resultEl) return;

  const margin = accountSize / leverage;
  const maxPosition = accountSize * leverage;

  resultEl.innerHTML = `
    <p>الهامش المطلوب: <strong>$${margin.toFixed(2)}</strong></p>
    <p>أقصى حجم مركز: <strong>$${maxPosition.toFixed(2)}</strong></p>
  `;
}

function calculatePayout() {
  const profit = parseFloat(document.getElementById('payout-profit')?.value);
  const split = parseFloat(document.getElementById('payout-split')?.value);
  const resultEl = document.getElementById('payout-result');

  if (!profit || !split || !resultEl) return;

  const traderShare = profit * (split / 100);
  const firmShare = profit - traderShare;

  resultEl.innerHTML = `
    <p>نصيب المتداول: <strong>$${traderShare.toFixed(2)}</strong></p>
    <p>نصيب الشركة: <strong>$${firmShare.toFixed(2)}</strong></p>
  `;
}

function simulatePropFirm() {
  const accountSize = parseFloat(document.getElementById('sim-account')?.value);
  const profitTarget = parseFloat(document.getElementById('sim-target')?.value);
  const maxDD = parseFloat(document.getElementById('sim-dd')?.value);
  const resultEl = document.getElementById('sim-result');

  if (!accountSize || !profitTarget || !maxDD || !resultEl) return;

  const targetAmount = accountSize * (profitTarget / 100);
  const ddAmount = accountSize * (maxDD / 100);
  const riskReward = targetAmount / ddAmount;

  resultEl.innerHTML = `
    <p>هدف الربح: <strong>$${targetAmount.toFixed(2)}</strong></p>
    <p>الخسارة القصوى: <strong>$${ddAmount.toFixed(2)}</strong></p>
    <p>نسبة المخاطرة/العائد: <strong>1:${riskReward.toFixed(2)}</strong></p>
  `;
}

function calculateDrawdown() {
  const balance = parseFloat(document.getElementById('dd-balance')?.value);
  const ddPercent = parseFloat(document.getElementById('dd-percent')?.value);
  const resultEl = document.getElementById('dd-result');

  if (!balance || !ddPercent || !resultEl) return;

  const ddAmount = balance * (ddPercent / 100);
  const limitPrice = balance - ddAmount;

  resultEl.innerHTML = `
    <p>مبلغ الدراوداون: <strong>$${ddAmount.toFixed(2)}</strong></p>
    <p>سعر الحد: <strong>$${limitPrice.toFixed(2)}</strong></p>
  `;
}
