// Vesper PWA service worker —— 故意什么都不缓存。
//
// 为什么：秘密空间（/secret/、/api/、/waline/）是受门禁保护的内容，
// 一旦被 SW 离线缓存，退出登录后仍可能被读到，密码门就形同虚设。
// 这个 SW 存在的唯一目的是满足 PWA 可安装性（主屏幕图标、独立窗口），
// 所有请求一律直接走网络。
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // no-op：不拦截，不缓存
});
