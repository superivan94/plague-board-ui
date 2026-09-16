import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

import { BiohazardIcon, type IconProps, PoisonIcon, SkullIcon, VirusIcon } from '../src';

// Si importa dal punto d'ingresso pubblico e non dai file: quello che non passa da `src/index.ts`
// non esiste per chi installa, quindi un'icona dimenticata lì dev'essere un test rosso.
const icons: ReadonlyArray<readonly [string, ComponentType<IconProps>]> = [
  ['PoisonIcon', PoisonIcon],
  ['SkullIcon', SkullIcon],
  ['BiohazardIcon', BiohazardIcon],
  ['VirusIcon', VirusIcon],
];

describe.each(icons)('%s', (_name, Icon) => {
  it('senza prop si rende a 24px e col colore del testo', () => {
    const { container } = render(<Icon />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('fill', 'currentColor');
  });

  it('accetta taglia, classe e colore', () => {
    // `#00ff0040` è la forma vera con cui il fondale della peste le usa: esadecimale a otto cifre,
    // cioè col canale alfa dentro il colore invece che in una classe di opacità.
    const { container } = render(<Icon size={56} className="opacity-40" color="#00ff0040" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '56');
    expect(svg).toHaveAttribute('height', '56');
    expect(svg).toHaveClass('opacity-40');
    expect(svg).toHaveAttribute('fill', '#00ff0040');
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

it('le quattro icone sono quattro disegni diversi', () => {
  const paths = icons.map(([, Icon]) => {
    const { container } = render(<Icon />);
    return container.querySelector('svg path')?.getAttribute('d');
  });

  // Quattro file quasi identici sono il posto dove un copia e incolla lascia due volte lo stesso
  // tracciato: il teschio che si rende come il virus è un difetto che nessun altro caso vede.
  expect(new Set(paths).size).toBe(icons.length);
});
