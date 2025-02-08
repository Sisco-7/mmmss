const cacheName = "mmms-cache-v1";
const assets = [
    "./", 
    "./index.html",
    "./styles.css",
    "./script.js",
    "./icons/icon-192x192.png",
    "./icons/icon-512x512.png"
];

// Install Service Worker
self.addEventListener("install", event => {
    console.log("Service Worker: Installing...");
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return Promise.all(
                assets.map(url =>
                    fetch(url, { cache: "no-store" })
                        .then(response => {
                            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
                            return cache.add(url);
                        })
                        .catch(err => console.warn(`Skipping: ${url}`, err))
                )
            );
        })
    );
});

// Activate Service Worker
self.addEventListener("activate", event => {
    console.log("Service Worker: Activating...");
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== cacheName).map(key => caches.delete(key))
            );
        }).then(() => console.log("Old caches cleared."))
    );
});

// Fetch Event (for offline support)
self.addEventListener("fetch", event => {
    console.log("Fetching:", event.request.url);
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(error => console.error("Fetch failed:", error))
    );
});
