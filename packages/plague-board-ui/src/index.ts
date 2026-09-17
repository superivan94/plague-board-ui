// L'unico punto d'ingresso pubblico della libreria: quello che non passa di qui non esiste per chi
// installa il pacchetto. I due fogli di stile si importano a parte —
// `plague-board-ui/theme.css` e `plague-board-ui/animations.css` — perché un CSS importato da un
// modulo costringerebbe ogni consumatore ad avere un bundler che sa gestirlo.
//
// ⚠️ Gli export si scrivono **uno per uno**, mai con `export *`: questo file è l'elenco della
// superficie pubblica, e un asterisco lo renderebbe una domanda invece che una risposta.

// I segni del marchio: le cose che dicono «Ludoratti» senza essere un'applicazione.
export { PlagueBar, type PlagueBarProps } from './brand/PlagueBar';
// ⚠️ Le misure **non** escono da `PlagueBar.tsx`, che dichiara `'use client'`: un dato esportato
// da un modulo client arriva a una pagina server come riferimento, e chi lo indicizza ottiene
// `undefined` senza che niente diventi rosso. Il perché per esteso sta in `plagueBarSizes.ts`.
export { PLAGUE_BAR_MARK_SIZE, type PlagueBarSize } from './brand/plagueBarSizes';
export { PulseDot, type PulseDotProps } from './brand/PulseDot';
// Il personaggio, non il marchio: `RatIcon` è l'emblema, questo è il ratto che cammina.
export { RAT_LIVERIES, Rat, type RatLivery, type RatProps } from './brand/Rat';
// La faccia di marca. ⚠️ Il disegno sta in un modulo a parte e pesa 25,8 KB di base64: chi non
// importa `RatMascot` non se lo porta dietro, perché il pacchetto è `sideEffects: ["*.css"]`.
export { RatMascot, type RatMascotProps } from './brand/RatMascot';
export {
  RAT_MASCOT_HEIGHT,
  RAT_MASCOT_SRC,
  RAT_MASCOT_WIDTH,
} from './assets/ratMascotImage';
export { SpeechBubble, type SpeechBubbleProps } from './brand/SpeechBubble';
export { TalkingMascot, type TalkingMascotProps } from './brand/TalkingMascot';
export { TechLabel, type TechLabelProps } from './brand/TechLabel';
export { TechRule, type TechRuleProps } from './brand/TechRule';

// Le icone. `IconProps` è pubblico perché è il contratto che deve rispettare chi sostituisce
// l'icona predefinita di un componente con la propria.
export { BiohazardIcon } from './icons/BiohazardIcon';
export { CodeIcon } from './icons/CodeIcon';
export { MoleculeIcon } from './icons/MoleculeIcon';
export { PoisonIcon } from './icons/PoisonIcon';
export { RatIcon } from './icons/RatIcon';
export { RobotIcon } from './icons/RobotIcon';
export { SkullIcon } from './icons/SkullIcon';
export { SparklesIcon } from './icons/SparklesIcon';
export { VirusIcon } from './icons/VirusIcon';
export type { IconProps } from './icons/types';

// Il meccanismo, e i dati che gli si danno da mangiare: due moduli, perché chi vuole la voce dei
// Ludoratti e chi vuole solo il sorteggio sono due persone diverse.
export { useRandomPhrase, type RandomPhrase } from './hooks/useRandomPhrase';
export { DEV_PHRASES, RAT_PHRASES } from './data/phrases';
