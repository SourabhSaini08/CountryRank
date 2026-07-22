/* =========================================================
   app.js — Shared utilities, header, footer
   Uses I18n.t() for all visible text so language switching works
   ========================================================= */
/* BASE is always root ("") because CountryRank is hosted at the domain root
   (e.g. mycountryrank.com/...), not under a GitHub Pages project subpath.
   All internal links and data fetches are root-absolute (start with "/"). */
const BASE = "";

function dataUrl(path) { return `${BASE}/data/${path}`; }

const Cache = {};
async function fetchJSON(url) {
  if (Cache[url]) return Cache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url}`);
  const data = await res.json();
  Cache[url] = data;
  return data;
}

async function loadCountries()       { return fetchJSON(dataUrl("countries.json")); }
async function loadCategories()      { return fetchJSON(dataUrl("categories.json")); }
async function loadRanking(catId)    { return fetchJSON(dataUrl(`rankings/${catId}.json`)); }
async function loadExtraCategories() { return fetchJSON(dataUrl("extra-categories.json")); }

function _t(key) { return (typeof I18n !== "undefined") ? I18n.t(key) : key; }

function formatScore(score, unit) {
  if (score === null || score === undefined) return "N/A";
  if (unit === "USD") {
    if (score >= 1e12) return "$" + (score/1e12).toFixed(2) + "T";
    if (score >= 1e9)  return "$" + (score/1e9).toFixed(1)  + "B";
    if (score >= 1e6)  return "$" + (score/1e6).toFixed(1)  + "M";
    return "$" + score.toLocaleString();
  }
  if (unit === "people") {
    if (score >= 1e9) return (score/1e9).toFixed(2) + "B";
    if (score >= 1e6) return (score/1e6).toFixed(1) + "M";
    if (score >= 1e3) return (score/1e3).toFixed(0) + "K";
    return score.toLocaleString();
  }
  if (typeof score === "number") {
    if (Number.isInteger(score)) return score.toLocaleString();
    return score.toFixed(2);
  }
  return score;
}
function formatPopulation(n) {
  if (n >= 1e9) return (n/1e9).toFixed(2) + " billion";
  if (n >= 1e6) return (n/1e6).toFixed(1)  + " million";
  if (n >= 1e3) return (n/1e3).toFixed(0)  + " thousand";
  return n.toLocaleString();
}
function formatArea(km2) { return km2.toLocaleString() + " km²"; }
function getParam(name) { return new URLSearchParams(location.search).get(name) || ""; }

function markActiveNav() {
  const path = location.pathname;
  document.querySelectorAll(".main-nav a[data-page]").forEach(a => {
    if (a.dataset.page && path.replace(/\/$/, "").endsWith(a.dataset.page)) {
      a.classList.add("active");
    }
  });
}

function renderHeader(activePage) {
  const home        = _t("nav_home");
  const categories  = _t("nav_categories");
  const countries   = _t("nav_countries");
  const placeholder = _t("search_placeholder");

  return `
  <a href="#main" class="skip-link">${home}</a>
  <header class="site-header" role="banner">
    <div class="container">
      <a href="${BASE}/" class="logo" aria-label="CountryRank ${home}">
        <span class="logo-mark" aria-hidden="true">🌍</span>
        CountryRank
      </a>
      <nav class="main-nav" id="main-nav" aria-label="Main navigation">
        <a href="${BASE}/" data-page="" ${activePage===""?"class='active'":""}>${home}</a>
        <a href="${BASE}/categories/" data-page="categories" ${activePage==="categories"?"class='active'":""}>${categories}</a>
        <a href="${BASE}/countries/" data-page="countries" ${activePage==="countries"?"class='active'":""}>${countries}</a>
      </nav>
      <div class="header-search" role="search">
        <div class="search-box" id="header-search-box">
          <svg class="search-icon" aria-hidden="true" width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input type="search" id="header-search-input"
            placeholder="${placeholder}"
            autocomplete="off" aria-label="${placeholder}"
            aria-autocomplete="list" aria-controls="header-search-suggestions">
          <div class="search-suggestions" id="header-search-suggestions" role="listbox"></div>
        </div>
      </div>
      <button class="theme-toggle" aria-label="Toggle dark mode">🌙</button>
      <div id="lang-switcher-mount"></div>
      <button class="nav-toggle" aria-label="Open navigation"
        aria-expanded="false" aria-controls="main-nav">☰</button>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>${_t("footer_home")}</h4>
          <a href="${BASE}/">${_t("nav_home")}</a>
          <a href="${BASE}/categories/">${_t("nav_categories")}</a>
          <a href="${BASE}/countries/">${_t("nav_countries")}</a>
        </div>
        <div>
          <h4>${_t("footer_data")}</h4>
          <a href="https://www.worldbank.org/" target="_blank" rel="noopener">World Bank</a>
          <a href="https://www.imf.org/" target="_blank" rel="noopener">IMF</a>
          <a href="https://www.un.org/" target="_blank" rel="noopener">United Nations</a>
          <a href="https://www.who.int/" target="_blank" rel="noopener">WHO</a>
        </div>
        <div>
          <h4>${_t("footer_more")}</h4>
          <a href="https://worldhappiness.report/" target="_blank" rel="noopener">Happiness Report</a>
          <a href="https://www.sipri.org/" target="_blank" rel="noopener">SIPRI</a>
          <a href="https://www.transparency.org/" target="_blank" rel="noopener">Transparency Int'l</a>
          <a href="https://ourworldindata.org/" target="_blank" rel="noopener">Our World in Data</a>
        </div>
        <div>
          <h4>${_t("footer_legal")}</h4>
          <a href="${BASE}/privacy.html">${_t("footer_privacy")}</a>
          <a href="${BASE}/disclaimer.html">${_t("footer_disclaimer")}</a>
          <a href="${BASE}/terms.html">${_t("footer_terms")}</a>
          <a href="${BASE}/contact.html">${_t("footer_contact")}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} CountryRank. ${_t("footer_copy")}</span>
        <div class="footer-legal">
          <a href="${BASE}/privacy.html">${_t("footer_privacy")}</a>
          <a href="${BASE}/disclaimer.html">${_t("footer_disclaimer")}</a>
          <a href="${BASE}/terms.html">${_t("footer_terms")}</a>
          <a href="${BASE}/contact.html">${_t("footer_contact")}</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function initHamburger() {
  const toggle = document.querySelector(".nav-toggle");
  const nav    = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "✕" : "☰";
  });
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    });
  });
  document.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "☰";
  });
}

function pageInit(activePage) {
  document.body.insertAdjacentHTML("afterbegin", renderHeader(activePage));
  document.body.insertAdjacentHTML("beforeend", renderFooter());
  Theme.init();
  markActiveNav();
  initHamburger();
  const mount = document.getElementById("lang-switcher-mount");
  if (mount && typeof I18n !== "undefined") {
    mount.outerHTML = I18n.renderSwitcher();
    I18n.init();
  }
}
