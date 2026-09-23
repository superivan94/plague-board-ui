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
export { BarRow, type BarRowProps } from './brand/BarRow.js';
// La riga di pastiglie che ne mostra poche e si apre. ⚠️ Non disegna niente: le pastiglie gliele
// passa chi lo monta, perché il colore di un tag è dell'applicazione. Lui conta e nasconde.
export { CountedChips, type CountedChipsProps } from './brand/CountedChips.js';
export { CreditCard, type CreditAuthor, type CreditCardProps } from './brand/CreditCard.js';
export { CreditLine, type CreditLineProps } from './brand/CreditLine.js';
// Il disturbo sul nome: il terzo pezzo del registro «futuro distopico» dell'aggregatore, dopo la
// città e le gocce che stanno dentro `PlagueBackground`. ⚠️ Sta **fuori** dal fondale perché non
// è scenografia: va addosso a un titolo, e quel titolo lo scrive l'applicazione.
export { GlitchText, type GlitchTextProps } from './brand/GlitchText.js';
export { HoverEmitter, type HoverEmitterProps } from './brand/HoverEmitter.js';
// ⚠️ Le tarature stanno in un modulo **senza** `'use client'`, e non per simmetria con
// `plagueBarSizes.ts`: una pagina server deve poter chiamare `binaryRain()` e passare il risultato
// all'emettitore, che è client. Per questo dentro non c'è nessuna funzione — solo numeri e parole.
export { binaryRain, comicBubbles, type HoverEffect } from './brand/hoverEffects.js';
// Lo scoppio di segni: sta accanto all'emettitore perché è l'altro modo di far volare qualcosa —
// quello si accende finché lo sfiori, questo parte una volta sola quando glielo chiedi.
export { ParticleBurst, type ParticleBurstHandle, type ParticleBurstProps } from './brand/ParticleBurst.js';
// L'atmosfera: il fondale che avvolge una pagina, le bolle che ci salgono dentro, e il comando che
// dice quanta ce ne deve essere. Si parlano attraverso il provider, che è l'unico contesto della
// libreria — vedi `ToxicLevelProvider` per il perché.
export { PlagueBackground, type PlagueBackgroundProps } from './brand/PlagueBackground.js';
export { PlagueBar, type PlagueBarProps } from './brand/PlagueBar.js';
// Il piede già montato. I suoi pezzi restano pubblici: chi ne vuole uno diverso se lo compone.
export { PlagueFootBar, type PlagueFootBarProps } from './brand/PlagueFootBar.js';
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
  type PlagueBarPlacement,
  type PlagueBarSize,
} from './brand/plagueBarSizes.js';
// La schermata di accesso, scomposta. ⚠️ È una superficie **condivisa**: tutte e quattro le
// applicazioni dei Ludoratti entrano con un account Google, e oggi ognuna se l'è disegnata da sé.
// Quello che resta fuori sono i testi e l'autenticazione — la libreria non sa che cosa sia
// Firebase, e chi la usa passa la funzione che accede davvero.
export { GoogleSignInButton, type GoogleSignInButtonProps } from './brand/GoogleSignInButton.js';
export { PlagueDivider, type PlagueDividerProps } from './brand/PlagueDivider.js';
// ⚠️ L'unico componente della libreria che ne compone altri, e il solo posto in cui ha senso: la
// schermata intera. Chi ne vuole una diversa prende i pezzi qui sopra, che non sanno di lei.
export { LoginScreen, type LoginScreenProps } from './brand/LoginScreen.js';

