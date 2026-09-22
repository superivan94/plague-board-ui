import {
  RAT_ICON_MUZZLE_FLOOR,
  RatIcon,
  type RatIconBeat,
  type RatIconMuzzle,
  type RatIconProps,
  TechLabel,
  TechRule,
} from 'plague-board-ui';

/** Le quattro tarature di `animateOn`, con quello che ognuna serve a dire. */
const BATTITI: readonly { animateOn: RatIconProps['animateOn']; a_che_serve: string }[] = [
  { animateOn: 'both', a_che_serve: 'il marchio: batte sempre, ed è il predefinito' },
  { animateOn: 'filled', a_che_serve: 'un preferito scelto, che si vede' },
  { animateOn: 'empty', a_che_serve: 'un preferito da scegliere, che chiama' },
  { animateOn: 'none', a_che_serve: 'dentro qualcosa che si legge: fermo' },
];

/** Le due varianti di perimetro, con quello che ognuna serve a dire. */
const VARIANTI: readonly { beat: RatIconBeat; a_che_serve: string }[] = [
  { beat: 'whole', a_che_serve: 'il predefinito: anello e cuore insieme, come in barra' },
  { beat: 'inner', a_che_serve: 'l’anello fa da recinto fermo e il cuore batte dentro' },
];

/** I tre gradini del muso, col loro pavimento e con quello che ognuno serve a dire. */
const MUSI: readonly { muzzle: RatIconMuzzle; a_che_serve: string }[] = [
  { muzzle: 'none', a_che_serve: 'il predefinito: il cuore liscio' },
  { muzzle: 'eyes', a_che_serve: 'i due occhi: la terza lettura viene a galla' },
  { muzzle: 'full', a_che_serve: 'occhi e baffi: è un ratto che ti guarda' },
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
          , ma le due orecchie dicono la verità — è il <strong>muso di un ratto</strong>.
        </p>

        <p className="text-sm text-muted">
          Da lì escono i suoi <strong>due mestieri</strong>, non uno. È il <strong>marchio</strong>,
          e sta dove parla la corporazione: una barra, un piede, una schermata di accesso. Ed è il{' '}
          <strong>cuore</strong>, cioè il comando dei preferiti — la prima lettura vale quanto la
          terza, e un cuore che si riempie è la convenzione con cui il software dice «l’ho scelto».
          Quello che non fa è <strong>prestarsi come glifo di un’altra cosa</strong>: per dire
          «peste» c’è il biohazard, per dire «gioco» il dado. Un segno che dice tutto smette di dire
          qualcosa.
        </p>

        <div className="flex flex-wrap items-end gap-10 text-brand-ink">
          <span className="flex flex-col items-center gap-2">
            <RatIcon size={96} animateOn="none" />
            <TechLabel className="text-muted">vuoto · il marchio</TechLabel>
          </span>
          <span className="flex flex-col items-center gap-2">
            <RatIcon size={96} isFilled animateOn="none" />
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
          La terza lettura si può portare a galla: <code>muzzle</code> aggiunge al cuore pieno{' '}
          <strong>gli occhi</strong> e, un gradino sopra, <strong>i baffi</strong>. Serve dove il
          marchio deve avere un carattere — una schermata di accesso, una copertina, un vuoto da
          riempire — e si lascia spento dove deve solo marcare.
        </p>

        <div className="flex flex-wrap items-end gap-10 text-brand-ink">
          {MUSI.map(({ muzzle, a_che_serve }) => (
            <span key={muzzle} className="flex w-48 flex-col items-center gap-2 text-center">
              <RatIcon size={96} isFilled muzzle={muzzle} animateOn="none" />
              <TechLabel className="text-muted">muzzle={`"${muzzle}"`}</TechLabel>
              <span className="text-xs text-muted">{a_che_serve}</span>
              <TechLabel className="text-muted">
                da {RAT_ICON_MUZZLE_FLOOR[muzzle]}px
              </TechLabel>
            </span>
          ))}
        </div>

        <p className="text-sm text-muted">
          ⚠️ <strong>Ogni gradino ha la sua misura minima</strong>, ed è la cosa da guardare prima
          di accenderlo: <code>RAT_ICON_MUZZLE_FLOOR</code> dice {RAT_ICON_MUZZLE_FLOOR.none},{' '}
          {RAT_ICON_MUZZLE_FLOOR.eyes} e {RAT_ICON_MUZZLE_FLOOR.full} pixel. Sotto i{' '}
          {RAT_ICON_MUZZLE_FLOOR.eyes} i due occhi si fondono in una fascia sola e il cuore sembra
          scheggiato; sotto i {RAT_ICON_MUZZLE_FLOOR.full} i baffi sono tratteggi. La scelta resta a
          chi monta perché una classe <code>size-*</code> sostituisce l’attributo{' '}
          <code>width</code>: il componente non sa a che misura verrà dipinto.
        </p>

        <div className="flex flex-wrap items-end gap-8 text-brand-ink">
          {[24, 32, 48, 96].map((size) => (
            <span key={size} className="flex flex-col items-center gap-2">
              <RatIcon size={size} isFilled muzzle="full" animateOn="none" />
              <TechLabel className="text-muted">{size}px</TechLabel>
            </span>
          ))}
        </div>

        <p className="text-sm text-muted">
          ⚠️ <strong>Il muso descrive lo stato pieno, non il marchio.</strong> Sul cuore vuoto non
          compare niente — e non è una prop ignorata: è la stessa forma di{' '}
          <code>animateOn=&quot;filled&quot;</code>, che dice in quale dei due stati si batte. In
          una lista di preferiti vuol dire che il muso arriva quando si sceglie.
        </p>

        <div className="flex max-w-sm flex-col gap-1 rounded-xl border border-border p-4">
          {PREFERITI.map(({ titolo, isFilled }) => (
            <span key={`muso-${titolo}`} className="flex items-center gap-3 py-1 text-sm">
              <RatIcon
                size={24}
                isFilled={isFilled}
                muzzle="eyes"
                animateOn="none"
                className="shrink-0 text-brand-ink"
              />
              {titolo}
            </span>
          ))}
        </div>

        <p className="text-sm text-muted">
          ⚠️ <strong>Batte da sé</strong>, ed è una deroga dichiarata: la regola della tazza e del
          pallino vuole l’interruttore dell’animazione su chi monta il pezzo, non dentro il disegno.
          Qui è il contrario, perché il battito del marchio è <strong>identità</strong> e chi lo
          monta non deve ricordarsi di accenderlo.
        </p>

        <div className="flex flex-wrap items-end gap-12 text-brand-ink">
          {VARIANTI.map(({ beat, a_che_serve }) => (
            <span key={beat} className="flex w-56 flex-col items-center gap-2 text-center">
              <RatIcon size={72} beat={beat} />
              <TechLabel className="text-muted">beat={`"${beat}"`}</TechLabel>
              <span className="text-xs text-muted">{a_che_serve}</span>
            </span>
          ))}
        </div>

        <p className="text-sm text-muted">
          Le due varianti sono lo <strong>stesso battito con due perimetri</strong>, non due
          animazioni: <code>whole</code> lo mette sull’<code>{'<svg>'}</code> e{' '}
          <code>inner</code> sul gruppo che contiene cuore e orecchie, lasciando fermo l’anello.
          Alle misure grandi la seconda si legge meglio — un riferimento immobile accanto a una cosa
          che si muove — mentre a 18 o 24px la differenza quasi non c’è.
        </p>

        <p className="text-sm text-muted">
          ⚠️ <strong>Le classi in gioco sono due e non una</strong>, e il motivo è il perno: la
          variante interna ha bisogno di <code>transform-box: view-box</code> perché il suo{' '}
          <code>transform-origin</code> è scritto in <strong>unità del viewBox</strong> — 12 · 13,
          che è il cuore del cuore. Sull’<code>{'<svg>'}</code> esterno quegli stessi numeri
          tornerebbero pixel dello schermo, e a 96px il marchio pulserebbe attorno a un punto vicino
          allo spigolo invece che al centro.
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
