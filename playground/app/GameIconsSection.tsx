import {
  AgeIcon,
  DifficultyIcon,
  DurationIcon,
  FollowedIcon,
  type IconProps,
  PlayersIcon,
  PublisherIcon,
  RatingIcon,
  TechLabel,
  TechRule,
} from 'plague-board-ui';
import type { ComponentType } from 'react';

/**
 * I sette attributi, con quello che si scrive accanto a ognuno in una scheda vera.
 *
 * ⚠️ I valori sono di un gioco inventato: qui si guardano i **segni**, e un titolo vero
 * porterebbe l'occhio sul titolo.
 */
const ATTRIBUTI: readonly { Icon: ComponentType<IconProps>; nome: string; valore: string }[] = [
  { Icon: PlayersIcon, nome: 'giocatori', valore: '2–5' },
  { Icon: DurationIcon, nome: 'durata', valore: '45–60 min' },
  { Icon: DifficultyIcon, nome: 'difficoltà', valore: 'media' },
  { Icon: RatingIcon, nome: 'valutazione', valore: '7,8' },
  { Icon: PublisherIcon, nome: 'editore', valore: 'Ludoratti Edizioni' },
  { Icon: AgeIcon, nome: 'età consigliata', valore: '10+' },
  { Icon: FollowedIcon, nome: 'seguito', valore: 'sì' },
];

// ⚠️ Stessa regola della tabella dei segni della peste: le colonne sono **larghe quanto l'icona
// più grande**, non `1fr`. Con `minmax(0, 1fr)` a 375px si stringono a ventun pixel e la riga
// etichettata «56PX» rende icone da ventuno, con l'attributo `width` ancora addosso.
const GRIGLIA = 'grid w-max items-end gap-3';
const COLONNE = { gridTemplateColumns: `5rem repeat(${ATTRIBUTI.length}, 3.5rem)` };

/**
 * La sezione della tavolozza dedicata ai sette attributi di gioco.
 *
 * ⚠️ Sta in un file suo perché la pagina era arrivata quasi a trecento righe — la stessa ragione
 * per cui `/profilo` ha `ChipsSection` e `/atmosfera` ha `GlitchSection`. Resta un componente
 * **server**: nessuna funzione attraversa il confine.
 */
export function GameIconsSection() {
  return (
    <>
      <TechRule>gli attributi di un gioco</TechRule>

      <p className="text-sm text-muted">
        Sette segni per i sette campi che una scheda di gioco mostra sempre. Non parlano di
        malattia: stanno accanto a <code>DiceIcon</code> e servono a far leggere una riga di dati a
        colpo d’occhio, dove il valore da solo sarebbe ambiguo —{' '}
        <strong>«2–5» può essere un numero di giocatori o un voto</strong>, e «Cranio Creations»
        l’editore o l’autore.
      </p>

      <div className="flex flex-col gap-3 rounded-xl border border-border p-6">
        {ATTRIBUTI.map(({ Icon, nome, valore }) => (
          <div key={nome} className="flex items-center gap-3 text-sm">
            <Icon size={20} className="shrink-0 text-brand-ink" />
            <span className="w-36 shrink-0 text-muted">{nome}</span>
            <span className="font-medium">{valore}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="flex flex-col gap-3">
          <div className={GRIGLIA} style={COLONNE}>
            <span />
            {ATTRIBUTI.map(({ nome }) => (
              <TechLabel key={nome} className="text-center text-muted">
                {nome.slice(0, 7)}
              </TechLabel>
            ))}
          </div>
          {[56, 24, 20, 16, 12].map((size) => (
            <div key={size} className={GRIGLIA} style={COLONNE}>
              <TechLabel className="text-muted">{size}px</TechLabel>
              {ATTRIBUTI.map(({ Icon, nome }) => (
                <span key={nome} className="flex justify-center">
                  <Icon size={size} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted">
        ⚠️ <strong>La riga da guardare è quella da 16</strong>, perché è la misura a cui si usano:
        in una scheda stanno accanto a un testo piccolo. È anche il motivo per cui sono tutti a{' '}
        <strong>campitura</strong> e nessuno a tratto — un tratto da 2 su una griglia da 24, a
        16px, è un pixel e un terzo, e i disegni a tratto di questa libreria sono infatti quelli col
        limite più basso: il bacillo si ferma a 20, il cocco a 24.
      </p>

      <p className="text-sm text-muted">
        A 12 tre di loro perdono il dettaglio interno e vanno usati sapendolo:{' '}
        <code>PlayersIcon</code> chiude le due teste in una, <code>PublisherIcon</code> chiude le
        finestre, <code>DurationIcon</code> chiude il quadrante. Restano sagome giuste, ma dicono
        meno.
      </p>

      <p className="text-sm text-muted">
        ⚠️ <strong>Il nome dice il mestiere, non il disegno.</strong> <code>DurationIcon</code> rende
        un cronometro e <code>RatingIcon</code> una stella: è l’unico gruppo della libreria nominato
        così, perché è l’unico in cui il segno esiste per marcare un campo — chi lo monta cerca
        «l’icona della durata», non «il cronometro».
      </p>

      <p className="text-sm text-muted">
        ⚠️ <strong>Restano sostituibili</strong>, come ogni icona qui: portano <code>IconProps</code>
        , quindi un’applicazione che ha già le sue — Lucide, per dire — le passa al componente che
        le mostra e non cambia nient’altro. Quello che la libreria dà è la{' '}
        <strong>predefinita</strong>, non l’obbligo.
      </p>
    </>
  );
}
