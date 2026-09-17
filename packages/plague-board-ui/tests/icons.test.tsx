import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

import {
  BiohazardIcon,
  CodeIcon,
  MoleculeIcon,
  type IconProps,
  PoisonIcon,
  RatIcon,
  RobotIcon,
  SkullIcon,
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
  { name: 'SkullIcon', Icon: SkullIcon, paint: 'fill' },
  { name: 'BiohazardIcon', Icon: BiohazardIcon, paint: 'fill' },
  { name: 'MoleculeIcon', Icon: MoleculeIcon, paint: 'fill' },
  { name: 'VirusIcon', Icon: VirusIcon, paint: 'fill' },
  { name: 'RobotIcon', Icon: RobotIcon, paint: 'fill' },
  { name: 'CodeIcon', Icon: CodeIcon, paint: 'stroke' },
  { name: 'SparklesIcon', Icon: SparklesIcon, paint: 'stroke' },
  { name: 'RatIcon', Icon: RatIcon, paint: 'stroke' },
];

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
