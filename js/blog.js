/* =========================================================
   blog.js — Blog listing page (blog.html)
   Handles: category pills, search, sort, pagination
   ========================================================= */
(async function () {
  pageInit("blog");
  await Search.initHeader();

  const POSTS_PER_PAGE = 9;
  let allPosts = [];
  let categories = [];
  let currentCategory = "";
  let currentQuery = "";
  let currentSort = "newest";
  let currentPage = 1;

  try {
    [allPosts, categories] = await Promise.all([BlogData.loadPosts(), BlogData.loadCategories()]);
  } catch (e) {
    document.getElementById("blog-grid").innerHTML =
      `<div class="empty-state" style="grid-column:1/-1">Failed to load articles.</div>`;
    return;
  }

  /* Pre-select category from URL, e.g. blog.html?category=economy */
  const urlCategory = getParam("category");
  if (urlCategory && categories.some(c => c.id === urlCategory)) {
    currentCategory = urlCategory;
  }

  /* Build category pills */
  function buildPills() {
    const wrap = document.getElementById("blog-category-pills");
    const pills = [{ id: "", name: "All Articles" }, ...categories];
    wrap.innerHTML = pills.map(c => `
      <button class="blog-pill ${c.id === currentCategory ? "active" : ""}" data-cat="${c.id}">
        ${c.icon ? c.icon + " " : ""}${c.name}
      </button>`).join("");

    wrap.querySelectorAll(".blog-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        currentCategory = btn.dataset.cat;
        currentPage = 1;
        buildPills();
        render();
      });
    });
  }

  /* Filter + sort */
  function getFiltered() {
    let posts = allPosts;
    if (currentCategory) posts = posts.filter(p => p.category === currentCategory);
    if (currentQuery) {
      const q = currentQuery.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    posts = BlogData.sortByDateDesc(posts);
    if (currentSort === "oldest") posts = [...posts].reverse();
    if (currentSort === "az") posts = [...posts].sort((a, b) => a.title.localeCompare(b.title));
    return posts;
  }

  /* Render grid + pagination */
  function render() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const pageItems = filtered.slice(start, start + POSTS_PER_PAGE);

    const grid = document.getElementById("blog-grid");
    grid.innerHTML = pageItems.length
      ? pageItems.map(p => BlogData.cardHTML(p)).join("")
      : `<div class="empty-state" style="grid-column:1/-1">No articles found. Try a different search or category.</div>`;

    document.getElementById("blog-result-count").textContent =
      `${filtered.length} article${filtered.length === 1 ? "" : "s"}`;

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    const wrap = document.getElementById("blog-pagination");
    if (totalPages <= 1) { wrap.innerHTML = ""; return; }

    let html = "";
    html += `<button class="page-btn" data-page="prev" ${currentPage === 1 ? "disabled" : ""}>← Prev</button>`;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) pages.push(i);
      else if (pages[pages.length - 1] !== "...") pages.push("...");
    }
    pages.forEach(p => {
      if (p === "...") html += `<span class="page-dots">…</span>`;
      else html += `<button class="page-btn ${p === currentPage ? "active" : ""}" data-page="${p}">${p}</button>`;
    });

    html += `<button class="page-btn" data-page="next" ${currentPage === totalPages ? "disabled" : ""}>Next →</button>`;
    wrap.innerHTML = html;

    wrap.querySelectorAll(".page-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const val = btn.dataset.page;
        if (val === "prev") currentPage--;
        else if (val === "next") currentPage++;
        else currentPage = parseInt(val, 10);
        render();
        document.getElementById("blog-grid").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  buildPills();
  render();

  /* Search box */
  document.getElementById("blog-search-input").addEventListener("input", e => {
    currentQuery = e.target.value;
    currentPage = 1;
    render();
  });

  /* Sort dropdown */
  document.getElementById("blog-sort").addEventListener("change", e => {
    currentSort = e.target.value;
    currentPage = 1;
    render();
  });
})();
