import { Button } from '@heroui/react';
import { BiohazardIcon, PoisonIcon, SkullIcon, VirusIcon } from 'plague-board-ui';

// ⚠️ Questa pagina è provvisoria e lo resta fino al punto 3, dove diventa l'indice delle storie.
// Finché le storie non ci sono, i componenti si guardano qui: senza un posto dove renderli, il
// collaudo per confronto con RattInventario non si può fare affatto.
const icons = [
  { name: 'PoisonIcon', Icon: PoisonIcon },
  { name: 'SkullIcon', Icon: SkullIcon },
  { name: 'BiohazardIcon', Icon: BiohazardIcon },
  { name: 'VirusIcon', Icon: VirusIcon },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-8 px-4 py-16">
      <h1 className="text-2xl font-semibold">plague-board-ui</h1>

      <div className="flex flex-wrap items-center gap-3">
        <Button>Un bottone di HeroUI</Button>
        <span className="rounded-md bg-plague-600 px-3 py-1 text-sm text-white">
          verde della peste
        </span>
        <span className="rounded-md bg-brand px-3 py-1 text-sm text-white">ciano del marchio</span>
        <span className="text-toxic">verde tossico</span>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Le quattro icone della peste</h2>

        {/* Le tre taglie sono quelle vere di RattInventario: 56 nel fondale di ingresso, 24 accanto
            a un testo, 16 ai lati del livello tossico. */}
        {[56, 24, 16].map((size) => (
          <div key={size} className="flex items-center gap-6">
            <span className="w-10 text-sm text-default-500">{size}px</span>
            {icons.map(({ name, Icon }) => (
              <Icon key={name} size={size} color="#22c55e" />
            ))}
          </div>
        ))}

        {/* Senza `color` l'icona prende il colore del testo: è il caso che ne permette la
            sostituzione dentro un comando senza sapere in che tema si troverà. */}
        <div className="flex items-center gap-6 rounded-lg bg-white p-4 text-plague-700">
          <span className="w-10 text-sm">tema chiaro</span>
          {icons.map(({ name, Icon }) => (
            <Icon key={name} size={24} />
          ))}
        </div>
      </section>
    </main>
  );
}
