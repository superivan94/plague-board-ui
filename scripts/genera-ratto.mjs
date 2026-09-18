// Genera `packages/plague-board-ui/src/brand/ratArt.ts` dalle tre reference in `art/reference/`.
//
//   npm run art:ratto                       # riscrive ratArt.ts
//   npm run art:ratto -- --anteprime <dir>  # e rende le anteprime PNG su fondo grigio in <dir>
//
// Il ratto dei Ludoratti è **ricalcato**, non disegnato a mano: le tre illustrazioni sono state
// generate il 2026-09-18 nello stile della mascotte con l'ampolla (il come sta in
// `art/reference/prompt-e-note.md`), e questo script le vettorizza. Il **corpo** viene dal grigio
// nudo, e i suoi colori diventano slot della livrea; i tre **kit** vengono dal bruno (teschio,
// collare con la pedina) e dal bianco (imbracatura con ampolla e dado), ritagliati in raster con
// una maschera dilatata attorno ai loro colori — perché nel ricalco libero il contorno d'inchiostro
// del teschio e quello della testa sono un percorso solo — e traslati sull'occhio del grigio.
//
// ⚠️ Tavolozza **fissa e nominata**, uguale per i tre disegni: con la quantizzazione libera il verde
// dell'ampolla si fondeva col cuoio e l'occhio rosso spariva nell'inchiostro, e i colori cambiavano
// da una corsa all'altra. Ogni pixel va al colore più vicino della tavolozza **prima** del ricalco.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const ImageTracer = require('imagetracerjs');

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const REFERENCE = join(RADICE, 'art', 'reference');
const USCITA = join(RADICE, 'packages', 'plague-board-ui', 'src', 'brand', 'ratArt.ts');
const ANTEPRIME = (() => {
  const i = process.argv.indexOf('--anteprime');
  return i >= 0 ? process.argv[i + 1] : null;
})();

const SCALA = 0.25; // 1536 → 384 unità: a 44px di altezza il ratto è ridotto trenta volte.
const RAGGIO = 9; // La dilatazione delle maschere, in pixel: il contorno d'inchiostro è largo otto.

// ── La tavolozza, misurata sugli istogrammi dei tre disegni ──────────────────────────────────────
const PALETTE = {
  ink: '#100020',
  greyFur: '#585860', greyShade: '#484850', greyBelly: '#e0e0e0', greyBellyShade: '#b8b8b8',
  brownFur: '#a86040', brownShade: '#884838', brownBelly: '#f8e0c0', brownBellyShade: '#e0c0a0',
  whiteFur: '#fdfdfd', whiteShade: '#c8d8e8',
  pink: '#f8b0a8', pinkShade: '#f09898',
  redEye: '#d01820',
  bone: '#f8f0e0',
  purple: '#703868',
  leather: '#604840',
  gold: '#d09040',
  green: '#86b84a', greenLight: '#b8e070',
  cream: '#f8ead0',
  glass: '#c0e8f8',
};
const NOMI = Object.keys(PALETTE);
const RGB = NOMI.map((n) => PALETTE[n].slice(1).match(/../g).map((h) => parseInt(h, 16)));
// ⚠️ La voce trasparente è (0,0,0,0), e ogni pixel trasparente deve essere **tutto** zero: il
// vettorizzatore misura la distanza su quattro canali, e un pixel con il colore lasciato dentro e
// solo l'alfa a zero resta più vicino al suo colore (255) che al trasparente (r+g+b).
const pal = [{ r: 0, g: 0, b: 0, a: 0 }, ...RGB.map(([r, g, b]) => ({ r, g, b, a: 255 }))];

const piuVicino = (r, g, b) => {
  let k = 0, d = 1e9;
  for (let i = 0; i < RGB.length; i++) {
    const [R, G, B] = RGB[i];
    const dd = (r - R) ** 2 + (g - G) ** 2 + (b - B) ** 2;
    if (dd < d) { d = dd; k = i; }
  }
  return k;
};
const azzera = (px, i) => { px[i * 4] = 0; px[i * 4 + 1] = 0; px[i * 4 + 2] = 0; px[i * 4 + 3] = 0; };

