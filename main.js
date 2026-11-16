(function () {
  "use strict";
  var F = window.FAN;
  if (!F) return;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var hasG = !!(window.gsap && window.ScrollTrigger);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var pad2 = function (n) { return String(n).padStart(2, "0"); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  if (hasG) gsap.registerPlugin(ScrollTrigger);

  /* ---------------- build content ---------------- */
  var list = $("#reelList");
  list.innerHTML = F.reels.map(function (r, i) {
    return '<li class="row"><button type="button" data-i="' + i + '" data-cursor="play" aria-label="Play ' + esc(r.cap) + '">' +
      '<span class="n">' + pad2(i + 1) + '</span>' +
      '<span class="t">' + esc(r.cap) + '</span>' +
      '<span class="s">' + esc(r.sub) + '</span>' +
      '<span class="th"><img src="' + r.poster + '" alt="" loading="lazy" decoding="async"></span>' +
      '<span class="ar">↗</span></button></li>';
  }).join("");

  var track = $("#framesTrack");
  var frameIdx = [0, 3, 5, 6, 1, 12, 10, 4, 14, 18, 8, 22, 26, 20, 27, 9];
  frameIdx.forEach(function (pi, k) {
    var p = F.photos[pi];
    var fig = document.createElement("figure");
    fig.className = "fr";
    fig.style.setProperty("--ar", p.ar);
    fig.innerHTML = '<div class="fr-box"><img src="' + p.src + '" alt="Hania Aamir edit ' + pad2(k + 1) + '" decoding="async"' + (k > 4 ? ' loading="lazy"' : "") + '></div>' +
      '<figcaption><b>' + pad2(k + 1) + '</b><span>Frame</span></figcaption>';
    track.appendChild(fig);
  });

  var q = F.quotes;
  var wordsTxt = [q[1], q[0], q[7]].join(" ");
  var hl = /^(grace|beauty|poets|remembered)/i;
  $("#wordsText").innerHTML = wordsTxt.split(/\s+/).map(function (w) {
    return '<span class="w' + (hl.test(w) ? " hl" : "") + '">' + esc(w) + "</span>";
  }).join(" ");

  var stackQ = [q[3], q[2], q[4], q[5], q[6]];
  $("#stackList").innerHTML = stackQ.map(function (text, i) {
    var p = F.photos.filter(function (x) { return x.id === F.heroPicks[i]; })[0] || F.photos[i];
    return '<article class="sc" style="--i:' + i + '"><div class="sc-txt"><span class="sc-n">' + pad2(i + 1) + '</span>' +
      '<p class="sc-q">“' + esc(text) + '”</p><span class="sc-f">Hania Heartbeat — fan note</span></div>' +
      '<div class="sc-img"><img src="' + p.src + '" alt="" loading="lazy" decoding="async"></div></article>';
  }).join("");

  var grid = $("#wallGrid");
  grid.innerHTML = F.reels.map(function (r, i) {
    return '<button type="button" class="tile" style="--ar:' + r.ar + '" data-i="' + i + '" data-cursor="play" aria-label="Watch ' + esc(r.cap) + '">' +
      '<video src="' + r.src + '" poster="' + r.poster + '" muted loop playsinline preload="none"></video>' +
      '<span><b>' + esc(r.cap) + '</b></span></button>';
  }).join("");

  /* ---------------- hero split letters ---------------- */
  $$("[data-split]").forEach(function (el) {
    var t = el.textContent;
    el.innerHTML = t.split("").map(function (c) { return '<span class="ch">' + c + "</span>"; }).join("");
  });
  $$("[data-foot]").forEach(function (el) {
    var t = el.textContent;
    el.innerHTML = t.split("").map(function (c) { return '<span class="ch">' + (c === " " ? "&nbsp;" : c) + "</span>"; }).join("");
  });

  /* ---------------- smooth scroll ---------------- */
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    if (hasG) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }
  function scrollToEl(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.4, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  /* ---------------- menu ---------------- */
  var menu = $("#menu"), menuBtn = $("#menuBtn");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.firstElementChild.textContent = open ? "Close" : "Menu";
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  menuBtn.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  $$("[data-nav]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      var t = id === "#top" ? document.body : $(id);
      if (!t) return;
      e.preventDefault();
      var wasOpen = menu.classList.contains("open");
      if (wasOpen) setMenu(false);
      setTimeout(function () { id === "#top" ? (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" })) : scrollToEl(t); }, wasOpen ? 120 : 0);
    });
  });

  /* ---------------- timecode ---------------- */
  var tc = $("#tc"), t0 = performance.now();
  setInterval(function () {
    var s = (performance.now() - t0) / 1000;
    tc.textContent = [Math.floor(s / 3600), Math.floor(s / 60) % 60, Math.floor(s) % 60, Math.floor((s % 1) * 24)].map(pad2).join(":");
  }, 80);

  /* ---------------- hero video play/pause ---------------- */
  var heroVid = $("#heroVid");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { var p = heroVid.play(); if (p && p.catch) p.catch(function () {}); } else heroVid.pause();
      });
    }, { threshold: 0.05 }).observe(heroVid);
  }

  /* ---------------- player modal ---------------- */
  var modal = $("#modal"), mVid = $("#mVid"), cur = 0, lastFocus = null;
  function load(i) {
    cur = (i + F.reels.length) % F.reels.length;
    var r = F.reels[cur];
    mVid.style.setProperty("--ar", r.ar);
    mVid.poster = r.poster;
    mVid.src = r.src;
    mVid.muted = false;
    var p = mVid.play();
    if (p && p.catch) p.catch(function () { mVid.muted = true; mVid.play().catch(function () {}); });
    $("#mTitle").textContent = r.cap;
    $("#mSub").textContent = r.sub;
    $("#mCount").textContent = pad2(cur + 1) + " / " + pad2(F.reels.length);
  }
  function openModal(i) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    load(i);
    requestAnimationFrame(function () { modal.classList.add("open"); });
    if (lenis) lenis.stop(); else document.body.style.overflow = "hidden";
    hidePeek();
    $(".m-x").focus({ preventScroll: true });
  }
  function closeModal() {
    modal.classList.remove("open");
    mVid.pause();
    setTimeout(function () { if (!modal.classList.contains("open")) { mVid.removeAttribute("src"); mVid.load(); } }, 450);
    if (lenis) lenis.start(); else document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $$("[data-close]", modal).forEach(function (b) { b.addEventListener("click", closeModal); });
  $("#mPrev").addEventListener("click", function () { load(cur - 1); });
  $("#mNext").addEventListener("click", function () { load(cur + 1); });
  mVid.addEventListener("ended", function () { load(cur + 1); });
  window.addEventListener("keydown", function (e) {
    if (modal.classList.contains("open")) {
      if (e.key === "Escape") closeModal();
      else if (e.key === "ArrowRight") load(cur + 1);
      else if (e.key === "ArrowLeft") load(cur - 1);
    } else if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-i]");
    if (b) openModal(+b.getAttribute("data-i"));
  });

  /* ---------------- hover preview card ---------------- */
  var peek = $("#peek"), peekVid = $("#peekVid");
  var mx = innerWidth / 2, my = innerHeight / 2, px = mx, py = my, peekOn = false, peekRaf = 0, lastIdx = -1, rot = 0;
  function peekLoop() {
    px += (mx - px) * 0.14; py += (my - py) * 0.14;
    var dx = mx - px;
    rot += (Math.max(-9, Math.min(9, dx * 0.08)) - rot) * 0.15;
    var w = peek.offsetWidth, h = peek.offsetHeight;
    var x = Math.min(px + 28, innerWidth - w - 12), y = Math.max(12, Math.min(py - h / 2, innerHeight - h - 12));
    peek.style.transform = "translate3d(" + x + "px," + y + "px,0) rotate(" + rot + "deg)";
    peekRaf = peekOn ? requestAnimationFrame(peekLoop) : 0;
  }
  function showPeek(i) {
    var r = F.reels[i];
    var w = r.ar > 1 ? 300 : 230;
    peek.style.width = w + "px";
    peek.style.height = Math.min(360, w / r.ar) + "px";
    if (lastIdx !== i) {
      peekVid.poster = r.poster;
      peekVid.src = r.src;
      lastIdx = i;
    }
    var p = peekVid.play(); if (p && p.catch) p.catch(function () {});
    peek.classList.add("on");
    if (!peekOn) { peekOn = true; peekRaf = requestAnimationFrame(peekLoop); }
  }
  function hidePeek() {
    peek.classList.remove("on");
    peekOn = false;
    peekVid.pause();
  }
  if (fine) {
    list.addEventListener("mouseover", function (e) {
      var b = e.target.closest("[data-i]");
      if (b) showPeek(+b.getAttribute("data-i"));
    });
    list.addEventListener("mouseleave", hidePeek);
    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    window.addEventListener("scroll", function () { if (peekOn) { /* keep following */ } }, { passive: true });
  }

  /* ---------------- custom cursor ---------------- */
  if (fine) {
    var curEl = $("#cursor"), dot = $(".c-dot"), ring = $(".c-ring");
    var cx = innerWidth / 2, cy = innerHeight / 2, rx = cx, ry = cy;
    document.body.classList.add("has-cursor");
    window.addEventListener("mousemove", function (e) { cx = e.clientX; cy = e.clientY; }, { passive: true });
    (function loop() {
      rx += (cx - rx) * 0.2; ry += (cy - ry) * 0.2;
      dot.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", function (e) {
      var t = e.target;
      document.body.classList.toggle("cur-play", !!t.closest("[data-cursor='play']"));
      document.body.classList.toggle("cur-link", !t.closest("[data-cursor='play']") && !!t.closest("a,button,video"));
    });
    document.documentElement.addEventListener("mouseleave", function () { curEl.style.opacity = 0; });
    document.documentElement.addEventListener("mouseenter", function () { curEl.style.opacity = 1; });
  }

  /* ---------------- reel wall (max 3 playing) ---------------- */
  var playing = [];
  function playTile(v) {
    if (playing.indexOf(v) !== -1) return;
    playing.push(v);
    while (playing.length > 3) playing.shift().pause();
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  function stopTile(v) {
    v.pause();
    var k = playing.indexOf(v);
    if (k !== -1) playing.splice(k, 1);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { e.isIntersecting ? playTile(e.target) : stopTile(e.target); });
    }, { threshold: 0.55 });
    $$("video", grid).forEach(function (v) { io.observe(v); });
  }

  /* ---------------- intro + scroll animations ---------------- */
  var pre = $("#pre"), preNum = $("#preNum"), ecg = $("#ecgLine");

  function finishNoMotion() {
    pre.style.display = "none";
    document.body.classList.remove("is-loading");
  }

  function setupScroll() {
    // sections: heading reveals
    $$(".sec-head h2, .frames-intro h2").forEach(function (h) {
      gsap.from(h, { yPercent: 40, opacity: 0, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: h, start: "top 88%" } });
    });
    $$(".sec-head .kicker, .sec-head .sec-note").forEach(function (h) {
      gsap.from(h, { y: 20, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: h, start: "top 92%" } });
    });
    gsap.from(".row", { opacity: 0, y: 40, duration: 0.9, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: "#reelList", start: "top 85%" } });

    // frames: pinned horizontal scroll
    var pin = $("#framesPin");
    var mm = gsap.matchMedia();
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var tween = gsap.to(track, {
      x: function () { return -dist(); }, ease: "none",
      scrollTrigger: { trigger: pin, start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    $$(".fr").forEach(function (fr) {
      var img = $("img", fr), box = $(".fr-box", fr);
      gsap.fromTo(img, { xPercent: -5 }, { xPercent: 5, ease: "none", scrollTrigger: { trigger: fr, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      gsap.fromTo(box, { clipPath: "inset(12% 8% 12% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: fr, containerAnimation: tween, start: "left 100%", end: "left 62%", scrub: true } });
    });

    // words: scrubbed opacity
    gsap.to(".words-text .w", { opacity: 1, ease: "none", stagger: 0.12, scrollTrigger: { trigger: ".words-text", start: "top 78%", end: "bottom 45%", scrub: true } });

    // stack
    var cards = $$(".sc");
    cards.forEach(function (c, i) {
      if (i === cards.length - 1) return;
      gsap.to(c, { scale: 0.93, filter: "brightness(.45)", ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top 85%", end: "top 18%", scrub: true } });
    });
    cards.forEach(function (c) {
      var im = $("img", c);
      gsap.fromTo(im, { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "top 20%", scrub: true } });
    });

    // wall tiles
    $$(".tile").forEach(function (t) {
      gsap.from(t, { y: 70, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: t, start: "top 94%" } });
    });

    // footer
    gsap.from(".foot-word .ch", { yPercent: 105, duration: 1.1, ease: "power4.out", stagger: 0.025, scrollTrigger: { trigger: ".foot-word", start: "top 92%" } });
    gsap.from(".foot-cta > *", { y: 40, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: ".foot-cta", start: "top 80%" } });

    // hero parallax out
    gsap.to(".hero-vid", { yPercent: 14, scale: 1.08, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-in", { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "70% top", scrub: true } });
  }

  function intro() {
    var tl = gsap.timeline({ onComplete: function () { document.body.classList.remove("is-loading"); pre.style.display = "none"; ScrollTrigger.refresh(); } });
    tl.to(pre, { yPercent: -100, duration: 1.1, ease: "power4.inOut" })
      .from(".hero-vid", { scale: 1.25, duration: 2.2, ease: "power3.out" }, "<0.1")
      .from(".hero-title .ch", { yPercent: 115, rotate: 6, duration: 1.2, ease: "power4.out", stagger: 0.04 }, "<0.35")
      .from("[data-hero]", { y: 20, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12 }, "<0.3")
      .from(".nav", { y: -30, opacity: 0, duration: 0.9, ease: "power3.out" }, "<");
  }

  function runLoader() {
    var o = { v: 0 };
    var done = false;
    var dur = reduce ? 0.01 : 2.3;
    function update() {
      var n = Math.round(o.v);
      preNum.textContent = n;
      ecg.style.strokeDashoffset = String(1 - o.v / 100);
    }
    gsap.to(o, { v: 100, duration: dur, ease: "power2.inOut", onUpdate: update, onComplete: function () {
      if (done) return; done = true;
      update();
      window.scrollTo(0, 0);
      intro();
    } });
  }

  window.addEventListener("load", function () { if (hasG) ScrollTrigger.refresh(); });

  if (hasG && !reduce) {
    setupScroll();
    ScrollTrigger.addEventListener("refresh", function () {});
    runLoader();
  } else {
    // graceful fallback: no GSAP (CDN blocked) or reduced motion
    finishNoMotion();
    if (!hasG || reduce) {
      $(".frames").classList.add("no-pin");
      $$(".words-text .w").forEach(function (w) { w.style.opacity = 1; });
    }
  }
})();
