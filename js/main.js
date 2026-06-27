/* ============================================================
   Parallax Journey — interactions
   ============================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Touch / small screens: skip scroll-driven transforms — they cause jank on phones.
  const isTouch =
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 820;

  /* ---- 1. Scroll-driven parallax on hero layers ---- */
  const parallaxEls = Array.from(document.querySelectorAll(".parallax, .hero-orbit"));
  let ticking = false;

  function applyParallax() {
    const y = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || "0.3");
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
    ticking = false;
  }

  /* ---- 2. Progress rocket along the rail ---- */
  const fill = document.querySelector(".progress-fill");
  const ship = document.querySelector(".progress-ship");
  const hint = document.querySelector(".scroll-hint");

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    fill.style.height = pct + "%";
    ship.style.top = pct + "%";
    if (hint) hint.style.opacity = window.scrollY > 120 ? "0" : "0.9";
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (!reduce && !isTouch) applyParallax();
        updateProgress();
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  updateProgress();

  /* ---- 3. Reveal sections as they enter view ---- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---- 4. Never-ending drifting code glyphs ---- */
  const glyphLayer = document.querySelector(".glyphs");
  const snippets = [
    "const journey = () => never.end()", "</>", "{ ...spread }", "npm run dev",
    "async/await", "git push origin main", "console.log('🚀')", "<Component />",
    "SELECT * FROM dreams", "useEffect(() => {})", "200 OK", "Socket.IO",
    "fn() => fun", "MERN", "Next.js", "Prisma", "PHP", "REST", "200ms", "ship it ✦",
  ];

  function spawnGlyph() {
    if (reduce || document.hidden) return;
    const s = document.createElement("span");
    s.textContent = snippets[Math.floor(Math.random() * snippets.length)];
    s.style.left = Math.random() * 100 + "vw";
    const dur = 14 + Math.random() * 16;
    s.style.animationDuration = dur + "s";
    s.style.fontSize = 0.8 + Math.random() * 1.1 + "rem";
    glyphLayer.appendChild(s);
    setTimeout(() => s.remove(), dur * 1000 + 500);
  }
  if (!reduce) {
    const seed = isTouch ? 3 : 6;
    const every = isTouch ? 4200 : 2600; // fewer, slower glyphs on phones
    for (let i = 0; i < seed; i++) setTimeout(spawnGlyph, i * 700);
    setInterval(spawnGlyph, every);
  }

  /* ---- 5. Restart-the-journey button ---- */
  const loopBtn = document.getElementById("loopBtn");
  if (loopBtn) {
    loopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---- 6. Subtle pointer-driven nebula tilt (desktop) ---- */
  const cosmos = document.querySelector(".cosmos");
  if (cosmos && !reduce && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener(
      "pointermove",
      (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 14;
        const y = (e.clientY / window.innerHeight - 0.5) * 14;
        cosmos.style.transform = `translate(${x}px, ${y}px)`;
      },
      { passive: true }
    );
  }
})();