// Dilatazione quadrata separabile di una maschera binaria.
function dilata(m, W, H, raggio) {
  const b = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = 0;
    for (let dx = -raggio; dx <= raggio && !v; dx++) { const xx = x + dx; if (xx >= 0 && xx < W && m[y * W + xx]) v = 1; }
    b[y * W + x] = v;
  }
  const c = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = 0;
    for (let dy = -raggio; dy <= raggio && !v; dy++) { const yy = y + dy; if (yy >= 0 && yy < H && b[yy * W + x]) v = 1; }
    c[y * W + x] = v;
  }
  return c;
}

// ── Caricamento: via il fondo dai bordi, poi ogni pixel al colore più vicino della tavolozza ────
// `fusioni`: rettangoli dell'immagine in cui un colore si legge come un altro **prima** del
// despeckle. Servono dove il donatore trema fra due colori vicini — la carta dell'etichetta e il
// dado, fra crema e bianco-pelo — e il ricalco ne farebbe un mosaico di frammenti.
async function carica(nome, fusioni = []) {
  const { data, info } = await sharp(join(REFERENCE, `${nome}.png`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const px = new Uint8ClampedArray(data);
  // ⚠️ Il fondo si toglie **riempiendo dai bordi**, non cancellando il bianco: il pelo dell'albino
  // è bianco quanto il fondo, ma sta dentro il contorno d'inchiostro e il riempimento non ci arriva.
  const quasiBianco = (i) => px[i * 4] > 235 && px[i * 4 + 1] > 235 && px[i * 4 + 2] > 235;
  let fondo = new Uint8Array(W * H);
  const coda = [];
  const spingi = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = y * W + x;
    if (fondo[i] || !quasiBianco(i)) return;
    fondo[i] = 1; coda.push(i);
  };
  for (let x = 0; x < W; x++) { spingi(x, 0); spingi(x, H - 1); }
  for (let y = 0; y < H; y++) { spingi(0, y); spingi(W - 1, y); }
  while (coda.length) { const i = coda.pop(); const x = i % W, y = (i - x) / W; spingi(x + 1, y); spingi(x - 1, y); spingi(x, y + 1); spingi(x, y - 1); }
  // ⚠️ E si allarga di due pixel verso l'interno: sul bordo fra l'inchiostro e il bianco ci sono
  // pixel di antialiasing che il riempimento non prende (sono sotto 235) e che il ricalco
  // quantizza a inchiostro — un anello di trattini attorno a tutto il ratto.
  fondo = dilata(fondo, W, H, 2);

  let idx = new Int8Array(W * H).fill(-1);
  for (let i = 0; i < W * H; i++) {
    if (fondo[i]) continue;
    idx[i] = piuVicino(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
  }

  for (const f of fusioni) {
    const da = NOMI.indexOf(f.da), a = NOMI.indexOf(f.a);
    for (let y = f.y0; y < f.y1; y++) for (let x = f.x0; x < f.x1; x++) if (idx[y * W + x] === da) idx[y * W + x] = a;
  }

  // ⚠️ Despeckle: filtro di maggioranza 3×3 sull'indice, **una** passata, e **l'inchiostro non si
  // tocca**. La quantizzazione lascia pixel isolati e filetti da un pixel — antialiasing fra rosa e
  // inchiostro finito su «pancia» — e il ricalco trasforma ognuno in un percorso. Un pixel con meno
  // di tre vicini del suo colore prende il colore di maggioranza dei vicini. Non è uno sfocamento:
  // i bordi netti restano netti. ⚠️ Con due passate e senza la riserva sull'inchiostro morivano le
  // linee sottili — il teschietto sull'etichetta, i puntini del dado — perché una linea larga due
  // pixel non ha mai tre vicini uguali. Il trasparente non vince mai, così il contorno non si erode.
  const INK = NOMI.indexOf('ink');
  {
    const fuori = new Int8Array(idx);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const k = idx[i];
      if (k < 0 || k === INK) continue;
      const conteggio = new Map();
      let uguali = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const v = idx[i + dy * W + dx];
        if (v === k) uguali++;
        if (v >= 0) conteggio.set(v, (conteggio.get(v) ?? 0) + 1);
      }
      if (uguali >= 3) continue;
      let migliore = k, n = -1;
      for (const [v, c] of conteggio) if (c > n) { n = c; migliore = v; }
      fuori[i] = migliore;
    }
    idx = fuori;
  }

  for (let i = 0; i < W * H; i++) {
    const k = idx[i];
    if (k < 0) { azzera(px, i); continue; }
    [px[i * 4], px[i * 4 + 1], px[i * 4 + 2]] = RGB[k]; px[i * 4 + 3] = 255;
  }
  return { W, H, px, idx, pieno: idx.map((v) => (v >= 0 ? 1 : 0)) };
}

