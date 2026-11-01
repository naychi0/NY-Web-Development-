/* ==========================================================
   Shwe Myanmar – script.js (vanilla JS, no dependencies)
   1 Helpers · 2 Header & navigation · 3 Story dialog · 4 Products list
   5 Product details · 6 News filter + pagination · 7 Activities filter
   8 Contact form · 9 Page extras
   ========================================================== */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var body = document.body, page = body.getAttribute("data-page"), group = body.getAttribute("data-group");

  /* 1. HELPERS ---------------------------------------------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function openDialog(d) { if (d.showModal) d.showModal(); else d.setAttribute("open", ""); }
  function closeDialog(d) { if (d.close) d.close(); else d.removeAttribute("open"); }
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function f(c) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt))); }
    return "#" + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }
  function setChips(box, value, attr) {
    $$(".chip", box).forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset[attr] === value)); });
  }

  /* 2. HEADER & NAVIGATION ---------------------------------- */
  var header = $("#siteHeader"), nav = $("#nav"), navBtn = $("#navBtn");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    var top = $("#toTop"); if (top) top.classList.toggle("is-visible", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  function closeGroups(except) {
    $$(".nav__item.is-open").forEach(function (li) {
      if (li === except) return;
      li.classList.remove("is-open");
      var t = $(".nav__toggle", li); if (t) t.setAttribute("aria-expanded", "false");
    });
  }
  function setNav(open) {
    nav.classList.toggle("is-open", open);
    navBtn.setAttribute("aria-expanded", String(open));
    navBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    body.classList.toggle("nav-lock", open);
    if (!open) closeGroups();
  }
  navBtn.addEventListener("click", function () { setNav(navBtn.getAttribute("aria-expanded") !== "true"); });
  $$(".nav__toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.parentNode, open = !li.classList.contains("is-open");
      closeGroups(li); li.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".nav__item")) closeGroups(); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeGroups();
    if (navBtn.getAttribute("aria-expanded") === "true") { setNav(false); navBtn.focus(); }
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 1080 && nav.classList.contains("is-open")) setNav(false); });
  $$("[data-nav]").forEach(function (a) { if (a.getAttribute("data-nav") === page) a.setAttribute("aria-current", "page"); });
  $$("[data-group]", nav).forEach(function (t) { if (t.getAttribute("data-group") === group) t.classList.add("is-active"); });

  /* 3. STORY DIALOG ------------------------------------------ */
  var storyDialog = $("#storyDialog");
  if (storyDialog) {
    var SLIDES = [
      { t: "Rooted in Myanmar kitchens", p: "Every Shwe Myanmar product starts with the dishes families cook and share every day." },
      { t: "Quality in every pack", p: "Careful sourcing and simple, honest recipes – so good food is easy to make at home." },
      { t: "Looking to a better tomorrow", p: "We are growing with our communities, one meal and one idea at a time." }
    ];
    var idx = 0, timer = null, reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var show = function (i) {
      idx = (i + SLIDES.length) % SLIDES.length;
      $("#storySlide").innerHTML = '<img src="assets/icons/logo.svg" alt=""><h3 id="storyTitle">' + SLIDES[idx].t + '</h3><p>' + SLIDES[idx].p + '</p>';
      $("#storyBars").innerHTML = SLIDES.map(function (_, k) { return '<span class="' + (k < idx ? "done" : k === idx ? "run" : "") + '"><i></i></span>'; }).join("");
      clearTimeout(timer);
      if (!reduce) timer = setTimeout(function () { idx < SLIDES.length - 1 ? show(idx + 1) : closeDialog(storyDialog); }, 5000);
      else $(".run i", $("#storyBars")).style.width = "100%";
    };
    $("#storyBtn").addEventListener("click", function () { openDialog(storyDialog); show(0); });
    $("#storyNext").addEventListener("click", function () { idx < SLIDES.length - 1 ? show(idx + 1) : closeDialog(storyDialog); });
    $("#storyPrev").addEventListener("click", function () { show(idx - 1); });
    $("#storyClose").addEventListener("click", function () { closeDialog(storyDialog); });
    storyDialog.addEventListener("click", function (e) { if (e.target === storyDialog) closeDialog(storyDialog); });
    storyDialog.addEventListener("close", function () { clearTimeout(timer); });
  }

  /* 4/5. PRODUCT DATA + PACK DRAWINGS ------------------------ */
  var CATS = [["all", "All"], ["seasoning", "Seasonings"], ["sauces", "Sauces"], ["staples", "Rice, Noodles & Oil"], ["ready", "Ready Meals"]];
  var CATNAME = { seasoning: "Seasonings", sauces: "Sauces", staples: "Rice, Noodles & Oil", ready: "Ready Meals" };
  var PACKTYPE = { pouch: "Flexible pouch", jar: "Jar with cap", bottle: "Bottle with cap", box: "Carton box" };
  var PRODUCTS = [
    { id: "p1", name: "Golden Seasoning Powder", cat: "seasoning", shape: "pouch", color: "#B5121B", label: ["Golden", "Seasoning"], sizes: ["50 g", "200 g", "1 kg"], desc: "An all-purpose savoury seasoning that lifts soups, stir-fries and marinades." },
    { id: "p2", name: "Chicken Broth Powder", cat: "seasoning", shape: "jar", color: "#E0A526", label: ["Chicken", "Broth"], sizes: ["100 g", "450 g"], desc: "Rich, rounded broth flavour in seconds – stir into soups, noodles and rice." },
    { id: "p3", name: "Pure Cooking Oil", cat: "staples", shape: "bottle", color: "#E0A526", label: ["Pure", "Oil"], sizes: ["1 L", "2 L", "5 L"], desc: "Light, neutral oil for frying, sautéing and everyday home cooking." },
    { id: "p4", name: "Classic Fish Sauce", cat: "sauces", shape: "bottle", color: "#8C4A18", label: ["Fish", "Sauce"], sizes: ["200 ml", "500 ml"], desc: "Deep umami character for dipping sauces, salads and curries." },
    { id: "p5", name: "Sweet Chili Sauce", cat: "sauces", shape: "bottle", color: "#C32832", label: ["Sweet", "Chili"], sizes: ["250 ml", "700 ml"], desc: "Sweet heat for dipping, glazing and noodle bowls." },
    { id: "p6", name: "Quick Noodles", cat: "staples", shape: "pouch", color: "#D8641A", label: ["Quick", "Noodles"], sizes: ["Single pack", "Pack of 5", "Carton of 30"], desc: "Springy noodles with a savoury soup base, ready in three minutes." },
    { id: "p7", name: "Fragrant White Rice", cat: "staples", shape: "pouch", color: "#2F7D55", label: ["Fragrant", "Rice"], sizes: ["1 kg", "5 kg", "25 kg"], desc: "Soft, fragrant grains – a dependable base for every meal." },
    { id: "p8", name: "Ready Curry Sauce", cat: "ready", shape: "box", color: "#9A4012", label: ["Ready", "Curry"], sizes: ["Single box", "Pack of 3"], desc: "Heat and serve – a slow-simmered curry base for busy evenings." }
  ];
  var uid = 0;
  /* Studio-style pack drawing. A real photo at assets/images/products/<id>.webp replaces it automatically. */
  function pack(p) {
    var id = "pk" + (++uid), c = p.color, dk = shade(c, -.32), lt = shade(c, .34), y = p.shape === "bottle" ? 112 : 100;
    var defs = '<defs>' +
      '<linearGradient id="' + id + 'b" x1="0" x2="1"><stop offset="0" stop-color="' + dk + '"/><stop offset=".26" stop-color="' + lt + '"/><stop offset=".55" stop-color="' + c + '"/><stop offset="1" stop-color="' + dk + '"/></linearGradient>' +
      '<linearGradient id="' + id + 'c" x1="0" x2="1"><stop offset="0" stop-color="#20242c"/><stop offset=".3" stop-color="#6b7283"/><stop offset=".62" stop-color="#2a2e37"/><stop offset="1" stop-color="#14161b"/></linearGradient>' +
      '<linearGradient id="' + id + 's" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="' + id + 'o" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#252525" stop-opacity=".32"/><stop offset="1" stop-color="#252525" stop-opacity="0"/></radialGradient>' +
      '<filter id="' + id + 'f" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#000" flood-opacity=".22"/></filter></defs>';
    var B = "url(#" + id + "b)", C = "url(#" + id + "c)", S = "url(#" + id + "s)";
    var lbl = '<g filter="url(#' + id + 'f)"><rect x="52" y="' + y + '" width="96" height="84" rx="8" fill="#fff"/></g>' +
      '<rect x="52" y="' + y + '" width="96" height="9" rx="4" fill="' + c + '"/>' +
      '<image href="assets/icons/logo.svg" x="84" y="' + (y + 15) + '" width="32" height="32"/>' +
      '<text x="100" y="' + (y + 62) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#252525" font-family="Inter,sans-serif" letter-spacing=".2">' + esc(p.label[0]) + '</text>' +
      '<text x="100" y="' + (y + 77) + '" text-anchor="middle" font-size="10.5" font-weight="700" fill="' + c + '" font-family="Inter,sans-serif" letter-spacing=".6">' + esc(p.label[1].toUpperCase()) + '</text>';
    var ridges = ""; for (var k = 0; k < 14; k++) ridges += '<rect x="' + (48 + k * 7.6) + '" y="30" width="1.6" height="30" fill="#000" opacity=".16"/>';
    var b;
    if (p.shape === "pouch") {
      b = '<path d="M38 36 H162 L168 50 C171 100 171 160 168 208 Q167 220 154 220 H46 Q33 220 32 208 C29 160 29 100 32 50 Z" fill="' + B + '"/>' +
        '<path d="M38 36 H162 L168 50 H32 Z" fill="' + dk + '" opacity=".55"/><path d="M40 38 H160" stroke="#fff" stroke-width="1.2" opacity=".35" stroke-dasharray="2 3"/>' +
        '<rect x="40" y="52" width="14" height="150" rx="7" fill="' + S + '"/>' + lbl +
        '<path d="M32 206 Q100 216 168 206 L168 208 Q167 220 154 220 H46 Q33 220 32 208 Z" fill="#000" opacity=".16"/>';
    } else if (p.shape === "jar") {
      b = '<rect x="44" y="28" width="112" height="34" rx="9" fill="' + C + '"/>' + ridges +
        '<rect x="44" y="28" width="112" height="9" rx="4" fill="#fff" opacity=".18"/>' +
        '<rect x="38" y="58" width="124" height="160" rx="22" fill="' + B + '"/>' +
        '<rect x="46" y="70" width="12" height="128" rx="6" fill="' + S + '"/>' + lbl +
        '<rect x="38" y="204" width="124" height="14" rx="8" fill="#000" opacity=".14"/>';
    } else if (p.shape === "bottle") {
      b = '<rect x="82" y="8" width="36" height="24" rx="6" fill="' + C + '"/><rect x="82" y="8" width="36" height="6" rx="3" fill="#fff" opacity=".2"/>' +
        '<rect x="87" y="30" width="26" height="26" fill="' + B + '"/>' +
        '<path d="M87 54 Q36 70 36 120 V208 q0 17 17 17 h94 q17 0 17 -17 V120 Q164 70 113 54z" fill="' + B + '"/>' +
        '<path d="M50 116 Q52 86 80 70" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".4"/>' +
        '<rect x="45" y="124" width="11" height="82" rx="5.5" fill="' + S + '"/>' + lbl +
        '<path d="M36 206 Q100 218 164 206 V208 q0 17 -17 17 H53 q-17 0 -17 -17z" fill="#000" opacity=".16"/>';
    } else {
      b = '<polygon points="150,46 178,58 178,224 150,212" fill="' + dk + '"/><rect x="32" y="46" width="118" height="166" fill="' + B + '"/>' +
        '<polygon points="32,46 60,34 178,58 150,46" fill="' + lt + '"/><rect x="40" y="56" width="12" height="140" rx="6" fill="' + S + '"/>' + lbl +
        '<rect x="32" y="196" width="118" height="16" fill="#000" opacity=".16"/>';
    }
    return '<svg viewBox="0 0 200 240" role="img" aria-label="' + esc(p.name) + ' pack (illustration)">' + defs + '<ellipse cx="100" cy="228" rx="70" ry="9" fill="url(#' + id + 'o)"/>' + b + '</svg>';
  }
  function picHtml(p) { return '<img src="assets/images/products/' + p.id + '.webp" alt="' + esc(p.name) + '" loading="lazy" onerror="this.remove()">' + pack(p); }
  function byId(id) { return PRODUCTS.filter(function (x) { return x.id === id; })[0]; }
  function arrow() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'; }
  function cardHtml(p) {
    return '<article class="card prod-card reveal"><a class="prod-card__pic" href="product-details.html?id=' + p.id + '" aria-label="View details: ' + esc(p.name) + '" tabindex="-1">' + picHtml(p) + '</a>' +
      '<div class="card__body"><span class="tag tag--beige" style="align-self:flex-start">' + CATNAME[p.cat] + '</span><h3 class="card__title">' + esc(p.name) + '</h3><p class="card__text">' + esc(p.desc) + '</p>' +
      '<div class="card__foot"><a class="btn btn--ghost btn--sm" href="product-details.html?id=' + p.id + '">View Details</a></div></div></article>';
  }

  var grid = $("#prodGrid");
  if (grid) {
    var qs0 = new URLSearchParams(window.location.search), startCat = qs0.get("cat");
    var state = { cat: CATNAME[startCat] ? startCat : "all", q: "", sort: "featured" };
    var chips = $("#catChips");
    chips.innerHTML = CATS.map(function (c) { return '<button type="button" class="chip" data-cat="' + c[0] + '" aria-pressed="' + (c[0] === state.cat) + '">' + c[1] + '</button>'; }).join("");
    chips.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      state.cat = b.dataset.cat; setChips(chips, state.cat, "cat"); render();
    });
    $("#prodSearch").addEventListener("input", function (e) { state.q = e.target.value.trim().toLowerCase(); render(); });
    $("#prodSort").addEventListener("change", function (e) { state.sort = e.target.value; render(); });
    var render = function () {
      var list = PRODUCTS.filter(function (p) {
        return (state.cat === "all" || p.cat === state.cat) && (!state.q || (p.name + " " + p.desc + " " + CATNAME[p.cat]).toLowerCase().indexOf(state.q) !== -1);
      });
      if (state.sort === "az") list.sort(function (a, b) { return a.name.localeCompare(b.name); });
      grid.innerHTML = list.map(cardHtml).join("");
      $$(".reveal", grid).forEach(function (el) { el.classList.add("is-visible"); });
      $("#prodCount").textContent = list.length + (list.length === 1 ? " product" : " products");
      $("#prodEmpty").hidden = list.length !== 0;
    };
    render();
  }

  /* 5. PRODUCT DETAILS --------------------------------------- */
  var detail = $("#productDetail");
  if (detail) {
    var p = byId(new URLSearchParams(window.location.search).get("id")) || PRODUCTS[0];
    document.title = p.name + " – Shwe Myanmar";
    $("#crumbName").textContent = p.name;
    $("#detailPic").innerHTML = picHtml(p);
    $("#detailCat").textContent = CATNAME[p.cat];
    $("#detailName").textContent = p.name;
    $("#detailDesc").textContent = p.desc;
    $("#detailSizes").innerHTML = p.sizes.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join("");
    $("#detailCatCell").textContent = CATNAME[p.cat];
    $("#detailPack").textContent = PACKTYPE[p.shape] + " (sample)";
    $("#packSizes").innerHTML = p.sizes.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("");
    $("#packType").textContent = PACKTYPE[p.shape];
    $("#detailEnquire").href = "contact.html?product=" + encodeURIComponent(p.name) + "#contactForm";
    $("#relatedGrid").innerHTML = PRODUCTS.filter(function (x) { return x.id !== p.id; })
      .sort(function (a, b) { return (b.cat === p.cat) - (a.cat === p.cat); }).slice(0, 4).map(cardHtml).join("");
    $$("#relatedGrid .reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* 6. NEWS: category filter + pagination -------------------- */
  var newsList = $("#newsList");
  if (newsList) {
    var items = $$(".news-item", newsList), PER = 4, ns = { cat: "all", page: 1 };
    var catBox = $("#newsCats"), pager = $("#newsPager");
    var renderNews = function () {
      var vis = items.filter(function (i) { return ns.cat === "all" || i.dataset.cat === ns.cat; });
      var pages = Math.max(1, Math.ceil(vis.length / PER));
      if (ns.page > pages) ns.page = pages;
      items.forEach(function (i) { i.hidden = true; });
      vis.slice((ns.page - 1) * PER, ns.page * PER).forEach(function (i) { i.hidden = false; i.classList.add("is-visible"); });
      $("#newsEmpty").hidden = vis.length !== 0;
      var h = '<button type="button" data-p="' + (ns.page - 1) + '"' + (ns.page === 1 ? " disabled" : "") + ' aria-label="Previous page">&lsaquo;</button>';
      for (var n = 1; n <= pages; n++) h += '<button type="button" data-p="' + n + '"' + (n === ns.page ? ' aria-current="page"' : "") + ' aria-label="Page ' + n + '">' + n + '</button>';
      h += '<button type="button" data-p="' + (ns.page + 1) + '"' + (ns.page === pages ? " disabled" : "") + ' aria-label="Next page">&rsaquo;</button>';
      pager.innerHTML = h; pager.hidden = pages < 2;
    };
    catBox.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      ns.cat = b.dataset.cat; ns.page = 1; setChips(catBox, ns.cat, "cat"); renderNews();
    });
    pager.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-p]"); if (!b || b.disabled) return;
      ns.page = +b.dataset.p; renderNews();
      newsList.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    renderNews();
  }

  /* 7. ACTIVITIES: department filter -------------------------- */
  var actBox = $("#actDepts"), actCards = $$(".act-item");
  if (actBox) {
    actBox.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      setChips(actBox, b.dataset.dept, "dept");
      var n = 0;
      actCards.forEach(function (c) { var ok = b.dataset.dept === "all" || c.dataset.dept === b.dataset.dept; c.hidden = !ok; if (ok) n++; });
      $("#actEmpty").hidden = n !== 0;
    });
  }

  /* 8. CONTACT FORM ------------------------------------------- */
  var form = $("#contactForm");
  if (form) {
    var qs = new URLSearchParams(window.location.search), prod = qs.get("product"), topic = qs.get("topic");
    if (prod) { form.topic.value = "Product enquiry"; form.message.value = "Hello, I would like to ask about " + prod + ".\n\nQuantity: \nDelivery area: "; }
    else if (topic) { form.topic.value = topic; if (qs.get("role")) form.message.value = "I would like to apply for: " + qs.get("role") + "."; }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = form.name.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim()) && form.message.value.trim();
      $("#cError").hidden = !!ok; $("#cOk").hidden = !ok;
      if (ok) form.reset();
    });
  }

  /* 9. PAGE EXTRAS --------------------------------------------- */
  var topBtn = $("#toTop");
  if (topBtn) topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  var rev = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }); }, { threshold: .08 });
    rev.forEach(function (el) { io.observe(el); });
  } else rev.forEach(function (el) { el.classList.add("is-visible"); });
  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
})();
