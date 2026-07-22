/* =========================================================
   category.js — Category ranking page
   Rankings sorted by rank ASC so #1 always displays first
   ========================================================= */
(async function () {
  pageInit("categories");
  await Search.initHeader();

  const id   = getParam("id");
  const main = document.getElementById("main");

  if (!id) {
    main.innerHTML = `<div class="container"><div class="empty-state">
      <p style="font-size:2rem">📊</p>
      <p>No category selected. <a href="${BASE}/categories/" style="color:var(--color-primary)">${_t("nav_categories")}</a></p>
    </div></div>`;
    return;
  }

  let categories, countries, rankingData;
  try {
    [categories, countries, rankingData] = await Promise.all([
      loadCategories(), loadCountries(), loadRanking(id)
    ]);
  } catch (e) {
    main.innerHTML = `<div class="container"><div class="empty-state">
      <p>Failed to load data. <a href="${BASE}/categories/">Back</a></p>
    </div></div>`;
    return;
  }

  const cat = categories.find(c => c.id === id);
  if (!cat) {
    main.innerHTML = `<div class="container"><div class="empty-state">
      <p>Category not found. <a href="${BASE}/categories/">Back</a></p>
    </div></div>`;
    return;
  }

  const countryMap = {};
  countries.forEach(c => { countryMap[c.id] = c; });

  document.title = `${cat.name} ${_t("rankings")} 2025 — CountryRank`;
  document.querySelector('meta[name="description"]')
    ?.setAttribute("content", `${cat.name} country rankings. ${cat.description}`);

  const icons = {
    "gdp-nominal":"💰","gdp-per-capita":"💵","population":"👥",
    "life-expectancy":"❤️","human-development-index":"🏅",
    "passport-index":"✈️","global-peace-index":"🕊️",
    "corruption-perceptions":"🔍","happiness":"😊",
    "internet-users":"🌐","military-expenditure":"🛡️",
    "literacy-rate":"📚","unemployment-rate":"📉",
    "co2-emissions":"🌿","forest-area":"🌲"
  };
  const icon = icons[id] || "📊";

  const rankings = [...rankingData.rankings].sort((a, b) => a.rank - b.rank);

  function buildRow(r, idx) {
    const c = countryMap[r.country];
    if (!c) return "";
    const rankClass = r.rank <= 3 ? "top-3" : "";
    return `
      <tr data-href="${BASE}/country.html?id=${c.id}" tabindex="0" role="row"
          aria-label="${c.name}, ${_t("rank")} ${r.rank}">
        <td class="rank-cell ${rankClass}">${r.rank}</td>
        <td>
          <div class="country-cell">
            <img class="flag-sm" src="${c.flag}" alt="${c.name} flag"
              width="28" height="20" loading="${idx < 20 ? "eager" : "lazy"}">
            <span>${c.name}</span>
          </div>
        </td>
        <td class="score-cell">${formatScore(r.score, cat.unit)}</td>
        <td style="text-align:right">
          <a href="${BASE}/country.html?id=${c.id}"
            style="font-size:.78rem;color:var(--color-primary);font-weight:600;white-space:nowrap"
            onclick="event.stopPropagation()">${_t("view_profile")}</a>
        </td>
      </tr>`;
  }

  let filterQuery = "";
  function filtered() {
    if (!filterQuery) return rankings;
    const q = filterQuery.toLowerCase();
    return rankings.filter(r => {
      const c = countryMap[r.country];
      return c && c.name.toLowerCase().includes(q);
    });
  }

  function renderTable() {
    const rows = filtered();
    document.getElementById("row-count").textContent = `${rows.length} ${_t("nav_countries").toLowerCase()}`;
    document.getElementById("ranking-tbody").innerHTML =
      rows.length ? rows.map((r, i) => buildRow(r, i)).join("")
        : `<tr><td colspan="4" style="text-align:center;padding:32px;color:var(--color-text-muted)">${_t("no_results")}</td></tr>`;

    document.querySelectorAll("#ranking-tbody tr[data-href]").forEach(tr => {
      tr.addEventListener("click", () => location.href = tr.dataset.href);
      tr.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") location.href = tr.dataset.href;
      });
    });
  }

  function buildCatSwitcher() {
    return `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px">
        <label for="cat-switcher" class="select-label">${_t("switch_category")}</label>
        <select id="cat-switcher" class="full-select" style="max-width:320px">
          ${categories.map(c => `<option value="${c.id}" ${c.id===id?"selected":""}>${c.name}</option>`).join("")}
        </select>
      </div>`;
  }

  main.innerHTML = `
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${BASE}/">Home</a><span aria-hidden="true"> › </span>
        <a href="${BASE}/categories/">${_t("nav_categories")}</a><span aria-hidden="true"> › </span>
        <span aria-current="page">${cat.name}</span>
      </nav>

      <div class="detail-header">
        <div class="detail-icon" aria-hidden="true">${icon}</div>
        <div>
          <h1>${cat.name}</h1>
          <p class="detail-meta">
            ${cat.description}<br>
            ${_t("source")}: <a href="${cat.source_url}" target="_blank" rel="noopener">${cat.source}</a>
            &nbsp;·&nbsp; ${_t("last_updated")}: ${rankingData.last_updated}
            &nbsp;·&nbsp; ${cat.higher_is_better ? _t("higher_better") : _t("lower_better")}
          </p>
        </div>
      </div>

      <div class="data-notice">
        ℹ️ ${_t("data_note")}
        <a href="${cat.source_url}" target="_blank" rel="noopener">${cat.source}</a>.
      </div>

      ${buildCatSwitcher()}

      <div class="list-toolbar">
        <div class="search-box" style="max-width:320px;flex:1">
          <svg class="search-icon" aria-hidden="true" width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input type="search" id="filter-input" placeholder="${_t("filter_countries")}"
            aria-label="${_t("filter_countries")}" autocomplete="off">
        </div>
        <span class="result-count" id="row-count"></span>
      </div>

      <div class="ranking-table-wrap">
        <table class="ranking-table" aria-label="${cat.name} rankings">
          <thead>
            <tr>
              <th scope="col">${_t("rank")}</th>
              <th scope="col">${_t("country")}</th>
              <th scope="col" style="text-align:right">${cat.unit}</th>
              <th scope="col" style="text-align:right">${_t("profile")}</th>
            </tr>
          </thead>
          <tbody id="ranking-tbody"></tbody>
        </table>
      </div>

      <div id="faq-mount"></div>
    </div>`;

  document.getElementById("filter-input").addEventListener("input", e => {
    filterQuery = e.target.value;
    renderTable();
  });
  document.getElementById("cat-switcher").addEventListener("change", e => {
    if (e.target.value) location.href = `${BASE}/category.html?id=${e.target.value}`;
  });

  renderTable();

  if (typeof FAQ !== "undefined") {
    const fm = document.getElementById("faq-mount");
    if (fm) { fm.innerHTML = FAQ.buildCategoryFAQ(id); FAQ.initAccordions(); }
  }

  const schema = {
    "@context":"https://schema.org","@type":"Dataset",
    "name":`${cat.name} — Country Rankings`, "description":cat.description, "url":location.href,
    "creator":{"@type":"Organization","name":"CountryRank"}
  };
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);
})();
