/* =========================================================
   blog-data.js — Shared blog utilities
   Used by blog.html (listing) and blog-post.html (single post)
   Add new posts by editing ONLY data/blog-posts.json
   ========================================================= */

const BlogData = (() => {

  async function loadPosts() {
    return fetchJSON(dataUrl("blog-posts.json"));
  }

  async function loadCategories() {
    return fetchJSON(dataUrl("blog-categories.json"));
  }

  /* Sort newest first by published date */
  function sortByDateDesc(posts) {
    return [...posts].sort((a, b) => new Date(b.date_published) - new Date(a.date_published));
  }

  /* Format ISO date "2026-05-15" -> "May 15, 2026" */
  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  /* Get category display name from id */
  function categoryName(categories, id) {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : id;
  }

  /* Build a blog card (used in listing grid, homepage latest, related articles) */
  function cardHTML(post) {
    const badge = post.badge_label || post.category;
    return `
      <a href="${BASE}/blog-post.html?slug=${post.slug}" class="blog-card" aria-label="${post.title}">
        <div class="blog-card-image-wrap">
          <img src="${post.image}" alt="${post.title}" loading="lazy" class="blog-card-image">
          <span class="blog-badge blog-badge--${post.category}">${badge}</span>
          <span class="blog-date-overlay">${formatDate(post.date_published)}</span>
        </div>
        <div class="blog-card-body">
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <div class="blog-card-meta">
            <img src="${post.author_avatar}" alt="${post.author}" class="blog-avatar-sm" loading="lazy">
            <span class="blog-author-name">${post.author}</span>
            <span class="blog-meta-dot" aria-hidden="true">•</span>
            <span class="blog-read-time">⏱ ${post.read_time}</span>
          </div>
        </div>
      </a>`;
  }

  return { loadPosts, loadCategories, sortByDateDesc, formatDate, categoryName, cardHTML };
})();
