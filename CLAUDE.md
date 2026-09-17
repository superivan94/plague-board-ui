# CLAUDE.md

Guida per Claude Code su questo repository. Il [`README.md`](README.md) dice che cos'è la libreria
e come si installa; qui c'è come ci si lavora.

## ⚠️ Il piano non vive qui

Questa libreria nasce dentro il master plan **`servizi-libreria-e-pannello-2026-09-15`**, che sta
nel repository di **Rattoteca** — `D:\SuperProjects\AppProjects\Ludoratti Progetto\rattoteca` — in
`current-master-plans/servizi-libreria-e-pannello-2026-09-15/`. Da leggere prima di toccare
qualcosa, in quest'ordine:

| File | Che cosa contiene |
|---|---|
| `subplan-03-libreria-aspetto.md` | **la spec**: cinque punti, gli item, le decisioni prese con l'utente e i criteri di verifica |
| `censimento-tema.md` | **il censimento** chiuso alla settima passata: che cosa è a tema in RattInventario, dove sta, e le copie misurate |
| `master-plan.md` | gli step 12–19 e i vincoli dei blocchi `U` e `V` |

⚠️ **Gli hook del piano leggono il `CLAUDE.md` della cartella corrente**: con la sessione qui non
annunciano più il piano all'avvio. Non vuol dire che non ci sia.

## Il repository

```
packages/plague-board-ui/   la libreria — l'UNICA cosa che si pubblica
├── src/                    il codice; src/index.ts è l'unico export pubblico
├── styles/                 theme.css e animations.css, che viaggiano com'è senza passare da dist
└── tests/                  i test, fuori da src/ perché tsconfig.build.json compila solo src/
playground/                 l'app Next che guarda la libreria — non si pubblica
```

**Il gate è `npm run build`, `npm run typecheck`, `npm run lint` e `npm test`, tutti e quattro**,
più `npm run build --workspace playground` quando si tocca qualcosa che il playground rende.
La baseline attuale: lint **0 errori / 0 avvisi**, e la pagina `/` del playground **statica**.

```bash
npm run playground     # il dev server, sulla 3100
```

⚠️ **Il playground consuma `dist/`, non `src/`**: dopo aver toccato la libreria si rilancia
`npm run build`, o la pagina mostra ancora quella di prima. E mentre `tsc` riscrive `dist/`, il dev
server compila contro una cartella a metà: nella console restano errori tipo «Export X doesn't
exist in target module» che **non sono veri**. Si guarda la pagina, o si crede a `next build`.

⚠️ **La 3100 e non la 3000**: la 3000 è dei dev server delle applicazioni, che l'utente avvia da sé.

## Le regole che valgono qui

- 📌 **Si ricompone, non si copia.** Tutto ciò che è a tema in RattInventario viene portato, ma
  nella forma più astratta che il suo comportamento consente. Un header non è a tema — lo è il
  topo che ci vive dentro e che al clic dice una frase: entra il topo.
- 📌 **Nessun componente contiene il testo di un'app.** Se lo conteneva, il testo diventa una prop
  o un dato esportato a parte.
- 📌 **Prima si cerca in HeroUI.** Si veste quello che c'è; si scrive da zero solo ciò che non
  c'è, e l'identità della peste è tutta lì.
- 📌 **Niente font di icone da CDN.** Le icone che mancano si disegnano in SVG, **ognuna con
  scritto che cosa rappresenta e a che serve**. Ogni componente mostra la sua icona predefinita e
  lascia che chi lo usa la sostituisca — è il mestiere di `IconProps`.
- 📌 **Il codice in inglese, i commenti e i testi in italiano**, come in tutti i progetti dei
  Ludoratti.
- 📌 **Si scrive prima il test**, e si prova che abbia i denti spegnendo la riga che difende.
  ⚠️ In jsdom le animazioni non girano e ogni rettangolo misura zero: si prova il **contratto**
  (quali prop producono quali attributi) e la logica pura. Il resto è collaudo, e sta in
  [`COLLAUDI.md`](COLLAUDI.md).
