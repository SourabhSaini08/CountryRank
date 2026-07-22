# CountryRank

> Compare all 195 countries across dozens of global ranking categories.

Live demo: **[yourdomain.com](https://yourdomain.com)**

---

## Features

- 🌍 All 195 UN-recognized countries
- 📊 15 ranking categories (GDP, population, happiness, passport, military, and more)
- 🔍 Live global search across countries and categories
- 🌙 Dark / light mode
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Pure HTML + CSS + JavaScript — no frameworks, no build step
- 🆓 Works on GitHub Pages for free

---

## Project Structure

```
CountryRank/
├── index.html              ← Home page
├── category.html           ← Reusable category ranking page (?id=gdp-nominal)
├── country.html            ← Reusable country profile page  (?id=india)
├── categories/
│   └── index.html          ← Browse all categories
├── countries/
│   └── index.html          ← Browse all 195 countries
├── css/
│   └── style.css
├── js/
│   ├── app.js              ← Shared utilities, header/footer injection
│   ├── theme.js            ← Dark/light mode
│   ├── search.js           ← Global live search
│   ├── category.js         ← Category ranking page logic
│   └── country.js          ← Country profile page logic
├── data/
│   ├── countries.json      ← 195 countries with facts
│   ├── categories.json     ← 15 ranking categories
│   └── rankings/
│       ├── gdp-nominal.json
│       ├── population.json
│       └── ...             ← One file per category
├── robots.txt
├── sitemap.xml
└── manifest.json
```

---

## Deploy to GitHub Pages

1. Fork or clone this repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your site is live at `https://yourusername.github.io/CountryRank/`

> **Note:** Update `BASE` URL logic in `js/app.js` and replace `yourdomain.com` in
> `robots.txt`, `sitemap.xml`, and HTML meta tags with your real domain.

---

## Adding Real Data

The ranking JSON files in `data/rankings/` currently contain **placeholder scores**.

To replace with real data:

1. Open `data/rankings/gdp-nominal.json`
2. Replace each `"score"` value with real figures from the IMF/World Bank
3. Re-sort by score and re-number the `"rank"` fields

Each file follows this schema:
```json
{
  "category": "gdp-nominal",
  "last_updated": "2025-01-01",
  "rankings": [
    { "rank": 1, "country": "united-states", "score": 27360000000000 },
    ...
  ]
}
```

Country IDs match the `"id"` field in `data/countries.json`.

---

## Adding More Categories

1. Add an entry to `data/categories.json`
2. Create `data/rankings/your-category-id.json`
3. Add an icon in the `icons` object inside `js/category.js` and `js/country.js`

---

## AdSense Integration

Ad placeholders are marked with `.ad-slot` CSS class throughout the pages.
Replace the placeholder `<div>` elements with your AdSense `<ins>` tags.

---

## Data Sources

| Category | Source |
|---|---|
| GDP | IMF World Economic Outlook |
| Population | UN Population Division |
| Life Expectancy | WHO |
| HDI | UN Development Programme |
| Passport Power | Henley Passport Index |
| Peace Index | Institute for Economics & Peace |
| Corruption | Transparency International |
| Happiness | World Happiness Report |
| Internet | ITU |
| Military | SIPRI |
| Literacy | UNESCO |
| Unemployment | ILO |
| CO2 Emissions | Our World in Data |
| Forest Area | FAO |

---

## License

MIT — free to use, modify, and deploy.
