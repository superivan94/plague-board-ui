import {
  PLAGUE_BAR_MARK_SIZE,
  PlagueBar,
  type PlagueBarSize,
  PulseDot,
  RatIcon,
  TechLabel,
  TechRule,
} from 'plague-board-ui';

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
 * ⚠️ I colori qui dentro sono **scritti scuri di proposito**, non dimenticati: la barra resta
 * scura nei due temi, quindi quello che ci sta dentro non segue il tema della pagina.
 */
function BarContent({ size }: { size: PlagueBarSize }) {
  return (
    <nav className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 px-4">
      <span className="flex items-center gap-2">
        <RatIcon
          size={PLAGUE_BAR_MARK_SIZE[size]}
          className="animate-heartbeat shrink-0 text-brand"
        />
        <TechLabel className="text-gray-500">rattoteca</TechLabel>
      </span>
      <span className="text-sm text-brand-ink underline decoration-brand/60 underline-offset-8">
        I manuali
      </span>
      <span className="text-sm text-gray-400">I vettori ludici</span>

      <TechRule orientation="vertical" className="text-brand/60">
        il grande piano
      </TechRule>
      <span className="text-sm text-gray-400">Parametri</span>

      <span className="ml-auto flex items-center gap-2">
        <PulseDot />
        <TechLabel className="text-gray-500">operativo</TechLabel>
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
              appiccicate si accavallerebbero in cima alla stessa pagina. */}
          <PlagueBar size={size} isSticky={false} className="rounded-lg border border-border">
            <BarContent size={size} />
          </PlagueBar>

          <p className="text-sm text-muted">{use}</p>
        </section>
      ))}

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

      <TechRule>i vincoli</TechRule>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Il segno non scende quanto la barra</h2>
        <p className="max-w-2xl text-sm text-muted">
          Da <strong>large</strong> a <strong>small</strong> la barra perde 28 pixel e il marchio
          solo 12: sotto i <strong>20px</strong> il tratto interno del ratto scende sotto il pixel e
          il cuore sembra un graffio. La misura si chiede a <code>PLAGUE_BAR_MARK_SIZE</code>,
          invece di scriverla a mano in ogni applicazione.
        </p>
        <div className="flex items-end gap-8 rounded-lg border border-border p-4 text-brand">
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
