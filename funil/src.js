import './style.css';

const form = document.querySelector('#funnel');
const steps = [...document.querySelectorAll('.step')];
const next = document.querySelector('#next');
const back = document.querySelector('#back');
const error = document.querySelector('#error');
const label = document.querySelector('#step-label');
const bar = document.querySelector('#progress-bar');
const success = document.querySelector('#success');
let current = 0;

const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const query = new URLSearchParams(location.search);
utmKeys.forEach((key) => {
  if (query.get(key)) sessionStorage.setItem(key, query.get(key));
});

function render() {
  steps.forEach((step, index) => step.classList.toggle('active', index === current));
  label.textContent = `Etapa ${current + 1} de ${steps.length}`;
  bar.style.width = `${((current + 1) / steps.length) * 100}%`;
  back.style.visibility = current ? 'visible' : 'hidden';
  next.innerHTML = current === steps.length - 1 ? 'Ver meu diagnóstico <span>→</span>' : 'Continuar <span>→</span>';
  error.textContent = '';
  document.querySelector('section').scrollTop = 0;
}

function validateStep() {
  const required = [...steps[current].querySelectorAll('[required]')];
  const invalid = required.find((field) => {
    if (field.type === 'radio') return !form.querySelector(`[name="${field.name}"]:checked`);
    if (field.type === 'checkbox') return !field.checked;
    return !field.checkValidity();
  });
  if (invalid) {
    error.textContent = invalid.type === 'radio' ? 'Escolha uma opção para continuar.' : 'Preencha os campos obrigatórios para continuar.';
    invalid.focus();
    return false;
  }
  return true;
}

async function finish() {
  const data = Object.fromEntries(new FormData(form));
  const lead = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    origem: 'funil-diagnostico',
    pagina_de_origem: location.href,
    nome: data.nome?.trim(),
    telefone: data.telefone?.trim(),
    email: data.email?.trim(),
    cidade: data.cidade?.trim(),
    interesse: data.interesse,
    tipo_de_cliente: data.tipo,
    prazo: data.prazo,
    mensagem: data.mensagem?.trim(),
    consentimento: Boolean(data.consentimento),
    ...Object.fromEntries(utmKeys.map((key) => [key, sessionStorage.getItem(key) || ''])),
  };

  const endpoint = import.meta.env.VITE_LEAD_ENDPOINT;
  if (endpoint) {
    try {
      await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
    } catch {
      // O WhatsApp permanece como rota de contingência.
    }
  }

  const message = [
    'Olá! Fiz o diagnóstico no site da Contabilita.',
    '',
    `Nome: ${lead.nome}`,
    `WhatsApp: ${lead.telefone}`,
    `Interesse: ${lead.interesse}`,
    `Situação: ${lead.tipo_de_cliente}`,
    `Prazo: ${lead.prazo}`,
    lead.cidade ? `Cidade: ${lead.cidade}` : '',
    lead.mensagem ? `Detalhes: ${lead.mensagem}` : '',
  ].filter(Boolean).join('\n');

  document.querySelector('#whatsapp').href = `https://wa.me/5528999141153?text=${encodeURIComponent(message)}`;
  form.hidden = true;
  document.querySelector('.topbar').hidden = true;
  document.querySelector('.progress').hidden = true;
  success.hidden = false;
}

next.addEventListener('click', async () => {
  if (!validateStep()) return;
  if (current < steps.length - 1) {
    current += 1;
    render();
  } else {
    next.disabled = true;
    next.textContent = 'Preparando...';
    await finish();
    next.disabled = false;
  }
});

back.addEventListener('click', () => {
  if (current > 0) current -= 1;
  render();
});

document.querySelectorAll('input[type="radio"]').forEach((input) => {
  input.addEventListener('change', () => {
    error.textContent = '';
    if (matchMedia('(min-width: 700px)').matches) setTimeout(() => next.click(), 180);
  });
});

document.querySelector('input[name="telefone"]').addEventListener('input', (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 11);
  event.target.value = digits.length > 10
    ? digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
    : digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
});

document.querySelector('#restart').addEventListener('click', () => {
  form.reset();
  current = 0;
  success.hidden = true;
  form.hidden = false;
  document.querySelector('.topbar').hidden = false;
  document.querySelector('.progress').hidden = false;
  render();
});

render();
