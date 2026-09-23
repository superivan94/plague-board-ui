import { Alert } from '@heroui/react';
import type { ReactNode } from 'react';

import { statusIcon, type PlagueStatus } from './statusIcons.js';

export interface PlagueAlertProps {
  /**
   * Che tono ha: `default` e `accent` informano, `success` dice che è andata, `warning` avverte,
   * `danger` dice che qualcosa si è rotto. Di serie `default`.
   */
  status?: PlagueStatus;
  /** La frase che conta — «Sigillato», «Il ceppo è degenerato». */
  title: ReactNode;
  /** La spiegazione sotto, se serve. */
  children?: ReactNode;
  /** Il segno a sinistra. Di serie quello del tono, dal vocabolario della peste. */
  icon?: ReactNode;
  /** Classi aggiuntive sul riquadro. */
  className?: string;
}

/**
 * **L'avviso dentro la pagina**: il salvataggio non riuscito, la scheda sola in lettura,
 * l'importazione andata a buon fine. Sopra l'`Alert` di HeroUI, coi segni della peste al posto dei
 * suoi cerchi.
 *
 * ⚠️ **Il ruolo lo mette lui**, perché l'`Alert` di HeroUI è un `<div>` che non ne ha nessuno — e un
 * avviso che non si annuncia a chi legge con la voce non avvisa nessuno. `alert` interrompe quello
 * che si sta leggendo, quindi va solo a `warning` e `danger`; gli altri tre sono `status`, che
 * aspetta il suo turno.
 *
 * ⚠️ **Nato già pieno può non essere annunciato**, come ogni regione viva (vedi `SpeechBubble`): va
 * montato quando succede la cosa, non tenuto in pagina e riempito dopo con un altro testo.
 *
 * Per una notifica che compare e se ne va da sola c'è {@link PlagueToastRegion}; questo resta dove
 * lo si mette.
 */
export function PlagueAlert({ status = 'default', title, children, icon, className = '' }: PlagueAlertProps) {
  const interrompe = status === 'warning' || status === 'danger';

  return (
    <Alert status={status} role={interrompe ? 'alert' : 'status'} className={className}>
      <Alert.Indicator>{icon ?? statusIcon(status)}</Alert.Indicator>
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        {children ? <Alert.Description>{children}</Alert.Description> : null}
      </Alert.Content>
    </Alert>
  );
}
