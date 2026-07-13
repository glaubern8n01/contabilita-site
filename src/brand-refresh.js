import './brand-refresh.css';
import './tracking.js';

const base = import.meta.env.BASE_URL;
const brandLabel = 'Contabilita Assessoria Contábil';
const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Rua%20Pedro%20Vargas%2C%2082%2C%20Waldir%20Furtado%20Amorim%2C%20Cachoeiro%20de%20Itapemirim%20-%20ES%2C%2029313-780';

document.querySelectorAll('.brand').forEach((brand) => {
  const isFooter = Boolean(brand.closest('footer'));
  brand.setAttribute('aria-label', `${brandLabel} — início`);
  brand.innerHTML = `<img src="${base}${isFooter ? 'logo-official-dark.png' : 'logo-official-light.png'}" alt="${brandLabel}">`;
});

const heroPanel = document.querySelector('.hero aside');
if (heroPanel) {
  heroPanel.insertAdjacentHTML('afterbegin', `<img class="brand-watermark" src="${base}logo-official-symbol.png" alt="" aria-hidden="true">`);
}

const contactLocation = document.querySelector('.contact > div > p:last-of-type');
if (contactLocation) {
  contactLocation.innerHTML = `<a class="map-link" href="${mapsUrl}" target="_blank" rel="noopener noreferrer" aria-label="Abrir endereço da Contabilita no Google Maps"><strong>Rua Pedro Vargas, nº 82</strong><br>Bairro Waldir Furtado Amorim<br>CEP 29313-780 · Cachoeiro de Itapemirim — ES<br><span>Ver no Google Maps ↗</span></a>`;
}

const footerInfo = document.querySelector('footer > p:not(.copy)');
if (footerInfo) {
  footerInfo.innerHTML = `CRC ES-024461<br><a href="tel:+5528999141153">(28) 99914-1153</a><br><a class="map-link" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Rua Pedro Vargas, nº 82<br>Waldir Furtado Amorim<br>CEP 29313-780 · Cachoeiro de Itapemirim — ES ↗</a>`;
}

const instagramUrl = 'https://www.instagram.com/contabilitacont/';
const contactPhone = document.querySelector('.contact > div > a[href^="tel:"]');
if (contactPhone) {
  contactPhone.insertAdjacentHTML('afterend', `<a class="instagram-link" href="${instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Contabilita, abre em nova aba">@contabilitacont</a>`);
}

const footerLinks = document.querySelector('footer > p:not(.copy):last-of-type');
if (footerLinks && footerLinks !== footerInfo) {
  footerLinks.insertAdjacentHTML('beforeend', `<br><a href="${base}cookies.html">Cookies</a><br><a href="${base}termos.html">Termos de Uso</a><br><a href="${instagramUrl}" target="_blank" rel="noopener noreferrer">Instagram · @contabilitacont</a>`);
}

document.querySelectorAll('a[href^="/contabilita/"]').forEach((link) => {
  link.href = link.getAttribute('href').replace('/contabilita/', base);
});

const businessType = document.querySelector('select[name="tipo"]');
if (businessType) {
  const options = [
    ['', 'Selecione'],
    ['MEI', 'MEI'],
    ['Simples Nacional', 'Simples Nacional'],
    ['Lucro Presumido', 'Lucro Presumido'],
    ['Lucro Real', 'Lucro Real'],
    ['Ainda não tenho CNPJ', 'Ainda não tenho CNPJ'],
  ];

  businessType.replaceChildren(...options.map(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    return option;
  }));
}
