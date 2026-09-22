import { GoogleIcon, PlagueDivider, TechLabel, TechRule, VirusIcon } from 'plague-board-ui';

import { ScreenDemo } from './ScreenDemo';
import { SignInDemo } from './SignInDemo';

/** Le misure a cui si guarda un segno affiancato a un altro: piccolo, normale, grande. */
const TAGLIE = [16, 24, 40] as const;

/**
 * ⚠️ La pagina resta un componente **server**: i due pezzi che hanno bisogno di uno stato o di una
 * funzione stanno nei loro file, come in `/corsa` e in `/atmosfera`.
 */
export default function AccessoPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">L’accesso</h1>
        <p className="text-sm text-muted">
          Tutte e quattro le applicazioni dei Ludoratti entrano allo stesso modo: un account
          Google. Quella schermata è quindi una <strong>superficie condivisa</strong>, e sta qui
          scomposta in tre pezzi più la composizione che li monta — il marchio, il comando, la riga
          che divide, e <code>LoginScreen</code>.
        </p>
        <p className="text-sm text-muted">
          <strong>Quello che resta all’applicazione sono i testi e l’autenticazione.</strong> La
          libreria non sa che cosa sia Firebase: riceve <code>onPress</code> e basta. Dove si va
          dopo, che cosa fare di un errore e quali parole usare non sono suoi.
        </p>
      </div>

      <TechRule>il marchio che non si tinge</TechRule>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">
          <code>GoogleIcon</code> è l’unica icona della libreria che <strong>ignora il colore</strong>,
          e l’unica a cui non lo si può nemmeno passare: il suo tipo è <code>IconProps</code> meno{' '}
          <code>color</code>, quindi chi prova a uniformarla alle altre trova un errore in
          compilazione invece di un’icona che non cambia. Le linee guida di Google pretendono il
          marchio a quattro colori, così com’è.
        </p>

        <div className="flex flex-wrap items-end gap-8 rounded-xl border border-border p-6">
          {TAGLIE.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <div className="flex items-end gap-3">
                <GoogleIcon size={size} />
                <VirusIcon size={size} className="text-brand-ink" />
              </div>
              <TechLabel className="text-muted">{size}px</TechLabel>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted">
          ⚠️ <strong>Riempie il riquadro più delle nostre</strong>: il disegno di Google va da 1 a
          23 su una griglia di 24, mentre le icone di casa stanno fra 1,5 e 22,5. Alla stessa{' '}
          <code>size</code> sembra quindi un filo più grande — si vede qui sopra, accanto al
          virione. Non si corregge, perché ritoccare le proporzioni del marchio è proprio ciò che le
          linee guida vietano: chi lo affianca a un’icona di casa gli dà un paio di pixel in meno,
          come fa <code>GoogleSignInButton</code> coi suoi 20.
        </p>
      </div>

      <TechRule>il comando di accesso</TechRule>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">
          <code>GoogleSignInButton</code> è il <code>Button</code> di HeroUI in variante{' '}
          <code>outline</code>, col marchio a sinistra e la formula accanto. Occupa tutta la riga di
          serie — un comando di accesso sta da solo in una colonna stretta, e il bottone di HeroUI
          è <code>w-fit</code>.
        </p>
        <p className="text-sm text-muted">
          <strong>L’etichetta predefinita è «Accedi con Google», e non viene dal lessico di
          casa</strong>: è l’unica parola della libreria a non venirci. Le linee guida prescrivono
          la formula perché chi legge deve riconoscere il comando, non la nostra voce. Resta una
          prop: chi se ne prende la responsabilità passa la sua, come la striscia qui a destra.
        </p>

        <SignInDemo />

        <p className="text-sm text-muted">
          ⚠️ <strong>L’attesa è <code>isPending</code>, non <code>isDisabled</code></strong>, e la
          differenza si sente solo con la tastiera: un comando disabilitato esce dall’ordine di
          tabulazione, e chi ci aveva il fuoco se lo ritrova sul <code>body</code> proprio mentre la
          pagina sta rispondendo. <code>isPending</code> spegne pressione e puntatore, lascia il
          fuoco dov’è e annuncia il cambio. Provalo col Tab sulla striscia a destra: il comando si
          raggiunge anche se è in attesa.
        </p>
        <p className="text-sm text-muted">
          ⚠️ <strong>In attesa il comando sembra disabilitato</strong>, e non è un caso: lo stato{' '}
          <code>pending</code> di HeroUI vale <code>pointer-events: none</code> e nient’altro, ma la
          sua regola del disabilitato guarda <code>[aria-disabled=&quot;true&quot;]</code>, che
          react-aria scrive — misurati <code>opacity: 0.5</code> e <code>cursor: not-allowed</code>.
          Lo scambio del marchio col cerchio è quindi l’unica cosa che dice «sta lavorando» invece
          di «non si può». L’etichetta regge il velo: 19,74 di contrasto a riposo, 5,20 in attesa.
        </p>
        <p className="text-sm text-muted">
          Il cerchio è <code>aria-hidden</code>: l’annuncio dell’attesa lo fa già react-aria con
          l’etichetta vera del comando, e lo <code>Spinner</code> di HeroUI ne farebbe un secondo
          con dentro «Loading», una parola inglese che non si può tradurre.
        </p>
      </div>

      <TechRule>la riga che divide</TechRule>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">
          <code>PlagueDivider</code> separa due modi di entrare: un filo, il segno, la parola, il
          segno, un filo. Il segno è una prop e il suo valore predefinito è il virione;{' '}
          <code>icon={'{null}'}</code> lo toglie, e resta la sola parola.
        </p>

        <div className="flex flex-col gap-6 rounded-xl border border-border p-6">
          <div className="flex flex-col gap-2">
            <PlagueDivider>Alternative Access</PlagueDivider>
            <TechLabel className="text-muted">il segno predefinito · VirusIcon a 16</TechLabel>
          </div>

          <div className="flex flex-col gap-2">
            <PlagueDivider icon={null}>oppure</PlagueDivider>
            <TechLabel className="text-muted">icon={'{null}'} · la sola parola</TechLabel>
          </div>
        </div>

        <p className="text-sm text-muted">
          ⚠️ <strong>I fili sono due separatori veri</strong>, non due bordi disegnati: il{' '}
          <code>Separator</code> di HeroUI rende un <code>&lt;hr&gt;</code> e non accetta contenuto,
          quindi una riga con la parola in mezzo non si può fare con uno solo. Il prezzo è un
          annuncio in più per chi usa un lettore di schermo; il guadagno è che il ruolo ce l’hanno
          tutt’e due i tratti.
        </p>
        <p className="text-sm text-muted">
          ⚠️ <strong>Il filo è verde, non grigio.</strong> Il token <code>--separator</code> di
          HeroUI è tarato sulle superfici del suo tema e qui non regge: in tema scuro fa{' '}
          <strong>1,26</strong> sulla pagina e <strong>1,10</strong> dentro il pannello, cioè una
          riga che non c’è. Il verde del marchio al 50% — lo stesso del bordo di{' '}
          <code>PlaguePanel</code> — fa <strong>3,85</strong> e <strong>3,83</strong> in scuro e
          1,98 in chiaro: una sola famiglia di fili per tutta la superficie della peste.
        </p>
      </div>

      <TechRule>la schermata, montata</TechRule>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">
          <code>LoginScreen</code> monta fondale, ratti, pannello e comandi, e lascia
          all’applicazione titolo, sottotitolo e tutto quello che va nel pannello. È{' '}
          <strong>l’unico componente della libreria che ne compone altri</strong>, ed è il caso in
          cui ha senso: quella schermata le quattro applicazioni ce l’hanno già tutte, e oggi è
          identica male, perché ognuna se l’è disegnata da sé. Chi ne vuole una diversa prende i
          pezzi — <code>PlagueBackground</code>, <code>PlaguePanel</code>, <code>RatSwarm</code> —
          che restano pubblici e non sanno di lei.
        </p>

        <ScreenDemo />

        <p className="text-sm text-muted">
          ⚠️ <strong>Vuole un <code>ToxicLevelProvider</code> sopra</strong>, come il fondale che
          monta: una composizione non cambia il contratto di ciò che compone. Un provider suo
          sembrerebbe una comodità e sarebbe una trappola — un interruttore del livello messo
          dall’applicazione <em>fuori</em> dalla schermata finirebbe a governare un altro stato, e
          non succederebbe niente senza che niente sia rotto.
        </p>
        <p className="text-sm text-muted">
          ⚠️ <strong>Il titolo è l’<code>h1</code> della pagina.</strong> Una schermata di accesso{' '}
          <em>è</em> la pagina, e <code>Card.Title</code> di HeroUI varrebbe <code>h3</code> — un
          salto di livello che a schermo non si vede. Il livello è fisso: chi incastra la schermata
          dentro una pagina che un <code>h1</code> ce l’ha già si compone i pezzi.
        </p>
        <p className="text-sm text-muted">
          ⚠️ <strong>I ratti si spengono con <code>hasRats={'{false}'}</code></strong>, e con «meno
          movimento» non ne nasce nessuno: la traversata durerebbe un millesimo, cioè un guizzo
          invisibile pagato con un timer acceso.
        </p>
      </div>
    </main>
  );
}
