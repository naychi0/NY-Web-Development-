/* ==========================================================
   FitZone – demo script (vanilla JS)
   1 Mobile menu · 2 Active link · 3 Hero slider · 4 Join modal + form
   5 Back-to-top · 6 Reveal · 7 Year
   ========================================================== */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

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
  var index = 0, timer;
  slides.forEach(function (_, i) {
    var d = document.createElement("button");
    d.type = "button";
    d.className = "hero__dot" + (i === 0 ? " is-active" : "");
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

  /* 4. Join modal + form validation ------------------------- */
  var modal = $("#joinModal");
  var form = $("#joinForm");
  var success = $("#joinSuccess");
  var lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    form.hidden = false;
    success.hidden = true;
    modal.hidden = false;
    $("#jName").focus();
  }
  function closeModal() {
    modal.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  $$(".js-join").forEach(function (b) { b.addEventListener("click", openModal); });
  $("#joinClose").addEventListener("click", closeModal);
  $("#joinDone").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!modal.hidden) closeModal(); else setMenu(false);
  });

  function setError(input, msg) {
    var field = input.closest(".field");
    field.classList.toggle("has-error", !!msg);
    $(".field__error", field).textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function validate() {
    var ok = true;
    var name = $("#jName"), phone = $("#jPhone"), email = $("#jEmail"), prog = $("#jProgram");
    if (name.value.trim().length < 2) { setError(name, "Please enter your name."); ok = false; } else setError(name, "");
    if (!/^[0-9+()\s-]{7,16}$/.test(phone.value.trim())) { setError(phone, "Enter a valid phone number."); ok = false; } else setError(phone, "");
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, "Enter a valid email."); ok = false; } else setError(email, "");
    if (!prog.value) { setError(prog, "Please choose a program."); ok = false; } else setError(prog, "");
    return ok;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var bad = $(".has-error input, .has-error select", form);
      if (bad) bad.focus();
      return;
    }
    form.reset();
    form.hidden = true;
    success.hidden = false;
    $("#joinDone").focus();
  });

  /* 5. Back-to-top ------------------------------------------ */
  var topBtn = $("#backToTop");
  window.addEventListener("scroll", function () {
    topBtn.classList.toggle("is-visible", window.scrollY > 500);
    markActive();
  }, { passive: true });
  topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  markActive();

  /* 6. Reveal on scroll ------------------------------------- */
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

  /* 7. Footer year ------------------------------------------ */
  $("#year").textContent = new Date().getFullYear();
})();