- 📌 **Il collaudo è per confronto**: il playground in una scheda e `rattinventario.ludoratti.it`
  nell'altra. ⚠️ E si **misura** invece di guardare, quando si può: i tracciati delle icone si
  leggono dal DOM delle due pagine e si confrontano carattere per carattere.
- 📌 **I colori si rifiniscono alla fine**, quando tutti i componenti ci sono. Un colore diventa
  variabile solo quando si sa che cosa deve fare nei due temi; **nel dubbio resta statico**, e lo
  si dichiara.
- 📌 **Il testo del playground spiega il componente, non come è stato fatto.** La demo è uno
  storyboard da leggere in fretta: a che serve, quando si usa, quali vincoli rispettare, e i numeri
  che servono a decidere — misure, contrasti, soglie. **Fuori**: date, cronaca dello sviluppo,
  difetti incontrati, confronti con RattInventario, domande retoriche. Quella roba serve a chi
  lavora al codice e sta nei **commenti**, in `COLLAUDI.md` e nel piano.
- 📌 **Ogni pagina del playground regge i due temi.** Niente colori scritti a mano: i token di
  HeroUI — `text-muted`, `border-border`, `bg-surface`, `bg-background` — e i nostri `*-ink`. Un
  `text-gray-400` è invisibile in chiaro. Le eccezioni sono le superfici che **restano scure nei
  due temi** — la barra, il riquadro della direzione — e vanno dichiarate dove stanno.
- 📌 **`main` e le pull request solo su richiesta esplicita dell'utente.**

## Cose misurate, da non riscoprire

- ⚠️ **L'`overrides` su `vitest` nella radice non è un residuo.** Senza, `npm install` da zero
  muore con `Cannot read properties of null (reading 'edgesOut')`: `@testing-library/jest-dom`
  dichiara una peer **opzionale** `vitest >= 0.32`, npm la risolve alla 5 e va in crisi camminando
  il suo albero. ⚠️ **`--legacy-peer-deps` è la cura sbagliata** — spegne la verifica delle peer
  in un progetto il cui contratto *sono* le peer, e lascia scoperte tutte quelle di HeroUI 3.
- ⚠️ **HeroUI 3 non si veste come la 2.** È a CSS (`@import "@heroui/styles"`), non più a plugin di
  Tailwind: `@plugin "hero.ts"` non esiste più. **Non vuole nessun provider**, i componenti sono
  **composti** (`Card.Header` invece di `CardBody`), e il tema scuro lo riconosce da `.dark` o
  `[data-theme="dark"]`. Le sue peer sono **cinque** e le installa l'applicazione: `react-aria`,
  `react-aria-components`, `@react-aria/ssr`, `@react-aria/i18n`, `@react-aria/utils`.
- ⚠️ **In HeroUI 3 l'elemento si cambia con `render`, non con `as`.** I suoi componenti sono
  polimorfi con una funzione — `<Surface render={(props) => <header {...props} />}>` — e chi cerca
  `as` non lo trova. Sta in `utils/dom.d.ts`.
- ⚠️ **I `@keyframes` di `animations.css` stanno al livello più esterno, non dentro `@theme`.**
  L'idioma di Tailwind v4 li vorrebbe dentro, così vengono emessi solo quando si usa l'utility —
  ma alcune animazioni le chiamano le nostre classi (`.pb-binary-digit`), e Tailwind non lo può
  sapere: finirebbero a puntare a un'animazione **che non esiste, in silenzio**. È la forma esatta
  del difetto `animate-scale-bounce` di RattInventario.
