const fs = require('fs');
const path = require('path');

const SITE = 'https://sit-trader-platform.netlify.app';
const root = process.cwd();

const trustLinks = `
        <a href="/about.html">من نحن</a>
        <a href="/methodology.html">منهجية التقييم</a>
        <a href="/privacy-policy.html">سياسة الخصوصية</a>
        <a href="/disclaimer.html">إخلاء المسؤولية</a>
        <a href="/contact.html">اتصل بنا</a>`;

const riskBanner = `<div class="risk-banner"><div class="container">⚠️ التداول والحسابات الممولة تنطوي على مخاطر عالية. المعلومات في هذا الموقع تعليمية وليست نصيحة مالية. راجع القواعد الرسمية لكل شركة قبل اتخاذ القرار.</div></div>`;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['.git', 'node_modules'].includes(entry.name)) continue;
      files = files.concat(walk(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function canonicalFor(file) {
  let rel = path.relative(root, file).replace(/\\/g, '/');
  if (rel === 'index.html') return `${SITE}/`;
  if (rel.endsWith('/index.html')) return `${SITE}/${rel.replace(/index\.html$/, '')}`;
  return `${SITE}/${rel}`;
}

function ensureFooterLinks(html) {
  if (html.includes('/privacy-policy.html') && html.includes('/disclaimer.html')) return html;

  const marker = '<div class="footer-bottom">';
  const idx = html.indexOf(marker);
  if (idx === -1) return html;

  const insertAt = idx + marker.length;
  return html.slice(0, insertAt) + `\n      <p class="footer-trust-links">${trustLinks}\n      </p>` + html.slice(insertAt);
}

function fixHtml(file) {
  let html = fs.readFileSync(file, 'utf8');
  const canonical = canonicalFor(file);

  html = html.replace(/https:\/\/prophub\.com\/?/g, SITE + '/');
  html = html.replace(/https:\/\/singular-unicorn-ed0891\.netlify\.app/g, SITE);

  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}">`);
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${canonical}">\n</head>`);
  }

  html = ensureFooterLinks(html);

  if (!html.includes('class="risk-banner"')) {
    html = html.replace('<main>', `<main>\n${riskBanner}`);
  }

  fs.writeFileSync(file, html, 'utf8');
}

for (const file of walk(root)) fixHtml(file);

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
fs.writeFileSync(path.join(root, 'robots.txt'), robots, 'utf8');

const htmlFiles = walk(root)
  .map(file => path.relative(root, file).replace(/\\/g, '/'))
  .filter(rel => !rel.startsWith('.'));

const urls = htmlFiles.map(rel => {
  let loc = rel === 'index.html' ? `${SITE}/` : rel.endsWith('/index.html') ? `${SITE}/${rel.replace(/index\.html$/, '')}` : `${SITE}/${rel}`;
  return `  <url><loc>${loc}</loc></url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Fixed ${htmlFiles.length} HTML files, robots.txt, and sitemap.xml`);
