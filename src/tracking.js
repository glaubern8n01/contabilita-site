const metaPixelId = import.meta.env.VITE_META_PIXEL_ID?.trim();
const googleTagId = import.meta.env.VITE_GOOGLE_TAG_ID?.trim();
const consentKey = 'contabilita_tracking_consent';
const privacyUrl = `${import.meta.env.BASE_URL}privacidade.html`;

const validMetaPixelId = /^\d{5,25}$/.test(metaPixelId || '');
const validGoogleTagId = /^(G|AW)-[A-Z0-9]+$/.test(googleTagId || '');

function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.append(script);
}

function enableMetaPixel() {
  if (!validMetaPixelId || window.fbq) return;
  const fbq = window.fbq = (...args) => fbq.queue.push(args);
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  loadScript('https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', metaPixelId);
  fbq('track', 'PageView');
}

function enableGoogleTag() {
  if (!validGoogleTagId || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args) => window.dataLayer.push(args);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleTagId)}`);
  window.gtag('js', new Date());
  window.gtag('config', googleTagId);
}

function enableTracking() {
  enableMetaPixel();
  enableGoogleTag();

  document.querySelector('#lead')?.addEventListener('submit', () => {
    window.fbq?.('track', 'Lead');
    window.gtag?.('event', 'generate_lead');
  });
}

function saveConsent(value) {
  localStorage.setItem(consentKey, value);
  document.querySelector('.tracking-consent')?.remove();
  if (value === 'accepted') enableTracking();
}

function showConsent() {
  const banner = document.createElement('aside');
  banner.className = 'tracking-consent';
  banner.setAttribute('aria-label', 'Preferências de medição');
  banner.innerHTML = `<p><strong>Sua privacidade importa.</strong> Podemos usar cookies de medição para entender visitas e melhorar nossas campanhas. <a href="${privacyUrl}">Saiba mais</a>.</p><div><button type="button" data-consent="rejected">Recusar</button><button type="button" data-consent="accepted">Aceitar medição</button></div>`;
  banner.querySelectorAll('[data-consent]').forEach((button) => {
    button.addEventListener('click', () => saveConsent(button.dataset.consent));
  });
  document.body.append(banner);
}

if (validMetaPixelId || validGoogleTagId) {
  const consent = localStorage.getItem(consentKey);
  if (consent === 'accepted') enableTracking();
  if (!consent) showConsent();
}
