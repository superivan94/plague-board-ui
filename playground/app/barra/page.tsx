import {
  PLAGUE_BAR_MARK_SIZE,
  PlagueBar,
  type PlagueBarSize,
  PulseDot,
  RatIcon,
  TechLabel,
  TechRule,
} from 'plague-board-ui';

import { FootSamples } from './FootSamples';

// ⚠️ Ogni barra in mostra sta dentro una `<section>`, e l'intestazione di questa pagina è una
// `<div>` invece che un `<header>`: `PlagueBar` si rende come `<header>`, e un `<header>` vale
// `banner` quando il suo antenato di sezione più vicino è il `<body>` — `section` lo è, `main` no.
// Perciò l'unico `banner` della pagina resta la barra vera in cima, e le tre qui dentro non
// competono con lei.
// ⚠️ Letto nella specifica, **non** misurato qui: l'albero che gli strumenti del browser
// restituiscono segna `banner` ogni `<header>`, e il ruolo calcolato non è leggibile da JavaScript.

interface BarSample {
  readonly size: PlagueBarSize;
  readonly padding: string;
  readonly use: string;
}

const SAMPLES: readonly BarSample[] = [
  {
    size: 'small',
    padding: '8px',
    use: 'Sta in cima a qualcosa che non è la pagina: un pannello, una finestra, una colonna laterale.',
  },
  {
    size: 'medium',
    padding: '12px',
    use: "L'intestazione di un'applicazione. È la taglia predefinita: quando non si sceglie, si ottiene questa.",
  },
  {
    size: 'large',
    padding: '16px',
    use: "La pagina d'ingresso e l'aggregatore, dove la barra si presenta invece di navigare: poche voci e molta aria.",
  },
];

/**
 * Il contenuto di esempio: lo stesso nelle tre barre, così a cambiare è solo la taglia.
 *
 * ⚠️ Qui dentro si usano i **token normali** — `text-muted`, `text-brand-ink` — e vengono scuri
 * lo stesso: `PlagueBar` porta `dark` addosso, quindi è un'isola di tema scuro e i token si
 * risolvono su quello. È il motivo per cui il contenuto di una barra non va scritto con grigi
 * fissi: seguirebbe la lastra, ma solo per caso.
 */
function BarContent({ size }: { size: PlagueBarSize }) {
  return (
    <nav className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 px-4">
      <span className="flex items-center gap-2">
        <RatIcon
          size={PLAGUE_BAR_MARK_SIZE[size]}
          className="animate-heartbeat shrink-0 text-brand"
        />
        <TechLabel className="text-muted">rattoteca</TechLabel>
      </span>
      <span className="text-sm text-brand-ink underline decoration-brand/60 underline-offset-8">
        I manuali
      </span>
      <span className="text-sm text-muted">I vettori ludici</span>

      <TechRule orientation="vertical">
        il grande piano
      </TechRule>
      <span className="text-sm text-muted">Parametri</span>

      <span className="ml-auto flex items-center gap-2">
        <PulseDot />
        <TechLabel className="text-muted">operativo</TechLabel>
      </span>
    </nav>
  );
}

