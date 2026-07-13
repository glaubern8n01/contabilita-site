import './brand-refresh.css';

const base = '/contabilita-site/';
const brandLabel = 'Contabilita Assessoria Contábil';

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
  contactLocation.innerHTML = '<strong>Rua Pedro Vargas, nº 82</strong><br>Bairro Waldir Furtado Amorim<br>CEP 29313-780 · Cachoeiro de Itapemirim — ES';
}

const footerInfo = document.querySelector('footer > p:not(.copy)');
if (footerInfo) {
  footerInfo.innerHTML = 'CRC ES-024461<br><a href="tel:+5528999141153">(28) 99914-1153</a><br>Rua Pedro Vargas, nº 82<br>Waldir Furtado Amorim<br>CEP 29313-780 · Cachoeiro de Itapemirim — ES';
}

document.querySelectorAll('a[href^="/contabilita/"]').forEach((link) => {
  link.href = link.getAttribute('href').replace('/contabilita/', base);
});
