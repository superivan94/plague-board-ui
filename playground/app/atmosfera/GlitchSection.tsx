import { GlitchText, TechLabel, TechRule } from 'plague-board-ui';

/**
 * La sezione di `/atmosfera` dedicata a `GlitchText`.
 *
 * ⚠️ Sta in un file suo perché la pagina aveva passato le trecento righe, non perché serva
 * altrove: è la stessa ragione per cui `/corsa` ha `SwarmDemo` e `/voce` ha `PhraseBrowser`.
 * Resta un componente **server** — il disturbo è tutto in CSS e non gli serve nessuno stato.
 */
export function GlitchSection() {
  return (
    <>
      <TechRule>il nome che si disturba</TechRule>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">
          <code>GlitchText</code> sdoppia una parola in due copie sfalsate di due pixel, una ciano e
          una rosa, e ne mostra una fetta orizzontale alla volta. Con <code>reveal</code>, ogni tre
          secondi la parola che il nome sta nascondendo prova a uscire: due sbirciate rotte da sei
          centesimi, due colpi interi da quarantacinque millesimi e poi la tenuta, 165 ms —{' '}
          <strong>un tubo al neon che prende la corrente</strong>. È il terzo pezzo del registro{' '}
          <strong>futuro distopico</strong> dell’aggregatore, dopo la città e le gocce che stanno
          già qui sopra dentro <code>PlagueBackground</code>.
        </p>

        <p className="text-sm text-muted">
          <strong>Il lampo si spegne con <code>isRevealEnabled={'{false}'}</code></strong> e resta
          il solo nome che si disturba — la striscia di mezzo qui sotto ha le stesse prop della
          prima, meno l’interruttore. È un secondo modo di dire una cosa che <code>reveal</code>{' '}
          dice già, e sono due domande diverse: <code>reveal</code> dice <strong>quale</strong>{' '}
          parola, l’interruttore dice <strong>se</strong> farla succedere. Chi ha la parola in una
          costante e il comando in un’impostazione non deve far diventare il contenuto una
          condizione. ⚠️ Spento vuol dire <strong>non reso</strong>: la parola non finisce affatto
          nella pagina, perché un elemento fermo a opacità zero lo troverebbero lo stesso la
          selezione e la ricerca nella pagina.
        </p>

        <p className="text-sm text-muted">
          ⚠️ <strong>La parola nascosta porta lo stesso disturbo del nome</strong>, e le sue due
          lamelle stanno <strong>dentro</strong> di lei: ritaglio e opacità del lampo valgono per
          tutto quello che contiene, quindi compaiono e spariscono con lei. Messe accanto,
          girerebbero sopra il nome anche nei tre secondi in cui il lampo non c’è.
        </p>

        {/* La striscia resta scura nei due temi, e porta `dark` addosso: è la stessa regola delle
            lastre della barra, e qui serve anche al fondo che le lamelle devono ricoprire. */}
        <div className="dark flex flex-col items-center gap-2 rounded-xl bg-gray-950 p-8">
          <h2 className="font-mono text-3xl font-bold tracking-wider text-gray-100">
            LUDORATTI{' '}
            <GlitchText className="text-brand" reveal="EVIL" background="#030712">
              E.
            </GlitchText>{' '}
            CORP
          </h2>
          <TechLabel className="text-brand-ink">con il fondo dichiarato · #030712</TechLabel>
        </div>

        {/* Stessa striscia, stesse prop, meno l'interruttore: quello che cambia è solo il lampo. */}
        <div className="dark flex flex-col items-center gap-2 rounded-xl bg-gray-950 p-8">
          <h2 className="font-mono text-3xl font-bold tracking-wider text-gray-100">
            LUDORATTI{' '}
            <GlitchText className="text-brand" reveal="EVIL" isRevealEnabled={false} background="#030712">
              E.
            </GlitchText>{' '}
            CORP
          </h2>
          <TechLabel className="text-brand-ink">
            lampo spento · isRevealEnabled={'{false}'}
          </TechLabel>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-border p-8">
          <h2 className="font-mono text-3xl font-bold tracking-wider">
            LUDORATTI <GlitchText className="text-brand-ink">E.</GlitchText> CORP
          </h2>
          <TechLabel className="text-muted">senza fondo · il valore predefinito</TechLabel>
        </div>

        <p className="text-sm text-muted">
          ⚠️{' '}
          <strong>Le lamelle coprono l’originale, quindi devono sapere che colore hanno dietro.</strong>{' '}
          Con <code>background</code> il disturbo è <strong>netto</strong>, perché ogni fetta
          sostituisce il testo invece di sovrapporsi; senza, le due copie si limitano a sdoppiare i
          bordi. Il valore predefinito è <code>transparent</code> ed è una scelta sul{' '}
          <strong>modo di sbagliare</strong>: un colore sbagliato dipinge un rettangolo in mezzo
          alla parola, trasparente al massimo attenua l’effetto. Sopra il fondale della peste si
          passa <code>#030712</code>.
        </p>

        <p className="text-sm text-muted">
          ⚠️ <strong>Il testo è una stringa, non un nodo</strong>, e il tipo lo impedisce in
          compilazione: le copie sono copie, e copiare un albero di elementi vorrebbe dire
          duplicarne comandi e collegamenti. Le copie sono <code>&lt;span&gt;</code> veri con{' '}
          <code>aria-hidden</code>, non pseudo-elementi: il contenuto generato da CSS alcuni lettori
          di schermo lo annunciano, e il titolo qui sopra si chiamerebbe «LUDORATTI E.E.E. CORP».
        </p>

        <p className="text-sm text-muted">
          ⚠️ <strong>Con «meno movimento» non resta niente</strong>: le lamelle nascono collassate e
          sono i fotogrammi ad aprirle, il lampo nasce a opacità zero. Ferme resterebbero due copie
          integre spostate di due pixel, che è l’aspetto di un difetto e non di una preferenza
          rispettata.
        </p>
      </div>
    </>
  );
}
