# plague-board-ui

L'aspetto dei **Ludoratti E. Corp.**: le icone della peste, i ratti che attraversano la pagina, la
voce del ratto, la firma «umano e AI». Vive qui perché quattro applicazioni lo condividono, e
finora esisteva in una sola — copiarlo a mano nelle altre tre voleva dire quattro identità che
divergono.

> ⚠️ **Non è un kit di controlli.** Bottoni, campi, modali e pannelli sono di
> [HeroUI](https://www.heroui.com), che questa libreria **veste**: quello che trovi qui è ciò che
> HeroUI non ha e non avrà mai — un ratto che attraversa lo schermo, un fumetto che dice «Squit!»,
> un fondale appestato.

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

## Che cosa c'è dentro

Il playground li mostra tutti, ai tre formati e nei due temi:

```bash
npm run playground
```

### La musica viaggia col pacchetto

`MusicProvider` senza `src` suona la traccia dei Ludoratti, che sta in `assets/ludoratti.mp3` —
**1,26 MB**, MP3 a ~111 kbps medi. Non c'è niente da copiare in `public/`: l'indirizzo lo risolve
il bundler dell'applicazione, perché la costante `LUDORATTI_TRACK_URL` è un `new URL(…,
import.meta.url)`, la forma che webpack 5 e Turbopack riconoscono come riferimento a un asset.

```tsx
<MusicProvider defaultVolume={0.4}>
  <PlagueBar><MusicToggle /></PlagueBar>
  <Impostazioni><MusicVolume /></Impostazioni>
</MusicProvider>
```

⚠️ Misurato con **Turbopack**, che è il predefinito di Next 16: l'asset finisce in
`/_next/static/media/ludoratti.<hash>.mp3`, identico byte per byte. Se il tuo bundler quella forma
non la conosce, l'indirizzo esce **sbagliato invece che assente** — punta accanto al file
JavaScript e il browser prende un 404 silenzioso. In quel caso metti il file nella tua cartella
pubblica e passa `src`, che vince sul valore predefinito.

⚠️ La traccia **non parte da sé**, e nemmeno al primo gesto sulla pagina: parte solo se qualcuno
preme `MusicToggle`. L'elemento ha `preload="none"`, quindi chi non la accende non scarica quel
megabyte.

## Licenza, e che cosa non copre

Il codice è distribuito con la **[PolyForm Noncommercial 1.0.0](LICENSE)**: uso libero per
qualunque scopo **non commerciale**, mantenendo l'avviso di copyright; per l'uso commerciale
serve un accordo con noi — si apre una issue e se ne parla.

> ⚠️ **Il marchio non è licenziato insieme al codice.** «Ludoratti», «Ludoratti E. Corp.», il logo,
> la mascotte, la musica di `assets/` e il nome delle applicazioni restano nostri: la licenza
> riguarda il software, non l'identità. Chi usa questa libreria per un progetto suo è il benvenuto,
> ma non per presentarlo come un progetto dei Ludoratti.

Contributi: vedi [CONTRIBUTING.md](CONTRIBUTING.md). Le issue e le pull request sono aperte a
chiunque.
