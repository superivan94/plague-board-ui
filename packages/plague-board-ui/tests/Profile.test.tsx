import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PLAGUE_AVATAR_SIZE, PlagueAvatar, PlaguePanel, ThematicBadge } from '../src';

/**
 * ⚠️ **In jsdom l'immagine di un avatar non compare mai, e non è un difetto nostro.** `Avatar` di
 * HeroUI è costruito su `@radix-ui/react-avatar`, che rende `<img>` **solo quando l'immagine si è
 * caricata davvero**: fabbrica un `new Image()`, aspetta `onload`, e fino ad allora mostra il
 * ripiego. jsdom le immagini non le carica, quindi lo stato resta `loading` per sempre.
 *
 * Vuol dire che di `src` e `alt` **qui non si può provare niente**: è confine dichiarato, e si
 * guarda nel playground. Quello che si prova è tutto il resto — la forma, l'anello, il segno
 * nell'angolo, il ripiego — che è poi la parte che abbiamo scritto noi.
 */
// ⚠️ La radice dell'avatar si cerca per **classe**: è l'unico pezzo di HeroUI senza `data-slot`
// (misurato con una sonda), mentre ripiego, pastiglia e ancora ce l'hanno.
const avatar = (contenitore: HTMLElement) => contenitore.querySelector('.avatar');
const ripiego = (contenitore: HTMLElement) => contenitore.querySelector('[data-slot="avatar-fallback"]');
const pastiglia = (contenitore: HTMLElement) => contenitore.querySelector('[data-slot="badge"]');

