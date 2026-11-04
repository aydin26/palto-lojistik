self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}
  const title = data.title || "PALTO LOJİSTİK";
  const options = {
    body: data.body || "Yeni bir lojistik talebi oluşturuldu.",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    data: { url: data.url || "./" },
    tag: data.tag || "palto-new-request",
    renotify: true
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "./", self.location.origin).href;
  event.waitUntil((async () => {
    const clientsList = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientsList) {
      if (client.url.startsWith(self.location.origin) && "focus" in client) {
        await client.focus();
        return;
      }
    }
    if (clients.openWindow) await clients.openWindow(target);
  })());
});