// L'audio di fondo, nella stessa forma del livello tossico: un provider che tiene la traccia, e i
// comandi che la governano da dove vuole chi monta la pagina.
// ⚠️ La traccia viaggia col pacchetto, in `assets/`, e l'indirizzo lo risolve il bundler di chi
// installa: vedi `LUDORATTI_TRACK_URL`. Chi ne vuole un'altra passa `src`.
export { MusicProvider, useMusic, type MusicProviderProps, type MusicValue } from './brand/MusicProvider.js';
export { LUDORATTI_TRACK_URL } from './assets/ludorattiTrack.js';
export { MusicToggle, type MusicToggleProps } from './brand/MusicToggle.js';
export { MusicVolume, type MusicVolumeProps } from './brand/MusicVolume.js';
// I pezzi della scheda del profilo, tutti e tre **sopra** un componente di HeroUI: l'avatar sopra
// `Avatar` + `Badge`, la pastiglia sopra `Chip`, il pannello sopra `Card`. ⚠️ I nomi dei gradi e i
// loro colori restano all'applicazione: qui c'è il vestito, non il modello di abbonamento.
export {
  PLAGUE_AVATAR_SIZE,
  PlagueAvatar,
  type PlagueAvatarProps,
  type PlagueAvatarSize,
} from './brand/PlagueAvatar.js';
export { PlaguePanel, type PlaguePanelProps } from './brand/PlaguePanel.js';
export { ThematicBadge, type ThematicBadgeColor, type ThematicBadgeProps } from './brand/ThematicBadge.js';
// Il pulsare che mette l'occhio su un comando. ⚠️ Niente a che vedere con `PulseDot`, che è un
// pallino di stato: questo avvolge, quello marca.
export { PlaguePulse, type PlaguePulseProps } from './brand/PlaguePulse.js';
export { PulseDot, type PulseDotProps } from './brand/PulseDot.js';
// Gli stati che ogni applicazione mostra più spesso — l'attesa, il vuoto, la conferma, l'avviso —
// trovati nel giro delle due app del 2026-09-23: ci sono in tutte e due, e in nessuna erano a tema.
// ⚠️ Stanno tutti **sopra** un pezzo di HeroUI, come la scheda del profilo; qui c'è l'aspetto.
export { PlagueLoader, type PlagueLoaderProps, type PlagueLoaderVariant } from './brand/PlagueLoader.js';
// Il personaggio, non il marchio: `RatIcon` è l'emblema, questo è il ratto che cammina.
export { RAT_LIVERIES, Rat, type RatLivery, type RatProps } from './brand/Rat.js';
export { RatRun, type RatRunProps } from './brand/RatRun.js';
// Il caso — quanti ratti, ogni quanto, con che cosa addosso — sta qui e non in `RatRun`.
export { RatSwarm, type RatSwarmHandle, type RatSwarmProps } from './brand/RatSwarm.js';
// La faccia di marca. ⚠️ Il disegno sta in un modulo a parte e pesa 25,8 KB di base64: chi non
// importa `RatMascot` non se lo porta dietro, perché il pacchetto è `sideEffects: ["*.css"]`.
export { RatMascot, type RatMascotProps } from './brand/RatMascot.js';
export {
  RAT_MASCOT_HEIGHT,
  RAT_MASCOT_SRC,
  RAT_MASCOT_WIDTH,
} from './assets/ratMascotImage.js';
export { SpeechBubble, type SpeechBubbleProps } from './brand/SpeechBubble.js';
export { SupportButton, type SupportButtonProps } from './brand/SupportButton.js';
export { TalkingMascot, type TalkingMascotProps } from './brand/TalkingMascot.js';
export { TechLabel, type TechLabelProps } from './brand/TechLabel.js';
export { TechRule, type TechRuleProps } from './brand/TechRule.js';
export { ToxicBubbles } from './brand/ToxicBubbles.js';
// ⚠️ La scala sta in un modulo **senza** `'use client'`, come le misure della barra: le tabelle le
// indicizza anche una pagina server, e un dato esportato da un modulo client le arriverebbe come
// riferimento — cioè `undefined`, in silenzio.
export {
  TOXIC_LEVELS,
  TOXIC_LEVEL_LABELS,
  TOXIC_LEVEL_SETTINGS,
  type ToxicLevel,
  type ToxicLevelOverrides,
  type ToxicLevelSettings,
} from './brand/toxicLevel.js';
export {
  ToxicLevelProvider,
  useToxicLevel,
  type ToxicLevelProviderProps,
  type ToxicLevelValue,
} from './brand/ToxicLevelProvider.js';
export { ToxicLevelSwitch, type ToxicLevelSwitchProps } from './brand/ToxicLevelSwitch.js';
export { VersionTag, type VersionTagProps } from './brand/VersionTag.js';

