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
- ⚠️ **Un'icona non risponde al ruolo `img` se non gliel'hai dato.** Un `<svg>` senza `role`
  esplicito per l'albero di accessibilità è un `graphics-document`, quindi un test che asserisce
  `queryByRole('img')` per dire «è decorativa» resta **verde anche togliendo l'`aria-hidden`** che
  dovrebbe difendere. Si asserisce l'attributo.
