'use client';

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

/** Che cosa sta suonando, a che volume, e le due leve per cambiarlo. */
export interface MusicValue {
  /** Se la traccia sta suonando **davvero**: lo dicono gli eventi dell'elemento, non i comandi. */
  readonly isPlaying: boolean;
  /** Il volume, da 0 a 1, come lo vuole l'elemento `<audio>`. */
  readonly volume: number;
  /** Mette o toglie la musica. Chiamarlo con lo stato in cui si è già non fa niente. */
  readonly setPlaying: (playing: boolean) => void;
  /** Cambia il volume. Fuori dall'intervallo, il valore si tronca. */
  readonly setVolume: (volume: number) => void;
}

// Nasce `null` per la stessa ragione del livello tossico: è ciò che permette a `useMusic` di
// distinguere «nessuno ha montato il provider» da «la musica è ferma», e di dirlo.
const ContestoMusica = createContext<MusicValue | null>(null);

export interface MusicProviderProps {
  /**
   * La traccia da suonare, in ciclo.
   *
   * ⚠️ **Il file non viaggia col pacchetto**: `LudoRatti.mp3` pesa **2,1 MB**, cento volte il resto
   * della libreria messo insieme, e sarebbe scaricato da chiunque installi il pacchetto — anche da
   * chi la musica non la vuole. Lo serve l'applicazione dalla sua cartella pubblica.
   */
  src: string;
  /** Il volume di partenza, da 0 a 1. Una musica di fondo non parte al massimo. */
  defaultVolume?: number;
  children?: ReactNode;
}

const tronca = (volume: number) => Math.min(1, Math.max(0, volume));

/**
 * **Il filo fra la musica e i comandi che la governano.**
 *
 * Tiene l'elemento `<audio>`, lo stato e il volume; {@link MusicToggle} e {@link MusicVolume} li
 * leggono da qui. È la stessa forma di {@link ToxicLevelProvider}, e per la stessa ragione: chi
 * usa la libreria deve poter mettere l'interruttore in una barra e il cursore in un menù di
 * impostazioni, senza far attraversare lo stato a tutto il layout.
 *
 * ⚠️ **Prima era tutto dentro `MusicToggle`**, e così il volume non aveva dove stare: l'elemento
 * `<audio>` viveva nel comando, quindi un secondo comando altrove non aveva niente da comandare.
 * Rifatto il 2026-09-20 su osservazione dell'utente, ed è la ragione per cui l'interruttore adesso
 * non prende più `src`.
 *
 * ⚠️ **Non parte da sé**, e nemmeno al primo gesto sulla pagina: vedi {@link MusicToggle}.
 *
 * @example
 * ```tsx
 * <MusicProvider src="/audio/LudoRatti.mp3" defaultVolume={0.4}>
 *   <PlagueBar><MusicToggle /></PlagueBar>
 *   <SettingsPanel><MusicVolume /></SettingsPanel>
 * </MusicProvider>
 * ```
 */
export function MusicProvider({ src, defaultVolume = 0.5, children }: MusicProviderProps) {
  const traccia = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(() => tronca(defaultVolume));

  const valore = useMemo<MusicValue>(
    () => ({
      isPlaying,
      volume,
      setPlaying: (playing) => {
        const audio = traccia.current;
        if (!audio) return;

        if (!playing) {
          audio.pause();
          return;
        }

        // ⚠️ `play()` restituisce una promessa che **può essere rifiutata** — il browser blocca
        // l'audio finché non c'è stato un gesto, e qui il gesto c'è, ma il file potrebbe anche non
        // caricarsi. Senza il `catch`, quel rifiuto diventa un errore non gestito in console; e lo
        // stato non si scrive qui ma negli eventi dell'elemento, che sono l'unica verità su ciò
        // che sta suonando davvero.
        void audio.play().catch(() => setIsPlaying(false));
      },
      setVolume: (prossimo) => {
        const tagliato = tronca(prossimo);
        // ⚠️ Il volume si scrive **sull'elemento e nello stato**, non solo nello stato: quello è
        // ciò che si sente, questo è ciò che il cursore mostra. Un effetto che li allineasse dopo
        // il render farebbe scattare il suono un fotogramma più tardi del cursore.
        if (traccia.current) traccia.current.volume = tagliato;
        setVolumeState(tagliato);
      },
    }),
    [isPlaying, volume],
  );

  return (
    <ContestoMusica.Provider value={valore}>
      {/* ⚠️ L'elemento sta nel DOM e non è un `new Audio()`: così è React a montarlo e smontarlo, e
          una pagina che cambia non lascia una traccia che suona nel vuoto. Il volume iniziale è un
          attributo del DOM, perché `volume` non è una prop di React. */}
      <audio
        ref={(nodo) => {
          traccia.current = nodo;
          if (nodo) nodo.volume = volume;
        }}
        src={src}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {children}
    </ContestoMusica.Provider>
  );
}

/**
 * Legge che cosa sta suonando e a che volume.
 *
 * ⚠️ **Fuori da {@link MusicProvider} lancia**, come `useToxicLevel`: un valore predefinito
 * silenzioso lascerebbe l'interruttore e il cursore a comandare due tracce diverse, e non se ne
 * accorgerebbe nessuno finché non si preme.
 */
export function useMusic(): MusicValue {
  const valore = useContext(ContestoMusica);

  if (valore === null) {
    throw new Error(
      'useMusic va usato dentro un <MusicProvider>: è lui che tiene la traccia che l’interruttore e il cursore del volume si scambiano.',
    );
  }

  return valore;
}
