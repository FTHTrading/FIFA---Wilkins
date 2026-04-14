import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

const colorMap = {
  blue: 'blue',
  green: 'green',
  violet: 'violet',
  fuchsia: 'fuchsia'
};

async function loadBrand() {
  const response = await fetch('./brand.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Unable to load brand.json');
  }

  return response.json();
}

function applyTheme(brand) {
  const root = document.documentElement;
  const colors = brand.colors || {};
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function renderMetrics(metrics) {
  const container = document.getElementById('metrics-grid');
  if (!container) return;

  container.innerHTML = metrics
    .map((metric) => `
      <article class="metric-card">
        <span class="eyebrow">${metric.label}</span>
        <span class="value">${metric.value}</span>
      </article>
    `)
    .join('');
}

function renderSurfaces(surfaces) {
  const container = document.getElementById('surfaces-grid');
  if (!container) return;

  container.innerHTML = surfaces
    .map((surface) => {
      const className = colorMap[surface.color] || 'blue';
      return `
        <article class="surface-card ${className}">
          <p class="eyebrow">${surface.color}</p>
          <h4>${surface.title}</h4>
          <p class="muted">${surface.description}</p>
        </article>
      `;
    })
    .join('');
}

function renderJourney(items) {
  const container = document.getElementById('journey-list');
  if (!container) return;

  container.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
}

async function main() {
  const brand = await loadBrand();
  applyTheme(brand);

  document.title = `${brand.programName} | ${brand.eventName}`;
  setText('brand-title', brand.programName);
  setText('brand-program', `${brand.brandOwner} · ${brand.eventName}`);
  setText('brand-tagline', `${brand.location} · ${brand.tagline}`);
  setText('hero-title', brand.heroTitle);
  setText('hero-subtitle', brand.heroSubtitle);

  const repoLink = document.getElementById('repo-link');
  if (repoLink) {
    repoLink.href = brand.repoUrl;
  }

  renderMetrics(brand.metrics || []);
  renderSurfaces(brand.surfaces || []);
  renderJourney(brand.journey || []);

  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    securityLevel: 'loose',
    themeVariables: {
      background: '#08111f',
      primaryColor: brand.colors?.primary || '#0ea5e9',
      primaryTextColor: brand.colors?.text || '#eef4ff',
      primaryBorderColor: brand.colors?.line || '#2d4372',
      secondaryColor: brand.colors?.accent || '#d946ef',
      tertiaryColor: brand.colors?.surface || '#0c1730',
      lineColor: brand.colors?.muted || '#94a8cc',
      textColor: brand.colors?.text || '#eef4ff'
    }
  });

  await mermaid.run({ querySelector: '.mermaid' });
}

main().catch((error) => {
  console.error(error);
});