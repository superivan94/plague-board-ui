import {
  BarRow,
  CodeIcon,
  CreditCard,
  CreditLine,
  DEV_PHRASES,
  PLAGUE_BAR_MARK_CLASS,
  PLAGUE_BAR_MARK_SIZE,
  PLAGUE_FOOT_MARK_CLASS,
  PLAGUE_FOOT_MARK_SIZE,
  PlagueBar,
  PlagueFootBar,
  PulseDot,
  RatIcon,
  RobotIcon,
  SupportButton,
  TechLabel,
  TechRule,
  VersionTag,
  binaryRain,
  comicBubbles,
  type CreditAuthor,
  type PlagueBarSize,
} from 'plague-board-ui';

import { defineStory, type StoryDecorator } from './types';

/**
 * Quello che un'applicazione mette dentro la sua barra: il marchio, due voci e uno stato, in una
 * `BarRow` — la riga che al telefono scorre di lato invece di andare a capo.
 *
 * ⚠️ Il marchio chiede la misura **alla libreria**, numero e classe, per la taglia della barra che
 * lo contiene: è l'unico modo in cui un segno segue la barra quando sul telefono si compatta.
 */
function barContent(size: PlagueBarSize) {
  return (
    <nav className="w-full px-4">
      <BarRow>
        <span className="flex items-center gap-2">
          <RatIcon size={PLAGUE_BAR_MARK_SIZE[size]} className={`shrink-0 text-brand ${PLAGUE_BAR_MARK_CLASS[size]}`} />
          <TechLabel className="text-muted">rattoteca</TechLabel>
        </span>
        <span className="text-sm text-brand-ink">I manuali</span>
        <span className="text-sm text-muted">I vettori ludici</span>
        <span className="ml-auto flex items-center gap-2">
          <PulseDot />
          <TechLabel className="text-muted">operativo</TechLabel>
        </span>
      </BarRow>
    </nav>
  );
}

export const plagueBarStory = defineStory(PlagueBar, {
  description:
    'La lastra in cima alla pagina: scura nei due temi, con tre altezze. Sul telefono torna piccola da sé.',
  layout: 'fullscreen',
  variants: [
    { name: 'media, la predefinita', args: { children: barContent('medium') } },
    { name: 'piccola', args: { size: 'small', children: barContent('small') } },
    { name: 'grande', args: { size: 'large', children: barContent('large') } },
    {
      name: 'grande anche sul telefono',
      args: { size: 'large', isCompactOnMobile: false, children: barContent('large') },
    },
    { name: 'in fondo alla pagina', args: { placement: 'bottom', children: barContent('medium') } },
  ],
});

/** I due autori del piede, coi loro due easter egg: l'umano pensa, l'AI piove cifre. */
function authors(size: PlagueBarSize): readonly CreditAuthor[] {
  const mark = PLAGUE_FOOT_MARK_SIZE[size].authorMark;
  const markClass = PLAGUE_FOOT_MARK_CLASS[size].authorMark;
  return [
    {
      name: 'Superivan94',
      icon: <CodeIcon size={mark} className={`text-brand ${markClass}`} />,
      href: 'https://ludoratti.it',
      effect: comicBubbles(DEV_PHRASES),
    },
    {
      name: 'AI-Dev',
      icon: <RobotIcon size={mark} className={`text-plague-400 ${markClass}`} />,
      effect: { ...binaryRain(), className: 'pb-binary-digit text-plague-400' },
    },
  ];
}

const SUPPORT_HREF = 'https://ko-fi.com/superivan94';

/**
 * Un contenitore di 15rem, sotto la soglia delle 32rem **a qualunque formato**: il piede in una
 * colonna stretta si accorcia anche su uno schermo largo.
 */
const inNarrowColumn: StoryDecorator = (variant) => <div className="@container w-60">{variant}</div>;

