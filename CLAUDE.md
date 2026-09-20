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
art/reference/              le tre illustrazioni del ratto e il prompt che le ha generate — la FONTE
scripts/genera-ratto.mjs    le ricalca in src/brand/ratArt.ts: `npm run art:ratto`
```

⚠️ **`src/brand/ratArt.ts` è generato e non si modifica a mano.** Il ratto non è disegnato: è
**ricalcato** dalle tre reference con `imagetracerjs`, e lo script è la sola cosa da toccare. Con
`--anteprime <dir>` rende anche i PNG su fondo grigio per guardare il risultato.

**Il gate è `npm run build`, `npm run typecheck`, `npm run lint` e `npm test`, tutti e quattro**,
più `npm run build --workspace playground` quando si tocca qualcosa che il playground rende.
La baseline attuale: lint **0 errori / 0 avvisi**, e la pagina `/` del playground **statica**.

⚠️ **Il gate si legge dal codice d'uscita, non dalle ultime righe.** `tsc --noEmit` con un errore
stampa **una riga in mezzo** ed esce con 2: dentro un `| tail -2` si vede il banner di npm e niente
altro, e sembra verde. È passato un commit così il 2026-09-18 — un `.baseVal` su un tipo `string`,
verde a runtime e rosso per `tsc`. Si concatena con `&&` e senza `tail`, oppure si guarda
`${PIPESTATUS[0]}`.

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
- ⚠️ **Un disegno alla qualità della mascotte non si fa a numeri: si genera nel suo stile e si
  ricalca.** Tre giri a mano di `Rat` — punti Bézier piazzati a coordinate — non sono arrivati
  alla coscia né alla coda giuste, e l'analisi ha detto che il limite non era l'SVG ma il metodo.
  L'utente ha generato tre reference nello stile della mascotte (il prompt sta in
  `art/reference/prompt-e-note.md`) e il ricalco con `imagetracerjs` tiene tutto: contorno con i
  suoi spessori, due toni per materiale, baffi, dita, l'etichetta col teschio. Il corpo viene dal
  ratto grigio nudo e si **ricolora per slot**; teschio, collare e imbracatura sono kit ritagliati
  dagli altri due, e si accendono a caso in uno sciame.
- ⚠️ **Il vettorizzatore vuole una tavolozza fissa, e i pixel trasparenti tutti a zero.** Con la
  quantizzazione libera il verde dell'ampolla si fondeva col cuoio, l'occhio rosso (0,1% dei
  pixel) spariva per `mincolorratio: 0.02`, e i colori cambiavano da una corsa all'altra: ogni pixel
  va al colore più vicino di una tavolozza **nominata** prima del ricalco, così ogni percorso porta
  un nome. E un pixel tolto deve essere (0,0,0,0): la distanza è su quattro canali, e uno con
  l'alfa a zero e il colore lasciato dentro resta più vicino al suo colore (255) che al trasparente
  (r+g+b) — così i kit si portavano dietro l'intero ratto donatore, e il fondo bianco era diventato
  «pelo bianco». Misurato il 2026-09-18.
- ⚠️ **Il fondo si toglie riempiendo dai bordi, non cancellando il bianco — e poi si allarga di
  due pixel.** Il pelo dell'albino è bianco quanto il fondo ma sta dentro il contorno, e il
  riempimento non ci arriva. Sul bordo restano pixel di antialiasing sotto 235 che il ricalco
  quantizza a inchiostro: un anello di trattini attorno a tutto il ratto, visibile solo dopo aver
  tolto il fondo. Due pixel su un contorno largo otto non si vedono.
- ⚠️ **Il despeckle è una passata sola, e l'inchiostro non si tocca.** Il filtro di maggioranza
  3×3 sull'indice dei colori toglie i filetti chiari fra rosa e inchiostro e i mosaici di frammenti
  — il corpo scende da 96 a 52 percorsi — ma una linea larga due pixel non ha mai tre vicini
  uguali: con due passate e senza la riserva sull'inchiostro il teschietto sull'etichetta era una
  nuvola e il dado puntini a mezz'aria. ⚠️ E il despeckle **cambia i semi**: il dado stava nel kit
  solo grazie alle briciole crema che il despeckle ha pulito, ed è uscito. Dove un oggetto non ha un
  colore suo, il seme è il **riempimento da un punto interno** fermato dall'inchiostro; i punti
  però si prendono dalla sonda (`SONDA=1`), non a occhio — sette su otto cadevano sull'inchiostro.
- ⚠️ **Prima di correggere un difetto del ricalco, si guarda la reference al punto giusto.** La
  macchia chiara sull'orecchio del ratto col teschio ha avuto **tre** diagnosi: «luce
  dell'orecchio quantizzata a osso» (ho rifatto teschio e ampolla con semi per riempimento, a
  vuoto), «è l'osso stesso che posa sull'orecchio» (ho allargato il recinto, e la macchia è
  rimasta), e infine — ritagliando la reference del bruno a 3× — **il bordo dell'orecchio del bruno
  è un anello crema dello stesso `#f8f0e0` del teschio**, mentre nel grigio è rosa. Per colore non
  si separa, per rettangolo nemmeno (si sovrappongono in x): si separa per **componente connessa**
  — il teschio è un pezzo da 14.090 px, l'anello un pezzo da 4.683 staccato da lui dal suo stesso
  inchiostro. La sonda le stampa. Due giri persi per non aver guardato subito i pixel giusti.
- ⚠️ **Un colore del kit può portare il nome di un colore del pelo, e il filtro lo butta.** L'ombra
  dell'osso del teschio quantizza a `brownBellyShade`, l'ombra della pancia del bruno: 3.817 px
  dentro la maschera del teschio, scartati perché il filtro teneva solo `bone`. Il teschio sembrava
  mangiato attorno all'orbita e in punta al becco. Il filtro si scrive **contando i colori dentro la
  maschera** (`SONDA=1`), e il rename ridà a quei pixel il nome giusto (`boneShade`). E un buco
  circondato dal pezzo è del pezzo: l'orbita, larga 50 px, non la raggiunge una dilatazione di 9 —
  i buchi della maschera si riempiono.
- ⚠️ **I kit si ritagliano in raster, con semi + dilatazione + recinto.** Nel ricalco libero il
  contorno del teschio e quello della testa sono **un percorso solo**: si semina la maschera coi
  colori del kit, si dilata di 9 pixel per prendere il loro inchiostro, e si **recinta** in un
  rettangolo dell'immagine donatrice — perché il vetro dell'ampolla e l'ombra del pelo bianco
  distano 40 su 765, e senza recinto tutta l'ombra del bianco diventava seme. Il collo dell'ampolla,
  vetro che non tocca il verde, ha il suo recinto stretto.
- ⚠️ **L'inchiostro dei Ludoratti non è nero: è `#180828`.** Misurato il 2026-09-17 sui pixel di
  `LudoRatti_Logo.png` — il colore scuro più frequente del contorno è un viola-nero. Il ratto
  ricalcato porta l'inchiostro delle **reference**, generate nello stile della mascotte e
  quantizzate a `#100020`: stessa famiglia, ed è quello che rende il ratto che corre e la mascotte
  con l'ampolla **lo stesso personaggio** invece di due disegni. Il verde dell'ampolla è quello
  delle reference (`#86b84a`), non `plague-500`: il ricalco riproduce il disegno, e il giorno che si
  vorrà accordarlo alla tavolozza la leva è `RAT_KIT_COLORS`.
- ⚠️ **Il contorno d'inchiostro tiene il ratto in chiaro e non fa niente in scuro.** Misurato il
  2026-09-18 su `/stile`: `#180828` fa **19,02** sul bianco della superficie chiara e **1,07** su
  quella scura. In chiaro è il contorno a reggere l'albino (`#f7f7f7` su bianco); in scuro reggono
  le campiture, e i tratti che sono **solo** inchiostro — sopracciglio, baffi, cinghie, orbita del
  teschio — di fatto spariscono. Non è un difetto da correggere in fretta: la mascotte con l'ampolla
  ha la stessa proprietà ed è quella che dà l'identità. Ma è il motivo per cui il ratto **segue il
  tema** invece di stare su una lastra scura fissa, e il giorno che si vorrà l'espressione anche in
  scuro la leva è un inchiostro che cambia col tema, in `theme.css`.
- ⚠️ **Una `transform` in CSS sostituisce l'attributo `transform`, non si somma.** Nel primo `Rat`
  disegnato a mano le zampe lontane stavano indietro con un `translate(-14,2)` come attributo, e
  l'animazione sullo stesso `<g>` le avrebbe riportate all'origine al primo fotogramma. Nel ratto
  ricalcato **nessuna parte porta un attributo `transform`**: i percorsi stanno in coordinate
  assolute e il perno è un `transform-origin` in unità del viewBox — che vale solo con
  `transform-box: view-box`, perché senza l'origine si conta dal riquadro della parte e la zampa
  ruota attorno a se stessa. Misurato il 2026-09-18 su `/corsa`: `transformOrigin` calcolato
  `166px 153px` per la posteriore vicina, cioè il perno scritto dal generatore.
