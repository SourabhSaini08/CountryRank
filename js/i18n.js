/* =========================================================
   i18n.js — Multi-language support
   Language stored in localStorage + ?lang= URL param
   ========================================================= */
const I18n = (() => {
  const SUPPORTED = ["en","hi","es","fr","de","ar","zh","pt"];
  const DEFAULT   = "en";
  const KEY       = "cr-lang";

  const T = {
    en: { lang_name:"English", flag:"🇬🇧", dir:"ltr", nav_home:"Home", nav_categories:"Categories", nav_countries:"Countries",
      search_placeholder:"Search countries or categories…", rank:"Rank", country:"Country", score:"Score", profile:"Profile",
      loading:"Loading…", source:"Source", last_updated:"Last updated", higher_better:"Higher is better ↑", lower_better:"Lower is better ↓",
      capital:"Capital", population:"Population", area:"Area", currency:"Currency", languages:"Languages", iso_code:"ISO Code",
      government:"Government", continent:"Continent", rankings:"Rankings", faq_title:"Frequently Asked Questions",
      footer_home:"CountryRank", footer_data:"Data Sources", footer_more:"More Sources", footer_legal:"Legal",
      footer_privacy:"Privacy Policy", footer_disclaimer:"Disclaimer", footer_terms:"Terms & Conditions", footer_contact:"Contact Us",
      footer_copy:"Data for reference only.", data_note:"Note: Scores are placeholder data. Replace with verified figures from the source.",
      switch_country:"Switch Country:", switch_category:"Switch Category:", no_results:"No results found.", coming_soon:"Coming soon",
      view_profile:"Profile →", view_ranking:"View full ranking →", filter_countries:"Filter countries in this ranking…",
    },
    hi: { lang_name:"हिन्दी", flag:"🇮🇳", dir:"ltr", nav_home:"होम", nav_categories:"श्रेणियाँ", nav_countries:"देश",
      search_placeholder:"देश या श्रेणी खोजें…", rank:"रैंक", country:"देश", score:"स्कोर", profile:"प्रोफाइल",
      loading:"लोड हो रहा है…", source:"स्रोत", last_updated:"अंतिम अपडेट", higher_better:"अधिक बेहतर ↑", lower_better:"कम बेहतर ↓",
      capital:"राजधानी", population:"जनसंख्या", area:"क्षेत्रफल", currency:"मुद्रा", languages:"भाषाएँ", iso_code:"ISO कोड",
      government:"सरकार", continent:"महाद्वीप", rankings:"रैंकिंग", faq_title:"अक्सर पूछे जाने वाले प्रश्न",
      footer_home:"CountryRank", footer_data:"डेटा स्रोत", footer_more:"अधिक स्रोत", footer_legal:"कानूनी",
      footer_privacy:"गोपनीयता नीति", footer_disclaimer:"अस्वीकरण", footer_terms:"नियम और शर्तें", footer_contact:"संपर्क करें",
      footer_copy:"डेटा केवल संदर्भ के लिए।", data_note:"नोट: स्कोर उदाहरण डेटा है। सत्यापित आंकड़ों से बदलें।",
      switch_country:"देश बदलें:", switch_category:"श्रेणी बदलें:", no_results:"कोई परिणाम नहीं।", coming_soon:"जल्द आ रहा है",
      view_profile:"प्रोफाइल →", view_ranking:"पूरी रैंकिंग →", filter_countries:"देश खोजें…",
    },
    es: { lang_name:"Español", flag:"🇪🇸", dir:"ltr", nav_home:"Inicio", nav_categories:"Categorías", nav_countries:"Países",
      search_placeholder:"Buscar países o categorías…", rank:"Rango", country:"País", score:"Puntuación", profile:"Perfil",
      loading:"Cargando…", source:"Fuente", last_updated:"Última actualización", higher_better:"Mayor es mejor ↑", lower_better:"Menor es mejor ↓",
      capital:"Capital", population:"Población", area:"Área", currency:"Moneda", languages:"Idiomas", iso_code:"Código ISO",
      government:"Gobierno", continent:"Continente", rankings:"Rankings", faq_title:"Preguntas Frecuentes",
      footer_home:"CountryRank", footer_data:"Fuentes de Datos", footer_more:"Más Fuentes", footer_legal:"Legal",
      footer_privacy:"Política de Privacidad", footer_disclaimer:"Aviso Legal", footer_terms:"Términos", footer_contact:"Contacto",
      footer_copy:"Datos solo de referencia.", data_note:"Nota: Las puntuaciones son ilustrativas.",
      switch_country:"Cambiar país:", switch_category:"Cambiar categoría:", no_results:"Sin resultados.", coming_soon:"Próximamente",
      view_profile:"Perfil →", view_ranking:"Ver ranking →", filter_countries:"Buscar países…",
    },
    fr: { lang_name:"Français", flag:"🇫🇷", dir:"ltr", nav_home:"Accueil", nav_categories:"Catégories", nav_countries:"Pays",
      search_placeholder:"Rechercher pays ou catégories…", rank:"Rang", country:"Pays", score:"Score", profile:"Profil",
      loading:"Chargement…", source:"Source", last_updated:"Dernière mise à jour", higher_better:"Plus élevé est mieux ↑", lower_better:"Plus bas est mieux ↓",
      capital:"Capitale", population:"Population", area:"Superficie", currency:"Monnaie", languages:"Langues", iso_code:"Code ISO",
      government:"Gouvernement", continent:"Continent", rankings:"Classements", faq_title:"Questions Fréquentes",
      footer_home:"CountryRank", footer_data:"Sources de Données", footer_more:"Plus de Sources", footer_legal:"Légal",
      footer_privacy:"Politique de Confidentialité", footer_disclaimer:"Avertissement", footer_terms:"Conditions", footer_contact:"Contact",
      footer_copy:"Données à titre indicatif.", data_note:"Note: Les scores sont illustratifs.",
      switch_country:"Changer de pays:", switch_category:"Changer de catégorie:", no_results:"Aucun résultat.", coming_soon:"Bientôt disponible",
      view_profile:"Profil →", view_ranking:"Voir classement →", filter_countries:"Rechercher des pays…",
    },
    de: { lang_name:"Deutsch", flag:"🇩🇪", dir:"ltr", nav_home:"Startseite", nav_categories:"Kategorien", nav_countries:"Länder",
      search_placeholder:"Länder oder Kategorien suchen…", rank:"Rang", country:"Land", score:"Wert", profile:"Profil",
      loading:"Wird geladen…", source:"Quelle", last_updated:"Zuletzt aktualisiert", higher_better:"Höher ist besser ↑", lower_better:"Niedriger ist besser ↓",
      capital:"Hauptstadt", population:"Bevölkerung", area:"Fläche", currency:"Währung", languages:"Sprachen", iso_code:"ISO-Code",
      government:"Regierung", continent:"Kontinent", rankings:"Rankings", faq_title:"Häufig gestellte Fragen",
      footer_home:"CountryRank", footer_data:"Datenquellen", footer_more:"Weitere Quellen", footer_legal:"Rechtliches",
      footer_privacy:"Datenschutz", footer_disclaimer:"Haftungsausschluss", footer_terms:"Nutzungsbedingungen", footer_contact:"Kontakt",
      footer_copy:"Daten nur zur Information.", data_note:"Hinweis: Werte sind Platzhalter.",
      switch_country:"Land wechseln:", switch_category:"Kategorie wechseln:", no_results:"Keine Ergebnisse.", coming_soon:"Demnächst",
      view_profile:"Profil →", view_ranking:"Ranking anzeigen →", filter_countries:"Länder suchen…",
    },
    ar: { lang_name:"العربية", flag:"🇸🇦", dir:"rtl", nav_home:"الرئيسية", nav_categories:"الفئات", nav_countries:"الدول",
      search_placeholder:"ابحث عن دولة أو فئة…", rank:"الترتيب", country:"الدولة", score:"النتيجة", profile:"الملف",
      loading:"جارٍ التحميل…", source:"المصدر", last_updated:"آخر تحديث", higher_better:"الأعلى أفضل ↑", lower_better:"الأدنى أفضل ↓",
      capital:"العاصمة", population:"السكان", area:"المساحة", currency:"العملة", languages:"اللغات", iso_code:"رمز ISO",
      government:"الحكومة", continent:"القارة", rankings:"التصنيفات", faq_title:"الأسئلة الشائعة",
      footer_home:"CountryRank", footer_data:"مصادر البيانات", footer_more:"مصادر إضافية", footer_legal:"قانوني",
      footer_privacy:"سياسة الخصوصية", footer_disclaimer:"إخلاء مسؤولية", footer_terms:"الشروط", footer_contact:"اتصل بنا",
      footer_copy:"البيانات للإشارة فقط.", data_note:"ملاحظة: الدرجات توضيحية.",
      switch_country:"تغيير الدولة:", switch_category:"تغيير الفئة:", no_results:"لا توجد نتائج.", coming_soon:"قريباً",
      view_profile:"الملف →", view_ranking:"عرض الترتيب →", filter_countries:"البحث عن دول…",
    },
    zh: { lang_name:"中文", flag:"🇨🇳", dir:"ltr", nav_home:"首页", nav_categories:"分类", nav_countries:"国家",
      search_placeholder:"搜索国家或分类…", rank:"排名", country:"国家", score:"得分", profile:"简介",
      loading:"加载中…", source:"来源", last_updated:"最后更新", higher_better:"越高越好 ↑", lower_better:"越低越好 ↓",
      capital:"首都", population:"人口", area:"面积", currency:"货币", languages:"语言", iso_code:"ISO代码",
      government:"政府", continent:"大洲", rankings:"排名", faq_title:"常见问题",
      footer_home:"CountryRank", footer_data:"数据来源", footer_more:"更多来源", footer_legal:"法律",
      footer_privacy:"隐私政策", footer_disclaimer:"免责声明", footer_terms:"条款", footer_contact:"联系我们",
      footer_copy:"数据仅供参考。", data_note:"注：分数为示例数据。",
      switch_country:"切换国家：", switch_category:"切换分类：", no_results:"未找到结果。", coming_soon:"即将推出",
      view_profile:"简介 →", view_ranking:"查看排名 →", filter_countries:"搜索国家…",
    },
    pt: { lang_name:"Português", flag:"🇧🇷", dir:"ltr", nav_home:"Início", nav_categories:"Categorias", nav_countries:"Países",
      search_placeholder:"Buscar países ou categorias…", rank:"Rank", country:"País", score:"Pontuação", profile:"Perfil",
      loading:"Carregando…", source:"Fonte", last_updated:"Última atualização", higher_better:"Maior é melhor ↑", lower_better:"Menor é melhor ↓",
      capital:"Capital", population:"População", area:"Área", currency:"Moeda", languages:"Idiomas", iso_code:"Código ISO",
      government:"Governo", continent:"Continente", rankings:"Rankings", faq_title:"Perguntas Frequentes",
      footer_home:"CountryRank", footer_data:"Fontes de Dados", footer_more:"Mais Fontes", footer_legal:"Legal",
      footer_privacy:"Política de Privacidade", footer_disclaimer:"Aviso Legal", footer_terms:"Termos", footer_contact:"Contato",
      footer_copy:"Dados apenas para referência.", data_note:"Nota: Pontuações são ilustrativas.",
      switch_country:"Trocar país:", switch_category:"Trocar categoria:", no_results:"Sem resultados.", coming_soon:"Em breve",
      view_profile:"Perfil →", view_ranking:"Ver ranking →", filter_countries:"Buscar países…",
    }
  };

  function getLang() {
    const param = new URLSearchParams(location.search).get("lang");
    if (param && SUPPORTED.includes(param)) { localStorage.setItem(KEY, param); return param; }
    const stored = localStorage.getItem(KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const browser = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(browser)) return browser;
    return DEFAULT;
  }

  function t(key) {
    const lang = getLang();
    return (T[lang] && T[lang][key]) || (T[DEFAULT] && T[DEFAULT][key]) || key;
  }

  function setLang(code) {
    if (!SUPPORTED.includes(code)) return;
    localStorage.setItem(KEY, code);
    const url = new URL(location.href);
    url.searchParams.set("lang", code);
    location.href = url.toString();
  }

  function applyDir() {
    const lang = getLang();
    const dict = T[lang] || T[DEFAULT];
    document.documentElement.lang = lang;
    document.documentElement.dir  = dict.dir || "ltr";
  }

  function injectHreflang() {
    const url = new URL(location.href);
    SUPPORTED.forEach(code => {
      url.searchParams.set("lang", code);
      const link = document.createElement("link");
      link.rel = "alternate"; link.hreflang = code; link.href = url.toString();
      document.head.appendChild(link);
    });
    url.searchParams.delete("lang");
    const def = document.createElement("link");
    def.rel = "alternate"; def.hreflang = "x-default"; def.href = url.toString();
    document.head.appendChild(def);
  }

  function renderSwitcher() {
    const current = getLang();
    const dict    = T[current] || T[DEFAULT];
    return `
      <div class="lang-switcher" id="lang-switcher">
        <button class="lang-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Language: ${dict.lang_name}">
          <span>${dict.flag}</span>
          <span class="lang-code">${current.toUpperCase()}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <ul class="lang-dropdown" role="listbox" aria-label="Select language">
          ${SUPPORTED.map(code => {
            const d = T[code];
            return `<li role="option" data-lang="${code}" ${code === current ? 'aria-selected="true"' : ''}>${d.flag}&nbsp; ${d.lang_name}</li>`;
          }).join("")}
        </ul>
      </div>`;
  }

  function initSwitcher() {
    const switcher = document.getElementById("lang-switcher");
    if (!switcher) return;
    const btn = switcher.querySelector(".lang-btn");
    const dropdown = switcher.querySelector(".lang-dropdown");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
    dropdown.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", () => setLang(li.dataset.lang));
    });
    document.addEventListener("click", () => {
      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  }

  function init() {
    applyDir();
    injectHreflang();
    setTimeout(initSwitcher, 50);
  }

  return { t, getLang, setLang, renderSwitcher, init, SUPPORTED, T };
})();
