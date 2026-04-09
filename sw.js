// 캐시 없이 항상 네트워크에서 최신 파일 가져오기
self.addEventListener('fetch', e => {
  // Firebase 요청은 그대로 통과
  if (e.request.url.includes('firebasejs') || 
      e.request.url.includes('firestore') || 
      e.request.url.includes('googleapis') ||
      e.request.url.includes('fonts.google')) {
    return;
  }
  // 나머지는 항상 네트워크에서 최신 버전으로
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
