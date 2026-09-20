import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

import {
  BacillusIcon,
  BiohazardIcon,
  CloudIcon,
  CoccusIcon,
  CodeIcon,
  DiceIcon,
  DripIcon,
  MoleculeIcon,
  type IconProps,
  PoisonIcon,
  PotionMugIcon,
  RatIcon,
  RobotIcon,
  SkullIcon,
  SkullPhonesIcon,
  SkullPhonesOffIcon,
  SparklesIcon,
  VirusIcon,
} from '../src';

// Si importa dal punto d'ingresso pubblico e non dai file: quello che non passa da `src/index.ts`
// non esiste per chi installa, quindi un'icona dimenticata lì dev'essere un test rosso.
//
// `paint` non è un dettaglio del disegno: un'icona a tratto porta il colore su `stroke` e ha
// `fill="none"`, e chi le scambia ottiene una macchia nera o un'icona invisibile.
interface IconEntry {
  readonly name: string;
  readonly Icon: ComponentType<IconProps>;
  readonly paint: 'fill' | 'stroke';
}

const icons: readonly IconEntry[] = [
  { name: 'PoisonIcon', Icon: PoisonIcon, paint: 'fill' },
  { name: 'PotionMugIcon', Icon: PotionMugIcon, paint: 'fill' },
  { name: 'SkullIcon', Icon: SkullIcon, paint: 'fill' },
  { name: 'BiohazardIcon', Icon: BiohazardIcon, paint: 'fill' },
  { name: 'MoleculeIcon', Icon: MoleculeIcon, paint: 'fill' },
  { name: 'VirusIcon', Icon: VirusIcon, paint: 'fill' },
  { name: 'RobotIcon', Icon: RobotIcon, paint: 'fill' },
  { name: 'CodeIcon', Icon: CodeIcon, paint: 'stroke' },
  { name: 'SparklesIcon', Icon: SparklesIcon, paint: 'stroke' },
  { name: 'RatIcon', Icon: RatIcon, paint: 'stroke' },
  { name: 'SkullPhonesIcon', Icon: SkullPhonesIcon, paint: 'fill' },
  { name: 'SkullPhonesOffIcon', Icon: SkullPhonesOffIcon, paint: 'fill' },
  { name: 'BacillusIcon', Icon: BacillusIcon, paint: 'stroke' },
  { name: 'CoccusIcon', Icon: CoccusIcon, paint: 'stroke' },
  { name: 'CloudIcon', Icon: CloudIcon, paint: 'fill' },
  { name: 'DiceIcon', Icon: DiceIcon, paint: 'fill' },
];

/**
 * Quanti pezzi staccati ha un tracciato: ogni `M` ne comincia uno.
 *
 * ⚠️ È l'unica misura di un disegno che jsdom concede — `getBBox` lì non esiste, e ogni
 * rettangolo misura zero — quindi la sagoma, i margini e le proporzioni stanno in `COLLAUDI.md`.
 * Quello che si prova qui è che i pezzi ci siano **tutti**: un tracciato che ne perde uno in un
 * copia e incolla continua a disegnare qualcosa di plausibile.
 */
function pezzi(d: string | null | undefined): number {
  return (d?.match(/M/g) ?? []).length;
}

it('il marchio del ratto si tinge tutto, tratto e orecchie insieme', () => {
  const { container } = render(<RatIcon color="#a3e635" />);

  // ⚠️ È l'unico disegno a paint misto: le curve sono a tratto, le orecchie sono piene. Con il
  // colore scritto dentro `fill` sull'`<svg>` — com'era prima — le orecchie non avrebbero avuto
  // modo di leggerlo, e il ratto sarebbe uscito verde senza orecchie.
  expect(container.querySelector('svg')).toHaveStyle({ color: '#a3e635' });
  expect(container.querySelectorAll('circle[fill="currentColor"]')).toHaveLength(2);
});

