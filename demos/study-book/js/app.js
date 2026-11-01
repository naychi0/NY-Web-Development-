/* Study Book reader – vanilla JS */
(function () {
  "use strict";
  var B = window.BOOK, $ = function (s, c) { return (c || document).querySelector(s); }, $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var content = $("#content"), sidebar = $("#sidebar"), scrim = $("#scrim"), menuBtn = $("#menuBtn");

  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  var done = store("sb_done") || {}, answers = store("sb_answers") || {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmt(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<u>$1</u>"); }
  function secById(n) { return B.sections.filter(function (s) { return s.n === n; })[0]; }
  function plain(html) { return String(html).replace(/<[^>]+>/g, " "); }

  /* ---------- sidebar ---------- */
  function renderNav(active) {
    var html = "";
    B.parts.forEach(function (p) {
      html += "<h2>" + p.name + "</h2>";
      if (p.id === "C") {
        B.papers.forEach(function (pp) { html += '<button class="navlink" data-go="paper-' + pp.id + '"' + (active === "paper-" + pp.id ? ' aria-current="page"' : "") + '><span class="navlink__n"><b>' + pp.id + '</b></span>' + esc(pp.title.split(" – ")[0] + " – " + pp.title.split(" – ")[1].replace("Third Year ", "")) + "</button>"; });
      } else {
        B.sections.filter(function (s) { return s.part === p.id; }).forEach(function (s) {
          html += '<button class="navlink' + (done[s.n] ? " is-done" : "") + '" data-go="s' + s.n + '"' + (active === "s" + s.n ? ' aria-current="page"' : "") + '><span class="navlink__n"><b>' + s.n + "</b></span>" + esc(s.title) + "</button>";
        });
      }
    });
    sidebar.innerHTML = html;
    var cnt = Object.keys(done).filter(function (k) { return done[k]; }).length;
    $("#progressText").textContent = cnt + " / " + B.sections.length + " studied";
    $("#progressBar").style.width = (cnt / B.sections.length * 100) + "%";
  }
  sidebar.addEventListener("click", function (e) { var b = e.target.closest("[data-go]"); if (b) { location.hash = b.dataset.go; closeMenu(); } });
  function openMenu() { sidebar.classList.add("is-open"); scrim.hidden = false; menuBtn.setAttribute("aria-expanded", "true"); }
  function closeMenu() { sidebar.classList.remove("is-open"); scrim.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () { sidebar.classList.contains("is-open") ? closeMenu() : openMenu(); });
  scrim.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- blocks ---------- */
  function block(b) {
    if (b.type === "rules") return '<div class="block"><ul class="rules">' + b.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul></div>";
    if (b.type === "examples") return '<div class="block"><h3>Examples</h3><ul class="ex">' + b.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul></div>";
    if (b.type === "defs") return '<div class="block"><ul class="defs">' + b.items.map(function (i) { return "<li><b>" + esc(i[0]) + "</b><span>" + esc(i[1]) + "</span></li>"; }).join("") + "</ul></div>";
    if (b.type === "note") return '<div class="block"><p class="note">' + b.html + "</p></div>";
    if (b.type === "cols") return '<div class="block"><div class="cols">' + b.cols.map(function (c) { return "<div><h4>" + esc(c.h) + '</h4><ul class="rules">' + c.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul></div>"; }).join("") + "</div></div>";
    if (b.type === "pills") return '<div class="block"><h3>' + esc(b.h) + '</h3><div class="pills">' + b.items.map(function (i) { return "<span>" + esc(i) + "</span>"; }).join("") + "</div></div>";
    if (b.type === "abbr") {
      return '<div class="block"><div class="tools"><button class="btn" type="button" id="viewToggle">Switch to flashcards</button><button class="btn btn--ghost" type="button" id="shuffle" hidden>Shuffle cards</button></div>' +
        '<ul class="defs" id="abbrList">' + b.items.map(function (i) { return "<li><b>" + esc(i[0]) + "</b><span>" + esc(i[1]) + "</span></li>"; }).join("") + "</ul>" +
        '<div class="cards" id="abbrCards" hidden>' + b.items.map(function (i) { return '<button type="button" class="flip" aria-label="Flip card"><span class="flip__in"><span class="flip__f">' + esc(i[0]) + '</span><span class="flip__b">' + esc(i[1]) + "</span></span></button>"; }).join("") + "</div></div>";
    }
    return "";
  }
  function bindAbbr() {
    var t = $("#viewToggle"); if (!t) return;
    var list = $("#abbrList"), cards = $("#abbrCards"), sh = $("#shuffle");
    t.addEventListener("click", function () {
      var cardView = cards.hidden; cards.hidden = !cardView; list.hidden = cardView; sh.hidden = !cardView;
      t.textContent = cardView ? "Switch to list" : "Switch to flashcards";
    });
    cards.addEventListener("click", function (e) { var f = e.target.closest(".flip"); if (f) f.classList.toggle("is-on"); });
    sh.addEventListener("click", function () {
      var items = $$(".flip", cards); items.sort(function () { return Math.random() - .5; });
      items.forEach(function (f) { f.classList.remove("is-on"); cards.appendChild(f); });
    });
  }

  /* ---------- section / paper views ---------- */
  function practice(s) {
    var ex = s.exercise; if (!ex) return "";
    var got = ex.items.filter(function (_, i) { return answers[s.n + "-" + i]; }).length;
    return '<div class="block"><h3>' + esc(ex.title) + '</h3><p class="lead" style="margin-bottom:8px">' + esc(ex.instruction) + '</p><ol class="practice">' +
      ex.items.map(function (it, i) { return '<li><p><b>' + (i + 1) + '.</b> ' + fmt(it) + '</p><input type="text" data-k="' + s.n + "-" + i + '" aria-label="Your answer to question ' + (i + 1) + '" placeholder="Type your answer…" value="' + esc(answers[s.n + "-" + i] || "") + '"></li>'; }).join("") +
      '</ol><div class="practice__meta"><span id="ansCount">' + got + " / " + ex.items.length + ' answered</span><span>Answers are saved on this device only. Sample items – the full exercise is in the printed book.</span></div></div>';
  }
  function showSection(n) {
    var s = secById(n), part = B.parts.filter(function (p) { return p.id === s.part; })[0];
    var prev = secById(n - 1), next = secById(n + 1);
    content.innerHTML = '<p class="crumb">' + esc(part.name) + "</p><h2>" + n + ". " + esc(s.title) + '</h2><p class="lead">' + esc(s.lead) + "</p>" +
      s.blocks.map(block).join("") + practice(s) +
      '<div class="pager"><div>' + (prev ? '<button class="btn btn--ghost" data-go="s' + prev.n + '">&larr; ' + esc(prev.title) + "</button>" : "") + '</div>' +
      '<button class="btn ' + (done[n] ? "btn--ok" : "") + '" id="doneBtn" type="button">' + (done[n] ? "✓ Studied – undo" : "Mark as studied") + "</button>" +
      '<div>' + (next ? '<button class="btn btn--ghost" data-go="s' + next.n + '">' + esc(next.title) + " &rarr;</button>" : '<button class="btn btn--ghost" data-go="paper-A">Past papers &rarr;</button>') + "</div></div>";
    bindAbbr();
    $("#doneBtn").addEventListener("click", function () { done[n] = !done[n]; store("sb_done", done); renderNav("s" + n); showSection(n); });
    $$("[data-k]", content).forEach(function (inp) {
      inp.addEventListener("input", function () {
        answers[inp.dataset.k] = inp.value; store("sb_answers", answers);
        var c = $("#ansCount"); if (c) c.textContent = s.exercise.items.filter(function (_, i) { return answers[n + "-" + i]; }).length + " / " + s.exercise.items.length + " answered";
      });
    });
    $$("[data-go]", content).forEach(function (b) { b.addEventListener("click", function () { location.hash = b.dataset.go; }); });
  }
  function showPaper(id) {
    var p = B.papers.filter(function (x) { return x.id === id; })[0];
    content.innerHTML = '<p class="crumb">Part C – Past Exam Papers</p><h2>' + esc(p.title) + '</h2><p class="lead">' + esc(p.meta) + '</p><div class="block paper"><h3>Question outline</h3><ul class="rules">' +
      p.questions.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ul>" + (p.note ? '<p class="note" style="margin-top:14px">' + esc(p.note) + "</p>" : "") + "</div>" +
      '<div class="pager"><div>' + B.papers.filter(function (x) { return x.id !== id; }).map(function (x) { return '<button class="btn btn--ghost" data-go="paper-' + x.id + '" style="margin-right:8px">Paper ' + x.id + "</button>"; }).join("") + '</div><button class="btn btn--ghost" data-go="s1">Back to Part A</button></div>';
    $$("[data-go]", content).forEach(function (b) { b.addEventListener("click", function () { location.hash = b.dataset.go; }); });
  }

  /* ---------- search ---------- */
  var index = B.sections.map(function (s) {
    var txt = [s.title, s.lead];
    s.blocks.forEach(function (b) { (b.items || []).forEach(function (i) { txt.push(Array.isArray(i) ? i.join(" ") : plain(i)); }); (b.cols || []).forEach(function (c) { txt.push(c.items.join(" ")); }); if (b.html) txt.push(plain(b.html)); });
    if (s.exercise) txt.push(s.exercise.instruction, s.exercise.items.join(" "));
    return { n: s.n, title: s.title, text: txt.join(" ").replace(/\*\*/g, "") };
  });
  function runSearch(q) {
    q = q.trim().toLowerCase();
    if (q.length < 2) { route(); return; }
    var hits = index.filter(function (s) { return s.text.toLowerCase().indexOf(q) !== -1; });
    var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    content.innerHTML = '<p class="crumb">Search</p><h2>' + hits.length + " result" + (hits.length === 1 ? "" : "s") + " for “" + esc(q) + "”</h2>" +
      '<div class="block"><ul class="results">' + (hits.length ? hits.map(function (s) {
        var i = s.text.toLowerCase().indexOf(q), snip = s.text.slice(Math.max(0, i - 50), i + 90).replace(/\s+/g, " ");
        return '<li><button type="button" data-go="s' + s.n + '"><b>' + s.n + ". " + esc(s.title) + "</b><span>…" + esc(snip).replace(re, "<mark>$1</mark>") + "…</span></button></li>";
      }).join("") : "<li>No matches. Try another word.</li>") + "</ul></div>";
    $$("[data-go]", content).forEach(function (b) { b.addEventListener("click", function () { $("#search").value = ""; location.hash = b.dataset.go; }); });
  }
  $("#search").addEventListener("input", function (e) { runSearch(e.target.value); });

  /* ---------- router ---------- */
  function route() {
    var h = (location.hash || "#s1").slice(1), m;
    if ((m = /^s(\d+)$/.exec(h)) && secById(+m[1])) { renderNav(h); showSection(+m[1]); }
    else if ((m = /^paper-([ABC])$/.exec(h))) { renderNav(h); showPaper(m[1]); }
    else { renderNav("s1"); showSection(1); }
    window.scrollTo({ top: 0 });
  }
  window.addEventListener("hashchange", function () { $("#search").value = ""; route(); });
  route();
})();
