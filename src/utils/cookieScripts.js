// src/services/cookieScripts.js
export function initCookieScripts() {
  console.log("🍪 Initialisation des scripts tiers...");

  // Google Analytics GA4
  loadScript("https://www.googletagmanager.com/gtag/js?id=G-SPRESKHKKL", () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    // Rendre gtag global
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", "G-SPRESKHKKL");
  });

  // Exemple Meta Pixel
  // loadScript("https://connect.facebook.net/en_US/fbevents.js", () => {
  //   if (!window.fbq) {
  //     window.fbq = function () {
  //       window.fbq.callMethod
  //         ? window.fbq.callMethod.apply(window.fbq, arguments)
  //         : window.fbq.queue.push(arguments);
  //     };
  //     if (!window._fbq) window._fbq = window.fbq;
  //     window.fbq.push = window.fbq;
  //     window.fbq.loaded = true;
  //     window.fbq.version = "2.0";
  //     window.fbq.queue = [];
  //   }
  //   window.fbq("init", "YOUR_PIXEL_ID");
  //   window.fbq("track", "PageView");
  // });
  // 🔔 Demande de permission pour les notifications navigateur
  initNotificationPermission();
  // Tu peux ajouter d'autres scripts ici
}

function loadScript(src, callback) {
  const existingScript = document.querySelector(`script[src="${src}"]`);
  if (existingScript) {
    if (callback) callback();
    return;
  }
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
}
// src/http/request.js
// ✅ Gestion de la permission de notification
function initNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("🚫 Ce navigateur ne supporte pas les notifications.");
    return;
  }

  // Si l’utilisateur n’a pas encore décidé
  if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      console.log("🔔 Permission de notification :", permission);
      if (permission === "granted") {
        // Petite notification de bienvenue 🎉
        new Notification("Notifications activées ✅", {
          body: "Vous recevrez désormais des alertes en temps réel.",
          icon: "/logo.png",
        });
      }
    });
  } else {
    console.log("🔔 État actuel des notifications :", Notification.permission);
  }
}
