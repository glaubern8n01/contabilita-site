import './style.css';

document.querySelector('#year').textContent = new Date().getFullYear();

const link = document.querySelector('#funnel-link');
const funnelUrl = import.meta.env.VITE_FUNNEL_URL;
if (funnelUrl) link.href = funnelUrl;

const params = new URLSearchParams(location.search);
if ([...params].length) {
  const target = new URL(link.href, location.href);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
    if (params.get(key)) target.searchParams.set(key, params.get(key));
  });
  link.href = target.toString();
}
