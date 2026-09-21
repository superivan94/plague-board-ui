'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { ToxicLevel } from './toxicLevel.js';

/** Quanto c'è in scena adesso, e come cambiarlo. */
export interface ToxicLevelValue {
  /** Il livello corrente. */
  readonly level: ToxicLevel;
  /** Lo cambia. Chi lo chiama è il selettore, o l'applicazione che decide da sé. */
  readonly setLevel: (level: ToxicLevel) => void;
}

// ⚠️ Nasce `null` e non con un livello predefinito: è ciò che permette a `useToxicLevel` di
// distinguere «nessuno ha montato il provider» da «il livello è spento», e di dirlo invece di
// far finta di niente.
const ContestoTossico = createContext<ToxicLevelValue | null>(null);

export interface ToxicLevelProviderProps {
  /** Da che livello si parte. `high` come la pagina di RattInventario da cui viene. */
  defaultLevel?: ToxicLevel;
  children?: ReactNode;
}

/**
 * **Il filo fra il fondale e il suo comando.**
 *
 * `PlagueBackground` sta in cima alla pagina e `ToxicLevelSwitch` dove l'applicazione preferisce —
 * spesso in un piede, cioè all'altro capo dell'albero. Passarsi il livello a mano vorrebbe dire
 * farlo attraversare il layout per intero; qui lo si mette una volta sola attorno a ciò che deve
 * vederlo, e i due si trovano da sé.
 *
 * ⚠️ **È il primo e unico contesto della libreria, e la regola non è cambiata.** Lo stato di
 * dominio resta dove sta: questo non è un dato dell'applicazione, è una **preferenza di
 * presentazione** che attraversa la pagina — la stessa categoria del tema o di «meno movimento».
 *
 * ⚠️ **Dichiara `'use client'`, quindi va montato da un componente client** o da un layout che
 * passa i figli così com'erano: i figli che arrivano come prop restano resi sul server, ed è il
 * motivo per cui il fondale non costringe tutta la pagina a diventare client.
 *
 * @example
 * ```tsx
 * <ToxicLevelProvider defaultLevel="medium">
 *   <PlagueBackground>{children}</PlagueBackground>
 * </ToxicLevelProvider>
 * ```
 */
export function ToxicLevelProvider({ defaultLevel = 'high', children }: ToxicLevelProviderProps) {
  const [level, setLevel] = useState<ToxicLevel>(defaultLevel);

  // Senza, ogni render del genitore darebbe un oggetto nuovo e ridisegnerebbe tutto ciò che
  // legge il contesto — cioè il fondale, che è la cosa più cara della pagina.
  const valore = useMemo<ToxicLevelValue>(() => ({ level, setLevel }), [level]);

  return <ContestoTossico.Provider value={valore}>{children}</ContestoTossico.Provider>;
}

/**
 * Legge il livello dell'atmosfera, e la funzione per cambiarlo.
 *
 * ⚠️ **Fuori da {@link ToxicLevelProvider} lancia**, e non è una durezza gratuita: un valore
 * predefinito silenzioso lascerebbe il selettore e il fondale a funzionare **ognuno per conto
 * suo**, con due stati diversi che nessuno nota finché non si preme il comando e non succede
 * niente. Un errore al primo render dice il nome del pezzo che manca.
 */
export function useToxicLevel(): ToxicLevelValue {
  const valore = useContext(ContestoTossico);

  if (valore === null) {
    throw new Error(
      'useToxicLevel va usato dentro un <ToxicLevelProvider>: è lui che tiene il livello che il fondale e il selettore si scambiano.',
    );
  }

  return valore;
}
