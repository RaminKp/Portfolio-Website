(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById("themeBtn");
  var darkQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t === "dark") return true;
    if (t === "light") return false;
    return !!(darkQuery && darkQuery.matches);
  }

  function syncTheme() {
    var dark = isDark();
    root.classList.toggle("is-dark", dark);
    if (themeBtn) themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0e1512" : "#f3f6f4");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncTheme();
    });
  }
  if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener("change", syncTheme);
  new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  syncTheme();

  /* ---------- Nav border on scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Real ArUco markers (DICT_4X4_50), drawn black on white ---------- */
  var ARUCO = {
    3: "1001100101000110",
    7: "1100010011110010",
    12: "0000111010110111",
    21: "1011000000101011",
    25: "1001010001110001",
    42: "0011001010001100"
  };
  var SVG_NS = "http://www.w3.org/2000/svg";
  function rect(x, y, w, h, fill) {
    var r = document.createElementNS(SVG_NS, "rect");
    r.setAttribute("x", x); r.setAttribute("y", y);
    r.setAttribute("width", w); r.setAttribute("height", h);
    r.setAttribute("style", "fill: var(" + fill + ")");
    r.setAttribute("shape-rendering", "crispEdges");
    return r;
  }
  document.querySelectorAll(".aruco[data-id]").forEach(function (el) {
    var id = el.getAttribute("data-id");
    var bits = ARUCO[id];
    if (!bits) return;
    el.appendChild(rect(0, 0, 8, 8, "--marker-bg"));   // quiet zone
    el.appendChild(rect(1, 1, 6, 6, "--marker-ink"));  // black border
    for (var i = 0; i < 16; i++) {
      if (bits[i] === "1") el.appendChild(rect(2 + (i % 4), 2 + Math.floor(i / 4), 1, 1, "--marker-bg"));
    }
    var t = document.createElementNS(SVG_NS, "title");
    t.textContent = "ArUco marker #" + id + ". It's real: a robot camera can read it.";
    el.insertBefore(t, el.firstChild);
  });

  /* ---------- Sound-wave bars for the speech illustration ---------- */
  var wave = document.getElementById("wave");
  if (wave) {
    var heights = [18, 30, 46, 62, 40, 24, 54, 80, 96, 70, 44, 28, 58, 88, 74, 50, 34, 20, 42, 66, 92, 78, 52, 36, 22, 48, 72, 60, 38, 26, 44, 30, 18, 12];
    heights.forEach(function (h) {
      var i = document.createElement("i");
      i.style.height = h + "%";
      wave.appendChild(i);
    });
  }

  /* ---------- The house robot ---------- */
  var svg = document.getElementById("botSvg");
  var eyes = document.getElementById("eyes");
  var botBtn = document.getElementById("botBtn");
  var bubble = document.getElementById("bubble");

  var lines = [
    ["happy", "Hi! I'm the house robot. Poke me again."],
    ["wow", "Ramin's robots have played learning games with 200+ kids."],
    ["wink", "They run fully offline. No cloud, no Wi-Fi, no problem."],
    ["idle", "See the black-and-white squares on this page? Real ArUco markers. Robots read them."],
    ["happy", "Kids aged 6 to 12 are the toughest testers there are."],
    ["wink", "Scroll down. The papers are better than my jokes."]
  ];
  var step = 0;

  if (botBtn && svg && bubble) {
    botBtn.addEventListener("click", function () {
      var line = lines[step % lines.length];
      step++;
      svg.setAttribute("data-mood", line[0]);
      bubble.textContent = line[1];
      if (!reduceMotion) {
        bubble.classList.remove("pop");
        void bubble.offsetWidth;
        bubble.classList.add("pop");
      }
    });
  }

  // Eyes follow the pointer
  if (svg && eyes && !reduceMotion) {
    var target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, raf = null;
    function tick() {
      cur.x += (target.x - cur.x) * 0.18;
      cur.y += (target.y - cur.y) * 0.18;
      eyes.setAttribute("transform", "translate(" + cur.x.toFixed(2) + " " + cur.y.toFixed(2) + ")");
      if (Math.abs(target.x - cur.x) > 0.05 || Math.abs(target.y - cur.y) > 0.05) raf = requestAnimationFrame(tick);
      else raf = null;
    }
    window.addEventListener("pointermove", function (e) {
      var r = svg.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height * 0.4;
      var dx = e.clientX - cx, dy = e.clientY - cy;
      var d = Math.max(1, Math.hypot(dx, dy));
      var k = Math.min(1, d / 260);
      target.x = (dx / d) * 20 * k;
      target.y = (dy / d) * 12 * k;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    // Blink now and then
    (function blinkLoop() {
      setTimeout(function () {
        svg.classList.add("blink");
        setTimeout(function () { svg.classList.remove("blink"); blinkLoop(); }, 130);
      }, 2400 + Math.random() * 3200);
    })();
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById("copyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = "r.kupaei@gmail.com";
      function done(msg) {
        copyBtn.textContent = msg;
        setTimeout(function () { copyBtn.textContent = "Copy"; }, 1800);
      }
      function fallback() {
        var a = document.querySelector(".email");
        if (a && window.getSelection) {
          var range = document.createRange();
          range.selectNodeContents(a);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          done("Selected");
        }
      }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(function () { done("Copied"); }, fallback);
        } else {
          fallback();
        }
      } catch (e) {
        fallback();
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
