# Entregas digitais da Contabilita

O repositório contém três aplicações independentes:

| Entrega | Diretório | Build | Subdomínio sugerido |
| --- | --- | --- | --- |
| Site institucional | raiz | `npm run build` | `www` |
| Landing page | `landing/` | `npm run build --prefix landing` | `diagnostico` ou `comece` |
| Funil de formulário | `funil/` | `npm run build --prefix funil` | `form` ou `atendimento` |

Cada aplicação gera sua própria pasta `dist` e pode ser conectada separadamente a uma hospedagem.

## Integração

- Na landing, configure `VITE_FUNNEL_URL` com a URL pública do funil.
- No funil, `VITE_LEAD_ENDPOINT` é opcional. Sem ele, a conclusão continua normalmente pelo WhatsApp.
- Parâmetros UTM são preservados entre a landing e o funil.
