import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RAT_MASCOT_HEIGHT, RAT_MASCOT_SRC, RAT_MASCOT_WIDTH, RatMascot } from '../src';

describe('RatMascot', () => {
  it('mostra il disegno che viaggia col pacchetto', () => {
    render(<RatMascot title="Il ratto" />);

    // ⚠️ Il disegno è **dentro** il modulo, non accanto: un file binario ha bisogno di un URL, e
    // quell'URL lo fabbrica il bundler di chi installa — una libreria che si costruisce con `tsc`
    // non lo può produrre. Qui il `src` è già buono così com'è, senza configurare niente.
    expect(screen.getByRole('img', { name: 'Il ratto' })).toHaveAttribute('src', RAT_MASCOT_SRC);
  });

  it('senza un nome è decorativo, e sparisce dall’albero', () => {
    render(<RatMascot />);

    // ⚠️ Stessa regola delle icone: dentro un comando il nome ce l'ha il comando — `TalkingMascot`
    // porta la sua `label` — e un'immagine che ripete quel nome lo fa dire due volte.
    expect(screen.queryByRole('img')).toBeNull();
    expect(document.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('la misura è l’altezza, e la larghezza viene dal disegno', () => {
    render(<RatMascot size={88} title="Il ratto" />);

    // ⚠️ Il disegno **non è quadrato** (288×269), quindi `size` non può voler dire «il lato» come
    // per le icone. È l'altezza, perché è così che lo si usa: nell'intestazione sta su una riga e
    // a decidere è quanto è alta. E i due attributi ci sono entrambi apposta — senza, il browser
    // non sa che spazio riservare e la riga salta quando l'immagine arriva.
    const img = screen.getByRole('img', { name: 'Il ratto' });
    expect(img).toHaveAttribute('height', '88');
    expect(img).toHaveAttribute(
      'width',
      String(Math.round((88 * RAT_MASCOT_WIDTH) / RAT_MASCOT_HEIGHT)),
    );
  });

  it('non si trascina via', () => {
    render(<RatMascot title="Il ratto" />);

    // ⚠️ Un'immagine dentro un comando premibile si può afferrare col mouse, e il trascinamento
    // mangia la pressione: si preme, si muove di due pixel, e non succede niente. Le icone in SVG
    // il problema non ce l'hanno, questa sì.
    expect(screen.getByRole('img', { name: 'Il ratto' })).toHaveAttribute('draggable', 'false');
  });

  it('il disegno è un WebP, non il PNG da 222 KB', () => {
    // ⚠️ La misura che questo test difende: il sorgente in RattInventario è un PNG da **222 KB**
    // per 527×493, e due terzi sono spreco — gli stessi pixel in PNG con palette fanno 74 KB. Qui
    // viaggia un WebP a 288 di larghezza, **19,3 KB**, che in base64 diventano 25,8. Rimettendoci
    // dentro il PNG originale questo test resta verde solo se qualcuno cambia anche questa riga,
    // ed è il punto: la sostituzione dev'essere una decisione, non una svista.
    expect(RAT_MASCOT_SRC.startsWith('data:image/webp;base64,')).toBe(true);
    expect(RAT_MASCOT_SRC.length).toBeLessThan(32 * 1024);
    expect([RAT_MASCOT_WIDTH, RAT_MASCOT_HEIGHT]).toEqual([288, 269]);
  });
});
