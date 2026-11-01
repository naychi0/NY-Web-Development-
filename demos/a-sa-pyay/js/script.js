/* ==========================================================
   အဆာပြေ Myanmar Tea Shop – demo script (vanilla JS)
   1 Mobile menu + header · 2 Active link · 3 Hero slider · 4 Menu tabs
   5 Order cart · 6 Back-to-top · 7 Reveal · 8 Year
   ========================================================== */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-visible"); }, 2200);
  }
  function money(n) { return "MMK " + n.toLocaleString("en-US"); }

  /* 1. Mobile menu ------------------------------------------ */
  var navToggle = $("#navToggle");
  var navMenu = $("#navMenu");
  var header = $("#siteHeader");
  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  function setMenu(open) {
    header.classList.toggle("menu-open", open);
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  navToggle.addEventListener("click", function () {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });
  $$(".nav__link").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  window.addEventListener("resize", function () { if (window.innerWidth > 860) setMenu(false); });

  /* 2. Highlight the nav link of the section in view -------- */
  var links = $$(".nav__link");
  var sections = links.map(function (a) { return $(a.getAttribute("href")); });
  function markActive() {
    var y = window.scrollY + 140;
    var current = 0, best = -1;
    sections.forEach(function (s, i) {
      if (s && s.offsetTop <= y && s.offsetTop > best) { best = s.offsetTop; current = i; }
    });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = links.length - 1;
    links.forEach(function (a, i) { a.classList.toggle("is-active", i === current); });
  }

  /* 3. Hero photo slider ------------------------------------ */
  var slider = $("#heroSlider");
  var slides = $$(".hero__slide", slider);
  var dotsWrap = $("#heroDots");
  var current = 0, timer = null, paused = false, busy = false;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  slides.forEach(function (slide, i) {
    slide.setAttribute("aria-label", (i + 1) + " of " + slides.length);
    var d = document.createElement("button");
    d.type = "button";
    d.className = "hero__dot" + (i === 0 ? " is-active" : "");
    d.setAttribute("aria-label", "Show photo " + (i + 1));
    d.addEventListener("click", function () { show(i); restart(); });
    dotsWrap.appendChild(d);
  });
  var dots = $$(".hero__dot", slider);
  function show(i) {
    var next = (i + slides.length) % slides.length;
    if (next === current || busy) return;
    busy = true;
    var out = slides[current];
    out.classList.remove("is-active");
    out.classList.add("is-leaving");
    slides[next].classList.add("is-active");
    dots[current].classList.remove("is-active");
    dots[next].classList.add("is-active");
    current = next;
    setTimeout(function () { out.classList.remove("is-leaving"); busy = false; }, 900);
  }
  function stop() { clearInterval(timer); timer = null; }
  function restart() {
    stop();
    if (!paused && !reduceMotion) timer = setInterval(function () { show(current + 1); }, 5000);
  }
  $("#heroPrev").addEventListener("click", function () { show(current - 1); restart(); });
  $("#heroNext").addEventListener("click", function () { show(current + 1); restart(); });
  var pauseBtn = $("#heroPause");
  pauseBtn.addEventListener("click", function () {
    paused = !paused;
    pauseBtn.setAttribute("aria-pressed", String(paused));
    pauseBtn.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
    restart();
  });
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", restart);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", restart);
  var startX = null;
  slider.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { show(current + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
  });
  if (reduceMotion) { paused = true; pauseBtn.setAttribute("aria-pressed", "true"); pauseBtn.setAttribute("aria-label", "Play slideshow"); }
  restart();

  /* 4. Menu tabs -------------------------------------------- */
  var tabs = $$(".menu-tab");
  var cards = $$(".menu-card");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var f = tab.getAttribute("data-filter");
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-pressed", String(on));
      });
      cards.forEach(function (c) { c.hidden = c.getAttribute("data-category") !== f; });
    });
  });

  /* 5. Order cart ------------------------------------------- */
  var cart = {};
  var drawer = $("#cartDrawer");
  var overlay = $("#drawerOverlay");
  var cartToggle = $("#cartToggle");

  function setDrawer(open) {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    overlay.hidden = !open;
    cartToggle.setAttribute("aria-expanded", String(open));
    if (open) $("#cartClose").focus(); else cartToggle.focus();
  }
  function renderCart() {
    var body = $("#cartBody");
    var names = Object.keys(cart);
    var count = 0, total = 0;
    body.innerHTML = "";
    if (!names.length) body.innerHTML = '<p class="drawer__empty">Your order is empty.</p>';
    names.forEach(function (name) {
      var it = cart[name];
      count += it.qty;
      total += it.qty * it.price;
      var row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML =
        '<div><div class="cart-item__name"></div><div class="cart-item__price"></div></div>' +
        '<button class="cart-item__remove" type="button">Remove</button>' +
        '<div class="cart-item__qty"><button type="button" aria-label="Decrease">−</button><span></span><button type="button" aria-label="Increase">+</button></div>';
      $(".cart-item__name", row).textContent = name;
      $(".cart-item__price", row).textContent = money(it.price) + " each";
      $(".cart-item__qty span", row).textContent = it.qty;
      var b = $$(".cart-item__qty button", row);
      b[0].addEventListener("click", function () { it.qty--; if (it.qty < 1) delete cart[name]; renderCart(); });
      b[1].addEventListener("click", function () { it.qty++; renderCart(); });
      $(".cart-item__remove", row).addEventListener("click", function () { delete cart[name]; renderCart(); });
      body.appendChild(row);
    });
    var badge = $("#cartCount");
    badge.textContent = count;
    badge.hidden = count === 0;
    $("#cartTotal").textContent = money(total);
    $("#checkoutBtn").disabled = count === 0;
    $("#checkoutBtn").style.opacity = count === 0 ? "0.5" : "1";
  }
  $$(".js-add").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var name = btn.getAttribute("data-name");
      var price = Number(btn.getAttribute("data-price"));
      if (!cart[name]) cart[name] = { price: price, qty: 0 };
      cart[name].qty++;
      renderCart();
      toast(name + " added to your order");
    });
  });
  cartToggle.addEventListener("click", function () { setDrawer(true); });
  $("#cartClose").addEventListener("click", function () { setDrawer(false); });
  overlay.addEventListener("click", function () { setDrawer(false); });
  $("#checkoutBtn").addEventListener("click", function () {
    if (!Object.keys(cart).length) return;
    cart = {};
    renderCart();
    setDrawer(false);
    toast("Thank you! Your order was received (demo).");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (drawer.classList.contains("is-open")) setDrawer(false); else setMenu(false);
  });
  renderCart();

  /* 6. Back-to-top ------------------------------------------ */
  var topBtn = $("#backToTop");
  window.addEventListener("scroll", function () {
    topBtn.classList.toggle("is-visible", window.scrollY > 500);
    updateHeader();
    markActive();
  }, { passive: true });
  topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  updateHeader();
  markActive();

  /* 7. Reveal on scroll ------------------------------------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* 8. Footer year ------------------------------------------ */
  $("#year").textContent = new Date().getFullYear();
})();
