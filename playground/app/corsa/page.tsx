import { Rat, TechLabel, TechRule } from 'plague-board-ui';

import { RunDemo } from './RunDemo';

const RULES = [
  [
    'Il ratto è un pupazzo, non un disegno',
    'Tronco, quattro zampe e una coda in tre segmenti sono pezzi con un perno sull’articolazione, e ogni giunto è un disco: ruotando, il suo bordo resta dov’è. Le zampe lontane e la coda stanno dietro al tronco, le vicine davanti, e dove una zampa copre la pancia il tronco ha pelo sotto: muovendola non si apre un buco.',
  ],
  [
    'Il tempo sta nel foglio di stile',
    'Il componente possiede pelo, perni e ordine dei livelli. Che cosa ruota, di quanto e con che sfasamento sta in animations.css, acceso da una classe sola: da fermo niente si muove, e si spegne da lì.',
  ],
  [
    'Un galoppo a coppie diagonali, e il corpo che ondeggia',
    'Posteriore vicina con anteriore lontana, e viceversa: due coppie, stessa animazione, una dritta e una al contrario, mezzo passo in 0,3 secondi. Il corpo sale e beccheggia col passo; i tre segmenti della coda oscillano con ampiezza crescente e un decimo di secondo di ritardo l’uno sull’altro, che è l’onda; i pendagli vanno al doppio, perché sono pesi.',
  ],
  [
    'La fine la dice animationend',
    'onDone arriva quando la traversata è finita, non da un timer: se il browser sospende le animazioni in una scheda nascosta, il ratto non viene tolto prima di essere arrivato. Chi lo mette, lo toglie.',
  ],
  [
    'Chi ha chiesto meno movimento lo ottiene',
    'Con prefers-reduced-motion le zampe si fermano e la traversata dura un millisecondo: il ratto attraversa senza farsi vedere, onDone arriva subito, e nessuno resta con un ratto fermo a metà schermo. Per questo chi rimette un ratto nell’onDone del precedente lascia una pausa, o la catena gira a vuoto.',
  ],
];

export default function RunPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">La corsa</h1>
        <p className="text-sm text-muted">
          <code>RatRun</code> è un ratto che attraversa lo schermo da un lato all&apos;altro,
          correndo, e avvisa quando è uscito. Va in un genitore a tutta larghezza con{' '}
          <code>overflow-hidden</code>; livrea, kit, lato, altezza e durata li sceglie chi lo mette.
          Qui sotto ne passa uno alla volta, ogni volta diverso.
        </p>
      </div>

      <TechRule>ne passa uno, poi un altro</TechRule>

      <RunDemo />

      <TechRule>la corsa da fermo</TechRule>

      <section className="flex flex-col gap-3">
        <p className="max-w-2xl text-sm text-muted">
          Lo stesso ratto con <code>isRunning</code> e senza spostarsi: si vedono le zampe a coppie,
          l&apos;onda della coda, il corpo che beccheggia, e il dado e la pedina che pendono in ritardo
          sul passo.
        </p>
        <div className="flex flex-wrap items-end gap-10 rounded-lg border border-border bg-surface p-6">
          <span className="flex flex-col items-center gap-2">
            <Rat livery="grey" size={96} isRunning hasCollar hasVial />
            <TechLabel className="text-muted">isRunning</TechLabel>
          </span>
          <span className="flex flex-col items-center gap-2">
            <Rat livery="brown" size={96} hasSkull hasCollar />
            <TechLabel className="text-muted">fermo</TechLabel>
          </span>
        </div>
      </section>

      <TechRule>le regole</TechRule>

      <dl className="flex max-w-2xl flex-col gap-4">
        {RULES.map(([title, body]) => (
          <div key={title} className="flex flex-col gap-1">
            <dt className="text-sm font-semibold">{title}</dt>
            <dd className="text-sm text-muted">{body}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
