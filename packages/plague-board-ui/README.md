# plague-board-ui

L'aspetto dei **Ludoratti E. Corp.**: le icone della peste, i ratti che attraversano la pagina, la
voce del ratto, la firma «umano e AI». Vive qui perché quattro applicazioni lo condividono, e
finora esisteva in una sola — copiarlo a mano nelle altre tre voleva dire quattro identità che
divergono.

> ⚠️ **Non è un kit di controlli.** Bottoni, campi, modali e pannelli sono di
> [HeroUI](https://www.heroui.com), che questa libreria **veste**: quello che trovi qui è ciò che
> HeroUI non ha e non avrà mai — un ratto che attraversa lo schermo, un fumetto che dice «Squit!»,
> un fondale appestato.

> 📄 **Questo è il secondo README, ed è il più corto.** npm spedisce solo ciò che sta nella
> cartella del pacchetto, quindi il README della radice del repository — che è **il principale** —
> in questa pagina non ci arriverebbe mai: quello che leggi è la sua versione breve, per chi sta
> installando. Il racconto intero, con il perché di ogni scelta, sta in
> [README.md](https://github.com/superivan94/plague-board-ui#readme). ⚠️ I due possono
> **divergere**: quando succede, quello della radice ha ragione.

## Installazione

```bash
npm install plague-board-ui
```

`react`, `react-dom`, `@heroui/react` e `tailwindcss` sono **peer dependency**: li porta
l'applicazione, e la libreria usa i suoi. Due copie di HeroUI nello stesso albero vorrebbero dire
due provider e due temi.

Nel foglio di stile dell'applicazione, dopo Tailwind:

```css
@import "tailwindcss";
@import "plague-board-ui/theme.css";
@import "plague-board-ui/animations.css";

/* Tailwind deve poter leggere le classi usate dentro il pacchetto */
@source "../../node_modules/plague-board-ui/dist";
```

⚠️ I due fogli si importano **a parte** e non da un modulo: un `import './theme.css'` dentro il
codice costringerebbe chiunque installi ad avere un bundler che sa gestire il CSS.

## Un solo ingresso

Tutto entra da `plague-board-ui`. Non ci sono import profondi — `plague-board-ui/dist/…` non è una
via d'accesso — perché la superficie pubblica è una lista scritta a mano, non tutto quello che il
pacchetto contiene.

```tsx
import { PlagueBar, RatIcon, RatSwarm, SkullIcon } from 'plague-board-ui';
```

## Le tre cose da sapere prima

**La musica viaggia col pacchetto.** `MusicProvider` senza `src` suona la traccia dei Ludoratti,
che sta in `assets/ludoratti.mp3` — 1,26 MB. Non c'è niente da copiare in `public/`: l'indirizzo lo
risolve il bundler, perché `LUDORATTI_TRACK_URL` è un `new URL(…, import.meta.url)`. E non parte da
sé: parte solo se qualcuno preme `MusicToggle`.

**Le icone si sostituiscono, e se ne disegnano di nuove.** Ogni componente mostra la sua icona
predefinita e accetta la tua, purché rispetti `IconProps`. Le icone di un **dominio applicativo**
qui non entrano — giocatori, durata, difficoltà sono di chi fa il catalogo, non del marchio — ma
`IconBase` sì: è l'involucro con cui disegnarle a casa tua senza ricopiare il nostro `<svg>`.

```tsx
import { IconBase, type IconProps } from 'plague-board-ui';

export function PlayersIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 11a3 3 0 1 0…" />
    </IconBase>
  );
}
```

**Il movimento obbedisce da solo.** Chi ha chiesto «meno movimento» nelle impostazioni del sistema
lo ottiene senza che l'applicazione faccia niente: la regola sta in `animations.css`. L'unico posto
in cui quella preferenza si legge da JavaScript è `useReducedMotion`, e serve dove la decisione è
**se** mettere al mondo qualcosa — è quello che fa `RatSwarm`, che con «meno movimento» non genera
nessun ratto.

## Licenza, e che cosa non copre

Il codice è distribuito con la **[PolyForm Noncommercial 1.0.0](LICENSE)**: uso libero per
qualunque scopo **non commerciale**, mantenendo l'avviso di copyright; per l'uso commerciale serve
un accordo con noi — si apre una issue e se ne parla.

> ⚠️ **Il marchio non è licenziato insieme al codice.** «Ludoratti», «Ludoratti E. Corp.», il logo,
> la mascotte, la musica di `assets/` e il nome delle applicazioni restano nostri: la licenza
> riguarda il software, non l'identità. Chi usa questa libreria per un progetto suo è il benvenuto,
> ma non per presentarlo come un progetto dei Ludoratti.

Contributi: vedi
[CONTRIBUTING.md](https://github.com/superivan94/plague-board-ui/blob/main/CONTRIBUTING.md). Le
issue e le pull request sono aperte a chiunque.
