import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  TOXIC_LEVELS,
  TOXIC_LEVEL_LABELS,
  TOXIC_LEVEL_SETTINGS,
  ToxicLevelProvider,
  ToxicLevelSwitch,
  useToxicLevel,
  type ToxicLevel,
} from '../src';

/** Una spia che scrive a schermo il livello che legge dal contesto. */
function Spia() {
  const { level } = useToxicLevel();
  return <p data-testid="spia">{level}</p>;
}

const opzione = (etichetta: string) => screen.getByRole('radio', { name: etichetta });

describe('la scala dell’atmosfera', () => {
  it('ha i quattro livelli in ordine, dal fermo al pieno', () => {
    expect(TOXIC_LEVELS).toStrictEqual<readonly ToxicLevel[]>(['off', 'low', 'medium', 'high']);
  });

  it('dà a ogni livello un nome e una taratura, senza buchi', () => {
    // ⚠️ Il caso serve perché le tre tabelle sono scritte a mano e nessuna delle tre sa delle
    // altre: un livello aggiunto in una sola verrebbe fuori come una casella vuota nel selettore
    // o come un fondale che non cambia, cioè in silenzio.
    for (const livello of TOXIC_LEVELS) {
      expect(TOXIC_LEVEL_LABELS[livello]).toBeTruthy();
      expect(TOXIC_LEVEL_SETTINGS[livello]).toBeTruthy();
    }
  });

  it('cresce a ogni gradino, e `off` non mette in scena niente', () => {
    const spento = TOXIC_LEVEL_SETTINGS.off;
    expect([spento.floaters, spento.drips, spento.maxChatter, spento.maxBubbles]).toStrictEqual([0, 0, 0, 0]);

    // La monotonia è il contratto che il selettore promette a chi lo guarda: spostarsi verso
    // «alto» deve sempre aggiungere roba, mai toglierne.
    for (let i = 1; i < TOXIC_LEVELS.length; i += 1) {
      const prima = TOXIC_LEVEL_SETTINGS[TOXIC_LEVELS[i - 1]];
      const dopo = TOXIC_LEVEL_SETTINGS[TOXIC_LEVELS[i]];

      expect(dopo.floaters).toBeGreaterThan(prima.floaters);
      expect(dopo.drips).toBeGreaterThan(prima.drips);
      expect(dopo.maxChatter).toBeGreaterThan(prima.maxChatter);
      expect(dopo.maxBubbles).toBeGreaterThan(prima.maxBubbles);
    }
  });
});

describe('ToxicLevelProvider e useToxicLevel', () => {
  it('parte dal livello dichiarato', () => {
    render(
      <ToxicLevelProvider defaultLevel="low">
        <Spia />
      </ToxicLevelProvider>,
    );

    expect(screen.getByTestId('spia')).toHaveTextContent('low');
  });

  it('senza un livello dichiarato parte da `high`, come la pagina di là', () => {
    render(
      <ToxicLevelProvider>
        <Spia />
      </ToxicLevelProvider>,
    );

    expect(screen.getByTestId('spia')).toHaveTextContent('high');
  });

  it('fuori dal provider dice che cosa manca, invece di rispondere un valore inventato', () => {
    // ⚠️ Un valore predefinito silenzioso qui sarebbe il difetto peggiore: il selettore
    // funzionerebbe, il fondale pure, e non si parlerebbero — ognuno col suo stato. L'errore
    // arriva al primo render e dice il nome del pezzo che manca.
    const errori = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Spia />)).toThrowError(/ToxicLevelProvider/);

    errori.mockRestore();
  });
});

describe('ToxicLevelSwitch', () => {
  const montaConSpia = (livello: ToxicLevel = 'high') =>
    render(
      <ToxicLevelProvider defaultLevel={livello}>
        <ToxicLevelSwitch label="Emissioni tossiche" />
        <Spia />
      </ToxicLevelProvider>,
    );

  it('è un gruppo di quattro opzioni che si escludono, non quattro interruttori', () => {
    montaConSpia();

    // ⚠️ `radiogroup` e non una barra di interruttori: chi legge con la voce sente «alto,
    // selezionato, 4 di 4» e sa che ce ne sono altri tre. Con dei `toggle` sentirebbe quattro
    // volte «non premuto», senza mai sapere quante scelte ha.
    expect(screen.getByRole('radiogroup', { name: 'Emissioni tossiche' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(TOXIC_LEVELS.length);
  });

  it('mostra selezionato il livello corrente', () => {
    montaConSpia('medium');

    expect(opzione(TOXIC_LEVEL_LABELS.medium)).toBeChecked();
    expect(opzione(TOXIC_LEVEL_LABELS.high)).not.toBeChecked();
  });

  it('sceglierne un altro lo fa leggere a chiunque stia sotto il provider', () => {
    montaConSpia('high');

    fireEvent.click(opzione(TOXIC_LEVEL_LABELS.low));

    expect(screen.getByTestId('spia')).toHaveTextContent('low');
    expect(opzione(TOXIC_LEVEL_LABELS.low)).toBeChecked();
  });

  it('si arriva a qualunque livello con una sola scelta, anche tornando indietro', () => {
    // ⚠️ È il motivo per cui il comando non è più il ciclo di RattInventario: da «alto» a
    // «basso» di là servivano tre pressioni, e la prima portava a `off`. Un comando che esiste
    // per **abbassare** il rumore non può costringere ad alzarlo.
    montaConSpia('high');

    fireEvent.click(opzione(TOXIC_LEVEL_LABELS.off));
    expect(screen.getByTestId('spia')).toHaveTextContent('off');

    fireEvent.click(opzione(TOXIC_LEVEL_LABELS.high));
    expect(screen.getByTestId('spia')).toHaveTextContent('high');
  });

  it('accetta altri nomi per i livelli, perché le parole non sono sue', () => {
    render(
      <ToxicLevelProvider defaultLevel="off">
        <ToxicLevelSwitch label="Fog" labels={{ off: 'none', low: 'light', medium: 'thick', high: 'pea soup' }} />
      </ToxicLevelProvider>,
    );

    expect(screen.getByRole('radio', { name: 'pea soup' })).toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: TOXIC_LEVEL_LABELS.high })).not.toBeInTheDocument();
  });
});
