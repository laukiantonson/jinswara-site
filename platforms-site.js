/* JinSwara — dynamic platforms injector (nav dropdown, footer, homepage cards)
   Data: projects.json in Supabase events-data bucket, managed via /events/platforms-admin */
(function () {
  var DATA_URL = "https://aarpvkroygnuvqgygvsy.supabase.co/storage/v1/object/public/events-data/projects.json";
  var COLORS = ["violet", "teal", "coral", "gold", "pink"];

  function aboutHref(p) { return "/platform/?id=" + encodeURIComponent(p.id); }

  function inject(ps) {
    if (!Array.isArray(ps) || !ps.length) return;

    /* 1. nav "Projects" dropdown(s) — desktop + mobile share .dd-menu */
    document.querySelectorAll(".dd-menu").forEach(function (menu) {
      ps.forEach(function (p) {
        var a = document.createElement("a");
        a.href = aboutHref(p);
        a.textContent = p.name;
        menu.appendChild(a);
      });
    });

    /* 2. footer "Projects" column — insert before the Events link */
    document.querySelectorAll(".foot-col").forEach(function (col) {
      var h = col.querySelector("h4");
      if (!h || h.textContent.trim() !== "Projects") return;
      var evLink = col.querySelector('a[href="/events/"]');
      ps.forEach(function (p) {
        var a = document.createElement("a");
        a.href = aboutHref(p);
        a.textContent = p.name;
        if (evLink) col.insertBefore(a, evLink); else col.appendChild(a);
      });
    });

    /* 3. homepage project cards */
    var grid = document.querySelector(".projects-grid");
    if (grid) {
      ps.forEach(function (p, i) {
        var color = COLORS.indexOf(p.color) >= 0 ? p.color : COLORS[i % 4];
        var href = aboutHref(p);
        var card = document.createElement("div");
        card.className = "pcard c-" + color + " reveal visible";
        card.style.cursor = "pointer";
        card.addEventListener("click", function (ev) {
          if (!ev.target.closest("a")) window.location = href;
        });
        card.innerHTML =
          '<div class="picon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/></svg></div>' +
          '<h3></h3><div class="purl"></div><p></p>' +
          '<a class="plink" href="' + href + '"><span class="pl-txt"></span> <span class="arr">\u2192</span></a>';
        card.querySelector("h3").textContent = p.name || "";
        card.querySelector(".purl").textContent = p.domain || "";
        card.querySelector("p").textContent = p.card || "";
        card.querySelector(".pl-txt").textContent = p.ctaText || "Know More";
        grid.appendChild(card);
      });
    }
  }

  fetch(DATA_URL + "?t=" + Math.floor(Date.now() / 60000))
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(inject)
    .catch(function () { /* fail silent — static site keeps working */ });
})();
