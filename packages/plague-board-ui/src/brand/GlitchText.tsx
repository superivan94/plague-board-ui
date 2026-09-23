import type { CSSProperties } from 'react';

export interface GlitchTextProps {
  /**
   * Il testo che si disturba. **È una stringa, non un nodo**: le lamelle sono copie di questo
   * testo, e una copia di un albero di elementi sarebbe un albero duplicato — con dentro i suoi
   * comandi, i suoi collegamenti e i suoi identificatori. Il tipo lo impedisce in compilazione.
   */
  children: string;
  /**
   * La parola che lampeggia sopra il testo: ogni tre secondi tenta di uscire due volte a fette e
   * poi compare **intera**, sfarfallando come un tubo che prende la corrente — due colpi corti e
   * la tenuta. Porta lo stesso disturbo del nome. Assente, il lampo non esiste affatto:
   * non c'è nessun valore predefinito perché una parola predefinita sarebbe il testo di
   * un'applicazione dentro un componente.
   */
  reveal?: string;
  /**
   * Se il lampo deve partire. Acceso di serie, e senza {@link reveal} non fa niente comunque.
   *
   * ⚠️ **È volutamente un secondo modo di dire la stessa cosa**, perché le due prop rispondono a
   * due domande diverse: `reveal` dice **quale** parola, questa dice **se** far succedere la cosa.
   * Chi ha la parola in una costante e l'interruttore in un'impostazione scrive
   * `isRevealEnabled={impostazioni.easterEgg}` invece di infilare la condizione dentro il
   * contenuto con `reveal={acceso ? 'EVIL' : undefined}`.
   *
   * ⚠️ **Spento vuol dire non reso, non reso e invisibile**: la parola non finisce affatto nella
   * pagina. Un elemento fermo a opacità zero sarebbe una copia di testo che nessuno vede e che la
   * selezione, la ricerca nella pagina e chiunque legga il DOM continuano a trovare.
   */
  isRevealEnabled?: boolean;
  /**
   * Il colore di **ciò che sta dietro**, che le lamelle usano per coprire l'originale dove
   * passano.
   *
   * ⚠️ Il valore predefinito è `transparent`, ed è una scelta sul modo di sbagliare. Con un colore
   * giusto le lamelle **sostituiscono** il testo per una fetta alla volta, che è il disturbo
   * nitido; con uno sbagliato dipingono un rettangolo in mezzo alla parola, cioè un difetto
   * evidente. Trasparente le lamelle si limitano a sdoppiare i bordi in ciano e rosa: l'effetto
   * è più tenue, ma non c'è nessun fondo da indovinare. Chi sa che cosa ha dietro lo passa —
   * sopra {@link PlagueBackground} è `#030712`.
   *
   * ⚠️ **Vale per le lamelle e basta.** La parola nascosta non posa su nessun fondo: mentre è
   * accesa il nome si spegne, quindi sotto di lei non c'è niente da coprire.
   */
  background?: string;
  /** Classi aggiuntive sul contenitore: la taglia, il peso, il colore del testo. */
  className?: string;
  /**
   * Le classi del lampo. ⚠️ **Sostituiscono** quella predefinita invece di aggiungersi: due classi
   * di colore nella stessa `class` le decide l'ordine nel CSS generato, non quello in cui sono
   * scritte, quindi chi passa la sua non saprebbe se vince.
   */
  revealClassName?: string;
}

/**
 * Le due copie sfalsate di una parola, ciano e rosa.
 *
 * ⚠️ È un componente e non due righe scritte due volte perché le porta **anche la parola
 * nascosta**: il nome si disturba e lei no era la prima differenza che si vedeva a schermo, e due
 * disturbi scritti separatamente sarebbero due disturbi destinati a divergere.
 *
 * ⚠️ `aria-hidden` sta qui anche dove sarebbe superfluo — dentro il lampo, che è già nascosto —
 * perché a rendere invisibile una copia dev'essere la copia stessa, non il posto dove capita di
 * montarla.
 */
function GlitchSlices({ text }: { text: string }) {
  return (
    <>
      <span aria-hidden="true" className="pb-glitch-slice pb-glitch-slice--cyan animate-glitch">
        {text}
      </span>
      <span aria-hidden="true" className="pb-glitch-slice pb-glitch-slice--pink animate-glitch">
        {text}
      </span>
    </>
  );
}

// ⚠️ Niente fra il JSDoc qui sotto e `GlitchText`: con `GlitchSlices` in mezzo il blocco restava
// orfano, e il componente pubblico arrivava nel `.d.ts` senza documentazione.