- ⚠️ **Una cornice scritta a occhio prima di misurare taglia qualcosa, e lo fa in silenzio.** La
  prima di `Rat` ridisegnato finiva a 88; la pianta dei piedi dipinta sta a **89,25**. Si è visto
  solo misurando i pixel, e da lì il test tiene le quattro cifre misurate come vincolo.
- ⚠️ **Per la cornice di un SVG né `getBBox()` né `getBoundingClientRect()` bastano: il tratto non
  lo contano.** Misurati tutti e tre il 2026-09-17 sulla coda di `Rat`, i primi due danno **−31,67**
  — la geometria del percorso — mentre il pixel dipinto più a sinistra sta a **−33,75**, perché
  `stroke-width: 4` con la punta tonda dipinge 2 oltre. Il metodo che risponde è disegnare l'SVG su
  una tela a 4× e cercare il primo e l'ultimo pixel non trasparente. Fidandosi di `getBBox()`, un
  `viewBox` stretto taglia il tratto e nessuno se ne accorge finché non lo guarda ingrandito.
- ⚠️ **La spaziatura in CSS non entra nel testo, e il nome accessibile la legge attaccata.** La
  `gap` di una flex separa i riquadri, non i caratteri: due `<span>` adiacenti dentro un comando
  danno «…tutte quante33 in 2 elenchi». Si cura con un **nodo di testo** — `{' '}` fra i due —, non
  con un margine. E il `Heading` di HeroUI vale **`h3`** se non gli si passa `level`, quindi sotto
  un `h1` è un salto di livello che a schermo non si vede. Le due cose si trovano solo leggendo
  l'albero di accessibilità, ed è lo scenario dell'elenco delle frasi in [`COLLAUDI.md`](COLLAUDI.md).
- ⚠️ **Un file binario in una libreria `tsc` va dentro un modulo, non accanto.** Un pacchetto npm
  spedisce qualunque file, ma un binario ha bisogno di un **URL**, e quell'URL lo fabbrica il
  bundler dell'applicazione che lo installa: la libreria non sa a che indirizzo il proprio file
  verrà servito, e `tsc` non copia niente e non riscrive import. Dentro un modulo il disegno è
  **codice**, e chi installa non configura niente. Il prezzo è il peso in JavaScript, quindi si
  converte prima: `LudoRatti_Logo.png` era **222 KB** per 527×493 — di cui due terzi di spreco,
  visto che gli stessi pixel in PNG con palette fanno 74 KB — ed è diventato un WebP a 288 di
  larghezza, **19,3 KB**, 25,8 in base64. La larghezza non è a caso: nell'intestazione il disegno
  è alto al massimo 88px, e 88 × 3 × (527/493) fa **282**.
- ⚠️ **E con `sideEffects: ["*.css"]` quel peso lo paga solo chi lo usa — anzi, spesso nessuno.**
  Misurato sulla build del playground: il disegno compare **solo** nell'HTML di `/voce` (88 KB
  contro gli 80 di `/`) e in **zero** chunk JavaScript, perché `RatMascot` è un componente server e
  la stringa finisce nell'HTML una volta sola invece che nel bundle. ⚠️ Dentro un componente
  client, invece, nel bundle ci finirebbe.
- ⚠️ **La passata sui contrasti dei testi non vede la grafica, e lì si nasconde lo stesso difetto.**
  La soglia della grafica che porta significato — segni, e soprattutto **indicatori di fuoco** — è
  **3**, e si misura sullo stesso sfondo composto. L'anello di fuoco della mascotte, scritto con
  `brand`, faceva **1,38** in tema chiaro: un comando che da tastiera non si trova. Idem i segni
  delle demo. Il lime grezzo va **dentro** la barra, che è un'isola scura; sul fondo della pagina
  ci va `brand-ink`. Lo scenario sta in [`COLLAUDI.md`](COLLAUDI.md), decorazioni dichiarate
  comprese.
- ⚠️ **Un pezzo ritagliato da un disegno piatto si scopre quando ruota, e il taglio va disegnato
  perché non si veda.** Il primo giro tagliava zampe e coda con poligoni dritti: a 14° un punto a
  100 px dal perno si sposta di 24, e sul ratto in corsa si vedevano spigoli in mezzo al pelo, cunei
  bianchi dietro la coscia e monconi rettangolari delle zampe lontane — «molti artefatti», ha detto
  l'utente. La forma che regge sta in `scripts/genera-ratto.mjs` e ha tre ingredienti misurati:
  la **sporgenza** — la zampa fuori dal **nucleo**, l'apertura morfologica (erosione e dilatazione
  di 35 px) della sagoma in cui ciò che è più stretto di 70 px sparisce — con un **orlo** di 10 px
  che resta al tronco, perché il nucleo arrotonda le convessità e senza orlo alla radice si vedeva
  il fondo; il **giunto sintetico dietro al tronco** — una capsula dal perno all'uscita con
  l'anello d'inchiostro e il colore della radice, disegnata da zero, che per le lontane è un arto
  d'ombra prolungato dentro il corpo e per le vicine un **disco** sul punto in cui lo stinco
  attraversa il contorno: un disco è l'unica forma che una rotazione attorno al suo centro manda in
  sé stessa, il tronco ne nasconde la metà interna e la metà esterna riempie il cuneo che lo stinco
  apre oscillando; e la **coda in cinque segmenti** tagliati fra un anello e l'altro del disegno,
  col **padre che prosegue sotto il figlio** per il raggio del giunto. ⚠️ Tre cose provate e
  scartate: le zampe vicine **davanti** al tronco (niente nasconde il giunto, e fra stinco e pancia
  si apriva un cuneo bianco a ogni passo — con l'anca come perno, per di più, il disco tagliava
  l'arco d'inchiostro della coscia); il raggio del giunto **pari** alla mezza zampa (l'anello sbuca
  da fermo) o più largo dello stinco (un nodo nero sotto la zampa); tre segmenti di coda con un
  decimo di ritardo (15° fra due segmenti vicini, e ai tagli fessure bianche perché il padre finiva
  di netto sulla colonna). Si verifica **col ciclo**, non a occhio sull'animazione che gira:
  `--anteprime` rende `ciclo-<zona>.png`, dodici istanti del passo con gli angoli che
  `animations.css` dà davvero — durata, ritardo, `alternate`, `ease-in-out` — perché l'angolo
  relativo peggiore fra due pezzi capita **in mezzo**, non agli estremi scelti a mano. Un cuneo di
  10 px sulla reference è un pixel a 88px, e passa.
- ⚠️ **La cornice del ratto è misurata da fermo, e correndo il disegno la sborda.** Il corpo sale
  di sei unità e i piedi scendono oltre il bordo, e un `<svg>` taglia ciò che esce dal `viewBox`:
  il tappo dell'ampolla spariva in cima al sobbalzo. `.pb-rat { overflow: visible }` in
  `animations.css` lascia sbordare il disegno senza allargare la cornice, che resta quella del
  ratto fermo. ⚠️ E il tappo stesso usciva mozzato **da fermo**: la sua ombra quantizza a `brownFur`
  — pelo bruno, in un disegno che di bruno non ha altro — e stava fuori sia dai semi sia dal filtro
  del kit. È la stessa lezione del teschio: i colori dentro la maschera si **contano**, la
  tavolozza non basta. Segnalato dall'utente il 2026-09-19.
- ⚠️ **Un frammento preso da un poligono o da un recinto sbagliato non si vede da fermo: si vede
  quando il pezzo si muove.** Con le tinte della lente l'utente ha trovato quattro pezzi di
  contorno «che non dovevano esserci», e ognuno era un pixel **di un'altra parte** finito nel
  pezzo o lasciato nel tronco: la fetta alta del piede lontano nel recinto della coda (rosa come
  la coda); le dita del piede oltre il bordo del poligono; il contorno inferiore della zampa
  lontana nel poligono della vicina, perché il bordo era dritto e il solco fra le due è obliquo; la
  fascia esterna del contorno della coda, spesso 15–20 px in punta contro i 9 della dilatazione,
  rimasta al tronco. Le regole che ne sono uscite: i **poligoni confinanti condividono i vertici
  lungo il solco**, letti con la sonda per colonna, così un pixel va a uno solo dei due; la coda
  prende l'inchiostro fino a 20 px **solo fuori dal corpo**; ogni parte scarta le componenti sotto
  i 250 px (`briciole`). E i buchi lungo gli anelli della coda non erano movimento: filetti di
  antialiasing quantizzati a pelo che il ricalco scarta — si **fondono** a rosa nel tratto in aria,
  prima del ricalco, come l'etichetta dell'ampolla. ⚠️ **Ma una fusione a rettangolo è un
  colpo di rullo**: il rettangolo della coda toccava l'angolo della groppa e ne ha fatto rosa un
  triangolo di pelo, nel tronco e nella coda insieme — visibile anche da fermo, e trovato
  dall'utente. Una fusione che cura l'antialiasing vale **a ridosso del colore vero** (`accanto`,
  3 px), non in tutto il rettangolo; e ogni fusione nuova si controlla coi riquadri dei percorsi per
  colore (`bbox.mjs` nello scratchpad: quale parte ha un percorso rosa dove rosa non ci va).
