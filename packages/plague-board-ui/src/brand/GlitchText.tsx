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
   * Il colore di **ciò che sta dietro**, che le lamelle usano per coprire l'originale dove
   * passano.
   *
   * ⚠️ Il valore predefinito è `transparent`, ed è una scelta sul modo di sbagliare. Con un colore
   * giusto le lamelle **sostituiscono** il testo per una fetta alla volta, che è il disturbo
   * nitido; con uno sbagliato dipingono un rettangolo in mezzo alla parola, cioè un difetto
   * evidente. Trasparente le lamelle si limitano a sdoppiare i bordi in ciano e rosa: l'effetto
   * è più tenue, ma non c'è nessun fondo da indovinare. Chi sa che cosa ha dietro lo passa —
   * sopra {@link PlagueBackground} è `#030712`.
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
 * **Il disturbo sul nome**: il testo si sdoppia in due copie sfalsate di un paio di pixel, una
 * ciano e una rosa, e ognuna si vede solo per una fetta orizzontale che salta da un fotogramma
 * all'altro. Dove `reveal` c'è, ogni tre secondi la parola che il nome sta nascondendo prova a
 * uscire: due sbirciate rotte da sei centesimi, due colpi interi da quarantacinque millesimi e
 * infine la tenuta, 165 ms — il modo in cui un tubo al neon prende la corrente. ⚠️ **E la parola
 * nascosta porta lo stesso disturbo del nome**, con le sue due lamelle **dentro** di lei: così
 * compaiono e spariscono con lei, invece di girare sopra il nome anche quando non c'è.
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
 * non arriva: un easter egg nascosto resta nascosto.
 *
 * @example
 * ```tsx
 * <h1 className="font-mono text-4xl tracking-wider">
 *   LUDORATTI{' '}
 *   <GlitchText className="text-brand" reveal="EVIL" background="#030712">
 *     E.
 *   </GlitchText>{' '}
 *   CORP
 * </h1>
 * ```
 */
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

export function GlitchText({
  children,
  reveal,
  background = 'transparent',
  className = '',
  revealClassName = 'text-red-500',
}: GlitchTextProps) {
  return (
    <span
      className={`pb-glitch ${className}`}
      // La variabile sta qui e non sulle lamelle: loro la ereditano — comprese quelle dentro il
      // lampo — e detta una volta sola non può diventare due valori diversi.
      style={{ '--pb-glitch-bg': background } as CSSProperties}
    >
      {children}
      <GlitchSlices text={children} />
      {reveal ? (
        <span aria-hidden="true" className={`pb-glitch-reveal animate-reveal ${revealClassName}`}>
          {reveal}
          {/* ⚠️ **Dentro** il lampo, non accanto: il ritaglio e l'opacità di `pb-reveal` valgono
              per tutto il sottoalbero, quindi le copie compaiono e spariscono con lui. Fuori
              girerebbero sopra il nome per tutti e tre i secondi in cui il lampo non c'è. */}
          <GlitchSlices text={reveal} />
        </span>
      ) : null}
    </span>
  );
}
