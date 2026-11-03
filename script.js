// Keep the copyright year current.
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// A tiny pixel bear that wanders along the bottom edge and waves at random.
(() => {
  const playground = document.getElementById("bear-playground");
  const bear = document.getElementById("pixel-bear");
  const speech = document.getElementById("bear-speech");
  if (!playground || !bear || !speech) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const phrases = ["Hi there!", "Bear hugs!", "Have a lovely day!", "*tiny wave*", "Hello, class!"];
  let x = 8;
  let direction = 1;
  let walking = false;
  let timer;
  let speechTimer;

  function bounds() { return Math.max(0, playground.clientWidth - bear.offsetWidth - 4); }
  function placeBear() {
    bear.style.left = `${Math.max(0, Math.min(x, bounds()))}px`;
    bear.style.transform = direction < 0 ? "scaleX(-1)" : "scaleX(1)";
    speech.style.left = `${Math.max(4, Math.min(x, playground.clientWidth - speech.offsetWidth - 4))}px`;
  }
  function say(message, duration = 1900) {
    speech.textContent = message;
    speech.classList.add("visible");
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => speech.classList.remove("visible"), duration);
  }
  function wave(message = phrases[Math.floor(Math.random() * phrases.length)]) {
    bear.classList.remove("is-walking");
    walking = false;
    bear.classList.remove("is-waving");
    void bear.offsetWidth;
    bear.classList.add("is-waving");
    bear.setAttribute("aria-pressed", "true");
    say(message);
    setTimeout(() => {
      bear.classList.remove("is-waving");
      bear.setAttribute("aria-pressed", "false");
    }, 2200);
  }
  function scheduleNext() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (reducedMotion.matches) { wave(); scheduleNext(); return; }
      if (Math.random() < 0.48) { wave(); scheduleNext(); return; }
      walkFor(1400 + Math.random() * 3000);
    }, 1800 + Math.random() * 3800);
  }
  function walkFor(duration) {
    walking = true;
    bear.classList.remove("is-waving");
    bear.classList.add("is-walking");
    const started = performance.now();
    let previous = started;
    function step(now) {
      if (!walking) return;
      const delta = Math.min(40, now - previous);
      previous = now;
      x += direction * delta * 0.075;
      if (x >= bounds()) { x = bounds(); direction = -1; }
      if (x <= 0) { x = 0; direction = 1; }
      placeBear();
      if (now - started < duration) requestAnimationFrame(step);
      else { walking = false; bear.classList.remove("is-walking"); scheduleNext(); }
    }
    requestAnimationFrame(step);
  }

  bear.addEventListener("click", () => {
    walking = false;
    wave("Hey ! That hurts.");
    scheduleNext();
  });
  window.addEventListener("resize", () => { x = Math.min(x, bounds()); placeBear(); });
  placeBear();
  // Start with a friendly wave, then wander and wave at irregular intervals.
  setTimeout(() => { wave("Hello, X-5!"); scheduleNext(); }, 900);
})();