- ⚠️ **Le cuciture si guardano sulla pagina `/lente` del playground, non sulla demo.** Il ratto da
  solo, alto fino a 1200 px, **fermo a un istante qualunque** del ciclo — `getAnimations()` messe in
  pausa e portate a `currentTime` — e con un colore per pezzo (`[fill="#100020"]` esclude
  l'inchiostro, perché i percorsi non hanno classi ma hanno il colore come attributo). A 96 px un
  artefatto di 10 px sulla reference è un pixel, e la demo non lo mostra; l'utente li vedeva
  ingrandendo. È il gemello a schermo delle tavole `ciclo-*.png` del generatore.
- ⚠️ **`sharp` ridimensiona prima di comporre, qualunque sia l'ordine delle chiamate.** Una griglia
  di coordinate disegnata alla misura del ritaglio e composta dopo `resize()` finisce **centrata e a
  1:1** sull'immagine ingrandita: le etichette sembrano giuste e sono spostate di decine di pixel.
  Misurato il 2026-09-19 leggendo coordinate sbagliate della coscia. La griglia si disegna alla
  scala d'uscita e si compone su un buffer già ridimensionato; e le coordinate che contano si
  leggono con la **sonda per colonna**, che stampa i tratti di colore riga per riga.
- ⚠️ **jsdom non ha `AnimationEvent`, e la cosa costa due volte.** `fireEvent.animationEnd` ripiega
  su `Event` e **scarta** `animationName`. E React, non trovando `AnimationEvent` in `window`,
  registra `onAnimationEnd` sul nome **col prefisso** — `webkitAnimationEnd`, perché
  `WebkitAnimation` sta in `style` — quindi un `animationend` liscio non arriva a nessun handler.
  Prima della sonda il test di `onDone` restava a zero chiamate **anche col filtro spento**, e
  sembrava un difetto del componente. `tests/Rat.test.tsx` costruisce l'evento a mano, col nome che
  React ascolta deciso come lo decide lui.
- ⚠️ **Un `Math.random` nello stato iniziale di un componente client rompe l'idratazione.** Il
  componente viene reso anche sul server, e il client pesca un altro numero: React scarta l'HTML,
  ridisegna tutta la pagina e in console compaiono «Hydration failed» **e** l'avviso sullo
  `<script>` del tema, che è una conseguenza del ridisegno e non la causa. La cura non è un
  `setState` in un effetto — `react-hooks/set-state-in-effect` lo rifiuta — ma
  `useSyncExternalStore` con `() => true` sul client e `() => false` sul server: server e
  idratazione rendono il vuoto, il ratto compare al render successivo. ⚠️ **Ma il giro migliore è
  non avere niente da pescare al primo render**: `RatSwarm` nasce con la lista vuota e pesca solo
  dentro un timer, quindi server e idratazione rendono lo stesso identico niente per costruzione —
  e quando `/corsa` è passata allo sciame, il `useMontato` che serviva alla demo scritta a mano è
  sparito con lei. Lo stesso `useSyncExternalStore` resta invece dov'è indispensabile: in
  `useReducedMotion`, che una risposta diversa fra server e client ce l'ha per natura.
- ⚠️ **In una scheda in secondo piano il browser sospende le animazioni, quindi `animationend` non
  arriva e nessun ratto esce mai.** Misurato il 2026-09-19 sul playground contando i `.pb-rat-run`
  ogni 700 ms: con la scheda **dietro** lo sciame sale al tetto e ci resta — 3, 4, 4, 4, 4, 5, 5,
  5… — e appena portata **davanti** la stessa pagina oscilla fra 1 e 4. Non è un difetto della
  fine detta da `animationend`, che è quella giusta: un timer toglierebbe un ratto ancora a metà
  schermo. La cura è **non farne nascere**: `RatSwarm` salta il turno quando `document.hidden` è
  vero e riprogramma il giro dopo, così al ritorno il passaggio riparte da sé e chi stava già
  attraversando finisce la sua corsa. ⚠️ **Un tetto ai ratti insieme non è la cura**: limita il
  danno invece di toglierlo, e per questo `maxAlive` è solo una scelta di regia, senza valore
  predefinito. L'originale tagliava più corto, togliendo **tutti** i ratti al `visibilitychange`.
- ⚠️ **Una decorazione che con «meno movimento» non compare è indistinguibile da una rotta, e va
  detto dove si guarda.** `RatSwarm` con `prefers-reduced-motion` non genera niente — la
  traversata lì dura un millisecondo, quindi sarebbe un guizzo invisibile pagato con un timer
  acceso — e la regola sta in tre posti apposta: il JSDoc del componente, il suo test, e la riga
  **sempre visibile** sotto la demo di `/corsa`, che la spiega anche quando la preferenza è
  spenta. La preferenza la dichiara la persona nelle impostazioni del sistema, non la pagina; da
  JavaScript si legge con `useReducedMotion`, che è l'unico caso in cui serve leggerla — tutto il
  resto obbedisce da solo con la regola in fondo a `animations.css`.
- ⚠️ **React non ascolta `pointerenter`: se lo fabbrica da `pointerover` e `pointerout`.** Quelli
  registrati sulla radice sono solo i secondi due, quindi in un test un `fireEvent.pointerEnter`
  non arriva a nessun handler — si manda `pointerOver`. ⚠️ E `pointerType` va scritto a mano:
  jsdom non ha `PointerEvent`, `@testing-library` ripiega su `Event`, ed `Event` di quel campo non
  sa niente e lo **butta** — esattamente come fa con `animationName`. Senza, un tocco è
  indistinguibile da un mouse e metà dei casi passano per il motivo sbagliato.
- ⚠️ **Su un telefono «sopra» non esiste, e un easter egg appeso all'entrata e all'uscita del
  puntatore ne mostra uno solo.** Col dito il browser manda `pointerenter` **prima** di
  `pointerdown` e `pointerleave` **dopo** `pointerup`: il tocco apre e chiude nello stesso gesto.
  La cura non è ascoltare un altro evento, è cambiare il modo: al tocco parte una **raffica a
  tempo** che si spegne da sé e che alzare il dito non interrompe. ⚠️ E resta il problema di
  prima: un easter egg che si scopre solo passandoci sopra non si scopre affatto — in
  RattInventario le schede della firma non danno **nessun** segno di essere vive. Per questo
  `HoverEmitter` fa un cenno da fermo (`pb-hover-hint`, un saltello ogni sei secondi), e lo spegne
  mentre sputa.
- ⚠️ **Una prop che deve arrivare a un componente client da una pagina server si progetta come
  dato, non come funzione.** È il terzo lato del confine, dopo `render` e i dati esportati da un
  modulo `'use client'`: un oggetto con dentro una funzione **non si serializza**, e il prerender
  muore. La taratura di `HoverEmitter` è per questo fatta di soli numeri e stringhe — ogni quanto,
  quanto vive, che cosa c'è scritto, dove nasce — invece di portare un `emit()` che dipinge. Il
  prezzo è dichiarato (quello che vola è testo), il guadagno è che `binaryRain()` si può chiamare
  da una pagina server, stampare a schermo e ritoccare con uno spread. Lo prova `next build`:
  `/tocco` resta statica.
- ⚠️ **`.pb-binary-digit` dichiara l'animazione senza durata, cioè a zero secondi.** Con
  `forwards`, una cifra senza `animationDuration` scritto addosso salterebbe dritta all'ultimo
  fotogramma, che è trasparente: presente nel DOM e invisibile. La durata la scrive chi genera
  l'elemento, ed è **lo stesso numero** della sua vita — così non si possono disallineare. È anche
  il motivo per cui lì la rimozione è un **timer** e non `animationend`, al contrario di `RatRun`:
  un ratto tolto in anticipo sparisce a metà schermo e si vede, un fumetto alla fine di
  `pb-bubble-pop` è già trasparente. In cambio, il timer arriva anche dove l'animazione non c'è, e
  non costringe il componente a sapere come si chiama l'animazione di una classe che riceve da
  fuori.
- ⚠️ **`translate` e `transform` si compongono, e sono la via per centrare un elemento che sta già
  animando la sua `transform`.** Il browser applica prima `translate`, poi `rotate`, `scale` e
  infine `transform`: `translate: -50% 0` sposta l'elemento di mezza **sua** larghezza e lascia
  l'animazione libera di scrivere la `transform` fotogramma per fotogramma. Le due vie che vengono
  in mente per prime non funzionano, e vale la pena saperlo: scritto dentro i `@keyframes` avrebbe
  spostato anche chi li condivide — `pb-bubble-pop` la usa pure `SpeechBubble` — e `margin-left:
  -50%` è mezza larghezza **del contenitore**, che non c'entra niente. Serviva perché un fumetto
  ancorato col proprio spigolo sinistro, largo 179 px su una scheda da 142, sbordava di **81 px** a
  destra e sembrava il fumetto di qualcun altro. ⚠️ E quel 179 è l'altra misura da non perdere: la
  frase più lunga di RattInventario stava dentro i suoi 180 px di `max-width` **per un pixel**.
- ⚠️ **`ScrollShadow` di HeroUI sbiadisce i primi 40 px anche quando non c'è niente da scorrere.**
  La variante `fade` ricava la dissolvenza da una **scroll timeline** CSS, e il suo stesso
  commento dichiara che un contenitore senza traboccamento lascia le due sfumature a zero. Non è
  così: con niente da scorrere l'intervallo dell'animazione è lungo **zero**, il progresso cade
  a fondo corsa invece che a inizio, e la maschera vale `transparent 0 → #000 40px`. Misurato il
  2026-09-20 su `/voce`, filtrando «ratto»: il titolo `RAT_PHRASES 3 su 19` cadeva lì dentro e
  si leggeva slavato, con `opacity` **1** e il colore giusto — è il paint che manca, non lo stile,
  quindi cercandolo in `getComputedStyle(nodo).color` non si trova. Si legge in `maskImage` del
  contenitore. La cura è non usarlo dove il contenuto può stare tutto: un `overflow-y-auto` con
  la utility `scrollbar` di HeroUI dà lo stesso riquadro senza maschera.
- ⚠️ **Un popover di HeroUI vuole un elemento interattivo vero come grilletto, e in TSX va detto
  anche al tipo.** `Popover.Trigger` usa `Pressable`, che clona il figlio e non aggiunge né `role`
  né `tabIndex`: col suo `<div>` predefinito il menù si apre col mouse e **non da tastiera**. Si
  passa un `<button>` con `render`, come per `Surface`, ma qui in più serve il parametro generico
  — `<Popover.Trigger<'button'> render={(props) => <button {...props} />}>` — perché senza, `tsc`
  tipa le props per un `<div>` e rifiuta il `ref`. Con `Surface` non succedeva perché `<header>`
  accetta le props di un elemento generico, mentre `<button>` no. ⚠️ **E un collegamento dentro un
  popover lo chiude da sé**: con Next la barra non si smonta cambiando pagina, quindi il menù
  resterebbe aperto sopra la pagina nuova. Si chiude nell'`onClick` del collegamento, non in un
  effetto che guarda il percorso — quello sarebbe un `setState` in un effetto, che
  `react-hooks/set-state-in-effect` rifiuta.
- ⚠️ **Tutto ciò che vola esce dal suo riquadro, quindi vive in un portale — non in un
  `absolute`.** La riga di una barra **deve** tagliare il traboccamento, o non scorrerebbe di
  lato: qualunque cosa nasca lì dentro e voli via viene mozzata. Misurato il 2026-09-20 nel piede
  del playground: lo scoppio del comando donazioni si vedeva per un terzo, i fumetti della firma a
  metà. La cura è una sola per tutti — `EffectLayer`, un `createPortal` sul `body` a `z-50`,
  sopra anche le due lastre che stanno a `z-20` — con gli elementi in `position: fixed` e il punto
  di partenza **misurato al gesto** con `getBoundingClientRect`. ⚠️ **Il prezzo si paga nei
  test**: le coordinate diventano pixel della finestra, e in jsdom ogni rettangolo misura **zero**,
  quindi dall'elemento esce sempre `0px`. Le posizioni si provano sulla **funzione pura** che le
  calcola, passandole un riquadro finto; e le ricerche nei test vanno fatte sul `document`, non sul
  `container` di `render`. ⚠️ L'altro prezzo, dichiarato: se la pagina scorre durante il volo, le
  cose restano dov'erano sullo schermo — per un secondo, è quello che ci si aspetta.
- ⚠️ **`target="_blank"` e un'animazione da guardare non stanno insieme.** Il browser porta subito
  chi ha premuto sulla scheda nuova, e quello che succede su questa non lo vede nessuno —
  segnalato dall'utente sul comando delle donazioni. La cura è fermare la navigazione
  (`preventDefault`), far partire l'effetto e aprire **dopo**: ⚠️ `window.open` dentro un
  `setTimeout` funziona ancora, perché l'attivazione che un clic concede non finisce con la
  funzione — ma **dura poco, e non uguale dappertutto**. Misurata il 2026-09-20 con
  `navigator.userActivation.isActive` sul browser dello strumento: viva a 4,2 s, spenta a 5,2 —
  i canonici cinque secondi. Firefox però dichiara **un secondo** (`dom.disable_open_click_delay`)
  e Safari pretende che l'apertura stia dentro il gesto. Quindi l'attesa si tiene **sotto il
  secondo** (`MAX_WAIT_MS` a 900 ms) e si rinuncia all'ultimo pezzo dell'effetto, che intanto
  continua sotto la scheda nuova. ⚠️ **E quando la scheda non si apre, la pagina di chi ha premuto
  non si tocca**: portarla all'indirizzo — la prima idea — vuol dire far perdere lo stato
  dell'applicazione a chi voleva fare una donazione, e l'utente l'ha segnalato due volte. Si
  smette invece di trattenere il clic: il successivo lo fa il browser col gesto vero, che nessuno
  blocca. ⚠️ **E allora fra le opzioni di `window.open` non ci può
  stare `noopener`**: con quella parola la specifica prescrive che il valore di ritorno sia `null`
  **anche quando la scheda si è aperta**, quindi il ripiego non distingue più il successo dal
  blocco, scatta sempre, e chi ha premuto si ritrova la stessa pagina **due volte** — segnalato
  dall'utente il 2026-09-20, che vedeva aprirsi due ko-fi. Il legame si recide subito dopo con
  `scheda.opener = null`; il prezzo è il `Referer`, che con `noreferrer` non sarebbe partito.
  ⚠️ **Nel riquadro del browser dello strumento questi difetti non si vedono**: lì le finestre
  nuove sono bloccate sempre, `open` torna `null` per l'altro motivo, e nel primo caso si apriva
  una pagina sola. Si misura mettendo una **spia al posto di `window.open`** che registra gli
  argomenti e torna quello che si vuole provare — una finestra finta per il caso buono, `null` per
  il caso bloccato. ⚠️ **E i clic speciali restano del browser**: ctrl, cmd,
  shift, alt e il tasto centrale si lasciano passare, o si toglie a chi legge un gesto che si
  aspetta. ⚠️ Quanto aspettare **non si scrive nel comando**: lo chiede all'effetto, che è l'unico
  a sapere quante particelle sono e quanto vola la più lenta — `burst()` restituisce i millisecondi,
  e `0` quando non è partito niente. Poi il comando lo **taglia** al suo tetto: misurati 1728 ms di
  fontana, 904 fra il clic e l'apertura.
- ⚠️ **La stessa taglia non vale uguale alle due estremità della pagina, e un piede va misurato
  intero.** `PLAGUE_BAR_PADDING` è indicizzato **prima per posizione e poi per taglia**: 8/12/16 px
  per lato in cima, 4/8/12 in fondo — un'intestazione regge lo spazio che ha, un piede appiccicato
  lo toglie alla pagina a ogni schermata. Col contenuto di `PlagueFootBar` le tre taglie misurano
  **35, 45 e 57 px**. ⚠️ E il rientro dell'incavo segue la stessa scala, o su un telefono i due
  numeri si sconterebbero: `pb-[calc(var(--spacing)*1_+_env(...))]` per la piccola.
  ⚠️ **Quattro di quei pixel non venivano da nessun rientro**: un contenitore che dispone i figli
  in riga di **testo** fa una line box, e la line box lascia posto ai discendenti anche quando
  dentro c'è un solo riquadro. Il comando delle donazioni misurava 28 px e il suo involucro 32.
  Si cura dichiarando `flex` sull'involucro, e si scopre solo misurando l'elemento **e** suo padre:
  guardando il comando, i numeri tornavano.
- ⚠️ **Una taglia che deve cambiare col dispositivo si scrive in CSS, non in JavaScript.** È
  `isCompactOnMobile` su `PlagueBar` e `PlagueFootBar`, acceso di default: sul telefono la taglia
  dichiarata torna `small`. Un gancio che legge la larghezza risponderebbe **dopo** l'idratazione —
  il server non sa quanto è largo lo schermo — quindi ogni caricamento su un telefono muoverebbe
  la lastra di venti pixel a pagina già disegnata. ⚠️ **E si scrive mobile-first**: la taglia
  piccola di base, quella dichiarata dentro la variante. Al contrario — taglia piena di base e
  compattazione in una `max-*` — chi vince dipenderebbe dall'**ordine** delle due regole nel CSS
  generato, perché una media query non aggiunge specificità; e il giorno che la variante non
  venisse emessa, la lastra resterebbe grande sul telefono invece che compatta ovunque. Verificato
  nel CSS di produzione: 13 regole `pb-roomy:` in un solo `@media`, a 439928, contro le `py-*` di
  base a 431523. ⚠️ **La soglia guarda larghezza e altezza** — `@custom-variant pb-roomy` in
  `theme.css`, 40rem e 30rem — perché un telefono **coricato** è largo 844 px e alto 390: sulla
  sola larghezza passerebbe per un desktop proprio dove una barra e un piede `large` si prendono
  122 dei suoi 390 pixel. ⚠️ **E guarda la finestra, non il contenitore**, al contrario dei pezzi
  dentro la riga: il rientro sta sulla lastra, e una container query può interrogare solo un
  **antenato**.
- ⚠️ **Una classe `size-*` sostituisce l'attributo `width` di un `<svg>`, ed è l'unico modo di far
  rispondere a una media query un numero già stampato.** Misurato il 2026-09-20 sul marchio della
  barra: `width="24"` nell'attributo, **20 px** di disegno. Per questo accanto a ogni tabella di
  misure ce n'è una di classi — `PLAGUE_BAR_MARK_CLASS`, `PLAGUE_FOOT_MARK_CLASS` — e si passano
  **insieme**: il numero serve a chi non compatta, la classe a chi compatta, e un test tiene i due
  allineati leggendo il pixel dentro la classe. Chi passa solo il numero si ritrova un marchio
  grande in una barra bassa: sbagliato, ma non rotto. ⚠️ **Le classi vanno scritte per esteso**:
  `'pb-roomy:' + tabella[size]` darebbe la stringa giusta e **nessuna regola**, perché Tailwind le
  classi le cerca nel testo dei file — ed è il motivo per cui `plagueBarSizes.ts` ha due tabelle
  invece di una funzione.
- ⚠️ **Un'icona che si anima da sola è invadente: l'interruttore sta su chi la monta, non sul
  disegno.** `PotionMugIcon` porta le classi sui suoi pezzi (`pb-potion-bubble`, più due per i
  ritardi) e `animations.css` le anima **solo** dentro un antenato `.pb-potion-live`, che è
  `SupportButton` a mettere. Così la stessa tazza dentro una tabella resta ferma, e una classe di
  troppo non fa niente invece di far muovere qualcosa. ⚠️ **E le bolle vanno in tre tracciati
  separati**: in un `d` solo si muoverebbero in blocco, e tre bolle simultanee sono un lampeggio —
  la stessa regola dei due autori che sfalsano il cenno di due secondi. ⚠️ I `px` di una
  `transform` su un elemento SVG sono **unità del viewBox**, non pixel dello schermo, e `scale`
  vuole `transform-box: fill-box` o conta dall'origine del viewBox e la bolla scappa di lato.
  Misurato: da `+2` a `−3,5` di salita, scala da 0,4 a 1,1, opacità 0 → 1 → 0; 3,4 s a riposo,
  1,5 s sotto il puntatore o col fuoco.
- ⚠️ **Un segno che sostituisce il testo appartiene a una convenzione prima che al tema.** Sotto le
  32rem il comando delle donazioni si riduce a **36 px**: resta il solo segno, e l'ampolla della
  peste — bella, nostra e a tema — non diceva a che cosa serviva quel comando. Le convenzioni che
  nel software dicono «sostieni» sono tre: la **tazza** (ko-fi, BuyMeACoffee), il **cuore** (GitHub
  Sponsors), la **moneta**. `PotionMugIcon` tiene la sagoma della prima e ci mette dentro la nostra
  roba, liquido e bolle — lo stesso mestiere che fa il testo «offrimi una pozione», che è il calco
  di «offrimi un caffè». Segnalato dall'utente il 2026-09-20. ⚠️ E non ha sostituito l'ampolla:
  `PoisonIcon` resta il veleno dentro l'applicazione. Due segni, due mestieri.
- ⚠️ **Una lastra che tocca il bordo dello schermo deve tenere conto degli incavi, e `env()` da
  solo non basta.** `env(safe-area-inset-*)` vale **zero** finché la pagina non dichiara
  `viewport-fit=cover` — senza, è il browser a tenere il contenuto lontano dagli incavi, e la
  lastra non arriva mai al bordo. E il rientro si **somma** a quello della taglia, non lo
  sostituisce: `calc(var(--spacing)*3 + env(safe-area-inset-top))`, o su un telefono senza incavo
  il contenuto finirebbe a filo. ⚠️ In un valore arbitrario di Tailwind gli spazi si scrivono
  `_`, e attorno al `+` di un `calc` gli spazi **servono**: `calc(var(--spacing)*3_+_env(...))`.
  Verificato nel CSS generato, non supposto — sei regole, tre per lato.
- ⚠️ **Un colore dentro un portale non si eredita: `currentColor` è quello del `body`.** Le
  particelle uscivano del colore del testo della pagina invece che verdi, pur essendo generate da
  un comando `text-brand-ink`. Il colore va scritto sull'elemento che vola.
- ⚠️ **Una fontana non è un'esplosione, e la differenza è l'apice.** Pescare le direzioni su tutto
  il giro dà una girandola; una fontana sale rallentando, si ferma un istante in alto e ricade
  accelerando. Le due curve di tempo stanno **dentro i fotogrammi** (`animation-timing-function`
  su una keyframe vale per l'intervallo che comincia lì), perché una sola curva sulla classe le
  sostituirebbe entrambe. ⚠️ E le particelle partono **una dopo l'altra**: senza quei venti-trenta
  millisecondi di scarto l'una dall'altra, sedici segni che partono insieme tornano a leggersi come
  uno scoppio. Vale la stessa regola per due cose vicine che fanno lo stesso cenno: uguali e
  simultanee sembrano una cosa sola che pulsa, ed è il motivo per cui `CreditLine` sfalsa di due
  secondi il cenno di ogni autore.
- ⚠️ **Il piede si stringe guardando il suo contenitore, non la finestra, e le container query
  sbagliano nella direzione giusta.** `@lg:` senza nessun `@container` sopra non è un errore: la
  query non si applica e il pezzo resta nella sua forma **lunga**. Vuol dire che un pezzo montato
  fuori da `PlagueFootBar` non si rompe, si comporta come se ci fosse spazio — e che dichiarare
  `@container` sulla **riga** e non sulla lastra è ciò che fa comportare bene lo stesso piede
  dentro una colonna stretta.
- ⚠️ **Una barra che va a capo non è una barra: è tre barre.** Misurato il 2026-09-20 a 380 px di
  finestra: la barra del playground con le voci in una flex `flex-wrap` occupava **tre righe** e
  la lastra era alta il triplo — su una lastra appiccicata è spazio tolto alla pagina a ogni
  schermata. `BarRow` tiene una riga sola e scorre di lato; i figli vogliono `shrink-0` (che la
  riga mette con la variante `*:`), altrimenti vengono schiacciati invece di traboccare e lo
  scorrimento non compare mai. ⚠️ **E niente `tabIndex` sul contenitore**: la regola «una regione
  che scorre dev'essere raggiungibile da tastiera» è per i riquadri di testo. Qui dentro ci sono
  collegamenti, e il browser porta in vista quello che mette a fuoco — misurato: col fuoco
  sull'ultima voce la riga si era già portata a `scrollLeft` 543.
- ⚠️ **Due cose larghe quanto il loro testo non si separano disponendole: si separano nel tempo.**
  I fumetti dell'emettitore sono larghi quanto la frase che contengono — da 80 a 200 px su una
  scheda di 142 — quindi due che convivono si disturbano comunque, e allontanarli in verticale
  vuol dire mandarli **così in alto da staccarli** da ciò che li ha detti. Sono due giri persi a
  cercare la disposizione giusta prima di capire che la cura era un'altra: **uno per volta**, con
  la cadenza pari alla vita più un respiro, così il successivo nasce a scena vuota. Le corsie sono
  rimaste, ma a fare un altro mestiere — far comparire ogni fumetto da un'altra parte — e la
  pioggia binaria, dove una cifra è larga un carattere, di ventine insieme non soffre affatto.
- ⚠️ **Una «corsia» che è una fascia dentro cui si pesca non impedisce le sovrapposizioni.**
  L'altezza sorteggiata è il **bordo di sopra** dell'elemento, e l'elemento scende: uno nato in
  fondo alla sua corsia da 20 px, se è alto 18, entra per sedici in quella accanto. Misurato il
  2026-09-19 sui fumetti: dieci sovrapposizioni su ventiquattro campionamenti, con le corsie già
  attive. Le corsie giuste sono **altezze fisse ed equidistanti** — `min + k·(max−min)/(n−1)` — e
  quanto stare larghi lo decide chi scrive la taratura, perché quanto è alto ciò che nasce
  l'emettitore non lo sa. Con tante corsie quanti elementi vivono insieme, due non si toccano mai.
- ⚠️ **Nel riquadro del browser dello strumento, `document.hidden` è vero quando il riquadro non è
  in primo piano** — mentre una **scheda** dietro a un'altra lo lascia falso (misurato il
  2026-09-19, sono due cose diverse e si erano misurate a un'ora di distanza). Chi campiona
  qualcosa che dipende da `hidden` deve sapere quale dei due casi sta producendo: con il riquadro
  dietro, `/corsa` non fa passare **nessun** ratto — che è il comportamento giusto — e sembra rotta.
- ⚠️ **`ToggleButtonGroup` con `selectionMode="single"` *è* un `radiogroup`, e non serve cercare
  altro.** Misurato sul DOM il 2026-09-20: rende `role="radiogroup"` coi figli `role="radio"` e
  `aria-checked`, mentre con `"multiple"` diventa `role="toolbar"` con `aria-pressed` — e un
  `onSelectionChange` che consegna l'insieme **con dentro anche la scelta di prima**. Quindi la
  scelta fra poche cose che si escludono si veste così, che è anche l'idioma che il playground già
  usava. ⚠️ **E il `RadioGroup` di HeroUI non è l'alternativa**: `<Radio>` senza i suoi sotto-pezzi
  composti (`Radio.Content`, `Radio.Control`, `Radio.Indicator`) rende dei `<div>` **senza nessun
  ruolo** — un gruppo che a un lettore di schermo non esiste, e che a occhio sembra a posto.
- ⚠️ **I colori che HeroUI ricava da `--accent` sono tarati su un accento scuro, e il nostro lime
  non lo è.** `--accent-soft-foreground` è un `color-mix(in oklab, accent 70%, foreground 30%)`:
  col lime esce `#75a238`, che sul suo stesso fondo — lime al 15% sul chiaro — fa **2,76**. È il
  testo che dice **quale** opzione si è scelta in un `ToggleButtonGroup`, quindi l'unico che conta
  davvero. Ridichiarato in `theme.css` nei due blocchi: lime-800 in chiaro (**6,11**) e il lime
  pieno in scuro (**11,02**). ⚠️ In chiaro serve un gradino **più giù** di `--pb-brand-ink`, perché
  il fondo non è il bianco ma il bianco già tinto: il lime-700 lì si ferma a 4,31. Misurato il
  2026-09-20 su `/atmosfera`, e la stessa riga ha sistemato il filtro di `/voce`.
- ⚠️ **Un `translateY` in percentuale conta l'altezza dell'elemento, non del contenitore — e la
  cura è una colonna alta quanto il contenitore.** Una bolla da 40 px che sale del «100%» si sposta
  di 40 px. Mettendo la bolla in fondo a un `<span>` `absolute top-0 bottom-0`, invece, `-100%` è
  esattamente l'altezza del riquadro: dentro una scheda come su una pagina intera, senza container
  query e senza misurare niente in JavaScript. Lo usano le bolle (`pb-toxic-rise`) e le gocce
  (`--pb-drip-distance: 100%`), che per di più con `transform-origin: top` si **allungano** cadendo
  invece di spostarsi.
- ⚠️ **`getComputedStyle` oggi risponde in `lab()` e `oklab()`, e una regex sui numeri dà contrasti
  falsi e plausibili.** `lab(96.5432 -0.0000596046 0)` letto come RGB non lancia niente: dà solo un
  1,81 al posto di un 7,09, e un 1,16 al posto di un 14,52. Un colore CSS si risolve dipingendolo su
  un canvas 1×1 e leggendo il pixel. ⚠️ E lo sfondo va **composto**: gli strati traslucidi sopra
  quello opaco si sommano, e un'opzione selezionata con un velo al 15% non ha il colore della
  pagina sotto. Misurato il 2026-09-20 sbagliandolo due volte di fila.
- ⚠️ **Dopo aver aggiunto una classe ai sorgenti della libreria, il dev server va riavviato.** La
  regola nota è che il playground consuma `dist/` e va ricostruito; questa è la sua seconda metà, e
  costa di più perché **non assomiglia a un difetto di stile**. Tailwind scandaglia `dist/` per via
  dell'`@source` in `globals.css`, ma non lo **riscandaglia** quando `tsc` lo riscrive: le classi
  nuove non generano nessuna regola. Misurato il 2026-09-20 sulla città del fondale — quattro
  `.pb-city-block` nel DOM, `0×0` a schermo, perché `inset-x-0`, `h-[28%]`, `bg-gray-900/80` e
  `text-brand/70` non esistevano. Si riconosce cercando la classe fra le `cssRules` della pagina:
  se non c'è, non è il componente.
- ⚠️ **Una bolla di sapone e una sacca di gas tossico si distinguono per due cose, e nessuna delle
  due è il colore.** Il primo disegno era verde in ogni sua parte e l'utente l'ha letto come
  sapone: perché aveva il **riflesso quasi bianco** — il lampo speculare è il vocabolario del vetro
  — e perché era una **sfera perfetta**. Un gas fa luce da dentro invece di rifletterla, quindi il
  nucleo si accende (in `toxic`, con l'opacità) e il riflesso diventa verde; e una sacca di gas in
  un liquido si deforma, quindi il `border-radius` oscilla. Il cerchio resta come ripiego di «meno
  movimento», che è il caso in cui la deformazione non c'è.
- ⚠️ **Un lampeggio e un respiro sono la stessa animazione con due curve di tempo.** Una luce che
  va e viene con una curva morbida dice «sto caricando»; un **calo di tensione** dice che la
  corrente è marcia, e la differenza la fa `steps(1, end)`, che tiene ogni valore fino al
  fotogramma dopo invece di interpolarlo. Vale per le finestre della città, dove `animate-pulse`
  faceva sembrare i palazzi sette segnaposto in attesa di dati. ⚠️ E ogni luce ha la **sua**
  durata e il suo ritardo: sette finestre con lo stesso ciclo calano insieme, e insieme non sono
  sette luci — sono un temporale. È la stessa regola dei due autori del piede, che sfalsano il
  cenno di due secondi.
- ⚠️ **Un fumetto centrato sul punto in cui nasce esce dal riquadro quando quel punto è vicino a un
  bordo.** Largo 180 px sopra un palazzo al 10% di un fondale da 736 comincia a −45 px, cioè
  mozzato — ed è lo stesso difetto degli 81 px del fumetto della firma, dall'altro lato. La cura è
  che l'**ancoraggio dipenda da dove nasce**: spigolo sinistro contro il bordo sinistro, destro
  contro il destro, centrato in mezzo. Sta sulla proprietà `translate` scritta in linea, che vince
  su quella della classe e non tocca la `transform` che l'animazione sta scrivendo.
- ⚠️ **jsdom non sa suonare: `HTMLMediaElement.play` non è implementato, e lanciare è tutto quello
  che fa.** Si sostituisce con una spia che restituisce una promessa — che è il contratto vero — e
  quella spia è anche l'unico modo di provare il caso che conta: il **rifiuto**. Il browser blocca
  l'audio finché non c'è un gesto, e un comando che non gestisse quel rifiuto resterebbe
  «premuto» sopra un silenzio, più un errore non gestito in console.
- ⚠️ **Un componente che si tiene dentro l'elemento è un componente che non si può affiancare.**
  `MusicToggle` nasceva con l'`<audio>` e lo stato addosso, e finché era così il **volume non
  aveva dove stare**: un secondo comando altrove non avrebbe avuto niente da comandare. La forma
  giusta ce l'aveva già il livello tossico — provider che tiene la cosa, comandi che la leggono —
  ed è la domanda da farsi ogni volta che un pezzo possiede una risorsa: qualcuno vorrà
  governarla da un altro punto della pagina? Con l'audio la risposta è sì, e si vede subito.
  Segnalato dall'utente il 2026-09-20.
- ⚠️ **`Slider` di HeroUI senza i suoi sotto-pezzi rende un `<div role="group">` vuoto**: niente
  traccia, niente `<input type="range">`, quindi niente da afferrare col mouse e niente da
  annunciare. Vanno scritti `Slider.Track`, `Slider.Fill` e `Slider.Thumb`. È la stessa forma del
  `Radio` composto, e lo stesso modo di fallire: a occhio sembra solo un cursore che non si vede.
  ⚠️ E il `aria-label` sta sul **gruppo**, mentre l'`<input>` lo eredita con `aria-labelledby`:
  un test lo cerca con `getByRole('slider', { name })` e lo trova lo stesso.
- ⚠️ **L'autoplay che ripiega sul «primo gesto qualunque» è una trappola, non un ripiego.** È
  quello che fa `useAudioPlayer` di RattInventario: tenta `play()` dopo mezzo secondo, il browser
  lo blocca, e allora ascolta il primo `click`, `touchstart` o `keydown` della pagina. Vuol dire
  che chi preme un campo per scrivere il proprio nome si ritrova la musica addosso senza sapere
  che cosa l'abbia accesa, e senza aver chiesto niente. `MusicToggle` parte solo quando si preme
  **lui**, e tiene `preload="none"` perché quel megabyte e un quarto non lo deve pagare chi non preme.
- ⚠️ **Il tema si commuta ricaricando, non scrivendo la classe sulla radice da console.** Cambiando
  `documentElement.classList` a mano, su `/atmosfera` metà dei token di HeroUI seguivano e metà no —
  un'opzione non scelta misurava 1,16 in scuro, quando ricaricando ne fa 14,52. Si scrive
  `pb-playground-theme` in `localStorage` e si ricarica, che è la via che usa la pagina.
- ⚠️ **Un binario in una libreria `tsc` ha una terza via, e sopra i cento chilobyte batte il
  base64: `new URL('…', import.meta.url)`.** webpack 5 e Turbopack la riconoscono come «questo
  modulo dipende da quel file»: copiano l'asset nell'output dell'applicazione e sostituiscono
  l'espressione con l'indirizzo vero — misurato il 2026-09-20 sulla traccia,
  `/_next/static/media/ludoratti.<hash>.mp3`, identica byte per byte all'originale e servita in
  **206 Partial Content**, cioè a pezzi. È ciò che la base64 di `RAT_MASCOT_IMAGE` non potrebbe
  fare: 1,26 MB di audio dentro un modulo sarebbero 1,7 MB di JavaScript scaricati **prima** di
  sapere se qualcuno preme il comando, e `preload="none"` non vorrebbe più dire niente. ⚠️ **Il
  prezzo è che un bundler che non conosce quella forma sbaglia in silenzio**: fuori da un bundler
  `import.meta.url` è il modulo stesso, quindi l'indirizzo esce **plausibile** e punta accanto al
  file JavaScript — e un `<audio>` che prende 404 non lancia niente. Per questo la prop `src`
  resta e vince, e per questo un test verifica che il file esista davvero sul disco: è l'unico
  pezzo che nessun compilatore guarda. ⚠️ E il percorso **webpack** non è verificabile qui:
  `next build --webpack` su questo playground muore su `client-only` dentro
  `react-aria-components`, che è un'incompatibilità di HeroUI 3 col vecchio compilatore.
- ⚠️ **Alzare il bitrate non alleggerisce, e la qualità di una conversione si misura per banda.**
  Il bitrate *è* quanti dati al secondo: 320 kbps avrebbero portato la traccia da 2,04 a 3,54 MB.
  La leva vera è il codec, e quale scegliere si decide misurando — `highpass`+`lowpass`+`astats`
  su bande di 2 kHz, confrontate con l'originale. Su `LudoRatti.mp3` (VBR 182 kbps, 92,88 s):
  LAME `-q:a 6` sta entro **1,2 dB** fino a 20 kHz a **1256 KB**, mentre 128 CBR costa 200 KB in
  più ed è peggio su ogni banda; AAC 64 toglie fino a 8,4 dB in cima. ⚠️ **Opus esce identico
  all'originale e quella misura lo favorisce**: il suo CELT l'energia alta la **sintetizza**
  invece di trascriverla, quindi l'RMS per banda torna anche dove il dettaglio non c'è più. E la
  scelta finale non l'ha fatta il rapporto peso/qualità ma la **compatibilità**: MP3 è l'unico
  formato senza una sola riserva — Safari suona Opus in Ogg solo dal **18.4** (marzo 2025) e prima
  solo in CAF, e Firefox decodifica AAC solo se glielo presta il sistema.
- ⚠️ **Le nostre utility vincono su HeroUI senza dipendere dall'ordine degli import, perché i suoi
  componenti stanno in `@layer components`.** Verificato leggendo il suo CSS: `.avatar`, `.chip`,
  `.card` sono tutti lì dentro, e Tailwind v4 dichiara `theme, base, components, utilities` in
  quest'ordine. Vuol dire che vestire un componente di HeroUI è **aggiungere una classe**, senza
  `!important` e senza `:where()`. Serve saperlo perché la prima cosa che viene in mente è
  ridichiarare le sue variabili, che è la via giusta solo per i **colori** — la forma si cambia
  con una utility. ⚠️ Il suo `Avatar`, per dire, è un **quadrato stondato**
  (`border-radius: calc(var(--radius) * 3)`), non un cerchio, e le sue taglie sono tre: 32, 40 e
  48 px, con `.avatar--md` che **non esiste** perché la media è la base.
- ⚠️ **`Avatar` di HeroUI è `@radix-ui/react-avatar`, e in jsdom l'immagine non compare mai.**
  Radix rende l'`<img>` **solo dopo che si è caricata davvero**: fabbrica un `new Image()` e
  aspetta `onload`, che in jsdom non arriva — quindi un test che cerca `<img>`, `src` o `alt` è
  rosso per un motivo che non è un difetto, e quella parte è **confine dichiarato**. Nel browser
  succede l'opposto: a caricamento finito il **ripiego viene tolto dal DOM** (misurato il
  2026-09-20: 2 ripieghi su 7 ritratti, i due senza immagine). ⚠️ E la radice dell'avatar è
  l'unico pezzo di HeroUI **senza `data-slot`**: nei test si cerca per classe.
- ⚠️ **In tema chiaro `--background` di HeroUI è il colore della pagina, quindi una sfumatura che
  ci scende dentro dissolve la superficie.** Misurati il 2026-09-20: `--surface` è `#ffffff` e
  `--background` è `#f5f5f5`, che è il fondo del `body` — un pannello con
  `bg-linear-to-br from-surface to-background` finiva **1,09** di contrasto sulla pagina, cioè
  invisibile in basso. Un velo del **colore del marchio** tinge invece nei due temi. ⚠️ E vale
  la pena saperlo: `surface` contro pagina fa 1,09 in chiaro e 1,14 in scuro, perché a staccare
  una scheda in HeroUI è **l'ombra**, non il fondo.
- ⚠️ **Un cerchio vuoto con dei raggi dritti attorno è l'icona della luminosità, non un germe.**
  Il `BacteriaIcon` di `ludoratti.it` è esattamente quello, e a 64px dentro un fondale verde passa
  per un batterio solo grazie al contesto: portato a 24 accanto a una parola è un sole. È la
  seconda volta dopo il biohazard che un disegno dell'aggregatore non dice quello che il suo nome
  promette, e si scopre nello stesso modo — **affiancandolo alle altre alla misura vera**, non
  guardandolo da solo. Le due cure, misurate a occhio il 2026-09-20: i pili **curvi e tutti nello
  stesso verso** (i raggi di un sole sono dritti e speculari) e **tre** granuli dentro il corpo —
  due soli, simmetrici, si leggono come due occhi. Stessa regola per il bacillo: tre flagelli tutti
  da una parte sono lo scappamento di un razzo, due per polo sono peli.
- ⚠️ **HeroUI 3 non esporta nessuna icona.** Le sue diciassette — `CloseIcon`, `SearchIcon`,
  `DangerIcon`… — vivono **dentro** i componenti e non toccano `index.d.ts`: un `grep` su
  `Icon` lì dentro dà **zero**. Il `@heroui/shared-icons` coi 45 glifi che il censimento cita era
  della 2 e in questo repository non è installato affatto. Vuol dire che la regola «prima si cerca
  in HeroUI» sulle icone **si esaurisce subito**, e che ogni segno di questa libreria è per forza
  disegnato qui.
- ⚠️ **Una voce del lessico senza il termine generico accanto è una battuta che nessuno sa dove
  mettere.** `LUDORATTI_COPY` è un dato come `RAT_PHRASES` — i componenti ricevono le parole come
  prop, la libreria esporta il dizionario — e ogni voce porta `plain` **e** `house`: «Torna nelle
  fogne», da solo, non dice che è il comando di uscita, e il generico è anche la chiave con cui una
  persona cerca (si cerca la parola che si stava per scrivere). ⚠️ **E una sola voce si usa col
  generico accanto invece che al suo posto**: `delete`, perché un comando che cancella per sempre
  deve dire che cosa fa anche a chi non conosce il nostro vocabolario. ⚠️ Il dizionario è **di
  casa, non di un'applicazione**: «i tuoi manuali» non ci sta, e l'app se lo affianca. ⚠️ E la
  libreria lo **usa** in un punto solo — l'etichetta predefinita di `SupportButton` — che è quindi
  l'unico posto da cui può divergere, ed è tenuto da un test.
- ⚠️ **Un pezzo che fora e un pezzo che salda non stanno nello stesso tracciato.** È la regola che
  governa metà delle icone piene: `fill-rule="evenodd"` fa **cancellare** due sagome dove si
  sovrappongono — che è quello che serve per bucare tre granuli dentro un capside — mentre la
  soletta piena (`nonzero`, il predefinito) le **somma**, che è quello che serve perché una punta
  nata dentro il corpo ci resti attaccata. Con una regola sola si sbaglia sempre qualcosa: le punte
  del virione si staccherebbero dal capside, il collo dell'ampolla lascerebbe una tacca dove entra
  nella boccia, i tre lobi della cappa si bucherebbero a vicenda. Due tracciati, due regole.
  ⚠️ E dentro un tracciato `nonzero` **la mano conta**: due sagome girate al contrario si annullano
  dove si toccano, quindi i quadrilateri dei gambi vanno emessi nello stesso verso dei dischi dei
  pomelli, o ogni pomello si mangia la cima del suo gambo.
- ⚠️ **Tre delle quattro icone della peste di RattInventario sono glifi di Material Design Icons,
  e due dicevano un'altra cosa.** Si riconoscono dalla notazione compatta (`A9,9 0 0,0`, le `S`,
  niente spazi). Il «virus» è un **ingranaggio con un bersaglio dentro** — protuberanze trapezoidali
  attorno a due cerchi concentrici, cioè l'icona delle impostazioni — e il «veleno» sono due bocce
  affiancate con due gocce sopra, che a grandezza vera non dice niente. Segnalato dall'utente il
  2026-09-20 (*«il virus mi sembra sotto tono; poison, bella da vedere, ma non si capisce»*) e
  ridisegnati: il virione a pomelli e l'**ampolla della mascotte**. Resta di Material il teschio,
  che però dice quello che promette. ⚠️ **La regola operativa è che un glifo preso da una libreria
  generica va guardato alla misura vera prima di adottarlo**: il nome del file non è il disegno.
- ⚠️ **Un disegno che tocca i bordi del suo riquadro, alla stessa `size`, sembra più grande degli
  altri.** La nuvola di Material — quella che `ludoratti.it` usa — misura **0 → 24** in larghezza;
  le icone di casa stanno fra 1,5 e 22,5, il dado fra 3 e 21. È il motivo tecnico per cui un glifo
  di Material non si porta dentro e basta, oltre alla regola che Material non entra: in una riga di
  segni affiancati la differenza si vede, e non c'è nessuna prop per correggerla. Il riquadro vero
  si legge con `getBBox()` su un `<path>` montato fuori schermo — ⚠️ **che però non conta il
  tratto**: per un disegno a `stroke` va aggiunta mezza larghezza per lato.
- ⚠️ **Un `<svg>` con la larghezza scritta nell'attributo si lascia schiacciare lo stesso.** In una
  colonna `minmax(0, 1fr)` o in un flex, `width="56"` non è un pavimento: nella tabella dei segni
  del playground, a 375px le colonne valevano **20,9 px** e la riga etichettata «56PX» rendeva
  icone da ventuno, con l'attributo ancora addosso. Non somiglia a un difetto, somiglia a una
  tabella stretta. La misura va scritta nelle **colonne** — `repeat(n, 3.5rem)` — e l'involucro
  lasciato traboccare con `overflow-x-auto`.
- ⚠️ **Il colore letto dalla tela 1×1 esce premoltiplicato per l'alfa.** È la seconda metà del
  metodo dei contrasti: su un colore opaco il pixel è il colore, su uno **traslucido** è già
  `colore × alfa`, e ricomporlo sul fondo moltiplicando di nuovo lo scurisce due volte. Misurato
  il 2026-09-20 sul bordo di `PlaguePanel`: **2,75** invece di **1,99**. Si divide per l'alfa
  prima di comporre.
- ⚠️ **Un elemento decorativo che duplica testo vero sbaglia in tre mondi, e nessuno dei tre si
  vede guardando la pagina.** Il disturbo sul nome dell'aggregatore è il testo ricopiato due volte
  e sfalsato: l'albero di accessibilità si cura con `aria-hidden` — di là le copie sono
  pseudo-elementi con `content: attr(data-text)`, e il contenuto generato dal CSS alcuni lettori di
  schermo lo **annunciano**, quindi il titolo si chiama «LUDORATTI E.E.E. CORP» — ma
  `aria-hidden` non dice niente alla **selezione**, che è una gamma nel DOM: misurato il 2026-09-20,
  copiare il titolo dava «LUDORATTI E.E.E.EVIL CORP», con dentro la parola che l'easter egg
  dovrebbe nascondere. Le due cure sono `user-select: none` e `pointer-events: none`, e il primo
  problema si prova in un test mentre gli altri due stanno in [`COLLAUDI.md`](COLLAUDI.md).
- ⚠️ **Una classe che si anima e deve sparire con «meno movimento» nasce nello stato spento.** La
  regola in fondo ad `animations.css` toglie l'animazione, non l'elemento: quello che resta è lo
  **stato dichiarato nella classe**. Le lamelle del disturbo nascono con `clip-path: inset(50% 0
  50% 0)` e il lampo con `opacity: 0`, così fermi non c'è niente; con lo stato «aperto» nella
  classe resterebbero due copie integre spostate di due pixel, cioè l'aspetto di un difetto. È la
  stessa scelta della finestra della città, che ferma resta **accesa** perché una città spenta
  sembrerebbe un guasto: il ripiego si sceglie, non si eredita.
- ⚠️ **Una riga scritta fuori da ogni layer sovrascrive anche una singola proprietà di un'utility
  di Tailwind.** Le due lamelle del disturbo portano la stessa `animate-glitch` e devono avere
  durate diverse — con lo stesso ciclo si aprirebbero insieme per sempre, e due fette simultanee
  sono un unico sfarfallio, la stessa regola dei due autori del piede. Basta un
  `animation-duration: 2s` in `animations.css`: misurato il 2026-09-20 sulla pagina viva,
  `animationDuration` vale **2,5s** e **2s**. Vale perché le utility stanno in `@layer utilities` e
  le dichiarazioni non in un layer vincono su qualunque layer, a prescindere dall'ordine.
- ⚠️ **Una parola che compare solo a fette non si legge, si indovina — e un easter egg che non si
  legge non esiste.** Il lampo di `ludoratti.it` sono due fasce da pochi centesimi, ognuna mezza
  parola: l'utente l'ha detto il 2026-09-20 guardandolo — «si vede due volte incompleta, ma è
  troppo difficile da leggere». Le fasce restano, perché sono il segnale che tenta di passare, ma
  dopo serve un tempo in cui la parola è **intera**, e che duri più di tutte le fasce messe insieme:
  60 + 60 ms di sbirciate contro **255 ms** di parola. Con una parola **sopra un'altra** servono
  anche la lastra sotto — sennò il nome spunta fra le lettere — e `steps(1, end)`, o i tempi
  diventano dissolvenze, cioè un respiro invece di un guasto. ⚠️ E l'attesa fra un lampo e
  l'altro è una misura a sé: cinque secondi facevano credere che non ci fosse niente da aspettare,
  tre no.
- ⚠️ **Ma un tempo intero e lungo è un'insegna che si accende, non un guasto: quei 255 ms vanno
  spezzati.** Seconda correzione dell'utente, lo stesso 2026-09-20 — «ridurrei la sua durata, ma lo
  farei riapparire immediatamente dopo, un po' come stesse flickerando o sbalzi di tensione». La
  forma che regge è **45, 45 e 165 ms** con trenta millesimi di buio in mezzo, cioè un tubo al neon
  che prende la corrente: due colpi che non tengono e poi la tenuta. Il totale acceso non cambia e
  la parola si legge lo stesso, perché la si vede tre volte invece di una. ⚠️ Uno stacco da 30 ms
  esiste **solo** con `steps(1, end)`: interpolato è una dissolvenza che non si vede. È la stessa
  differenza fra `animate-pulse` e il calo di tensione delle finestre della città.
- ⚠️ **Un effetto che vale per un testo vale per ogni testo della stessa scena, e se ne vale per uno
  solo si vede.** Il disturbo stava sul nome e non sulla parola che il nome nasconde — «noto che
  evil non lo ha proprio», ha detto l'utente guardando. La cura non è ripetere il markup ma un pezzo
  che lo rende, `GlitchSlices`, montato due volte: per il nome come fratello, per la parola nascosta
  **dentro** di lei. ⚠️ E il dentro non è un dettaglio: opacità e `clip-path` valgono per tutto il
  sottoalbero, quindi le copie compaiono e spariscono col lampo; messe accanto girerebbero sopra il
  nome anche nei tre secondi in cui il lampo non c'è.

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
