import { Button } from '@heroui/react';
import { PoisonIcon, SkullIcon, VirusIcon } from 'plague-board-ui';

// ⚠️ Pagina di SCELTA, non di libreria. La direzione è decisa — `B · Laboratorio` — e qui restano
// le due domande che la decisione non chiude: **quale verde** e **quale nero**, perché le due
// fonti dell'identità non vanno d'accordo. Si cancella quando sono decise.

const KEYFRAMES = `
@keyframes pb-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
@keyframes pb-drip {
  0%   { transform: translateY(-16px) scaleY(1); opacity: 0; }
  6%   { opacity: 1; }
  85%  { transform: translateY(150px) scaleY(1.6); opacity: 1; }
  100% { transform: translateY(150px) scaleY(1.6); opacity: 0; }
}
`;

/** Le due anime, misurate: l'una sul sito del marchio, l'altra sull'app. */
interface Soul {
  id: string;
  name: string;
  source: string;
  accent: string;
  accentSoft: string;
  page: string;
  surface: string;
  contrast: string;
  note: string;
}

const souls: Soul[] = [
  {
    id: 'lime',
    name: 'Lime',
    source: 'ludoratti.it — la pagina del marchio',
    accent: '#a3e635',
    accentSoft: 'rgba(163, 230, 53, .3)',
    page: '#030712',
    surface: 'rgba(17, 24, 39, .5)',
    contrast: '13,35',
    note: 'Il verde acido dell’aggregatore, su un nero appena bluastro. È il verde che porta il logo, il nome e la voce.',
  },
  {
    id: 'plague',
    name: 'Peste',
    source: 'RattInventario — l’app',
    accent: '#4ade80',
    accentSoft: 'rgba(74, 222, 128, .3)',
    page: '#121212',
    surface: 'rgba(30, 30, 30, .6)',
    contrast: '10,75',
    note: 'Il verde dell’app, su un nero neutro puro. È il verde dei bordi che pulsano e delle icone della peste.',
  },
];

/** La stessa scheda, vestita `B · Laboratorio`, con l'anima che riceve. */
function LabCard({ soul }: { soul: Soul }) {
  const floaters = [
    { Icon: PoisonIcon, size: 34, top: '10%', left: '6%', delay: '0s' },
    { Icon: SkullIcon, size: 26, top: '64%', left: '84%', delay: '1.4s' },
    { Icon: VirusIcon, size: 22, top: '80%', left: '10%', delay: '2.6s' },
  ];

  return (
    <div className="relative overflow-hidden p-8" style={{ background: soul.page }}>
      {/* Le gocce che colano: vengono dall'aggregatore, e a RattInventario mancano del tutto. */}
      {['32%', '58%', '71%'].map((left, i) => (
        <span
          key={left}
          className="pointer-events-none absolute top-0 h-5 w-1.5 rounded-b-full"
          style={{
            left,
            background: soul.accent,
            opacity: 0.7,
            animation: `pb-drip ${7 + i}s ease-in ${i * 1.6}s infinite`,
          }}
        />
      ))}

      <div
        className="relative overflow-hidden p-6"
        style={{
          background: soul.surface,
          backdropFilter: 'blur(4px)',
          border: `1px solid ${soul.accentSoft}`,
          borderRadius: 12,
          boxShadow: '0 24px 48px -24px rgba(0,0,0,.9)',
        }}
      >
        {floaters.map(({ Icon, size, top, left, delay }) => (
          <span
            key={`${top}${left}`}
            className="pointer-events-none absolute"
            style={{ top, left, animation: `pb-float 7s ease-in-out ${delay} infinite` }}
          >
            <Icon size={size} color={`${soul.accent}30`} />
          </span>
        ))}

        <div className="relative">
          <div className="mb-4 flex items-center gap-2">
            <span
              className="size-2.5 animate-pulse rounded-full"
              style={{ background: soul.accent }}
            />
            <span
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{ color: soul.accent, fontFamily: 'var(--font-tech)' }}
            >
              rete della peste
            </span>
          </div>

          <h3
            className="text-2xl text-white"
            style={{ fontFamily: 'var(--font-tech)', letterSpacing: '0.04em' }}
          >
            Rattoteca
          </h3>
          {/* Il lessico: non «Accedi per gestire i tuoi manuali». */}
          <p className="mt-2 text-sm text-ash-400">
            Entra nella tana per gestire i manuali della diffusione
          </p>

          <Button
            fullWidth
            className="mt-6 h-11 border font-semibold text-black"
            style={{ background: soul.accent, borderColor: soul.accent, borderRadius: 10 }}
          >
            Entra nella tana
          </Button>

          <div className="mt-5 flex items-center gap-3 text-ash-400">
            <span className="h-px flex-1" style={{ background: soul.accentSoft }} />
            <VirusIcon size={14} color={soul.accent} />
            <span className="text-xs">oppure</span>
            <VirusIcon size={14} color={soul.accent} />
            <span className="h-px flex-1" style={{ background: soul.accentSoft }} />
          </div>

          <p
            className="mt-5 text-[11px]"
            style={{ color: soul.accent, opacity: 0.55, fontFamily: 'var(--font-tech)' }}
          >
            {'// ceppo operativo. in attesa di istruzioni.'}
</p>
        </div>
      </div>
    </div>
  );
}

/** Il dado: il terzo termine, quello che né la peste né i ratti dicono. */
function DiceSample({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill={color} aria-hidden="true">
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

export default function StyleDirections() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-10 px-4 py-12">
      <style>{KEYFRAMES}</style>

      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Direzione B, e le due anime del verde</h1>
        <p className="max-w-3xl text-sm text-default-500">
          Stessa vestizione — superficie sfumata, angoli morbidi, icone che galleggiano, sfocatura
          dietro la scheda, gocce che colano, caratteri <strong>Share Tech Mono</strong> e{' '}
          <strong>Poppins</strong> come su <code>ludoratti.it</code>. Cambia solo{' '}
          <strong>quale verde</strong> e <strong>quale nero</strong>, perché le due fonti
          dell&apos;identità non vanno d&apos;accordo.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {souls.map((soul) => (
          <section key={soul.id} className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">
              {soul.name}{' '}
              <span className="text-sm font-normal text-default-500">
                — {soul.accent} su {soul.page}, contrasto {soul.contrast}
              </span>
            </h2>
            <p className="min-h-16 text-sm text-default-500">
              <strong>{soul.source}.</strong> {soul.note}
            </p>
            <LabCard soul={soul} />
            <div className="flex items-center gap-3 rounded-lg border border-ash-700 p-3">
              <DiceSample color={soul.accent} />
              <span className="text-xs text-ash-400">
                il dado nello stesso verde — il segno dei giochi da tavolo
              </span>
            </div>
          </section>
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Il lessico, come dato</h2>
        <p className="max-w-3xl text-sm text-default-500">
          Le parole di casa non stanno dentro i componenti: sono un dizionario che la libreria
          esporta e che ogni app applica se vuole la voce. Questi sono i primi, seminati da quello
          che <code>ludoratti.it</code> già dice.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {lexicon.map(([before, after]) => (
            <div
              key={before}
              className="flex flex-col gap-1 rounded-lg border border-ash-700 bg-ash-900 p-3"
            >
              <span className="text-xs text-ash-400 line-through">{before}</span>
              <span className="text-sm text-plague-ink" style={{ fontFamily: 'var(--font-tech)' }}>
                {after}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