// ⚠️ `recinto` è un rettangolo dell'immagine donatrice fuori dal quale non si seminano pixel e
// non si dilata: serve perché alcuni colori dei kit sono quasi uguali a colori del pelo — il vetro
// dell'ampolla e l'ombra del pelo bianco distano 40 su 765 — e senza recinto tutta l'ombra del
// donatore diventa seme, e il suo inchiostro finisce nel kit.
function maschera({ W, H, idx }, colori, raggio, recinto) {
  const semi = new Set(colori.map((n) => NOMI.indexOf(n)));
  const a = new Uint8Array(W * H);
  for (let y = recinto.y0; y < recinto.y1; y++) for (let x = recinto.x0; x < recinto.x1; x++) {
    if (semi.has(idx[y * W + x])) a[y * W + x] = 1;
  }
  const d = dilata(a, W, H, raggio);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (x < recinto.x0 || x >= recinto.x1 || y < recinto.y0 || y >= recinto.y1) d[y * W + x] = 0;
  }
  return d;
}
const unisci = (a, b) => a.map((v, i) => v | b[i]);

// ⚠️ Semi **per riempimento**: da un punto dentro l'oggetto si prende tutto ciò che si raggiunge
// senza attraversare inchiostro o trasparente. Un rettangolo non sa separare il teschio dalla luce
// dell'orecchio che gli sta dietro, né il dado dal pelo che gli sta intorno; il contorno
// d'inchiostro sì, perché è chiuso. Un punto che cade sull'inchiostro non semina niente e lo dice.
function alluvione({ W, H, idx }, punti, nome) {
  const INK = NOMI.indexOf('ink');
  const m = new Uint8Array(W * H);
  const coda = [];
  for (const [x, y] of punti) {
    const i = y * W + x;
    if (idx[i] < 0 || idx[i] === INK) { console.warn(`  ⚠️ ${nome}: il punto (${x},${y}) cade su ${idx[i] < 0 ? 'trasparente' : 'inchiostro'}`); continue; }
    if (!m[i]) { m[i] = 1; coda.push(i); }
  }
  while (coda.length) {
    const i = coda.pop();
    const x = i % W, y = (i - x) / W;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      const j = yy * W + xx;
      if (m[j] || idx[j] < 0 || idx[j] === INK) continue;
      m[j] = 1; coda.push(j);
    }
  }
  return m;
}
// La maschera di un oggetto chiuso: il suo interno più l'inchiostro attorno, per dilatazione.
const attorno = (img, interno, raggio) => dilata(interno, img.W, img.H, raggio);
// Fonde a un colore i pixel di una regione — il dado, che dentro trema fra bianco e ombra.
function fondi(img, regione, nome) {
  const k = NOMI.indexOf(nome);
  for (let i = 0; i < img.W * img.H; i++) if (regione[i]) { img.idx[i] = k; [img.px[i * 4], img.px[i * 4 + 1], img.px[i * 4 + 2]] = RGB[k]; img.px[i * 4 + 3] = 255; }
}

// ── Ricalco di un raster (eventualmente mascherato) → percorsi con il nome del colore ───────────
// `tieni` filtra ai colori del pezzo; `rinomina` fonde i colori spuri (il bianco del dado → cream).
// `pathomit` è il numero di punti sotto cui un percorso si butta: al corpo serve basso, o si
// perdono i baffi più fini; ai kit alto, o restano le briciole dei bordi.
function ricalca({ W, H, px }, mask, tieni, rinomina = {}, pathomit = 32) {
  const copia = new Uint8ClampedArray(px);
  if (mask) for (let i = 0; i < W * H; i++) if (!mask[i]) azzera(copia, i);
  const svg = ImageTracer.imagedataToSVG(
    { width: W, height: H, data: copia },
    { pal, colorquantcycles: 1, ltres: 2.5, qtres: 2.5, pathomit, strokewidth: 0, blurradius: 0, roundcoords: 1, viewbox: true, desc: false, layering: 0 },
  );
  const percorsi = [];
  for (const m of svg.matchAll(/<path ([^>]*)\/>/g)) {
    const attrs = m[1];
    const fill = attrs.match(/fill="rgb\((\d+),(\d+),(\d+)\)"/);
    const op = attrs.match(/opacity="([\d.]+)"/);
    if (!fill || (op && Number(op[1]) < 0.5)) continue;
    let nome = NOMI[piuVicino(+fill[1], +fill[2], +fill[3])];
    nome = rinomina[nome] ?? nome;
    if (tieni && !tieni.has(nome)) continue;
    const d = attrs.match(/ d="([^"]*)"/)?.[1];
    if (d) percorsi.push({ nome, d });
  }
  return percorsi;
}

