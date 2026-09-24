export interface PulseDotProps {
  /** Il diametro in pixel. */
  size?: number;
  /** Classi aggiuntive: è così che si cambia colore, con `bg-plague-400` o quello che serve. */
  className?: string;
  /**
   * Fermo invece che pulsante.
   *
   * ⚠️ Serve più di quanto sembri: il pallino marca anche le voci di un elenco, e venti pallini
   * che pulsano insieme smettono di richiamare l'attenzione e diventano rumore.
   */
  isStatic?: boolean;
}

/**
 * **Il pallino che pulsa.** Il segno di vitalità dei Ludoratti: dice «questa cosa è viva, accesa,
 * raggiungibile».
 *
 * Su `ludoratti.it` sta prima del titolo di ogni destinazione e smette di pulsare quando ci passi
 * sopra — il richiamo ha già funzionato, e insistere infastidisce.
 *
 * ⚠️ È **decorativo**: non si annuncia. Lo stato che rappresenta, se conta davvero, va scritto
 * anche a parole accanto — un lettore di schermo un pallino verde non lo sente.
 */
export function PulseDot({ size = 10, className = '', isStatic = false }: PulseDotProps) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`inline-block shrink-0 rounded-full bg-brand ${isStatic ? '' : 'animate-pulse'} ${className}`}
    />
  );
}
