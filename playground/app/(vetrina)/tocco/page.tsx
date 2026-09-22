import Link from 'next/link';
import {
  CodeIcon,
  DEV_PHRASES,
  HoverEmitter,
  RobotIcon,
  TechLabel,
  TechRule,
  binaryRain,
  comicBubbles,
  type HoverEffect,
} from 'plague-board-ui';

/**
 * Il preset dell'AI con una riga cambiata: il colore è dell'applicazione, non dell'effetto, e si
 * aggiunge alla classe senza toccare il resto della taratura.
 */
const PIOGGIA: HoverEffect = { ...binaryRain(), className: 'pb-binary-digit text-plague-ink' };

/** Una taratura scritta a mano: gli stessi sette campi, nessun preset di mezzo. */
const SQUIT: HoverEffect = {
  everyMs: 350,
  lifeMs: [900, 1600],
  contents: ['squit', 'squit!', 'SQUIT', 'squit squit'],
  className: 'pb-binary-digit text-brand-ink',
  left: [0, 75],
  top: [-15, 35],
  fontSizeRem: [0.7, 1.1],
};

const RULES = [
  [
    'Finché lo sfiori, sputa',
    'Un emettitore non è un’animazione che parte e finisce: è una sorgente accesa. Entra il puntatore e comincia, esce e smette. Quanto spesso, quanto vivono e che cosa c’è scritto stanno in una taratura, che è una prop.',
  ],
  [
    'Su un telefono non esiste «sopra»',
    'Il dito tocca e se ne va, quindi un emettitore appeso all’ingresso e all’uscita darebbe un elemento solo. Al tocco parte invece una raffica di tre secondi che si spegne da sé, e alzare il dito non la interrompe. Il valore è tapMs.',
  ],
  [
    'Chi è nato arriva in fondo',
    'All’uscita smette di generarne, ma quelli in volo finiscono la loro animazione: con la pioggia binaria sono una ventina insieme, e spegnerli tutti nello stesso istante è uno scatto che si vede. Nessuno riparte: ogni elemento vive una volta sola.',
  ],
  [
    'Una taratura è un dato, non una funzione',
    'Sette numeri e un elenco di parole: ogni quanto, quanto vive, che cosa c’è scritto, con che classe, dove nasce e quanto è grande. Così passa da una pagina server a un componente client come qualunque altra prop, si stampa a schermo e si ritocca con uno spread. Il prezzo è dichiarato: quello che vola è testo.',
  ],
  [
    'Una frase si legge da sola',
    'Un fumetto è largo quanto la frase che contiene, quindi due insieme si coprono comunque li si disponga: la cadenza dei fumetti è la loro vita più due decimi, e il successivo nasce a scena vuota. Entra in un quarto di secondo, resta fermo due secondi e mezzo, esce in un altro quarto. Una pioggia non ha questo problema — una cifra è larga un carattere — e infatti ne vivono venti insieme.',
  ],
  [
    'Due di fila non si somigliano',
    'L’altezza non si pesca libera: gira per corsie, che sono altezze fisse percorse a turno, così ogni fumetto compare da un’altra parte. E il testo si pesca fra gli altri, mai quello appena uscito. Sono le due cose che fanno sembrare corto un mazzo di frasi anche quando non lo è.',
  ],
  [
    'Da fermo fa un cenno',
    'Un easter egg che si scopre solo passandoci sopra non si scopre affatto. Il contenuto avvolto fa un saltello ogni sei secondi — tutto il movimento sta negli ultimi settecento millisecondi — e si ferma mentre l’emettitore sputa, perché lì il cenno ha già fatto il suo mestiere.',
  ],
  [
    'Quello che vola sborda',
    'I fumetti nascono sopra il riquadro e le cifre gli escono ai lati: un antenato con overflow-hidden li taglia a metà. L’emettitore disegna un contenitore relative e non taglia niente; il resto della colonna è di chi lo mette.',
  ],
];

/** Una scheda autore come quella in fondo alle pagine di RattInventario: un segno e un nome. */
function AuthorCard({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium">
      {children}
    </span>
  );
}

