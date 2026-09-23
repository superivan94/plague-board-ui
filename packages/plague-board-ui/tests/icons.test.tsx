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
  IconBase,
  MoleculeIcon,
  MonitorIcon,
  MoonIcon,
  type IconProps,
  PoisonIcon,
  PotionMugIcon,
  RatIcon,
  RobotIcon,
  SkullIcon,
  SkullPhonesIcon,
  SkullPhonesOffIcon,
  SparklesIcon,
  SunIcon,
  VirusIcon,
} from '../src';

// Si importa dal punto d'ingresso pubblico e non dai file: quello che non passa da `src/index.ts`
// non esiste per chi installa, quindi un'icona dimenticata lì dev'essere un test rosso.
//
// `paint` non è un dettaglio del disegno: un'icona a tratto porta il colore su `stroke` e ha
// `fill="none"`, e chi le scambia ottiene una macchia nera o un'icona invisibile.
//
// ⚠️ Due icone non stanno in tabella, e non è una dimenticanza: `DripIcon` non è quadrata e ha il
// suo blocco in fondo a questo file, `GoogleIcon` non si tinge e sta in `Login.test.tsx` con gli
// altri pezzi della schermata di accesso.
interface IconEntry {
  readonly name: string;
  readonly Icon: ComponentType<IconProps>;
  readonly paint: 'fill' | 'stroke';
}

function IconaDiFuori(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 4h16v16H4z" />
    </IconBase>
  );
}

function IconaDiFuoriATratto(props: IconProps) {
  return (
    <IconBase {...props} paint="stroke">
      <path d="M4 12h16M12 4v16" />
    </IconBase>
  );
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
  { name: 'SunIcon', Icon: SunIcon, paint: 'fill' },
  { name: 'MoonIcon', Icon: MoonIcon, paint: 'fill' },
  { name: 'MonitorIcon', Icon: MonitorIcon, paint: 'fill' },
  // ⚠️ Le ultime due non sono nostre: sono icone disegnate **fuori** con `IconBase`, come farebbe
  // un'applicazione, e stanno qui perché quel contratto è pubblico. Chi disegna i segni del suo
  // dominio deve ottenere le stesse sette cose delle icone di casa senza saperlo.
  { name: 'IconBase, a campitura, da fuori', Icon: IconaDiFuori, paint: 'fill' },
  { name: 'IconBase, a tratto, da fuori', Icon: IconaDiFuoriATratto, paint: 'stroke' },
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
