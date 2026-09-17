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
  /** Il rientro sopra e sotto: è l'unica cosa che la barra mette di suo. */
  readonly padding: string;
  /** L'altezza totale misurata **con questa riga**, il 2026-09-17, bordo compreso. */
  readonly measured: string;
  readonly use: string;
}

const SAMPLES: readonly BarSample[] = [
  {
    size: 'small',
    padding: '8px',
    measured: '38px',
    use: 'Le barre di servizio: un pannello dentro la pagina, una finestra, una colonna laterale. Sta in cima a qualcosa che non è la pagina intera.',
  },
  {
    size: 'medium',
    padding: '12px',
    measured: '50px',
    use: "L'intestazione di un'applicazione. È quella che porta il playground, ed è la taglia predefinita: quando non si sceglie, si ottiene questa.",
  },
  {
    size: 'large',
    padding: '16px',
    measured: '66px',
    use: "La pagina d'ingresso e l'aggregatore, dove la barra non naviga ma si presenta: poche voci, molta aria, il marchio che si vede da lontano.",
  },
];

/**
 * Il contenuto di esempio: lo stesso nelle tre barre, così a cambiare è solo la taglia.
 *
 * ⚠️ Dentro ci sono i **tre mestieri della voce di servizio** dei Ludoratti, ed è il motivo per cui
 * questa finta barra non è fatta di sole voci: il marchio scritto (`TechLabel`), il confine fra due
 * gruppi di voci (`TechRule`), e lo stato dell'impianto in fondo (`PulseDot` più `TechLabel`).
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

      {/* Il confine: da qui in là le voci non sono più contenuti ma comandi dell'impianto. È lo
          stesso componente che divide i blocchi di questa pagina, girato di novanta gradi. */}
      <TechRule orientation="vertical">il grande piano</TechRule>
      <span className="text-sm text-gray-400">Parametri</span>

      <span className="ml-auto flex items-center gap-2">
        <PulseDot />
        {/* ⚠️ Niente `text-[10px]` addosso al `text-[11px]` di `TechLabel`: erano due valori
            arbitrari della stessa proprietà nella stessa classe, e vince chi sta più in basso nel
            CSS generato — non chi sta più a destra qui. */}
        <TechLabel className="text-gray-500">operativo</TechLabel>
      </span>
    </nav>
  );
}

export default function BarPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">La barra, alle tre altezze</h1>
        <p className="text-sm text-default-500">
          <code>PlagueBar</code> possiede <strong>una misura sola, il rientro verticale</strong>.
          Quanto è larga la colonna dentro, e quanto è alta la riga, lo decide la pagina — qui è un{' '}
          <code>mx-auto max-w-3xl px-4</code> scritto in questo file. Per questo accanto al rientro
          c&apos;è l&apos;altezza <em>misurata con questa riga</em>: con un&apos;altra riga viene un
          altro numero, e il rientro resta quello.
        </p>
      </div>

      <TechRule>le tre taglie</TechRule>

      {SAMPLES.map(({ size, padding, measured, use }) => (
        <section key={size} className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-lg font-medium">{size}</h2>
            <TechLabel className="text-brand-ink">
              rientro {padding} · segno {PLAGUE_BAR_MARK_SIZE[size]}px · qui {measured} in tutto
            </TechLabel>
          </div>

          {/* ⚠️ `isSticky={false}`: tre barre appiccicate si accavallerebbero in cima alla stessa
              pagina. È il caso per cui la prop esiste — una barra in mostra non è una barra in
              servizio. */}
          <PlagueBar size={size} isSticky={false} className="rounded-lg border border-gray-800">
            <BarContent size={size} />
          </PlagueBar>

          <p className="text-sm text-default-500">{use}</p>
        </section>
      ))}

      <TechRule>che cosa ci sta dentro</TechRule>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">La voce di servizio, e i suoi tre mestieri</h2>
        <p className="max-w-2xl text-sm text-default-500">
          Le tre barre qui sopra non sono fatte di sole voci di menu. Il carattere fisso in
          maiuscoletto — <code>TechLabel</code> — è la voce con cui l&apos;impianto parla di sé, e
          nella stessa riga fa <strong>tre lavori diversi</strong>, che è il modo in cui va guardato
          prima di metterlo in una barra vera.
        </p>

        <ul className="flex max-w-2xl flex-col gap-3 text-sm text-default-500">
          <li>
            <TechLabel className="text-gray-500">rattoteca</TechLabel> — <strong>il nome scritto</strong>{' '}
            accanto al marchio. Non è un titolo: è l&apos;etichetta dell&apos;impianto, e sta in
            grigio perché il marchio lì accanto è già il segno che si guarda.
          </li>
          <li>
            <span className="inline-flex translate-y-1 items-center">
              <TechRule orientation="vertical">il grande piano</TechRule>
            </span>{' '}
            — <strong>il confine</strong>. Da lì in là le voci cambiano specie: prima ci sono i
            contenuti, dopo i comandi dell&apos;impianto. È lo stesso <code>TechRule</code> che
            divide i blocchi di questa pagina, girato di novanta gradi, ed è quello che la barra del
            playground usa per separare le pagine che mostrano da quelle che spiegano —
            «filosofia».
          </li>
          <li>
            <span className="inline-flex translate-y-0.5 items-center gap-2">
              <PulseDot />
              <TechLabel className="text-gray-500">operativo</TechLabel>
            </span>{' '}
            — <strong>lo stato</strong>, in fondo a destra con <code>ml-auto</code>. Il pallino
            pulsa perché dice «acceso, adesso»; accanto a un elenco di venti voci si spegne con{' '}
            <code>isStatic</code>, o smette di significare qualcosa.
          </li>
        </ul>

        <p className="max-w-2xl text-sm text-default-500">
          ⚠️ <strong>Il confine non è una voce disattivata</strong>, e non deve sembrarlo. Una voce
          disattivata è un comando che si potrebbe dare e adesso no: chi naviga con la tastiera ci
          finisce sopra e resta fermo senza capire. Questo non è un comando spento — è il punto in
          cui finisce un gruppo e ne comincia un altro, e infatti non riceve il fuoco. ⚠️ E non è
          nemmeno un titolo: un titolo apre una sezione e vive nella gerarchia dei{' '}
          <code>&lt;h*&gt;</code>, che è il modo in cui si salta di sezione senza vedere la pagina.
          La riga dice un&apos;altra cosa, e convive coi titoli invece di sostituirli — come qui.
        </p>
      </section>

      <TechRule>i vincoli</TechRule>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Perché il segno non scende quanto la barra</h2>
        <p className="max-w-2xl text-sm text-default-500">
          Da <strong>large</strong> a <strong>small</strong> la barra perde 28 pixel e il marchio
          solo 12: sotto i <strong>20px</strong> il tratto interno di <code>RatIcon</code> scende
          sotto il pixel e il cuore diventa un graffio. Per questo la misura del segno non si scrive
          a mano in ogni app ma si chiede a <code>PLAGUE_BAR_MARK_SIZE</code>, che è il posto dove
          quel pavimento è scritto una volta — e dove un test lo difende.
        </p>
        <div className="flex items-end gap-8 rounded-lg border border-gray-700 p-4">
          {SAMPLES.map(({ size }) => (
            <span key={size} className="flex flex-col items-center gap-2 text-brand">
              <RatIcon size={PLAGUE_BAR_MARK_SIZE[size]} />
              <TechLabel className="text-gray-400">
                {size} · {PLAGUE_BAR_MARK_SIZE[size]}
              </TechLabel>
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
