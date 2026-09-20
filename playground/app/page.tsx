import { Button } from '@heroui/react';
import { Fragment } from 'react';
import {
  BiohazardIcon,
  CodeIcon,
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

// ⚠️ Nessun colore scritto a mano in questa pagina: tutto passa dai token, perché è la pagina che
// deve reggere il commutatore del tema in cima. Un `text-gray-400` qui dentro sarebbe invisibile
// in chiaro, ed è esattamente il difetto che la pagina esiste per non far succedere.
const icons = [
  { name: 'PoisonIcon', Icon: PoisonIcon },
  { name: 'PotionMugIcon', Icon: PotionMugIcon },
  { name: 'SkullIcon', Icon: SkullIcon },
  { name: 'MoleculeIcon', Icon: MoleculeIcon },
  { name: 'BiohazardIcon', Icon: BiohazardIcon },
  { name: 'VirusIcon', Icon: VirusIcon },
];

const ICON_GRID = 'grid items-end gap-3';
const iconGridColumns = { gridTemplateColumns: `5rem repeat(${icons.length}, minmax(0, 1fr))` };

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
          accanto a un testo, <strong>16</strong> dentro una riga di stato. La riga dei 16 dice da
          sola perché i contagi sono due icone e non una — <code>MoleculeIcon</code> regge,{' '}
          <code>BiohazardIcon</code> si chiude in una macchia e non va sotto i 32.
        </p>

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

        <p className="text-sm text-muted">
          Nessuna icona ha un colore addosso: prendono quello del testo che le contiene, ed è
          quello che permette di sostituirle dentro un comando senza sapere in che tema finiranno.
        </p>
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
