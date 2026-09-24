import { LUDORATTI_COPY } from '../data/copy.js';
import { RatIcon } from '../icons/RatIcon.js';
import { Rat } from './Rat.js';

/** Le due taglie dell'attesa: dentro una riga, o al posto di un riquadro intero. */
export type PlagueLoaderVariant = 'inline' | 'block';

export interface PlagueLoaderProps {
  /**
   * Che cosa si sta aspettando. È il nome con cui l'attesa si annuncia, e in `block` si legge anche
   * a schermo. Di serie la voce `loading` del lessico di casa.
   */
  label?: string;
  /**
   * `inline` è il marchio che batte, alto quanto il testo che gli sta accanto: dentro un bottone,
   * in una riga, in una cella. `block` è il ratto che corre sul posto con la frase sotto, al posto
   * di un riquadro che si sta caricando.
   */
  variant?: PlagueLoaderVariant;
  /** Classi aggiuntive sul contenitore. */
  className?: string;
}

/**
 * **L'attesa dei Ludoratti**: il marchio che batte veloce quando è piccola, il ratto che corre sul
 * posto quando occupa un riquadro (utente, 2026-09-23: *marchio piccolo, ratto grande*).
 *
 * Al posto dello `Spinner` di HeroUI, che nasce `role="status"` col nome «Loading» — in inglese e
 * senza modo di cambiarlo. Qui il nome è la frase, e i segni sono decorativi: a dire che si
 * aspetta è lei, e resta anche quando il movimento si ferma.
 *
 * ⚠️ **Piccolo, la frase non si vede e si annuncia lo stesso.** Dentro un bottone che dice già
 * «Sigilla», scriverla a schermo la farebbe leggere due volte; chi la vuole visibile accanto al
 * marchio la scrive lui.
 *
 * ⚠️ **Il ratto sotto i 40 px non si legge**, ed è il motivo delle due taglie invece di una sola
 * che si allarga: nel bottone ci va il marchio, che resta un cuore anche a 12.
 *
 * ⚠️ **Con «meno movimento» si ferma, e non sparisce**: il marchio resta alla sua taglia, il ratto
 * in piedi, e la frase dice comunque che cosa succede. Un'attesa che scompare sembrerebbe finita.
 *
 * ⚠️ **Una regione viva nata già piena può non essere annunciata** — è la regola misurata su
 * `SpeechBubble`. L'attesa si fa trovare da chi la cerca; chi deve **dire** a voce che il
 * caricamento è partito lo scrive in una regione che c'era già prima.
 */
export function PlagueLoader({
  label = LUDORATTI_COPY.loading.house,
  variant = 'inline',
  className = '',
}: PlagueLoaderProps) {
  if (variant === 'block') {
    return (
      <div role="status" className={`flex flex-col items-center gap-3 py-6 text-center ${className}`}>
        <Rat size={56} isRunning />
        <p className="font-mono text-sm text-muted">{label}</p>
      </div>
    );
  }

  // ⚠️ La frase qui sta in `aria-label` e non in un testo nascosto: `role="status"` il nome non lo
  // prende dal contenuto, come fa un bottone, quindi un `sr-only` dentro lo lascerebbe senza nome.
  return (
    <span role="status" aria-label={label} className={`inline-flex items-center align-middle ${className}`}>
      <span className="pb-loader-beat inline-flex">
        <RatIcon isFilled animateOn="none" size={16} className="size-[1em]" />
      </span>
    </span>
  );
}
