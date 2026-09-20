import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * Il corpo: una capsula obliqua, cioè due lati paralleli e due calotte tonde.
 *
 * Sta sulla diagonale e non dritta perché una capsula orizzontale dentro un quadrato è una
 * pastiglia da mandare giù, e una verticale è una batteria. Obliqua è una cosa che **nuota**.
 */
const BACILLUS_BODY =
  'M7.01 12.61L13.61 6.01a3.1 3.1 0 0 1 4.38 4.38L11.39 16.99a3.1 3.1 0 0 1-4.38-4.38Z';

/**
 * I quattro flagelli, **due per polo**.
 *
 * ⚠️ **Tutti dalla stessa parte non funzionano**: tre code appaiate sotto una capsula sono lo
 * scappamento di un razzo, o il bastoncino di un ghiacciolo — provato e guardato. Divisi fra i due
 * capi diventano peli, e il corpo torna a essere un corpo.
 */
const BACILLUS_FLAGELLA =
  'M7.2 16.8c-1.2 1.1-0.7 2.4-2 3.5' +
  'M6.2 13.9c-1.4-0.2-2.2 1-3.6 0.8' +
  'M17.6 6.4c1.2-1.1 0.6-2.3 1.9-3.4' +
  'M18.4 9.2c1.4 0.2 2-1 3.4-0.9';

/** I tre granuli in fila dentro il corpo. Senza, la capsula resta una capsula: una pillola. */
const BACILLUS_GRAINS = [
  { cx: 10.6, cy: 12.6, r: 0.85 },
  { cx: 12.6, cy: 11.2, r: 0.7 },
  { cx: 14.8, cy: 9.2, r: 0.85 },
];

/**
 * **Il bacillo**: il batterio a bastoncino, coi granuli in fila e i flagelli ai due capi.
 *
 * È il contagio che si mette **accanto a una parola**: ha un verso, quindi non si confonde con
 * niente in una riga di icone tutte tonde — molecola, virus e biohazard lo sono — ed è l'unico che
 * a 24 si legge ancora, perché il corpo è una massa sola invece di un intreccio di tratti sottili.
 * Il suo gemello tondo è {@link CoccusIcon}, che di versi non ne ha e per questo galleggia meglio
 * in un fondale.
 *
 * ⚠️ **Non esiste un `BacteriaIcon`, ed è voluto.** I batteri della libreria sono due e hanno due
 * forme: un nome generico dovrebbe sceglierne una, e chi lo importasse si ritroverebbe l'altra.
 * Su `ludoratti.it` quel nome ce l'ha il cocco, che però lì è disegnato coi raggi dritti — cioè un
 * sole.
 *
 * ⚠️ **Non scende sotto i 20px.** Sotto, i flagelli si saldano al corpo e i tre granuli si chiudono
 * in uno: resta una capsula obliqua, che è una pillola.
 */
export function BacillusIcon(props: IconProps) {
  return (
    <IconBase {...props} paint="stroke">
      <path d={BACILLUS_BODY} />
      <path d={BACILLUS_FLAGELLA} />
      {BACILLUS_GRAINS.map((grain) => (
        // Pieni dentro un disegno a tratto, come le orecchie del marchio: il colore arriva da
        // `currentColor` e si tingono insieme al resto.
        <circle key={grain.cx} {...grain} fill="currentColor" stroke="none" />
      ))}
    </IconBase>
  );
}