export default function TouchPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Il tocco</h1>
        <p className="text-sm text-muted">
          <code>HoverEmitter</code> avvolge qualunque cosa e, finché qualcuno la sfiora, le fa
          uscire attorno elementi effimeri che se ne vanno da soli. Che cosa esce — ogni quanto,
          quanto vive, con che aspetto — sta in una <strong>taratura</strong>:{' '}
          <code>comicBubbles(frasi)</code> e <code>binaryRain()</code> sono le due di casa.
        </p>
      </div>

      <TechRule>le due schede della firma</TechRule>

      <section className="flex flex-col gap-3">
        <p className="max-w-2xl text-sm text-muted">
          Passaci sopra col mouse, o toccale da telefono. Due tarature lontanissime dello stesso
          meccanismo: un pensiero per volta da una parte — entra, si legge, esce, e solo dopo ne
          arriva un altro da un&apos;altra parte — una cifra ogni 80 ms dall&apos;altra.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 rounded-lg border border-border bg-surface px-6 py-20">
          <HoverEmitter effect={comicBubbles(DEV_PHRASES)}>
            <AuthorCard>
              <CodeIcon size={20} className="text-brand-ink" />
              Superivan94
            </AuthorCard>
          </HoverEmitter>

          <HoverEmitter effect={PIOGGIA}>
            <AuthorCard>
              <RobotIcon size={20} className="text-plague-ink" />
              AI-Dev
            </AuthorCard>
          </HoverEmitter>
        </div>
        <TechLabel className="text-muted">
          comicBubbles(DEV_PHRASES) · {'{'} ...binaryRain(), className: &apos;pb-binary-digit
          text-plague-ink&apos; {'}'}
        </TechLabel>
      </section>

      <TechRule>una taratura scritta a mano</TechRule>

      <section className="flex flex-col gap-3">
        <p className="max-w-2xl text-sm text-muted">
          Nessun preset di mezzo: gli stessi campi, riempiti a mano. Le parole sono un elenco — qui
          ci sono degli squit, ma ci va qualunque testo: un conto alla rovescia, le lettere di un
          nome, i versi di un&apos;altra bestia — la classe è quella della pioggia, cioè geometria e
          animazione, e il colore arriva da fuori.
        </p>
        <p className="max-w-2xl text-sm text-muted">
          Le frasi di casa — quelle che dicono il ratto e lo sviluppatore — si guardano tutte
          insieme, e si cercano, in fondo a{' '}
          <Link href="/voce" className="text-brand-ink underline underline-offset-4">
            La voce
          </Link>
          , dove si può anche filtrare per componente.
        </p>
        <div className="flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-20">
          <HoverEmitter effect={SQUIT}>
            <AuthorCard>Il magazzino</AuthorCard>
          </HoverEmitter>
        </div>
        <TechLabel className="text-muted">
          everyMs 350 · lifeMs [900, 1600] · left [0, 75] · top [−15, 35] · fontSizeRem [0,7 – 1,1]
        </TechLabel>
      </section>

      <section className="flex flex-col gap-3">
        <p className="max-w-2xl text-sm text-muted">
          <strong className="text-foreground">Questa pagina è un componente server</strong>, e le
          tre tarature le costruisce lei: è la prova che un oggetto di soli numeri e stringhe
          attraversa il confine. Una taratura che portasse dentro una funzione romperebbe il
          prerender qui, non a runtime da qualche parte.
        </p>
        <p className="max-w-2xl text-sm text-muted">
          <strong className="text-foreground">Con «meno movimento» non esce niente</strong>, cenno
          compreso, e non è un guasto: sotto quella preferenza le animazioni degli effimeri sono
          spente, quindi un fumetto comparirebbe fermo e di colpo, resterebbe piantato due secondi e
          mezzo e sparirebbe altrettanto bruscamente — più movimento di prima, non meno. La
          preferenza si accende dalle impostazioni del sistema, e una pagina che voglia dirlo a chi
          guarda la legge con <code>useReducedMotion</code>.
        </p>
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
