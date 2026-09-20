'use client';

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';

import { TechLabel } from './TechLabel';
import { TOXIC_LEVELS, TOXIC_LEVEL_LABELS, type ToxicLevel } from './toxicLevel';
import { useToxicLevel } from './ToxicLevelProvider';

export interface ToxicLevelSwitchProps {
  /**
   * Come si chiama il comando per chi non lo vede. Ha un valore predefinito perché un comando
   * senza nome è un comando che nessuno può annunciare, non perché il testo appartenga alla
   * libreria.
   */
  label?: string;
  /**
   * Come si chiamano i quattro livelli. Il valore predefinito è {@link TOXIC_LEVEL_LABELS}, cioè
   * le parole di casa: un'applicazione in un'altra lingua ne passa altre quattro.
   */
  labels?: Record<ToxicLevel, string>;
  /** Classi aggiuntive sul gruppo. */
  className?: string;
}

/**
 * **Quanta atmosfera**: i quattro livelli in fila, e si sceglie quello che si vuole.
 *
 * È il comando che in RattInventario sta dentro il piede della pagina di accesso — «Change toxic
 * emissions level» — e che di là è un **ciclo**: una pressione, il livello dopo, e da capo. Qui i
 * quattro stanno tutti a schermo, per due ragioni misurate: col ciclo si arriva al livello
 * precedente solo facendo il giro — da «alto» a «basso» erano tre pressioni, e la prima spegneva
 * tutto — e chi non vede il comando non ha modo di sapere quante scelte ci siano.
 *
 * ⚠️ **Non ha uno stato suo**: legge e scrive quello di {@link ToxicLevelProvider}, che è la stessa
 * cosa che legge il fondale. Due stati separati sarebbero due comandi che si contraddicono.
 *
 * ⚠️ **È un `radiogroup`, e lo è senza che glielo dicessimo**: `ToggleButtonGroup` di HeroUI con
 * `selectionMode="single"` rende `role="radiogroup"` e figli `role="radio"` con `aria-checked`.
 * Misurato il 2026-09-20 sul DOM, non letto: è la ragione per cui non serve il `RadioGroup` — che
 * fra l'altro, senza i suoi sotto-pezzi composti, di ruoli non ne mette affatto.
 *
 * ⚠️ **Dove va lo decide chi lo usa.** In un piede, in un menu di impostazioni, dentro un pannello:
 * non disegna nessun contenitore e non si posiziona.
 */
export function ToxicLevelSwitch({
  label = 'Livello delle emissioni',
  labels = TOXIC_LEVEL_LABELS,
  className = '',
}: ToxicLevelSwitchProps) {
  const { level, setLevel } = useToxicLevel();

  return (
    <ToggleButtonGroup
      size="sm"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[level]}
      onSelectionChange={(keys) => {
        const scelto = [...keys][0] as ToxicLevel | undefined;
        if (scelto !== undefined) setLevel(scelto);
      }}
      aria-label={label}
      className={className}
    >
      {TOXIC_LEVELS.map((livello) => (
        <ToggleButton key={livello} id={livello}>
          <TechLabel>{labels[livello]}</TechLabel>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
