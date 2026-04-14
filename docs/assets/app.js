/* ═══════════════════════════════════════════════════════════
   FIFA × Wilkins — Atlanta World Cup Command Surface
   Loads match data, renders sections, drives interactivity
   ═══════════════════════════════════════════════════════════ */

const DATA_URL = './data/atlanta-matches.json';

let DATA = null;

async function loadData() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`Failed to load data: ${res.status}`);
  DATA = await res.json();
  return DATA;
}

/* ── Match Ribbon (hero) ── */
function renderMatchRibbon(matches) {
  const el = document.getElementById('match-ribbon');
  if (!el) return;
  el.innerHTML = matches.map(m => {
    const dateStr = new Date(m.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const home = m.homeTeamCode === 'TBD' ? m.homeTeam : m.homeTeamCode;
    const away = m.awayTeamCode === 'TBD' ? m.awayTeam : m.awayTeamCode;
    return `<div class="ribbon-match">
      <span class="ribbon-date">${dateStr}</span>
      <span class="ribbon-teams">${home} vs ${away}</span>
      <span class="ribbon-round">${m.stage}</span>
    </div>`;
  }).join('');
}

/* ── Match Grid ── */
function renderMatchGrid(matches) {
  const el = document.getElementById('match-grid');
  if (!el) return;
  el.innerHTML = matches.map(m => {
    const dateStr = new Date(m.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const teamsLabel = `${m.homeTeam} vs ${m.awayTeam}`;
    const flags = [m.homeTeamFlag, m.awayTeamFlag].map(f => `<span class="team-flag">${f}</span>`).join('');
    const hasTBD = m.homeTeamCode === 'TBD' || m.awayTeamCode === 'TBD';
    const isKnockout = m.stage !== 'Group Stage';
    const badge = hasTBD && isKnockout
      ? `<span class="match-knockout">${m.stage}</span>`
      : hasTBD
        ? '<span class="match-tbd">TBD Slot</span>'
        : '';

    const ap = m.audienceProfile;
    const langs = ap ? ap.primaryLanguages.join(', ') : '';
    const split = ap && ap.supporterSplit ? `${ap.supporterSplit.home}/${ap.supporterSplit.away}/${ap.supporterSplit.neutral}` : '';
    const audienceNote = ap ? `<span>~${(ap.estimatedAttendance / 1000).toFixed(0)}K attendance · Split: ${split}</span>` : '';

    return `<div class="match-card">
      ${badge}
      <div class="match-round">${m.stage}</div>
      <div class="match-teams-line">${teamsLabel}</div>
      <div class="match-meta">
        <span>${dateStr} · ${m.kickoff}</span>
        <span>Mercedes-Benz Stadium</span>
        ${langs ? `<span>Languages: ${langs}</span>` : ''}
        ${audienceNote}
      </div>
      <div class="team-flags">${flags}</div>
    </div>`;
  }).join('');
}

/* ── Culture Grid ── */
function renderCultureGrid(teamProfilesObj) {
  const el = document.getElementById('culture-grid');
  if (!el) return;
  const teams = Object.values(teamProfilesObj);
  el.innerHTML = teams.map(t => {
    const cp = t.culturalProfile || {};
    const tags = [
      ...t.languages.map(l => l.toUpperCase()),
      ...(cp.cuisineAffinities || []).slice(0, 3),
    ].map(tag => `<span class="culture-tag">${tag}</span>`).join('');

    const meta = [
      cp.dietaryNotes && cp.dietaryNotes.length ? `Diet: ${cp.dietaryNotes.join(', ')}` : '',
      cp.hospitalityStyle ? `Style: ${cp.hospitalityStyle}` : '',
      cp.premiumAffinity ? `Premium: ${cp.premiumAffinity}` : '',
    ].filter(Boolean).map(s => `<span>${s}</span>`).join('');

    return `<div class="culture-card">
      <span class="culture-flag">${t.flag}</span>
      <h4>${t.name}</h4>
      <div class="culture-meta">${meta}</div>
      <div class="culture-tags">${tags}</div>
    </div>`;
  }).join('');
}

/* ── Official Sponsors ── */
function renderOfficialSponsors(officialFIFA) {
  const el = document.getElementById('official-sponsors');
  if (!el) return;
  const partners = officialFIFA.partners || [];
  el.innerHTML = partners.map(s => `<span class="sponsor-tag">${s.name}</span>`).join('');
}

/* ── Local Categories ── */
function renderLocalCategories(categories) {
  const el = document.getElementById('local-categories');
  if (!el) return;
  el.innerHTML = categories.map(c => `<div class="activation-item">${c}</div>`).join('');
}

/* ── Boot ── */
async function boot() {
  try {
    const data = await loadData();

    renderMatchRibbon(data.matches);
    renderMatchGrid(data.matches);
    renderCultureGrid(data.teamProfiles);

    if (data.sponsors) {
      renderOfficialSponsors(data.sponsors.officialFIFA);
      renderLocalCategories(data.sponsors.localActivation.categories);
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Intersection Observer for fade-in
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(s => {
      s.classList.add('fade-in');
      observer.observe(s);
    });
  } catch (err) {
    console.error('Wilkins boot error:', err);
  }
}

// Add fade-in CSS dynamically
const style = document.createElement('style');
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);

boot();
