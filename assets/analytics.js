// Идентификаторы из личных кабинетов Google Analytics и Яндекс Метрики.
// Пустые значения отключают соответствующий сервис.
const analyticsSettings = {
  googleMeasurementId: "",
  yandexCounterId: "",
};

(() => {
  const { googleMeasurementId, yandexCounterId } = analyticsSettings;
  const loadScript = (src) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.append(script);
  };

  if (/^G-[A-Z0-9]+$/.test(googleMeasurementId)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", googleMeasurementId);
    loadScript(
      "https://www.googletagmanager.com/gtag/js?id=" + googleMeasurementId,
    );
  }

  if (/^[1-9]\d+$/.test(String(yandexCounterId))) {
    window.ym =
      window.ym ||
      function () {
        (window.ym.a = window.ym.a || []).push(arguments);
      };
    window.ym.l = Date.now();
    window.ym(Number(yandexCounterId), "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
    });
    loadScript("https://mc.yandex.ru/metrika/tag.js");
  }
})();