/** I due contenitori del confronto: uno sopra la soglia delle 32rem, uno sotto. Classi per esteso. */
const WIDTHS = [
  { className: 'w-[34rem]', label: 'in un contenitore da 34rem' },
  { className: 'w-72', label: 'in un contenitore da 18rem' },
] as const;

/**
 * La stessa variante in due contenitori di misura nota, bordati a tratteggio perché si veda dove
 * finiscono.
 *
 * ⚠️ **Mostra la regola a qualunque formato.** Con un contenitore largo quanto la cornice, le due
 * forme si vedevano solo cambiando formato: a 360 cinque varianti su sei dicevano «By:», a 768
 * erano a coppie identiche, e sembravano tutte la stessa (segnalato dall'utente). Il contenitore
 * largo nella cornice da 360 trabocca di lato, e si scorre.
 */
const atTwoWidths: StoryDecorator = (variant) => (
  <div className="flex flex-col gap-3">
    {WIDTHS.map(({ className, label }) => (
      <div key={className} className="flex flex-col gap-1">
        <TechLabel className="text-muted">{label}</TechLabel>
        <div className="overflow-x-auto">
          <div className={`@container rounded-md border border-dashed border-border p-2 ${className}`}>{variant}</div>
        </div>
      </div>
    ))}
  </div>
);

export const plagueFootBarStory = defineStory(PlagueFootBar, {
  description:
    'Il piede già montato: la firma, la versione e il comando delle donazioni. Quando la riga si stringe, i pezzi passano alla forma corta.',
  layout: 'fullscreen',
  variants: [
    { name: 'piccolo, il predefinito', args: { authors: authors('small'), version: '0.1.0', supportHref: SUPPORT_HREF } },
    {
      name: 'medio',
      args: { size: 'medium', authors: authors('medium'), version: '0.1.0', supportHref: SUPPORT_HREF },
    },
    {
      name: 'grande',
      args: { size: 'large', authors: authors('large'), version: '0.1.0', supportHref: SUPPORT_HREF },
    },
    { name: 'solo la firma', args: { authors: authors('small') } },
    {
      name: 'in una colonna stretta',
      args: { authors: authors('small'), version: '0.1.0', supportHref: SUPPORT_HREF },
      decorators: [inNarrowColumn],
    },
  ],
});

export const barRowStory = defineStory(BarRow, {
  description:
    'La riga di una barra: non va a capo, e quando le voci non ci stanno scorre di lato invece di allungare la lastra.',
  variants: [
    {
      name: 'tre voci',
      args: {
        children: ['I manuali', 'I vettori ludici', 'Parametri'].map((voce) => (
          <span key={voce} className="text-sm">
            {voce}
          </span>
        )),
      },
    },
    {
      name: 'più voci di quante ne stiano',
      note: 'Col mouse la rotella la fa scorrere di lato, e sotto compare una barra sottile da afferrare; arrivata in fondo, la rotella torna a far scendere la pagina. Sul telefono si trascina col dito, e la barra resta nascosta.',
      args: {
        children: [
          'I manuali',
          'I vettori ludici',
          'Il grande piano',
          'Parametri',
          'Le rotte del contagio',
          'Il magazzino',
          'La tana',
        ].map((voce) => (
          <span key={voce} className="text-sm">
            {voce}
          </span>
        )),
      },
    },
  ],
});

export const creditCardStory = defineStory(CreditCard, {
  description:
    'La scheda di un autore: un segno e un nome. È il pezzo con cui si compone una firma diversa da quella del piede.',
  variants: [
    {
      name: 'con collegamento',
      args: { name: 'Superivan94', icon: <CodeIcon size={16} className="text-brand-ink" />, href: 'https://ludoratti.it' },
    },
    { name: 'senza collegamento', args: { name: 'AI-Dev', icon: <RobotIcon size={16} className="text-plague-ink" /> } },
    {
      name: 'con l’easter egg',
      args: {
        name: 'AI-Dev',
        icon: <RobotIcon size={16} className="text-plague-ink" />,
        effect: { ...binaryRain(), className: 'pb-binary-digit text-plague-ink' },
      },
    },
  ],
});

