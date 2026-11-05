(function () {
  'use strict';
  var P = window.PORTFOLIO, T = window.TIMELINE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pad2 = function (n) { return String(n).padStart(2, '0'); };
  var img = function (n) { return 'assets/img/' + n + '.jpg'; };
  var filmCount = function (p) { return p.films.length + (p.films.length === 1 ? ' film' : ' films'); };

  /* Flat film list: each film's file name follows its project and position. */
  var ALL = [];
  P.forEach(function (p, pi) {
    p.index = pi;
    p.list = p.films.map(function (f, i) {
      var id = p.slug + '-' + pad2(i + 1);
      var film = { project: p, title: f[0], time: f[1], fmt: f[2], src: 'assets/films/' + id + '.mp4', poster: img(id) };
      ALL.push(film);
      return film;
    });
  });

  /* ---------- Timecode ---------- */
  var start = performance.now(), tc = $('#tc'), boot = $('.boot-count');
  function code(ms) {
    var f = Math.floor(ms / 40), s = Math.floor(f / 25), m = Math.floor(s / 60), h = Math.floor(m / 60);
    return pad2(h) + ':' + pad2(m % 60) + ':' + pad2(s % 60) + ':' + pad2(f % 25);
  }
  if (!reduced) setInterval(function () { tc.textContent = code(performance.now() - start); }, 80);
  setTimeout(function () { var b = $('.boot'); if (b) b.remove(); }, 2100);
  if (boot) {
    var bt = setInterval(function () {
      var e = performance.now() - start;
      boot.textContent = code(e * 6);
      if (e > 1200) clearInterval(bt);
    }, 40);
  }

  /* ---------- Nav ---------- */
  var nav = $('.nav');
  function onScroll() { nav.classList.toggle('solid', scrollY > 60); }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hero: a light that follows the cursor ---------- */
  var hero = $('.hero'), lit = $('.hero-img.lit');
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
    specks = [];
    for (var i = 0; i < n; i++) specks.push({ x: Math.random() * cw, y: Math.random() * ch, r: 0.4 + Math.random() * 1.3, v: 0.05 + Math.random() * 0.22, p: Math.random() * 6.28 });
  }
  function frame(t) {
    if (!touched) {
      tx = 0.77 + Math.sin(t / 3400) * 0.05;
      ty = 0.31 + Math.cos(t / 2700) * 0.05;
    }
    cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
    lit.style.setProperty('--mx', (cx * 100).toFixed(2) + '%');
    lit.style.setProperty('--my', (cy * 100).toFixed(2) + '%');
    ctx.clearRect(0, 0, cw, ch);
    var lx = cx * cw, ly = cy * ch;
    for (var i = 0; i < specks.length; i++) {
      var s = specks[i];
      s.y -= s.v; s.x += Math.sin(t / 1900 + s.p) * 0.12;
      if (s.y < -4) { s.y = ch + 4; s.x = Math.random() * cw; }
      var dist = Math.hypot(s.x - lx, s.y - ly), a = Math.max(0.05, 0.8 - dist / 430);
      ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
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

  /* ---------- Work grid ---------- */
  var grid = $('#grid');
  grid.innerHTML = P.map(function (p) {
    var meta = [p.place, p.year].filter(Boolean).join(' · ');
    return '<a class="card ' + p.span + '" href="#/' + p.slug + '" data-cursor="View">' +
      '<img src="' + img(p.cover) + '" alt="" loading="lazy"' + ((p.pos || p.zoom) ? ' style="' + (p.pos ? 'object-position:' + p.pos + ';' : '') + (p.zoom ? '--z:' + p.zoom : '') + '"' : '') + '>' +
      '<i class="bk"></i>' +
      '<div class="card-tl"><span>' + pad2(p.index + 1) + '</span><span>' + esc(meta) + '</span></div>' +
      '<div class="card-info"><span>' + esc(p.client) + '</span><h3>' + esc(p.title) + '</h3></div></a>';
  }).join('');

  /* ---------- Film strip ---------- */
  var strip = $('#strip');
  strip.innerHTML = ALL.map(function (f, i) {
    return '<button type="button" class="tile ' + f.fmt + '" data-i="' + i + '" data-cursor="Play">' +
      '<img src="' + f.poster + '" alt="" loading="lazy" draggable="false">' +
      '<span class="tile-t"><b>' + esc(f.title) + '</b><span>' + esc(f.project.client) + ' · ' + f.time + '</span></span></button>';
  }).join('');
  var dragged = false, down = false, sx = 0, sl = 0;
  strip.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    down = true; dragged = false; sx = e.clientX; sl = strip.scrollLeft;
  });
  addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - sx;
    if (Math.abs(dx) > 6) { dragged = true; strip.classList.add('drag'); }
    if (dragged) strip.scrollLeft = sl - dx;
  });
  addEventListener('pointerup', function () {
    down = false;
    setTimeout(function () { strip.classList.remove('drag'); }, 0);
  });
  strip.addEventListener('click', function (e) {
    var t = e.target.closest('.tile');
    if (!t || dragged) return;
    openPlayer(ALL, +t.dataset.i, t);
  });
  function stepStrip(d) { strip.scrollBy({ left: d * strip.clientWidth * 0.7, behavior: reduced ? 'auto' : 'smooth' }); }
  $('#stripPrev').onclick = function () { stepStrip(-1); };
  $('#stripNext').onclick = function () { stepStrip(1); };

  /* ---------- Experience: edit timeline ---------- */
  var nle = $('#nle'), Y0 = 2022, Y1 = 2027, NOW = 2026.85;
  var pct = function (y) { return (y - Y0) / (Y1 - Y0) * 100; };
  var rows = [0, 1, 2, 3].map(function (tr) {
    return '<div class="nle-track">' + T.filter(function (c) { return c.track === tr; }).map(function (c) {
      return '<div class="clip' + (c.now ? ' now' : '') + '" data-from="' + c.from + '" style="left:calc(' + pct(c.from) + '% + 2px);width:calc(' + (pct(c.to) - pct(c.from)) + '% - 4px)">' +
        '<div><b>' + esc(c.co) + '</b><small>' + esc(c.role) + '</small></div><time>' + esc(c.dates) + '</time></div>';
    }).join('') + '</div>';
  }).join('');
  var years = '';
  for (var y = Y0; y < Y1; y++) years += '<span style="left:' + pct(y) + '%">' + y + '</span>';
  nle.innerHTML = '<div class="nle-ruler">' + years + '</div>' + rows + '<i class="head"></i>';
  $('#expList').innerHTML = T.slice().reverse().map(function (c) {
    return '<li' + (c.now ? ' class="now"' : '') + '><b>' + esc(c.co) + '</b><span>' + esc(c.role) + '</span><time>' + esc(c.dates) + '</time></li>';
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

  /* ---------- Reveal and counters ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
      $$('[data-count]', e.target).forEach(count);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(function (el) { io.observe(el); });
  function count(el) {
    if (reduced) return;
    var to = +el.dataset.count, t0 = performance.now();
    (function tick(t) {
      var k = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round((1 - Math.pow(1 - k, 3)) * to) + '+';
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- Case study ---------- */
  var box = $('#case'), lastFocus = null;
  function renderCase(p) {
    var vs = p.films.filter(function (f) { return f[2] === 'v'; }).length, n = p.films.length;
    var cls = 'films';
    if (vs && vs < n) cls += ' mix'; else if (!vs && n === 2) cls += ' few-2'; else if (!vs && n > 2) cls += ' many';
    var next = P[(p.index + 1) % P.length];
    var col = function (h, t) { return t ? '<div><h3>' + h + '</h3><p>' + esc(t) + '</p></div>' : ''; };
    box.innerHTML =
      '<div class="case-bar"><span>' + pad2(p.index + 1) + ' / ' + pad2(P.length) + ' · ' + esc(p.client) + '</span>' +
      '<button type="button" class="btn" id="caseClose">Close ✕</button></div>' +
      '<div class="case-hero">' + (p.collage
        ? '<div class="collage">' + p.list.slice(0, 4).map(function (f) { return '<img src="' + f.poster + '" alt="">'; }).join('') + '</div>'
        : '<img class="hero-still" src="' + img(p.hero) + '" alt="">') +
      '<div class="case-head wrap"><p class="case-kind"><b>●</b> ' + esc(p.kind) + ' · ' + esc([p.place, p.year].filter(Boolean).join(' · ')) + ' · ' + filmCount(p) + '</p>' +
      '<h2 id="caseTitle">' + esc(p.title) + '</h2>' +
      (p.arabic ? '<p class="arabic" lang="ar">' + esc(p.arabic) + '</p>' : '') + '</div></div>' +
      '<div class="wrap"><p class="lede">' + esc(p.lede) + '</p>' +
      '<div class="tri">' + col('The brief', p.brief) + col('The idea', p.idea) + col('My role', p.role) + '</div>' +
      '<div class="case-films"><h3>' + (n === 1 ? 'Watch' : 'Films') + '</h3><div class="' + cls + '">' +
      p.list.map(function (f, i) {
        return '<button type="button" class="film ' + f.fmt + '" data-f="' + i + '">' +
          '<img src="' + f.poster + '" alt="" loading="lazy"><span class="play" aria-hidden="true">▶</span>' +
          '<span class="film-t"><b>' + esc(f.title) + '</b><span>' + f.time + '</span></span></button>';
      }).join('') + '</div></div>' +
      '<a class="case-next" href="#/' + next.slug + '"><small>Next project</small><strong>' + esc(next.title) + ' →</strong></a></div>';
    box.scrollTop = 0;
    $('#caseClose').onclick = closeCase;
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
      document.documentElement.classList.add('locked');
      document.title = p.title + ' — Muhammad Saeed';
      box.setAttribute('tabindex', '-1'); box.focus({ preventScroll: true });
    } else if (!box.hidden) {
      box.hidden = true; box.innerHTML = '';
      document.documentElement.classList.remove('locked');
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
    document.documentElement.classList.add('locked');
    hideCursor(); load();
    $('#pClose').focus();
  }
  function closePlayer() {
    vid.pause(); vid.removeAttribute('src'); vid.load();
    pl.hidden = true;
    if (box.hidden) document.documentElement.classList.remove('locked');
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
  function trap(e, root) {
    var f = $$('a[href],button:not([hidden]),video[controls]', root);
    if (!f.length) return;
    var a = f[0], z = f[f.length - 1], cur = document.activeElement;
    if (e.shiftKey && (cur === a || cur === root)) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && cur === z) { e.preventDefault(); a.focus(); }
  }

  /* ---------- Cursor label ---------- */
  var cur = $('#cursor'), curT = $('span', cur);
  function hideCursor() { cur.classList.remove('on'); }
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduced) {
    addEventListener('pointermove', function (e) {
      cur.style.setProperty('--x', e.clientX + 'px');
      cur.style.setProperty('--y', e.clientY + 'px');
      var t = e.target.closest && e.target.closest('[data-cursor]');
      if (t && !strip.classList.contains('drag')) { curT.textContent = t.dataset.cursor; cur.classList.add('on'); }
      else cur.classList.remove('on');
    }, { passive: true });
  }

  route();
})();
