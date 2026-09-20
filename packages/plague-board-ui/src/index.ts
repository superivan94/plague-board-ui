// L'unico punto d'ingresso pubblico della libreria: quello che non passa di qui non esiste per chi
// installa il pacchetto. I due fogli di stile si importano a parte —
// `plague-board-ui/theme.css` e `plague-board-ui/animations.css` — perché un CSS importato da un
// modulo costringerebbe ogni consumatore ad avere un bundler che sa gestirlo.
//
// ⚠️ Gli export si scrivono **uno per uno**, mai con `export *`: questo file è l'elenco della
// superficie pubblica, e un asterisco lo renderebbe una domanda invece che una risposta.

// I segni del marchio: le cose che dicono «Ludoratti» senza essere un'applicazione.
// La riga che non va a capo: la usano la barra in cima e il piede in fondo, e per questo non sta
// dentro nessuna delle due.
export { BarRow, type BarRowProps } from './brand/BarRow';
export { CreditCard, type CreditAuthor, type CreditCardProps } from './brand/CreditCard';
export { CreditLine, type CreditLineProps } from './brand/CreditLine';
export { HoverEmitter, type HoverEmitterProps } from './brand/HoverEmitter';
// ⚠️ Le tarature stanno in un modulo **senza** `'use client'`, e non per simmetria con
// `plagueBarSizes.ts`: una pagina server deve poter chiamare `binaryRain()` e passare il risultato
// all'emettitore, che è client. Per questo dentro non c'è nessuna funzione — solo numeri e parole.
export { binaryRain, comicBubbles, type HoverEffect } from './brand/hoverEffects';
// Lo scoppio di segni: sta accanto all'emettitore perché è l'altro modo di far volare qualcosa —
// quello si accende finché lo sfiori, questo parte una volta sola quando glielo chiedi.
export { ParticleBurst, type ParticleBurstHandle, type ParticleBurstProps } from './brand/ParticleBurst';
// L'atmosfera: il fondale che avvolge una pagina, le bolle che ci salgono dentro, e il comando che
// dice quanta ce ne deve essere. Si parlano attraverso il provider, che è l'unico contesto della
// libreria — vedi `ToxicLevelProvider` per il perché.
export { PlagueBackground, type PlagueBackgroundProps } from './brand/PlagueBackground';
export { PlagueBar, type PlagueBarPlacement, type PlagueBarProps } from './brand/PlagueBar';
// Il piede già montato. I suoi pezzi restano pubblici: chi ne vuole uno diverso se lo compone.
export { PlagueFootBar, type PlagueFootBarProps } from './brand/PlagueFootBar';
// ⚠️ Le misure **non** escono da `PlagueBar.tsx`, che dichiara `'use client'`: un dato esportato
// da un modulo client arriva a una pagina server come riferimento, e chi lo indicizza ottiene
// `undefined` senza che niente diventi rosso. Il perché per esteso sta in `plagueBarSizes.ts`.
// ⚠️ E accanto a ogni numero esce la sua **classe**: un numero non risponde a una media query,
// quindi un marchio dentro una barra che si compatta sul telefono ha bisogno di tutt'e due.
export {
  PLAGUE_BAR_MARK_CLASS,
  PLAGUE_BAR_MARK_SIZE,
  PLAGUE_FOOT_MARK_CLASS,
  PLAGUE_FOOT_MARK_SIZE,
  type PlagueBarSize,
} from './brand/plagueBarSizes';
// L'audio di fondo, nella stessa forma del livello tossico: un provider che tiene la traccia, e i
// comandi che la governano da dove vuole chi monta la pagina.
// ⚠️ La traccia **non** viaggia col pacchetto — `LudoRatti.mp3` pesa 2,1 MB — quindi il provider
// riceve un indirizzo e il file lo serve chi installa.
export { MusicProvider, useMusic, type MusicProviderProps, type MusicValue } from './brand/MusicProvider';
export { MusicToggle, type MusicToggleProps } from './brand/MusicToggle';
export { MusicVolume, type MusicVolumeProps } from './brand/MusicVolume';
// Il pulsare che mette l'occhio su un comando. ⚠️ Niente a che vedere con `PulseDot`, che è un
// pallino di stato: questo avvolge, quello marca.
export { PlaguePulse, type PlaguePulseProps } from './brand/PlaguePulse';
export { PulseDot, type PulseDotProps } from './brand/PulseDot';
// Il personaggio, non il marchio: `RatIcon` è l'emblema, questo è il ratto che cammina.
export { RAT_LIVERIES, Rat, type RatLivery, type RatProps } from './brand/Rat';
export { RatRun, type RatRunProps } from './brand/RatRun';
// Il caso — quanti ratti, ogni quanto, con che cosa addosso — sta qui e non in `RatRun`.
export { RatSwarm, type RatSwarmHandle, type RatSwarmProps } from './brand/RatSwarm';
// La faccia di marca. ⚠️ Il disegno sta in un modulo a parte e pesa 25,8 KB di base64: chi non
// importa `RatMascot` non se lo porta dietro, perché il pacchetto è `sideEffects: ["*.css"]`.
export { RatMascot, type RatMascotProps } from './brand/RatMascot';
export {
  RAT_MASCOT_HEIGHT,
  RAT_MASCOT_SRC,
  RAT_MASCOT_WIDTH,
} from './assets/ratMascotImage';
export { SpeechBubble, type SpeechBubbleProps } from './brand/SpeechBubble';
export { SupportButton, type SupportButtonProps } from './brand/SupportButton';
export { TalkingMascot, type TalkingMascotProps } from './brand/TalkingMascot';
export { TechLabel, type TechLabelProps } from './brand/TechLabel';
export { TechRule, type TechRuleProps } from './brand/TechRule';
export { ToxicBubbles } from './brand/ToxicBubbles';
// ⚠️ La scala sta in un modulo **senza** `'use client'`, come le misure della barra: le tabelle le
// indicizza anche una pagina server, e un dato esportato da un modulo client le arriverebbe come
// riferimento — cioè `undefined`, in silenzio.
export {
  TOXIC_LEVELS,
  TOXIC_LEVEL_LABELS,
  TOXIC_LEVEL_SETTINGS,
  type ToxicLevel,
  type ToxicLevelSettings,
} from './brand/toxicLevel';
export {
  ToxicLevelProvider,
  useToxicLevel,
  type ToxicLevelProviderProps,
  type ToxicLevelValue,
} from './brand/ToxicLevelProvider';
export { ToxicLevelSwitch, type ToxicLevelSwitchProps } from './brand/ToxicLevelSwitch';
export { VersionTag, type VersionTagProps } from './brand/VersionTag';

