/* =========================================================
   faq.js — FAQ & People Also Ask sections
   ========================================================= */
const FAQ = (() => {
  const PEOPLE_ALSO_ASK = [
    { q: "Which country is ranked #1 in the world?", a: "Switzerland and Norway frequently rank #1 overall due to consistently high scores in happiness, HDI, quality of life, and safety. The United States ranks #1 by nominal GDP." },
    { q: "Who are the top 10 countries in the world?", a: "For overall development (HDI): Switzerland, Norway, Iceland, Hong Kong, Australia, Denmark, Sweden, Ireland, Germany, and Netherlands. For economy (GDP): USA, China, Germany, Japan, India, UK, France, Italy, Brazil, Canada." },
    { q: "What are the Big 7 (G7) countries?", a: "The G7 consists of the seven largest advanced economies: United States, Canada, United Kingdom, France, Germany, Italy, and Japan." },
    { q: "What are the 7 world power countries?", a: "The 7 recognized world powers are the United States, China, Russia, United Kingdom, France, Germany, and Japan." },
    { q: "What are the 10 strongest countries in the world?", a: "By military strength: 1. USA 2. Russia 3. China 4. UK 5. South Korea 6. Pakistan 7. Japan 8. France 9. India 10. Italy." },
    { q: "Which is the No. 1 richest country in the world?", a: "Luxembourg ranks #1 by GDP per capita. The United States ranks #1 by total nominal GDP." },
    { q: "What is the rank of India in the world?", a: "India ranks 5th in the world by nominal GDP. India holds the world's largest army by active personnel and is the most populous country." },
    { q: "Is India No. 1 in army?", a: "India has the world's largest active-duty army by troop numbers, making it #1 for army size. The US, Russia, and China rank higher in overall military power." },
    { q: "Who has the 2nd largest army in the world?", a: "China has the second largest military force by active personnel. The USA has the second largest military by defense budget." },
    { q: "What is the safest country in the world?", a: "Iceland has ranked #1 on the Global Peace Index for over 15 consecutive years." },
    { q: "Which country has 1 billion people?", a: "China (~1.41 billion) and India (~1.43 billion). India surpassed China in 2023 to become the most populous nation." },
    { q: "What is the best passport in the world?", a: "Singapore, France, Germany, Italy, Spain, and Japan consistently hold the most powerful passports." }
  ];

  const CATEGORY_FAQS = {
    "gdp-nominal": [
      { q: "Which country has the highest GDP?", a: "The United States has the highest nominal GDP at approximately $27 trillion, about 25% of the global economy. China is second at ~$18 trillion." },
      { q: "What are the top 5 GDP countries?", a: "USA, China, Germany, Japan, India." },
      { q: "Which country has the lowest GDP?", a: "Nauru, Tuvalu, and Palau typically have the smallest GDPs due to tiny populations." },
      { q: "How is GDP calculated?", a: "GDP = C + I + G + (X - M): Consumer spending, Investment, Government spending, and Net Exports." }
    ],
    "gdp-per-capita": [
      { q: "Which country has the highest GDP per capita?", a: "Luxembourg consistently ranks #1 at over $130,000 USD per person." },
      { q: "What does GDP per capita tell us?", a: "It divides total output by population, indicating average purchasing power." },
      { q: "Which developing country has the fastest growing GDP per capita?", a: "India, Vietnam, Bangladesh, and Rwanda show strong recent growth." },
      { q: "Is GDP per capita the same as average salary?", a: "No, it measures total economic output per person, not average wages." }
    ],
    "population": [
      { q: "Which country has the largest population?", a: "India became the most populous country in 2023 with ~1.43 billion, surpassing China." },
      { q: "Which country has the smallest population?", a: "Vatican City has the smallest with fewer than 1,000 residents." },
      { q: "Which country is losing population the fastest?", a: "Bulgaria, Lithuania, Latvia, and Ukraine face the fastest declines." },
      { q: "How many countries have over 100 million people?", a: "14 countries, including China, India, USA, Indonesia, and Pakistan." }
    ],
    "life-expectancy": [
      { q: "Which country has the highest life expectancy?", a: "Japan, Switzerland, and Singapore rank highest, averaging above 84 years." },
      { q: "Which country has the lowest life expectancy?", a: "Chad, Central African Republic, and Lesotho tend to be lowest." },
      { q: "What factors affect life expectancy?", a: "Healthcare, diet, income, education, sanitation, and smoking rates." },
      { q: "Has global life expectancy increased?", a: "Yes, from ~47 years in 1950 to over 73 today." }
    ],
    "human-development-index": [
      { q: "Which country has the highest HDI?", a: "Switzerland ranked #1 in 2023-24, followed by Norway and Iceland." },
      { q: "What are the three components of HDI?", a: "Long/healthy life, knowledge (education), and standard of living." },
      { q: "What is India's HDI rank?", a: "India ranked around 134th with a value of 0.644, medium development." },
      { q: "What is a good HDI score?", a: "Above 0.800 is very high; 0.700-0.799 is high development." }
    ],
    "passport-index": [
      { q: "Which country has the strongest passport?", a: "Singapore, France, Germany, Italy, and Japan lead with 190+ destinations." },
      { q: "Which country has the weakest passport?", a: "Afghanistan holds the weakest, with fewer than 30 destinations." },
      { q: "How is passport power measured?", a: "By counting visa-free and visa-on-arrival destinations." },
      { q: "Does India have a powerful passport?", a: "India allows access to around 60 destinations, lower-middle tier." }
    ],
    "global-peace-index": [
      { q: "What is the most peaceful country?", a: "Iceland has ranked #1 for over 15 consecutive years." },
      { q: "What are the top 10 most peaceful countries?", a: "Iceland, Ireland, Austria, New Zealand, Singapore, Switzerland, Portugal, Slovenia, Japan, Canada." },
      { q: "Which country is the least peaceful?", a: "Yemen, Syria, South Sudan, and Afghanistan rank lowest." },
      { q: "How is the Global Peace Index calculated?", a: "23 indicators covering safety, conflict, and militarization." }
    ],
    "corruption-perceptions": [
      { q: "Which country is least corrupt?", a: "Denmark, Finland, and New Zealand score 90+ out of 100." },
      { q: "Which country is most corrupt?", a: "South Sudan, Syria, Somalia, and Venezuela score below 15." },
      { q: "What is India's corruption rank?", a: "India ranked around 93rd with a score of 39/100." },
      { q: "What is the Corruption Perceptions Index?", a: "An annual Transparency International ranking of 180 countries." }
    ],
    "happiness": [
      { q: "Which country is the happiest?", a: "Finland has ranked #1 for seven consecutive years." },
      { q: "What are the top 10 happiest countries?", a: "Finland, Denmark, Iceland, Sweden, Israel, Netherlands, Norway, Luxembourg, Switzerland, Australia." },
      { q: "Which is the least happy country?", a: "Afghanistan ranks lowest, followed by Lebanon and Sierra Leone." },
      { q: "How is happiness measured?", a: "The Cantril Ladder survey, rating life satisfaction 0-10." }
    ],
    "internet-users": [
      { q: "Which country has the highest internet penetration?", a: "UAE, Denmark, and South Korea rank above 99%." },
      { q: "Which country has the most internet users in total?", a: "China (~1.1 billion), India (~700 million), USA (~310 million)." },
      { q: "What percentage of the world uses the internet?", a: "About 67% of the global population, roughly 5.4 billion people." },
      { q: "Which country has the fastest internet?", a: "Singapore, South Korea, UAE, and Denmark lead in speed tests." }
    ],
    "military-expenditure": [
      { q: "Which country spends the most on military?", a: "The United States spends over $850 billion annually, more than the next 10 countries combined." },
      { q: "Which country has the strongest military?", a: "The United States, followed by Russia and China." },
      { q: "How much does India spend on its military?", a: "India spends approximately $75-80 billion annually, among the top 5." },
      { q: "What percentage of GDP should be spent on military?", a: "NATO requires at least 2% of GDP; the global average is about 2.2%." }
    ],
    "literacy-rate": [
      { q: "Which country has the highest literacy rate?", a: "Finland, Norway, and Iceland report near 100% literacy." },
      { q: "Which country has the lowest literacy rate?", a: "South Sudan, Niger, and Mali have rates below 30%." },
      { q: "What is India's literacy rate?", a: "Approximately 77.7%, with Kerala leading at ~96%." },
      { q: "How is literacy rate measured?", a: "The ability to read/write a short statement about daily life, ages 15+." }
    ],
    "unemployment-rate": [
      { q: "Which country has the lowest unemployment rate?", a: "Singapore, Japan, Switzerland, and Qatar maintain rates below 3%." },
      { q: "Which country has the highest unemployment rate?", a: "South Africa (~33%), Djibouti, and Libya face the highest rates." },
      { q: "What is a healthy unemployment rate?", a: "Economists consider 4-5% a 'natural' full-employment rate." },
      { q: "How does India's unemployment compare globally?", a: "India's rate is around 7-8%, with significant informal labor." }
    ],
    "co2-emissions": [
      { q: "Which country emits the most CO2?", a: "China emits over 11 billion tonnes yearly, followed by the USA and India." },
      { q: "Which country has the lowest CO2 emissions?", a: "Bhutan is carbon negative, absorbing more than it emits." },
      { q: "Which country emits the most CO2 per capita?", a: "Qatar, Kuwait, UAE, and Bahrain lead per-person emissions." },
      { q: "What is the Paris Agreement CO2 target?", a: "Limiting warming to 1.5°C, with net-zero emissions by 2050." }
    ],
    "forest-area": [
      { q: "Which country has the most forest?", a: "Russia has the largest total forest area, followed by Brazil and Canada." },
      { q: "Which country has the highest forest coverage percentage?", a: "Suriname has the highest at ~98%." },
      { q: "Which country is losing forests fastest?", a: "Brazil, Indonesia, and DR Congo face high deforestation rates." },
      { q: "Why is forest area important?", a: "Forests regulate climate, protect biodiversity, and prevent erosion." }
    ]
  };

  function buildCategoryFAQ(categoryId) {
    const catFaqs  = CATEGORY_FAQS[categoryId] || [];
    const combined = [...catFaqs, ...PEOPLE_ALSO_ASK];

    const schema = {
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": combined.map(item => ({
        "@type": "Question", "name": item.q,
        "acceptedAnswer": { "@type": "Answer", "text": item.a }
      }))
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(schema);
    document.head.appendChild(s);

    return `
      <section class="faq-section" aria-label="Frequently Asked Questions">
        <h2 class="section-title">Frequently Asked Questions</h2>
        ${catFaqs.length ? `
          <h3 class="faq-group-label">Category Questions</h3>
          <div class="faq-list">${catFaqs.map((item, i) => faqItemHTML(item, `cat-${i}`)).join("")}</div>
          <h3 class="faq-group-label">People Also Ask</h3>
        ` : "<h3 class='faq-group-label'>People Also Ask</h3>"}
        <div class="faq-list">${PEOPLE_ALSO_ASK.map((item, i) => faqItemHTML(item, `paa-${i}`)).join("")}</div>
      </section>`;
  }

  function buildHomeFAQ() { return buildCategoryFAQ("__home__"); }

  function faqItemHTML(item, id) {
    return `
      <div class="faq-item" id="faq-${id}">
        <button class="faq-question" aria-expanded="false" aria-controls="faq-ans-${id}">
          <span>${item.q}</span>
          <svg class="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="faq-answer" id="faq-ans-${id}" role="region" hidden><p>${item.a}</p></div>
      </div>`;
  }

  function initAccordions() {
    document.querySelectorAll(".faq-question").forEach(btn => {
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        const answer   = document.getElementById(btn.getAttribute("aria-controls"));
        document.querySelectorAll(".faq-question").forEach(b => {
          b.setAttribute("aria-expanded", "false");
          const a = document.getElementById(b.getAttribute("aria-controls"));
          if (a) a.hidden = true;
        });
        if (!expanded) { btn.setAttribute("aria-expanded", "true"); answer.hidden = false; }
      });
    });
  }

  return { buildCategoryFAQ, buildHomeFAQ, initAccordions, PEOPLE_ALSO_ASK };
})();