- ⚠️ **Vestire HeroUI 3 non è riscrivere un componente: è ridichiarare le sue variabili grezze.**
  Dichiara le utility con `@theme inline` sopra a `--accent`, `--success`, `--focus`, `--surface`…,
  e quelle le definisce il suo tema dentro `@layer base`. Le nostre righe stanno **fuori da ogni
  layer**, così vincono senza dipendere dall'ordine degli import.
- ⚠️ **I verdi dei Ludoratti sono due e hanno due mestieri, non è un doppione.** `brand` è il
  **lime `#a3e635`** della corporazione — è quello di `ludoratti.it`, l'unico che la pagina del
  marchio usa; `plague-400…700` sono i verdi della **malattia**, quelli di RattInventario. E il
  nero è `#030712`, che **è** il `gray-950` di Tailwind: per questo la libreria non dichiara nessuna
  scala di grigi: ridichiararne una che vale quanto la predefinita vuol dire solo sovrascriverla a
  chi installa.
- ⚠️ **La tavolozza va in `@theme`, non in `:root`.** `@theme` **genera** le utility, `:root`
  dichiara solo una variabile — in RattInventario i token stanno in `:root` e infatti
  `animate-scale-bounce` **non esiste affatto**: la classe non è mai stata generata e quel rimbalzo
  non è mai partito.
- ⚠️ **Un token che cambia col tema vuole `@theme inline`, non `@theme`.** Con `inline` l'utility
  generata punta **alla variabile**; senza, Tailwind incolla il valore del tema chiaro dentro la
  classe e il blocco `.dark` non serve a niente. ⚠️ E i selettori del tema sono **classi
  qualunque** (`.light` / `.dark`, più `[data-theme]`), mai `:root.dark`: il playground mostra i
  due temi **affiancati nella stessa pagina**, cioè su due contenitori. I due blocchi hanno la
  stessa specificità, quindi lo scuro va scritto **sotto**.
- ⚠️ **HeroUI 3 riconosce anche `.light`, non solo `.dark`.** La sua documentazione nomina il
  secondo e dice che il chiaro è il valore predefinito; che una `.light` **dentro** una pagina
  scura riporti `bg-background` al chiaro è misurato qui, non letto — è la riga di `bg-background`
  nello scenario dei due temi di [`COLLAUDI.md`](COLLAUDI.md).
- ⚠️ **`'use client'` sopravvive a `tsc`**, e sopravvive alla **riga 1**, prima dell'import di
  `react/jsx-runtime` che il trasformatore JSX inietta. È ciò che regge la decisione «la build è
  `tsc` e basta». Misurato il 2026-09-16 con una sonda compilata e cancellata.
- ⚠️ **Chi passa `render` a HeroUI deve dichiarare `'use client'`.** `render` è una **funzione** e i
  componenti di HeroUI sono client: usata da una pagina server, quella prop non attraversa il
  confine e il prerender muore con «Functions cannot be passed directly to Client Components». Per
  una barra è il caso normale, visto che le intestazioni vivono in `layout.tsx`. Misurato il
  2026-09-17 con `next build`, e tenuto da `tests/boundaries.test.ts`.
- ⚠️ **E un modulo `'use client'` non esporta dati, solo componenti.** È l'altra metà dello stesso
  confine, e la peggiore: **nessuna build diventa rossa**. Un modulo client consegna a un
  componente server un **riferimento**, non i suoi valori — per un componente è il meccanismo
  giusto, per una tabella di numeri vuol dire che chi la indicizza ottiene `undefined` in silenzio.
  `PLAGUE_BAR_MARK_SIZE` è finito così in `brand/plagueBarSizes.ts`, che la direttiva non ce l'ha.
  L'alternativa legittima al guard non è spegnerlo: è il modulo accanto.