// Le icone. `IconProps` è pubblico perché è il contratto che deve rispettare chi sostituisce
// l'icona predefinita di un componente con la propria.
// ⚠️ I due batteri, e **nessuno dei due si chiama `BacteriaIcon`**: hanno due forme, quindi un
// nome generico dovrebbe sceglierne una e chi lo importasse si ritroverebbe l'altra. Il bacillo ha
// un verso e si mette accanto a una parola; il cocco non ce l'ha e galleggia in un fondale.
export { BacillusIcon } from './icons/BacillusIcon.js';
export { BiohazardIcon } from './icons/BiohazardIcon.js';
// La cappa di smog dell'aggregatore: si usa grande e tenue, dietro tutto, non accanto a un testo.
export { CloudIcon } from './icons/CloudIcon.js';
export { CoccusIcon } from './icons/CoccusIcon.js';
export { CodeIcon } from './icons/CodeIcon.js';
// L'unica icona della libreria che non parla di malattia: è il terzo termine, il gioco.
export { DiceIcon } from './icons/DiceIcon.js';
// ⚠️ L'unica icona che non è quadrata, e l'unica che porta un'altezza sua: una goccia è alta due
// volte e mezzo tanto, e cadendo si allunga ancora.
export { DripIcon, type DripIconProps } from './icons/DripIcon.js';
// ⚠️ L'unica icona che non è nostra e l'unica che **non si tinge**: `GoogleIconProps` è `IconProps`
// meno `color`, perché le linee guida di Google pretendono il marchio così com'è. Il tipo esce di
// qui apposta — è lui a fermare in compilazione chi prova a uniformarla alle altre.
export { GoogleIcon, type GoogleIconProps } from './icons/GoogleIcon.js';
export { MoleculeIcon } from './icons/MoleculeIcon.js';
export { PoisonIcon } from './icons/PoisonIcon.js';
export { PotionMugIcon } from './icons/PotionMugIcon.js';
// ⚠️ Il marchio, e l'unica icona con un **contratto suo** oltre a `IconProps`: ha due stati — il
// cuore vuoto e quello pieno, cioè anche i preferiti — e un battito che governa da sé. La deroga
// alla regola «l'interruttore sta su chi monta» è dichiarata nel suo file: un marchio che batte è
// identità, non decorazione.
export {
  RAT_ICON_MUZZLE_FLOOR,
  RatIcon,
  type RatIconBeat,
  type RatIconMuzzle,
  type RatIconProps,
  type RatIconState,
} from './icons/RatIcon.js';
export { RobotIcon } from './icons/RobotIcon.js';
export { SkullIcon } from './icons/SkullIcon.js';
// I due stati della musica: lo stesso teschio con le cuffie, uno con la sbarra.
export { SkullPhonesIcon } from './icons/SkullPhonesIcon.js';
export { SkullPhonesOffIcon } from './icons/SkullPhonesOffIcon.js';
export { SparklesIcon } from './icons/SparklesIcon.js';
export { VirusIcon } from './icons/VirusIcon.js';
export type { IconProps } from './icons/types.js';
// ⚠️ L'involucro, e l'unico pezzo della libreria che serve a disegnare **fuori** di lei. Esce
// perché il confine qui sotto ha un rovescio: se i segni di un dominio non entrano, chi ne ha
// bisogno se li disegna in casa propria — e senza questo componente ricopierebbe il nostro `<svg>`
// con dentro la griglia, `currentColor` e la regola su `title`, cioè le tre cose che rendono
// un'icona **nostra**. Il contratto che promettiamo è `IconBaseProps`: quattro prop che dipendono
// dal disegno, non da chi lo monta.
export { IconBase, type IconBaseProps } from './icons/IconBase.js';

// ⚠️ **Qui dentro non entrano i segni di un dominio applicativo**, e il confine è stato messo alla
// prova il 2026-09-20: sette icone per gli attributi di un gioco da tavolo — giocatori, durata,
// difficoltà, valutazione, editore, età, seguito — erano state scritte e poi tolte, perché questo
// elenco è la promessa della libreria e sette nomi di dominio dicono che sa che cos'è un gioco da
// tavolo. `DiceIcon` resta perché non è un attributo: è il terzo termine del marchio, dopo la peste
// e i ratti. I sette disegni vivono nel commit `0d55bee` e il loro posto è Rattoteca.

// Il meccanismo, e i dati che gli si danno da mangiare: due moduli, perché chi vuole la voce dei
// Ludoratti e chi vuole solo il sorteggio sono due persone diverse.
export { useRandomPhrase, type RandomPhrase } from './hooks/useRandomPhrase.js';
// ⚠️ Quasi tutto rispetta «meno movimento» da solo, con una regola in `animations.css`. Questo
// gancio è per l'altro caso: decidere **se** mettere al mondo qualcosa — è ciò che fa `RatSwarm` —
// e poter dire a chi guarda perché una decorazione non c'è.
export { useReducedMotion } from './hooks/useReducedMotion.js';
export { DEV_PHRASES, RAT_PHRASES } from './data/phrases.js';
// Il lessico: le parole di casa, ognuna accanto a quella generica che sostituisce. È un dato come
// le frasi — chi vuole la voce dei Ludoratti lo applica, chi non la vuole lo ignora.
export { LUDORATTI_COPY, type LudorattiTerm, type LudorattiTermKey } from './data/copy.js';

// Gli estremi fra cui si pesca: uno solo per tutta la libreria, perché lo sciame e l'emettitore
// fanno la stessa cosa con numeri diversi.
export type { RandomRange } from './randomRange.js';
