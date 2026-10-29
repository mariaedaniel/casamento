# Convite Daniel & Maria — como colocar no ar

O pacote tem duas partes:

- `site/` — é o convite. `index.html` + `og-image.jpg` (a imagem que aparece na prévia do WhatsApp). É só essa pasta que vai para a hospedagem.
- `planilha-apps-script.gs` — o código que recebe as confirmações e grava na planilha.

Faça na ordem abaixo. Leva uns 15 minutos.

---

## 1. Criar a planilha de confirmações

1. Crie uma planilha nova no Google Sheets (ex.: "Confirmações casamento").
2. Menu **Extensões → Apps Script**.
3. Apague o que estiver no editor, cole todo o conteúdo de `planilha-apps-script.gs` e clique em **Salvar**.
4. Clique em **Implantar → Nova implantação**.
   - Engrenagem → tipo **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Clique em **Implantar** e autorize com sua conta Google. Se aparecer "O Google não verificou este app", clique em **Avançado → Acessar (não seguro)**. É o seu próprio script, então é normal.
6. Copie o **URL do app da Web** (termina em `/exec`).
7. Teste: cole esse endereço no navegador. Deve aparecer `"Confirmações do casamento ativas"`.

Cada pessoa confirmada vira **uma linha**:

| Data/hora | Nome | Grupo | Pessoas no grupo | Confirmado por | Recado |
|---|---|---|---|---|---|
| 02/11/2026 14:10 | Ana Souza | 3F9A1C | 3 | Ana Souza | Sem glúten |
| 02/11/2026 14:10 | Bruno Lima | 3F9A1C | 3 | Ana Souza | |
| 02/11/2026 14:10 | Carla Lima | 3F9A1C | 3 | Ana Souza | |

O "Grupo" mostra quem confirmou junto. Para o total de convidados, use `=CONT.VALORES(B2:B)`.

> Se um dia você alterar o código do script: **Implantar → Gerenciar implantações → lápis → Versão: Nova versão**. Assim o endereço `/exec` continua o mesmo.

## 2. Ligar o convite à planilha

Abra `site/index.html` em qualquer editor de texto (Bloco de Notas, VS Code) e procure o bloco `CONFIG`, perto do fim:

```js
planilhaUrl: "",        // ← cole aqui o endereço /exec
...
endereco: "",           // ← rua e número do cartório, quando confirmar
```

Enquanto `planilhaUrl` estiver vazio, o formulário avisa que a confirmação ainda não está ativa. Assim ninguém acha que confirmou sem ter confirmado.

## 3. Hospedar

### Opção recomendada: Netlify Drop (grátis, sem programação)
1. Acesse **app.netlify.com/drop** e crie uma conta gratuita. Sem conta, o site é apagado depois de algum tempo.
2. Arraste a pasta `site` para a página. Em segundos você recebe um link.
3. **Site configuration → Change site name** → `daniel-e-maria` → o link vira `daniel-e-maria.netlify.app`.
4. Para atualizar depois: aba **Deploys** → arraste a pasta `site` de novo.

### Outras opções gratuitas
- **Cloudflare Pages** — também aceita upload direto da pasta, muito rápido no Brasil.
- **Vercel** — parecido com o Netlify; melhor se você já usa GitHub.
- **GitHub Pages** — grátis e estável, mas exige criar um repositório. Link fica `seuusuario.github.io/convite`.

### Domínio próprio (opcional)
Registre algo como `danielemaria.com.br` no registro.br (cobrança anual) e conecte em **Domain management** no Netlify. Fica mais bonito no WhatsApp, mas o `.netlify.app` funciona igual.

## 4. Prévia bonita no WhatsApp

O WhatsApp só mostra a imagem se o endereço for completo. Depois de saber o link final, troque `SEU-SITE.netlify.app` (aparece 3 vezes no topo do `index.html`) pelo seu endereço real e suba a pasta de novo.

Teste mandando o link para você mesmo. O WhatsApp guarda a prévia em cache, então, se mudou algo e ela não atualizou, teste com `?v=2` no fim do link.

## Extras

- **Link direto para a confirmação:** `seulink/#confirmar` pula o envelope e vai direto ao formulário. Útil para lembrar quem ainda não confirmou.
- **Salvar na agenda:** "Google Agenda" abre o Google Agenda do convidado com o evento preenchido (19/12, 10h–15h, local e descrição), e ele toca em salvar. "iPhone / Outlook" baixa um arquivo `.ics` que abre direto no calendário do celular, com lembrete um dia antes. Nada disso passa por você. O evento fica só na agenda de quem salvou.
