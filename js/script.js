/* ==========================================================
   NY – Main script (vanilla JS)
   1 Header scroll · 2 Mobile menu · 3 Search · 4 Portfolio filter
   5 Back-to-top · 6 Scroll reveal · 7 Footer year
   ========================================================== */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var header = $("#siteHeader");
  var navToggle = $("#navToggle");
  var navMenu = $("#navMenu");
  var searchToggle = $("#searchToggle");
  var searchBar = $("#searchBar");
  var searchInput = $("#searchInput");
  var grid = $("#portfolioGrid");

  /* 1. Header turns solid after scrolling ------------------ */
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
    var top = $("#backToTop");
    if (top) top.classList.toggle("is-visible", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 2. Mobile hamburger menu ------------------------------- */
  function setMenu(open) {
    if (!navToggle || !navMenu) return;
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (header) header.classList.toggle("menu-open", open);
  }
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });
    $$(".nav__link", navMenu).forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setMenu(false); setSearch(false); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  /* 3. Search ----------------------------------------------- */
  function setSearch(open) {
    if (!searchToggle || !searchBar) return;
    searchBar.hidden = !open;
    searchToggle.setAttribute("aria-expanded", String(open));
    if (open && searchInput) searchInput.focus();
  }
  if (searchToggle && searchBar) {
    searchToggle.addEventListener("click", function () {
      setSearch(searchBar.hidden);
    });
    searchBar.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = searchInput.value.trim();
      if (grid) {
        state.query = q.toLowerCase();
        applyFilter();
        var target = $("#portfolio");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "index.html?q=" + encodeURIComponent(q) + "#portfolio";
      }
    });
  }

  /* 4. Portfolio filter (category tabs + search text) ------- */
  var state = { category: "all", query: "" };

  function applyFilter() {
    if (!grid) return;
    var shown = 0;
    $$(".project-card", grid).forEach(function (card) {
      var cats = (card.getAttribute("data-category") || "").split(" ");
      var text = card.textContent.toLowerCase();
      var okCat = state.category === "all" || cats.indexOf(state.category) !== -1;
      var okText = !state.query || text.indexOf(state.query) !== -1;
      card.hidden = !(okCat && okText);
      if (!card.hidden) shown++;
    });
    var empty = $("#portfolioEmpty");
    if (empty) empty.hidden = shown !== 0;
  }

  $$(".filter-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      $$(".filter-tab").forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-pressed", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-pressed", "true");
      state.category = tab.getAttribute("data-filter");
      applyFilter();
    });
  });

  // Support links such as index.html?q=cafe#portfolio
  if (grid) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (q) {
      state.query = q.toLowerCase();
      if (searchInput) searchInput.value = q;
      applyFilter();
    }
  }

  /* 5. Back-to-top ------------------------------------------ */
  var topBtn = $("#backToTop");
  if (topBtn) {
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* 6. Reveal on scroll ------------------------------------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* 7. Footer year ------------------------------------------ */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
