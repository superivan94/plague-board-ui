'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import {
  resolveToxicLevelSettings,
  type ToxicLevel,
  type ToxicLevelOverrides,
  type ToxicLevelSettings,
} from './toxicLevel.js';

/** Quanto c'è in scena adesso, e come cambiarlo. */
export interface ToxicLevelValue {
  /** Il livello corrente. */
  readonly level: ToxicLevel;
  /** Lo cambia. Chi lo chiama è il selettore, o l'applicazione che decide da sé. */
  readonly setLevel: (level: ToxicLevel) => void;
  /**
   * Quanto c'è in scena a ogni livello: {@link TOXIC_LEVEL_SETTINGS} con sopra i ritocchi della
   * prop `settings`. È la tabella che il fondale, le bolle e i versi leggono davvero.
   */
  readonly settings: Readonly<Record<ToxicLevel, ToxicLevelSettings>>;
}

// ⚠️ Nasce `null` e non con un livello predefinito: è ciò che permette a `useToxicLevel` di
// distinguere «nessuno ha montato il provider» da «il livello è spento», e di dirlo invece di
// far finta di niente.
const ContestoTossico = createContext<ToxicLevelValue | null>(null);

export interface ToxicLevelProviderProps {
  /** Da che livello si parte. `high` come la pagina di RattInventario da cui viene. */
  defaultLevel?: ToxicLevel;
  /**
   * La taratura ritoccata, livello per livello: si scrivono solo le voci che cambiano — la
   * frequenza dei versi, il tetto delle bolle — e il resto resta quello di
   * {@link TOXIC_LEVEL_SETTINGS}.
   *
   * ⚠️ **Si passa stabile**, cioè una costante di modulo e non un oggetto scritto in linea. Uno
   * nuovo a ogni render del genitore ridisegna tutto ciò che legge il contesto: non rompe niente,
   * perché i timer del fondale guardano i numeri e non l'oggetto, ma costa un disegno del fondale a
   * ogni giro.
   */
  settings?: ToxicLevelOverrides;
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
 * Tiene anche **quanto vale ogni livello**: la taratura di {@link TOXIC_LEVEL_SETTINGS}, che la
 * prop `settings` ritocca voce per voce. Sta qui e non sul fondale perché la leggono tre pezzi —
 * il fondale, le bolle e i versi — e le bolle si montano anche da sole.
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
 * // Una città più chiacchierona ad «alto»: un verso ogni mezzo secondo, mai più di tre insieme.
 * const CITTA_FITTA: ToxicLevelOverrides = { high: { chatterEveryMs: [400, 700], maxChatter: 3 } };
 *
 * <ToxicLevelProvider defaultLevel="medium" settings={CITTA_FITTA}>
 *   <PlagueBackground>{children}</PlagueBackground>
 * </ToxicLevelProvider>
 * ```
 */
export function ToxicLevelProvider({ defaultLevel = 'high', settings, children }: ToxicLevelProviderProps) {
  const [level, setLevel] = useState<ToxicLevel>(defaultLevel);
  const taratura = useMemo(() => resolveToxicLevelSettings(settings), [settings]);

  // Senza, ogni render del genitore darebbe un oggetto nuovo e ridisegnerebbe tutto ciò che
  // legge il contesto — cioè il fondale, che è la cosa più cara della pagina.
  const valore = useMemo<ToxicLevelValue>(
    () => ({ level, setLevel, settings: taratura }),
    [level, taratura],
  );

  return <ContestoTossico.Provider value={valore}>{children}</ContestoTossico.Provider>;
}

/**
 * Legge il livello dell'atmosfera, la funzione per cambiarlo e la taratura di ogni livello.
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
