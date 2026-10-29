/**
 * Confirmações do casamento Daniel & Maria
 * Cole este código em Extensões → Apps Script, dentro da planilha de confirmações.
 * Cada pessoa confirmada vira uma linha. Pessoas confirmadas juntas recebem o mesmo "Grupo".
 */

const ABA = 'Confirmações';
const CABECALHO = ['Data/hora', 'Nome', 'Grupo', 'Pessoas no grupo', 'Confirmado por', 'Recado'];
const MAX_PESSOAS = 10;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const dados = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const nomes = (Array.isArray(dados.nomes) ? dados.nomes : [])
      .map(n => limpar(n, 80))
      .filter(n => n.length >= 2)
      .slice(0, MAX_PESSOAS);

    if (!nomes.length) return resposta({ ok: false, erro: 'Nenhum nome recebido' });

    const aba = obterAba();
    const grupo = Utilities.getUuid().slice(0, 6).toUpperCase();
    const agora = new Date();
    const recado = limpar(dados.recado, 500);

    const linhas = nomes.map((nome, i) => [
      agora,
      nome,
      grupo,
      nomes.length,
      nomes[0],
      i === 0 ? recado : ''
    ]);

    aba.getRange(aba.getLastRow() + 1, 1, linhas.length, CABECALHO.length).setValues(linhas);
    return resposta({ ok: true, grupo: grupo, total: linhas.length });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Abrir o endereço /exec no navegador mostra se está ativo. */
function doGet() {
  return resposta({ ok: true, mensagem: 'Confirmações do casamento ativas' });
}

function obterAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA);
  if (!aba) aba = planilha.insertSheet(ABA);
  if (aba.getLastRow() === 0) {
    aba.appendRow(CABECALHO);
    aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
    aba.setFrozenRows(1);
    aba.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm');
  }
  return aba;
}

/** Remove espaços extras e impede que um nome vire fórmula na planilha. */
function limpar(valor, max) {
  let t = String(valor || '').replace(/\s+/g, ' ').trim().slice(0, max);
  if (/^[=+\-@]/.test(t)) t = "'" + t;
  return t;
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Opcional: rode esta função uma vez pelo editor para testar a gravação. */
function testar() {
  const r = doPost({ postData: { contents: JSON.stringify({ nomes: ['Teste Um', 'Teste Dois'], recado: 'teste' }) } });
  Logger.log(r.getContent());
}
