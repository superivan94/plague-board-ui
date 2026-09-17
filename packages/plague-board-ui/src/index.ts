// L'unico punto d'ingresso pubblico della libreria: quello che non passa di qui non esiste per chi
// installa il pacchetto. I due fogli di stile si importano a parte —
// `plague-board-ui/theme.css` e `plague-board-ui/animations.css` — perché un CSS importato da un
// modulo costringerebbe ogni consumatore ad avere un bundler che sa gestirlo.
//
// ⚠️ Gli export si scrivono **uno per uno**, mai con `export *`: questo file è l'elenco della
// superficie pubblica, e un asterisco lo renderebbe una domanda invece che una risposta.

// I segni del marchio: le cose che dicono «Ludoratti» senza essere un'applicazione.
export { PlagueBar, type PlagueBarProps } from './brand/PlagueBar';
export { PulseDot, type PulseDotProps } from './brand/PulseDot';
export { TechLabel, type TechLabelProps } from './brand/TechLabel';

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