// Trasla e scala le coordinate di un `d` (comandi M L Q Z con coppie assolute, come li scrive il
// vettorizzatore). Interi: a 384 unità di larghezza, un'unità è un quinto di pixel a 44 di altezza.
function trasforma(d, dx, dy) {
  let parita = 0;
  return d.replace(/-?\d+(?:\.\d+)?/g, (n) => {
    const v = (Number(n) + (parita === 0 ? dx : dy)) * SCALA;
    parita ^= 1;
    return String(Math.round(v));
  }).replace(/\s+/g, ' ').trim();
}

// ── Montaggio ────────────────────────────────────────────────────────────────────────────────────
const grigio = await carica('ludoratto-grigio');
const bruno = await carica('ludoratto-bruno-teschio');

// La sonda (`SONDA=1`): i riquadri dei colori dei kit dopo la quantizzazione, per scegliere i
// punti di riempimento dai numeri invece che a occhio — un punto sull'inchiostro non semina niente.
const sonda = (img, nome, colori) => {
  if (!process.env.SONDA) return;
  console.log(`— ${nome}`);
  for (const c of colori) {
    const k = NOMI.indexOf(c);
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, n = 0, sx = 0, sy = 0;
    for (let y = 0; y < img.H; y++) for (let x = 0; x < img.W; x++) if (img.idx[y * img.W + x] === k) {
      n++; sx += x; sy += y;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    if (n) console.log(`  ${c.padEnd(11)} x ${x0}–${x1}  y ${y0}–${y1}  baricentro (${Math.round(sx / n)},${Math.round(sy / n)})  ${n} px`);
  }
};

// Le componenti connesse (4-vicinato) di un colore dentro un recinto, dalla più grande: è quello
// che distingue il teschio — un pezzo grande — dal bordo chiaro dell'orecchio dello stesso colore,
// che è una mezzaluna sottile staccata da lui dal suo stesso inchiostro.
function componenti({ W, H, idx }, colore, recinto) {
  const k = NOMI.indexOf(colore);
  const visto = new Uint8Array(W * H);
  const trovate = [];
  for (let y = recinto.y0; y < recinto.y1; y++) for (let x = recinto.x0; x < recinto.x1; x++) {
    const s = y * W + x;
    if (visto[s] || idx[s] !== k) continue;
    const pixel = [];
    const coda = [s]; visto[s] = 1;
    let x0 = x, x1 = x, y0 = y, y1 = y;
    while (coda.length) {
      const i = coda.pop(); pixel.push(i);
      const cx = i % W, cy = (i - cx) / W;
      if (cx < x0) x0 = cx; if (cx > x1) x1 = cx; if (cy < y0) y0 = cy; if (cy > y1) y1 = cy;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const xx = cx + dx, yy = cy + dy;
        if (xx < recinto.x0 || yy < recinto.y0 || xx >= recinto.x1 || yy >= recinto.y1) continue;
        const j = yy * W + xx;
        if (!visto[j] && idx[j] === k) { visto[j] = 1; coda.push(j); }
      }
    }
    trovate.push({ pixel, n: pixel.length, x0, x1, y0, y1 });
  }
  return trovate.sort((a, b) => b.n - a.n);
}
if (process.env.SONDA) {
  console.log('— componenti di osso nel recinto del teschio');
  for (const c of componenti(bruno, 'bone', { x0: 1000, y0: 90, x1: 1530, y1: 415 }).slice(0, 8)) console.log(`  ${String(c.n).padStart(6)} px  x ${c.x0}–${c.x1}  y ${c.y0}–${c.y1}`);
}
sonda(bruno, 'bruno', ['bone', 'leather', 'gold', 'purple']);
// Sul bianco, etichetta e dado tremano fra crema e bianco-pelo: si leggono crema, nei loro rettangoli.
const bianco = await carica('ludoratto-bianco-pozione', [
  { x0: 770, y0: 250, x1: 930, y1: 420, da: 'whiteFur', a: 'cream' },
]);
sonda(bianco, 'bianco', ['green', 'greenLight', 'glass', 'cream', 'leather', 'gold']);
// Il dado: il suo interno per riempimento, fuso a crema — dentro trema fra bianco e ombra, e le
// briciole crema che ne restavano erano gli unici semi che lo tenevano nel kit.
const dado = alluvione(bianco, [[895, 545]], 'dado');
fondi(bianco, dado, 'cream');