describe('PlagueAvatar', () => {
  it('senza immagine mostra il teschio, che è il ritratto di chi non ne ha uno', () => {
    const { container } = render(<PlagueAvatar />);

    expect(ripiego(container)?.querySelector('svg')).toBeInTheDocument();
    // Decorativo: il nome di chi è ritratto sta nell'`alt` dell'immagine, non nel teschio.
    expect(ripiego(container)?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('il ripiego si sostituisce, perché le iniziali sono un’altra convenzione legittima', () => {
    const { container } = render(<PlagueAvatar fallback={<span>RZ</span>} />);

    expect(ripiego(container)).toHaveTextContent('RZ');
    expect(ripiego(container)?.querySelector('svg')).toBeNull();
  });

  it('la forma tonda e l’anello verde sono nostri, non di HeroUI', () => {
    // ⚠️ `.avatar` di HeroUI è un **quadrato stondato** — `border-radius: calc(var(--radius) * 3)`,
    // misurato nel suo CSS — mentre l'avatar dei Ludoratti è un cerchio con l'anello del marchio.
    // Le utility di Tailwind stanno in `@layer utilities` e quelle di HeroUI in `@layer components`,
    // quindi le nostre vincono senza dipendere dall'ordine degli import.
    const { container } = render(<PlagueAvatar />);

    expect(avatar(container)).toHaveClass('rounded-full');
    expect(avatar(container)?.className).toMatch(/ring-2/);
    expect(avatar(container)?.className).toMatch(/ring-brand-ink/);
  });

  it('le taglie sono le tre di HeroUI, e la media non ha una classe', () => {
    // Misurato nel suo CSS: `.avatar` vale 40px ed **`.avatar--md` non esiste**. Un test che
    // cercasse quella classe sarebbe rosso per un motivo che non è un difetto.
    const { container: piccolo } = render(<PlagueAvatar size="sm" />);
    const { container: medio } = render(<PlagueAvatar />);
    const { container: grande } = render(<PlagueAvatar size="lg" />);

    expect(avatar(piccolo)).toHaveClass('avatar--sm');
    expect(avatar(medio)?.className).not.toMatch(/avatar--(sm|lg)/);
    expect(avatar(grande)).toHaveClass('avatar--lg');
  });

  it('il teschio del ripiego è metà della taglia, a tutte e tre le taglie', () => {
    // I numeri vengono da `PLAGUE_AVATAR_SIZE`, che è pubblico apposta: chi passa un ripiego suo
    // legge lì quanto farlo grande, invece di indovinare il lato di un avatar di HeroUI.
    for (const size of ['sm', 'md', 'lg'] as const) {
      const { container, unmount } = render(<PlagueAvatar size={size} />);

      expect(ripiego(container)?.querySelector('svg')).toHaveAttribute(
        'width',
        String(PLAGUE_AVATAR_SIZE[size] / 2),
      );
      unmount();
    }
  });

  it('il segno nell’angolo sta dentro l’ancora, o non starebbe nell’angolo', () => {
    // ⚠️ La pastiglia è in `position: absolute` e si posiziona sull'antenato `.badge-anchor`: fuori
    // di lì volerebbe sull'antenato posizionato più vicino, che è una pagina qualunque.
    const { container } = render(<PlagueAvatar />);
    const ancora = container.querySelector('[data-slot="badge-anchor"]');

    expect(ancora?.contains(avatar(container)!)).toBe(true);
    expect(ancora?.contains(pastiglia(container)!)).toBe(true);
    expect(pastiglia(container)?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('il segno nell’angolo si toglie, perché non ogni ritratto è un contagiato', () => {
    const { container } = render(<PlagueAvatar badge={null} />);

    expect(pastiglia(container)).toBeNull();
    expect(avatar(container)).toBeInTheDocument();
  });

  it('non pulsa se non glielo si chiede', () => {
    // ⚠️ È la regola di `PotionMugIcon` e di `PulseDot`: l'interruttore dell'animazione sta su chi
    // monta il pezzo, non dentro il disegno. Di là la pastiglia pulsa sempre, e in una scheda con
    // dentro altre sei cose vive è una luce che non dice più niente.
    const { container: fermo } = render(<PlagueAvatar />);
    const { container: vivo } = render(<PlagueAvatar isPulsing />);

    expect(pastiglia(fermo)?.className).not.toMatch(/animate-pulse/);
    expect(pastiglia(vivo)).toHaveClass('animate-pulse');
  });
});

describe('ThematicBadge', () => {
  it('è il `Chip` di HeroUI vestito, non una pastiglia scritta a mano', () => {
    const { container } = render(<ThematicBadge>Paziente Zero</ThematicBadge>);
    const chip = container.querySelector('[data-slot="chip"]');

    expect(chip).toHaveTextContent('Paziente Zero');
    expect(chip).toHaveClass('rounded-full');
  });

  it('il colore lo sceglie chi lo usa, perché i piani non sono nostri', () => {
    // ⚠️ I nomi dei piani e i loro colori restano a RattInventario: sono il suo modello di
    // abbonamento, non l'identità dei Ludoratti. Qui c'è la pastiglia, non la tabella.
    const { container } = render(<ThematicBadge color="danger">Untore</ThematicBadge>);

    expect(container.querySelector('[data-slot="chip"]')).toHaveClass('chip--danger');
  });

  it('il colore tinge anche il fondo, o in tema chiaro non si vede', () => {
    // ⚠️ Nella variante predefinita di HeroUI il colore vive **solo** nel testo, e in tema chiaro
    // quei testi sono tutti scuri e vicini fra loro: fra l'oliva di `accent` e il quasi-nero di
    // `default` ci sono 2,50, cioè a colpo d'occhio la stessa pastiglia. In scuro invece sono
    // tinte sature accanto a un bianco, e si vedono benissimo — per questo il difetto stava solo
    // da una parte, e l'ha trovato l'utente guardando il playground.
    const { container } = render(<ThematicBadge color="danger">Untore</ThematicBadge>);

    expect(container.querySelector('[data-slot="chip"]')).toHaveClass('chip--soft');
  });

  it('porta un segno prima del nome, e il segno non si annuncia', () => {
    const { container } = render(<ThematicBadge icon={<svg aria-hidden="true" />}>Untore</ThematicBadge>);
    const chip = container.querySelector('[data-slot="chip"]');

    expect(chip?.firstElementChild?.tagName).toBe('svg');
    expect(chip).toHaveTextContent('Untore');
  });
});

describe('PlaguePanel', () => {
  it('è la `Card` di HeroUI vestita, e i figli restano figli', () => {
    const { container } = render(
      <PlaguePanel>
        <h2>Scheda</h2>
      </PlaguePanel>,
    );
    const card = container.querySelector('[data-slot="card"]');

    expect(card).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Scheda' })).toBeInTheDocument();
  });

  it('porta il bordo del marchio, che è quello che la fa leggere come nostra', () => {
    const { container } = render(<PlaguePanel>x</PlaguePanel>);

    expect(container.querySelector('[data-slot="card"]')?.className).toMatch(/border-brand-ink/);
  });

  it('accetta classi in più senza perdere le sue', () => {
    const { container } = render(<PlaguePanel className="max-w-md">x</PlaguePanel>);
    const card = container.querySelector('[data-slot="card"]');

    expect(card).toHaveClass('max-w-md');
    expect(card?.className).toMatch(/border-brand-ink/);
  });
});
