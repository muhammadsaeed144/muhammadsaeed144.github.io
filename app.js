(function () {
  'use strict';
  var P = window.PORTFOLIO, T = window.TIMELINE, SOC = window.SOCIAL || {}, CL = window.CLIENTS || [], BR = window.BRANDS || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var pad2 = function (n) { return String(n).padStart(2, '0'); };
  var img = function (n) { return 'assets/img/' + n + '.jpg'; };
  var filmCount = function (p) { return p.films.length + (p.films.length === 1 ? ' film' : ' films'); };
  var root = document.documentElement;

  /* ---------- Icons (line icons, 24px grid) ---------- */
  var ICONS = {
    pen: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
    clap: '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v4M8 22h8"/>',
    spark: '<path d="M12 3l1.9 5.6 5.6 1.9-5.6 1.9L12 18l-1.9-5.6-5.6-1.9 5.6-1.9z"/><path d="M19 3v4M17 5h4M5 17v3M3.5 18.5h3"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    cam: '<path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    whatsapp: '<path d="M3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 8 19.3z"/><path class="f" d="M9.1 7.6c.2-.4.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2.1.4 0 .6l-.4.6c-.1.2-.2.3 0 .6.4.7 1 1.4 1.7 1.9.5.4 1 .6 1.3.7.2.1.4 0 .5-.1l.6-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.2.4.4 0 .6-.3 1.4-1 1.7-.6.3-1.4.4-2.4.1-1.2-.4-2.4-1.1-3.6-2.3-1-1-1.8-2.3-2-3.3-.2-1 .1-1.7.4-2z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    youtube: '<path d="M22.5 6.4a2.8 2.8 0 0 0-1.9-2C18.9 4 12 4 12 4s-6.9 0-8.6.4a2.8 2.8 0 0 0-1.9 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.6 2.8 2.8 0 0 0 1.9 2c1.7.4 8.6.4 8.6.4s6.9 0 8.6-.4a2.8 2.8 0 0 0 1.9-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.6z"/><path class="f" d="M9.8 15.3l5.7-3.3-5.7-3.3z"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>'
  };
  function icon(n) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[n] || '') + '</svg>'; }
  $$('[data-icon]').forEach(function (el) { el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon)); });

  /* Flat film list: each film's file name follows its project and position. */
  var ALL = [];
  P.forEach(function (p, pi) {
    p.index = pi;
    p.list = p.films.map(function (f, i) {
      var id = p.slug + '-' + pad2(i + 1);
      var film = { project: p, title: f[0], time: f[1], fmt: f[2], src: window.FILM_BASE + id + '.mp4', poster: img(id) };
      ALL.push(film);
      return film;
    });
  });

  /* ---------- Boot, timecode ---------- */
  var start = performance.now(), tc = $('#tc'), boot = $('.boot-count');
  function code(ms) {
    var f = Math.floor(ms / 40), s = Math.floor(f / 25), m = Math.floor(s / 60), h = Math.floor(m / 60);
    return pad2(h) + ':' + pad2(m % 60) + ':' + pad2(s % 60) + ':' + pad2(f % 25);
  }
  if (!reduced) setInterval(function () { tc.textContent = code(performance.now() - start); }, 80);
  setTimeout(function () { var b = $('.boot'); if (b) b.remove(); }, 3000);
  requestAnimationFrame(function () { setTimeout(function () { root.classList.add('ready'); }, 30); });
  if (boot) {
    var bt = setInterval(function () {
      var e = performance.now() - start;
      boot.textContent = code(e * 6);
      if (e > 1700) clearInterval(bt);
    }, 40);
  }

  /* ---------- Hero: floating icons for the core of the work ---------- */
  var FLOAT = [
    { t: 'Copywriting', i: 'pen', x: 6, y: 21, d: 1.2, c: '#ff5a4d', xm: 5, ym: 19 },
    { t: 'Storytelling', i: 'book', x: 20, y: 32, d: .7, c: '#ff3d8b', xm: 7, ym: 43 },
    { t: 'Filmmaking', i: 'clap', x: 35, y: 18, d: 1, c: '#a78bfa', xm: 82, ym: 17 },
    { t: 'Content strategy', i: 'target', x: 46, y: 31, d: .6, c: '#22d3ee' },
    { t: 'AI commercials', i: 'spark', x: 56, y: 15, d: .9, c: '#ffb020', xm: 84, ym: 40 },
    { t: 'Podcasts', i: 'mic', x: 85, y: 44, d: .8, c: '#ff3d8b', xm: 78, ym: 53 },
    { t: 'Directing', i: 'cam', x: 80, y: 73, d: 1.1, c: '#4ade80' }
  ];
  var floaters = $('#floaters');
  floaters.innerHTML = FLOAT.map(function (f, k) {
    var st = '--x:' + f.x + '%;--y:' + f.y + '%;--c:' + f.c + ';--k:' + k + (f.xm != null ? ';--xm:' + f.xm + '%;--ym:' + f.ym + '%' : '');
    return '<div class="fl" style="' + st + '" data-d="' + f.d + '"><div class="fl-in"><span class="fl-ic">' + icon(f.i) + '</span><span class="fl-t">' + f.t + '</span></div></div>';
  }).join('');
  var fls = $$('.fl', floaters);

  /* ---------- Hero: a light that follows the cursor ---------- */
  var hero = $('.hero'), lit = $('.hero-img.lit'), heroCopy = $('#heroCopy');
  var tx = 0.76, ty = 0.32, cx = tx, cy = ty, touched = false;
  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; touched = true;
  });
  hero.addEventListener('pointerleave', function () { touched = false; });

  var canvas = $('#dust'), ctx = canvas.getContext('2d'), specks = [], cw = 0, ch = 0;
  function size() {
    var d = Math.min(devicePixelRatio || 1, 2);
    cw = hero.clientWidth; ch = hero.clientHeight;
    canvas.width = cw * d; canvas.height = ch * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    var n = Math.min(110, Math.round(cw / 13));
    var tints = ['255,255,255', '255,255,255', '255,255,255', '255,255,255', '180,200,255'];
    specks = [];
    for (var i = 0; i < n; i++) specks.push({ x: Math.random() * cw, y: Math.random() * ch, r: 0.4 + Math.random() * 1.3, v: 0.05 + Math.random() * 0.22, p: Math.random() * 6.28, c: tints[i % tints.length] });
  }
  function frame(t) {
    if (!touched) {
      tx = 0.77 + Math.sin(t / 3400) * 0.05;
      ty = 0.31 + Math.cos(t / 2700) * 0.05;
    }
    cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
    lit.style.setProperty('--mx', (cx * 100).toFixed(2) + '%');
    lit.style.setProperty('--my', (cy * 100).toFixed(2) + '%');
    var sy = Math.min(scrollY, ch);
    for (var k = 0; k < fls.length; k++) {
      var d = +fls[k].dataset.d;
      fls[k].style.transform = 'translate3d(' + ((0.5 - cx) * 46 * d).toFixed(1) + 'px,' + ((0.4 - cy) * 34 * d - sy * 0.35 * d).toFixed(1) + 'px,0)';
    }
    ctx.clearRect(0, 0, cw, ch);
    var lx = cx * cw, ly = cy * ch;
    for (var i = 0; i < specks.length; i++) {
      var s = specks[i];
      s.y -= s.v; s.x += Math.sin(t / 1900 + s.p) * 0.12;
      if (s.y < -4) { s.y = ch + 4; s.x = Math.random() * cw; }
      var dist = Math.hypot(s.x - lx, s.y - ly), a = Math.max(0.05, 0.8 - dist / 430);
      ctx.fillStyle = 'rgba(' + s.c + ',' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.29); ctx.fill();
    }
    if (heroVisible) requestAnimationFrame(frame); else running = false;
  }
  var heroVisible = true, running = false;
  if (!reduced) {
    size();
    addEventListener('resize', size);
    new IntersectionObserver(function (e) {
      heroVisible = e[0].isIntersecting;
      if (heroVisible && !running) { running = true; requestAnimationFrame(frame); }
    }).observe(hero);
  }

  /* ---------- Smooth scrolling (Lenis), with plain smooth scrolling as the fallback ---------- */
  var lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new window.Lenis({ duration: 1.25, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true, gestureOrientation: 'vertical' });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
  }
  function scrollToTarget(el) {
    if (lenis) lenis.scrollTo(el === 'top' ? 0 : el, { duration: 1.6 });
    else if (el === 'top') scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var h = a.getAttribute('href');
    if (h.indexOf('#/') === 0 || h === '#') return;
    var el = h === '#top' ? 'top' : document.getElementById(h.slice(1));
    if (!el) return;
    e.preventDefault();
    scrollToTarget(el);
  });
  function lockScroll(on) {
    root.classList.toggle('locked', on);
    if (lenis) { if (on) lenis.stop(); else lenis.start(); }
  }

  /* ---------- Scroll: nav, progress bar, hero parallax, marquee speed ---------- */
  var nav = $('.nav'), bar = $('#progress'), lastY = scrollY, vel = 0, ticking = false;
  function onScroll() {
    ticking = false;
    var y = scrollY;
    nav.classList.toggle('solid', y > 60);
    var h = root.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0).toFixed(4) + ')';
    if (!reduced && y < innerHeight * 1.2) {
      heroCopy.style.transform = 'translate3d(0,' + (y * 0.28).toFixed(1) + 'px,0)';
      heroCopy.style.opacity = Math.max(0, 1 - y / (innerHeight * 0.85)).toFixed(3);
    }
    vel = Math.min(Math.abs(y - lastY), 120); lastY = y;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  function loop(track, html, dur, reverse) {
    track.innerHTML = html + html.replace(/<(figure|span)(?![^>]*aria-hidden)/g, '<$1 aria-hidden="true"');
    if (reduced) return null;
    var kf = [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(-50%,0,0)' }];
    return track.animate(reverse ? kf.reverse() : kf, { duration: dur, iterations: Infinity });
  }
  var SKILLS = ['Copywriting', 'Storytelling', 'Filmmaking', 'Creative direction', 'AI commercials', 'Podcasts', 'Content strategy', 'Scriptwriting'];
  var skillsAnim = loop($('#skills'), SKILLS.map(function (s) { return '<span>' + s + '<b>✦</b></span>'; }).join(''), 38000);
  var logosAnim = loop($('#logos'), CL.map(function (c) {
    return '<figure class="logo' + (c.invert ? ' inv' : '') + '"><img src="assets/clients/' + c.file + '" alt="' + esc(c.name) + '" loading="lazy" draggable="false"></figure>';
  }).join(''), 42000);
  var namesAnim = loop($('#names'), BR.map(function (b) { return '<span>' + esc(b) + '<b></b></span>'; }).join(''), 52000, true);
  [[$('.logos'), logosAnim], [$('.names'), namesAnim]].forEach(function (pair) {
    if (!pair[1]) return;
    pair[0].addEventListener('pointerenter', function () { pair[1].playbackRate = 0.15; });
    pair[0].addEventListener('pointerleave', function () { pair[1].playbackRate = 1; });
  });
  if (skillsAnim) setInterval(function () {
    var target = 1 + vel / 12;
    skillsAnim.playbackRate += (target - skillsAnim.playbackRate) * 0.25;
    vel *= 0.6;
  }, 60);

  /* ---------- Socials ---------- */
  var SOC_META = [['linkedin', 'LinkedIn', '#0a66c2'], ['instagram', 'Instagram', '#e1306c'], ['youtube', 'YouTube', '#ff0033'], ['facebook', 'Facebook', '#1877f2'], ['whatsapp', 'WhatsApp', '#25d366']];
  var socHTML = SOC_META.filter(function (s) { return SOC[s[0]]; }).map(function (s) {
    return '<a class="soc" style="--c:' + s[2] + '" href="' + esc(SOC[s[0]]) + '" target="_blank" rel="noopener" aria-label="' + s[1] + '">' + icon(s[0]) + '</a>';
  }).join('');
  $('#socials').innerHTML = socHTML;
  $('#footSocials').innerHTML = socHTML;

  /* ---------- Film strip ---------- */
  var strip = $('#strip');
  function tileHTML(copy) {
    return ALL.map(function (f, i) {
      return '<button type="button" class="tile ' + f.fmt + '" data-i="' + i + '" data-cursor="Play"' + (copy ? ' aria-hidden="true" tabindex="-1"' : '') + '>' +
        '<img src="' + f.poster + '" alt="" loading="lazy" draggable="false">' +
        '<span class="tile-t"><b>' + esc(f.title) + '</b><span>' + esc(f.project.client) + ' · ' + f.time + '</span></span></button>';
    }).join('');
  }
  strip.innerHTML = tileHTML(false) + (reduced ? '' : tileHTML(true));
  var sDragged = false, sDown = false, ssx = 0, ssl = 0;
  strip.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    sDown = true; sDragged = false; ssx = e.clientX; ssl = strip.scrollLeft;
  });
  addEventListener('pointermove', function (e) {
    if (!sDown) return;
    var dx = e.clientX - ssx;
    if (Math.abs(dx) > 6) { sDragged = true; strip.classList.add('drag'); }
    if (sDragged) strip.scrollLeft = ssl - dx;
  });
  addEventListener('pointerup', function () {
    sDown = false;
    setTimeout(function () { strip.classList.remove('drag'); }, 0);
  });
  strip.addEventListener('click', function (e) {
    var t = e.target.closest('.tile');
    if (!t || sDragged) return;
    openPlayer(ALL, +t.dataset.i, t);
  });
  /* The film row glides on its own; it pauses while hovered, touched or dragged, and loops seamlessly. */
  var stripTiles = $$('.tile', strip), stripPos = 0, stripHover = false, stripHold = 0, stripVisible = false, stripRunning = false, stripLast = 0;
  function stripHalf() { return stripTiles.length > ALL.length ? stripTiles[ALL.length].offsetLeft - stripTiles[0].offsetLeft : 0; }
  strip.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') stripHover = true; });
  strip.addEventListener('pointerleave', function () { stripHover = false; });
  strip.addEventListener('touchstart', function () { stripHold = performance.now() + 4000; }, { passive: true });
  strip.addEventListener('touchend', function () { stripHold = performance.now() + 2500; }, { passive: true });
  function stripTick(t) {
    var dt = stripLast ? Math.min(t - stripLast, 60) : 0; stripLast = t;
    var half = stripHalf();
    if (Math.abs(strip.scrollLeft - stripPos) > 2) stripPos = strip.scrollLeft;
    var hold = stripHover || sDown || t < stripHold || !box.hidden || !pl.hidden || document.hidden;
    if (!hold && half) {
      stripPos += dt * 0.05;
      if (stripPos >= half) stripPos -= half;
      strip.scrollLeft = stripPos;
    }
    if (stripVisible) requestAnimationFrame(stripTick); else { stripRunning = false; stripLast = 0; }
  }
  if (!reduced) {
    new IntersectionObserver(function (e) {
      stripVisible = e[0].isIntersecting;
      if (stripVisible && !stripRunning) { stripRunning = true; requestAnimationFrame(stripTick); }
    }).observe(strip);
  }
  function stepStrip(d) {
    stripHold = performance.now() + 1800;
    var half = stripHalf();
    if (half && d < 0 && strip.scrollLeft < strip.clientWidth) { strip.scrollLeft += half; stripPos = strip.scrollLeft; }
    strip.scrollBy({ left: d * strip.clientWidth * 0.7, behavior: reduced ? 'auto' : 'smooth' });
  }
  $('#stripPrev').onclick = function () { stepStrip(-1); };
  $('#stripNext').onclick = function () { stepStrip(1); };

  /* ---------- Experience: edit timeline ---------- */
  var nle = $('#nle'), Y0 = 2022, Y1 = 2027, NOW = 2026.85;
  var TRACK_C = ['#ff5a4d', '#22d3ee', '#a78bfa', '#ffb020', '#ff3d8b'];
  var pct = function (y) { return (y - Y0) / (Y1 - Y0) * 100; };
  var tracks = Math.max.apply(null, T.map(function (c) { return c.track; })) + 1;
  function clipHTML(c) {
    var w = pct(c.to) - pct(c.from), tag = c.link ? 'a' : 'div', ext = c.link && c.link.charAt(0) !== '#';
    var cls = 'clip' + (c.now ? ' now' : '') + (c.founder ? ' founder' : '') + (w < 14 ? ' narrow' : '');
    return '<' + tag + ' class="' + cls + '" data-from="' + c.from + '" style="--c:' + TRACK_C[c.track % TRACK_C.length] + ';left:calc(' + pct(c.from) + '% + 2px);width:calc(' + w + '% - 4px)"' +
      (c.link ? ' href="' + esc(c.link) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') : '') + '>' +
      (c.founder ? '<span class="badge">Founder</span>' : '') +
      '<div><b>' + esc(c.co) + '</b><small>' + esc(c.role) + '</small></div><time>' + esc(c.dates) + '</time></' + tag + '>';
  }
  var rows = '';
  for (var tr = 0; tr < tracks; tr++) rows += '<div class="nle-track">' + T.filter(function (c) { return c.track === tr; }).map(clipHTML).join('') + '</div>';
  var years = '';
  for (var y = Y0; y < Y1; y++) years += '<span style="left:' + pct(y) + '%">' + y + '</span>';
  nle.innerHTML = '<div class="nle-ruler">' + years + '</div>' + rows + '<i class="head"></i>';
  $('#expList').innerHTML = T.slice().sort(function (a, b) { return (b.to - a.to) || (b.from - a.from); }).map(function (c) {
    var name = c.link ? '<a href="' + esc(c.link) + '"' + (c.link.charAt(0) !== '#' ? ' target="_blank" rel="noopener"' : '') + '>' + esc(c.co) + '</a>' : esc(c.co);
    return '<li class="' + (c.now ? 'now' : '') + (c.founder ? ' founder' : '') + '" style="--c:' + TRACK_C[c.track % TRACK_C.length] + '"><b>' + name + '</b><span>' + esc(c.role) + '</span><time>' + esc(c.dates) + '</time></li>';
  }).join('');
  var clips = $$('.clip', nle);
  function setHead(v) {
    nle.style.setProperty('--p', v);
    var at = Y0 + v * (Y1 - Y0);
    clips.forEach(function (c) { c.classList.toggle('on', +c.dataset.from <= at + 0.01); });
  }
  function measureHead() { nle.style.setProperty('--w', nle.clientWidth + 'px'); }
  measureHead(); addEventListener('resize', measureHead);
  var endP = (NOW - Y0) / (Y1 - Y0);
  setHead(0);
  new IntersectionObserver(function (e, o) {
    if (!e[0].isIntersecting) return;
    o.disconnect();
    if (reduced) { setHead(endP); return; }
    var t0 = performance.now(), dur = 2600;
    (function tick(t) {
      var k = Math.min(1, (t - t0) / dur), ez = 1 - Math.pow(1 - k, 3);
      setHead(ez * endP);
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }, { threshold: 0.35 }).observe(nle);

  /* ---------- Work: 3D project slider ---------- */
  var work = $('#work'), deck = $('#deck'), dIdx = $('#deckIndex'), N = P.length, cur = 0, sw = 0, W = 0;
  var thumb = function (p) { return p.collage ? p.list[0].poster : img(p.cover); };
  deck.innerHTML = P.map(function (p, i) {
    var media = p.collage
      ? p.list.slice(0, 3).map(function (f) { return '<img src="' + f.poster + '" alt="" loading="lazy" draggable="false">'; }).join('')
      : '<img src="' + img(p.cover) + '" alt="" loading="lazy" draggable="false"' + ((p.pos || p.zoom) ? ' style="' + (p.pos ? 'object-position:' + p.pos + ';' : '') + (p.zoom ? '--z:' + p.zoom : '') + '"' : '') + '>';
    return '<article class="slide" data-i="' + i + '" aria-label="' + (i + 1) + ' of ' + N + ': ' + esc(p.title) + '">' +
      '<div class="slide-media">' + media + '</div>' +
      '<div class="slide-info"><p class="slide-kicker"><b>' + pad2(i + 1) + '</b>' + esc(p.client) + ' · ' + esc(p.kind) + '</p>' +
      '<h3>' + esc(p.title) + '</h3><p class="slide-lede">' + esc(p.lede) + '</p>' +
      '<div class="slide-foot"><span>' + esc([p.place, p.year].filter(Boolean).join(' · ')) + ' · ' + filmCount(p) + '</span>' +
      '<a class="slide-open" href="#/' + p.slug + '" tabindex="-1">Open project →</a></div></div></article>';
  }).join('');
  dIdx.innerHTML = P.map(function (p, i) {
    return '<button type="button" class="di" data-i="' + i + '" aria-label="Show project ' + (i + 1) + ': ' + esc(p.title) + '"><img src="' + thumb(p) + '" alt="" loading="lazy"><i></i></button>';
  }).join('');
  var slides = $$('.slide', deck), chips = $$('.di', dIdx);
  function dist(i) { var d = i - cur; if (d > N / 2) d -= N; if (d < -N / 2) d += N; return d; }
  function measure() { W = deck.clientWidth; sw = slides[0].offsetWidth; }
  function layout(drag) {
    var f = drag ? drag / sw : 0, spread = W < 700 ? 0.94 : 0.76;
    slides.forEach(function (s, i) {
      var d = dist(i), pos = d + f, a = Math.abs(pos);
      var sc = 1 - Math.min(a, 2) * 0.13, ry = reduced ? 0 : -pos * 13;
      s.style.transform = 'translate(-50%,-50%) translate3d(' + (pos * sw * spread).toFixed(1) + 'px,0,0) scale(' + sc.toFixed(3) + ') rotateY(' + ry.toFixed(2) + 'deg)';
      s.style.opacity = a > 2.4 ? 0 : Math.max(0, 1 - a * 0.42).toFixed(3);
      s.style.zIndex = String(100 - Math.round(a * 10));
      s.style.visibility = a > 2.6 ? 'hidden' : 'visible';
      s.classList.toggle('active', d === 0);
      s.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
      var a1 = s.querySelector('.slide-open'); if (a1) a1.tabIndex = d === 0 ? 0 : -1;
    });
    chips.forEach(function (c, i) {
      c.classList.toggle('on', i === cur);
      c.setAttribute('aria-current', i === cur ? 'true' : 'false');
      if (i !== cur) c.style.setProperty('--p', 0);
    });
    $('#deckCount').textContent = pad2(cur + 1) + ' / ' + pad2(N);
  }
  function go(i) {
    cur = (i % N + N) % N; elapsed = 0; layout(0);
    var c = chips[cur], r = dIdx;
    if (c && r.scrollWidth > r.clientWidth) r.scrollTo({ left: c.offsetLeft - r.clientWidth / 2 + c.offsetWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
  }
  measure(); layout(0);
  addEventListener('resize', function () { measure(); layout(0); });
  $('#deckPrev').onclick = function () { go(cur - 1); };
  $('#deckNext').onclick = function () { go(cur + 1); };
  dIdx.addEventListener('click', function (e) { var b = e.target.closest('.di'); if (b) go(+b.dataset.i); });

  var dSx = 0, dDx = 0, dDown = false, dMoved = false, downEl = null;
  deck.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    dDown = true; dMoved = false; dSx = e.clientX; dDx = 0; downEl = e.target;
  });
  deck.addEventListener('pointermove', function (e) {
    if (!dDown) return;
    dDx = e.clientX - dSx;
    if (!dMoved && Math.abs(dDx) > 8) { dMoved = true; deck.classList.add('dragging'); try { deck.setPointerCapture(e.pointerId); } catch (_) {} }
    if (dMoved) layout(dDx);
  });
  function endDrag(cancel) {
    if (!dDown) return;
    dDown = false; deck.classList.remove('dragging');
    if (dMoved) {
      if (!cancel && Math.abs(dDx) > sw * 0.12) go(cur + (dDx < 0 ? 1 : -1)); else layout(0);
      return;
    }
    if (cancel) return;
    var s = downEl && downEl.closest('.slide');
    if (!s) return;
    var i = +s.dataset.i;
    if (i === cur) location.hash = '#/' + P[i].slug; else go(i);
  }
  deck.addEventListener('pointerup', function () { endDrag(false); });
  deck.addEventListener('pointercancel', function () { endDrag(true); });
  deck.addEventListener('click', function (e) { if (e.target.closest('a')) e.preventDefault(); });
  var wAcc = 0, wLast = 0;
  deck.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    wAcc += e.deltaX;
    var now = performance.now();
    if (Math.abs(wAcc) > 50 && now - wLast > 420) { go(cur + (wAcc > 0 ? 1 : -1)); wAcc = 0; wLast = now; }
  }, { passive: false });
  deck.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
    else if (e.key === 'Enter' && e.target === deck) { location.hash = '#/' + P[cur].slug; }
  });

  /* Autoplay: pauses on hover, focus, drag, when off screen, or while a project or film is open. */
  var DUR = 6000, elapsed = 0, lastT = 0, workVisible = false, autoRunning = false;
  function keyboardInWork() { var f = document.activeElement; return !!(f && work.contains(f) && f.matches(':focus-visible')); }
  function auto() {
    var t = performance.now(), dt = lastT ? Math.min(t - lastT, 250) : 0; lastT = t;
    var paused = !workVisible || dDown || keyboardInWork() || !box.hidden || !pl.hidden || document.hidden;
    if (!paused) { elapsed += dt; if (elapsed >= DUR) go(cur + 1); }
    chips[cur].style.setProperty('--p', Math.min(1, elapsed / DUR).toFixed(3));
  }
  if (!reduced) {
    new IntersectionObserver(function (e) { workVisible = e[0].isIntersecting; }, { threshold: 0.2 }).observe(deck);
    setInterval(auto, 50);
  }

  /* ---------- Embedded shows (The Breakdown Show, festival podcast). YouTube loads only when someone presses play. ---------- */
  function setupShow(data, player, list, base, showName) {
    if (!data || !player || !list) return;
    var eps = data.episodes;
    var tag = function (e) { return e.label || 'Episode ' + pad2(e.n); };
    var thumbOf = function (e) { return base + (e.thumb || 'ep' + e.n) + '.jpg'; };
    var sub = function (e) { return e.guest ? 'With ' + e.guest + (e.role ? ' · ' + e.role : '') : (e.sub || ''); };
    var name = function (e) { return showName + ', ' + tag(e).toLowerCase() + (e.guest ? ' with ' + e.guest : ''); };
    list.innerHTML = eps.map(function (e, i) {
      return '<button type="button" class="bd-ep" data-i="' + i + '"><img src="' + thumbOf(e) + '" alt="" loading="lazy">' +
        '<span><span class="n">' + esc(tag(e)) + ' · ' + e.time + '</span><b dir="auto">' + esc(e.title) + '</b><small>' + esc(sub(e)) + '</small></span></button>';
    }).join('');
    var items = $$('.bd-ep', list);
    function mark(i) { items.forEach(function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-current', k === i ? 'true' : 'false'); }); }
    function facade(i) {
      var e = eps[i];
      player.innerHTML = '<button type="button" class="bd-facade" data-cursor="Play" aria-label="Play ' + esc(name(e)) + '">' +
        '<img src="' + thumbOf(e) + '" alt="" loading="lazy"><span class="bd-play" aria-hidden="true">▶</span>' +
        '<span class="bd-meta"><span class="n">' + esc(tag(e)) + ' · ' + e.time + '</span><b dir="auto">' + esc(e.title) + '</b><small>' + esc(sub(e)) + '</small></span></button>';
      $('.bd-facade', player).onclick = function () { play(i); };
    }
    function play(i) {
      var e = eps[i];
      player.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + e.id + '?autoplay=1&rel=0&playsinline=1&modestbranding=1" title="' + esc(name(e)) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      hideCursor();
    }
    list.addEventListener('click', function (ev) {
      var b = ev.target.closest('.bd-ep');
      if (!b) return;
      var i = +b.dataset.i; mark(i); play(i);
    });
    mark(0); facade(0);
  }
  setupShow(window.BREAKDOWN, $('#bdPlayer'), $('#bdList'), 'assets/breakdown/', 'The Breakdown Show');
  setupShow(window.ASFF, $('#asffPlayer'), $('#asffList'), 'assets/festival/', 'Alexandria Short Film Festival podcast');

  /* ---------- Reveal, split headings, counters ---------- */
  function split(el) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            var o = document.createElement('span'), i = document.createElement('span');
            o.className = 'w'; i.textContent = w; o.appendChild(i); frag.appendChild(o);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.nodeName !== 'BR') walk(n);
      });
    })(el);
    $$('.w>span', el).forEach(function (s, k) { s.style.transitionDelay = (k * 0.06).toFixed(2) + 's'; });
  }
  $$('h2.reveal').forEach(function (h) { h.classList.remove('reveal'); h.classList.add('split'); split(h); });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
      $$('[data-count]', e.target).forEach(count);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .split').forEach(function (el) { io.observe(el); });
  function count(el) {
    if (reduced) return;
    var to = +el.dataset.count, t0 = performance.now();
    (function tick(t) {
      var k = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round((1 - Math.pow(1 - k, 3)) * to) + '+';
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- Case study: hero, folder tabs, film rail ---------- */
  var box = $('#case'), lastFocus = null;
  function renderCase(p) {
    var next = P[(p.index + 1) % P.length];
    var tabs = [['The brief', p.brief], ['The idea', p.idea], ['My role', p.role]].filter(function (t) { return t[1]; });
    box.innerHTML =
      '<div class="case-bar"><span>' + pad2(p.index + 1) + ' / ' + pad2(P.length) + ' · ' + esc(p.client) + '</span>' +
      '<button type="button" class="btn-sm" id="caseClose">Close ✕</button></div>' +
      '<div class="case-hero">' + (p.collage
        ? '<div class="collage">' + p.list.slice(0, 4).map(function (f) { return '<img src="' + f.poster + '" alt="">'; }).join('') + '</div>'
        : '<img class="hero-still" src="' + img(p.hero) + '" alt="">') +
      '<div class="case-head wrap"><p class="case-kind"><b>●</b> ' + esc(p.kind) + ' · ' + esc([p.place, p.year].filter(Boolean).join(' · ')) + ' · ' + filmCount(p) + '</p>' +
      '<h2 id="caseTitle">' + esc(p.title) + '</h2>' +
      (p.arabic ? '<p class="arabic" lang="ar">' + esc(p.arabic) + '</p>' : '') + '</div></div>' +
      '<div class="wrap"><p class="lede">' + esc(p.lede) + '</p>' +
      '<div class="folder"><div class="tabs" role="tablist" aria-label="Project details">' + tabs.map(function (t, i) {
        return '<button type="button" class="tab" role="tab" id="tab' + i + '" aria-controls="tabp" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '"><span>' + pad2(i + 1) + '</span>' + t[0] + '</button>';
      }).join('') + '</div><div class="tabp" id="tabp" role="tabpanel" aria-labelledby="tab0" tabindex="0"><p>' + esc(tabs[0][1]) + '</p></div></div>' +
      '<div class="case-films"><div class="case-films-head"><h3>' + (p.list.length === 1 ? 'Watch' : p.list.length + ' films') + '</h3>' +
      (p.list.length > 1 ? '<div class="strip-ctl"><button type="button" class="round" id="railPrev" aria-label="Previous films">←</button><button type="button" class="round" id="railNext" aria-label="More films">→</button></div>' : '') +
      '</div><div class="rail" id="rail">' +
      p.list.map(function (f, i) {
        return '<button type="button" class="film ' + f.fmt + '" data-f="' + i + '" data-cursor="Play">' +
          '<img src="' + f.poster + '" alt="" loading="lazy"><span class="play" aria-hidden="true">▶</span>' +
          '<span class="film-t"><b>' + esc(f.title) + '</b><span>' + f.time + '</span></span></button>';
      }).join('') + '</div></div>' +
      '<a class="case-next" href="#/' + next.slug + '"><small>Next project</small><strong>' + esc(next.title) + ' →</strong></a></div>';
    box.scrollTop = 0;
    $('#caseClose').onclick = closeCase;
    var tabEls = $$('.tab', box), panel = $('#tabp');
    function pick(i, focus) {
      tabEls.forEach(function (t, k) { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
      panel.setAttribute('aria-labelledby', 'tab' + i);
      panel.innerHTML = '<p>' + esc(tabs[i][1]) + '</p>';
      panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
      if (focus) tabEls[i].focus();
    }
    tabEls.forEach(function (t, i) {
      t.onclick = function () { pick(i); };
      t.onkeydown = function (e) {
        if (e.key === 'ArrowRight') pick((i + 1) % tabEls.length, true);
        if (e.key === 'ArrowLeft') pick((i - 1 + tabEls.length) % tabEls.length, true);
      };
    });
    var rail = $('#rail');
    var railStep = function (d) { rail.scrollBy({ left: d * rail.clientWidth * 0.75, behavior: reduced ? 'auto' : 'smooth' }); };
    if ($('#railPrev')) { $('#railPrev').onclick = function () { railStep(-1); }; $('#railNext').onclick = function () { railStep(1); }; }
    $$('.film', box).forEach(function (b) {
      b.onclick = function () { openPlayer(p.list, +b.dataset.f, b); };
    });
  }
  function route() {
    var m = location.hash.match(/^#\/(.+)$/);
    var p = m && P.filter(function (x) { return x.slug === m[1]; })[0];
    if (p) {
      if (box.hidden) { lastFocus = document.activeElement; box.hidden = false; }
      renderCase(p);
      lockScroll(true);
      document.title = p.title + ' — Muhammad Saeed';
      box.setAttribute('tabindex', '-1'); box.focus({ preventScroll: true });
      if (p.index !== cur) go(p.index);
    } else if (!box.hidden) {
      box.hidden = true; box.innerHTML = '';
      lockScroll(false);
      document.title = 'Muhammad Saeed — Senior Creative Copywriter, Storyteller, Filmmaker';
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }
    hideCursor();
  }
  function closeCase() {
    history.pushState('', '', location.pathname + location.search);
    route();
  }
  addEventListener('hashchange', route);

  /* ---------- Player ---------- */
  var pl = $('#player'), vid = $('#pVideo'), list = [], at = 0, plFocus = null;
  function load() {
    var f = list[at];
    vid.pause(); vid.poster = f.poster; vid.src = f.src;
    $('#pClient').textContent = f.project.client;
    $('#pTitle').textContent = f.title;
    $('#pCount').textContent = pad2(at + 1) + ' / ' + pad2(list.length);
    var solo = list.length < 2;
    $('#pPrev').hidden = solo; $('#pNext').hidden = solo;
    var pr = vid.play();
    if (pr && pr.catch) pr.catch(function () {});
  }
  function openPlayer(l, i, from) {
    list = l; at = i; plFocus = from;
    pl.hidden = false;
    root.classList.add('playing'); lockScroll(true);
    hideCursor(); load();
    $('#pClose').focus();
  }
  function closePlayer() {
    vid.pause(); vid.removeAttribute('src'); vid.load();
    pl.hidden = true;
    root.classList.remove('playing');
    if (box.hidden) lockScroll(false);
    if (plFocus) plFocus.focus({ preventScroll: true });
  }
  function step(d) { at = (at + d + list.length) % list.length; load(); }
  $('#pClose').onclick = closePlayer;
  $('#pPrev').onclick = function () { step(-1); };
  $('#pNext').onclick = function () { step(1); };
  vid.addEventListener('ended', function () { if (list.length > 1 && at < list.length - 1) step(1); });
  document.addEventListener('keydown', function (e) {
    if (!pl.hidden) {
      if (e.key === 'Escape') closePlayer();
      if (e.key === 'ArrowRight' && list.length > 1 && document.activeElement !== vid) step(1);
      if (e.key === 'ArrowLeft' && list.length > 1 && document.activeElement !== vid) step(-1);
      if (e.key === 'Tab') trap(e, pl);
    } else if (!box.hidden) {
      if (e.key === 'Escape') closeCase();
      if (e.key === 'Tab') trap(e, box);
    }
  });
  function trap(e, rootEl) {
    var f = $$('a[href],button:not([hidden]),video[controls],[tabindex="0"]', rootEl);
    if (!f.length) return;
    var a = f[0], z = f[f.length - 1], c = document.activeElement;
    if (e.shiftKey && (c === a || c === rootEl)) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && c === z) { e.preventDefault(); a.focus(); }
  }

  /* ---------- Cursor label ---------- */
  var cursor = $('#cursor'), curT = $('span', cursor);
  function hideCursor() { cursor.classList.remove('on'); }
  if (finePointer && !reduced) {
    $$('.slide').forEach(function (s) { s.dataset.cursor = 'Open'; });
    addEventListener('pointermove', function (e) {
      cursor.style.setProperty('--x', e.clientX + 'px');
      cursor.style.setProperty('--y', e.clientY + 'px');
      var t = e.target.closest && e.target.closest('[data-cursor]');
      var show = t && !strip.classList.contains('drag') && !deck.classList.contains('dragging') && !(t.classList.contains('slide') && !t.classList.contains('active'));
      if (show) { curT.textContent = t.dataset.cursor; cursor.classList.add('on'); } else cursor.classList.remove('on');
    }, { passive: true });
  }

  route();
})();
