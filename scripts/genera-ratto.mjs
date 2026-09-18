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
async function carica(nome) {
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

  const idx = new Int8Array(W * H).fill(-1);
  for (let i = 0; i < W * H; i++) {
    if (fondo[i]) { azzera(px, i); continue; }
    const k = piuVicino(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
    idx[i] = k;
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
const bianco = await carica('ludoratto-bianco-pozione');

// Il corpo: i colori del grigio diventano **slot** della livrea. I pochi percorsi finiti su bone /
// brownBelly sono luci della pancia grigia quantizzate male: vanno con la pancia. Il puntino bianco
// nell'occhio è la luce.
const corpo = ricalca(grigio, null, null, { brownBelly: 'greyBelly', bone: 'greyBelly' });

// I recinti, misurati sulle reference: il teschio con la cinghia sta sulla testa del bruno (i baffi
// cominciano a y 420), il collare con la pedina alla gola, l'imbracatura sul dorso del bianco (la
// coda finisce a x 600, l'orecchio comincia a x 1040). Il **collo** dell'ampolla è vetro e non
// tocca il verde: si semina a parte, in un recinto stretto dove l'ombra del pelo bianco — quasi lo
// stesso colore — non arriva.
const mTeschio = maschera(bruno, ['bone', 'leather'], RAGGIO, { x0: 1090, y0: 90, x1: 1530, y1: 415 });
const teschio = ricalca(bruno, mTeschio, new Set(['bone', 'leather', 'gold', 'ink']), { brownShade: 'ink' }, 48);
const mCollare = maschera(bruno, ['purple', 'gold'], RAGGIO, { x0: 1040, y0: 380, x1: 1310, y1: 660 });
const collare = ricalca(bruno, mCollare, new Set(['purple', 'gold', 'ink']), {}, 48);
const mImbracatura = unisci(
  maschera(bianco, ['leather', 'green', 'greenLight', 'cream', 'gold'], RAGGIO, { x0: 690, y0: 80, x1: 1010, y1: 740 }),
  maschera(bianco, ['glass', 'whiteShade'], RAGGIO, { x0: 770, y0: 80, x1: 980, y1: 340 }),
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