// Il corpo: i colori del grigio diventano **slot** della livrea. I pochi percorsi finiti su bone /
// brownBelly sono luci della pancia grigia quantizzate male: vanno con la pancia. Il puntino bianco
// nell'occhio è la luce.
const corpo = ricalca(grigio, null, null, { brownBelly: 'greyBelly', bone: 'greyBelly' });

// I recinti, misurati sulle reference: il teschio con la cinghia sta sulla testa del bruno (i baffi
// cominciano a y 420), il collare con la pedina alla gola, l'imbracatura sul dorso del bianco (la
// coda finisce a x 600, l'orecchio comincia a x 1040). Il **collo** dell'ampolla è vetro e non
// tocca il verde: si semina a parte, in un recinto stretto dove l'ombra del pelo bianco — quasi lo
// stesso colore — non arriva.
// ⚠️ Il teschio è la **componente connessa più grande** dell'osso, non tutto l'osso: nel bruno il
// bordo dell'orecchio è un anello crema dello stesso `#f8f0e0` — 4.683 px a x 1000–1110, staccato
// dal teschio (14.090 px a x 1064–1459) dal suo stesso inchiostro. Per colore non si separano, e
// per rettangolo nemmeno, perché si sovrappongono in x. Sul grigio e sul bruno quell'anello
// arrivava nel kit come una macchia bianca sull'orecchio. La cinghia è aperta e si semina per
// colore nel suo rettangolo.
// Semi dalle `quante` componenti più grandi di un colore in un recinto: il pezzo vero è grande e
// il rumore del pelo quantizzato a quel colore è briciole. Il recinto può essere generoso.
// `quante` è un numero (le N più grandi) oppure `{ almeno }`: tutte quelle sopra una soglia di
// pixel. ⚠️ Il collare è **due** componenti — la pedina lo spezza con il suo inchiostro, e il pezzo
// sotto la mascella, a destra della pedina, con «la più grande» restava fuori. Segnalato dall'utente.
const semiComponenti = (img, colore, recinto, quante = 1) => {
  const s = new Uint8Array(img.W * img.H);
  const tutte = componenti(img, colore, recinto);
  const scelte = typeof quante === 'number' ? tutte.slice(0, quante) : tutte.filter((c) => c.n >= quante.almeno);
  if (process.env.SONDA) console.log(`  ${colore.padEnd(8)} componenti: ${tutte.slice(0, 6).map((c) => c.n).join(' ')} → tenute ${scelte.length}`);
  for (const c of scelte) for (const i of c.pixel) s[i] = 1;
  return s;
};
// ⚠️ La cinghia scende dal teschio **verso sinistra e in basso**, dietro la mascella, a x 1040–1140:
// un rettangolo a x 1130–1260 la cercava sulla guancia, dove prendeva l'ombra del pelo bruno
// quantizzata a cuoio — i frammenti bruni e il blocco nero sotto il teschio. E il rename
// `brownShade → ink` trasformava in inchiostro ogni ombra di pelo finita nella maschera: via.
const RECINTO_TESCHIO = { x0: 1000, y0: 90, x1: 1530, y1: 415 };
const RECINTO_CINGHIA = { x0: 1020, y0: 280, x1: 1170, y1: 460 };
const mTeschio = unisci(
  unisci(
    attorno(bruno, semiComponenti(bruno, 'bone', RECINTO_TESCHIO), RAGGIO),
    attorno(bruno, semiComponenti(bruno, 'leather', RECINTO_CINGHIA, 2), RAGGIO),
  ),
  attorno(bruno, semiComponenti(bruno, 'gold', RECINTO_CINGHIA, 1), RAGGIO),
);
const teschio = ricalca(bruno, mTeschio, new Set(['bone', 'leather', 'gold', 'ink']), {}, 48);
// Il collare comincia a y 320 e a x 960 — dietro la mascella, non sotto — e finisce con la pedina
// a y 600: il recinto vecchio (380–660, da x 1040) lo tagliava in alto e a sinistra.
const RECINTO_COLLARE = { x0: 930, y0: 300, x1: 1220, y1: 660 };
const mCollare = unisci(
  // Tre componenti in tutto nel recinto — 13.106, 349, 142 px — e nessun rumore: si tengono tutte.
  attorno(bruno, semiComponenti(bruno, 'purple', RECINTO_COLLARE, { almeno: 100 }), RAGGIO),
  attorno(bruno, semiComponenti(bruno, 'gold', RECINTO_COLLARE, 3), RAGGIO),
);
const collare = ricalca(bruno, mCollare, new Set(['purple', 'gold', 'ink']), {}, 48);
// L'imbracatura: cinghie, fibbie, liquido, bolle, etichetta e tappo per colore nel loro
// rettangolo; il vetro del collo — che non tocca il verde e somiglia all'ombra del pelo bianco — nel
// suo rettangolo stretto; il dado per riempimento, perché non ha un colore suo.
const mImbracatura = unisci(
  unisci(
    maschera(bianco, ['leather', 'green', 'greenLight', 'cream', 'gold'], RAGGIO, { x0: 690, y0: 80, x1: 1010, y1: 740 }),
    maschera(bianco, ['glass', 'whiteShade'], RAGGIO, { x0: 770, y0: 80, x1: 980, y1: 340 }),
  ),
  attorno(bianco, dado, RAGGIO),
);
const imbracatura = ricalca(bianco, mImbracatura, new Set(['leather', 'green', 'greenLight', 'cream', 'glass', 'gold', 'ink']), { whiteFur: 'cream', greyBelly: 'cream', whiteShade: 'glass' }, 48);

