(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- CONTENT ---------- */
  // [name, description, image, object-position]
  var S = [
    ["Climatização", "Sistemas centrais de ar condicionado, estudos de viabilidade, termoacumuladores e pequenos espaços.", "shopping.jpg", "60% 50%"],
    ["Ventilação e Exaustão", "Cozinhas industriais, galpões, hotéis e contenção de gordura.", "hero.jpg", "8% 50%"],
    ["Gestão da Qualidade do Ar", "Diagnóstico e balanceamento para clínicas, hospitais, UTIs e laboratórios.", "saude.jpg", "50% 40%"],
    ["Pressurização de Escadas", "Sistemas para prédios e grandes empreendimentos.", "predio.jpg", "55% 40%"],
    ["Automação", "Automação de sistemas mecânicos e elétricos.", "hero.jpg", "0% 60%"],
    ["Consultoria", "Implantação e operação de shopping centers, com otimização de custos condominiais.", "sobre.jpg", "50% 30%"],
    ["Medição de Vazão", "Medição por ultrassom em tubulações e estudo do ponto ótimo de motores e bombas.", "hero.jpg", "50% 90%"],
    ["Gerenciamento de Manutenção", "Gestão da manutenção e avaliação técnica e de conservação.", "hero.jpg", "100% 40%"]
  ];
  // [title, description, image, position, fallback image (used until you add the dedicated photo)]
  var A = [
    ["Shopping centers", "Projeto, implantação e administração.", "shopping.jpg", "50% 50%"],
    ["Hotéis", "Ar condicionado e ventilação dimensionados para hotéis.", "hotel.jpg", "50% 50%", "hero.jpg", "15% 55%"],
    ["Restaurantes e cozinhas", "Cozinhas industriais e compactas, com contenção de gordura.", "cozinha.jpg", "50% 50%", "hero.jpg", "95% 30%"],
    ["Hospitais e clínicas", "Qualidade do ar para salas de cirurgia, UTIs e laboratórios.", "saude.jpg", "50% 40%"],
    ["Galpões", "Projeto de exaustão e ventilação.", "galpao.jpg", "50% 50%", "hero.jpg", "45% 95%"],
    ["Prédios e grandes empreendimentos", "Escadas pressurizadas.", "predio.jpg", "55% 40%"]
  ];
  var C = ["Mangabeira", "Manaíra", "River", "Patos", "Teresina", "Bosque"];
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  /* ---------- HERO HEADLINE: word-by-word mask reveal ---------- */
  var h1 = $("#h1");
  h1.innerHTML = h1.textContent.trim().split(/\s+/).map(function (w, i) {
    return '<span class="w"><span style="--i:' + i + '">' + w + "</span></span> ";
  }).join("");

  /* ---------- SERVICES ---------- */
  var list = $("#svl"), media = $("#svm"), bar = $("#svbar"), num = $("#svn");
  S.forEach(function (s, i) {
    var d = document.createElement("div");
    d.className = "sv-item";
    d.innerHTML = '<h3><button role="tab" aria-selected="false"><em>' + pad(i + 1) + "</em>" + s[0] + "</button></h3><p><span>" + s[1] + "</span></p>";
    list.appendChild(d);
    var im = new Image();
    im.src = "assets/" + s[2]; im.alt = ""; im.style.objectPosition = s[3]; im.loading = i ? "lazy" : "eager";
    media.insertBefore(im, media.firstChild);
    var b = $("button", d);
    b.addEventListener("click", function () { pick(i); });
    b.addEventListener("focus", function () { pick(i); });
    d.addEventListener("mouseenter", function () { if (matchMedia("(hover:hover)").matches) pick(i); });
  });
  var items = $$(".sv-item", list), imgs = $$("img", media).reverse();
  function pick(i) {
    items.forEach(function (d, j) {
      d.classList.toggle("on", j === i);
      $("button", d).setAttribute("aria-selected", j === i);
      imgs[j].classList.toggle("on", j === i);
    });
    num.textContent = pad(i + 1);
    // accent line follows the active item
    function place() { bar.style.transform = "translateY(" + items[i].offsetTop + "px)"; bar.style.height = items[i].offsetHeight + "px"; }
    place();
    clearTimeout(pick.t);
    pick.t = setTimeout(place, 850); // re-measure once the previous item has finished collapsing
  }
  pick(0);
  addEventListener("resize", function () { var i = items.findIndex(function (d) { return d.classList.contains("on"); }); pick(i < 0 ? 0 : i); });

  /* ---------- APPLICATIONS ---------- */
  $("#ap").innerHTML = A.map(function (a, i) {
    var fb = a[4] ? ' data-fb="assets/' + a[4] + '" data-fp="' + a[5] + '"' : "";
    return '<article class="panel mask"><img src="assets/' + a[2] + '" alt="" loading="lazy" style="object-position:' + a[3] + '"' + fb + '><div class="panel-t"><em>' + pad(i + 1) + "</em><h3>" + a[0] + '</h3><i class="ln"></i><p>' + a[1] + "</p></div></article>";
  }).join("");
  // If a dedicated photo (hotel.jpg, cozinha.jpg, galpao.jpg) is not in /assets yet, use a crop of an existing one
  $$("#ap img[data-fb]").forEach(function (im) {
    im.addEventListener("error", function () { im.src = im.dataset.fb; im.style.objectPosition = im.dataset.fp; }, { once: true });
  });

  /* ---------- CLIENTS + FORM ---------- */
  $("#cl").innerHTML = C.map(function (c) { return "<li>" + c + "</li>"; }).join("");
  $("#sel").innerHTML = S.map(function (s) { return "<option>" + s[0] + "</option>"; }).join("") + "<option>Outro assunto</option>";
  $("#f").addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(this);
    var body = "Nome: " + d.get("n") + "\nEmpresa: " + (d.get("e") || "-") + "\nE-mail: " + d.get("m") + "\nTelefone: " + (d.get("t") || "-") + "\n\n" + d.get("g");
    location.href = "mailto:contato@grupopordeus.com.br?subject=" + encodeURIComponent("Contato pelo site - " + d.get("s")) + "&body=" + encodeURIComponent(body);
    $("#fn").hidden = false;
  });

  /* ---------- MOBILE MENU ---------- */
  var mb = $("#mb"), nv = $("#nv");
  function menu(open) { nv.classList.toggle("open", open); mb.setAttribute("aria-expanded", open); document.body.style.overflow = open ? "hidden" : ""; }
  mb.addEventListener("click", function () { menu(!nv.classList.contains("open")); });
  $$("#nv a").forEach(function (a) { a.addEventListener("click", function () { menu(false); }); });
  addEventListener("keydown", function (e) { if (e.key === "Escape") menu(false); });

  /* ---------- REVEALS + COUNTERS ---------- */
  function count(el) {
    var to = +el.dataset.to, t0 = performance.now(), dur = 2000;
    if (reduce) return;
    (function f(t) {
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      $$(".cnt", en.target).forEach(count);
      io.unobserve(en.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
  $$(".rv,.mask").forEach(function (el, i) {
    // stagger panels in the same row
    if (el.classList.contains("panel")) el.style.transitionDelay = (i % 2) * 0.12 + "s";
    io.observe(el);
  });
  $$(".cnt").forEach(function (c) { if (!reduce) c.textContent = "0"; });

  /* ---------- SCROLL MOTION: nav, parallax, active link ---------- */
  var nav = $("#nav"), par = $$("[data-par]"), hx = $$("[data-hx]"), pimg = $$("[data-par-img]");
  var links = $$("#nv a:not(.btn)"), secs = links.map(function (a) { return $(a.getAttribute("href")); });
  var ticking = false;
  function frame() {
    ticking = false;
    var y = scrollY, vh = innerHeight;
    nav.classList.toggle("solid", y > 40);
    var cur = -1;
    secs.forEach(function (s, i) { if (s && s.offsetTop - 160 <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle("on", i === cur); });
    if (reduce) return;
    par.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      el.style.transform = "translate3d(0," + ((r.top + r.height / 2 - vh / 2) * -el.dataset.par).toFixed(1) + "px,0)";
    });
    pimg.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      el.style.transform = "translate3d(0," + (((r.top + r.height / 2 - vh / 2) / vh) * -12).toFixed(2) + "%,0)";
    });
    hx.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;       // -1…1
      el.style.transform = "translate3d(" + (p * 6).toFixed(2) + "%,0,0)";
    });
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener("resize", frame);
  frame();

  /* ---------- CURSOR RING (fine pointers only) ---------- */
  if (matchMedia("(pointer:fine)").matches && !reduce) {
    var c = document.createElement("i"); c.className = "cur"; document.body.appendChild(c);
    var x = 0, y = 0, tx = 0, ty = 0;
    addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; c.classList.add("v"); });
    document.addEventListener("pointerover", function (e) { c.classList.toggle("h", !!e.target.closest("a,button,.panel,.sv-item,.cl li")); });
    (function f() { x += (tx - x) * 0.18; y += (ty - y) * 0.18; c.style.transform = "translate(" + x + "px," + y + "px)"; requestAnimationFrame(f); })();
  }
})();