export default function BarPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">La barra</h1>
        <p className="text-sm text-muted">
          Una lastra scura e sfocata, appiccicata in cima. Possiede{' '}
          <strong>una misura sola: il rientro verticale</strong>. Quanto è larga la colonna dentro
          lo decide la pagina, perché dipende dal contenuto — la barra è un contenitore, non
          un&apos;intestazione: non disegna un marchio e non conosce nessun indirizzo.
        </p>
        <p className="text-sm text-muted">
          ⚠️ Resta scura <strong>nei due temi</strong>: è la lastra dei Ludoratti, e su una pagina
          chiara fa da cornice invece che da sfondo.
        </p>
      </div>

      <TechRule>le tre taglie</TechRule>

      {SAMPLES.map(({ size, padding, use }) => (
        <section key={size} className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-lg font-medium">{size}</h2>
            <TechLabel className="text-brand-ink">
              rientro {padding} · segno {PLAGUE_BAR_MARK_SIZE[size]}px
            </TechLabel>
          </div>

          {/* `isSticky={false}`: una barra in mostra non è una barra in servizio, e tre barre
              appiccicate si accavallerebbero in cima alla stessa pagina.
              ⚠️ E `isCompactOnMobile={false}` per la stessa ragione: qui le tre taglie sono
              **il soggetto**, e con la compattazione accesa su un telefono si vedrebbero tre
              barre identiche sotto tre nomi diversi. È il caso che la prop esiste per coprire. */}
          <PlagueBar
            size={size}
            isSticky={false}
            isCompactOnMobile={false}
            className="rounded-lg border border-border"
          >
            <BarContent size={size} />
          </PlagueBar>

          <p className="text-sm text-muted">{use}</p>
        </section>
      ))}

      <TechRule>e sul telefono, la piccola</TechRule>

      <section className="flex max-w-2xl flex-col gap-3">
        <p className="text-sm text-muted">
          La taglia che si dichiara è quella che si vede <strong>dove c&apos;è posto</strong>. Sotto
          i <strong>640px di larghezza</strong> o i <strong>480px di altezza</strong> la barra e il
          piede tornano a <code>small</code> da soli: il rientro scende a 8px per lato in cima e a
          4 in fondo, e il segno a 20.
        </p>
        <p className="text-sm text-muted">
          ⚠️ <strong className="text-foreground">Anche l&apos;altezza, non solo la larghezza.</strong>{' '}
          Un telefono <em>coricato</em> è largo 844 pixel e alto 390: guardando la sola larghezza
          passerebbe per un desktop, e una barra <code>large</code> con un piede <code>large</code>{' '}
          si prenderebbero 122 dei suoi 390 pixel — un terzo dello schermo, proprio dove lo spazio
          verticale è il più scarso di tutti.
        </p>
        <p className="text-sm text-muted">
          Si spegne con <code>isCompactOnMobile={'{false}'}</code>, ed è quello che fanno le sei
          lastre in mostra in questa pagina: lì le taglie sono il soggetto, e tre barre identiche
          sotto tre nomi diversi non direbbero niente. Vale anche per una barra che non sta in una
          pagina intera — in un pannello, in una colonna — dove «telefono» non vuol dire niente.
        </p>
        <p className="text-sm text-muted">
          ⚠️ <strong className="text-foreground">Il segno dentro va compattato a parte.</strong> La
          lastra non può ridimensionare un <code>&lt;svg&gt;</code> che non conosce, e un numero già
          stampato dentro <code>width</code> non risponde a una media query. Perciò accanto a ogni
          numero c&apos;è una classe che fa la stessa cosa in CSS —{' '}
          <code>PLAGUE_BAR_MARK_CLASS</code> e <code>PLAGUE_FOOT_MARK_CLASS</code> — e si passano
          insieme. Chi dimentica la classe si ritrova un marchio grande in una barra bassa:
          sbagliato, ma non rotto.
        </p>
      </section>

      <TechRule>che cosa ci sta dentro</TechRule>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">La voce di servizio, e i suoi tre mestieri</h2>
        <p className="max-w-2xl text-sm text-muted">
          Il carattere fisso in maiuscoletto è la voce con cui l&apos;impianto parla di sé. Nella
          stessa riga fa tre lavori, e conviene sceglierlo sapendo quale:
        </p>

        <ul className="flex max-w-2xl flex-col gap-3 text-sm text-muted">
          <li>
            <TechLabel className="text-foreground">rattoteca</TechLabel> — <strong>il nome</strong>,
            accanto al marchio. In grigio, perché il segno che si guarda è il marchio.
          </li>
          <li>
            <span className="inline-flex translate-y-1 items-center">
              <TechRule orientation="vertical">il grande piano</TechRule>
            </span>{' '}
            — <strong>il confine</strong>: da lì in là le voci cambiano specie, prima i contenuti e
            poi i comandi. Non è un titolo e non è una voce disattivata — non prende il fuoco, e non
            sostituisce i <code>&lt;h*&gt;</code> ma ci convive.
          </li>
          <li>
            <span className="inline-flex translate-y-0.5 items-center gap-2">
              <PulseDot />
              <TechLabel className="text-foreground">operativo</TechLabel>
            </span>{' '}
            — <strong>lo stato</strong>, in fondo a destra. Il pallino pulsa perché dice «acceso,
            adesso»: accanto a un elenco di voci si spegne con <code>isStatic</code>, o smette di
            significare qualcosa.
          </li>
        </ul>
      </section>

      <TechRule>la stessa lastra, in fondo</TechRule>

      <section className="flex flex-col gap-3">
        <p className="max-w-2xl text-sm text-muted">
          Il piede in fondo a questa pagina è la <strong>stessa lastra</strong> con{' '}
          <code>placement=&quot;bottom&quot;</code>: cambiano l&apos;elemento — <code>footer</code>{' '}
          invece di <code>header</code>, perché sono due punti di riferimento diversi per chi naviga
          a salti — il lato del filo verde e il lato a cui si appiccica.
        </p>
        <p className="max-w-2xl text-sm text-muted">
          Dentro c&apos;è <code>PlagueFootBar</code>, che monta la firma, la versione e le donazioni
          nell&apos;ordine giusto; i suoi pezzi — <code>CreditLine</code>, <code>VersionTag</code>,{' '}
          <code>SupportButton</code> — restano pubblici per chi lo vuole montare da sé. Stringi la
          finestra e guarda: «Creato da» diventa «By:», resta un autore solo e il comando delle
          donazioni si riduce alla tazza. Non è una media query — è il <em>contenitore</em> a
          decidere, quindi lo stesso piede dentro una colonna stretta si comporta uguale.
        </p>
        <p className="max-w-2xl text-sm text-muted">
          <strong className="text-foreground">Le taglie sono le stesse, il rientro no.</strong> A
          parità di nome la lastra in fondo rientra di un gradino meno di quella in cima — 4px
          contro 8 in <strong>small</strong>, 8 contro 12, 12 contro 16 — e il piede qui sotto ne
          esce alto <strong>35, 45 o 57</strong> pixel. Un&apos;intestazione regge lo spazio che ha;
          un piede appiccicato lo toglie alla pagina a ogni schermata.
        </p>

        <FootSamples />
        <p className="max-w-2xl text-sm text-muted">
          <strong className="text-foreground">Una riga sola, in cima come in fondo.</strong>{' '}
          <code>BarRow</code> non manda a capo: se le voci non ci stanno, si scorre di lato. Una
          seconda riga cambierebbe l&apos;altezza della lastra, e con una lastra appiccicata cambia
          quanto spazio resta alla pagina.
        </p>
        <p className="max-w-2xl text-sm text-muted">
          E premi l&apos;ampolla: i segni della peste si sprigionano — <code>ParticleBurst</code>,
          che avvolge qualunque cosa e sprigiona quello che gli si passa.
        </p>
      </section>

      <TechRule>i vincoli</TechRule>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Il segno non scende quanto la barra</h2>
        <p className="max-w-2xl text-sm text-muted">
          Da <strong>large</strong> a <strong>small</strong> la barra perde 28 pixel e il marchio
          solo 12: sotto i <strong>20px</strong> il tratto interno del ratto scende sotto il pixel e
          il cuore sembra un graffio. La misura si chiede a <code>PLAGUE_BAR_MARK_SIZE</code>,
          invece di scriverla a mano in ogni applicazione.
        </p>
        {/* ⚠️ `brand-ink` e non `brand`: qui i tre segni si guardano per la **misura**, e sono sul
            fondo della pagina, non dentro la lastra scura. Il lime grezzo in tema chiaro fa 1,38 di
            contrasto — dentro la barra qui sopra va bene, perché quella è un'isola scura. */}
        <div className="flex items-end gap-8 rounded-lg border border-border p-4 text-brand-ink">
          {SAMPLES.map(({ size }) => (
            <span key={size} className="flex flex-col items-center gap-2">
              <RatIcon size={PLAGUE_BAR_MARK_SIZE[size]} />
              <TechLabel className="text-muted">
                {size} · {PLAGUE_BAR_MARK_SIZE[size]}
              </TechLabel>
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
