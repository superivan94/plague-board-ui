import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  PLAGUE_BAR_MARK_CLASS,
  PLAGUE_BAR_MARK_SIZE,
  PLAGUE_FOOT_MARK_CLASS,
  PLAGUE_FOOT_MARK_SIZE,
  PlagueBar,
  type PlagueBarSize,
  PulseDot,
  TechLabel,
  TechRule,
} from '../src';

describe('PulseDot', () => {
  it('pulsa, se non gli si dice di stare fermo', () => {
    const { container } = render(<PulseDot />);

    expect(container.firstElementChild).toHaveClass('animate-pulse');
  });

  it('sta fermo quando glielo si chiede', () => {
    const { container } = render(<PulseDot isStatic />);

    // ⚠️ Non è pignoleria: il pallino marca anche voci in elenco, e venti pallini che pulsano
    // insieme sono rumore. Chi ne mette più d'uno deve poterli spegnere.
    expect(container.firstElementChild).not.toHaveClass('animate-pulse');
  });

  it('è decorativo: non si annuncia', () => {
    const { container } = render(<PulseDot />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('TechLabel', () => {
  it('rende il testo che riceve', () => {
    render(<TechLabel>rete della peste</TechLabel>);

    expect(screen.getByText('rete della peste')).toBeInTheDocument();
  });

  it('non maiuscolizza il testo, lo maiuscolizza il disegno', () => {
    render(<TechLabel>rete della peste</TechLabel>);

    // ⚠️ `uppercase` è CSS: il testo nel DOM resta com'era. Chi lo trasformasse in JavaScript
    // romperebbe la ricerca sulla pagina e la copia negli appunti.
    const label = screen.getByText('rete della peste');
    expect(label).toHaveClass('uppercase');
    expect(label.textContent).toBe('rete della peste');
  });
});

describe('TechRule', () => {
  it('dice il nome della categoria', () => {
    render(<TechRule>filosofia</TechRule>);

    expect(screen.getByText('filosofia')).toBeInTheDocument();
  });

  it('il filo è un separatore vero, e da verticale lo dichiara', () => {
    const { rerender } = render(<TechRule>filosofia</TechRule>);

    // ⚠️ Un separatore e non un filo decorativo con `aria-hidden`: quella riga **è** il confine fra
    // due gruppi, e chi non la vede ha lo stesso bisogno di sapere che il gruppo cambia.
    // ⚠️ E l'orizzontale **non** scrive `aria-orientation`, misurato qui: è il valore predefinito
    // del ruolo, e `react-aria` — che sta sotto al `Separator` di HeroUI — mette l'attributo solo
    // quando serve. Scriverlo a mano sarebbe stato rumore.
    expect(screen.getByRole('separator')).not.toHaveAttribute('aria-orientation');

    rerender(<TechRule orientation="vertical">filosofia</TechRule>);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('il colore si cambia da fuori, e vale per il filo e per il nome', () => {
    const { container } = render(<TechRule className="text-gray-500">filosofia</TechRule>);

    // ⚠️ Il colore sta sul contenitore e il nome lo **eredita**: è la stessa scelta delle icone,
    // dove il colore viaggia su `color` e non dentro `fill`. Scrivendolo sull'etichetta, chi usa
    // il componente non avrebbe modo di cambiarlo senza riscriverlo.
    expect(container.firstElementChild).toHaveClass('text-gray-500');
    expect(screen.getByText('filosofia')).not.toHaveClass('text-gray-500');
  });

  it('non litiga con la taglia del testo di `TechLabel`', () => {
    render(<TechRule>filosofia</TechRule>);

    // ⚠️ Due valori arbitrari della stessa proprietà — `text-[10px]` addosso a `text-[11px]` —
    // non si risolvono in modo prevedibile: nella classe vince chi sta più in basso nel CSS
    // generato, non chi sta più a destra nell'attributo. Qui la taglia dev'essere **una sola**,
    // quella che `TechLabel` porta di suo.
    const sizes = screen.getByText('filosofia').className.match(/text-\[\d+px\]/g) ?? [];
    expect(sizes).toHaveLength(1);
  });
});

describe('PlagueBar', () => {
  it('è un `<header>`, non una `<div>`', () => {
    render(
      <PlagueBar>
        <span>contenuto</span>
      </PlagueBar>,
    );

    // ⚠️ È la sola asserzione che vale davvero qui: una barra di navigazione che si rende come
    // `div` non ha il ruolo `banner`, quindi chi naviga per landmark non la trova.
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('contenuto')).toBeInTheDocument();
  });

  it('resta in cima scorrendo, e si può dirle di no', () => {
    const { rerender } = render(<PlagueBar>x</PlagueBar>);
    expect(screen.getByRole('banner')).toHaveClass('sticky');

    rerender(<PlagueBar isSticky={false}>x</PlagueBar>);
    expect(screen.getByRole('banner')).not.toHaveClass('sticky');
  });

  it('accetta classi in più senza perdere le sue', () => {
    render(<PlagueBar className="px-8">x</PlagueBar>);

    const bar = screen.getByRole('banner');
    expect(bar).toHaveClass('px-8');
    expect(bar).toHaveClass('sticky');
  });

  // ⚠️ L'altezza è **l'unica misura che la barra possiede**: quanto è larga la colonna dentro lo
  // decide chi la usa, e infatti il playground ci mette il suo `mx-auto max-w-5xl px-4`. Se un
  // giorno la spaziatura verticale tornasse nel contenuto, queste tre righe diventano rosse ed è
  // il posto giusto dove accorgersene: due `py` annidati non si sommano in modo prevedibile a
  // occhio, e la barra smetterebbe di avere una taglia.
  it.each([
    ['small', 'py-2'],
    ['medium', 'py-3'],
    ['large', 'py-4'],
  ] as const)('la taglia %s porta la sua altezza', (size, padding) => {
    render(
      <PlagueBar size={size} isCompactOnMobile={false}>
        x
      </PlagueBar>,
    );

    expect(screen.getByRole('banner')).toHaveClass(padding);
  });

  // ⚠️ **La taglia dichiarata vale dove c'è posto, e su un telefono vale `small`.** Le due classi
  // sono una sola frase: il `py-2` di base è quello che si vede sotto la soglia, `pb-roomy:` lo
  // ripristina sopra. Se un giorno sparisse la prima, la barra resterebbe grande sul telefono
  // senza che niente diventi rosso — ed è per questo che il test guarda tutt'e due.
  it.each([
    ['small', 'py-2', undefined],
    ['medium', 'py-2', 'pb-roomy:py-3'],
    ['large', 'py-2', 'pb-roomy:py-4'],
  ] as const)('di default la taglia %s si accontenta di small sul telefono', (size, base, roomy) => {
    render(<PlagueBar size={size}>x</PlagueBar>);

    const bar = screen.getByRole('banner');
    expect(bar).toHaveClass(base);
    if (roomy) {
      expect(bar).toHaveClass(roomy);
      // La taglia piena non c'è **senza** variante: quella è la riga che si vedrebbe sul telefono.
      expect(bar.className.split(' ')).not.toContain(roomy.replace('pb-roomy:', ''));
    }
  });

  it('e il rientro dell’incavo scala insieme a lei, nei due modi', () => {
    const { rerender } = render(<PlagueBar size="large">x</PlagueBar>);

    // Sul telefono l'incavo si somma al rientro di `small`, non a quello di `large`: sommare la
    // taglia grande all'orecchia della fotocamera è esattamente il pixel di troppo che si voleva
    // togliere.
    expect(screen.getByRole('banner').className).toContain('pt-[calc(var(--spacing)*2_+_env(safe-area-inset-top))]');
    expect(screen.getByRole('banner').className).toContain(
      'pb-roomy:pt-[calc(var(--spacing)*4_+_env(safe-area-inset-top))]',
    );

    rerender(
      <PlagueBar size="large" isCompactOnMobile={false}>
        x
      </PlagueBar>,
    );
    expect(screen.getByRole('banner').className).toContain('pt-[calc(var(--spacing)*4_+_env(safe-area-inset-top))]');
    expect(screen.getByRole('banner').className).not.toContain('pb-roomy:');
  });

  it('senza taglia è media', () => {
    render(<PlagueBar isCompactOnMobile={false}>x</PlagueBar>);

    expect(screen.getByRole('banner')).toHaveClass('py-3');
  });

  it('il segno cresce con la barra e non scende mai sotto i 20px', () => {
    const sizes: readonly PlagueBarSize[] = ['small', 'medium', 'large'];
    const marks = sizes.map((size) => PLAGUE_BAR_MARK_SIZE[size]);

    // ⚠️ Il 20 non è un gusto: sotto quella misura il tratto interno di `RatIcon` scende sotto il
    // pixel e il cuore diventa un graffio. È il pavimento della barra **compatta**, ed è la prima
    // cosa che verrebbe sacrificata da chi la vuole ancora più bassa.
    expect(Math.min(...marks)).toBeGreaterThanOrEqual(20);
    expect(marks).toStrictEqual([...marks].sort((a, b) => a - b));
    expect(new Set(marks).size).toBe(sizes.length);
  });

  // ⚠️ **La stessa misura scritta due volte è una misura che prima o poi diverge.** Il numero serve
  // a chi non compatta, la classe a chi compatta — ma devono dire la stessa cosa, o il marchio
  // cambierebbe di misura passando da un modo all'altro. Qui si legge la classe e si controlla che
  // il pixel che ne esce sia quello della tabella dei numeri.
  it('la classe del segno dice lo stesso numero della tabella, e sul telefono dice 20', () => {
    const sizes: readonly PlagueBarSize[] = ['small', 'medium', 'large'];

    for (const size of sizes) {
      const [base, roomy] = PLAGUE_BAR_MARK_CLASS[size].split(' ');

      expect(pixelDiSize(base)).toBe(PLAGUE_BAR_MARK_SIZE.small);
      expect(roomy ? pixelDiSize(roomy.replace('pb-roomy:', '')) : PLAGUE_BAR_MARK_SIZE.small).toBe(
        PLAGUE_BAR_MARK_SIZE[size],
      );
    }
  });
});

describe('le misure del piede', () => {
  // ⚠️ La stessa regola della barra, su una tabella a due voci — il segno del comando e quello della
  // firma — che fino a qui non la teneva nessuno: il piede monta le sue classi da sé, quindi i suoi
  // test guardavano il pixel e non il numero che chi compone un piede diverso legge in tabella.
  it('ogni classe dice lo stesso numero della sua tabella, e sul telefono torna alla piccola', () => {
    const sizes: readonly PlagueBarSize[] = ['small', 'medium', 'large'];

    for (const size of sizes) {
      for (const pezzo of ['mark', 'authorMark'] as const) {
        const [base, roomy] = PLAGUE_FOOT_MARK_CLASS[size][pezzo].split(' ');
        const piccola = PLAGUE_FOOT_MARK_SIZE.small[pezzo];

        expect(pixelDiSize(base)).toBe(piccola);
        expect(roomy ? pixelDiSize(roomy.replace('pb-roomy:', '')) : piccola).toBe(
          PLAGUE_FOOT_MARK_SIZE[size][pezzo],
        );
      }
    }
  });
});

/**
 * I pixel che una utility `size-*` di Tailwind produce: `size-5` è cinque gradini da `0.25rem`,
 * `size-[26px]` è ventisei pixel scritti a mano. Serve solo a questi test, che sono l'unico posto
 * in cui una classe va **letta** invece che scritta.
 */
function pixelDiSize(classe: string): number {
  const arbitraria = classe.match(/^size-\[(\d+)px\]$/);
  if (arbitraria) return Number(arbitraria[1]);

  const scala = classe.match(/^size-([\d.]+)$/);
  if (!scala) throw new Error(`classe non riconosciuta: ${classe}`);
  return Number(scala[1]) * 4;
}
