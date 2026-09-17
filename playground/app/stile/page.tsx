import { Button } from '@heroui/react';
import { PoisonIcon, RatIcon, SkullIcon, TechLabel, VirusIcon } from 'plague-board-ui';

// ⚠️ Questa pagina è un RIFERIMENTO, non un'implementazione: è la direzione `B · Laboratorio`
// decisa il 2026-09-16, disegnata a mano per avere davanti il bersaglio mentre si costruiscono i
// componenti veri. Quando `PlaguePanel`, `RatSwarm` e gli altri esistono, questa pagina si
// riscrive con loro — e allora quello che si vede qui deve restare identico.
//
// Le due domande che l'hanno preceduta sono chiuse: il verde è il **lime del marchio** e il nero è
// il `gray-950` di `ludoratti.it`.

const KEYFRAMES = `
@keyframes pb-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
@keyframes pb-drip {
  0%   { transform: translateY(-16px) scaleY(1); opacity: 0; }
  6%   { opacity: 1; }
  85%  { transform: translateY(170px) scaleY(1.6); opacity: 1; }
  100% { transform: translateY(170px) scaleY(1.6); opacity: 0; }
}
`;

const floaters = [
  { Icon: PoisonIcon, size: 34, top: '10%', left: '6%', delay: '0s' },
  { Icon: SkullIcon, size: 26, top: '62%', left: '85%', delay: '1.4s' },
  { Icon: VirusIcon, size: 22, top: '80%', left: '9%', delay: '2.6s' },
];

/** Il dado: il terzo termine del marchio, quello che né la peste né i ratti dicono. */
function DiceIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-8 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4-4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
      />
    </svg>
  );
}

const lexicon = [
  ['Accedi', 'Entra nella tana'],
  ['I tuoi manuali', 'I manuali della diffusione'],
  ['Catalogo pubblico', 'I vettori ludici classificati'],
  ['In lavorazione', 'Ceppo sperimentale · in incubazione'],
  ['Impostazioni', 'Parametri del Grande Piano'],
  ['Esci', 'Torna nelle fogne'],
];

export default function StyleReference() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <style>{KEYFRAMES}</style>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">La direzione</h1>
        <p className="text-sm text-muted">
          <strong>Laboratorio</strong>: lime del marchio su <code>gray-950</code>, superficie
          semitrasparente e sfocata, angoli morbidi, icone che galleggiano, gocce che colano.{' '}
          <code>Share Tech Mono</code> sui titoli e sulle etichette, <code>Poppins</code> nel testo.
        </p>
        <p className="text-sm text-muted">
          ⚠️ Il riquadro qui sotto è il <strong>bersaglio</strong>, disegnato a mano: i componenti
          veri devono arrivarci, non partire da qui. E resta scuro nei due temi — la direzione è
          questa.
        </p>
      </div>

      <div className="dark relative overflow-hidden rounded-xl bg-gray-950 p-8">
        {['30%', '57%', '72%'].map((left, i) => (
          <span
            key={left}
            className="pointer-events-none absolute top-0 h-5 w-1.5 rounded-b-full bg-brand/70"
            style={{ left, animation: `pb-drip ${7 + i}s ease-in ${i * 1.6}s infinite` }}
          />
        ))}

        <div className="relative mx-auto max-w-sm overflow-hidden rounded-xl border border-brand/30 bg-gray-900/50 p-6 shadow-2xl backdrop-blur-sm">
          {floaters.map(({ Icon, size, top, left, delay }) => (
            <span
              key={`${top}${left}`}
              className="pointer-events-none absolute"
              style={{ top, left, animation: `pb-float 7s ease-in-out ${delay} infinite` }}
            >
              <Icon size={size} color="#a3e63530" />
            </span>
          ))}

          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <span className="size-2.5 animate-pulse rounded-full bg-brand" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-ink">
                rete della peste
              </span>
            </div>

            <h2 className="font-mono text-2xl tracking-wide text-white">Rattoteca</h2>
            {/* Il lessico, non «Accedi per gestire i tuoi manuali». */}
            <p className="mt-2 text-sm text-gray-400">
              Entra nella tana per gestire i manuali della diffusione
            </p>

            {/* ⚠️ Il pulsante NON è vestito a mano: `variant="primary"` legge `--accent` e
                `--accent-foreground`, che `theme.css` ha appena ridichiarato. È il primo pezzo di
                HeroUI davvero vestito da Ludoratti. */}
            <Button variant="primary" fullWidth className="mt-6 h-11">
              Entra nella tana
            </Button>

            <div className="mt-5 flex items-center gap-3 text-gray-400">
              <span className="h-px flex-1 bg-brand/30" />
              <VirusIcon size={14} color="#a3e635" />
              <span className="text-xs">oppure</span>
              <VirusIcon size={14} color="#a3e635" />
              <span className="h-px flex-1 bg-brand/30" />
            </div>

            <p className="mt-5 font-mono text-[11px] text-brand-ink/60">
              {'// ceppo operativo. in attesa di istruzioni.'}
            </p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Il dado, e i due verdi che non litigano</h2>
        <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border p-4">
          <span className="flex items-center gap-2 text-brand">
            <DiceIcon size={36} />
            <span className="text-xs text-muted">
              il marchio — <code>brand</code>: il dado è il segno dei giochi da tavolo
            </span>
          </span>
          <span className="flex items-center gap-2 text-plague-400">
            <SkullIcon size={36} />
            <span className="text-xs text-muted">
              la malattia — <code>plague-400</code>: icone, fondali, stati
            </span>
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Il segno della barra</h2>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-border p-4">
          <span className="dark flex shrink-0 items-center gap-2 rounded bg-gray-950/90 px-3 py-2">
            <RatIcon size={20} className="animate-heartbeat shrink-0 text-brand" />
            <TechLabel className="text-muted">plague-board-ui</TechLabel>
          </span>
          <p className="max-w-lg text-sm text-muted">
            <strong className="text-foreground">Il marchio che batte.</strong> Quel segno si legge
            in tre modi: a prima vista un <strong>cuore</strong>, poi <strong>due figure che si
            abbracciano</strong>, e solo per via delle orecchie il <strong>muso di un ratto</strong>.
            Il battito dice «acceso» raccontando la prima delle tre letture, invece di aggiungerne
            una quarta. ⚠️ Mai sotto i <strong>20px</strong>: il tratto interno scende sotto il
            pixel e il cuore sembra un graffio.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Il lessico, come dato</h2>
        <p className="max-w-2xl text-sm text-muted">
          Le parole di casa non stanno dentro i componenti: sono un dizionario che la libreria
          esporta e che ogni app applica se vuole la voce.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {lexicon.map(([before, after]) => (
            <div
              key={before}
              className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-3"
            >
              <span className="text-xs text-muted line-through">{before}</span>
              <span className="font-mono text-sm text-brand-ink">{after}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
