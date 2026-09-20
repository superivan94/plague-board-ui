import { Button } from '@heroui/react';
import { Fragment } from 'react';
import {
  BacillusIcon,
  BiohazardIcon,
  CloudIcon,
  CoccusIcon,
  CodeIcon,
  DiceIcon,
  MoleculeIcon,
  PoisonIcon,
  PotionMugIcon,
  RobotIcon,
  SkullIcon,
  SparklesIcon,
  TechLabel,
  TechRule,
  VirusIcon,
} from 'plague-board-ui';

import { GameIconsSection } from './GameIconsSection';

// ⚠️ Nessun colore scritto a mano in questa pagina: tutto passa dai token, perché è la pagina che
// deve reggere il commutatore del tema in cima. Un `text-gray-400` qui dentro sarebbe invisibile
// in chiaro, ed è esattamente il difetto che la pagina esiste per non far succedere.
const icons = [
  { name: 'PoisonIcon', Icon: PoisonIcon },
  { name: 'PotionMugIcon', Icon: PotionMugIcon },
  { name: 'SkullIcon', Icon: SkullIcon },
  { name: 'MoleculeIcon', Icon: MoleculeIcon },
  { name: 'BacillusIcon', Icon: BacillusIcon },
  { name: 'CoccusIcon', Icon: CoccusIcon },
  { name: 'BiohazardIcon', Icon: BiohazardIcon },
  { name: 'VirusIcon', Icon: VirusIcon },
];

// ⚠️ Le colonne sono **larghe quanto l'icona più grande**, non `1fr`: con `minmax(0, 1fr)` a 375px
// ognuna si stringeva a 21px, e la riga scritta «56PX» mostrava icone da ventuno. Un `<svg>` con la
// larghezza nell'attributo è comunque un figlio di flex, e si lascia schiacciare in silenzio. Con
// la misura scritta, la tabella trabocca e il suo involucro la fa scorrere di lato.
const ICON_GRID = 'grid w-max items-end gap-3';
const iconGridColumns = { gridTemplateColumns: `5rem repeat(${icons.length}, 3.5rem)` };

const swatches = [
  ['brand', 'bg-brand'],
  ['brand-light', 'bg-brand-light'],
  ['brand-dark', 'bg-brand-dark'],
  ['toxic', 'bg-toxic'],
  ['plague-400', 'bg-plague-400'],
  ['plague-500', 'bg-plague-500'],
  ['plague-600', 'bg-plague-600'],
  ['plague-700', 'bg-plague-700'],
];

const signature = [
  { name: 'CodeIcon', Icon: CodeIcon, label: 'Superivan94' },
  { name: 'RobotIcon', Icon: RobotIcon, label: 'AI-Dev' },
  { name: 'SparklesIcon', Icon: SparklesIcon, label: 'suggerito' },
];