- ⚠️ **Vestire HeroUI non finisce quando il componente è suo: i suoi colori sono tarati sulle sue
  superfici.** `--separator` su `gray-950` fa **1,24** di contrasto e la riga sparisce; `gray-700`
  fa 1,96. Quindi si prende il suo componente — ruolo e attributi ARIA valgono più di un `<span>`
  scritto a mano — e il colore resta **statico**, finché non si sa che cosa deve fare nel tema
  chiaro. La leva per quel giorno è ridichiarare `--separator` in `theme.css`, accanto ad
  `--accent`: sistema anche i separatori disegnati dentro i componenti di HeroUI.
- ⚠️ **`Surface` porta solo `variant`**: niente taglia, niente spaziatura. L'altezza di `PlagueBar`
  è nostra, ed è **l'unica misura che possiede** — la larghezza della colonna dentro la decide chi
  la usa, perché dipende dalla pagina. Due `py` annidati non si sommano in un modo che si possa
  prevedere a occhio.
- ⚠️ **Una superficie che resta scura nei due temi deve portare `dark` addosso, e non essere
  traslucida.** Sono due cose insieme: al 70% su pagina chiara la lastra compone un **grigio
  medio**, non il nero; e senza la classe, i token `*-ink` e i componenti di HeroUI che ci stanno
  dentro leggono il tema della **pagina** e scrivono scuro su scuro. Misurato il 2026-09-17 in tema
  chiaro: l'etichetta del commutatore nella barra faceva **2,05**, il collegamento corrente
  **1,67**. Con `dark` e il velo al 90%: nessun testo sotto 4,5 su nessuna pagina.
- ⚠️ **Ridichiarare una variabile di HeroUI va fatto in tutti e due i blocchi del tema.** Le nostre
  righe stanno fuori da ogni layer e vincono sul suo tema in `@layer base` **anche quando la sua è
  più specifica**: un `--muted` scritto solo in `:root` spegne pure quello del tema scuro. Misurato
  sbagliandolo — il grigio secondario in scuro è crollato da 6,5 a **2,62**.
- ⚠️ **`text-default-500` non esiste, e per mesi non se n'è accorto nessuno.** HeroUI 3 non ha una
  scala numerata: i suoi token sono `muted`, `default`, `border`, `separator`, `surface`,
  `background`, `foreground` e le loro varianti. Una classe che non esiste **non colora**, quindi
  il testo restava `foreground` e sembrava solo un po' troppo acceso — la stessa forma di
  `animate-scale-bounce` in RattInventario. Si verifica cercando la regola nel CSS generato, non
  guardando la pagina.
- ⚠️ **Il tema si applica con uno script che gira prima del primo disegno, non con un effetto.** Gli
  effetti partono **dopo**, e lì il lampo del tema sbagliato si vede. Il prezzo è che il server
  rende una classe e il client ne trova un'altra: `suppressHydrationWarning` sull'`<html>` è la
  riga che dice «questa differenza è voluta». Misurato: senza, un avviso a ogni caricamento; con,
  il contatore degli errori non si muove.
- ⚠️ **Un'animazione CSS non riparte perché è cambiato il testo dentro l'elemento.** React riusa lo
  stesso nodo, e l'animazione prosegue da dov'era: un'animazione con `forwards` che finisce a
  opacità zero lascia poi un elemento **presente e invisibile**, che continua ad aggiornarsi senza
  che si veda niente. Si riparte cambiando la **chiave**, così il nodo è nuovo. Misurato il
  2026-09-17 su `SpeechBubble` — `currentTime` a 1558ms invece di 0 — ed è lo scenario del fumetto
  interrotto in [`COLLAUDI.md`](COLLAUDI.md).
- ⚠️ **Una regione viva va creata prima del contenuto, e un messaggio non è una descrizione.**
  `role="status"` annuncia ciò che *cambia* al suo interno: nata già piena, può non essere
  annunciata affatto — perciò il contenitore di `SpeechBubble` c'è anche quando non c'è frase. E un
  `Tooltip` non va bene per una frase che passa: lega il testo al grilletto con `aria-describedby`,
  cioè lo rende la sua descrizione permanente. Misurato con una sonda il 2026-09-17, in
  [`INVENTARIO.md`](INVENTARIO.md).
