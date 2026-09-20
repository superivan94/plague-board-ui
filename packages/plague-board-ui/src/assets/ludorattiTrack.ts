/**
 * **L'indirizzo della musica dei Ludoratti, che viaggia dentro il pacchetto.**
 *
 * Il file sta in `assets/ludoratti.mp3`, accanto a `dist/` e a `styles/`, e questa costante è
 * l'unico modo che ha chi installa per raggiungerlo senza sapere dove il proprio bundler lo
 * metterà.
 *
 * ⚠️ **Non è una stringa scritta a mano: è un riferimento che risolve il bundler.** `new URL(…,
 * import.meta.url)` è la forma che webpack 5 e Turbopack riconoscono come «questo modulo dipende
 * da quel file»: lo copiano nell'output dell'applicazione e sostituiscono l'espressione con
 * l'indirizzo vero. È la stessa ragione per cui {@link RAT_MASCOT_IMAGE} è una stringa base64 —
 * `tsc` non copia file e non riscrive import, quindi un URL la nostra build non lo può fabbricare
 * — ma la risposta è migliore: 1,26 MB di audio dentro un modulo sarebbero 1,7 MB di JavaScript
 * da scaricare e interpretare **prima** di sapere se qualcuno preme il comando.
 *
 * ⚠️ **Se il bundler non conosce questa forma, l'indirizzo esce sbagliato invece che assente.**
 * Fuori da un bundler `import.meta.url` è l'URL del modulo stesso, quindi il risultato punta
 * accanto al file JavaScript e il browser prende un 404 — silenzioso, perché un `<audio>` che non
 * trova la traccia non lancia niente. La via d'uscita è la prop `src` di {@link MusicProvider},
 * che resta e vince su questo valore: chi si trova in quel caso serve il file dalla propria
 * cartella pubblica, come si faceva prima che la traccia entrasse nel pacchetto.
 *
 * ⚠️ **Questo modulo non dichiara `'use client'`**, e non è una dimenticanza: esporta un dato, non
 * un componente, e un modulo client consegna a un componente server un riferimento invece dei suoi
 * valori. È la stessa regola di `brand/plagueBarSizes.ts`, e la tiene `tests/boundaries.test.ts`.
 *
 * **Il file**: MP3 VBR LAME `-q:a 6` (~111 kbps medi), stereo 48 kHz, 92,88 s, **1,26 MB**.
 * Viene dall'originale a 182 kbps — misurato, non dichiarato — e ne conserva l'energia di banda
 * entro **1,2 dB** fino a 20 kHz; la copertina JPEG da 19,7 KB, che in un `<audio>` non serve a
 * niente, è stata tolta. I tag con titolo, autore e origine restano dentro il file.
 */
export const LUDORATTI_TRACK_URL = new URL('../../assets/ludoratti.mp3', import.meta.url).href;
