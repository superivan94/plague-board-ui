import {
  PlagueBackground,
  PlaguePulse,
  PoisonIcon,
  PulseDot,
  RatSwarm,
  TOXIC_LEVELS,
  TOXIC_LEVEL_LABELS,
  TOXIC_LEVEL_SETTINGS,
  TechLabel,
  TechRule,
  ToxicLevelProvider,
  ToxicLevelSwitch,
} from 'plague-board-ui';

/**
 * ⚠️ La pagina resta un componente **server**: il provider, il fondale e il selettore sono client,
 * ma quello che ci finisce dentro arriva come figli già resi. È la stessa forma con cui la barra
 * vive in `layout.tsx`, ed è ciò che tiene `/atmosfera` fra le pagine statiche.
 */
export default function AtmosferaPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">L’atmosfera</h1>
        <p className="text-sm text-muted">
          Il fondale della peste: un velo verde, le icone che galleggiano, le gocce che colano e le
          bolle di gas che salgono. Serve dove una schermata deve dire «rete della peste» prima di
          dire qualunque altra cosa — l’accesso, una pagina d’ingresso, un pannello che si presenta.
        </p>
        <p className="text-sm text-muted">
          <strong>Avvolge il contenuto</strong> invece di stargli sotto: gli strati e la pagina sono
          due figli dello stesso riquadro, quindi non c’è nessun <code>z-index</code> da ricordarsi.
          E sta <strong>dentro il riquadro che lo ospita</strong>, non sulla finestra: una pagina
          intera si ottiene con <code>min-h-dvh</code>, una scheda mettendocelo dentro.
        </p>
      </div>

      <ToxicLevelProvider defaultLevel="medium">
        <div className="flex flex-col gap-3">
          <PlagueBackground className="min-h-[26rem] rounded-xl p-8" contentClassName="flex h-full flex-col">
            <div className="mx-auto max-w-sm rounded-xl border border-brand/30 bg-gray-900/50 p-6 shadow-2xl backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <PulseDot size={10} />
                <TechLabel className="text-brand-ink">rete della peste</TechLabel>
              </div>

              <h2 className="font-mono text-2xl tracking-wide text-white">Rattoteca</h2>
              <p className="mt-2 text-sm text-muted">
                Entra nella tana per gestire i manuali della diffusione
              </p>

              <PlaguePulse className="mt-6">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-white"
                >
                  <PoisonIcon size={18} />
                  Avvia il protocollo
                </button>
              </PlaguePulse>
            </div>

            {/* I ratti passano sul fondale come su qualunque altra fascia `relative` che tagli il
                traboccamento: lo sciame non è dentro il fondale, ci sta sopra. */}
            <RatSwarm everyMs={[3000, 7000]} band={[70, 88]} size={40} />
          </PlagueBackground>

          <div className="flex flex-wrap items-center gap-3">
            <ToxicLevelSwitch label="Livello delle emissioni" />
            <p className="text-sm text-muted">
              Il comando sta <strong>fuori</strong> dal fondale, e lo comanda lo stesso: fra i due
              c’è <code>ToxicLevelProvider</code>, quindi possono stare a due estremità della pagina.
            </p>
          </div>
        </div>
      </ToxicLevelProvider>

      <TechRule>quanto c’è, a ogni livello</TechRule>

      <div className="overflow-x-auto">
        <table className="w-full min-w-md border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4 font-medium">livello</th>
              <th className="py-2 pr-4 font-medium">velo</th>
              <th className="py-2 pr-4 font-medium">icone</th>
              <th className="py-2 pr-4 font-medium">gocce</th>
              <th className="py-2 pr-4 font-medium">bolle</th>
              <th className="py-2 font-medium">diametro</th>
            </tr>
          </thead>
          <tbody>
            {TOXIC_LEVELS.map((livello) => {
              const t = TOXIC_LEVEL_SETTINGS[livello];
              const spento = t.maxBubbles === 0;

              return (
                <tr key={livello} className="border-b border-border/50">
                  <td className="py-2 pr-4">
                    <TechLabel className="text-brand-ink">{TOXIC_LEVEL_LABELS[livello]}</TechLabel>
                  </td>
                  <td className="py-2 pr-4 text-muted">{t.hazeClass.replace('opacity-', '')}%</td>
                  <td className="py-2 pr-4 text-muted">{t.floaters}</td>
                  <td className="py-2 pr-4 text-muted">{t.drips}</td>
                  <td className="py-2 pr-4 text-muted">
                    {spento ? '—' : `max ${t.maxBubbles}, una ogni ${t.bubbleEveryMs[0] / 1000}–${t.bubbleEveryMs[1] / 1000}s`}
                  </td>
                  <td className="py-2 text-muted">
                    {spento ? '—' : `${t.bubbleSize[0]}–${t.bubbleSize[1]}px`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted">
        <strong>«Spento» spegne davvero</strong>: niente velo, niente icone, niente gocce, niente
        bolle. È il livello che una persona sceglie quando il movimento la disturba, e un fondale
        che a quel punto lascia ancora qualcosa in scena non sta obbedendo.
      </p>

      <p className="text-sm text-muted">
        ⚠️ <strong>I ratti che attraversano il fondale non sono suoi</strong>: <code>RatSwarm</code>{' '}
        è un componente a parte, con la sua cadenza e il suo tetto, e qui continua a passare anche a
        livello spento. Una schermata che vuole un comando solo per tutto legge il livello con{' '}
        <code>useToxicLevel</code> e monta lo sciame solo sopra una certa soglia — e così facendo
        decide lei quale soglia.
      </p>

      <p className="text-sm text-muted">
        ⚠️ <strong>Con «meno movimento» le bolle non nascono affatto</strong>, a qualunque livello —
        come per lo sciame di ratti. Una bolla è soltanto un movimento: ferma non resta niente da
        guardare, e tenere acceso un timer per non dipingere nulla sarebbe solo costo. Il velo, che
        non si muove, resta.
      </p>

      <TechRule>la lastra che respira</TechRule>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">
          <code>PlaguePulse</code> avvolge un comando e gli mette dietro una lastra che pulsa: fondo,
          bordo e alone cambiano insieme, due secondi per ciclo. Serve per <strong>uno</strong>{' '}
          comando per schermata — quello che la schermata esiste per far premere.
        </p>
        <p className="text-sm text-muted">
          ⚠️ Il figlio dev’essere <strong>trasparente</strong>: è la lastra a essere dipinta, e un
          bottone col suo fondo la copre. Quello qui sopra è un <code>&lt;button&gt;</code> senza
          sfondo, col solo testo bianco.
        </p>
      </div>
    </main>
  );
}