describe.each(icons)('$name', ({ Icon, paint }) => {
  it('senza prop si rende a 24px', () => {
    const { container } = render(<Icon />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('accetta taglia e classe', () => {
    const { container } = render(<Icon size={56} className="opacity-40" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '56');
    expect(svg).toHaveAttribute('height', '56');
    expect(svg).toHaveClass('opacity-40');
  });

  it('porta il colore dove il suo disegno lo vuole', () => {
    // `#00ff0040` è la forma vera con cui il fondale della peste le usa: esadecimale a otto cifre,
    // cioè col canale alfa dentro il colore invece che in una classe di opacità.
    const { container } = render(<Icon color="#00ff0040" />);

    // ⚠️ Il colore sta nella proprietà CSS `color`, e i tracciati lo prendono da `currentColor`:
    // è quello che permette a un disegno a paint misto — tratto fuori, pieno dentro — di tingersi
    // tutto insieme. L'attributo dice **quale** delle due proprietà dipinge, non con che colore.
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ color: '#00ff0040' });

    if (paint === 'fill') {
      expect(svg).toHaveAttribute('fill', 'currentColor');
      expect(svg).not.toHaveAttribute('stroke');
    } else {
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    }
  });

  it('senza colore non impone niente, e il testo intorno decide', () => {
    const { container } = render(<Icon />);

    // Nessuno `style`: l'icona eredita il `color` di chi la contiene, che è il caso normale e
    // quello che ne permette la sostituzione dentro un comando.
    expect(container.querySelector('svg')).not.toHaveAttribute('style');
  });

  it('disegna un tracciato', () => {
    const { container } = render(<Icon />);

    // Un file di icona che perde il suo `d` in un copia e incolla continua a rendere un `<svg>`
    // valido, largo 24 e invisibile: è l'unico controllo che se ne accorge.
    expect(container.querySelector('svg path')).toHaveAttribute('d');
  });

  it('è decorativa se non ha un titolo', () => {
    const { container } = render(<Icon />);

    // ⚠️ Si asserisce l'attributo, non `queryByRole('img')`: un `<svg>` senza `role` esplicito non
    // risponde comunque a quel ruolo — per l'albero di accessibilità è un `graphics-document` — e
    // quel caso resterebbe verde anche togliendo l'`aria-hidden` che deve difendere. Provato
    // spegnendo la riga.
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('si annuncia col titolo che riceve', () => {
    render(<Icon title="Rischio biologico" />);

    expect(screen.getByRole('img', { name: 'Rischio biologico' })).toBeInTheDocument();
  });
});

it('ogni icona è un disegno diverso dalle altre', () => {
  const drawings = icons.map(({ Icon }) => {
    const { container } = render(<Icon />);
    return [...container.querySelectorAll('svg path')].map((path) => path.getAttribute('d')).join();
  });

  // File quasi identici sono il posto dove un copia e incolla lascia due volte lo stesso
  // tracciato: il teschio che si rende come il virus è un difetto che nessun altro caso vede.
  expect(new Set(drawings).size).toBe(icons.length);
});

it('il teschio con le cuffie porta il nostro cranio, non un secondo teschio', () => {
  // ⚠️ Chiesto dall'utente il 2026-09-20 guardando il comando della musica, e il caso è qui perché
  // il difetto non si vede in un file solo: due teschi disegnati a mano nello stesso pacchetto
  // divergono al primo ritocco, e chi li guarda affiancati nota subito che non sono lo stesso.
  // Di là ce ne sono **tre**, uno per posto in cui serviva.
  const solo = render(<SkullIcon />);
  const cranio = solo.container.querySelector('svg path')?.getAttribute('d');
  expect(cranio).toBeTruthy();

  for (const ConCuffie of [SkullPhonesIcon, SkullPhonesOffIcon]) {
    const { container, unmount } = render(<ConCuffie />);
    const tracciati = [...container.querySelectorAll('svg path')].map((p) => p.getAttribute('d'));

    expect(tracciati).toContain(cranio);
    unmount();
  }
});

describe('DripIcon', () => {
  // ⚠️ Non sta nella tabella qui sopra, e il primo caso dice perché: è l'unica icona che quadrata
  // non è. `IconProps` promette un lato solo perché tutte le altre lo sono, e chi sostituisce
  // l'icona di un componente continua a vedere solo quel contratto.
  it('è alta due volte e mezzo la sua larghezza, che è la proporzione del disegno', () => {
    const { container } = render(<DripIcon />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '8');
    expect(svg).toHaveAttribute('height', '20');
    expect(svg).toHaveAttribute('viewBox', '0 0 8 20');
  });

  it('si lascia stirare, perché una goccia che cade si allunga', () => {
    const { container } = render(<DripIcon size={12} height={48} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '12');
    expect(svg).toHaveAttribute('height', '48');
    // Senza questo, un disegno 8×20 dentro un riquadro 12×48 resterebbe in proporzione e la
    // goccia si vedrebbe centrata e piccola invece di riempire lo spazio che le è stato dato.
    expect(svg).toHaveAttribute('preserveAspectRatio', 'none');
  });

  it('porta il suo riflesso, che resta bianco anche quando la goccia è verde', () => {
    const { container } = render(<DripIcon color="#a3e635" />);

    const riflesso = container.querySelector('svg path[stroke]');
    expect(riflesso).toHaveAttribute('stroke', 'white');
    expect(riflesso).toHaveAttribute('fill', 'none');
  });

  it('è decorativa se non ha un titolo, come tutte le altre', () => {
    const { container } = render(<DripIcon />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('DiceIcon', () => {
  it('i cinque punti sono buchi nel corpo, non dischi dipinti', () => {
    const { container } = render(<DiceIcon />);

    const tracciato = container.querySelector('svg path');
    // ⚠️ Senza `evenodd` il dado non si rompe: si riempie. I cinque cerchi si sommano al corpo
    // invece di forarlo, e resta un quadrato stondato pieno — verde in ogni test che guarda le
    // prop, e sbagliato in pagina. È l'unica riga che difende il disegno.
    expect(tracciato).toHaveAttribute('fill-rule', 'evenodd');
    expect(pezzi(tracciato?.getAttribute('d'))).toBe(6);
  });
});

describe.each([
  { nome: 'CoccusIcon', Icon: CoccusIcon, appendici: 6 },
  { nome: 'BacillusIcon', Icon: BacillusIcon, appendici: 4 },
])('$nome', ({ Icon, appendici }) => {
  it('è un corpo, le sue appendici, e tre granuli dentro', () => {
    const { container } = render(<Icon />);

    const [corpo, code] = [...container.querySelectorAll('svg path')];
    expect(pezzi(corpo?.getAttribute('d'))).toBe(1);
    expect(pezzi(code?.getAttribute('d'))).toBe(appendici);

    // ⚠️ I granuli non sono decorazione: sono quello che toglie l'altro disegno di mezzo. Senza,
    // il cocco torna a essere un sole e il bacillo diventa una pillola — due segni che in una
    // libreria della peste non c'entrano niente, e che nessun test sulle prop vedrebbe mai.
    // E devono essere **tre**: due, simmetrici dentro un corpo, si leggono come due occhi.
    expect(container.querySelectorAll('circle[fill="currentColor"]')).toHaveLength(3);
  });
});

describe('CloudIcon', () => {
  it('è tre lobi più la base piatta, che è ciò che la rende una cappa', () => {
    const { container } = render(<CloudIcon />);

    const tracciato = container.querySelector('svg path');
    expect(pezzi(tracciato?.getAttribute('d'))).toBe(4);
    // ⚠️ E **non** porta `evenodd`, al contrario del dado: lì i pezzi si forano, qui si sommano.
    // Con la regola sbagliata i tre lobi si buchererebbero a vicenda dove si sovrappongono, e la
    // nuvola diventerebbe un intreccio di spicchi.
    expect(tracciato).not.toHaveAttribute('fill-rule');
  });
});
