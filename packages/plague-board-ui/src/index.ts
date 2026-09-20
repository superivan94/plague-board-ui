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
// Il disturbo sul nome: il terzo pezzo del registro «futuro distopico» dell'aggregatore, dopo la
// città e le gocce che stanno dentro `PlagueBackground`. ⚠️ Sta **fuori** dal fondale perché non
// è scenografia: va addosso a un titolo, e quel titolo lo scrive l'applicazione.
export { GlitchText, type GlitchTextProps } from './brand/GlitchText';
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
// La schermata di accesso, scomposta. ⚠️ È una superficie **condivisa**: tutte e quattro le
// applicazioni dei Ludoratti entrano con un account Google, e oggi ognuna se l'è disegnata da sé.
// Quello che resta fuori sono i testi e l'autenticazione — la libreria non sa che cosa sia
// Firebase, e chi la usa passa la funzione che accede davvero.
export { GoogleSignInButton, type GoogleSignInButtonProps } from './brand/GoogleSignInButton';
export { PlagueDivider, type PlagueDividerProps } from './brand/PlagueDivider';
// ⚠️ L'unico componente della libreria che ne compone altri, e il solo posto in cui ha senso: la
// schermata intera. Chi ne vuole una diversa prende i pezzi qui sopra, che non sanno di lei.
export { LoginScreen, type LoginScreenProps } from './brand/LoginScreen';

// L'audio di fondo, nella stessa forma del livello tossico: un provider che tiene la traccia, e i
// comandi che la governano da dove vuole chi monta la pagina.
// ⚠️ La traccia viaggia col pacchetto, in `assets/`, e l'indirizzo lo risolve il bundler di chi
// installa: vedi `LUDORATTI_TRACK_URL`. Chi ne vuole un'altra passa `src`.
export { MusicProvider, useMusic, type MusicProviderProps, type MusicValue } from './brand/MusicProvider';
export { LUDORATTI_TRACK_URL } from './assets/ludorattiTrack';
export { MusicToggle, type MusicToggleProps } from './brand/MusicToggle';
export { MusicVolume, type MusicVolumeProps } from './brand/MusicVolume';
// I pezzi della scheda del profilo, tutti e tre **sopra** un componente di HeroUI: l'avatar sopra
// `Avatar` + `Badge`, la pastiglia sopra `Chip`, il pannello sopra `Card`. ⚠️ I nomi dei gradi e i
// loro colori restano all'applicazione: qui c'è il vestito, non il modello di abbonamento.
export {
  PLAGUE_AVATAR_SIZE,
  PlagueAvatar,
  type PlagueAvatarProps,
  type PlagueAvatarSize,
} from './brand/PlagueAvatar';
export { PlaguePanel, type PlaguePanelProps } from './brand/PlaguePanel';
export { ThematicBadge, type ThematicBadgeColor, type ThematicBadgeProps } from './brand/ThematicBadge';
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
// ⚠️ I due batteri, e **nessuno dei due si chiama `BacteriaIcon`**: hanno due forme, quindi un
// nome generico dovrebbe sceglierne una e chi lo importasse si ritroverebbe l'altra. Il bacillo ha
// un verso e si mette accanto a una parola; il cocco non ce l'ha e galleggia in un fondale.
export { BacillusIcon } from './icons/BacillusIcon';
export { BiohazardIcon } from './icons/BiohazardIcon';
// La cappa di smog dell'aggregatore: si usa grande e tenue, dietro tutto, non accanto a un testo.
export { CloudIcon } from './icons/CloudIcon';
export { CoccusIcon } from './icons/CoccusIcon';
export { CodeIcon } from './icons/CodeIcon';
// L'unica icona della libreria che non parla di malattia: è il terzo termine, il gioco.
export { DiceIcon } from './icons/DiceIcon';
// ⚠️ L'unica icona che non è quadrata, e l'unica che porta un'altezza sua: una goccia è alta due
// volte e mezzo tanto, e cadendo si allunga ancora.
export { DripIcon, type DripIconProps } from './icons/DripIcon';
// ⚠️ L'unica icona che non è nostra e l'unica che **non si tinge**: `GoogleIconProps` è `IconProps`
// meno `color`, perché le linee guida di Google pretendono il marchio così com'è. Il tipo esce di
// qui apposta — è lui a fermare in compilazione chi prova a uniformarla alle altre.
export { GoogleIcon, type GoogleIconProps } from './icons/GoogleIcon';
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
// Il lessico: le parole di casa, ognuna accanto a quella generica che sostituisce. È un dato come
// le frasi — chi vuole la voce dei Ludoratti lo applica, chi non la vuole lo ignora.
export { LUDORATTI_COPY, type LudorattiTerm, type LudorattiTermKey } from './data/copy';

// Gli estremi fra cui si pesca: uno solo per tutta la libreria, perché lo sciame e l'emettitore
// fanno la stessa cosa con numeri diversi.
export type { RandomRange } from './randomRange';
