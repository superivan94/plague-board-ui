import { Card } from '@heroui/react';
import {
  BiohazardIcon,
  PLAGUE_AVATAR_SIZE,
  PlagueAvatar,
  PlaguePanel,
  PoisonIcon,
  PulseDot,
  RAT_MASCOT_SRC,
  SparklesIcon,
  TechLabel,
  TechRule,
  ThematicBadge,
  VirusIcon,
  type ThematicBadgeColor,
} from 'plague-board-ui';

import { ChipsSection } from './ChipsSection';

/**
 * I cinque colori del tema, coi nomi che ci si mette sopra in una demo.
 *
 * ⚠️ Sono **inventati per questa pagina**, e stanno nel registro di casa: in RattInventario la
 * scala vera è di tre — «Ratto di Fogna», «Diffusore di Peste», «Signore Bubbonico» — e vive nel
 * suo `userPlansConfig`, non qui.
 */
const GRADI: readonly { color: ThematicBadgeColor; nome: string }[] = [
  { color: 'default', nome: 'Topo di Fogna' },
  { color: 'accent', nome: 'Consigliere Bubbonico' },
  { color: 'success', nome: 'Portatore Sano' },
  { color: 'warning', nome: 'Diffusore di Peste' },
  { color: 'danger', nome: 'Signore Bubbonico' },
];

const TAGLIE = ['sm', 'md', 'lg'] as const;

/**
 * La pagina è un componente **server**: nessuno dei quattro pezzi prende una funzione —
 * `CountedChips`, dentro `ChipsSection`, è client, ma le pastiglie gli arrivano come figli già
 * resi — quindi il confine regge e la pagina resta statica.
 */
