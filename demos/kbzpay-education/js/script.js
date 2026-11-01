/* ==========================================================
   KBZPay Education – mini app demo script (vanilla JS)
   1 Data · 2 Helpers · 3 State · 4 Renderers · 5 Wizard
   6 Router · 7 Carousel · 8 Drawer / bell / fab · 9 Init
   ========================================================== */
(function () {
  "use strict";

  /* 1. DATA (sample content based on the supplied screens) ---- */
  var USERNAME = "miniapp_appcubeDev02";

  var CENTERS = [
    { id: "strategy-first", name: "Strategy First University", city: "Yangon", rating: 5, logo: "logo-strategy-first.png",
      place: "Strategy First University Campus", address: "123 Education Street, Yangon, Myanmar",
      map: "map-strategy-first.jpg", mapQuery: "Strategy First College Yangon",
      photos: [["campus-classroom.jpg", "Classroom with rows of modern desks"], ["campus-building.jpg", "Campus building with a green courtyard"]] },
    { id: "language-center", name: "Language Center", city: "Mandalay", rating: 3, logo: "logo-wall-street-english.png",
      place: "Language Center", address: "No. 45, Sample Road, Mandalay, Myanmar", map: null, mapQuery: "Language Center Mandalay", photos: [] },
    { id: "kmd-center", name: "KMD Center", city: "Yangon", rating: 5, logo: "logo-kmd.png",
      place: "KMD Center", address: "No. 8, Sample Street, Yangon, Myanmar", map: null, mapQuery: "KMD College Yangon", photos: [] }
  ];

  var COURSES = [
    { id: "japanese", title: "JAPANESE", cat: "JAPANESE", price: 345000, day: "Monday", by: "Min Thike Tunn", duration: "60 days", center: "language-center" },
    { id: "english-4-skills", title: "English 4 Skills", cat: "ENGLISH", price: 100000, day: "Weekend", by: "U Aung", duration: "45 days", center: "language-center" },
    { id: "computer-basic", title: "Computer Basic", cat: null, price: 25000, day: "Monday", by: "U Han", duration: "30 days", center: "kmd-center" },
    { id: "ged", title: "GED", cat: "GED", price: 300000, day: "Monday", by: "John", duration: "90 days", center: "kmd-center" },
    { id: "ielts", title: "IELTS", cat: "IELTS", price: 45000, day: "Tuesday", by: "Reca", duration: "45 days", center: "language-center" },
    { id: "lcci", title: "LCCI", cat: "LCCI", price: 345000, day: "Wednesday", by: "Nay", duration: "60 days", center: "strategy-first" },
    { id: "korean", title: "KOREAN", cat: "KOREAN", price: 90000, day: "Thursday", by: "Su Su", duration: "60 days", center: "language-center" }
  ];

  var CATEGORIES = [
    { name: "GED", icon: "i-book" }, { name: "LCCI", icon: "i-award" }, { name: "IELTS", icon: "i-cap" },
    { name: "ENGLISH", icon: "i-globe" }, { name: "JAPANESE", icon: "i-globe" }, { name: "KOREAN", icon: "i-globe" }
  ];

  var WIZARD = {
    register: { percent: 20, title: "Personal Details", bars: 1 },
    summary:  { percent: 60, title: "Course Summary", bars: 2 },
    payment:  { percent: 80, title: "Payment", bars: 3 },
    success:  { percent: 100, title: "Payment Successful", bars: 4 }
  };

  /* 2. HELPERS ------------------------------------------------ */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return n.toLocaleString("en-US") + " MMK"; }
  function byId(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }
  function icon(id, cls) { return '<svg class="icon ' + (cls || "") + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function store(key, val) { try { if (val === undefined) { var r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } localStorage.setItem(key, JSON.stringify(val)); } catch (e) { return null; } }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-visible"); }, 2400);
  }

  /* 3. STATE -------------------------------------------------- */
  var flow = { courseId: null, phone: "", education: "High School Graduate", recordIndex: null, paid: false };
  var history = store("kbz.history") || [
    { id: "Enrollment_" + USERNAME, course: "Computer Basic", center: "KMD Center", amount: 25000, status: "PENDING" }
  ];
  function saveHistory() { store("kbz.history", history); }

  /* 4. RENDERERS --------------------------------------------- */
  function centerCard(c) {
    return '<li><a class="card" href="#/center/' + c.id + '"><span class="card__logo"><img src="images/' + c.logo + '" alt="" loading="lazy"></span>' +
      '<span><span class="card__name">' + esc(c.name) + '</span>' +
      '<span class="meta">' + icon("i-pin") + esc(c.city) + '</span>' +
      '<span class="meta">' + icon("i-star", "icon--star") + c.rating + ' rating</span></span></a></li>';
  }
  function courseCard(c) {
    return '<li class="course-card"><div><h3 class="course-card__title">' + esc(c.title) + '</h3></div>' +
      '<p class="course-card__price">' + c.price.toLocaleString("en-US") + ' <small>MMK</small></p>' +
      '<div><p class="course-card__day">' + esc(c.day) + '</p><p class="course-card__by">By: ' + esc(c.by) + '</p></div>' +
      '<div style="align-self:end"><button class="btn-enroll" type="button" data-enroll="' + c.id + '" aria-label="Enroll in ' + esc(c.title) + '">Enroll</button></div></li>';
  }
  function courseCardChips(c) {
    return '<li class="course-card"><div><h3 class="course-card__title">' + esc(c.title) + '</h3>' +
      '<div class="course-card__chips"><span class="chip">' + esc(c.day) + '</span><span class="chip">' + esc(c.duration) + '</span></div>' +
      '<p class="course-card__by">By: ' + esc(c.by) + '</p></div>' +
      '<div class="course-card__side"><p class="course-card__price">' + c.price.toLocaleString("en-US") + ' <small>MMK</small></p>' +
      '<button class="btn-enroll" type="button" data-enroll="' + c.id + '" aria-label="Enroll in ' + esc(c.title) + '">Enroll</button></div></li>';
  }

  function renderHome() {
    $("#categoryGrid").innerHTML = CATEGORIES.map(function (c) {
      return '<li><button class="category" type="button" data-cat="' + c.name + '"><span class="category__tile">' + icon(c.icon) + '</span>' + c.name + '</button></li>';
    }).join("");
    $("#topCenters").innerHTML = CENTERS.map(centerCard).join("");
  }

  var courseFilter = { cat: "", q: "" };
  function renderCourses() {
    var q = courseFilter.q.trim().toLowerCase();
    var list = COURSES.filter(function (c) {
      var center = byId(CENTERS, c.center);
      var okCat = !courseFilter.cat || c.cat === courseFilter.cat;
      var okQ = !q || (c.title + " " + center.name + " " + c.by).toLowerCase().indexOf(q) > -1;
      return okCat && okQ;
    });
    $("#courseHeading").textContent = 'Results for "' + (courseFilter.q.trim() || courseFilter.cat || "All") + '"';
    $("#courseList").innerHTML = list.length ? list.map(courseCard).join("") : '<li class="empty">No courses found.</li>';
  }

  function renderCenters() {
    var q = $("#centerSearch").value.trim().toLowerCase();
    var list = CENTERS.filter(function (c) { return !q || (c.name + " " + c.city).toLowerCase().indexOf(q) > -1; });
    $("#centerList").innerHTML = list.length ? list.map(centerCard).join("") : '<li class="empty">No centers found.</li>';
  }

  function renderCenter(id) {
    var c = byId(CENTERS, id);
    if (!c) return false;
    document.title = c.name + " – KBZPay Education";
    $("#centerHead").innerHTML = '<span class="card__logo"><img src="images/' + c.logo + '" alt=""></span><div><h1 class="center-head__name">' + esc(c.name) + '</h1>' +
      '<p class="meta">' + icon("i-pin") + esc(c.city) + '</p><p class="meta">' + icon("i-star", "icon--star") + c.rating + ' Rating</p></div>';

    var photosTitle = $("#centerPhotos").previousElementSibling;
    photosTitle.hidden = $("#centerPhotos").hidden = !c.photos.length;
    $("#centerPhotos").innerHTML = c.photos.map(function (p) { return '<li><img src="images/' + p[0] + '" alt="' + esc(p[1]) + '" loading="lazy"></li>'; }).join("");

    var mapUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(c.mapQuery);
    $("#centerMap").innerHTML =
      (c.map ? '<div class="map-card__img"><img src="images/' + c.map + '" alt="Map showing ' + esc(c.place) + '"><a class="map-card__btn" href="' + mapUrl + '" target="_blank" rel="noopener">Maps ' + icon("i-external") + '</a></div>' : "") +
      '<div class="map-card__place">' + icon("i-pin") + '<div><p class="map-card__name">' + esc(c.place) + '</p><p class="map-card__addr">' + esc(c.address) + '</p>' +
      (c.map ? "" : '<a class="map-card__addr" style="color:var(--blue);font-weight:600" href="' + mapUrl + '" target="_blank" rel="noopener">Open in Maps</a>') + '</div></div>';

    var courses = COURSES.filter(function (x) { return x.center === id; });
    $("#centerCourseCount").textContent = courses.length + (courses.length === 1 ? " Course" : " Courses");
    $("#centerCourses").innerHTML = courses.map(courseCardChips).join("");
    return true;
  }

  function renderHistory() {
    $("#historyList").innerHTML = history.length ? history.slice().reverse().map(function (h) {
      var ok = h.status === "CONFIRMED";
      return '<li class="history-card' + (ok ? " history-card--confirmed" : "") + '"><div class="history-card__top"><p class="history-card__id">' + esc(h.id) + '</p>' +
        '<span class="badge' + (ok ? " badge--confirmed" : "") + '">' + h.status + '</span></div>' +
        '<h3 class="history-card__course">' + esc(h.course) + '</h3><p class="history-card__center">' + esc(h.center) + '</p>' +
        '<p class="history-card__amount">' + money(h.amount) + '</p></li>';
    }).join("") : '<li class="empty">No enrollments yet.</li>';
  }

  /* 5. WIZARD ------------------------------------------------- */
  function summaryRows(course, center) {
    return '<div>' + icon("i-pin") + '<dt>Center Name</dt><dd>' + esc(center.name) + '</dd></div>' +
      '<div>' + icon("i-book") + '<dt>Course</dt><dd class="is-blue">' + esc(course.title) + '</dd></div>' +
      '<div>' + icon("i-user") + '<dt>Student Name</dt><dd>' + esc(USERNAME) + '</dd></div>';
  }

  function showStep(step) {
    var cfg = WIZARD[step];
    var wz = $('[data-view="wizard"]');
    wz.setAttribute("data-step", step);
    $("#wzPercent").textContent = cfg.percent + "%";
    $("#wzTitle").textContent = cfg.title;
    $$("#wzSteps i").forEach(function (b, i) { b.classList.toggle("is-done", i < cfg.bars); });
    $$("[data-step]", wz).forEach(function (s) { if (s !== wz) s.hidden = s.getAttribute("data-step") !== step; });
    $(".wizard__percent").innerHTML = '<strong id="wzPercent">' + cfg.percent + "%</strong> Completed";
    document.title = cfg.title + " – KBZPay Education";
  }

  function renderWizard(step, arg) {
    var course;
    if (step === "register") {
      course = byId(COURSES, arg);
      if (!course) return false;
      if (flow.courseId !== course.id) { flow = { courseId: course.id, phone: "", education: "High School Graduate", recordIndex: null, paid: false }; }
      $("#fUser").value = USERNAME;
      $("#fPhone").value = flow.phone;
      $("#fEdu").value = flow.education;
      $("#fPhoneErr").textContent = "";
      $("#fPhone").closest(".field").classList.remove("has-error");
    } else {
      course = byId(COURSES, flow.courseId);
      if (!course) return false;
      if (step !== "register" && !flow.phone) return false;
      if (step === "success" && !flow.paid) return false;
      if (step === "payment" && flow.recordIndex === null) return false;
    }
    var center = byId(CENTERS, course.center);
    if (step === "summary") { $("#summaryRows").innerHTML = summaryRows(course, center); $("#summaryTotal").textContent = money(course.price); }
    if (step === "payment") { $("#paymentRows").innerHTML = summaryRows(course, center); $("#paymentTotal").textContent = money(course.price); $("#payNow").disabled = false; $("#payNow").textContent = "Pay Now"; }
    if (step === "success") {
      $("#receipt").innerHTML = '<div><dt>Center</dt><dd>' + esc(center.name) + '</dd></div><div><dt>Course</dt><dd class="is-blue">' + esc(course.title) + '</dd></div>' +
        '<div class="receipt__total"><dt>Amount Paid</dt><dd>' + money(course.price) + '</dd></div>';
    }
    showStep(step);
    return true;
  }

  function wizardBack() {
    var step = $('[data-view="wizard"]').getAttribute("data-step");
    var course = flow.courseId;
    if (step === "payment") location.hash = "#/summary";
    else if (step === "summary" && course) location.hash = "#/register/" + course;
    else if (window.history.length > 1) window.history.back();
    else location.hash = "#/home";
  }

  function bindWizard() {
    $("#wizardBack").addEventListener("click", wizardBack);
    $$("[data-go='back']").forEach(function (b) { b.addEventListener("click", wizardBack); });

    $("#registerForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var phone = $("#fPhone").value.replace(/\s+/g, "");
      var field = $("#fPhone").closest(".field");
      if (!/^09\d{7,9}$/.test(phone)) {
        $("#fPhoneErr").textContent = "Enter a valid phone number, for example 09xxxxxxxxx.";
        field.classList.add("has-error");
        $("#fPhone").setAttribute("aria-invalid", "true");
        $("#fPhone").focus();
        return;
      }
      field.classList.remove("has-error");
      $("#fPhone").removeAttribute("aria-invalid");
      flow.phone = phone;
      flow.education = $("#fEdu").value;
      location.hash = "#/summary";
    });
    $("#fPhone").addEventListener("input", function () {
      this.value = this.value.replace(/[^\d]/g, "");
      $("#fPhoneErr").textContent = "";
      this.closest(".field").classList.remove("has-error");
    });

    $("#summaryNext").addEventListener("click", function () {
      var course = byId(COURSES, flow.courseId);
      if (flow.recordIndex === null) {
        history.push({ id: "Enrollment_" + USERNAME, course: course.title, center: byId(CENTERS, course.center).name, amount: course.price, status: "PENDING" });
        flow.recordIndex = history.length - 1;
        saveHistory();
      }
      location.hash = "#/payment";
    });

    $("#payNow").addEventListener("click", function () {
      var btn = this;
      btn.disabled = true;
      btn.textContent = "Processing…";
      setTimeout(function () {
        if (history[flow.recordIndex]) history[flow.recordIndex].status = "CONFIRMED";
        saveHistory();
        flow.paid = true;
        location.hash = "#/success";
      }, 900);
    });

    $("[data-step='success'] .btn").addEventListener("click", function () {
      flow = { courseId: null, phone: "", education: "High School Graduate", recordIndex: null, paid: false };
    });
  }

  /* 6. ROUTER ------------------------------------------------- */
  var appbar = $("#appbar");
  var leftBtn = $("#appLeft");
  var carousel = null;

  function parseHash() {
    var h = location.hash.replace(/^#\/?/, "");
    var q = "", i = h.indexOf("?");
    if (i > -1) { q = h.slice(i + 1); h = h.slice(0, i); }
    var parts = h.split("/");
    return { name: parts[0] || "home", arg: parts[1] || "", params: new URLSearchParams(q) };
  }

  function setBar(mode) {
    appbar.setAttribute("data-mode", mode);
    var isHome = mode === "home";
    leftBtn.setAttribute("aria-label", isHome ? "Open menu" : "Go back");
    leftBtn.querySelector("use").setAttribute("href", isHome ? "#i-menu" : "#i-back");
  }

  function showView(name) {
    $$("#view > [data-view]").forEach(function (v) { v.hidden = v.getAttribute("data-view") !== name; });
    $("#fab").hidden = name !== "home";
  }

  function route() {
    var r = parseHash();
    var view = r.name, ok = true;
    closeDrawer(true);
    if (carousel) carousel.stop();
    var titles = { home: "KBZPay Education – Mini App Demo", courses: "Courses – KBZPay Education", centers: "Centers – KBZPay Education", history: "Enrollment History – KBZPay Education" };

    if (view === "home") {
      setBar("home"); showView("home"); renderHome(); if (carousel) carousel.start();
    } else if (view === "courses") {
      courseFilter = { cat: (r.params.get("cat") || "").toUpperCase(), q: r.params.get("q") || "" };
      $("#courseSearch").value = courseFilter.q;
      setBar("sub"); showView("courses"); renderCourses();
    } else if (view === "centers") {
      $("#centerSearch").value = "";
      setBar("sub"); showView("centers"); renderCenters();
    } else if (view === "center") {
      ok = renderCenter(r.arg);
      if (ok) { setBar("sub"); showView("center"); }
    } else if (view === "history") {
      setBar("sub"); showView("history"); renderHistory();
    } else if (WIZARD[view]) {
      ok = renderWizard(view, r.arg);
      if (ok) { setBar("none"); showView("wizard"); }
    } else { ok = false; }

    if (!ok) { location.replace("#/home"); return; }
    if (titles[view]) document.title = titles[view];
    window.scrollTo(0, 0);
    $("#view").focus({ preventScroll: true });
  }

  /* 7. CAROUSEL ----------------------------------------------- */
  function initCarousel() {
    var track = $("#carouselTrack"), slides = $$(".carousel__slide", track), dotsWrap = $("#carouselDots");
    var index = 0, timer = null, startX = null;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.type = "button"; d.className = "carousel__dot"; d.setAttribute("aria-label", "Show photo " + (i + 1));
      d.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = $$(".carousel__dot", dotsWrap);
    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dots.forEach(function (d, n) { d.classList.toggle("is-active", n === index); });
    }
    function stop() { clearInterval(timer); timer = null; }
    function start() { stop(); if (!reduce && slides.length > 1) timer = setInterval(function () { go(index + 1); }, 4500); }
    function restart() { start(); }
    var el = $("#carousel");
    el.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; stop(); }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (startX !== null) { var dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1)); }
      startX = null; start();
    });
    el.addEventListener("mouseenter", stop);
    el.addEventListener("mouseleave", start);
    go(0);
    return { start: start, stop: stop };
  }

  /* 8. DRAWER / BELL / FAB / SEARCH ------------------------------ */
  var drawer = $("#drawer"), scrim = $("#scrim");
  function openDrawer() {
    drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false;
    $("#drawerClose").focus();
  }
  function closeDrawer(silent) {
    if (!drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true"); scrim.hidden = true;
    if (!silent) leftBtn.focus();
  }

  function bindGlobal() {
    leftBtn.addEventListener("click", function () {
      if (appbar.getAttribute("data-mode") === "home") openDrawer();
      else if (window.history.length > 1) window.history.back();
      else location.hash = "#/home";
    });
    $("#drawerClose").addEventListener("click", function () { closeDrawer(); });
    scrim.addEventListener("click", function () { closeDrawer(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

    $("#bellBtn").addEventListener("click", function () {
      var pending = history.filter(function (h) { return h.status === "PENDING"; }).length;
      toast(pending ? pending + " enrollment" + (pending > 1 ? "s are" : " is") + " pending payment." : "No new notifications.");
    });
    $("#fab").addEventListener("click", function () { toast("Support chat is a demo feature."); });

    $("#homeSearch").addEventListener("submit", function (e) {
      e.preventDefault();
      var q = $("#homeSearchInput").value.trim();
      location.hash = "#/courses" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
    $("#courseSearch").addEventListener("input", function () { courseFilter.q = this.value; renderCourses(); });
    $("#centerSearch").addEventListener("input", renderCenters);

    // Delegated clicks: category tiles and Enroll buttons
    $("#view").addEventListener("click", function (e) {
      var cat = e.target.closest("[data-cat]");
      if (cat) { location.hash = "#/courses?cat=" + encodeURIComponent(cat.getAttribute("data-cat")); return; }
      var enroll = e.target.closest("[data-enroll]");
      if (enroll) location.hash = "#/register/" + enroll.getAttribute("data-enroll");
    });
  }

  /* 9. INIT ---------------------------------------------------- */
  carousel = initCarousel();
  bindWizard();
  bindGlobal();
  window.addEventListener("hashchange", route);
  if (!location.hash) location.replace("#/home"); else route();
})();
