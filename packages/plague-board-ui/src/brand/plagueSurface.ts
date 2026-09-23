/**
 * **La superficie della peste**: il bordo verde e la sfumatura che scende dal verde del marchio.
 * La portano `PlaguePanel` e i dialoghi, che devono sembrare la stessa cosa — un dialogo che si
 * apre sopra una scheda del profilo è la stessa lastra, non un'altra.
 *
 * ⚠️ **Scritta per esteso e in un modulo solo**: Tailwind le classi le cerca nel testo dei file,
 * quindi una stringa composta non genererebbe niente, e due copie scritte a mano divergerebbero al
 * primo ritocco del verde.
 */
export const PLAGUE_SURFACE_CLASS =
  'border border-brand-ink/50 bg-surface bg-linear-to-br from-brand-ink/10 to-transparent';
