import type { ReactNode } from 'react';

export interface PlaguePulseProps {
  /** Quello che deve pulsare: di solito un comando. */
  children?: ReactNode;
  /** Classi aggiuntive: la forma della lastra — quanto è arrotondata, quanto è larga — è di chi la monta. */
  className?: string;
}

/**
 * **La lastra che respira**, per mettere l'occhio sul comando che conta.
 *
 * In RattInventario è il riquadro attorno a «Initialize Plague Protocol»: fondo, bordo e alone
 * cambiano insieme, due secondi per ciclo, e il verde passa da `plague-700` a `plague-600`. Di là
 * quell'animazione sta in un `<style jsx>` dentro il modulo del login, cioè è **di quella pagina**;
 * qui è un pezzo che avvolge qualunque cosa.
 *
 * ⚠️ **Il figlio deve essere trasparente, o il pulsare non si vede.** È la lastra a essere
 * dipinta, e un bottone col suo fondo la copre — di là il problema è risolto con un
 * `:global(button) { background: transparent !important }`, cioè entrando dentro il figlio a
 * spegnergli il colore. Un componente di libreria non può permetterselo: il figlio non è suo, e
 * un `!important` calato da fuori è esattamente ciò che rende impossibile vestire un componente.
 * Si passa quindi un comando già trasparente — la variante `ghost` di un `Button`, o un
 * `<button>` proprio.
 *
 * ⚠️ **Non si annuncia e non aggiunge ruoli**: è una decorazione attorno a un comando che ha già
 * il suo nome. Con `prefers-reduced-motion` smette di pulsare e resta il verde di partenza, per la
 * regola in fondo ad `animations.css`.
 */
export function PlaguePulse({ children, className = '' }: PlaguePulseProps) {
  return <div className={`animate-plague-pulse rounded-md border ${className}`}>{children}</div>;
}
