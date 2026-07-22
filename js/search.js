/* =========================================================
   search.js — Live search
   Supports scoped modes:
     "all"        -> shows both Countries and Categories (header, 404 page)
     "countries"  -> shows Countries only (home page "Search Countries" card)
     "categories" -> shows Categories only (home page "Search Categories" card)
   ========================================================= */
const Search = (() => {
  let _countries = [], _categories = [], _activeIdx = -1, _items = [], _input, _dropdown, _mode = "all";

  async function load() {
    [_countries, _categories] = await Promise.all([loadCountries(), loadCategories()]);
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
    if (!q) return "";

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
      return `<div class="suggestion-empty">No results for "<strong>${q}</strong>"</div>`;
    }

    let html = "";
    _items = [];

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
        _items.push(url);
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
        _items.push(url);
      });
    }
    return html;
  }

  function setActive(idx) {
    const all = _dropdown.querySelectorAll(".suggestion-item");
    all.forEach((el, i) => el.classList.toggle("active", i === idx));
    _activeIdx = idx;
  }
  function go(url) { location.href = url; }

  function attach(inputEl, dropdownEl, mode = "all") {
    _input = inputEl; _dropdown = dropdownEl; _activeIdx = -1; _mode = mode;

    _input.addEventListener("input", async () => {
      const q = _input.value.trim();
      if (!q) { _dropdown.classList.remove("open"); return; }
      if (!_countries.length) await load();
      _dropdown.innerHTML = buildSuggestions(q, _mode);
      _activeIdx = -1;
      _dropdown.classList.add("open");
      _dropdown.querySelectorAll(".suggestion-item").forEach((el, i) => {
        el.addEventListener("mousedown", (e) => { e.preventDefault(); go(_items[i]); });
      });
    });

    _input.addEventListener("keydown", (e) => {
      const all = _dropdown.querySelectorAll(".suggestion-item");
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(_activeIdx + 1, all.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(Math.max(_activeIdx - 1, 0)); }
      else if (e.key === "Enter") {
        if (_activeIdx >= 0 && _items[_activeIdx]) { e.preventDefault(); go(_items[_activeIdx]); }
        else if (_items.length) { e.preventDefault(); go(_items[0]); }
      } else if (e.key === "Escape") { _dropdown.classList.remove("open"); _input.blur(); }
    });

    document.addEventListener("click", (e) => {
      if (!_input.contains(e.target) && !_dropdown.contains(e.target)) _dropdown.classList.remove("open");
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

  return { load, initHeader, attachHero, attach };
})();
