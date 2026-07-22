/* =========================================================
   country.js — Country profile page
   ========================================================= */
(async function () {
  pageInit("countries");
  await Search.initHeader();

  const id   = getParam("id");
  const main = document.getElementById("main");

  if (!id) {
    main.innerHTML = `<div class="container"><div class="empty-state">
      <p style="font-size:2rem">🌍</p>
      <p>No country selected. <a href="${BASE}/countries/" style="color:var(--color-primary)">${_t("nav_countries")}</a></p>
    </div></div>`;
    return;
  }

  let countries, categories;
  try {
    [countries, categories] = await Promise.all([loadCountries(), loadCategories()]);
  } catch (e) {
    main.innerHTML = `<div class="container"><div class="empty-state"><p>Failed to load data.</p></div></div>`;
    return;
  }

  const country = countries.find(c => c.id === id);
  if (!country) {
    main.innerHTML = `<div class="container"><div class="empty-state">
      <p>Country not found. <a href="${BASE}/countries/">Back</a></p>
    </div></div>`;
    return;
  }

  const rankingResults = await Promise.allSettled(categories.map(cat => loadRanking(cat.id)));

  const catRanks = [];
  categories.forEach((cat, i) => {
    if (rankingResults[i].status !== "fulfilled") return;
    const data = rankingResults[i].value;
    const row  = data.rankings.find(r => r.country === id);
    if (!row) return;
    catRanks.push({ cat, rank: row.rank, score: row.score, total: data.rankings.length });
  });
  catRanks.sort((a, b) => a.rank - b.rank);

  const sameContinent = countries
    .filter(c => c.continent === country.continent && c.id !== id)
    .sort((a, b) => a.name.localeCompare(b.name));

  document.title = `${country.name} — ${_t("rankings")}, Facts & Data 2025 — CountryRank`;
  document.querySelector('meta[name="description"]')
    ?.setAttribute("content", `${country.name}: ${_t("capital")} ${country.capital}, ${catRanks.length} global rankings.`);

  const icons = {
    "gdp-nominal":"💰","gdp-per-capita":"💵","population":"👥",
    "life-expectancy":"❤️","human-development-index":"🏅",
    "passport-index":"✈️","global-peace-index":"🕊️",
    "corruption-perceptions":"🔍","happiness":"😊",
    "internet-users":"🌐","military-expenditure":"🛡️",
    "literacy-rate":"📚","unemployment-rate":"📉",
    "co2-emissions":"🌿","forest-area":"🌲"
  };

  function buildRankingsSection() {
    if (!catRanks.length) return `<p style="color:var(--color-text-muted)">No ranking data available.</p>`;
    return `
      <div class="ranking-table-wrap">
        ${catRanks.map(({ cat, rank, score, total }) => `
          <a href="${BASE}/category.html?id=${cat.id}" class="ranking-row-link" aria-label="${cat.name}: rank ${rank} of ${total}">
            <div style="display:flex;align-items:center;gap:12px">
              <span style="font-size:1.3rem" aria-hidden="true">${icons[cat.id] || "📊"}</span>
              <div>
                <div class="cat-name">${cat.name}</div>
                <div style="font-size:.78rem;color:var(--color-text-muted)">
                  ${_t("score")}: ${formatScore(score, cat.unit)} &nbsp;·&nbsp; of ${total} countries
                </div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span class="cat-rank-badge">#${rank}</span>
              <span style="font-size:.78rem;color:var(--color-text-muted)">${_t("view_ranking")}</span>
            </div>
          </a>`).join("")}
      </div>`;
  }

  function buildCountrySwitcher() {
    return `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:12px 0">
        <label for="country-switcher" class="select-label">${_t("switch_country")}</label>
        <select id="country-switcher" class="full-select" style="max-width:340px">
          <optgroup label="${country.continent}">
            ${sameContinent.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}
          </optgroup>
          <optgroup label="All Countries">
            ${countries.slice().sort((a,b) => a.name.localeCompare(b.name))
              .map(c => `<option value="${c.id}" ${c.id===id?"selected":""}>${c.name}</option>`).join("")}
          </optgroup>
        </select>
      </div>`;
  }

  main.innerHTML = `
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${BASE}/">Home</a><span aria-hidden="true"> › </span>
        <a href="${BASE}/countries/">${_t("nav_countries")}</a><span aria-hidden="true"> › </span>
        <span aria-current="page">${country.name}</span>
      </nav>

      <div class="detail-header">
        <img class="flag-lg" src="${country.flag}" alt="Flag of ${country.name}" width="84" height="60">
        <div>
          <h1>${country.name}</h1>
          <p class="detail-meta">
            ${_t("continent")}: ${country.continent} &nbsp;·&nbsp; ISO: ${country.iso2} &nbsp;·&nbsp; ${country.government}
          </p>
        </div>
      </div>

      ${buildCountrySwitcher()}

      <div class="info-grid" aria-label="Key facts about ${country.name}">
        <div class="info-tile"><div class="label">${_t("capital")}</div><div class="value">${country.capital}</div></div>
        <div class="info-tile"><div class="label">${_t("population")}</div><div class="value">${formatPopulation(country.population)}</div></div>
        <div class="info-tile"><div class="label">${_t("area")}</div><div class="value">${formatArea(country.area_km2)}</div></div>
        <div class="info-tile"><div class="label">${_t("currency")}</div><div class="value">${country.currency}</div></div>
        <div class="info-tile"><div class="label">${_t("languages")}</div><div class="value">${country.languages}</div></div>
        <div class="info-tile"><div class="label">${_t("iso_code")}</div><div class="value">${country.iso2}</div></div>
        <div class="info-tile"><div class="label">${_t("government")}</div><div class="value">${country.government}</div></div>
        <div class="info-tile"><div class="label">${_t("continent")}</div><div class="value">${country.continent}</div></div>
      </div>

      <h2 class="section-title">${_t("rankings")} (${catRanks.length} categories)</h2>
      <p style="color:var(--color-text-muted);margin-bottom:16px;font-size:.9rem">
        Click any category to see where all 195 countries rank.
      </p>
      ${buildRankingsSection()}

      <div style="height:40px"></div>
    </div>`;

  document.getElementById("country-switcher")?.addEventListener("change", e => {
    if (e.target.value) location.href = `${BASE}/country.html?id=${e.target.value}`;
  });

  const schema = {
    "@context":"https://schema.org","@type":"Country",
    "name":country.name, "url":location.href,
    "description":`${country.name} rankings across ${catRanks.length} global indices.`,
    "containedInPlace":{"@type":"Continent","name":country.continent}
  };
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);
})();
