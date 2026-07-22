/* =========================================================
   theme.js — Dark / Light mode
   Persists preference in localStorage
   ========================================================= */
const Theme = (() => {
  const KEY = "cr-theme";
  const ROOT = document.documentElement;

  function get() {
    return localStorage.getItem(KEY) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function apply(t) {
    ROOT.setAttribute("data-theme", t);
    localStorage.setItem(KEY, t);
    document.querySelectorAll(".theme-toggle").forEach(btn => {
      btn.textContent = t === "dark" ? "☀️" : "🌙";
      btn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }
  function toggle() { apply(get() === "dark" ? "light" : "dark"); }
  function init() {
    apply(get());
    document.querySelectorAll(".theme-toggle").forEach(btn => {
      btn.addEventListener("click", toggle);
    });
  }
  return { init, toggle, get };
})();
