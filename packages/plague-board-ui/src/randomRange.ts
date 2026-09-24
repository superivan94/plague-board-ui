/**
 * Gli estremi fra cui si pesca, compresi. Scriverli uguali vuol dire «sempre questo».
 *
 * ⚠️ **È uno solo per tutta la libreria, e non è pedanteria.** Lo sciame pesca attese, traversate
 * e altezze; l'emettitore pesca vite, posizioni e dimensioni: è la stessa idea, e due alias
 * identici con due nomi diversi avrebbero fatto credere a chi legge che fossero due cose. Il tipo
 * sta in un modulo suo perché non appartiene a nessuno dei due componenti.
 */
export type RandomRange = readonly [number, number];
