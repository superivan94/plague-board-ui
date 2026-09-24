'use client';

import { Card } from '@heroui/react';
import type { ReactNode } from 'react';

import { PlagueBackground } from './PlagueBackground.js';
import { PlaguePanel } from './PlaguePanel.js';
import { RatSwarm } from './RatSwarm.js';

export interface LoginScreenProps {
  /** Il titolo della schermata. Diventa l'`h1` della pagina: vedi il perché qui sotto. */
  title: ReactNode;
  /** La riga sotto il titolo. Senza, non resta un paragrafo vuoto. */
  subtitle?: ReactNode;
  /** Che cosa c'è nel pannello: il comando di Google, il separatore, un modulo, un avviso. */
  children: ReactNode;
  /**
   * I comandi nell'angolo in alto a destra — la musica, il livello tossico. Stanno **fuori** dal
   * pannello perché non c'entrano con l'accesso: governano la scena.
   */
  aside?: ReactNode;
  /** Il piede del pannello: la versione, un collegamento, la firma. */
  footer?: ReactNode;
  /** Che i ratti attraversino la scena. Acceso di serie — la schermata è una scenografia. */
  hasRats?: boolean;
  /**
   * Che la schermata sia alta quanto la finestra. Acceso di serie.
   *
   * ⚠️ **È un interruttore e non «passa la tua classe»**, e il motivo è misurato altrove in questo
   * repository: due utility della stessa proprietà nello stesso attributo non si risolvono
   * nell'ordine in cui le si scrive, ma nell'ordine in cui Tailwind le emette. Un `min-h-[36rem]`
   * passato da fuori vincerebbe o perderebbe contro il nostro `min-h-dvh` a seconda della build.
   * Spento, l'altezza la dà `className` e qui non c'è niente che le si opponga.
   */
  isFullHeight?: boolean;
  /** Classi aggiuntive sulla scena. */
  className?: string;
  /** Classi aggiuntive sul pannello: è così che si cambia la larghezza massima. */
  panelClassName?: string;
}

/**
 * **La schermata di accesso dei Ludoratti**: il fondale della peste, i ratti che passano, e un
 * pannello in mezzo con dentro quello che ci mette l'applicazione.
 *
 * ⚠️ **È l'unico componente della libreria che ne compone altri**, ed è il caso in cui ha senso:
 * tutte e quattro le applicazioni accedono con un account Google, quella schermata ce l'hanno già
 * tutte, e oggi è identica *male* — ognuna se l'è disegnata da sé. Chi ne vuole una diversa
 * continua a prendere i pezzi separati: {@link PlagueBackground}, {@link PlaguePanel},
 * {@link RatSwarm} e {@link GoogleSignInButton} restano pubblici e non sanno di questa.
 *
 * ⚠️ **Vuole un {@link ToxicLevelProvider} sopra**, come il fondale che monta: la composizione non
 * cambia il contratto di ciò che compone. Un provider suo sembrerebbe una comodità e sarebbe una
 * trappola — un interruttore del livello messo dall'applicazione **fuori** dalla schermata
 * finirebbe a governare un altro stato, e non succederebbe niente senza che niente sia rotto.
 *
 * ⚠️ **Il titolo è un `h1`, e per averlo serve `render`.** `Card.Title` di HeroUI rende un `h3` —
 * il suo elemento si cambia solo con quella prop, che è una funzione — e un `h3` sotto a niente è
 * un salto di livello che a schermo non si vede. Da qui le due conseguenze: questo modulo
 * dichiara `'use client'` (una funzione non attraversa il confine, quindi il confine dev'essere
 * qui), e il livello è **fisso**: una schermata di accesso *è* la pagina. Chi la incastra dentro
 * un'altra pagina che un `h1` ce l'ha già, i pezzi se li compone.
 *
 * ⚠️ **I comandi d'angolo e i ratti stanno nel riquadro del contenuto, non in quello del fondale**:
 * gli strati decorativi di {@link PlagueBackground} sono `aria-hidden` e `pointer-events-none`, e
 * un comando finito là dentro sarebbe invisibile ai lettori di schermo e impossibile da premere.
 *
 * @example
 * ```tsx
 * <ToxicLevelProvider>
 *   <LoginScreen
 *     title="Entra nella tana"
 *     subtitle="Gestisci i manuali della diffusione"
 *     aside={<MusicToggle />}
 *   >
 *     <GoogleSignInButton onPress={accedi} />
 *     <PlagueDivider icon={null}>oppure</PlagueDivider>
 *   </LoginScreen>
 * </ToxicLevelProvider>
 * ```
 */
export function LoginScreen({
  title,
  subtitle,
  children,
  aside,
  footer,
  hasRats = true,
  isFullHeight = true,
  className = '',
  panelClassName = '',
}: LoginScreenProps) {
  return (
    <PlagueBackground
      // `grid` con un solo figlio in flusso: il riquadro del contenuto si stira da sé all'altezza
      // della scena, e il pannello si centra dentro di lui senza una seconda altezza da tenere
      // allineata alla prima.
      className={`grid ${isFullHeight ? 'min-h-dvh' : ''} ${className}`}
      contentClassName="flex items-center justify-center p-4"
    >
      {hasRats ? <RatSwarm /> : null}

      {aside ? <div className="absolute top-4 right-4 z-10">{aside}</div> : null}

      <PlaguePanel className={`w-full max-w-md ${panelClassName}`}>
        <Card.Header className="gap-1 text-center">
          {/* La taglia sostituisce quella di HeroUI invece di scontrarsi con lei: `card__title`
              tiene il suo `text-sm` dentro `@layer components`, e una utility vince su un layer.
              Misurato in pagina: classi `card__title text-xl`, `font-size` **20px**. */}
          <Card.Title className="text-xl" render={(props) => <h1 {...props} />}>
            {title}
          </Card.Title>
          {subtitle ? <Card.Description>{subtitle}</Card.Description> : null}
        </Card.Header>

        <Card.Content className="gap-4">{children}</Card.Content>

        {footer ? <Card.Footer className="justify-center">{footer}</Card.Footer> : null}
      </PlaguePanel>
    </PlagueBackground>
  );
}
