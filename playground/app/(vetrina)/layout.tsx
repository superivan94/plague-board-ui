import {
  CodeIcon,
  DEV_PHRASES,
  PLAGUE_FOOT_MARK_CLASS,
  PLAGUE_FOOT_MARK_SIZE,
  PlagueFootBar,
  RobotIcon,
  binaryRain,
  comicBubbles,
  type CreditAuthor,
} from 'plague-board-ui';

import { PlaygroundNav } from '../PlaygroundNav';
import { PageStories } from './PageStories';
import pacchetto from '../../../packages/plague-board-ui/package.json';

// ⚠️ La versione si **legge** dal `package.json` della libreria invece di essere scritta a mano:
// un numero copiato in un piede è un numero che resta indietro, e nessuno se ne accorge.
const VERSIONE = pacchetto.version;

// ⚠️ I due autori hanno due easter egg **diversi**, come in RattInventario: l'umano pensa, l'AI
// piove cifre. Sono due tarature passate dall'applicazione, quindi la libreria non ha dovuto
// decidere quale dei due fosse l'umano.
// ⚠️ E il colore è il lime grezzo, non `brand-ink`: la lastra del piede è un'isola scura nei due
// temi, quindi qui dentro vale il contrasto sul nero.
// ⚠️ E la misura dei due segni si chiede alla libreria invece di scriverla: il piede è `small`,
// quindi 14 px. Prima erano 16 scritti a mano, cioè la misura della taglia `medium`. La classe
// accanto al numero è l'altra metà del patto — un piede che sul telefono torna `small` deve poter
// rimpicciolire anche i segni che gli arrivano da fuori, e un `width` già stampato non risponde a
// una media query.
const AUTORI: readonly CreditAuthor[] = [
  {
    name: 'Superivan94',
    icon: (
      <CodeIcon
        size={PLAGUE_FOOT_MARK_SIZE.small.authorMark}
        className={`text-brand ${PLAGUE_FOOT_MARK_CLASS.small.authorMark}`}
      />
    ),
    href: 'https://ludoratti.it',
    effect: comicBubbles(DEV_PHRASES),
  },
  {
    name: 'AI-Dev',
    icon: (
      <RobotIcon
        size={PLAGUE_FOOT_MARK_SIZE.small.authorMark}
        className={`text-plague-400 ${PLAGUE_FOOT_MARK_CLASS.small.authorMark}`}
      />
    ),
    effect: { ...binaryRain(), className: 'pb-binary-digit text-plague-400' },
  },
];

/**
 * Le pagine che si leggono: la barra in cima, il piede in fondo.
 *
 * ⚠️ **Sta in un route group e non nel layout radice** perché le cornici delle storie non le
 * vogliono: una cornice è una variante sola dentro un iframe, e una barra e un piede lì dentro
 * sarebbero due componenti che non c'entrano, alla larghezza del telefono. Il gruppo non cambia
 * nessun indirizzo — `(vetrina)` non compare nel percorso.
 */
export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PlaygroundNav />
      <div className="flex-1">
        {children}
        <PageStories />
      </div>
      <PlagueFootBar authors={AUTORI} version={VERSIONE} supportHref="https://ko-fi.com/superivan94" />
    </>
  );
}
