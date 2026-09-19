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

// Traslazioni misurate sugli occhi: grigio (1223,393), bruno (1205,371), bianco (1240,421). I kit
// e i loro perni si appoggiano sul corpo grigio con questi spostamenti.
const T_BRUNO = [18, 22];
const T_BIANCO = [-17, -28];

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
// ⚠️ L'orbita è un'ellisse scura larga 50 px circondata dall'osso: i suoi pixel sono inchiostro,
// ma la dilatazione di 9 dal bordo dell'osso non arriva al centro, e restava un buco che mostrava
// il pelo. Tutto ciò che l'osso circonda è teschio: i buchi della maschera si riempiono.
function riempiBuchi(m, W, H) {
  const fuori = new Uint8Array(W * H);
  const coda = [];
  const spingi = (i) => { if (!fuori[i] && !m[i]) { fuori[i] = 1; coda.push(i); } };
  for (let x = 0; x < W; x++) { spingi(x); spingi((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { spingi(y * W); spingi(y * W + W - 1); }
  while (coda.length) {
    const i = coda.pop();
    const x = i % W, y = (i - x) / W;
    if (x > 0) spingi(i - 1); if (x < W - 1) spingi(i + 1); if (y > 0) spingi(i - W); if (y < H - 1) spingi(i + W);
  }
  const pieno = new Uint8Array(m);
  for (let i = 0; i < W * H; i++) if (!m[i] && !fuori[i]) pieno[i] = 1;
  return pieno;
}
const mTeschio = unisci(
  unisci(
    attorno(bruno, riempiBuchi(semiComponenti(bruno, 'bone', RECINTO_TESCHIO), bruno.W, bruno.H), RAGGIO),
    attorno(bruno, semiComponenti(bruno, 'leather', RECINTO_CINGHIA, 2), RAGGIO),
  ),
  attorno(bruno, semiComponenti(bruno, 'gold', RECINTO_CINGHIA, 1), RAGGIO),
);
if (process.env.SONDA) {
  const dentro = new Map();
  for (let i = 0; i < bruno.W * bruno.H; i++) if (mTeschio[i] && bruno.idx[i] >= 0) dentro.set(NOMI[bruno.idx[i]], (dentro.get(NOMI[bruno.idx[i]]) ?? 0) + 1);
  console.log('  dentro la maschera del teschio:', [...dentro.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join('  '));
}
// ⚠️ Il teschio è a **due toni**: osso chiaro sopra e un'ombra crema-tan sulla metà bassa, attorno
// all'orbita e sotto il becco. Quell'ombra quantizza a `brownBellyShade` — il colore dell'ombra
// della pancia del bruno — e senza questo rename veniva scartata: 3.817 pixel di osso spariti, e il
// teschio sembrava mangiato attorno all'occhio e in punta al becco. Segnalato dall'utente. Le luci
// quasi bianche (`cream`, `whiteFur`) tornano osso; il fondo scuro dell'orbita (`greyShade`) è
// inchiostro.
const teschio = ricalca(
  bruno, mTeschio,
  new Set(['bone', 'boneShade', 'leather', 'gold', 'ink']),
  { brownBellyShade: 'boneShade', cream: 'bone', whiteFur: 'bone', greyShade: 'ink' },
  48,
);
// Il collare comincia a y 320 e a x 960 — dietro la mascella, non sotto — e finisce con la pedina
// a y 600: il recinto vecchio (380–660, da x 1040) lo tagliava in alto e a sinistra.
const RECINTO_COLLARE = { x0: 930, y0: 300, x1: 1220, y1: 660 };
const mCollare = unisci(
  // Tre componenti in tutto nel recinto — 13.106, 349, 142 px — e nessun rumore: si tengono tutte.
  attorno(bruno, semiComponenti(bruno, 'purple', RECINTO_COLLARE, { almeno: 100 }), RAGGIO),
  attorno(bruno, semiComponenti(bruno, 'gold', RECINTO_COLLARE, 3), RAGGIO),
);
const collare = ricalca(bruno, mCollare, new Set(['purple', 'gold', 'ink']), {}, 48);
// La pedina da sola, per farla oscillare: le sue componenti d'oro, col perno sull'anello in alto.
const mPedina = attorno(bruno, semiComponenti(bruno, 'gold', RECINTO_COLLARE, 3), RAGGIO);
const pedina = ricalca(bruno, mPedina, new Set(['gold', 'ink']), {}, 48);
const PERNO_PEDINA = [1130 + T_BRUNO[0], 535 + T_BRUNO[1]];
// L'imbracatura: cinghie, fibbie, liquido, bolle, etichetta e tappo per colore nel loro
// rettangolo; il vetro del collo — che non tocca il verde e somiglia all'ombra del pelo bianco — nel
// suo rettangolo stretto; il dado per riempimento, perché non ha un colore suo.
// ⚠️ Il tappo di sughero è oro con l'ombra che quantizza a **pelo bruno** (`brownFur`, una fascia di
// 14 px a destra e in basso): fuori dai semi e fuori dal filtro, il tappo usciva mozzato su quel
// lato. Segnalato dall'utente. Ha il suo rettangolo — x 820–980, y 80–210 — coi tre colori come
// semi, e nel ricalco il bruno si legge oro. Nel disegno bianco il bruno non sta da nessun'altra parte.
// ⚠️ Tappo e collo stanno **nell'aria**, sopra il dorso: lì la dilatazione può essere generosa, e
// deve — il contorno è spesso 12 px e agli angoli tondi dista fino a 15 dal colore che lo semina.
// Con 9 il cappuccio sinistro dell'anello di vetro e l'angolo del tappo uscivano tagliati di netto.
const RAGGIO_IN_ARIA = 15;
const RECINTO_TAPPO = { x0: 880, y0: 80, x1: 1000, y1: 210 };
const COLORI_TAPPO = ['gold', 'brownFur', 'brownShade'];
const TAPPO_IN_ORO = { brownFur: 'gold', brownShade: 'gold' };
const mTappo = maschera(bianco, COLORI_TAPPO, RAGGIO_IN_ARIA, RECINTO_TAPPO);
const mCollo = maschera(bianco, ['glass', 'whiteShade'], RAGGIO_IN_ARIA, { x0: 770, y0: 80, x1: 1000, y1: 340 });
// ⚠️ Le cinghie hanno una metà in ombra che quantizza a **inchiostro**: il loro bordo sinistro è
// una banda scura di 25–35 px, e con la dilatazione a 9 dal cuoio ne restava un terzo — il laccio
// posteriore usciva più stretto, con una tacca in basso dove l'ombra è più larga. Segnalato
// dall'utente. Cuoio e oro si dilatano di 15; il vetro e il verde della bottiglia restano a 9, perché
// la bottiglia posa sul dorso e a 15 si porterebbe dietro il contorno della schiena del donatore.
// ⚠️ Ma a 15 la cinghia si porterebbe dietro anche il **contorno del corpo** del donatore, dove lo
// attraversa: un blocco d'inchiostro a spigoli accanto al laccio. L'anello fra 9 e 15 prende quindi
// solo l'inchiostro **interno** — a più di 6 px dal fondo — che è l'ombra della cinghia e non la
// sagoma; il contorno proprio della cinghia, dove pende fuori dal corpo, sta entro i 9 e resta.
const RAGGIO_CINGHIE = 15;
const RECINTO_IMBRACATURA = { x0: 690, y0: 80, x1: 1010, y1: 740 };
const bordoBianco = dilata(bianco.pieno.map((v) => (v ? 0 : 1)), bianco.W, bianco.H, 6);
const cuoio = (recinto) => unisci(
  maschera(bianco, ['leather', 'gold'], RAGGIO, recinto),
  maschera(bianco, ['leather', 'gold'], RAGGIO_CINGHIE, recinto).map((v, i) => (v && !bordoBianco[i] ? 1 : 0)),
);
const mImbracatura = unisci(
  unisci(
    unisci(unisci(cuoio(RECINTO_IMBRACATURA), maschera(bianco, ['green', 'greenLight', 'cream'], RAGGIO, RECINTO_IMBRACATURA)), mCollo),
    mTappo,
  ),
  attorno(bianco, dado, RAGGIO),
);
const imbracatura = ricalca(bianco, mImbracatura, new Set(['leather', 'green', 'greenLight', 'cream', 'glass', 'gold', 'ink']), { whiteFur: 'cream', greyBelly: 'cream', whiteShade: 'glass', ...TAPPO_IN_ORO }, 48);
// L'imbracatura in tre pezzi che si muovono da soli: le cinghie con le fibbie stanno ferme, la
// bottiglia dondola sul perno dove le cinghie la reggono, il dado pende dall'anello sotto la fibbia.
const mBottiglia = unisci(
  unisci(maschera(bianco, ['green', 'greenLight', 'cream'], RAGGIO, { x0: 690, y0: 80, x1: 1010, y1: 470 }), mCollo),
  mTappo,
);
const bottiglia = ricalca(bianco, mBottiglia, new Set(['green', 'greenLight', 'cream', 'glass', 'gold', 'ink']), { whiteFur: 'cream', greyBelly: 'cream', whiteShade: 'glass', ...TAPPO_IN_ORO }, 48);
const mCinghie = cuoio({ x0: 690, y0: 200, x1: 1010, y1: 740 });
const cinghie = ricalca(bianco, mCinghie, new Set(['leather', 'gold', 'ink']), {}, 48);
const dadoRicalcato = ricalca(bianco, attorno(bianco, dado, RAGGIO), new Set(['cream', 'ink']), { whiteFur: 'cream', greyBelly: 'cream', whiteShade: 'cream' }, 48);
const PERNO_BOTTIGLIA = [860 + T_BIANCO[0], 255 + T_BIANCO[1]];
const PERNO_DADO = [880 + T_BIANCO[0], 490 + T_BIANCO[1]];

// ── Le parti del corpo, per l'animazione ─────────────────────────────────────────────────────────
// Il ricalco dà livelli per colore; per far correre il ratto servono zampe e coda come pezzi con un
// perno. Un pezzo ritagliato da un disegno piatto si scopre quando ruota, e il taglio va disegnato
// perché non si veda. Gli ingredienti, ognuno nato da un artefatto misurato sui fotogrammi:
//
// - la **sporgenza**: la zampa fuori dalla sagoma del corpo. È il poligono della parte, letto
//   sulla reference con la sonda per colonna, **meno il nucleo** — la sagoma piena erosa di 35 px e
//   ridilatata, un'apertura morfologica in cui coda e zampe (spesse meno di 70) spariscono e resta
//   il blocco tronco+testa. Dentro il nucleo il poligono non conta niente: può essere generoso.
// - il **giunto sintetico**, dietro al tronco: una capsula dal perno all'**uscita** — il punto in
//   cui la zampa lascia la sagoma — con l'anello d'inchiostro e il colore della zampa alla radice,
//   disegnata da zero. Per le zampe lontane è un arto d'ombra prolungato dentro il corpo; per le
//   vicine perno e uscita coincidono e la capsula è un **disco** sull'uscita, del colore dello
//   stinco. Un disco è l'unica forma che una rotazione attorno al suo centro manda in sé stessa: la
//   metà dentro il corpo resta nascosta dal tronco, la metà fuori riempie il cuneo che lo stinco
//   apre quando oscilla. ⚠️ Per questo **tutte** le zampe stanno dietro al tronco, anche le vicine:
//   una zampa davanti non ha niente che le nasconda il giunto, e a ogni passo fra stinco e pancia
//   si apriva un cuneo bianco. Il raggio è **meno** della mezza zampa, o l'anello sbuca da fermo.
// - la **coda** è cinque segmenti concatenati, tagliati per colonna **fra un anello e l'altro** del
//   disegno — così nessun anello si spezza — e uniti da giunti tondi sul filo della coda: il figlio
//   ruota nel sistema del padre, e il **padre prosegue sotto il figlio** per il raggio del giunto.
//   Senza quel prolungamento il padre finiva di netto sulla colonna del taglio e, appena il figlio
//   ruotava, fra i due restava una fessura bianca che nessuno riempiva. Un ritardo crescente fra i
//   segmenti fa l'onda.
const PARTI_ZAMPE = [
  // ⚠️ Perno e uscita stanno **sull'asse della zampa**, letto con la sonda per colonna: se la
  // capsula punta altrove, alla radice sbuca un nodo. Per le lontane il perno è prolungato dentro il
  // corpo quanto la groppa permette senza che il disco esca dal contorno.
  // ⚠️ Il poligono scende fino a y 700 e parte da x 200: le dita del piede arrivano a y 662 e con il
  // bordo a 660 il loro inchiostro più basso restava al tronco, fermo — un trattino nero sotto il
  // piede appena il piede saliva. Segnalato dall'utente con le tinte della lente.
  { nome: 'legBackFar', poligono: [[520, 480], [520, 700], [200, 700], [200, 500]], perno: [488, 540], uscita: [455, 548], raggio: 28, tinta: 'greyShade' },
  // ⚠️ Il bordo basso del poligono segue il solco fra le due zampe anteriori, letto con la sonda per
  // colonna (x 1290 → y 652, x 1330 → y 675): con il bordo a 695 la cima dello stinco vicino finiva
  // nella lontana e, quando questa saliva, sotto restava una copia dello stinco. Segnalato dall'utente.
  { nome: 'legFrontFar', poligono: [[1225, 545], [1480, 550], [1480, 690], [1330, 675], [1290, 652], [1225, 640]], perno: [1190, 583], uscita: [1228, 596], raggio: 29, tinta: 'greyShade' },
  // Le vicine: il perno è dove lo stinco attraversa il contorno del corpo, e la tinta è la sua.
  { nome: 'legBackNear', poligono: [[520, 640], [620, 640], [620, 720], [575, 830], [400, 830], [400, 700]], perno: [558, 690], uscita: [558, 690], raggio: 20, tinta: 'pink' },
  // ⚠️ Il disco deve arrivare al contorno **superiore** dello stinco (y 629 a x 1200), o quando lo
  // stinco scende fra il suo bordo e il petto resta un cuneo bianco: raggio 32, centro a 659.
  { nome: 'legFrontNear', poligono: [[1170, 625], [1250, 625], [1380, 690], [1380, 800], [1180, 800], [1170, 730]], perno: [1192, 659], uscita: [1192, 659], raggio: 32, tinta: 'greyFur' },
];
// ⚠️ Il recinto della coda finisce a y 520: il piede della zampa posteriore lontana è rosa come la
// coda e comincia a y 560 — con il recinto a 578 la sua fetta alta finiva nel primo segmento, e
// da fermo stava nascosta sotto la zampa, ma appena la zampa saliva spuntavano un pezzo rosa e due
// triangoli d'inchiostro. Segnalato dall'utente con le tinte della lente.
const RECINTO_CODA = { x0: 30, y0: 270, x1: 578, y1: 520 };
const PERNO_CODA = [548, 438];
const TAGLI_CODA_DESIDERATI = [470, 380, 290, 200]; // dove vorremmo i giunti: ognuno va sul mezzo fra due anelli
const NUCLEO_RAGGIO = 35;
const INCHIOSTRO_SINTETICO = 12; // lo spessore del contorno nelle reference, in pixel

// Punto dentro poligono (ray casting).
const dentroPoligono = (px, py, poly) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

// Segna in `m` i pixel a distanza ≤ r dal segmento ab: una capsula. Con a = b è un disco.
function capsula(m, W, H, [ax, ay], [bx, by], r) {
  const x0 = Math.max(0, Math.floor(Math.min(ax, bx) - r)), x1 = Math.min(W - 1, Math.ceil(Math.max(ax, bx) + r));
  const y0 = Math.max(0, Math.floor(Math.min(ay, by) - r)), y1 = Math.min(H - 1, Math.ceil(Math.max(ay, by) + r));
  const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L2));
    const qx = ax + t * dx, qy = ay + t * dy;
    if ((x - qx) ** 2 + (y - qy) ** 2 <= r * r) m[y * W + x] = 1;
  }
  return m;
}

const erodi = (m, W, H, r) => dilata(m.map((v) => (v ? 0 : 1)), W, H, r).map((v) => (v ? 0 : 1));
const nucleo = dilata(erodi(grigio.pieno, grigio.W, grigio.H, NUCLEO_RAGGIO), grigio.W, grigio.H, NUCLEO_RAGGIO);

// La coda intera, per colore: rosa e la sua ombra nel recinto, dilatati sull'inchiostro.
const codaIntera = (() => {
  const { W, H, idx } = grigio;
  const semi = new Set(['pink', 'pinkShade'].map((n) => NOMI.indexOf(n)));
  const a = new Uint8Array(W * H);
  for (let y = RECINTO_CODA.y0; y < RECINTO_CODA.y1; y++) for (let x = RECINTO_CODA.x0; x < RECINTO_CODA.x1; x++) if (semi.has(idx[y * W + x])) a[y * W + x] = 1;
  return dilata(a, W, H, RAGGIO).map((v, i) => (v && idx[i] >= 0 ? 1 : 0));
})();

// Gli anelli della coda: le colonne in cui l'inchiostro attraversa la banda **dentro**, non sul
// contorno. Si contano le righe d'inchiostro nella fascia interna (via 12 px sopra e sotto) e le
// colonne con più di un quarto d'inchiostro, raggruppate, sono anelli. Vale dove la coda corre quasi
// orizzontale (x ≥ 150): nel ricciolo della punta una colonna la taglierebbe per il lungo.
function anelliCoda() {
  const { W, H, idx } = grigio;
  const INK = NOMI.indexOf('ink');
  const anelli = [];
  let inizio = -1;
  for (let x = 150; x <= RECINTO_CODA.x1; x++) {
    let y0 = H, y1 = -1, interni = 0;
    for (let y = 0; y < H; y++) if (codaIntera[y * W + x]) { if (y < y0) y0 = y; if (y > y1) y1 = y; }
    let anello = false;
    if (y1 - y0 > 30) {
      for (let y = y0 + 12; y <= y1 - 12; y++) if (idx[y * W + x] === INK) interni++;
      anello = interni / (y1 - y0 - 24) > 0.25;
    }
    if (anello && inizio < 0) inizio = x;
    if (!anello && inizio >= 0) { anelli.push(Math.round((inizio + x - 1) / 2)); inizio = -1; }
  }
  return anelli;
}
// I tagli: per ogni posizione desiderata, il punto di mezzo fra due anelli consecutivi più vicino.
function tagliCoda() {
  const anelli = anelliCoda();
  const mezzi = anelli.slice(1).map((a, i) => Math.round((anelli[i] + a) / 2));
  const tagli = [];
  for (const t of TAGLI_CODA_DESIDERATI) {
    const m = mezzi.filter((v) => !tagli.includes(v)).sort((a, b) => Math.abs(a - t) - Math.abs(b - t))[0];
    tagli.push(m ?? t);
  }
  tagli.sort((a, b) => b - a);
  console.log(`coda: anelli a ${anelli.join(', ')} → tagli a ${tagli.join(', ')}`);
  return tagli;
}
// Il centro e la mezza altezza della coda in una colonna: il giunto di un segmento figlio.
function giuntoCoda(x) {
  const { W, H } = grigio;
  let y0 = H, y1 = -1;
  for (let y = 0; y < H; y++) if (codaIntera[y * W + x]) { if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return { perno: [x, Math.round((y0 + y1) / 2)], raggio: Math.ceil((y1 - y0) / 2) + 8 };
}
// I cinque segmenti, dalla radice alla punta, ognuno figlio del precedente.
const segmentiCoda = (() => {
  const tagli = tagliCoda();
  return Array.from({ length: tagli.length + 1 }, (_, k) => ({
    nome: `tail${k + 1}`,
    coda: { daX: tagli[k], aX: tagli[k - 1] },
    dietro: true,
    ...(k === 0 ? { perno: PERNO_CODA } : { genitore: `tail${k}` }),
  }));
})();
// Tutto sta dietro al tronco: prima la coda, poi le lontane, poi le vicine.
const PARTI = [...segmentiCoda, ...PARTI_ZAMPE.map((p) => ({ ...p, dietro: true }))];

// Le zone di una parte, sul raster del grigio: la **sporgenza** (ciò che il tronco perde), il
// **corridoio** del giunto sintetico, e il **pezzo** — i pixel della reference che la parte prende.
// Un segmento di coda prende il suo tratto di colonne più il prolungamento sotto il padre e il
// giunto tondo sul taglio verso il padre; dal tronco perde solo ciò che sta fuori dal nucleo.
function zoneParte(parte) {
  const { W, H } = grigio;
  const sporgenza = new Uint8Array(W * H), giunto = new Uint8Array(W * H), pezzo = new Uint8Array(W * H);
  if (parte.coda) {
    const { daX = 0, aX = W } = parte.coda;
    const estensione = daX > 0 ? giuntoCoda(daX).raggio : 0;
    for (let i = 0; i < W * H; i++) {
      if (!codaIntera[i]) continue;
      const x = i % W;
      if (x >= daX && x < aX && !nucleo[i]) sporgenza[i] = 1;
      if (x >= daX - estensione && x < aX) pezzo[i] = 1;
    }
    if (parte.genitore) {
      const j = giuntoCoda(aX);
      parte.perno = j.perno;
      capsula(giunto, W, H, j.perno, j.perno, j.raggio);
      for (let i = 0; i < W * H; i++) if (giunto[i] && codaIntera[i]) pezzo[i] = 1;
    }
    return { sporgenza, corridoio: giunto, pezzo };
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    if (grigio.pieno[i] && !nucleo[i] && dentroPoligono(x, y, parte.poligono)) { sporgenza[i] = 1; pezzo[i] = 1; }
  }
  const corridoio = capsula(new Uint8Array(W * H), W, H, parte.perno, parte.uscita, parte.raggio);
  return { sporgenza, corridoio, pezzo };
}

// L'immagine di una parte, pronta per il ricalco: per una zampa prima il giunto sintetico —
// inchiostro nel corridoio, la tinta della radice nel corridoio ristretto dello spessore del
// contorno — e sopra i pixel veri del pezzo.
function immagineParte(parte, zone) {
  const { W, H } = grigio;
  const px = new Uint8ClampedArray(W * H * 4);
  const idx = new Int8Array(W * H).fill(-1);
  const scrivi = (i, k) => { idx[i] = k; [px[i * 4], px[i * 4 + 1], px[i * 4 + 2]] = RGB[k]; px[i * 4 + 3] = 255; };
  if (!parte.coda) {
    const INK = NOMI.indexOf('ink'), TINTA = NOMI.indexOf(parte.tinta);
    const dentro = capsula(new Uint8Array(W * H), W, H, parte.perno, parte.uscita, parte.raggio - INCHIOSTRO_SINTETICO);
    for (let i = 0; i < W * H; i++) if (zone.corridoio[i]) scrivi(i, dentro[i] ? TINTA : INK);
  }
  for (let i = 0; i < W * H; i++) if (zone.pezzo[i]) scrivi(i, grigio.idx[i]);
  // ⚠️ Via le briciole: una componente connessa sotto i 250 px in un pezzo è un frammento preso
  // per sbaglio da un poligono o da un recinto — una fetta di piede, un pezzo di contorno d'altri —
  // e da fermo non si vede, perché sta sotto a chi gliel'ha lasciata; si vede appena il pezzo si
  // muove. Zampe e coda non hanno niente di così piccolo che sia loro.
  const visitato = new Uint8Array(W * H);
  let briciole = 0;
  for (let s = 0; s < W * H; s++) {
    if (idx[s] < 0 || visitato[s]) continue;
    const coda = [s]; visitato[s] = 1;
    for (let t = 0; t < coda.length; t++) {
      const i = coda[t];
      for (const d of [-1, 1, -W, W]) { const j = i + d; if (j >= 0 && j < W * H && idx[j] >= 0 && !visitato[j] && Math.abs((j % W) - (i % W)) <= 1) { visitato[j] = 1; coda.push(j); } }
    }
    if (coda.length < 250) { for (const i of coda) { azzera(px, i); idx[i] = -1; } briciole += coda.length; }
  }
  if (briciole) console.log(`${parte.nome}: tolte briciole per ${briciole} px`);
  return { W, H, px, idx, pieno: idx.map((v) => (v >= 0 ? 1 : 0)) };
}

// Il tronco: il corpo senza le sporgenze. Tutto ciò che si muove sta dietro, quindi il tronco non
// si ridipinge: dove nella reference lo stinco copriva la pancia quei pixel restano al tronco,
// fermi, e lo stinco che oscilla ci passa sotto. ⚠️ Le sporgenze si tolgono per tutte le parti,
// o resterebbe una copia ferma della zampa sotto quella che si muove — ma con un **orlo** di 10 px
// oltre il nucleo: il nucleo arrotonda le convessità del corpo, e senza orlo alla radice si vedeva
// il fondo.
function tronco(zone) {
  const { W, H } = grigio;
  const px = new Uint8ClampedArray(grigio.px);
  const idx = new Int8Array(grigio.idx);
  const orlo = dilata(nucleo, W, H, 10);
  let tolti = 0;
  for (const [k] of PARTI.entries()) {
    for (let i = 0; i < W * H; i++) if (zone[k].sporgenza[i] && !orlo[i] && idx[i] >= 0) { azzera(px, i); idx[i] = -1; tolti++; }
  }
  console.log(`tronco: ${tolti} px di sporgenze tolti`);
  return { W, H, px, idx, pieno: idx.map((v) => (v >= 0 ? 1 : 0)) };
}
const zoneParti = PARTI.map(zoneParte);
const troncoImg = tronco(zoneParti);
const partiRicalcate = PARTI.map((p, k) => ({
  ...p,
  percorsi: ricalca(immagineParte(p, zoneParti[k]), null, null, { brownBelly: 'greyBelly', bone: 'greyBelly' }),
}));
const troncoRicalcato = ricalca(troncoImg, null, null, { brownBelly: 'greyBelly', bone: 'greyBelly' });
// Il perno del corpo intero — attorno a cui sobbalza e beccheggia — è il baricentro del tronco.
const PERNO_CORPO = (() => {
  let sx = 0, sy = 0, n = 0;
  for (let i = 0; i < troncoImg.W * troncoImg.H; i++) if (troncoImg.pieno[i]) { sx += i % troncoImg.W; sy += Math.floor(i / troncoImg.W); n++; }
  return [sx / n, sy / n];
})();

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
const slotCorpo = (n) => SLOT_CORPO[n] ?? 'belly';
const perno = ([x, y]) => ({ x: Math.round(x * SCALA), y: Math.round(y * SCALA) });
const ART = {
  body: scalato(corpo, [0, 0], slotCorpo),
  torso: scalato(troncoRicalcato, [0, 0], slotCorpo),
  bodyPivot: perno(PERNO_CORPO),
  parts: partiRicalcate.map((p) => ({ name: p.nome, behind: p.dietro, parent: p.genitore, pivot: perno(p.perno), paths: scalato(p.percorsi, [0, 0], slotCorpo) })),
  skull: [{ name: 'skull', paths: scalato(teschio, T_BRUNO) }],
  collar: [
    { name: 'band', paths: scalato(collare, T_BRUNO) },
    { name: 'pawn', pivot: perno(PERNO_PEDINA), paths: scalato(pedina, T_BRUNO) },
  ],
  harness: [
    { name: 'straps', paths: scalato(cinghie, T_BIANCO) },
    { name: 'bottle', pivot: perno(PERNO_BOTTIGLIA), paths: scalato(bottiglia, T_BIANCO) },
    { name: 'dice', pivot: perno(PERNO_DADO), paths: scalato(dadoRicalcato, T_BIANCO) },
  ],
};
// L'imbracatura intera resta per l'anteprima di confronto.
const imbracaturaIntera = scalato(imbracatura, T_BIANCO);

const conta = (p) => JSON.stringify(p.reduce((m, x) => ((m[x.c] = (m[x.c] ?? 0) + 1), m), {}));
console.log('torso   ', String(ART.torso.length).padStart(3), conta(ART.torso));
for (const p of ART.parts) console.log(p.name.padEnd(13), String(p.paths.length).padStart(3), `perno (${p.pivot.x},${p.pivot.y})`, p.parent ? `figlio di ${p.parent}` : '', conta(p.paths));
console.log('perno corpo', ART.bodyPivot);
for (const k of ['skull', 'collar', 'harness']) for (const q of ART[k]) console.log(`${k}/${q.name}`.padEnd(15), String(q.paths.length).padStart(3), q.pivot ? `perno (${q.pivot.x},${q.pivot.y})` : '', conta(q.paths));
console.log('viewBox ', vb);

// ── Il modulo dati per la libreria ───────────────────────────────────────────────────────────────
// I colori fissi dei kit. `boneShade` non è nella tavolozza di quantizzazione — nasce dal rename di
// `brownBellyShade` dentro il teschio — quindi il suo valore sta qui: l'ombra dell'osso della reference.
const KIT_COLORI = ['ink', 'bone', 'boneShade', 'leather', 'gold', 'purple', 'green', 'greenLight', 'cream', 'glass'];
PALETTE.boneShade = '#e4d4b8';
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

/** Un punto nelle unità della cornice: il perno attorno a cui una parte ruota. */
export interface RatPivot {
  readonly x: number;
  readonly y: number;
}

/** Il perno del corpo intero, attorno a cui sobbalza e beccheggia: il baricentro del tronco. */
export const RAT_BODY_PIVOT: RatPivot = { x: ${ART.bodyPivot.x}, y: ${ART.bodyPivot.y} };

/**
 * Una parte del corpo che si muove: i suoi percorsi, il perno, se sta dietro al tronco, e — per un
 * segmento della coda — il **padre** dentro cui ruota: il gruppo del figlio sta annidato in quello
 * del padre, così il perno del figlio si sposta col padre e i tre segmenti fanno un'onda.
 */
export interface RatPart {
  readonly name: RatPartName;
  readonly behind: boolean;
  readonly parent?: RatPartName;
  readonly pivot: RatPivot;
  readonly paths: readonly RatPath<RatBodySlot>[];
}
export type RatPartName = ${ART.parts.map((p) => `'${p.name}'`).join(' | ')};

/** Un pezzo di un kit. Quelli con un perno oscillano; gli altri stanno fermi. */
export interface RatKitPiece {
  readonly name: string;
  readonly pivot?: RatPivot;
  readonly paths: readonly RatPath<RatKitColor>[];
}

/**
 * Il tronco **senza** le parti che si muovono, completato col pelo dove nella reference una zampa
 * copriva la pancia. Sotto ci vanno le parti \`behind: true\`, sopra quelle \`behind: false\`.
 */
export const RAT_TORSO: readonly RatPath<RatBodySlot>[] = [
${ART.torso.map(riga).join('\n')}
];

export const RAT_PARTS: readonly RatPart[] = [
${ART.parts.map((p) => `  {\n    name: '${p.name}', behind: ${p.behind},${p.parent ? ` parent: '${p.parent}',` : ''} pivot: { x: ${p.pivot.x}, y: ${p.pivot.y} },\n    paths: [\n${p.paths.map((q) => '    ' + riga(q)).join('\n')}\n    ],\n  },`).join('\n')}
];
${['skull', 'collar', 'harness'].map((k) => `
export const RAT_${k.toUpperCase()}: readonly RatKitPiece[] = [
${ART[k].map((q) => `  {\n    name: '${q.name}',${q.pivot ? ` pivot: { x: ${q.pivot.x}, y: ${q.pivot.y} },` : ''}\n    paths: [\n${q.paths.map((r) => '    ' + riga(r)).join('\n')}\n    ],\n  },`).join('\n')}
];`).join('\n')}
`;
writeFileSync(USCITA, modulo, 'utf8');
console.log(`ratArt.ts: ${(modulo.length / 1024).toFixed(1)} KB`);

// ── Anteprime, a richiesta ───────────────────────────────────────────────────────────────────────
if (ANTEPRIME) {
  mkdirSync(ANTEPRIME, { recursive: true });
  const GRIGIA = { ink: PALETTE.ink, fur: PALETTE.greyFur, shade: PALETTE.greyShade, belly: PALETTE.greyBelly, bellyShade: PALETTE.greyBellyShade, pink: PALETTE.pink, pinkShade: PALETTE.pinkShade, eye: PALETTE.redEye, highlight: '#ffffff' };
  const g = (percorsi, colori) => `<g>${percorsi.map((p) => `<path fill="${colori[p.c] ?? PALETTE[p.c]}" d="${p.d}"/>`).join('')}</g>`;
  const testa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x} ${vb.y} ${vb.width} ${vb.height}" width="${vb.width * 2}" height="${vb.height * 2}">`;
  // Le parti, ognuna con una tinta sua, per controllare i tagli: la coda azzurra, le zampe lontane
  // gialle, le vicine rosse, il tronco com'è.
  const TINTE = { tail1: '#38bdf8', tail2: '#0ea5e9', tail3: '#6366f1', tail4: '#38bdf8', tail5: '#0ea5e9', legBackFar: '#facc15', legFrontFar: '#fde047', legBackNear: '#ef4444', legFrontNear: '#f97316' };
  const tinta = (percorsi, colore) => `<g>${percorsi.map((p) => `<path fill="${p.c === 'ink' ? '#100020' : colore}" d="${p.d}"/>`).join('')}</g>`;
  const dietro = ART.parts.filter((p) => p.behind), davanti = ART.parts.filter((p) => !p.behind);
  const kit = (pezzi) => pezzi.map((q) => g(q.paths, {})).join('');
  const varianti = {
    parti: [...dietro.map((p) => tinta(p.paths, TINTE[p.name])), g(ART.torso, GRIGIA), ...davanti.map((p) => tinta(p.paths, TINTE[p.name]))],
    ricomposto: [...dietro.map((p) => g(p.paths, GRIGIA)), g(ART.torso, GRIGIA), ...davanti.map((p) => g(p.paths, GRIGIA))],
    corpo: [g(ART.body, GRIGIA)],
    teschio: [g(ART.body, GRIGIA), kit(ART.collar), kit(ART.skull)],
    ampolla: [g(ART.body, GRIGIA), kit(ART.harness)],
    'ampolla-intera': [g(ART.body, GRIGIA), g(imbracaturaIntera, {})],
    tutto: [g(ART.body, GRIGIA), kit(ART.collar), kit(ART.harness), kit(ART.skull)],
  };
  for (const [nome, gruppi] of Object.entries(varianti)) {
    const svg = `${testa}${gruppi.join('')}</svg>`;
    await sharp(Buffer.from(svg), { density: 96 }).resize({ width: 900 }).flatten({ background: '#9ca3af' }).png().toFile(join(ANTEPRIME, `ratto-${nome}.png`));
  }

  // Il ciclo: dodici istanti del passo (0,6 s, ogni 50 ms) con le parti agli angoli che
  // `animations.css` dà in quel momento — durata, ritardo, alternanza, `ease-in-out` — resi a
  // 1800 px e composti in tavole 4×3 per zona: coda, groppa, zampe davanti, intero.
  // ⚠️ È qui che si giudica un taglio, non guardando l'animazione che gira: un cuneo di 10 px
  // sulla reference è un pixel a 88px di altezza, e a occhio passa; e tre fotogrammi «agli
  // estremi» scelti a mano non bastano, perché i ritardi fra le parti fanno sì che l'angolo
  // relativo peggiore capiti in mezzo. Le regole vanno tenute uguali a quelle del foglio di stile.
  const REGOLE = {
    legBackNear: { A: 14, D: 0.3, d: 0, rev: false }, legFrontFar: { A: 10, D: 0.3, d: 0, rev: false },
    legFrontNear: { A: 14, D: 0.3, d: 0, rev: true }, legBackFar: { A: 10, D: 0.3, d: 0, rev: true },
    tail1: { A: 3.5, D: 0.3, d: 0, rev: false }, tail2: { A: 3.5, D: 0.3, d: -0.045, rev: false }, tail3: { A: 3.5, D: 0.3, d: -0.09, rev: false },
    tail4: { A: 3.5, D: 0.3, d: -0.135, rev: false }, tail5: { A: 3.5, D: 0.3, d: -0.18, rev: false },
    pawn: { A: 9, D: 0.6, d: -0.2, rev: false }, dice: { A: 9, D: 0.6, d: -0.2, rev: false }, bottle: { A: 3, D: 0.6, d: -0.1, rev: true },
    bob: { A: 1, D: 0.3, d: 0, rev: false },
  };
  // cubic-bezier(0.42, 0, 0.58, 1): x(s) risolto per bisezione, poi y(s).
  const bez = (p) => {
    const x = (s) => 3 * (1 - s) ** 2 * s * 0.42 + 3 * (1 - s) * s ** 2 * 0.58 + s ** 3;
    const y = (s) => 3 * (1 - s) * s ** 2 + s ** 3;
    let lo = 0, hi = 1;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (x(m) < p) lo = m; else hi = m; }
    return y((lo + hi) / 2);
  };
  // Il valore in [-A, A] all'istante t, come `alternate` / `alternate-reverse`.
  const valore = (r, t) => {
    const tau = t - r.d, i = Math.floor(tau / r.D);
    let p = (tau - i * r.D) / r.D;
    if (r.rev ? i % 2 === 0 : i % 2 === 1) p = 1 - p;
    return -r.A + 2 * r.A * bez(p);
  };
  const rot = (deg, piv) => ` transform="rotate(${deg.toFixed(2)} ${piv.x} ${piv.y})"`;
  const fotogramma = (t) => {
    const f = Object.fromEntries(Object.entries(REGOLE).map(([k, r]) => [k, valore(r, t)]));
    const parte = (p) => `<g${rot(f[p.name] ?? 0, p.pivot)}>${g(p.paths, GRIGIA)}${ART.parts.filter((q) => q.parent === p.name).map(parte).join('')}</g>`;
    const radici = ART.parts.filter((p) => !p.parent);
    const pezzo = (q) => `<g${q.pivot ? rot(f[q.name] ?? 0, q.pivot) : ''}>${g(q.paths, {})}</g>`;
    const kits = [...ART.collar, ...ART.harness, ...ART.skull].map(pezzo).join('');
    const u = (f.bob + 1) / 2;
    const corpo = `translate(0 ${(-6 * u).toFixed(2)}) rotate(${(2.5 - 5 * u).toFixed(2)} ${ART.bodyPivot.x} ${ART.bodyPivot.y})`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x} ${vb.y} ${vb.width} ${vb.height}" width="1800" height="${Math.round((1800 * vb.height) / vb.width)}"><g transform="${corpo}">${radici.filter((p) => p.behind).map(parte).join('')}${g(ART.torso, GRIGIA)}${radici.filter((p) => !p.behind).map(parte).join('')}${kits}</g></svg>`;
  };
  const ZONE = {
    coda: { left: 0.0, top: 0.1, width: 0.42, height: 0.62 },
    groppa: { left: 0.08, top: 0.3, width: 0.42, height: 0.7 },
    'zampe-davanti': { left: 0.58, top: 0.35, width: 0.42, height: 0.65 },
    intero: { left: 0, top: 0, width: 1, height: 1 },
  };
  const ISTANTI = Array.from({ length: 12 }, (_, i) => i * 0.05);
  const fotogrammi = [];
  for (const t of ISTANTI) fotogrammi.push(await sharp(Buffer.from(fotogramma(t)), { density: 96 }).flatten({ background: '#ffffff' }).png().toBuffer());
  const { width: PW, height: PH } = await sharp(fotogrammi[0]).metadata();
  for (const [zona, r] of Object.entries(ZONE)) {
    const cw = Math.round(r.width * PW), ch = Math.round(r.height * PH);
    const tw = 450, th = Math.round((tw * ch) / cw);
    const celle = [];
    for (const [i, png] of fotogrammi.entries()) {
      const cella = await sharp(png).extract({ left: Math.round(r.left * PW), top: Math.round(r.top * PH), width: cw, height: ch }).resize({ width: tw }).png().toBuffer();
      const etichetta = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="${th}"><text x="6" y="18" font-size="16" font-family="sans-serif" fill="#dc2626">t=${Math.round(ISTANTI[i] * 1000)} ms</text><rect x="0" y="0" width="${tw}" height="${th}" fill="none" stroke="#9ca3af"/></svg>`);
      celle.push({ input: await sharp(cella).composite([{ input: etichetta }]).png().toBuffer(), left: (i % 4) * tw, top: Math.floor(i / 4) * th });
    }
    await sharp({ create: { width: tw * 4, height: th * 3, channels: 3, background: '#ffffff' } }).composite(celle).png().toFile(join(ANTEPRIME, `ciclo-${zona}.png`));
  }
  console.log(`anteprime in ${ANTEPRIME}`);
}