// Traslazioni misurate sugli occhi: grigio (1223,393), bruno (1205,371), bianco (1240,421).
const T_BRUNO = [18, 22];
const T_BIANCO = [-17, -28];

// La cornice: i pixel pieni del grigio più le maschere dei kit, traslate. È **una sola**, con o
// senza kit: in uno sciame i ratti hanno tutti la stessa scatola.
let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
const estendi = (m, W, H, [dx, dy]) => {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (m[y * W + x]) {
    const X = x + dx, Y = y + dy;
    if (X < minX) minX = X; if (X > maxX) maxX = X; if (Y < minY) minY = Y; if (Y > maxY) maxY = Y;
  }
};
estendi(grigio.pieno, grigio.W, grigio.H, [0, 0]);
estendi(mTeschio, bruno.W, bruno.H, T_BRUNO);
estendi(mCollare, bruno.W, bruno.H, T_BRUNO);
estendi(mImbracatura, bianco.W, bianco.H, T_BIANCO);
const vb = {
  x: Math.floor(minX * SCALA) - 1, y: Math.floor(minY * SCALA) - 1,
  width: Math.ceil(maxX * SCALA) - Math.floor(minX * SCALA) + 2, height: Math.ceil(maxY * SCALA) - Math.floor(minY * SCALA) + 2,
};

const SLOT_CORPO = { ink: 'ink', greyFur: 'fur', greyShade: 'shade', greyBelly: 'belly', greyBellyShade: 'bellyShade', pink: 'pink', pinkShade: 'pinkShade', redEye: 'eye', whiteFur: 'highlight' };
const scalato = (percorsi, [dx, dy], slot = (n) => n) => percorsi.map((p) => ({ c: slot(p.nome), d: trasforma(p.d, dx, dy) }));
const ART = {
  body: scalato(corpo, [0, 0], (n) => SLOT_CORPO[n] ?? 'belly'),
  skull: scalato(teschio, T_BRUNO),
  collar: scalato(collare, T_BRUNO),
  harness: scalato(imbracatura, T_BIANCO),
};

const conta = (p) => JSON.stringify(p.reduce((m, x) => ((m[x.c] = (m[x.c] ?? 0) + 1), m), {}));
for (const k of Object.keys(ART)) console.log(k.padEnd(8), String(ART[k].length).padStart(3), conta(ART[k]));
console.log('viewBox ', vb);