/** I due token che cambiano col tema, resi identici dentro le due isole. */
function InkSample({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-background p-4 text-foreground">
      <TechLabel className="text-muted">{label}</TechLabel>
      <span className="text-plague-ink">Il verde con cui si scrive</span>
      <span className="text-brand-ink">Il verde del marchio</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">La tavolozza</h1>
        <p className="text-sm text-muted">
          Due verdi con due mestieri. <strong>brand</strong> è il lime della corporazione, quello
          del marchio e dei comandi principali; <strong>plague</strong> è il verde della malattia,
          che veste icone, fondali e stati. Non si scambiano.
        </p>
      </div>

      <TechRule>i colori</TechRule>

      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {swatches.map(([name, className]) => (
            <div key={name} className="flex items-center gap-2">
              <span className={`size-8 rounded border border-border ${className}`} />
              <TechLabel className="text-muted">{name}</TechLabel>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted">
          <strong>Nessuna scala di grigi.</strong> Il nero dei Ludoratti è già il{' '}
          <code>gray-950</code> di Tailwind, e i grigi delle superfici sono quelli di HeroUI:
          ridichiararli vorrebbe dire sovrascriverli a chi installa.{' '}
          <code>toxic</code> è un accento, <strong>non un colore di testo</strong>: su bianco fa{' '}
          <strong>1,37</strong> di contrasto. Si usa su fondo scuro, a bassa opacità, e su
          superfici — mai sotto una frase.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Un bottone di HeroUI</Button>
          <span className="text-sm text-muted">
            vestito dal solo <code>theme.css</code>, senza una riga sua
          </span>
        </div>
      </section>

      <TechRule>i due temi</TechRule>

      <section className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Su fondo chiaro i verdi della peste non si leggono: <code>plague-400</code> su bianco fa{' '}
          <strong>1,74</strong> di contrasto. Per questo il testo verde non usa mai il colore
          grezzo ma <code>text-plague-ink</code> e <code>text-brand-ink</code>, che cambiano col
          tema. Prova il commutatore in alto a destra, o guarda i due temi affiancati:
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="light">
            <InkSample label="chiaro" />
          </div>
          <div className="dark">
            <InkSample label="scuro" />
          </div>
        </div>

        <p className="text-sm text-muted">
          I due riquadri qui sopra sono nella stessa pagina: i selettori del tema sono{' '}
          <strong>classi qualunque</strong>, non <code>:root</code>, quindi un&apos;isola chiara può
          vivere dentro una pagina scura e viceversa.
        </p>
      </section>

      <TechRule>i segni</TechRule>

      <section className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Le tre misure sono quelle vere: <strong>56</strong> in un fondale, <strong>24</strong>{' '}
          accanto a un testo, <strong>16</strong> dentro una riga di stato. Le righe dicono da sole
          perché i contagi sono quattro segni e non uno: <strong>ognuno ha la sua misura
          minima</strong>, e sotto quella non si rompe — si impasta, che è peggio, perché continua
          a sembrare un&apos;icona. <code>MoleculeIcon</code> regge a <strong>16</strong>, perché i
          suoi dischi sono staccati; <code>BacillusIcon</code> a <strong>20</strong>, perché il suo
          corpo è una massa sola; <code>CoccusIcon</code> e <code>BiohazardIcon</code> non scendono
          sotto i <strong>32</strong> — i pili dell&apos;uno si saldano al corpo, i lobi
          dell&apos;altro si chiudono fra loro. Dove serve un segno piccolo della peste si prende
          quello che ci sta, non quello che piace di più.
        </p>

        <p className="text-sm text-muted">
          E i cinque non si sovrappongono: <code>VirusIcon</code> è il <strong>virione</strong>,{' '}
          <code>MoleculeIcon</code> la <strong>molecola</strong>, <code>BiohazardIcon</code> il{' '}
          <strong>cartello di pericolo</strong>. I batteri sono gli unici <strong>vivi</strong>, e
          sono due perché hanno due mestieri: il bacillo ha un verso e si mette accanto a una
          parola, il cocco non ce l&apos;ha e per questo galleggia in un fondale senza sembrare
          storto. ⚠️ Nessuno dei due si chiama <code>BacteriaIcon</code>: un nome generico dovrebbe
          scegliere una delle due forme, e chi lo importasse si ritroverebbe l&apos;altra.
        </p>

        <p className="text-sm text-muted">
          ⚠️ <strong>Il virione è l&apos;unico contagio a campitura piena</strong>, ed è quello che
          lo tiene distinguibile quando il dettaglio è sparito: a <strong>12</strong> e{' '}
          <strong>14</strong> — le misure a cui viene usato davvero, dentro una pastiglia del grado
          o in una riga di firma — nessuno dei cinque disegna più niente, ma una <strong>macchia
          irta e piena</strong> resta un&apos;altra cosa da un contorno vuoto. Da 24 in su torna a
          dire «virione».
        </p>

        <p className="text-sm text-muted">
          I due recipienti dicono l&apos;opposto l&apos;uno dell&apos;altro, e la differenza è la
          sagoma. <code>PoisonIcon</code> è l&apos;<strong>ampolla</strong>, la stessa che la
          mascotte tiene in mano: è un accento su un&apos;<strong>azione</strong> — il comando che
          manda un modulo, la riga che apre un profilo. <code>PotionMugIcon</code> ha un{' '}
          <strong>manico</strong>, perché la tazza è la convenzione che nel software dice «offrimi
          qualcosa», e sta solo dentro il comando delle donazioni.
        </p>

        <div className="overflow-x-auto">
          <div className={`${ICON_GRID} text-plague-ink`} style={iconGridColumns}>
            <span />
            {icons.map(({ name }) => (
              <TechLabel key={name} className="text-center text-muted">
                {name.replace('Icon', '')}
              </TechLabel>
            ))}

            {[56, 24, 16].map((size) => (
              <Fragment key={size}>
                <TechLabel className="text-muted">{size}px</TechLabel>
                {icons.map(({ name, Icon }) => (
                  <span key={name} className="flex justify-center">
                    <Icon size={size} />
                  </span>
                ))}
              </Fragment>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted">
          Nessuna icona ha un colore addosso: prendono quello del testo che le contiene, ed è
          quello che permette di sostituirle dentro un comando senza sapere in che tema finiranno.
        </p>
      </section>

      <TechRule>il gioco e la cappa</TechRule>

      <section className="flex flex-col gap-6">
        <p className="text-sm text-muted">
          Due segni che di malattia non parlano. <code>DiceIcon</code> è il{' '}
          <strong>terzo termine</strong> — peste, ratti, <strong>gioco</strong> — e sta dove si
          nomina quello che qui dentro si fa davvero; senza di lui la famiglia dice solo chi siamo.
        </p>

        <div className="flex flex-wrap items-end gap-8 text-plague-ink">
          {[56, 24, 16].map((size) => (
            <span key={size} className="flex flex-col items-center gap-2">
              <DiceIcon size={size} />
              <TechLabel className="text-muted">{size}px</TechLabel>
            </span>
          ))}
        </div>

        <p className="text-sm text-muted">
          I cinque punti sono <strong>buchi nel corpo</strong>, non dischi dipinti: da lì si vede
          quello che c&apos;è dietro, quindi il dado vale su una pagina chiara, su una scura e
          dentro una pastiglia colorata senza cambiare niente. A <strong>16</strong> è al suo
          limite — i punti sono larghi due pixel — e sotto resta un quadrato stondato.
        </p>

        <p className="text-sm text-muted">
          <code>CloudIcon</code> invece <strong>non è un&apos;icona da mettere accanto a un
          testo</strong>: è la cappa di smog che sta sopra la città, e la sua misura vera comincia
          dove quella di un&apos;icona finisce. Si usa grande e tenue, dietro tutto il resto.
        </p>

        <div className="flex flex-wrap items-center gap-10 text-plague-ink">
          <span className="flex flex-col items-center gap-2">
            <CloudIcon size={24} />
            <TechLabel className="text-muted">24px · una nuvoletta</TechLabel>
          </span>
          <span className="flex flex-col items-center gap-2">
            <CloudIcon size={160} className="opacity-20" />
            <TechLabel className="text-muted">160px al 20% · un cielo</TechLabel>
          </span>
        </div>

        <p className="text-sm text-muted">
          La base è <strong>piatta</strong>, e non è un dettaglio: un cumulo ha il fondo smerlato
          come la cima, una cappa poggia su una linea. E come tutte le altre sta{' '}
          <strong>dentro</strong> il suo riquadro coi margini di famiglia — un disegno che ne tocca
          i bordi, alla stessa <code>size</code>, sembra più grande di quelli che gli stanno
          accanto.
        </p>
      </section>

      <section className="flex flex-col gap-6 text-plague-ink">
        <GameIconsSection />
      </section>

      <TechRule>la firma</TechRule>

      <section className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          A <strong>20px</strong> accanto al nome di chi ha scritto una cosa: umano, AI, o
          suggerito dall&apos;AI e accettato.
        </p>

        <div className="flex flex-wrap items-center gap-6">
          {signature.map(({ name, Icon, label }) => (
            <span key={name} className="flex items-center gap-1 text-plague-ink">
              <Icon size={20} /> {label}
            </span>
          ))}
        </div>

        <div className="flex items-end gap-8">
          <TechLabel className="text-muted">48px</TechLabel>
          {signature.map(({ name, Icon }) => (
            <span key={name} className="flex flex-col items-center gap-2 text-plague-ink">
              <Icon size={48} />
              <TechLabel className="text-muted">{name.replace('Icon', '')}</TechLabel>
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
