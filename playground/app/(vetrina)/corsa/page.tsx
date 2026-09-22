import { Rat, RatSwarm, TechLabel, TechRule } from 'plague-board-ui';

import { SwarmDemo } from './SwarmDemo';

const RULES = [
  [
    'Il ratto è un pupazzo, non un disegno',
    'Tronco, quattro zampe e una coda in cinque segmenti sono pezzi con un perno sull’articolazione, e ogni giunto è un disco: ruotando, il suo bordo resta dov’è. Zampe e coda stanno tutte dietro al tronco, che nasconde la metà interna di ogni giunto; la metà esterna riempie il cuneo che una zampa apre oscillando.',
  ],
  [
    'Il tempo sta nel foglio di stile',
    'Il componente possiede pelo, perni e ordine dei livelli. Che cosa ruota, di quanto e con che sfasamento sta in animations.css, acceso da una classe sola: da fermo niente si muove, e si spegne da lì.',
  ],
  [
    'Un galoppo a coppie diagonali, e il corpo che ondeggia',
    'Posteriore vicina con anteriore lontana, e viceversa: due coppie, stessa animazione, una dritta e una al contrario, mezzo passo in 0,2 secondi. Il corpo sale e beccheggia col passo; i cinque segmenti della coda oscillano di 3,5 gradi ciascuno con 30 millisecondi di ritardo l’uno sull’altro, che è l’onda; i pendagli vanno al doppio, perché sono pesi.',
  ],
  [
    'La fine la dice animationend',
    'onDone arriva quando la traversata è finita, non da un timer: se il browser sospende le animazioni in una scheda nascosta, il ratto non viene tolto prima di essere arrivato. Chi lo mette, lo toglie.',
  ],
  [
    'Il caso sta nello sciame, non nel ratto',
    'RatRun riceve prop esplicite — livrea, kit, lato, altezza, durata — e non sa niente di casualità: una pagina che vuole un ratto preciso lo ottiene. Quanti ne passano, ogni quanto e con che cosa addosso lo decide RatSwarm, che ha il ciclo una volta sola e i numeri come prop: un passaggio fitto e uno raro sono la stessa cosa con parametri diversi.',
  ],
  [
    'Non nasce niente che non possa arrivare in fondo',
    'Con la pagina in secondo piano il browser sospende le animazioni: un ratto nato lì non attraversa, quindi non esce, e resta fermo finché qualcuno non torna. Lo sciame salta il turno e riprende al ritorno. Stessa regola con prefers-reduced-motion, dove la traversata dura un millisecondo: non ne genera nessuno, perché un guizzo invisibile non vale un timer acceso. maxAlive resta una scelta di regia — «uno per volta», «al massimo quattro» — non una rete: senza, non c’è tetto.',
  ],
  [
    'Il millisecondo serve a chi un ratto ce l’ha già',
    'Sotto prefers-reduced-motion la traversata non si spegne, si accorcia a un millisecondo: chi ha montato un RatRun a mano lo tiene nel proprio stato e aspetta onDone per toglierlo, e con animation: none quell’evento non arriverebbe mai — il ratto resterebbe visibile e fermo sul bordo per sempre. Lo sciame invece il problema non ce l’ha: non lo fa proprio nascere. Chi vuole spiegare a chi guarda perché una decorazione manca legge la preferenza con useReducedMotion.',
  ],
];

export default function RunPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">La corsa</h1>
        <p className="text-sm text-muted">
          <code>RatRun</code> è un ratto che attraversa lo schermo da un lato all&apos;altro,
          correndo, e avvisa quando è uscito; <code>RatSwarm</code> è chi ne fa passare tanti, ogni
          tanto, tutti diversi. Vanno in un genitore a tutta larghezza con{' '}
          <code>overflow-hidden</code>: il posto lo sceglie chi li mette, il resto lo sanno loro.
        </p>
      </div>

      <TechRule>ne passa uno, poi un altro</TechRule>

      <section className="flex flex-col gap-3">
        <p className="max-w-2xl text-sm text-muted">
          Uno sciame con <code>maxAlive</code> a uno: finché il ratto in scena non è uscito non ne
          entra un altro. Livrea, kit, lato, altezza e passo si pescano a ogni passaggio.
        </p>
        <div className="relative h-40 overflow-hidden rounded-lg border border-border bg-surface">
          <RatSwarm everyMs={[800, 1600]} crossingMs={[3000, 4500]} band={[20, 55]} maxAlive={1} size={56} />
        </div>
      </section>

      <TechRule>e adesso tutti insieme</TechRule>

      <SwarmDemo />

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