export default function ProfiloPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">La scheda</h1>
        <p className="text-sm text-muted">
          I tre pezzi con cui si mette insieme una scheda profilo vestita da Ludoratti:{' '}
          <code>PlagueAvatar</code>, <code>ThematicBadge</code> e <code>PlaguePanel</code>. Nessuno
          dei tre è scritto da zero — sotto ci sono <code>Avatar</code>, <code>Badge</code>,{' '}
          <code>Chip</code> e <code>Card</code> di HeroUI, che portano caricamento dell’immagine,
          ripiego, posizionamento e composizione. Quello che ci mettiamo noi è il vestito.
        </p>
      </div>

      <TechRule>la scheda, montata</TechRule>

      <PlaguePanel className="max-w-lg">
        <Card.Header className="flex-row items-center gap-4">
          <PlagueAvatar src={RAT_MASCOT_SRC} name="Ratto Zero" size="lg" isPulsing />
          <div className="flex min-w-0 flex-col gap-1">
            <Card.Title className="flex items-center gap-2 truncate">
              <PoisonIcon size={16} className="shrink-0 text-brand-ink" />
              Ratto Zero
            </Card.Title>
            <Card.Description className="truncate">ratto.zero@ludoratti.it</Card.Description>
            <div className="flex flex-wrap gap-2 pt-1">
              <ThematicBadge color="accent" icon={<VirusIcon size={12} />}>
                Consigliere Bubbonico
              </ThematicBadge>
              <ThematicBadge color="warning">Contagio alto</ThematicBadge>
            </div>
          </div>
        </Card.Header>
        <Card.Content className="flex flex-col gap-2 text-sm">
          <span className="flex items-center gap-2">
            <PulseDot size={8} />
            Rete della peste: attiva
          </span>
          <span className="flex items-center gap-2 text-muted">
            <PulseDot size={8} isStatic className="bg-muted" />
            Applicazioni infette: 3
          </span>
        </Card.Content>
      </PlaguePanel>

      <p className="text-sm text-muted">
        ⚠️ <strong>Il pannello segue il tema</strong>, al contrario della barra e del fondale, che
        sono isole scure dichiarate. Una cornice può permettersi di restare scura ovunque; un
        pannello contiene il testo dell’applicazione, e una lastra scura dentro una pagina chiara
        costringerebbe chi lo usa a ridichiarare il colore di ogni parola che ci mette dentro. Il
        fondo è <code>surface</code>, con sopra un velo verde che scende dallo spigolo alto.
      </p>

      <p className="text-sm text-muted">
        ⚠️ <strong>Il velo non scende verso <code>background</code></strong>, che sarebbe la prima
        cosa da provare: in tema chiaro <code>--surface</code> è <code>#ffffff</code> e{' '}
        <code>--background</code> è <code>#f5f5f5</code>, cioè <strong>il colore della pagina</strong>
        — quindi il fondo della scheda si dissolveva nella pagina, con 1,09 di contrasto. Un velo del
        colore del marchio tinge senza sparire, e vale nei due temi.
      </p>

      <TechRule>il ritratto</TechRule>

      <div className="flex flex-wrap items-end gap-8">
        {TAGLIE.map((taglia) => (
          <div key={taglia} className="flex flex-col items-center gap-2">
            <PlagueAvatar src={RAT_MASCOT_SRC} name="Ratto Zero" size={taglia} />
            <TechLabel>
              {taglia} · {PLAGUE_AVATAR_SIZE[taglia]}px
            </TechLabel>
          </div>
        ))}
        <div className="flex flex-col items-center gap-2">
          <PlagueAvatar size="lg" />
          <TechLabel>senza immagine</TechLabel>
        </div>
        <div className="flex flex-col items-center gap-2">
          <PlagueAvatar size="lg" fallback={<span className="text-sm font-semibold">RZ</span>} />
          <TechLabel>iniziali</TechLabel>
        </div>
        <div className="flex flex-col items-center gap-2">
          <PlagueAvatar size="lg" src={RAT_MASCOT_SRC} name="Ratto Zero" badge={null} />
          <TechLabel>senza segno</TechLabel>
        </div>
        <div className="flex flex-col items-center gap-2">
          <PlagueAvatar size="lg" src={RAT_MASCOT_SRC} name="Ratto Zero" badge={<SparklesIcon size={10} />} />
          <TechLabel>altro segno</TechLabel>
        </div>
      </div>

      <p className="text-sm text-muted">
        L’anello è un <code>ring</code> e non un bordo: un bordo entra nella misura dell’elemento e
        un ritratto da 48 px diventerebbe largo 54, spostando quello che gli sta accanto. Il colore è{' '}
        <code>brand-ink</code>, cioè il verde che <strong>cambia col tema</strong> — lime-700 in
        chiaro, lime pieno in scuro — perché lo stesso ritratto sta sia su una lastra scura sia su
        una scheda chiara.
      </p>

      <p className="text-sm text-muted">
        ⚠️ <strong>La forma tonda è nostra.</strong> <code>Avatar</code> di HeroUI è un{' '}
        <strong>quadrato stondato</strong> — <code>border-radius: calc(var(--radius) * 3)</code> —
        e a raddrizzarlo è una utility di Tailwind: le utility stanno in <code>@layer utilities</code>{' '}
        e i suoi componenti in <code>@layer components</code>, quindi la nostra vince senza dipendere
        dall’ordine degli import. Vale anche per chi installa: per una misura fuori dalle tre, una
        classe <code>size-*</code> basta.
      </p>

      <p className="text-sm text-muted">
        ⚠️ <strong>Il segno nell’angolo non pulsa</strong> se non glielo si chiede con{' '}
        <code>isPulsing</code>. È la regola della tazza e del pallino: l’interruttore
        dell’animazione sta su chi monta il pezzo, non dentro il disegno — in una scheda con dentro
        altre sei cose vive, una luce che pulsa sempre smette di dire qualcosa.
      </p>

      <TechRule>il grado</TechRule>

      <div className="flex flex-wrap items-center gap-3">
        {GRADI.map(({ color, nome }) => (
          <ThematicBadge key={color} color={color} icon={<BiohazardIcon size={12} />}>
            {nome}
          </ThematicBadge>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-md border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4 font-medium">colore</th>
              <th className="py-2 pr-4 font-medium">a che serve</th>
              <th className="py-2 font-medium">esempio</th>
            </tr>
          </thead>
          <tbody>
            {GRADI.map(({ color, nome }) => (
              <tr key={color} className="border-b border-border/60">
                <td className="py-2 pr-4">
                  <code>{color}</code>
                </td>
                <td className="py-2 pr-4 text-muted">
                  {color === 'default'
                    ? 'il grado di partenza, quello che hanno tutti'
                    : color === 'accent'
                      ? 'il grado che l’applicazione vuole far notare'
                      : color === 'success'
                        ? 'uno stato raggiunto, non un livello di pericolo'
                        : color === 'warning'
                          ? 'un grado che avvisa: un limite vicino, una scadenza'
                          : 'il grado in cima, o un limite superato'}
                </td>
                <td className="py-2">
                  <ThematicBadge color={color}>{nome}</ThematicBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted">
        ⚠️ <strong>I nomi dei gradi e il loro colore non stanno nella libreria.</strong> Quelli qui
        sopra sono una demo. Un’applicazione che ha dei piani tiene la sua tabella a casa propria —
        una riga di <code>Record&lt;Piano, ThematicBadgeColor&gt;</code> — perché un modello di
        abbonamento è suo, non dell’identità dei Ludoratti.
      </p>

      <p className="text-sm text-muted">
        Il contorno è <code>border-current</code>, cioè il colore del testo della pastiglia: HeroUI,
        per i suoi colori, cambia solo <code>--chip-fg</code> e lascia il fondo com’è.
      </p>

      <p className="text-sm text-muted">
        ⚠️ <strong>Ma a distinguere i cinque colori è il testo, non il contorno — e in tema chiaro
        si distinguono poco.</strong> Il contorno è il colore al 40% sul fondo della pastiglia, e
        misurato vale 2,90 per <code>accent</code> e 1,97 per <code>danger</code> in scuro, 1,88 in
        chiaro: è una rifinitura, non il segnale. Il segnale è il testo, e lì i due temi non si
        somigliano — in scuro <code>accent</code> è il lime pieno accanto a un bianco, in chiaro è
        un verde oliva accanto a un quasi-nero, che a colpo d’occhio è la stessa cosa. Il numero:
        fra <code>accent</code> e <code>default</code> ci sono 1,47 di luminanza in scuro (ma due
        tinte lontanissime) e 2,50 in chiaro (due tinte scure e vicine). Tutti e cinque restano
        sopra 5,7 di contrasto sul fondo: si leggono, è il <em>colore</em> che dice meno.
      </p>

      <ChipsSection />

      <TechRule>quando non usarli</TechRule>

      <p className="text-sm text-muted">
        <code>PlagueAvatar</code> è un <strong>ritratto</strong>, non un comando: se apre un menù,
        va dentro un <code>Button</code> di HeroUI, che porta fuoco e tastiera. <code>ThematicBadge</code>{' '}
        dice <strong>che grado ha una persona</strong>: per contare delle cose — tre tag, due autori —
        c’è <code>CountedChips</code>, che è un altro pezzo. E <code>PlaguePanel</code> è una{' '}
        <strong>superficie</strong>: se quello che ci va dentro è una finestra che si apre sopra la
        pagina, sotto ci vuole il <code>Modal</code> di HeroUI, che porta il fuoco intrappolato e la
        chiusura con Esc.
      </p>
    </main>
  );
}