/**
 * **L'effetto glitch sul nome**: il testo si sdoppia in due copie sfalsate di un paio di pixel,
 * una ciano e una rosa, e ognuna si vede solo per una fetta orizzontale che salta da un fotogramma
 * all'altro. Dove `reveal` c'è, ogni tre secondi la parola che il nome sta nascondendo prova a
 * uscire: due sbirciate rotte da sei centesimi, due colpi interi da quarantacinque millesimi e
 * infine la tenuta, 165 ms — il modo in cui un tubo al neon prende la corrente. ⚠️ **E la parola
 * nascosta porta lo stesso disturbo del nome**, con le sue due lamelle **dentro** di lei: così
 * compaiono e spariscono con lei, invece di girare sopra il nome anche quando non c'è.
 *
 * ⚠️ **Mentre la parola nascosta è accesa il nome si spegne**, lamelle comprese, e nessuna lastra
 * lo copre. La lastra c'era: posava la parola sul colore di `background`, ed era giusta solo dove
 * quel colore era davvero il fondo — su una pagina chiara, un fondo scuro dichiarato faceva di ogni
 * fetta una striscia nera e della parola un'etichetta (utente, 2026-09-23). Spegnere il nome vale
 * su qualunque fondo, anche su uno che non è un colore solo, come il fondale della peste. Il prezzo
 * sono due `@keyframes` da ritoccare insieme, `pb-reveal` e `pb-conceal`, e un test li tiene
 * allineati.
 *
 * Viene dal titolo di `ludoratti.it` — «LUDORATTI **E.** CORP», dove la `E.` ogni tanto diventa
 * `EVIL` — ed è il terzo pezzo del registro «futuro distopico» dell'aggregatore, dopo la città e
 * le gocce che stanno in {@link PlagueBackground}. A RattInventario quel registro manca del tutto.
 *
 * ⚠️ **Le copie sono elementi veri con `aria-hidden`, non pseudo-elementi.** Di là sono due
 * `::before`/`::after` con `content: attr(data-text)`, e il contenuto generato da CSS alcuni
 * lettori di schermo lo annunciano: il nome del titolo diventa «LUDORATTI E.E.E. CORP». Con due
 * `<span>` nascosti l'albero di accessibilità ha il testo una volta sola, e lo tiene un test.
 *
 * ⚠️ **Con «meno movimento» non resta niente.** Le lamelle nascono collassate
 * (`clip-path: inset(50% 0 50% 0)`) e sono i fotogrammi ad aprirle: spenta l'animazione, tornano
 * invisibili invece di restare due copie integre sfalsate di due pixel — che sarebbe l'aspetto di
 * un difetto, non di una preferenza rispettata. Il lampo, che nasce a opacità zero, semplicemente
 * non arriva, e il nome resta acceso: un easter egg nascosto resta nascosto.
 *
 * ⚠️ **Il lampo si spegne anche a mano**, con `isRevealEnabled={false}`, e allora resta il solo
 * nome che si disturba. Serve a chi la parola ce l'ha già scritta da qualche parte e vuole
 * governare l'effetto da un'impostazione, senza far diventare il contenuto una condizione.
 *
 * @example
 * ```tsx
 * <h1 className="font-mono text-4xl tracking-wider">
 *   LUDORATTI{' '}
 *   <GlitchText className="text-brand-ink" reveal="EVIL">
 *     E.
 *   </GlitchText>{' '}
 *   CORP
 * </h1>
 * ```
 */
export function GlitchText({
  children,
  reveal,
  isRevealEnabled = true,
  background = 'transparent',
  className = '',
  revealClassName = 'text-red-500',
}: GlitchTextProps) {
  // La parola che passa davvero, o niente: spenta o assente, per il resto del componente è la
  // stessa cosa.
  const shownReveal = isRevealEnabled && reveal ? reveal : undefined;

  return (
    <span
      className={`pb-glitch ${className}`}
      // La variabile sta qui e non sulle lamelle: loro la ereditano — comprese quelle dentro il
      // lampo — e detta una volta sola non può diventare due valori diversi.
      style={{ '--pb-glitch-bg': background } as CSSProperties}
    >
      {/* Il nome e le sue lamelle in un pezzo solo, perché si spengono insieme mentre la parola
          nascosta è accesa: le lamelle da sole girerebbero sopra di lei. */}
      <span className={shownReveal ? 'pb-glitch-name pb-glitch-name--with-reveal' : 'pb-glitch-name'}>
        {children}
        <GlitchSlices text={children} />
      </span>
      {shownReveal ? (
        <span aria-hidden="true" className={`pb-glitch-reveal animate-reveal ${revealClassName}`}>
          {shownReveal}
          {/* ⚠️ **Dentro** il lampo, non accanto: il ritaglio e l'opacità di `pb-reveal` valgono
              per tutto il sottoalbero, quindi le copie compaiono e spariscono con lui. Fuori
              girerebbero sopra il nome per tutti e tre i secondi in cui il lampo non c'è. */}
          <GlitchSlices text={shownReveal} />
        </span>
      ) : null}
    </span>
  );
}