// Le icone. `IconProps` è pubblico perché è il contratto che deve rispettare chi sostituisce
// l'icona predefinita di un componente con la propria.
export { BiohazardIcon } from './icons/BiohazardIcon';
export { CodeIcon } from './icons/CodeIcon';
// ⚠️ L'unica icona che non è quadrata, e l'unica che porta un'altezza sua: una goccia è alta due
// volte e mezzo tanto, e cadendo si allunga ancora.
export { DripIcon, type DripIconProps } from './icons/DripIcon';
export { MoleculeIcon } from './icons/MoleculeIcon';
export { PoisonIcon } from './icons/PoisonIcon';
export { PotionMugIcon } from './icons/PotionMugIcon';
export { RatIcon } from './icons/RatIcon';
export { RobotIcon } from './icons/RobotIcon';
export { SkullIcon } from './icons/SkullIcon';
// I due stati della musica: lo stesso teschio con le cuffie, uno con la sbarra.
export { SkullPhonesIcon } from './icons/SkullPhonesIcon';
export { SkullPhonesOffIcon } from './icons/SkullPhonesOffIcon';
export { SparklesIcon } from './icons/SparklesIcon';
export { VirusIcon } from './icons/VirusIcon';
export type { IconProps } from './icons/types';

// Il meccanismo, e i dati che gli si danno da mangiare: due moduli, perché chi vuole la voce dei
// Ludoratti e chi vuole solo il sorteggio sono due persone diverse.
export { useRandomPhrase, type RandomPhrase } from './hooks/useRandomPhrase';
// ⚠️ Quasi tutto rispetta «meno movimento» da solo, con una regola in `animations.css`. Questo
// gancio è per l'altro caso: decidere **se** mettere al mondo qualcosa — è ciò che fa `RatSwarm` —
// e poter dire a chi guarda perché una decorazione non c'è.
export { useReducedMotion } from './hooks/useReducedMotion';
export { DEV_PHRASES, RAT_PHRASES } from './data/phrases';

// Gli estremi fra cui si pesca: uno solo per tutta la libreria, perché lo sciame e l'emettitore
// fanno la stessa cosa con numeri diversi.
export type { RandomRange } from './randomRange';
