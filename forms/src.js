import './style.css';

const form=document.querySelector('#conversation'),screens=[...form.querySelectorAll('.screen')],result=document.querySelector('#result'),bar=document.querySelector('#progress'),stepText=document.querySelector('#step-text'),previous=document.querySelector('#previous'),next=document.querySelector('#next');
const keys=['a','b','c','d','e'],utmKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
let current=0;
const query=new URLSearchParams(location.search);
utmKeys.forEach(k=>{if(query.get(k))sessionStorage.setItem(k,query.get(k))});

const active=()=>screens[current];
function update(){
  screens.forEach((s,i)=>s.classList.toggle('active',i===current));
  bar.style.width=`${current?current/(screens.length-1)*100:0}%`;
  stepText.textContent=current?`${current} de ${screens.length-1}`:'Começar';
  previous.disabled=current===0;next.disabled=current===screens.length-1;
  setTimeout(()=>active().querySelector('input:not([type="radio"]):not([type="checkbox"]),textarea')?.focus(),260);
}
function error(message){const el=active().querySelector('.error');if(el)el.textContent=message}
function valid(){
  const bad=[...active().querySelectorAll('[required]')].find(el=>el.type==='radio'?!form.querySelector(`[name="${el.name}"]:checked`):el.type==='checkbox'?!el.checked:!el.checkValidity());
  if(!bad)return true;
  error(bad.type==='radio'?'Escolha uma opção para continuar.':'Preencha este campo para continuar.');bad.focus();return false;
}
function forward(){if(!valid())return;if(current<screens.length-1){if(form.nome.value.trim())document.querySelector('[data-name]').textContent=form.nome.value.trim();current++;update()}}
function back(){if(current){current--;update()}}
document.querySelectorAll('[data-next]').forEach(b=>b.onclick=forward);previous.onclick=back;next.onclick=forward;
document.querySelectorAll('input[type="radio"]').forEach(r=>r.onchange=()=>{error('');setTimeout(forward,220)});
document.addEventListener('keydown',e=>{
  if(!result.hidden)return;
  if(e.key==='Enter'&&!e.shiftKey&&document.activeElement?.tagName!=='TEXTAREA'){e.preventDefault();current===screens.length-1?document.querySelector('#finish').click():forward()}
  const radios=[...active().querySelectorAll('input[type="radio"]')],i=keys.indexOf(e.key.toLowerCase());
  if(radios[i]){radios[i].checked=true;radios[i].dispatchEvent(new Event('change'))}
  if(e.key==='ArrowUp')back();
});
form.telefone.oninput=e=>{const d=e.target.value.replace(/\D/g,'').slice(0,11);e.target.value=d.length>10?d.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3'):d.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3')};
document.querySelector('#finish').onclick=async()=>{
  if(!valid())return;
  const d=Object.fromEntries(new FormData(form)),lead={id:crypto.randomUUID(),created_at:new Date().toISOString(),origem:'forms-interativo',pagina_de_origem:location.href,nome:d.nome?.trim(),telefone:d.telefone?.trim(),email:d.email?.trim(),cidade:d.cidade?.trim(),interesse:d.interesse,tipo_de_cliente:d.tipo,prazo:d.prazo,mensagem:d.mensagem?.trim(),consentimento:Boolean(d.consentimento),...Object.fromEntries(utmKeys.map(k=>[k,sessionStorage.getItem(k)||'']))};
  const endpoint=import.meta.env.VITE_LEAD_ENDPOINT;if(endpoint){try{await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lead)})}catch{}}
  const text=['Olá! Concluí o diagnóstico interativo da Contabilita.','',`Nome: ${lead.nome}`,`WhatsApp: ${lead.telefone}`,`Interesse: ${lead.interesse}`,`Situação: ${lead.tipo_de_cliente}`,`Prazo: ${lead.prazo}`,lead.cidade?`Cidade: ${lead.cidade}`:'',lead.mensagem?`Contexto: ${lead.mensagem}`:''].filter(Boolean).join('\n');
  document.querySelector('[data-result-name]').textContent=lead.nome;
  document.querySelector('#summary').innerHTML=`<span><small>Objetivo</small>${lead.interesse}</span><span><small>Cenário</small>${lead.tipo_de_cliente}</span><span><small>Prazo</small>${lead.prazo}</span>`;
  document.querySelector('#whatsapp').href=`https://wa.me/5528999141153?text=${encodeURIComponent(text)}`;
  form.hidden=true;result.hidden=false;document.querySelector('.controls').hidden=true;stepText.textContent='Concluído';bar.style.width='100%';
};
document.querySelector('#restart').onclick=()=>{form.reset();current=0;result.hidden=true;form.hidden=false;document.querySelector('.controls').hidden=false;update()};
update();