- ⚠️ **Un'icona non risponde al ruolo `img` se non gliel'hai dato.** Un `<svg>` senza `role`
  esplicito per l'albero di accessibilità è un `graphics-document`, quindi un test che asserisce
  `queryByRole('img')` per dire «è decorativa» resta **verde anche togliendo l'`aria-hidden`** che
  dovrebbe difendere. Si asserisce l'attributo.
- ⚠️ **Il `Button` di HeroUI è un controllo con una taglia: non avvolge contenuto di misura
  qualunque.** `.button` è `h-10 md:h-9 px-4 rounded-3xl`, e `.button--sm` arriva a scrivere
  `svg { size-4 }` — un segno da 56px ci finisce dentro a 16. È il rovescio della scoperta su
  `Surface`, che di taglie non ne ha nessuna. E il `Pressable` di `react-aria` **non** è la via
  d'uscita: letto nel sorgente, clona il figlio e pretende che sia **già** focalizzabile e con un
  ruolo interattivo — non aggiunge né `role` né `tabIndex`. Il pezzo giusto è `usePress` su un
  `<button>` proprio.
- ⚠️ **`usePress` non fa scattare `onPress` al rilascio: aspetta il `click`** — e se entro 80ms non
  arriva, **lo sintetizza**, perché iOS e Android non lo emettono dopo una pressione lunga. È la
  ragione concreta per preferirlo a un `onClick`: tenere premuta una mascotte su un telefono, con
  `onClick`, non la fa parlare. In jsdom questo è anche **l'unica cosa che porta la tastiera**:
  sostituendo `pressProps` con `onClick` sullo stesso `<button>` vero, il test dell'Invio diventa
  rosso, perché jsdom non sintetizza il `click` da un tasto.
- ⚠️ **HeroUI 3 ridefinisce la variante `motion-reduce` di Tailwind.** Non è più solo
  `@media (prefers-reduced-motion: reduce)`: è `[data-reduce-motion="true"]` **oppure** il media
  query quando quell'attributo non c'è. Vuol dire che un `motion-reduce:` scritto qui risponde sia
  alla preferenza di sistema sia a un interruttore dentro l'applicazione, gratis.
- ⚠️ **La passata sui contrasti dei testi non vede la grafica, e lì si nasconde lo stesso difetto.**
  La soglia della grafica che porta significato — segni, e soprattutto **indicatori di fuoco** — è
  **3**, e si misura sullo stesso sfondo composto. L'anello di fuoco della mascotte, scritto con
  `brand`, faceva **1,38** in tema chiaro: un comando che da tastiera non si trova. Idem i segni
  delle demo. Il lime grezzo va **dentro** la barra, che è un'isola scura; sul fondo della pagina
  ci va `brand-ink`. Lo scenario sta in [`COLLAUDI.md`](COLLAUDI.md), decorazioni dichiarate
  comprese.

## Memoria di sessione

Dopo un compact, la riga di `SessionStart` dice se c'è uno stato salvato e **dove sta**:
`[smart-compact] Stato dell'ultimo compact di questa sessione: <percorso>`. Se c'è, leggilo al
primo turno — contiene le decisioni prese e i passi concordati che il compact ha compresso — e
prosegui in silenzio, con una riga sola su dove si era arrivati. Se l'operazione che descrive è
chiusa, cancella il file e dillo in una riga; se è in corso, lo aggiorna la skill `smart-compact`
al prossimo compact.

**Il percorso non si costruisce a mano** e il file **non si chiama `current.md`**: lo nomina il
`session_id`, perché due sessioni sullo stesso progetto con lo stesso nome si sovrascriverebbero
a vicenda. Se quella riga non c'è, non è ancora avvenuto nessun compact in questa sessione: non
c'è niente da cercare.
