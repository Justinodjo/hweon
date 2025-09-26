navigator.serviceWorker.register("/sw.js");

navigator.serviceWorker.ready
  .then((registration) => {
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BLXQ_L6U0Ld14Z3SZe7OF-AXjXHkVDuPKN3hojFz_ejOyUxIvsw58jbs00i0C_UTC1YY_6A9Zg_yqyt5Ke5pEjQ"
      ),
    });
  })
  .then((subscription) => {
    fetch("/api/push/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" },
    });
  });

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
