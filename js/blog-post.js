/* =========================================================
   blog-post.js — Single blog post page (blog-post.html?slug=xxx)
   Renders: content, author box, share buttons, related posts,
   prev/next navigation, category dropdown, SEO schema
   ========================================================= */
(async function () {
  pageInit("blog");
  await Search.initHeader();

  const slug = getParam("slug");
  const main = document.getElementById("main");

  if (!slug) {
    main.innerHTML = `<div class="container"><div class="empty-state">
      <p style="font-size:2rem">📰</p>
      <p>No article selected. <a href="${BASE}/blog.html" style="color:var(--color-primary)">Browse all articles</a></p>
    </div></div>`;
    return;
  }

  let posts, categories;
  try {
    [posts, categories] = await Promise.all([BlogData.loadPosts(), BlogData.loadCategories()]);
  } catch (e) {
    main.innerHTML = `<div class="container"><div class="empty-state"><p>Failed to load article.</p></div></div>`;
    return;
  }

  const post = posts.find(p => p.slug === slug);
  if (!post) {
    main.innerHTML = `<div class="container"><div class="empty-state">
      <p>Article not found. <a href="${BASE}/blog.html">Back to Blog</a></p>
    </div></div>`;
    return;
  }

  const sorted = BlogData.sortByDateDesc(posts);
  const idx = sorted.findIndex(p => p.slug === slug);
  const prevPost = sorted[idx + 1] || null;   // older
  const nextPost = sorted[idx - 1] || null;   // newer

  const related = posts
    .filter(p => p.category === post.category && p.slug !== slug)
    .slice(0, 3);

  const catName = BlogData.categoryName(categories, post.category);
  const pageUrl = `https://mycountryrank.com/blog-post.html?slug=${post.slug}`;

  /* ---- SEO meta ---- */
  document.title = `${post.title} — CountryRank Blog`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", post.meta_description || post.excerpt);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", pageUrl);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", post.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", post.meta_description || post.excerpt);
  document.querySelector('meta[property="og:image"]')?.setAttribute("content", post.image);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", pageUrl);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", post.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", post.meta_description || post.excerpt);
  document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", post.image);

  /* ---- Category dropdown (jumps to that category's filtered blog list) ---- */
  function buildCategoryDropdown() {
    return `
      <div class="blog-cat-dropdown-wrap">
        <label for="blog-cat-dropdown" class="select-label">Browse by Category:</label>
        <select id="blog-cat-dropdown" class="full-select" style="max-width:320px">
          <option value="">All Articles</option>
          ${categories.map(c =>
            `<option value="${c.id}" ${c.id === post.category ? "selected" : ""}>${c.icon} ${c.name}</option>`
          ).join("")}
        </select>
      </div>`;
  }

  /* ---- Share buttons ---- */
  function buildShareButtons() {
    const encodedUrl   = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(post.title);
    return `
      <div class="share-buttons" aria-label="Share this article">
        <span class="share-label">Share:</span>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener" class="share-btn share-fb" aria-label="Share on Facebook">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
        </a>
        <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" rel="noopener" class="share-btn share-x" aria-label="Share on X">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.4 22H16.7l-5.2-6.8L5.6 22H2.4l8.1-9.3L1.3 2h6.9l4.7 6.2L18.9 2zm-1.2 18h1.7L7.4 4H5.6l12.1 16z"/></svg>
        </a>
        <a href="https://wa.me/?text=${encodedTitle}%20${encodedUrl}" target="_blank" rel="noopener" class="share-btn share-wa" aria-label="Share on WhatsApp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a7.9 7.9 0 01-4.24-1.23l-.3-.19-3.06.8.82-2.99-.2-.31A7.94 7.94 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.36-5.98c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener" class="share-btn share-li" aria-label="Share on LinkedIn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.34 18.34V9.75H5.67v8.59h2.67zM7 8.63a1.55 1.55 0 100-3.1 1.55 1.55 0 000 3.1zM18.34 18.34v-4.6c0-2.46-1.31-3.61-3.06-3.61-1.41 0-2.04.78-2.39 1.32v-1.13H10.2c.04.79 0 8.42 0 8.42h2.69v-4.7c0-.25.02-.5.1-.68.2-.5.68-1.02 1.47-1.02 1.04 0 1.45.79 1.45 1.95v4.45h2.68z"/></svg>
        </a>
        <button class="share-btn share-copy" id="copy-link-btn" aria-label="Copy link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        </button>
      </div>`;
  }

  /* ---- Author box ---- */
  function buildAuthorBox() {
    return `
      <div class="author-box">
        <img src="${post.author_avatar}" alt="${post.author}" class="author-avatar-lg" loading="lazy">
        <div>
          <div class="author-box-label">Written by</div>
          <div class="author-box-name">${post.author}</div>
          <p class="author-box-bio">${post.author_bio}</p>
        </div>
      </div>`;
  }

  /* ---- Related articles ---- */
  function buildRelated() {
    if (!related.length) return "";
    return `
      <section class="related-section">
        <h2 class="section-title">Related Articles</h2>
        <div class="blog-grid">${related.map(p => BlogData.cardHTML(p)).join("")}</div>
      </section>`;
  }

  /* ---- Prev / Next navigation ---- */
  function buildPrevNext() {
    if (!prevPost && !nextPost) return "";
    return `
      <div class="prev-next-nav">
        ${prevPost ? `
          <a href="${BASE}/blog-post.html?slug=${prevPost.slug}" class="prev-next-card prev-card">
            <span class="prev-next-label">← Previous Article</span>
            <span class="prev-next-title">${prevPost.title}</span>
          </a>` : `<div></div>`}
        ${nextPost ? `
          <a href="${BASE}/blog-post.html?slug=${nextPost.slug}" class="prev-next-card next-card">
            <span class="prev-next-label">Next Article →</span>
            <span class="prev-next-title">${nextPost.title}</span>
          </a>` : `<div></div>`}
      </div>`;
  }

  /* ---- Comment section (static demo — replace with Giscus/Disqus for real comments) ---- */
  function buildComments() {
    return `
      <section class="comments-section">
        <h2 class="section-title">Comments</h2>
        <div class="data-notice">
          💬 Comments are currently in demo mode and are not saved permanently.
          To enable real comments, connect a free service like
          <a href="https://giscus.app" target="_blank" rel="noopener">Giscus</a> (GitHub-based) or
          <a href="https://disqus.com" target="_blank" rel="noopener">Disqus</a> — both work on static sites with no backend needed.
        </div>
        <form class="comment-form" id="comment-form">
          <div class="form-group">
            <label for="comment-name">Name</label>
            <input type="text" id="comment-name" placeholder="Your name" required>
          </div>
          <div class="form-group">
            <label for="comment-text">Comment</label>
            <textarea id="comment-text" placeholder="Share your thoughts…" required></textarea>
          </div>
          <button type="submit" class="btn">Post Comment</button>
        </form>
        <div id="comment-list" class="comment-list"></div>
      </section>`;
  }

  /* ---- Render full page ---- */
  main.innerHTML = `
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${BASE}/">Home</a><span aria-hidden="true"> › </span>
        <a href="${BASE}/blog.html">World Blog</a><span aria-hidden="true"> › </span>
        <a href="${BASE}/blog.html?category=${post.category}">${catName}</a><span aria-hidden="true"> › </span>
        <span aria-current="page">${post.title}</span>
      </nav>

      ${buildCategoryDropdown()}

      <article class="blog-post">
        <span class="blog-badge blog-badge--${post.category}" style="margin-bottom:14px;display:inline-block">${post.badge_label || catName}</span>
        <h1 class="blog-post-title">${post.title}</h1>

        <div class="blog-post-meta">
          <img src="${post.author_avatar}" alt="${post.author}" class="blog-avatar-sm">
          <span class="blog-author-name">${post.author}</span>
          <span class="blog-meta-dot" aria-hidden="true">•</span>
          <span>Published: ${BlogData.formatDate(post.date_published)}</span>
          ${post.date_updated && post.date_updated !== post.date_published
            ? `<span class="blog-meta-dot" aria-hidden="true">•</span><span>Updated: ${BlogData.formatDate(post.date_updated)}</span>`
            : ""}
          <span class="blog-meta-dot" aria-hidden="true">•</span>
          <span>⏱ ${post.read_time}</span>
        </div>

        ${buildShareButtons()}

        <img src="${post.image}" alt="${post.title}" class="blog-post-hero-image" loading="eager">

        <div class="blog-post-content">${post.content}</div>

        ${buildShareButtons()}
        ${buildAuthorBox()}
      </article>

      ${buildPrevNext()}
      ${buildRelated()}
      ${buildComments()}
    </div>`;

  /* ---- Category dropdown navigation ---- */
  document.getElementById("blog-cat-dropdown").addEventListener("change", e => {
    location.href = e.target.value
      ? `${BASE}/blog.html?category=${e.target.value}`
      : `${BASE}/blog.html`;
  });

  /* ---- Copy link button ---- */
  document.getElementById("copy-link-btn")?.addEventListener("click", async (e) => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      const btn = e.currentTarget;
      const original = btn.innerHTML;
      btn.innerHTML = "✓";
      setTimeout(() => { btn.innerHTML = original; }, 1500);
    } catch (err) { /* clipboard not available, silently ignore */ }
  });

  /* ---- Demo comment form (local session only, not persisted) ---- */
  const commentForm = document.getElementById("comment-form");
  const commentList = document.getElementById("comment-list");
  const localComments = [];
  commentForm?.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("comment-name").value.trim();
    const text = document.getElementById("comment-text").value.trim();
    if (!name || !text) return;
    localComments.unshift({ name, text, time: new Date().toLocaleString() });
    renderComments();
    commentForm.reset();
  });
  function renderComments() {
    commentList.innerHTML = localComments.map(c => `
      <div class="comment-item">
        <div class="comment-item-header">
          <strong>${c.name}</strong>
          <span class="comment-time">${c.time}</span>
        </div>
        <p>${c.text}</p>
      </div>`).join("");
  }

  /* ---- Schema.org: Article + Breadcrumb ---- */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.meta_description || post.excerpt,
    "image": post.image,
    "author": { "@type": "Organization", "name": post.author },
    "publisher": {
      "@type": "Organization",
      "name": "CountryRank",
      "logo": { "@type": "ImageObject", "url": "https://mycountryrank.com/images/icon-192.png" }
    },
    "datePublished": post.date_published,
    "dateModified": post.date_updated || post.date_published,
    "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl }
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mycountryrank.com/" },
      { "@type": "ListItem", "position": 2, "name": "World Blog", "item": "https://mycountryrank.com/blog.html" },
      { "@type": "ListItem", "position": 3, "name": catName, "item": `https://mycountryrank.com/blog.html?category=${post.category}` },
      { "@type": "ListItem", "position": 4, "name": post.title, "item": pageUrl }
    ]
  };
  [articleSchema, breadcrumbSchema].forEach(schema => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(schema);
    document.head.appendChild(s);
  });
})();
