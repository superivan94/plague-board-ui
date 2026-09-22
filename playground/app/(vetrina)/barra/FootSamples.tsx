import {
  CodeIcon,
  PLAGUE_FOOT_MARK_SIZE,
  type PlagueBarSize,
  PlagueFootBar,
  RobotIcon,
  TechLabel,
  type CreditAuthor,
} from 'plague-board-ui';

interface FootSample {
  readonly size: PlagueBarSize;
  readonly padding: string;
  readonly use: string;
}

const FOOT_SAMPLES: readonly FootSample[] = [
  {
    size: 'small',
    padding: '4px',
    use: 'Il valore predefinito. Una firma sottile sotto una pagina di contenuti: si vede, e non chiede spazio.',
  },
  {
    size: 'medium',
    padding: '8px',
    use: 'Quando il piede porta qualcosa in più di una firma — un secondo comando, un avviso — o quando la pagina è ariosa e una striscia sottile sparirebbe.',
  },
  {
    size: 'large',
    padding: '12px',
    use: "La pagina d'ingresso, dove il piede è l'ultima cosa che si legge e può permettersi di pesare quanto l'intestazione.",
  },
];

/**
 * ⚠️ **I segni degli autori li passa l'applicazione**, quindi la taglia non li raggiunge da sé:
 * la misura giusta si legge da `PLAGUE_FOOT_MARK_SIZE`, esattamente come il marchio in cima legge
 * la sua da `PLAGUE_BAR_MARK_SIZE`. Qui si fa per mostrarlo; un'app che non lo fa non si rompe,
 * ha solo i segni di una misura sola.
 *
 * ⚠️ Qui manca la classe gemella — `PLAGUE_FOOT_MARK_CLASS` — e non è una dimenticanza: questi
 * piedi hanno la compattazione **spenta**, quindi non c'è nessun telefono a cui rimpicciolirsi. Il
 * piede vero di questo playground, in fondo alla pagina, le passa tutt'e due.
 */
function autoriDiEsempio(size: PlagueBarSize): readonly CreditAuthor[] {
  const misura = PLAGUE_FOOT_MARK_SIZE[size].authorMark;

  return [
    { name: 'Superivan94', icon: <CodeIcon size={misura} className="text-brand" /> },
    { name: 'AI-Dev', icon: <RobotIcon size={misura} className="text-plague-400" /> },
  ];
}

/**
 * Le tre taglie del piede, una sotto l'altra, con quello che ognuna misura e quando si usa.
 *
 * ⚠️ **In mostra e non in servizio**: `isSticky={false}` perché tre piedi appiccicati alla stessa
 * pagina si accavallerebbero, e `isCompactOnMobile={false}` perché qui le taglie sono il
 * **soggetto** — con la compattazione accesa, su un telefono si vedrebbero tre piedi identici
 * sotto tre nomi diversi.
 */
export function FootSamples() {
  return (
    <>
      {FOOT_SAMPLES.map(({ size, padding, use }) => (
        <div key={size} className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="font-medium">{size}</h3>
            <TechLabel className="text-brand-ink">
              rientro {padding} · segno {PLAGUE_FOOT_MARK_SIZE[size].mark}px · autore{' '}
              {PLAGUE_FOOT_MARK_SIZE[size].authorMark}px
            </TechLabel>
          </div>

          <PlagueFootBar
            size={size}
            isSticky={false}
            isCompactOnMobile={false}
            authors={autoriDiEsempio(size)}
            version="0.1.0"
            supportHref="https://ko-fi.com/superivan94"
            rowClassName="px-4"
            className="rounded-lg border border-border"
          />

          <p className="text-sm text-muted">{use}</p>
        </div>
      ))}
    </>
  );
}
