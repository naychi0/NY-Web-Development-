/* ==========================================================
   Babe Cake – demo script (vanilla JS)
   1 Mobile menu · 2 Active link · 3 Hero slider · 4 Cart
   5 Gallery lightbox · 6 Back-to-top · 7 Reveal · 8 Year
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
  function setMenu(open) {
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  navToggle.addEventListener("click", function () {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });
  $$(".nav__link").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  window.addEventListener("resize", function () { if (window.innerWidth > 860) setMenu(false); });

  /* 2. Highlight nav link of the section in view ------------ */
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

  /* 3. Hero slider ------------------------------------------ */
  var slides = $$("#heroTrack .slide");
  var dotsWrap = $("#heroDots");
  var index = 0;
  var timer;

  slides.forEach(function (_, i) {
    var d = document.createElement("button");
    d.type = "button";
    d.className = "hero__dot" + (i === 0 ? " is-active" : "");
    d.setAttribute("role", "tab");
    d.setAttribute("aria-label", "Go to slide " + (i + 1));
    d.addEventListener("click", function () { go(i); restart(); });
    dotsWrap.appendChild(d);
  });
  var dots = $$(".hero__dot");

  function go(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle("is-active", n === index); });
    dots.forEach(function (d, n) { d.classList.toggle("is-active", n === index); });
  }
  function restart() {
    clearInterval(timer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setInterval(function () { go(index + 1); }, 5500);
    }
  }
  $("#heroPrev").addEventListener("click", function () { go(index - 1); restart(); });
  $("#heroNext").addEventListener("click", function () { go(index + 1); restart(); });

  var hero = $("#home");
  hero.addEventListener("mouseenter", function () { clearInterval(timer); });
  hero.addEventListener("mouseleave", restart);
  var startX = null;
  hero.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { go(index + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
  });
  restart();

  /* 4. Cart ------------------------------------------------- */
  var cart = {}; // name -> {price, qty}
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
    if (!names.length) {
      body.innerHTML = '<p class="drawer__empty">Your cart is empty.</p>';
    }
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
      var btns = $$(".cart-item__qty button", row);
      btns[0].addEventListener("click", function () { it.qty--; if (it.qty < 1) delete cart[name]; renderCart(); });
      btns[1].addEventListener("click", function () { it.qty++; renderCart(); });
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
      toast(name + " added to cart");
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
  renderCart();

  /* 5. Gallery lightbox ------------------------------------- */
  var items = $$(".gallery__item");
  var lb = $("#lightbox");
  var lbImg = $("#lbImg");
  var lbIndex = 0;
  var lastFocus = null;

  function showPhoto(i) {
    lbIndex = (i + items.length) % items.length;
    var img = $("img", items[lbIndex]);
    if (img) { lbImg.src = img.src; lbImg.alt = img.alt; lbImg.hidden = false; }
    else { lbImg.hidden = true; }
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    showPhoto(i);
    lb.hidden = false;
    $("#lbClose").focus();
  }
  function closeLb() {
    lb.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  items.forEach(function (el, i) { el.addEventListener("click", function () { openLb(i); }); });
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", function () { showPhoto(lbIndex - 1); });
  $("#lbNext").addEventListener("click", function () { showPhoto(lbIndex + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!lb.hidden) closeLb();
      else if (drawer.classList.contains("is-open")) setDrawer(false);
      else setMenu(false);
    }
    if (!lb.hidden) {
      if (e.key === "ArrowLeft") showPhoto(lbIndex - 1);
      if (e.key === "ArrowRight") showPhoto(lbIndex + 1);
    }
  });

  /* 6. Back-to-top ------------------------------------------ */
  var topBtn = $("#backToTop");
  window.addEventListener("scroll", function () {
    topBtn.classList.toggle("is-visible", window.scrollY > 500);
    markActive();
  }, { passive: true });
  topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
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