export const creditLineStory = defineStory(CreditLine, {
  description:
    'La firma «umano e AI»: un’etichetta e una scheda per autore. Sotto le 32rem del suo contenitore l’etichetta si accorcia e resta il primo autore; con `isCompact` è corta sempre.',
  variants: [
    {
      name: 'si adatta al contenitore',
      note: 'Sopra le 32rem del contenitore dice «Creato da» e tutti gli autori; sotto, «By:» e il primo soltanto. Il contenitore lo dichiara chi la monta, con `@container`: il piede lo fa da sé.',
      args: { authors: authors('small') },
      decorators: [atTwoWidths],
    },
    {
      name: 'le parole dell’applicazione',
      note: '`label` è la parola della forma lunga, `shortLabel` quella della corta.',
      args: { authors: authors('small'), label: 'Scritto da', shortLabel: 'Di:' },
      decorators: [atTwoWidths],
    },
    {
      name: 'sempre corta, con isCompact',
      note: 'Corta anche nel contenitore largo: con `isCompact` la forma la decide la prop, e il `@container` non serve più.',
      args: { authors: authors('small'), isCompact: true },
      decorators: [atTwoWidths],
    },
    {
      name: 'senza un contenitore sopra',
      note: 'Nessun `@container` fra gli antenati: le container query non si applicano e resta la forma lunga, a qualunque larghezza. È il modo in cui si vuole che fallisca chi dimentica il contenitore — una firma intera si nota, un autore sparito no.',
      args: { authors: authors('small') },
    },
  ],
});

export const supportButtonStory = defineStory(SupportButton, {
  description:
    'Il comando delle donazioni, vestito come una scheda autore e con la tazza che bolle. Al clic fa la fontana e poi apre la pagina; sotto le 32rem del suo contenitore resta il segno soltanto.',
  variants: [
    {
      name: 'si adatta al contenitore',
      note: 'Sopra le 32rem del contenitore c’è la scritta; sotto resta la tazza, e il nome del comando lo porta `aria-label`, che c’è sempre.',
      args: { href: SUPPORT_HREF },
      decorators: [atTwoWidths],
    },
    {
      name: 'le parole dell’applicazione',
      args: { href: SUPPORT_HREF, label: 'Sostieni la tana' },
      decorators: [atTwoWidths],
    },
    {
      name: 'senza un contenitore sopra',
      note: 'Senza `@container` resta la scritta, a qualunque larghezza: come la firma, cade nella forma intera.',
      args: { href: SUPPORT_HREF },
    },
  ],
});

export const versionTagStory = defineStory(VersionTag, {
  description: 'La versione, in cifre tabulari: la larghezza non balla da un numero all’altro.',
  variants: [
    { name: 'una versione corta', args: { version: '0.1.0' } },
    { name: 'una versione lunga', args: { version: '12.40.108' } },
  ],
});

export const techLabelStory = defineStory(TechLabel, {
  description: 'L’etichetta di servizio: maiuscole spaziate, nel carattere tecnico.',
  variants: [
    { name: 'di servizio', args: { children: 'operativo', className: 'text-muted' } },
    { name: 'che segna', args: { children: 'sei qui', className: 'text-brand-ink' } },
  ],
});

export const techRuleStory = defineStory(TechRule, {
  description: 'Il confine fra due categorie: un filo con una parola dentro.',
  variants: [
    { name: 'orizzontale', args: { children: 'i colori' } },
    {
      name: 'verticale, dentro una riga',
      args: { children: 'filosofia', orientation: 'vertical' },
      decorators: [(variant) => <div className="flex h-10 items-center">{variant}</div>],
    },
  ],
});
