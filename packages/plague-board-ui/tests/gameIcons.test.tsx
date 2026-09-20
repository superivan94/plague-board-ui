import { render } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

import {
  AgeIcon,
  DifficultyIcon,
  DurationIcon,
  FollowedIcon,
  type IconProps,
  PlayersIcon,
  PublisherIcon,
  RatingIcon,
} from '../src';
import { pezzi } from './icone';

/**
 * I sette segni degli attributi di un gioco.
 *
 * Il **contratto** — misura, colore, classe, `aria-hidden`, un disegno diverso da ogni altro — lo
 * prova `icons.test.tsx` sulla tabella di `icone.ts`, dove tutti e sette sono in elenco insieme
 * alle icone della peste: è lì che il confronto fra tutte serve, e un'icona nuova che ripete il
 * tracciato di un'altra si vede solo guardandole insieme.
 *
 * Qui c'è quello che vale **solo per questi disegni**: quanti pezzi ha ognuno e quale regola di
 * riempimento lo tiene. Sono due cose che nessun test sulle prop vede, perché un tracciato che
 * perde un pezzo o cambia regola continua a rendere un `<svg>` valido, largo 24 e plausibile.
 *
 * ⚠️ **In jsdom un disegno non si misura**: `getBBox` non c'è e ogni rettangolo vale zero. Che le
 * sette sagome si leggano alla misura vera — 16px in una scheda, 20 in una riga — è collaudo, e sta
 * in `COLLAUDI.md`.
 */

const tracciati = (Icon: ComponentType<IconProps>) => {
  const { container } = render(<Icon />);
  return [...container.querySelectorAll('svg path')];
};

describe('PlayersIcon', () => {
  it('sono due teste e due spalle, e l’incavo in mezzo è ciò che le fa due persone', () => {
    const [segno] = tracciati(PlayersIcon);

    // ⚠️ Le due spalle sono due mezzi dischi che si **sovrappongono**: dove si incrociano il
    // contorno dell'unione fa una V, ed è quella l'unica cosa che distingue due persone da una
    // pagnotta con sopra due teste. Perderne uno lascia una persona sola, che è ancora un'icona
    // plausibile e dice un'altra cosa.
    expect(pezzi(segno?.getAttribute('d'))).toBe(4);
    // Niente `evenodd`: con quella regola le due spalle si cancellerebbero dove si sovrappongono,
    // e al posto della V resterebbe un buco.
    expect(segno).not.toHaveAttribute('fill-rule');
  });
});

describe('DurationIcon', () => {
  it('il quadrante è un buco, non un disco del colore della pagina', () => {
    const [cassa] = tracciati(DurationIcon);

    // Stessa ragione dei punti del dado: un disco dipinto sarebbe giusto in chiaro, sbagliato in
    // scuro e sbagliato due volte dentro una pastiglia colorata. Un buco mostra quello che c'è.
    expect(cassa).toHaveAttribute('fill-rule', 'evenodd');
    expect(pezzi(cassa?.getAttribute('d'))).toBe(2);
  });

  it('corona e lancette stanno in un tracciato a parte, perché si saldano invece di forare', () => {
    const [, sopra] = tracciati(DurationIcon);

    // ⚠️ È la regola dell'ampolla e del virione: con `evenodd` la corona si cancellerebbe dove
    // entra nella cassa, e le due lancette si bucherebbero a vicenda **nel punto in cui si
    // incrociano**, cioè proprio al perno.
    expect(sopra).not.toHaveAttribute('fill-rule');
    expect(pezzi(sopra?.getAttribute('d'))).toBe(3);
  });
});

describe('DifficultyIcon', () => {
  it('è un contorno solo: il dente e l’incavo non sono pezzi aggiunti', () => {
    const [segno] = tracciati(DifficultyIcon);

    // ⚠️ Un dente attaccato come cerchio a parte si salderebbe, ma un incavo no: un cerchio che
    // sta a cavallo del bordo, con `evenodd`, toglie la parte dentro e **lascia dipinta quella
    // fuori**, cioè una mezzaluna appiccicata al fianco. L'unica forma che regge tutte e due è il
    // contorno che entra ed esce da sé, ed è per questo che il tracciato è uno.
    expect(pezzi(segno?.getAttribute('d'))).toBe(1);
    expect(segno).not.toHaveAttribute('fill-rule');
  });
});

describe('RatingIcon', () => {
  it('ha cinque punte, cioè dieci vertici', () => {
    const [segno] = tracciati(RatingIcon);

    // Una stella si sbaglia contando: nove `L` più la `M` fanno dieci vertici, che alternati
    // esterno-interno danno cinque punte. Con un vertice in meno resta un poligono storto, che a
    // 16px sembra solo una stella disegnata male.
    expect(segno?.getAttribute('d')?.match(/L/g)).toHaveLength(9);
    expect(pezzi(segno?.getAttribute('d'))).toBe(1);
  });
});

describe('PublisherIcon', () => {
  it('le finestre sono buchi nel palazzo, e il palazzo è una sagoma sola', () => {
    const [segno] = tracciati(PublisherIcon);

    // ⚠️ La torre e il corpo basso sono **un contorno a gradino**, non due rettangoli accostati:
    // con `evenodd` due sagome affiancate si contano insieme, e basta uno scarto di un decimo sui
    // bordi che combaciano perché una delle due si spenga. Un contorno solo non ha quel problema.
    expect(segno).toHaveAttribute('fill-rule', 'evenodd');
    expect(pezzi(segno?.getAttribute('d'))).toBe(9);
  });
});

describe('AgeIcon', () => {
  it('sono due candele accese, saldate alla torta, sul suo piatto', () => {
    const [segno] = tracciati(AgeIcon);

    // Piatto, torta, due candele, due fiamme. Le candele entrano nel dolce e le fiamme poggiano
    // sulle candele: si sovrappongono apposta, perché pezzi staccati a mezz'aria si leggono come
    // pezzi staccati a mezz'aria. ⚠️ E il piatto non è decorazione: senza, quello che resta è una
    // scatola con due antenne.
    expect(pezzi(segno?.getAttribute('d'))).toBe(6);
    expect(segno).not.toHaveAttribute('fill-rule');
  });
});

describe('FollowedIcon', () => {
  it('ha quattro dita, come la zampa anteriore di un ratto', () => {
    const [segno] = tracciati(FollowedIcon);

    // Il cuscinetto più quattro polpastrelli. Quattro non è un numero a caso e non è nemmeno
    // grafica: è la zampa **anteriore** di un ratto, quella che lascia l'impronta che si segue.
    expect(pezzi(segno?.getAttribute('d'))).toBe(5);
  });
});

describe('i sette insieme', () => {
  it('nessuno scrive un colore sui suoi tracciati', () => {
    // ⚠️ È la regola di `IconBase`, e l'unica icona che la rompe è `GoogleIcon`, che infatti si è
    // dovuta togliere `color` dal tipo. Un `fill` scritto su un `<path>` vince su `currentColor`:
    // l'icona smette di seguire il testo intorno, e non se ne accorge nessuno finché non la si
    // mette dentro qualcosa di colorato.
    for (const Icon of [PlayersIcon, DurationIcon, DifficultyIcon, RatingIcon, PublisherIcon, AgeIcon, FollowedIcon]) {
      for (const tracciato of tracciati(Icon)) {
        expect(tracciato).not.toHaveAttribute('fill');
        expect(tracciato).not.toHaveAttribute('stroke');
      }
    }
  });
});