// ── Il modulo dati per la libreria ───────────────────────────────────────────────────────────────
const KIT_COLORI = ['ink', 'bone', 'leather', 'gold', 'purple', 'green', 'greenLight', 'cream', 'glass'];
const riga = (p) => `  { c: '${p.c}', d: '${p.d}' },`;
const modulo = `// ⚠️ **File generato**: non si modifica a mano. Lo scrive \`scripts/genera-ratto.mjs\` a partire dalle
// tre reference in \`art/reference/\`, e si rigenera con \`npm run art:ratto\` quando cambiano loro.
//
// Il ratto dei Ludoratti, ricalcato dalle tre illustrazioni generate il 2026-09-18 nello stile
// della mascotte con l'ampolla: il **corpo** viene dal grigio nudo e i suoi colori sono **slot**
// della livrea; i tre **kit** vengono dal bruno (teschio, collare con la pedina) e dal bianco
// (imbracatura con ampolla e dado), ritagliati con una maschera raster attorno ai loro colori e
// traslati sull'occhio del grigio. Coordinate in quarti di pixel della reference (1536 → 384).

/** I colori del corpo che la livrea riempie. */
export type RatBodySlot = ${[...new Set(Object.values(SLOT_CORPO))].map((s) => `'${s}'`).join(' | ')};

/** I colori fissi dei kit, uguali per ogni livrea. */
export const RAT_KIT_COLORS = {
${KIT_COLORI.map((n) => `  ${n}: '${PALETTE[n]}',`).join('\n')}
} as const;
export type RatKitColor = keyof typeof RAT_KIT_COLORS;

export interface RatPath<C extends string> {
  readonly c: C;
  readonly d: string;
}

/** La cornice che contiene il ratto con **tutto** addosso: è una sola, con o senza kit. */
export const RAT_VIEW_BOX = { x: ${vb.x}, y: ${vb.y}, width: ${vb.width}, height: ${vb.height} } as const;

export const RAT_BODY: readonly RatPath<RatBodySlot>[] = [
${ART.body.map(riga).join('\n')}
];

export const RAT_SKULL: readonly RatPath<RatKitColor>[] = [
${ART.skull.map(riga).join('\n')}
];

export const RAT_COLLAR: readonly RatPath<RatKitColor>[] = [
${ART.collar.map(riga).join('\n')}
];

export const RAT_HARNESS: readonly RatPath<RatKitColor>[] = [
${ART.harness.map(riga).join('\n')}
];
`;
writeFileSync(USCITA, modulo, 'utf8');
console.log(`ratArt.ts: ${(modulo.length / 1024).toFixed(1)} KB`);

// ── Anteprime, a richiesta ───────────────────────────────────────────────────────────────────────
if (ANTEPRIME) {
  mkdirSync(ANTEPRIME, { recursive: true });
  const GRIGIA = { ink: PALETTE.ink, fur: PALETTE.greyFur, shade: PALETTE.greyShade, belly: PALETTE.greyBelly, bellyShade: PALETTE.greyBellyShade, pink: PALETTE.pink, pinkShade: PALETTE.pinkShade, eye: PALETTE.redEye, highlight: '#ffffff' };
  const g = (percorsi, colori) => `<g>${percorsi.map((p) => `<path fill="${colori[p.c] ?? PALETTE[p.c]}" d="${p.d}"/>`).join('')}</g>`;
  const testa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x} ${vb.y} ${vb.width} ${vb.height}" width="${vb.width * 2}" height="${vb.height * 2}">`;
  const varianti = {
    corpo: [g(ART.body, GRIGIA)],
    teschio: [g(ART.body, GRIGIA), g(ART.collar, {}), g(ART.skull, {})],
    ampolla: [g(ART.body, GRIGIA), g(ART.harness, {})],
    tutto: [g(ART.body, GRIGIA), g(ART.collar, {}), g(ART.harness, {}), g(ART.skull, {})],
  };
  for (const [nome, gruppi] of Object.entries(varianti)) {
    const svg = `${testa}${gruppi.join('')}</svg>`;
    await sharp(Buffer.from(svg), { density: 96 }).resize({ width: 900 }).flatten({ background: '#9ca3af' }).png().toFile(join(ANTEPRIME, `ratto-${nome}.png`));
  }
  console.log(`anteprime in ${ANTEPRIME}`);
}
