import { RatIcon, type RatIconProps, TechLabel, TechRule } from 'plague-board-ui';

/** Le quattro tarature di `animateOn`, con quello che ognuna serve a dire. */
const BATTITI: readonly { animateOn: RatIconProps['animateOn']; a_che_serve: string }[] = [
  { animateOn: 'both', a_che_serve: 'il marchio: batte sempre, ed è il predefinito' },
  { animateOn: 'filled', a_che_serve: 'un preferito scelto, che si vede' },
  { animateOn: 'empty', a_che_serve: 'un preferito da scegliere, che chiama' },
  { animateOn: 'none', a_che_serve: 'dentro qualcosa che si legge: fermo' },
];

/** Una finta riga di preferiti, per far vedere i due stati al loro mestiere. */
const PREFERITI: readonly { titolo: string; isFilled: boolean }[] = [
  { titolo: 'Il Morbo di Anversa', isFilled: true },
  { titolo: 'Fogne & Fortune', isFilled: false },
  { titolo: 'La Quarantena dei Ratti', isFilled: true },
];

/**
 * La sezione della tavolozza dedicata al marchio.
 *
 * ⚠️ Sta in un file suo perché la pagina era già a quasi trecento righe — la stessa ragione per
 * cui `/profilo` ha `ChipsSection`. Resta un componente **server**: `RatIcon` non prende funzioni.
 */
export function MarkSection() {
  return (
    <>
      <TechRule>il marchio</TechRule>

      <section className="flex flex-col gap-6">
        <p className="text-sm text-muted">
          <code>RatIcon</code> si legge in tre modi, e sono tutti e tre voluti: a prima vista è un{' '}
          <strong>cuore</strong>, guardandolo meglio sono <strong>due figure che si abbracciano</strong>
          , ma le due orecchie dicono la verità — è il <strong>muso di un ratto</strong>. Sta dove
          parla la corporazione: una barra, un piede, una schermata di accesso.{' '}
          <strong>Non si usa come icona di dominio</strong>: un marchio che marca anche le cose
          smette di marcare sé stesso.
        </p>

        <div className="flex flex-wrap items-end gap-10 text-brand-ink">
          <span className="flex flex-col items-center gap-2">
            <RatIcon size={96} />
            <TechLabel className="text-muted">vuoto · il marchio</TechLabel>
          </span>
          <span className="flex flex-col items-center gap-2">
            <RatIcon size={96} isFilled />
            <TechLabel className="text-muted">pieno · isFilled</TechLabel>
          </span>
        </div>

        <p className="text-sm text-muted">
          ⚠️ <strong>I due stati stanno sullo stesso contorno.</strong> La campitura non è un
          secondo disegno: è la concatenazione delle due curve del cuore, chiusa. E il contorno{' '}
          <strong>resta anche da pieno</strong>, perché il tratto dipinge mezza unità oltre il
          percorso — togliendolo, il cuore pieno sarebbe più magro di quello vuoto e i due stati si
          vedrebbero cambiare taglia invece che riempirsi.
        </p>

        <p className="text-sm text-muted">
          La prima delle tre letture è anche quella che gli dà un secondo mestiere: vuoto e pieno
          sono la convenzione con cui si dice <strong>«non l’ho scelto» e «l’ho scelto»</strong>.
        </p>

        <div className="flex max-w-sm flex-col gap-1 rounded-xl border border-border p-4">
          {PREFERITI.map(({ titolo, isFilled }) => (
            <span key={titolo} className="flex items-center gap-3 py-1 text-sm">
              <RatIcon size={20} isFilled={isFilled} animateOn="filled" className="shrink-0 text-brand-ink" />
              {titolo}
            </span>
          ))}
        </div>

        <p className="text-sm text-muted">
          ⚠️ <strong>Batte da sé</strong>, ed è una deroga dichiarata: la regola della tazza e del
          pallino vuole l’interruttore dell’animazione su chi monta il pezzo, non dentro il disegno.
          Qui è il contrario, perché il battito del marchio è <strong>identità</strong> e chi lo
          monta non deve ricordarsi di accenderlo. A battere è il <strong>cuore</strong>, non tutto
          il segno: l’anello è il recinto e resta fermo.
        </p>

        <div className="flex flex-wrap items-end gap-8 text-brand-ink">
          {BATTITI.map(({ animateOn, a_che_serve }) => (
            <span key={animateOn} className="flex w-44 flex-col items-center gap-2 text-center">
              <span className="flex items-end gap-3">
                <RatIcon size={40} animateOn={animateOn} />
                <RatIcon size={40} isFilled animateOn={animateOn} />
              </span>
              <TechLabel className="text-muted">animateOn={`"${animateOn}"`}</TechLabel>
              <span className="text-xs text-muted">{a_che_serve}</span>
            </span>
          ))}
        </div>

        <p className="text-sm text-muted">
          Chi ha chiesto <strong>meno movimento</strong> lo ottiene comunque: il battito si ferma da
          sé, e fermo il marchio resta alla sua taglia vera — il primo fotogramma è{' '}
          <code>scale(1)</code>, non uno stato intermedio.
        </p>

        <div className="flex flex-wrap items-end gap-8 text-brand-ink">
          {[18, 24, 32, 56].map((size) => (
            <span key={size} className="flex flex-col items-center gap-2">
              <span className="flex items-end gap-2">
                <RatIcon size={size} animateOn="none" />
                <RatIcon size={size} isFilled animateOn="none" />
              </span>
              <TechLabel className="text-muted">{size}px</TechLabel>
            </span>
          ))}
        </div>

        <p className="text-sm text-muted">
          ⚠️ <strong>Diciotto è il suo pavimento</strong>, ed è il numero che la barra compatta
          usa: sotto, il tratto interno scende sotto il pixel e il cuore diventa un graffio dentro
          un cerchio. Da <strong>pieno</strong> regge più in basso, perché a portarlo non è più il
          tratto ma la campitura.
        </p>
      </section>
    </>
  );
}
