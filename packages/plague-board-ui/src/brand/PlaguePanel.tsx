import { Card } from '@heroui/react';
import type { ReactNode } from 'react';

export interface PlaguePanelProps {
  /** Che cosa poggia sul pannello. Si compone coi pezzi di `Card` di HeroUI. */
  children: ReactNode;
  /** Classi aggiuntive: è così che si dà una larghezza massima o una spaziatura diversa. */
  className?: string;
}

/**
 * **La superficie su cui poggia la roba della peste**: sfumatura che scende verso il fondo e
 * bordo verde.
 *
 * Sopra la `Card` di HeroUI, che porta raggio, spaziatura, ombra e i suoi pezzi composti —
 * `Card.Header`, `Card.Title`, `Card.Content`, `Card.Footer` — che si usano dentro come sempre.
 *
 * ⚠️ **Segue il tema invece di restare scura**, al contrario di `PlagueBar` e del fondale. Quelle
 * due sono **isole** dichiarate, e possono permetterselo perché sono cornici; un pannello invece
 * contiene testo dell'applicazione, e una lastra scura fissa dentro una pagina chiara obbligherebbe
 * chi lo usa a ridichiarare il colore di ogni parola che ci mette dentro. Il fondo è quindi
 * `surface`, il token della superficie, con sopra un **velo verde** che scende dallo spigolo alto.
 *
 * ⚠️ **Il velo non può scendere verso `background`**, che è la prima cosa che viene in mente: in
 * tema chiaro `--surface` è `#ffffff` e `--background` è `#f5f5f5`, cioè **il colore della pagina**
 * — misurato il 2026-09-20 — quindi il fondo della scheda si dissolveva nella pagina, con 1,09 di
 * contrasto. Un velo del colore del marchio invece tinge senza scomparire, e vale nei due temi.
 *
 * ⚠️ **Il verde del bordo è `brand-ink` e non `brand`**: il lime pieno sul bianco non si vede
 * (misurato altrove: 1,38), mentre `brand-ink` scende a lime-700 in chiaro e torna pieno in scuro.
 * Al 50% fa **3,85** sul fondo scuro e **1,98** su quello chiaro: in chiaro è una riga delicata, e
 * a staccare la scheda dalla pagina è l'ombra di `Card`, che è il modo in cui HeroUI separa le sue
 * superfici. Chi lo vuole più marcato passa una classe, che vince perché arriva dopo.
 *
 * @example
 * ```tsx
 * <PlaguePanel className="max-w-lg">
 *   <Card.Header>
 *     <Card.Title>Plague Network Profile</Card.Title>
 *   </Card.Header>
 *   <Card.Content>…</Card.Content>
 * </PlaguePanel>
 * ```
 */
export function PlaguePanel({ children, className = '' }: PlaguePanelProps) {
  return (
    <Card
      className={`border border-brand-ink/50 bg-surface bg-linear-to-br from-brand-ink/10 to-transparent ${className}`}
    >
      {children}
    </Card>
  );
}
