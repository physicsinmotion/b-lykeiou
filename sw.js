const CACHE = "pimB-v3";
const FILES = ["./", "index.html", "questions.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "katex/katex.min.js", "katex/katex.min.css",
  "katex/fonts/KaTeX_AMS-Regular.woff2", "katex/fonts/KaTeX_Caligraphic-Bold.woff2", "katex/fonts/KaTeX_Caligraphic-Regular.woff2", "katex/fonts/KaTeX_Fraktur-Bold.woff2", "katex/fonts/KaTeX_Fraktur-Regular.woff2", "katex/fonts/KaTeX_Main-Bold.woff2", "katex/fonts/KaTeX_Main-BoldItalic.woff2", "katex/fonts/KaTeX_Main-Italic.woff2", "katex/fonts/KaTeX_Main-Regular.woff2", "katex/fonts/KaTeX_Math-BoldItalic.woff2", "katex/fonts/KaTeX_Math-Italic.woff2", "katex/fonts/KaTeX_SansSerif-Bold.woff2", "katex/fonts/KaTeX_SansSerif-Italic.woff2", "katex/fonts/KaTeX_SansSerif-Regular.woff2", "katex/fonts/KaTeX_Script-Regular.woff2", "katex/fonts/KaTeX_Size1-Regular.woff2", "katex/fonts/KaTeX_Size2-Regular.woff2", "katex/fonts/KaTeX_Size3-Regular.woff2", "katex/fonts/KaTeX_Size4-Regular.woff2", "katex/fonts/KaTeX_Typewriter-Regular.woff2"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first: οι αλλαγές φτάνουν αμέσως όταν υπάρχει σύνδεση, αλλιώς δουλεύει από την cache (offline).
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r)
      .then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
        return res;
      })
      .catch(() => caches.match(r).then(m => m || caches.match("index.html")))
  );
});
