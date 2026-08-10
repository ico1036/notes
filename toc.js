/* ------------------------------------------------------------------
   Contents rail.

   Built at load from the article's own h2s rather than written into
   each post, so a heading cannot drift out of sync with its entry in
   the list. The ids are generated here too, which is why they always
   match the links: both come from the same slug.

   Progressive enhancement in the strict sense — with scripting off the
   rail element stays empty and the stylesheet leaves it hidden, and no
   content is lost, because the rail only ever repeats headings that are
   already on the page.
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  var rail = document.querySelector(".rail");
  var article = document.querySelector("article");
  if (!rail || !article) return;

  var heads = [].slice.call(article.querySelectorAll("h2"));
  if (heads.length < 3) return;          // too few to be worth a rail

  function slug(s) {
    return s.toLowerCase().trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
  }

  var used = Object.create(null);
  var list = document.createElement("ol");
  list.className = "rail-list";

  var links = heads.map(function (h, i) {
    var id = h.id;
    if (!id) {
      id = slug(h.textContent) || "section-" + i;
      // a duplicate id would make one entry unreachable, silently
      if (used[id]) id = id + "-" + i;
      h.id = id;
    }
    used[id] = true;

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + id;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
    return a;
  });

  var label = document.createElement("span");
  label.className = "rail-lbl";
  label.textContent = "Contents";
  rail.appendChild(label);
  rail.appendChild(list);

  /* current section, by whichever heading was passed most recently ---- */

  var current = null;
  function mark() {
    var best = 0;
    for (var i = 0; i < heads.length; i++) {
      // 40% down the viewport: a heading counts as "reached" once it is
      // comfortably on screen, not the instant its top edge appears
      if (heads[i].getBoundingClientRect().top < window.innerHeight * 0.4) {
        best = i;
      } else {
        break;
      }
    }
    if (links[best] === current) return;
    if (current) current.removeAttribute("aria-current");
    current = links[best];
    current.setAttribute("aria-current", "true");
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { mark(); ticking = false; });
  }

  mark();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
})();
