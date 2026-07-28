/* =========================================================
   search.js — Live search
   FIXED: each attach() call now creates an ISOLATED instance
   with its own private state. Previously all search boxes
   shared one set of module variables, so the last box to
   initialize silently broke every other box on the page
   (this is exactly what caused the homepage Country/Category
   search cards to read/write into the wrong dropdown).

   Supports scoped modes:
     "all"        -> shows both Countries and Categories (header, 404 page)
     "countries"  -> shows Countries only (home page "Search Countries" card)
     "categories" -> shows Categories only (home page "Search Categories" card)
   ========================================================= */
const Search = (() => {
  /* Shared read-only data cache — safe to share since it's the same
     source data for every search box. A single in-flight promise is
     reused so concurrent attach() calls don't trigger duplicate fetches. */
  let _countries = [], _categories = [], _loadPromise = null;

  async function ensureLoaded() {
    if (_countries.length) return;
    if (!_loadPromise) {
      _loadPromise = Promise.all([loadCountries(), loadCategories()]).then(([c, cat]) => {
        _countries = c; _categories = cat;
      });
    }
    await _loadPromise;
  }

  function score(text, query) {
    const t = text.toLowerCase(), q = query.toLowerCase();
    if (t === q) return 3;
    if (t.startsWith(q)) return 2;
    if (t.includes(q)) return 1;
    return 0;
  }

  function buildSuggestions(query, mode) {
    const q = query.trim();
    if (!q) return { html: "", items: [] };

    const showCountries  = mode === "all" || mode === "countries";
    const showCategories = mode === "all" || mode === "categories";

    const matchedCountries = showCountries ? _countries
      .map(c => ({ ...c, _score: score(c.name, q) }))
      .filter(c => c._score > 0).sort((a,b) => b._score - a._score).slice(0, mode === "countries" ? 10 : 7)
      : [];

    const matchedCats = showCategories ? _categories
      .map(c => ({ ...c, _score: score(c.name, q) }))
      .filter(c => c._score > 0).sort((a,b) => b._score - a._score).slice(0, mode === "categories" ? 10 : 5)
      : [];

    if (!matchedCountries.length && !matchedCats.length) {
      return { html: `<div class="suggestion-empty">No results for "<strong>${q}</strong>"</div>`, items: [] };
    }

    let html = "";
    const items = [];

    if (matchedCountries.length) {
      if (mode === "all") html += `<div class="suggestion-group-label" aria-hidden="true">Countries</div>`;
      matchedCountries.forEach(c => {
        const url = `${BASE}/country.html?id=${c.id}`;
        html += `
          <div class="suggestion-item" role="option" tabindex="-1" data-url="${url}">
            <img class="flag-sm" src="${c.flag}" alt="${c.name} flag" width="22" height="16" loading="lazy">
            <span>${c.name}</span>
            <small style="margin-left:auto;color:var(--color-text-muted)">${c.continent}</small>
          </div>`;
        items.push(url);
      });
    }
    if (matchedCats.length) {
      if (mode === "all") html += `<div class="suggestion-group-label" aria-hidden="true">Categories</div>`;
      matchedCats.forEach(c => {
        const url = `${BASE}/category.html?id=${c.id}`;
        html += `
          <div class="suggestion-item" role="option" tabindex="-1" data-url="${url}">
            <span style="font-size:1.1em">📊</span>
            <span>${c.name}</span>
          </div>`;
        items.push(url);
      });
    }
    return { html, items };
  }

  function go(url) { location.href = url; }

  /* Each call creates a fully independent instance — its own
     input, dropdown, mode, active index, and matched items,
     all captured in this function's own closure. Nothing here
     is shared with any other search box on the page. */
  function attach(inputEl, dropdownEl, mode = "all") {
    let activeIdx = -1;
    let items = [];

    inputEl.addEventListener("input", async () => {
      const q = inputEl.value.trim();
      if (!q) { dropdownEl.classList.remove("open"); return; }
      await ensureLoaded();
      const result = buildSuggestions(q, mode);
      items = result.items;
      dropdownEl.innerHTML = result.html;
      activeIdx = -1;
      dropdownEl.classList.add("open");
      dropdownEl.querySelectorAll(".suggestion-item").forEach((el, i) => {
        el.addEventListener("mousedown", (e) => { e.preventDefault(); go(items[i]); });
      });
    });

    function setActive(idx) {
      const all = dropdownEl.querySelectorAll(".suggestion-item");
      all.forEach((el, i) => el.classList.toggle("active", i === idx));
      activeIdx = idx;
    }

    inputEl.addEventListener("keydown", (e) => {
      const all = dropdownEl.querySelectorAll(".suggestion-item");
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(activeIdx + 1, all.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(Math.max(activeIdx - 1, 0)); }
      else if (e.key === "Enter") {
        if (activeIdx >= 0 && items[activeIdx]) { e.preventDefault(); go(items[activeIdx]); }
        else if (items.length) { e.preventDefault(); go(items[0]); }
      } else if (e.key === "Escape") { dropdownEl.classList.remove("open"); inputEl.blur(); }
    });

    document.addEventListener("click", (e) => {
      if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) dropdownEl.classList.remove("open");
    });
  }

  async function initHeader() {
    const input = document.getElementById("header-search-input");
    const dropdown = document.getElementById("header-search-suggestions");
    if (!input || !dropdown) return;
    attach(input, dropdown, "all");
  }

  function attachHero(inputId, dropdownId, mode = "all") {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;
    attach(input, dropdown, mode);
  }

  return { load: ensureLoaded, initHeader, attachHero, attach };
})();
