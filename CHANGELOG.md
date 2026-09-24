# Changelog

Le versioni seguono [semver](https://semver.org/lang/it/). Finché la libreria sta sullo `0.x`, una
**minore** può cambiare l'aspetto di un componente: le applicazioni la fissano esatta e salgono
quando decidono loro.

## 0.1.1 — 2026-09-25

La prima versione pubblicata su npm. Il contenuto del pacchetto è quello della `0.1.0`, file per
file; cambiano solo i test, che non si spediscono.

- **I guard leggono i sorgenti uguali con LF e con CRLF.** Con `core.autocrlf=true` il checkout
  scrive i file in CRLF, e il guard del confine client/server non riconosceva nessun modulo
  client: il primo `npm publish` della `0.1.0` si è fermato nel suo `prepublishOnly`.

## 0.1.0 — 2026-09-24, taggata e mai pubblicata

L'identità dei Ludoratti sopra HeroUI 3, e i componenti comuni delle loro applicazioni.

- **Il tema**: `theme.css` con la tavolozza del marchio e della peste e le variabili di HeroUI
  ridichiarate nei due temi; `animations.css` con le animazioni e la regola di «meno movimento».
- **I segni**: le icone disegnate qui, il marchio `RatIcon` coi suoi due stati, la mascotte e le
  frasi, il lessico `LUDORATTI_COPY`, e il ratto ricalcato che corre (`Rat`, `RatRun`, `RatSwarm`).
- **La barra e il piede**: `PlagueBar`, `BarRow`, `TechRule`, `PlagueFootBar`, la firma, il comando
  delle donazioni e gli effetti che volano fuori dal loro riquadro.
- **L'atmosfera**: il livello tossico, il fondale che segue il tema, `GlitchText` e la musica.
- **Il profilo e l'accesso**: `PlaguePanel`, `PlagueAvatar`, `ThematicBadge`, `CountedChips`,
  `LoginScreen`, `GoogleSignInButton`, `PlagueDivider`.
- **I pezzi comuni**: `PlagueLoader`, `PlagueEmptyState`, `PlagueDialog`, `PlagueConfirmDialog`,
  `PlagueAlert`, `PlagueToastRegion`, `ProfileMenu`, `PlagueDock`, e il tema con `ThemeSwitch`,
  `useThemePreference` e `themeBootScript`.
