import { Button } from '@heroui/react';
import {
  BiohazardIcon,
  CodeIcon,
  MoleculeIcon,
  PoisonIcon,
  RobotIcon,
  SkullIcon,
  SparklesIcon,
  VirusIcon,
} from 'plague-board-ui';

// ⚠️ Questa pagina è provvisoria e lo resta fino al punto 3, dove diventa l'indice delle storie.
// Finché le storie non ci sono, i componenti si guardano qui: senza un posto dove renderli, il
// collaudo per confronto con RattInventario non si può fare affatto.
const icons = [
  { name: 'PoisonIcon', Icon: PoisonIcon },
  { name: 'SkullIcon', Icon: SkullIcon },
  { name: 'MoleculeIcon', Icon: MoleculeIcon },
  { name: 'BiohazardIcon', Icon: BiohazardIcon },
  { name: 'VirusIcon', Icon: VirusIcon },
];

const staticSwatches = [
  ['brand', 'bg-brand'],
  ['brand-light', 'bg-brand-light'],
  ['brand-dark', 'bg-brand-dark'],
  ['plague-400', 'bg-plague-400'],
  ['plague-500', 'bg-plague-500'],
  ['plague-600', 'bg-plague-600'],
  ['plague-700', 'bg-plague-700'],
  ['toxic', 'bg-toxic'],
  ['gray-200', 'bg-gray-200'],
  ['gray-400', 'bg-gray-400'],
  ['gray-600', 'bg-gray-600'],
  ['gray-700', 'bg-gray-700'],
  ['gray-800', 'bg-gray-800'],
  ['gray-900', 'bg-gray-900'],
];

/** I due token che il tema cambia, resi nello stesso modo dentro le due isole. */
function InkSample({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-background p-4 text-foreground">
      <span className="text-xs opacity-60">{label}</span>
      <span data-ink="plague" className="text-plague-ink">
        Il verde con cui si scrive
      </span>
      <span data-ink="brand" className="text-brand-ink">
        Il verde del marchio
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-8 px-4 py-16">
      <h1 className="text-2xl font-semibold">plague-board-ui</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">La tavolozza, statica</h2>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {staticSwatches.map(([name, className]) => (
            <div key={name} className="flex items-center gap-2">
              <span className={`size-8 rounded border border-gray-600 ${className}`} />
              <span className="text-xs text-default-500">{name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button>Un bottone di HeroUI</Button>
          <span className="text-toxic/40">toxic al 40%</span>
          <span className="text-toxic">toxic pieno</span>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">I due colori che il tema cambia</h2>

        {/* Le due isole nella stessa pagina: è il motivo per cui i selettori del tema sono classi
            qualunque e non `:root.dark`. Il playground del punto 3 farà così per ogni componente. */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="light">
            <InkSample label="tema chiaro" />
          </div>
          <div className="dark">
            <InkSample label="tema scuro" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Le cinque icone della peste</h2>

        {/* Le tre taglie sono quelle vere di RattInventario: 56 nel fondale di ingresso, 24 accanto
            a un testo, 16 ai lati del livello tossico.
            ⚠️ La riga dei 16 dice da sola perché `MoleculeIcon` e `BiohazardIcon` sono due icone e
            non una: la molecola regge, il trifoglio si chiude in una macchia. */}
        {[56, 24, 16].map((size) => (
          <div key={size} className="flex items-center gap-6">
            <span className="w-20 text-sm text-default-500">{size}px</span>
            {icons.map(({ name, Icon }) => (
              <Icon key={name} size={size} color="#22c55e" />
            ))}
          </div>
        ))}

        {/* Senza `color` l'icona prende il colore del testo: è il caso che ne permette la
            sostituzione dentro un comando senza sapere in che tema si troverà.
            ⚠️ La classe `light` qui non è decorazione: senza, `text-plague-ink` continua a valere
            il verde del tema scuro — la pagina ha `dark` sull'`<html>` — e su questo fondo bianco
            farebbe 1,74 di contrasto. È il difetto che il token esiste per impedire, ed è bastato
            dimenticarsi una classe per rifarlo. */}
        <div className="light flex items-center gap-6 rounded-lg bg-white p-4 text-plague-ink">
          <span className="w-20 text-sm">su fondo chiaro</span>
          {icons.map(({ name, Icon }) => (
            <Icon key={name} size={24} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">I segni della firma</h2>

        {/* Le stesse misure della firma di RattInventario, dove le icone stanno a 20px accanto al
            nome dell'autore. `CodeIcon` e `RobotIcon` vanno confrontate col piede del sito vero:
            di là sono glifi di Material Symbols, qui sono ridisegnate. */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 text-plague-ink">
            <CodeIcon size={20} /> Superivan94
          </span>
          <span className="flex items-center gap-1 text-brand-ink">
            <RobotIcon size={20} /> AI-Dev
          </span>
          <span className="flex items-center gap-1 text-plague-400">
            <SparklesIcon size={20} /> suggerito
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="w-20 text-sm text-default-500">48px</span>
          <CodeIcon size={48} />
          <RobotIcon size={48} />
          <SparklesIcon size={48} />
        </div>
      </section>
    </main>
  );
}
