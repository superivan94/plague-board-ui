# COLLAUDI.md

Gli scenari che vale la pena rifare quando si tocca l'area che descrivono. Quello banale — un
componente che compare, un colore che si vede — si fa e non si annota.

📌 **Il metodo di questo repository è il confronto**: il playground in locale su
[http://localhost:3100](http://localhost:3100) in una scheda, **`rattinventario.ludoratti.it`**
nell'altra, e si guarda se quello che abbiamo ricreato si comporta come l'originale. Quello che non
combacia si rifinisce, **oppure** si dichiara migliorato apposta — e in tutti e due i casi finisce
qui.

⚠️ **«Mai eseguito» è uno stato legittimo**: questo file è anche l'elenco di ciò che va provato,
non solo il diario di ciò che è stato provato.

---

### Le quattro icone della peste combaciano con quelle in produzione — 2026-09-16

**Esegue:** agente — le due superfici sono pubbliche, non serve un accesso.
**Ultima esecuzione:** agente, 2026-09-16 — **combaciano**.

**Preparazione:** `npm run playground`, poi una scheda su `http://localhost:3100` e una su
`https://rattinventario.ludoratti.it` (che è la pagina di accesso, cioè `/progettoE`: il fondale
della peste sparge lì tutte e quattro le icone).

⚠️ **Non si confrontano a occhio, si misurano.** In tutte e due le schede:

```js
[...document.querySelectorAll('svg path')].map(p => p.getAttribute('d'))
```

| Azione | Atteso | Ottenuto |
|---|---|---|
| I quattro `d` della produzione | veleno 874 caratteri, teschio 286, rischio biologico 357, virus 790 | 874 · 286 · 357 · 790 |
| Gli stessi quattro nel playground | identici, stessa lunghezza e stesso inizio | **identici** |
| `color="#22c55e"` sul playground | `fill` calcolato `rgb(34, 197, 94)` | `rgb(34, 197, 94)` |
| Nessun `color`, dentro `text-plague-700` | l'icona eredita: `rgb(21, 128, 61)` | `rgb(21, 128, 61)` |

**Che cosa protegge:** che il porting non abbia ritoccato un disegno «già che c'era». Un `d`
diverso di un carattere è un'icona diversa, e a occhio non si vede.

⚠️ **Quello che il confronto ha fatto notare, e che non è un difetto del porting:** tre dei quattro
disegni non si leggono come il loro nome. Il **virus** si legge come un ingranaggio, il **rischio
biologico** come un cerchio con tre satelliti — non come il trifoglio del simbolo vero — e il
**veleno** come due bolle. Sono i disegni della produzione, quindi la libreria è fedele: ridisegnarli
è una decisione sull'identità visiva, e la prende l'utente.

---

### I due temi convivono nella stessa pagina — 2026-09-16

**Esegue:** agente — è tutto nel playground.
**Ultima esecuzione:** agente, 2026-09-16 — **funziona nelle due direzioni**.

**Preparazione:** `npm run playground`, poi `http://localhost:3100`, sezione «I due colori che il
tema cambia». ⚠️ La pagina ha `dark` sull'`<html>`: l'isola chiara è quindi un `.light` **dentro**
un contesto scuro, che è il caso difficile.

```js
[...document.querySelectorAll('[data-ink]')].map(el => ({
  isola: el.closest('.light,.dark')?.className,
  colore: getComputedStyle(el).color,
}))
```

| Azione | Atteso | Ottenuto |
|---|---|---|
| `text-plague-ink` dentro `.light` | `plague-700`, `rgb(21, 128, 61)` | `rgb(21, 128, 61)` |
| `text-brand-ink` dentro `.light` | `brand-dark`, `rgb(77, 124, 15)` | `rgb(77, 124, 15)` |
| `text-plague-ink` dentro `.dark` | `plague-400`, `rgb(74, 222, 128)` | `rgb(74, 222, 128)` |
| `text-brand-ink` dentro `.dark` | `brand`, `rgb(163, 230, 53)` | `rgb(163, 230, 53)` |
| `bg-background` di HeroUI dentro `.light` | torna chiaro, dentro una pagina scura | `lab(96.54 …)`, cioè quasi bianco |
| Un'icona senza `color` dentro `.light` | eredita: `fill` = `rgb(21, 128, 61)` | `rgb(21, 128, 61)` |

**Che cosa protegge:** il meccanismo dei due temi, che è fatto di tre cose che devono valere
insieme — `@theme inline` (senza, Tailwind incolla il valore del tema chiaro dentro la classe e il
blocco `.dark` non serve a niente), i selettori come **classi qualunque** invece di `:root.dark`
(senza, due temi nella stessa pagina sono impossibili), e l'ordine dei due blocchi, che hanno la
stessa specificità.

⚠️ **E ha già trovato qualcosa**: il riquadro bianco delle icone non aveva la classe `light`,
quindi `text-plague-ink` ci valeva il verde del tema scuro — **1,74** di contrasto sul bianco,
cioè il difetto esatto che quel token esiste per impedire. È bastato dimenticare una classe.

⚠️ **Che HeroUI 3 riconosca anche `.light`, e non solo `.dark`, è una cosa misurata qui**: la sua
documentazione nomina `.dark` e `[data-theme="dark"]`, e il resto è il valore predefinito. Se un
giorno smettesse di funzionare, la riga di `bg-background` in tabella è quella che diventa rossa.

---

### HeroUI è vestito senza toccare un componente — 2026-09-16

**Esegue:** agente.
**Ultima esecuzione:** agente, 2026-09-16 — **il pulsante è dei Ludoratti senza una riga sua**.

**Preparazione:** `npm run playground`, poi `http://localhost:3100/stile`. Il pulsante «Entra nella
tana» è un `<Button variant="primary">` di HeroUI **senza nessuno stile addosso**: il solo
`theme.css` della libreria deve bastare a vestirlo.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Sfondo del pulsante | il lime del marchio, `rgb(163, 230, 53)` | `rgb(163, 230, 53)` |
| Etichetta del pulsante | quasi nero, `rgb(23, 23, 23)` — contrasto **11,89** | `rgb(23, 23, 23)` |

**Che cosa protegge:** la decisione che regge tutta la libreria — **si veste, non si riscrive**.
HeroUI 3 dichiara le sue utility con `@theme inline` sopra a variabili grezze (`--accent`,
`--accent-foreground`, `--success`), quindi vestirlo è ridichiarare quelle. ⚠️ Le nostre righe
stanno **fuori da ogni layer**: il tema di HeroUI è dentro `@layer base`, e una dichiarazione
senza layer vince comunque, senza dipendere dall'ordine degli import.

⚠️ **E l'etichetta scura non è un gusto**: col bianco sopra il lime fa **1,51**. In RattInventario
il pulsante primario è `bg-brand text-white` in 22 punti e fa 2,74 — qui non si ripete.

---

### I due segni della firma, ridisegnati, contro i glifi di Material Symbols — mai eseguito

**Esegue:** **l'utente** — la firma «By: Superivan94 · AI-Dev» sta nel piede di
`FooterBranding`, che vive nell'app autenticata e nel catalogo pubblico `/c/<slug>`. La pagina di
accesso non ce l'ha: verificato il 2026-09-16, `document.body.innerText` non contiene
«Superivan94» e non c'è nessun `.material-symbols-outlined`.
**Ultima esecuzione:** **mai eseguito**.

**Preparazione:** una scheda sul piede di RattInventario (dentro l'app, o su un catalogo pubblico
di cui si conosca lo slug), e una su `http://localhost:3100`, sezione «I segni della firma».

| Azione | Atteso | Ottenuto |
|---|---|---|
| `CodeIcon` a 20px accanto a «Superivan94» | le stesse due parentesi angolari del glifo `code`, a tratto | |
| `RobotIcon` a 20px accanto a «AI-Dev» | la stessa testa piena del glifo `smart_toy`: occhi tondi, orecchie ai lati | |
| Le due a 48px | restano leggibili, senza tratti che si chiudono | |

**Che cosa protegge:** sono le **uniche due icone ridisegnate da zero** — di là sono glifi di un
font scaricato da un CDN, che non entra nella libreria. Il disegno è quindi una ricostruzione, e
l'unica prova che valga qualcosa è metterlo accanto all'originale.

---

### Le tre altezze della barra, e il segno che le sta dentro — 2026-09-17

**Esegue:** agente — è tutto nel playground.
**Ultima esecuzione:** agente, 2026-09-17 — **le tre taglie sono distinte e il segno le segue**.

**Preparazione:** `npm run build` (il playground consuma `dist/`, non `src/`), poi
`npm run playground` e `http://localhost:3100/barra`. Le misure si leggono dal DOM, non a occhio:
`getBoundingClientRect().height` sulle tre `section header`, e l'attributo `width` del loro `<svg>`.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Rientro verticale delle tre barre | 8, 12 e 16 px | 8, 12 e 16 px |
| Altezza totale, con la riga di questa pagina | tre valori distinti e crescenti | 38, 50 e 66 px |
| `width` del marchio nelle tre barre | 20, 24 e 32 | 20, 24 e 32 |
| L'etichetta «segno …px» accanto al titolo | porta il numero | «segno 20px», «24px», «32px» |

**Che cosa protegge:** il difetto trovato proprio qui il 2026-09-17, e il punto è **come** si è
visto. `next build` era **verde**, i test erano verdi, la pagina si generava statica — e in pagina
il marchio era a 24 in tutte e tre le barre, con l'etichetta che diceva «segno px» col numero
mancante. Il motivo: `PLAGUE_BAR_MARK_SIZE` stava dentro `PlagueBar.tsx`, che dichiara
`'use client'`, e un modulo client non consegna a un componente server i **valori** che esporta —
gli consegna un riferimento. Indicizzarlo dà `undefined`, in silenzio.

⚠️ Quindi l'ultima riga della tabella non è un doppione della terza: la terza guarda il disegno,
l'ultima guarda **il numero scritto**, che è la cosa che si è vista mancare per prima. E l'altra
metà del difetto — la barra usata da una pagina server — quella sì che `next build` la prende:
`render` è una funzione e non attraversa il confine. Le due metà sono tenute da
`tests/boundaries.test.ts`.

---

### La taglia che si spegne da sé sul telefono — 2026-09-20

**Esegue:** agente — sono misure del DOM e del CSS generato, e si fanno tutte da qui.
**Ultima esecuzione:** agente, 2026-09-20 — **le due soglie scattano, e il segno le segue**.

**Preparazione:** `npm run build`, poi `npm run playground` e `http://localhost:3100/barra`. La
finestra si porta alle misure della tabella con l'emulazione del riquadro; i numeri si leggono da
`getComputedStyle(...).paddingTop` e `getBoundingClientRect()`, **non** a occhio. Le regole del CSS
di produzione si contano in `playground/.next/static/chunks/*.css` dopo `npm run build --workspace
playground`.

⚠️ **Le taglie che il playground non monta si provano con una sonda**, perché qui la barra è
`medium` e il piede `small`, e le lastre in mostra hanno la compattazione spenta: si appende al
`body` un `<div>` con le classi della tabella — e un `<svg>` col suo `width` scritto — si legge lo
stile calcolato e si toglie. Che da quelle classi ci arrivi davvero il **componente** lo tengono i
test di `brand.test.tsx` e `PlagueFootBar.test.tsx`: le due metà insieme fanno la catena.

| Azione | Atteso | Ottenuto |
|---|---|---|
| A 1280×900, la barra (`medium`) e il piede (`small`) del playground | rientro 12 e 4 px, segno 24 | 12 e 4, segno 24 |
| A 375×812 | la barra torna a `small`: 8 px e segno 20 | 8 px, segno 20 |
| L'attributo `width` del marchio, a 375 | resta 24: a cambiare è la regola, non il numero | `width="24"`, disegno **20 px** |
| A 844×390 — il telefono **coricato** | compatta lo stesso, per l'altezza | rientro 8 e 4, segno 20 |
| A 900×700 | torna alla taglia dichiarata | rientro 12, segno 24 |
| Sonda, a 1280×900: i tre rientri in cima e i due in fondo | 8/12/16 e 4/8/12 | 8/12/16 e 4/8/12 |
| Sonda, a 375×812: gli stessi cinque | tutti alla taglia piccola: 8 e 4 | 8, 8, 8 e 4, 4 |
| Sonda, i sei segni (marchio, tazza, autore × medium e large) a 1280×900 | 24/32, 22/26, 16/18 | 24/32, 22/26, 16/18 |
| Gli stessi sei a 375×812 | tutti al pavimento: 20, 20, 14 | 20/20, 20/20, 14/14 |
| Il confine in larghezza, con `large` in cima: 639×800 poi 640×800 | 8 px, poi 16 | 8 px, poi 16 |
| Il confine in altezza: 800×479 poi 800×480 | 8 px, poi 16 | 8 px, poi 16 |
| Le sei lastre in mostra di `/barra` a 375, con `isCompactOnMobile={false}` | non compattano | 8/12/16 in cima, 4/8/12 in fondo |
| Le regole `pb-roomy:` nel CSS di produzione | tutte in **un solo** `@media (min-width:40rem) and (min-height:30rem)`, **dopo** le regole di base | 13 regole a 439928, le `py-*` di base a 431523 |
| Scorrimento laterale a 375 | nessuno | nessuno |

**Che cosa protegge:** tre cose che nessun test in jsdom può vedere. La prima è **l'ordine**: le
due classi di una taglia compattata non hanno specificità diversa, quindi se la variante finisse
**prima** della regola di base la compattazione non succederebbe — e la pagina sembrerebbe
semplicemente «grande», senza niente di rosso da nessuna parte. La seconda è che una classe
`size-*` **sostituisce davvero** l'attributo `width` di un `<svg>`: è il meccanismo su cui poggia
tutta la compattazione dei segni, ed è una proprietà del browser, non nostra. La terza è la
soglia sull'**altezza**, che è l'unica cosa che distingue un telefono coricato da un desktop.

⚠️ **Una cosa resta dedotta e non misurata**, e va detto: che senza `theme.css` le lastre restino
compatte **ovunque** invece di restare grandi sul telefono. Non si prova qui senza smontare il
playground, ma segue dalla riga misurata a 375 — lì si vede esattamente la classe di base, che è
l'unica che sopravviverebbe se la variante non fosse dichiarata.

---

### Il fumetto interrotto: clic su clic, prima che il precedente sia finito — 2026-09-17

**Esegue:** agente — è nel playground, e si misura dal DOM.
**Ultima esecuzione:** agente, 2026-09-17 — **animazione e conto alla rovescia ripartono insieme**.

**Preparazione:** `npm run build`, `npm run playground`, poi `http://localhost:3100/voce`. Le misure
si leggono dal fumetto con `getAnimations()[0].currentTime` e l'opacità calcolata: a occhio questo
difetto si vede ma non si spiega, e infatti è stato **riferito** come due difetti diversi.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Clic, e si guarda dopo 0,6s | visibile, animazione a ~600ms | opacità 1,00 · 600ms |
| Secondo clic a 1,5s dal primo | l'animazione **riparte da zero** | 67ms · opacità 0,28 e in salita |
| Terzo clic a 3,0s | riparte ancora, e si vede | 75ms · opacità 0,31 |
| Quarto clic a 4,1s | riparte ancora, e si vede | 67ms · opacità 0,28 |
| Senza più toccare, a 2,3s dall'ultimo | sta svanendo | 2309ms · opacità 0,33 |
| A 2,7s dall'ultimo | smontato | smontato |

**Che cosa protegge:** il difetto che l'utente ha visto il 2026-09-17 e ha riferito come due —
«il messaggio dura meno» e «poi non funziona più finché non clicco fuori dal bottone». Era **uno**:
cambiando solo il testo React riusa lo stesso nodo, e **un'animazione CSS in corso non riparte per
un cambio di contenuto**. Misurato allora: al secondo clic `currentTime` valeva **1558ms** invece
di 0. Da lì tutto il resto — il fumetto svaniva quando scadeva la *prima* animazione e non 2,5s
dopo il clic; e una volta finita, `forwards` la teneva a **opacità zero**, così i clic successivi
cambiavano il testo di un nodo invisibile. Non c'entrava il fuoco sul pulsante: la cura era
smettere di cliccare per 2,5s, cioè lasciare che il timer smontasse il nodo.

⚠️ **Le prime due righe sono quelle che contano, e la seconda è quella che a occhio non si legge**:
un'animazione ripartita e una a metà corsa sembrano uguali nell'istante dello scatto. La riga
`currentTime` è l'unica che distingue «è ricominciata» da «sta finendo».

---

### Ogni testo, nei due temi, su tutte le pagine — 2026-09-17

**Esegue:** agente — si misura dal DOM, e a occhio non si fa.
**Ultima esecuzione:** agente, 2026-09-17 — **nessun testo sotto soglia, in nessuno dei due temi**.

**Preparazione:** `npm run build`, `npm run playground`. Per ogni pagina e per ogni tema si
percorre `main` e la barra, si compone lo sfondo **effettivo** — risalendo gli antenati e fondendo
le trasparenze nell'ordine giusto, perché la barra è semitrasparente — e si confronta col colore
del testo. Soglie WCAG: 4,5 normale, 3 per il testo grande.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Le quattro pagine in tema scuro | nessun testo sotto soglia | nessuno · peggiore **5,08** |
| Le quattro pagine in tema chiaro | nessun testo sotto soglia | nessuno · peggiore **4,58** |

**Che cosa protegge:** la passata che l'ha inaugurato ha trovato **otto** casi, e sette stavano nel
tema chiaro. Le cause erano tre, e nessuna si vedeva guardando:

- la **barra semitrasparente**: al 70% su pagina chiara componeva un grigio medio invece del nero,
  e i colori tarati sul nero ci finivano sopra — l'etichetta del commutatore a **2,05**, il
  collegamento corrente a **1,67**;
- i **token che leggevano il tema della pagina** dentro una superficie che resta scura: risolto
  dichiarando quelle superfici isole di tema scuro con la classe `dark`;
- `toxic` **scritto in toxic** dentro una frase, a **1,26** — nella stessa frase che dice di non
  usarlo come colore di testo.

⚠️ **Lo sfondo va composto, non letto.** Prendendo il primo `background-color` non trasparente che
si incontra, la barra risulta nera anche quando è grigia, e l'intero difetto sparisce dalla misura.

### Ogni segno e ogni anello di fuoco, nei due temi — 2026-09-17

**Esegue:** agente — stessa misura del testo, su ciò che testo non è.
**Ultima esecuzione:** agente, 2026-09-17 — **nessun segno sotto soglia**, tolte tre decorazioni
dichiarate.

**Preparazione:** come sopra, ma si percorrono gli `<svg>` con lato ≥ 16 e si mette a fuoco ogni
comando da tastiera per leggere `outlineColor`. La soglia qui è **3**, non 4,5: è la soglia del
contrasto **non testuale** — grafica che porta significato e indicatori di fuoco.

| Azione | Atteso | Ottenuto |
|---|---|---|
| I segni delle quattro pagine, nei due temi | nessuno sotto 3 | nessuno, tolte le tre decorazioni |
| L'anello di fuoco della mascotte, tema scuro | ≥ 3 | **13,43** |
| L'anello di fuoco della mascotte, tema chiaro | ≥ 3 | **4,58** |
| Il disegno di `RatMascot` sul fondo chiaro | non sparisce | pixel più scuro a **19,16**; il 29,5% del disegno stacca ≥ 3 |
| Il disegno di `RatMascot` sul fondo scuro | non sparisce | pixel più chiaro a **20,25**; l'81,7% stacca ≥ 3 |

**Che cosa protegge:** ⚠️ **la passata sui testi non vede questa roba, e i due difetti che ha
lasciato passare erano entrambi verdi su chiaro.** L'anello di fuoco della mascotte, scritto con
`brand`, faceva **1,38** in tema chiaro: un indicatore di fuoco invisibile è un comando che da
tastiera non si trova. E i segni delle demo, sempre in `brand`, lo stesso **1,38** — il lime va
bene *dentro* la barra, che è un'isola scura, e non sul fondo della pagina. Entrambi si curano con
`brand-ink`, che è il token fatto apposta.

⚠️ **Un raster si misura sui suoi pixel, non sul suo `color`.** Il topo bianco su una pagina bianca
è la domanda ovvia, e la risposta è nel disegno: il contorno scuro e spesso porta il pixel più
scuro a 19,16 sul fondo chiaro, e il corpo bianco porta il più chiaro a 20,25 su quello scuro. Si
scandisce la bitmap, si scartano i pixel quasi trasparenti, e si conta **quanto** del disegno sta
sopra soglia — non se un colore solo ci sta.

⚠️ **Le eccezioni si dichiarano, non si alzano le soglie.** Le tre uscite che restano sono gli
`<svg>` sparsi del bozzetto della direzione: `pointer-events-none absolute`, `aria-hidden="true"`,
`brand` al **19%**, cioè 1,52. Sono decorazione, e la decorazione è fuori dalla regola per
definizione. Una passata che non le sa distinguere non è una passata: è un numero.

### Il ricalco del ratto riproduce il modulo dati — 2026-09-18

**Esegue:** agente — è la prova che `ratArt.ts` è un prodotto e non un file a mano.
**Ultima esecuzione:** agente, 2026-09-18, dopo la passata di qualità con la lente a 2000px —
corpo 52 percorsi, teschio 16, collare 8, imbracatura 73, cornice `13 22 363 176`, 43,3 KB (erano
96/15/12/78 e 59,5 KB prima del despeckle); su `/stile` otto ratti con i kit richiesti, la cornice
del componente uguale a quella dello script.

**Preparazione:** `npm run art:ratto -- --anteprime <dir>`, poi `npm run build` e `/stile`.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Lo script parte dalle tre reference | i conteggi sopra, e nessun percorso nato fuori maschera | conteggi identici a due corse successive; `fuori: 0` pixel nel raster mascherato |
| Anteprima `ratto-corpo.png` | il grigio nudo senza trattini attorno | pulito; con l'anello di antialiasing non tolto c'erano trattini su coda e zampe |
| Anteprima `ratto-tutto.png` | teschio sull'orecchio, collare con la pedina, ampolla col tappo **e il collo**, dado | tutto presente; il collo mancava finché il vetro non ha avuto il suo recinto |
| Su `/stile`, in chiaro su bianco | otto ratti, kit come da etichetta, nessuna classe del disegno vecchio | 8, `SC-`/`--V`/`S-V`/`SCV`/`-CV`, zero `.pb-rat-tail` |
| Rigenerazione dal repository e da fuori | stesso modulo | identico salvo il commento d'intestazione |
| La lente a 2000px: testa, orecchio, groppa, ampolla, collare | etichetta col teschietto leggibile, dado con i puntini, nessun filetto chiaro fra rosa e inchiostro, teschio intero | tutto; con due passate di despeckle il teschietto era una nuvola e il dado puntini a mezz'aria |
| L'orecchio in primo piano col teschio addosso, sul grigio e sul bruno | rosa, come senza teschio | rosa; prima portava un anello chiaro — il bordo crema dell'orecchio del **bruno**, dello stesso colore dell'osso, entrato nel kit. Segnalato dall'utente sulle anteprime |
| I kit **da soli**, sulla testa (`kit-testa-solo.png`) | teschio, cinghia con la fibbia, collare intero con la pedina — e niente altro | così; prima c'erano due frammenti bruni e un blocco nero a spigoli sotto il teschio, e il collare mancava della punta in alto e a sinistra. Segnalato dall'utente |
| La linguetta viola a destra della pedina | c'è, a punta, come nella reference | c'è; era **due** componenti (349 e 142 px) divise da una piega d'inchiostro, e «la componente più grande» le lasciava fuori entrambe. Segnalato dall'utente |
| Il teschio a **due toni**, con l'orbita piena | osso chiaro sopra, ombra crema-tan attorno all'orbita e sotto il becco, orbita scura piena | così; prima l'ombra dell'osso — 3.817 px quantizzati a `brownBellyShade`, l'ombra della pancia del bruno — veniva scartata e il teschio sembrava mangiato attorno all'occhio e in punta al becco, e l'orbita era un buco che mostrava il pelo. Segnalato dall'utente |

⚠️ **Prima di tenere o scartare, si contano i colori dentro la maschera** (`SONDA=1` li stampa). Il
teschio conteneva 14.156 px di osso e 3.817 di `brownBellyShade`: un colore del pelo del donatore
che lì dentro era ombra dell'osso. Il filtro dei colori del kit va scritto guardando quel conteggio,
non la tavolozza.

⚠️ **I kit si guardano da soli, senza il corpo sotto.** Il corpo nasconde: un frammento di pelo
bruno preso per cuoio, appoggiato sul grigio, sembra un'ombra. Reso da solo su grigio medio, ogni
cosa nel kit che non è il kit si vede. E il rettangolo di ricerca **va dove sta la cosa**, misurato
sulla reference ritagliata: la cinghia scende verso sinistra dietro la mascella (x 1040–1140), e un
rettangolo sulla guancia (1130–1260) raccoglieva l'ombra del pelo quantizzata a cuoio.

**Che cosa protegge:** la riproducibilità dell'arte. Se qualcuno ritocca `ratArt.ts` a mano, la
prossima `npm run art:ratto` lo cancella: il posto dove intervenire è lo script — semi, recinti,
tavolozza — o le reference. ⚠️ E i tre difetti che lo script ha avuto e non deve riavere: i kit
che si portano dietro il ratto donatore (pixel trasparenti col colore dentro), i trattini
dell'antialiasing (fondo non allargato), il tappo che galleggia (recinto che taglia il collo).

### La cornice di un SVG, misurata sui pixel dipinti — 2026-09-18

**Esegue:** agente — è una misura, e si rifà ogni volta che un disegno cambia.
**Ultima esecuzione:** agente, 2026-09-18, su `Rat` con teschio e ampolla, **dopo la coda ad arco**
— **11,75** / 0 / 229,5 / 88,25 dentro `11 -1 219 90`, `tuttoDentro: true`. Tre misure nello stesso
giorno, tre cornici diverse: 89,25 in basso con le zampe vecchie, 9,75 a sinistra con la coda a
ricciolo. Cambiare un pezzo cambia la cornice, e si rimisura ogni volta.

**Preparazione:** `npm run build`, `npm run playground`, la pagina che mostra il disegno vestito di
tutto. Si clona l'`<svg>`, gli si dà una cornice larga e nota, lo si serializza in un `data:` URI,
lo si disegna su una tela a **4×** e si cerca il primo e l'ultimo pixel con alfa > 8 nelle due
direzioni. Le quattro cifre, riportate nelle unità del disegno, sono la cornice.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Sinistra / alto / destra / basso dipinti | contenuti nella cornice dichiarata | 9,75 / 0 / 229,5 / 89,25 dentro `9 -1 221 91` |
| Stessa misura con la prima cornice, `7 -1 223 89` | — | i piedi a 89,25 **uscivano** dal fondo a 88 |
| Il test `il disegno sta tutto dentro la sua cornice` con l'altezza a 89 | rosso | rosso, e solo lui |

**Che cosa protegge:** ⚠️ **due modi sbagliati di misurare, entrambi provati.** `getBBox()` e
`getBoundingClientRect()` danno la geometria dei percorsi **senza il tratto** — sulla coda del ratto
di prima, −31,67 invece di −33,75. E una cornice scritta a occhio dopo aver spostato un pezzo taglia
in silenzio: qui i piedi, di un'unità e un quarto, e a schermo non si vede finché non si ingrandisce.

### L'elenco consultabile delle frasi — 2026-09-17

**Esegue:** agente — e qui è l'**unica** verifica che esiste: il playground non sta nel progetto di
test, che compila solo `packages/plague-board-ui`. Non c'è nessun test unitario su questa logica.
**Ultima esecuzione:** agente, 2026-09-17 — tutto come atteso.

**Preparazione:** `npm run build`, `npm run playground`, `/voce`, si apre «Le frasi, tutte quante».
⚠️ **Le righe con 33 sono della prima esecuzione**, quando le frasi dello sviluppatore erano
quattordici: da 2026-09-20 sono ventidue, e il totale è 41.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Aperto senza cercare | tutte le frasi, numerate come nell'array | 33, numerate da 0 (2026-09-17) · 41 (2026-09-20) |
| Si scrive `squit` | le quattro varianti, e zero fra le frasi dello sviluppatore | «4 su 33» · indici 0, 3, 7, 11 · `DEV_PHRASES 0 su 14` |
| Si scrive `e solo l` (senza accento) | trova «È solo l'inizio... 🏭» | «1 su 33» · indice 4 |
| Si scrive `zzz` | lo dice, invece di mostrare il vuoto | «0 su 33» e «Nessuna frase contiene «zzz».» |
| Esc nel campo | svuota e rimette tutto | valore `""`, 33 righe |
| Si sceglie `HoverEmitter` nel selettore «le dice» | resta solo l'elenco che quel componente usa davvero | un gruppo solo, `DEV_PHRASES 22 frasi · le dice TalkingMascot, HoverEmitter`, e la riga viva dice «22 frasi» |
| Si filtra `ratto` e si guarda il primo titolo di gruppo | leggibile come il secondo, non sbiadito | `mask-image: none` e nessun `.scroll-shadow` in pagina: prima la maschera valeva `transparent 0 → #000 40px` e mangiava i primi quaranta pixel |
| La scaletta dei titoli | nessun salto di livello | `h1` → `h2` → due `h3` |
| Il nome del comando, letto dall'albero | leggibile | «Le frasi, tutte quante · 33 in 2 elenchi» |
| Ogni testo, nei due temi | nessuno sotto soglia | nessuno, in entrambi |

**Che cosa protegge:** ⚠️ **due difetti che si vedono solo nell'albero di accessibilità, non a
schermo.** Il `Heading` di HeroUI vale `h3` se non gli si passa `level`, quindi sotto un `h1`
produceva un salto — e a video non cambia niente. E la spaziatura in CSS **non entra nel testo**:
la `gap` di una flex separa i riquadri ma non i caratteri, quindi il nome del comando veniva «…
tutte quante33 in 2 elenchi» e ogni riga «0Squit!». Si cura con un nodo di testo, `{' '}`, non con
un margine.

⚠️ **Non c'è nessun segnalatore automatico di doppioni, ed è una misura, non una pigrizia.**
Cercandoli a macchina sulle 33 frasi — stessa forma a meno di punteggiatura, oppure metà delle
parole lunghe in comune — escono **zero** doppioni veri e **otto** falsi allarmi, di cui sei sono
le varianti volute di «Squit!». Un avviso che grida al lupo sulle cose giuste si impara a
ignorare. La ricerca fa il lavoro: si scrive una parola e chi la ripete finisce in fila.

### Il piede: una riga sola, e lo scoppio che ne esce — 2026-09-20

**Esegue:** agente — `tests/PlagueFootBar.test.tsx` tiene il contratto (quale elemento, quali
classi, quante particelle, il nome accessibile del comando). Quello che solo un browser vero dice è
se la riga **sta davvero** su una riga alle due larghezze, e se le particelle si vedono o le taglia
qualcosa.
**Ultima esecuzione:** agente, 2026-09-20 — tutto come atteso, e le due righe sull'apertura sono
quelle aggiunte per il difetto delle **due pagine di ko-fi**.

**Preparazione:** `npm run build`, `npm run playground`, una pagina qualunque — il piede sta nel
layout, quindi c'è su tutte. La larghezza si emula col riquadro (900 e 380). ⚠️ Il comando delle
donazioni porta a un indirizzo vero: per provarlo si mette una **spia al posto di `window.open`**
che registra gli argomenti e torna una finestra finta — così si vede con quali opzioni si apre, se
il legame viene reciso, e se questa pagina si muove, senza andare da nessuna parte.

| Azione | Atteso | Ottenuto |
|---|---|---|
| A 900 px | firma a sinistra, versione al centro, donazioni a destra, su **una riga** | piede alto **35 px**, riga **26**; «Creato da · Superivan94 · AI-Dev · v0.1.0 · Offrimi una pozione» |
| A 375 px | «By:», **un autore solo**, la versione, e la sola tazza | piede alto **35 px**, contenuto 375 su 375: ci sta senza scorrere. Il comando senza testo è **38 × 26**, cioè sopra il bersaglio minimo di 24, col segno a 20 e il testo a `display: none` |
| Le tre taglie del piede | una scala vera, come quella della barra in cima | **35 / 45 / 57 px**, coi rientri 4 / 8 / 12 per lato — un gradino sotto gli 8 / 12 / 16 della lastra in cima — e i segni delle donazioni a 20 / 22 / 26 |
| La barra in cima a 380 px | una riga sola che scorre, non tre righe | barra alta **61 px** (prima ~150), riga 348 visibili su **891** di contenuto, `scorre: true` |
| Si porta il fuoco sull'ultima voce della barra stretta | la riga si porta in vista da sé | `scrollLeft` **543** senza che nessuno l'abbia scritto: è il motivo per cui non c'è nessun `tabIndex` sul contenitore |
| Si preme la tazza | sedici segni della peste zampillano dal comando, uno dopo l'altro | 16 particelle, ognuna con `--pb-dx`, `--pb-apex`, `--pb-dy`, `--pb-spin`, una durata e un **ritardo** suoi — es. `−61,1 / −82,6 / +50,5 px, 192°, 0,97 s` |
| Si mette in pausa una particella e la si porta a mano sui suoi istanti | **una parabola**: sale, si ferma in alto, ricade sotto il punto di partenza | y a 0 → **−55** → −80 → **−83** (apice, al 55%) → −63 → **+12**; la x scorre da −22 a −53 senza fermarsi; opacità 0 → 1 → 0,29 |
| Il colore dei segni | verde di casa, non quello del testo della pagina | `rgb(163, 230, 53)`, cioè il lime del marchio. ⚠️ Va detto sulla particella: nel portale `currentColor` è quello del `body`, non quello del comando |
| Si preme due volte di fila | il secondo getto non parte finché il primo non è finito | 16 particelle e basta: due getti sovrapposti non si leggono come due |
| Dove stanno le particelle, e i fumetti della firma | fuori dal piede, non tagliati dalla riga che scorre | tutti nel portale sul `body`, `position: fixed`, `z-index` **50**: il fumetto «EVVAI! FUNZIONA!» sta 3 px sopra il bordo del piede e si legge intero |
| I salti delle due schede autore | non partono insieme | `animation-delay` **0s** e **2s**: due schede che saltano allo stesso istante sembrano una cosa sola che pulsa |
| Si preme la tazza e si guarda **quando** cambia pagina | dopo un pezzo di fontana, e comunque entro il secondo | apertura a **904 ms** dal clic: la fontana dichiara 1728, il comando taglia a `MAX_WAIT_MS` = 900 perché oltre il secondo la scheda non si aprirebbe su Firefox |
| Si preme la tazza e si guarda **come** si apre | una scheda sola, e questa pagina ferma dov'è | **una** chiamata, `('https://ko-fi.com/superivan94', '_blank')` — niente `noopener` fra le opzioni — `opener` a `null` subito dopo, e `location` invariata. Misurato a 1660 px e a 375 |
| Quanto dura il credito che il clic concede | abbastanza da coprire l'attesa, ma non è la stessa cosa ovunque | `navigator.userActivation.isActive` **vero** a 4211 ms, **falso** a 5201: cinque secondi su Chromium. Firefox ne dichiara uno, Safari zero — da lì il tetto a 900 ms |
| Con `window.open` che torna sempre `null`, come in un browser che blocca | la pagina dell'applicazione **non si muove**, e il clic dopo passa al browser | una chiamata sola a 904 ms, `location` ferma su `/barra`; al secondo clic `defaultPrevented` è **false** e nessuna seconda chiamata: se ne occupa il `target="_blank"` del collegamento |
| Le bolle della tazza, a riposo e sotto il puntatore | salgono sfalsate, e sotto il puntatore più in fretta | tre animazioni `pb-potion-bubble` da **3,4 s** con ritardi **0 / 1,15 / 2,3 s**; col puntatore sopra, **1,5 s**. Fermate a mano: salita da `+2` a `−3,5` del viewBox, scala 0,4 → 1,1, opacità 0 → 1 → 0 |
| Il segno da solo, alle tre misure della pagina d'ingresso | si riconosce come tazza anche a 16 px | a 56 px tazza, manico, liquido e bolle; a 24 e a 16 la sagoma regge e restano il manico e il pelo del liquido |
| Si scorre a metà pagina | barra **e** piede restano in vista | a `scrollY` 400 tutti e due dentro la finestra: `position: sticky`, `bottom: 0` — e il piede resta nel flusso, quindi non copre niente |
| Le regole dell'incavo, nel CSS **generato** | sei, tre per lato, che sommano il rientro della taglia — e quelle di sotto seguono la scala del piede | `.pt-[calc(var(--spacing)*2_+_env(safe-area-inset-top))]` per la cima e `.pb-[calc(var(--spacing)*1_+_env(safe-area-inset-bottom))]` per il fondo, tutte risolte in `calc(... + env(...))`; il `meta` della pagina porta `viewport-fit=cover`, che è quello che le accende |
| La versione scritta nel piede | quella vera della libreria, non una copiata a mano | `v0.1.0`, letta dal `package.json` |
| `next build` | nove pagine ancora **statiche**, col piede in ogni layout | `○` su tutte e nove |

⚠️ **Il primo giro gli effimeri stavano dentro il riquadro che li genera**, ed è il difetto che
questo scenario esiste per non far tornare: la riga di una barra **deve** tagliare il traboccamento
o non scorrerebbe, quindi le particelle si vedevano per un terzo e i fumetti della firma a metà.
Non è un difetto che un test in jsdom possa vedere — là nessun rettangolo ha misura — e a schermo
si nota solo sapendo che cosa cercare. ⚠️ E il portale ha un prezzo che questo collaudo eredita:
le posizioni sono **pixel della finestra**, quindi le corsie e il centraggio non si provano più
leggendo l'elemento. Si provano sulla funzione che li calcola, dandole un riquadro finto; dove
nascono **davvero** lo dicono le righe qui sopra.

⚠️ **E per il giro dopo non l'ha aperto affatto**, portando invece _questa_ pagina su ko-fi:
trovato dall'utente, che ci ha perso lo stato dell'applicazione. È lo stesso `null` di prima con
una causa diversa — un browser che blocca davvero le finestre nuove — e la lezione è che il ripiego
non deve esistere: se la scheda non si apre, il comando smette di trattenere il clic e il
successivo lo fa il browser. Un piede non ha nessun diritto di portarsi via la pagina in cui si sta
lavorando.

⚠️ **Per un giro il comando ha aperto ko-fi due volte**, e le righe di questo scenario non se ne
accorgevano perché guardavano **quando** si apriva, non **come**. La scheda nuova partiva e insieme
partiva anche questa pagina, perché `window.open` con `noopener` fra le opzioni torna `null` per
specifica — anche quando la scheda si è aperta — e il ripiego pensato per le finestre bloccate
scattava sempre. Trovato dall'utente provandolo su un browser vero: qui dentro le finestre nuove
sono bloccate comunque, quindi si vedeva **una** pagina sola e il difetto non compariva. Da lì le
due righe sugli argomenti dell'apertura, che sono ciò che distingue i due casi.

⚠️ **Lo scoppio era uniforme, ed è diventato una fontana** su richiesta dell'utente: le direzioni
pescate su tutto il giro davano una girandola. Una fontana si riconosce perché ha **un apice** —
tutto sale rallentando e ricade accelerando — e perché le particelle partono una dopo l'altra:
sono le due curve di tempo dentro i fotogrammi e i 28 ms di `staggerMs`.

**Che cosa protegge:** il piede è l'unica parte dell'interfaccia che **chiede** qualcosa a chi
legge, e insieme la prima che si rompe stringendo la finestra: una riga che va a capo si porta via
un pezzo di pagina a ogni schermata, e un comando che si riduce a un segno senza nome diventa muto
per chi non vede lo schermo.

### La barra a famiglie, e i suoi popover — 2026-09-20

**Esegue:** agente — come sopra, il playground non ha test automatici. Quello che conta qui è la
**tastiera**, che è l'unico modo in cui un menù si rompe senza che si veda.
**Ultima esecuzione:** agente, 2026-09-20 — tutto come atteso.

**Preparazione:** `npm run build`, `npm run playground`, una pagina qualunque. Lo stato del menù si
legge da `aria-expanded` sul grilletto, non a occhio.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Si preme «Il ratto» col mouse | si apre col nome della famiglia, le sue pagine, i componenti e le righe di descrizione | «Il personaggio: come è fatto…» più `La corsa · RATRUN · RATSWARM` e `La lente · RAT` |
| Si preme una voce dentro il popover | si va alla pagina **e il menù si chiude** | `/corsa`, `aria-expanded="false"` su tutti e tre, nessun `[role=dialog]` in pagina |
| Si guarda quale famiglia è segnata | quella che contiene la pagina corrente | su `/corsa` è «Il ratto» a portare il colore e la sottolineatura |
| Col fuoco sul grilletto, Invio | apre, e il fuoco entra nel riquadro | `aria-expanded="true"`, `document.activeElement` è il dialogo |
| Esc | chiude e **riporta il fuoco** sul grilletto | `aria-expanded="false"`, `activeElement === grilletto` |
| Il nome del dialogo, letto dall'albero | dice quale famiglia è | `aria-label="Il ratto"`: senza, tre menù identici si annunciano tutti «dialogo» |
| I due temi | pannello leggibile su entrambi | bianco in chiaro, `lab(8.3 0.6 −2.1)` in scuro |
| I titoli dentro il popover | una riga per nome | «La voce» e «Il tocco» alti 18 px, cioè una riga: senza `whitespace-nowrap` il nome si spezzava per far posto ai tre componenti |

**Che cosa protegge:** un menù che si apre col mouse e non da tastiera — che è lo stato in cui
nasce un popover se il grilletto non è un elemento interattivo vero, perché `Pressable` di
react-aria **clona il figlio** e non aggiunge né `role` né `tabIndex`. ⚠️ E la chiusura alla
navigazione: con Next la barra non si smonta cambiando pagina, quindi un popover aperto resta
aperto **sopra** la pagina nuova, e non c'è nessun errore da nessuna parte.

### La barra che diventa un cassetto — 2026-09-23

**Esegue:** agente, ogni volta che si aggiunge una famiglia o una voce alla barra del playground;
**autore** per il dito su un telefono vero, che lo strumento non sa imitare.
**Ultima esecuzione:** agente, 2026-09-23 — tutto come atteso; la riga col dito mai eseguita.

**Preparazione:** `npm run playground`, una scheda con `resize_window` alle quattro larghezze. La
riga si misura con `clientWidth` e `scrollWidth` del primo figlio del `<nav>`: se il secondo supera
il primo, la barra taglia.

| Azione | Atteso | Ottenuto |
|---|---|---|
| 1660 px, prima della cura | la fila intera | **tagliata**: 1090 px di voci in una colonna da 1024, con 600 px di finestra liberi (segnalato dall'utente) |
| 1660 e 1280 px | la fila intera, senza scorrere | colonna **1120**, contenuto 1120 |
| 1024 e 375 px | marchio, «pagine · <corrente>», tema | sì, contenuto pari alla colonna; a 375 il nome del pacchetto cede il posto |
| Si preme «pagine» | il cassetto da sinistra, col fuoco dentro | `role="dialog"` di nome «Le pagine», fuoco dentro, 12 voci, la corrente con «sei qui» |
| Esc | si chiude | nessun dialogo in pagina |
| `BarRow` che trabocca (736 px in 312), rotella verticale e trascinamento col mouse, prima della cura | la riga scorre | **fermi a zero** (segnalato dall'utente); solo la rotella di lato arrivava in fondo |
| La stessa, dopo: due scatti, poi dieci | la riga scorre, la pagina no | 200 px, poi 424, cioè la fine; `scrollbar-width: thin` con un puntatore preciso |
| `PlagueBar` a 360, finestra 1400×500: uno scatto, poi un altro | la riga va in fondo, poi scende la pagina | riga a 82 (la fine) con la pagina ferma, poi pagina a 100 con la riga ferma: agli estremi la rotella non resta intrappolata |
| Il dito su un telefono vero | la riga si trascina di lato, la barra resta nascosta | **mai eseguito**: lo strumento manda clic di mouse anche quando imita un telefono. Tocca all'utente |

**Che cosa protegge:** che una voce in più non torni a tagliare la barra in silenzio. La soglia è
`xl` perché la fila piena misura 1090 px: chi aggiunge una famiglia rimisura qui.

### Il ratto corre attorno ai suoi perni, e la fine la dice `animationend` — 2026-09-18

**Esegue:** agente — in jsdom le animazioni non girano: il test tiene il contratto (classi, perni
come stile, filtro di `onDone`), qui si misura che il browser faccia il resto.
**Ultima esecuzione:** agente, 2026-09-19 — dopo il terzo giro del pupazzo (tutte le parti dietro
al tronco con giunto sintetico, coda in cinque segmenti fra gli anelli, padre sotto il figlio),
tutto come atteso sui dodici istanti del ciclo.

**Preparazione:** `npm run build`, `npm run playground`, `/corsa` in una **scheda nuova** — la
console dello strumento è cumulativa, e un errore di un caricamento precedente resta lì. Per le
cuciture, il **ciclo**: `npm run art:ratto -- --anteprime <dir>` rende `ciclo-{coda,groppa,zampe-davanti,intero}.png`,
tavole 4×3 con dodici istanti del passo (0,6 s ogni 50 ms) e le parti agli angoli che
`animations.css` dà in quel momento. ⚠️ Tre fotogrammi «agli estremi» scelti a mano non bastavano:
coi ritardi fra le parti l'angolo relativo peggiore capita in mezzo, e l'utente vedeva artefatti
che i fotogrammi non mostravano. Per attribuire un artefatto a una parte si mette a zero
l'ampiezza delle altre in `REGOLE`.

| Azione | Atteso | Ottenuto |
|---|---|---|
| `getComputedStyle` sulle parti del ratto in corsa | `transform-origin` uguale al perno scritto dal generatore, `transform-box: view-box` | posteriore vicina `140px 173px` e anteriore vicina `298px 165px` (i dischi sull'uscita), coda `137px 110px` → `51px 80px` sui cinque segmenti, corpo `231px 123px`, pedina `287px 139px`, dado `216px 116px`, ampolla `211px 57px`; cinghie ferme |
| `getAnimations()` sulle stesse | galoppo a coppie a **0,2 s** (scelto dall'utente col cursore della lente, ×1,5): vicine `pb-rat-gallop`, lontane `pb-rat-gallop-far`, una `alternate` e l'altra al contrario; coda `pb-rat-wave` sui cinque segmenti con ritardi 0 / −30 / −60 / −90 / −120 ms; corpo `pb-rat-bob`; pendagli 0,4 s | tutto così; 12 animazioni sul ratto con l'ampolla |
| La coda e le zampe nel DOM | cinque gruppi **annidati** in catena; **tutte** le parti prima del tronco, dopo solo i kit | `.pb-rat-tail-1 > … > .pb-rat-tail-5` presente; nessuna `pb-rat-part` dopo il tronco |
| Il ciclo, tavola `coda` | nessuna fessura ai giunti, anelli interi, onda che corre verso la punta | così sui dodici istanti; con tre segmenti e un decimo di ritardo si aprivano fessure bianche sulle colonne dei tagli |
| Il ciclo, tavola `groppa` | lo stinco posteriore esce da sotto la pancia e oscilla senza cuneo né nodo; la lontana esce da dietro con contorno e ombra | così; con la zampa vicina **davanti** al tronco fra stinco e pancia si apriva un cuneo bianco a ogni passo, e col disco più largo dello stinco restava un nodo nero sotto |
| Il ciclo, tavola `zampe-davanti` | niente cuneo fra lo stinco anteriore e il petto, niente blocco chiaro, la lontana con contorno | così; il disco doveva arrivare al contorno superiore dello stinco (raggio 32), con 29 restava un cuneo |
| `/lente`, altezza 900, fase 300 ms, tinte | il ratto fermo in cima al sobbalzo, il tappo dell'ampolla **intero** e non tagliato dalla cornice, ogni pezzo col suo colore e l'inchiostro nero | così: `overflow: visible` sull'`<svg>`, 12 animazioni in pausa a 300 ms, coda-3 `rgb(99,102,241)` e il suo inchiostro `rgb(16,0,32)`. Prima il tappo usciva mozzato anche da fermo — l'ombra quantizzava a pelo bruno, fuori dal filtro del kit — segnalato dall'utente |
| `/lente`, altezza 640, fase **80 ms**, tinte, ampolla | nessun pezzo di contorno staccato: né alla punta della coda, né sotto il piede giallo, né sotto la zampa gialla anteriore, né un pezzo blu sotto il piede; il capo del laccio sinistro tondo, non tagliato in verticale | così, dopo tre giri su segnalazione dell'utente: la fetta del piede nel recinto della coda, le dita fuori dal poligono, il contorno della lontana nel poligono della vicina, la fascia esterna della coda rimasta al tronco, il recinto dell'imbracatura che partiva a 690 con il nodo del laccio a 672. Ritagli a 1800 px in `ciclo/istante-80-*.png` con e senza tronco |
| `/lente`, la groppa sopra la zampa posteriore, a ogni fase | pelo grigio fino alla radice della coda, nessun triangolo rosa | così; era la **fusione** della coda (pelo → rosa nel rettangolo x < 520, y < 520) che arrivava sull'angolo della groppa: un triangolo di pelo a ref 492–520 × 496–520 usciva rosa nel tronco e nella coda, anche da fermo. Trovato coi riquadri dei percorsi rosa per parte; ora la fusione vale solo a 3 px dal rosa. E il bordo basso del poligono della lontana risale a 660 verso la groppa: a 700 prendeva la cima dello stinco della vicina. Segnalato dall'utente |
| Il ratto fermo accanto | nessuna animazione | `animationName: none`, `getAnimations()` vuoto |
| Il contenitore che attraversa | `pb-rat-cross-left` o `-right`, la durata pescata, da destra il disegno ribaltato | `pb-rat-cross-right`, `5.83s`, `top: 59%`, `-scale-x-100` sull'`<svg>` |
| Si segna il nodo e si aspetta la fine | il nodo dopo è **un altro**, con lato e altezza nuovi | il segno non c'è più; da `left`/`39%` a `right`/`34%` |
| Si campiona la fascia ogni 100 ms per 11 s | il ratto esce, la fascia resta **vuota** per la pausa, poi ne entra un altro | `presente` 4,51 s → `assente` 828 ms → `presente` 5,72 s → `assente` 828 ms → `presente`; quella pausa era della demo scritta a mano, che dal 2026-09-19 è uno `RatSwarm` con `maxAlive` a uno — l'attesa adesso è `everyMs`, e la catena che poteva girare a vuoto non c'è più perché non si rinasce nell'`onDone` |
| La console, in una scheda nuova | niente errori | solo React DevTools e `[HMR] connected`; prima della cura c'erano «Hydration failed» e l'avviso sullo `<script>` |
| Ogni testo di `main`, nei due temi | nessuno sotto 4,5 | 23 testi; minimo **6,91** in scuro, **4,58** in chiaro (l'etichetta di `TechRule`) |
| Le regole sotto `prefers-reduced-motion`, lette dai fogli | zampe senza animazione, traversata a 1 ms | `animation-name: none` sulle parti in corsa, `.pb-rat-run { animation-duration: 1ms }` — il browser dello strumento non emula la preferenza, quindi si leggono le regole e non si guarda |

⚠️ **La console dello strumento non si svuota cambiando pagina.** I due errori dell'idratazione
comparivano identici su `/barra`, che non ha niente di casuale: erano quelli di `/corsa` prima
della cura, rimasti nella coda. La misura vale in una scheda appena aperta.

⚠️ **I colori calcolati escono in `lab()`**, non in `rgb()`: un parser scritto per `rgb(` li legge
come trasparenti e il fondo scuro diventa bianco — la prima passata dava 2,56 a tutto il tema
scuro. Il modo che risponde è passare il colore a un `<canvas>` di un pixel e leggere i byte.

**Che cosa protegge:** il pupazzo. Se un perno si sposta — un poligono ritoccato nel generatore, un
`transform-box` perso in `animations.css` — le zampe ruotano attorno a se stesse e il ratto sembra
disarticolato, e nessun test in jsdom lo vede. E la cura dell'idratazione della demo: un
`Math.random` nello stato iniziale di un componente client si vede solo in console.

### Lo sciame: quanti insieme, e chi se ne va — 2026-09-19

**Esegue:** agente — il tetto, il comando a mano e il silenzio sotto «meno movimento» li tiene
`tests/RatSwarm.test.tsx` con i timer finti; quello che solo un browser vero dice è che cosa
succede quando la scheda **non è davanti**, perché lì è il browser a sospendere le animazioni.
**Ultima esecuzione:** agente, 2026-09-19 — tutto come atteso.

**Preparazione:** `npm run build`, `npm run playground`, `/corsa` in una **scheda nuova**. I ratti
vivi si contano con `document.querySelectorAll('.pb-rat-run').length`, campionando a intervalli di
un secondo: la fascia di sopra è quella con `maxAlive` a uno, quella di sotto lo sciame senza tetto.

⚠️ **La pagina «in secondo piano» va forzata, non ottenuta mettendo davanti un'altra scheda.** Nel
riquadro del browser dello strumento una scheda dietro continua ad animare e `document.hidden`
resta **falso**: misurato il 2026-09-19, dodici letture di seguito con un'altra scheda davanti e i
ratti che continuavano a passare. Si scrive il flag a mano —
`Object.defineProperty(document, 'hidden', { value: true, configurable: true })` — e si rimette
falso alla fine. In un browser vero la sospensione delle animazioni e `hidden` viaggiano insieme:
è l'API che esiste apposta per dire «questa pagina non la sta disegnando nessuno».

| Azione | Atteso | Ottenuto |
|---|---|---|
| Si campiona a pagina visibile | il numero oscilla: chi arriva esce, e ne entrano altri | 1, 2, 2, 2, 3, 3, 4, 3, 3, 2, 2, 3, 1, 2 |
| Si mette `document.hidden` a vero | **non nasce più nessuno**, e chi è in scena finisce la sua corsa e se ne va | 3, 3, 1, 1, 0, 0, 0, 0, 0, 0 — sei secondi di fascia vuota |
| Si rimette `document.hidden` a falso | il passaggio riprende da sé, senza ricaricare niente | 0, 2, 3, 3, 2, 3, 2, 3 — il primo ratto entro un secondo |
| Si preme «Fai uscire un ratto» dieci volte di fila | dieci ratti in più: senza `maxAlive` non c'è nessun tetto | da 2 a **12** insieme, e la fascia di sopra — quella con `maxAlive` a uno — resta a **1** |
| Si porta il cursore della cadenza a 0,4 s e poi a 15 s | la densità cambia davvero, e il numero scritto è quello in vigore | **6** ratti in quattro secondi a 0,4 s, **0** in cinque secondi a 15 s; la lettura segue il cursore — `[200, 600]`, `[1200, 3600]`, `[5000, 15000]`, `[7500, 22500]` — e a 10 s dà esattamente il valore predefinito della libreria |
| Si dà `animation: none` a un ratto in scena, come sarebbe la traversata spenta | resta **visibile e fermo** al bordo, e non se ne va più: nessun `animationend`, quindi nessun `onDone` | `x` 456 prima e 456 due secondi dopo, zero `animationend`, ancora nel DOM — è il motivo per cui con meno movimento la traversata dura 1 ms invece di essere spenta |
| La console, in una scheda nuova | niente errori, e in particolare nessuna idratazione fallita | solo React DevTools e `[HMR] connected`: lo sciame nasce vuoto, quindi server e client rendono lo stesso niente e il `useMontato` della vecchia demo non serve più |
| `next build` | `/corsa` ancora **statica**, con dentro un componente client | `○ /corsa`, otto pagine statiche su otto |
| I due temi, con i ratti in scena | testo e fasce leggibili, ratti visibili sui due fondi | così in chiaro e in scuro: il contorno d'inchiostro regge il ratto sul chiaro, le campiture sullo scuro |

⚠️ **Quello che questo collaudo non prova è `prefers-reduced-motion`**: il browser dello strumento
non emula la preferenza. Lì valgono il test — che monta lo sciame con `matchMedia` truccato e
verifica che dopo dieci secondi di timer e un `spawn()` a mano non ci sia **nessun** ratto — e la
lettura delle regole in fondo ad `animations.css`.

**Che cosa protegge:** il ciclo che nasce e toglie i ratti, cioè l'unica parte di questa famiglia
che vive nel tempo. Un `onDone` che non arriva si vede solo contando, e in una pagina che nessuno
sta guardando non si vede affatto: è la condizione in cui un difetto qui resta invisibile fino al
giorno in cui qualcuno torna su una scheda aperta da un'ora. ⚠️ **La prima stesura ci era cascata**:
generava anche a pagina nascosta e si difendeva con un tetto di quattro — misurato il 2026-09-19,
i ratti salivano a quel tetto e ci restavano (3, 4, 4, 4, 4, 5, 5, 5…). Un tetto limita il danno,
non lo toglie; la cura è non far nascere ciò che non può arrivare in fondo.

### L'emettitore: sfiorare, toccare, e chi arriva in fondo — 2026-09-19

**Esegue:** agente — la cadenza, la raffica del tocco, il salto e il silenzio sotto «meno
movimento» li tiene `tests/HoverEmitter.test.tsx` coi timer finti; quello che solo un browser vero
dice è che i pointer event **veri** arrivino come quelli costruiti a mano, che niente venga
tagliato dai riquadri, e che una taratura costruita da una pagina server attraversi il confine.
**Ultima esecuzione:** agente, 2026-09-19 — tutto come atteso.

**Preparazione:** `npm run build`, `npm run playground`, `/tocco`. Gli elementi in volo si contano
con `document.querySelectorAll('.pb-binary-digit').length` — o `.pb-comic-bubble` — campionando a
intervalli regolari. ⚠️ **Il tocco nel riquadro dello strumento non si può fare**: si manda a mano
sul nodo che porta `pb-hover-hint`, col tipo scritto dentro —
`new PointerEvent('pointerover', { bubbles: true, pointerType: 'touch' })` — e poi `pointerout`
dopo un decimo di secondo, che è quanto dura un tocco vero.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Si carica la pagina | tre emettitori fermi, ognuno col suo salto acceso | 3 nodi `.pb-hover-hint`, animazione `pb-hover-hint` di 6000 ms, iterazioni infinite |
| Si porta il mouse sulla scheda di Superivan94 | un fumetto per volta, e il salto di **quella** scheda si spegne | i salti passano da 3 a 2; `left: 48.4%; top: -77.5%; animation-duration: 3s` |
| Si campiona ogni 120 ms per undici secondi e si conta quanti ce ne sono insieme | **mai più di uno**, e fra l'uno e l'altro la scena resta vuota | `maxN` **1** su 90 letture, 5 delle quali a scena vuota; nascite a 2860, 3115 e 3240 ms l'una dall'altra, cioè i 3200 dichiarati |
| Si guarda dove nascono, uno dopo l'altro | ogni volta da un'altra parte: tre altezze a turno | `-77,5%`, `-55%`, `-100%`, in giro — e il fondo del fumetto sta fra **6 e 23 px** sopra il bordo della scheda, cioè dove la sua punta indica qualcosa |
| Si guarda quanto sbordano dalla scheda | poco, e da tutti e due i lati: il fumetto si **centra** sul punto in cui nasce | mai oltre il bordo destro (**−13 px** il più sporgente) e al massimo **24 px** oltre il sinistro, su una scheda larga 142 |
| Si mette in pausa l'animazione di un fumetto e la si porta a mano sui suoi istanti | entrata 0,25 s, due secondi e mezzo fermo, uscita 0,25 s | opacità **0 → 1 fra 0 e 180 ms** (con lo sbalzo a `scale(1.08)`), posato a `scale(1)` a **250**, fermo e opaco fino a **2750**, poi 0,32 a 2875 e **0** a 2999 |
| Si guarda se due frasi di fila sono uguali | mai: si pesca fra le altre | **0** ripetizioni su 11 uscite, 10 frasi diverse |
| Si misura la frase più lunga dentro un fumetto vero | sotto il `max-width`, o si scrive sul niente | «SONO UN MAGO DELLA PROGRAMMAZIONE!» fa **179 px** — sui 180 di RattInventario era a un pixel dal bordo, ed è il motivo dei 200 di adesso. Nessuna delle ventidue supera il riquadro |
| Si porta il mouse su AI-Dev | la pioggia sale e si assesta | 4, 8, 12, 16, 17, 18 campionando ogni 300 ms: è l'equilibrio fra 80 ms di cadenza e 0,8–1,8 s di vita |
| Si porta il mouse altrove | smette di generarne, e i diciotto in volo **finiscono la loro corsa** | 18, 10, 5, 3, 1, 0, 0 in due secondi e mezzo — nessuno sparito di colpo, e i tre salti tornano |
| Si manda un `pointerover` col dito e lo si alza dopo 120 ms | la raffica continua da sé per tre secondi, poi si spegne | 2, 4, 3, 5, 4, 2, 2, 1, 0 a mezzo secondo l'uno: genera fino ai 3 s di `tapMs`, poi solo drena |
| Il colore della pioggia nei due temi | segue `plague-ink`, che cambia col tema | `#15803d` in chiaro, `#4ade80` in scuro, su fasce leggibili in tutti e due |
| Le tre regole nel CSS **generato** | ci sono tutte: fotogrammi, classe, e la riga di «meno movimento» | `@keyframes pb-hover-hint`, `.pb-hover-hint { …6s…infinite… }`, e `.pb-hover-hint` dentro `@media (prefers-reduced-motion: reduce)` |
| `next build` | `/tocco` **statica**, pur costruendo tre tarature e passandole a un componente client | `○ /tocco`, nove pagine statiche su nove |

⚠️ **Il campionamento è avvenuto con `document.hidden` vero**, perché il riquadro dello strumento
non era in primo piano — e l'emettitore ha funzionato e si è ripulito lo stesso. Non è una
distrazione: è esattamente la differenza con lo sciame. Lì la fine la dice `animationend`, che in
una pagina nascosta non arriva mai, e quindi non si genera; qui la dice un timer, che scorre
comunque. ⚠️ E completa la nota del collaudo qui sopra: una **scheda** dietro a un'altra lascia
`hidden` falso, ma il **riquadro** non in primo piano lo mette vero. Chi misura una cosa che
dipende da `hidden` deve sapere quale dei due sta facendo.

⚠️ **Quello che questo collaudo non prova è `prefers-reduced-motion`**: il browser dello strumento
non emula la preferenza. Lì valgono il test — che monta l'emettitore con `matchMedia` truccato e
verifica che né il mouse né il dito facciano uscire niente — e la riga letta nel CSS generato.

⚠️ **Cinque numeri di questo scenario sono cambiati il 2026-09-19 dopo la prima esecuzione**, e
tutti e cinque per cose che l'utente ha visto guardando la pagina e il collaudo non chiedeva. I
fumetti duravano troppo poco per leggerli (2,5 → 3 s); si accavallavano; uscivano due volte di fila
uguali; e comparivano «lontani dall'oggetto sorgente» — misurato dopo, **81 px** oltre il bordo
destro di una scheda larga 142, perché il fumetto ci appoggiava lo spigolo invece di centrarcisi.
⚠️ E la cura delle sovrapposizioni ha richiesto **due** giri sbagliati prima di quello buono, che
è la parte da ricordare. Primo: dividere la fascia in tre corsie e **pescare dentro la fetta** —
restavano dieci sovrapposizioni su ventiquattro campionamenti, perché un fumetto alto 18 px nato in
fondo alla sua corsia da 20 sborda in quella accanto. Secondo: corsie ad altezze **fisse** —
niente sovrapposizioni misurate, ma l'utente guardando la pagina ha detto «non ci siamo», e aveva
ragione: **un fumetto è largo quanto la frase che contiene**, quindi due che convivono si
disturbano comunque li si disponga, e per separarli bisognava mandarli così in alto da staccarli
dalla scheda — «più in alto del dovuto». La cura vera è **uno per volta**: la cadenza è la vita più
due decimi, e le corsie sono rimaste solo per farlo comparire ogni volta da un'altra parte. È la
ragione per cui le righe qui sopra contano quanti ce n'è insieme invece di dire «sembra a posto».

**Che cosa protegge:** l'unico easter egg della libreria che si comanda con un **gesto**, e che
quindi ha due modi di essere rotto senza che nessuno se ne accorga. Il primo è quello di
RattInventario, dove tutto è appeso a `onMouseEnter`: su un telefono non succede niente, e non c'è
messaggio d'errore da nessuna parte. Il secondo è più sottile — un elemento che nasce e non muore —
e si vede solo contando: le due colonne del drenaggio qui sopra sono lì apposta.

### L'atmosfera: quattro livelli, e un fondale che sta dietro — 2026-09-20

**Esegue:** agente — `tests/PlagueBackground.test.tsx` e `tests/ToxicLevel.test.tsx` tengono il
contratto (quanti pezzi per livello, il tetto delle bolle, chi se ne va e quando, il `radiogroup`).
Quello che solo un browser vero dice è **dove finisce** quello che si muove: se le bolle passano
sopra il contenuto, se escono dal riquadro, e se il testo dell'opzione scelta si legge nei due temi.
**Ultima esecuzione:** agente, 2026-09-20 — tutto come atteso, tranne un contrasto che il collaudo
ha trovato e che è stato corretto in `theme.css` (ultime due righe).

**Preparazione:** `npm run build`, `npm run playground`, `/atmosfera`. Il riferimento sta in
un'altra scheda: `rattinventario.ludoratti.it/progettoE`, che è la pagina da cui il fondale viene.
⚠️ Le bolle di là si vedono solo dopo qualche secondo, perché nascono al ritmo del livello.

| Azione | Atteso | Ottenuto |
|---|---|---|
| **Il riferimento**: si guarda dove stanno le bolle di RattInventario rispetto al pannello | dietro, come un fondale | **davanti**: il loro riquadro è `fixed z-10`, il pannello è `relative` con `z-index: auto`, e il testo sotto una bolla non si legge |
| Il riferimento, contati i pezzi a livello `high` | — | **6 bolle** vive, da 46,5 a 81 px, salita 5,0–6,9 s |
| `/atmosfera` a livello `medio`, dopo 10 s | bolle dietro il pannello, dentro il riquadro | 2 colonne alte **416 px** — cioè l'altezza del fondale, non della finestra — con pelli da **26** e **31 px** e salita 7,8 e 5,7 s |
| Si sceglie `alto` | più di tutto | 6 icone che galleggiano, 3 gocce, bolle fino a 16, velo al 100% |
| Si sceglie `spento` | **niente**, non «meno» | 0 bolle, 0 gocce, 0 icone, velo a `opacity: 0`; resta il fondo e il pannello |
| La goccia, misurata | cade per l'altezza del fondale, e si allunga | `--pb-drip-distance: 100%` su una colonna `h-full`, `transform-origin: 3px 0px`, `pb-drip` a 7 s |
| A 375 px di larghezza | nessuno scorrimento laterale, niente che esce | `scrollWidth − clientWidth = 0`; **0** bolle oltre i bordi; lo strato è `overflow: hidden` |
| Console | nessun errore, nessun avviso di idratazione | nessun messaggio |
| Contrasti in **tema chiaro** | tutto sopra 4,5 | prosa e tabella **7,09**, etichette 4,58, dentro il fondale 12,61 / 19,01 / 7,42 / **5,02** |
| Contrasti in **tema scuro** | idem | prosa e tabella **7,90**, etichette 13,43, opzioni non scelte 14,52 |
| Il testo dell'**opzione scelta** del selettore, in chiaro | ≥ 4,5 | **2,76** ❌ — `#75a238` su lime al 15%: HeroUI lo ricava da `--accent` con `color-mix(… accent 70%, foreground 30%)`, e quella ricetta vuole un accento scuro |
| Dopo aver ridichiarato `--accent-soft-foreground` nei due blocchi | ≥ 4,5 nei due temi | **6,11** in chiaro (lime-800; il lime-700 si fermava a 4,31 perché il fondo è bianco già tinto) e **11,02** in scuro |
| `/voce`, che usa lo stesso gruppo per filtrare le frasi | migliora con la stessa riga | il filtro scelto passa da **2,76** a **6,11** senza toccare la pagina |
| **Secondo giro** — la città distopica di `ludoratti.it`, portata | quattro sagome col loro skyline, a qualunque misura del riquadro | fascia **736×116** su un fondale da 416, palazzi 48 / 80 / 64 / 32 px di larghezza e 36 / 71 / 47 / 24 % della fascia |
| A livello `spento` | la città resta, al buio | **4 palazzi**, **0 finestre** accese, 0 gocce, 0 icone, 0 bolle |
| A `alto` | tutte le finestre accese | **7 su 7**, ognuna col suo ritardo |
| A 375 px | niente esce dal riquadro | 4 palazzi e 2 gocce dentro, `scrollWidth − clientWidth = 0` |
| Le tre gocce | tre misure diverse, e una sagoma di goccia | **8×32, 12×48, 8×24**, `viewBox="0 0 8 20"` e `preserveAspectRatio="none"`, colore `oklab(…/0.7)` cioè `brand` al 70% |
| Una bolla, guardata da vicino a 40 / 90 / 150 px | un gas che brilla, non una bolla di sapone | riflesso **verde** (`bef264`, niente bianco), nucleo in `toxic` al 24%, alone da `0,34 × diametro`, e `border-radius` che oscilla — `52% 48% 46% 54% / 50% 46% 54% 50%` al primo fotogramma |
| Le animazioni di una pelle di bolla | tre, e le due lente in fase | `pb-toxic-sway, pb-toxic-wobble, pb-toxic-swell` a `3s, 3s, 6s` |
| **Terzo giro** — le finestre della città | uno scatto secco, e ognuna per conto suo | `pb-window-flicker 4.2s steps(1) 0.5s` sulla prima; sette durate e sette ritardi, tutti diversi |
| Le finestre ai quattro livelli | sempre sette, perché la città non è fatta di gas | 7 a `spento` come ad `alto`; 4 palazzi a ogni livello |
| Le tre gocce | tre misure, e tutta la larghezza | **8×22, 10×26, 7×18** al 12, 47 e 83 per cento — prima 8×32 / 12×48 / 8×24 al 28, 55 e 74 |
| La sagoma della goccia, a 120 px | una punta in cima e un bulbo tondo in fondo | il bulbo è un cerchio di raggio 4 centrato a `(4, 16)`; quella di `ludoratti.it` è appuntita a **tutti e due** i capi, cioè una mandorla |
| I versi che escono dalla città, a `alto` | uno alla volta, sopra un palazzo | «Squit-squadra, all'attacco!» a `left: 23.5%`, `top: 75.7%` — cioè sul tetto del secondo palazzo |
| Un verso lungo contro il bordo | non esce dal riquadro | `translate` vale `0 0` sotto il 25%, `-100% 0` sopra il 75%, `-50% 0` in mezzo; e il fumetto va a capo, al contrario di quello della firma |
| Si preme il comando della musica | suona, e il comando lo dice | `paused: false`, `currentTime` 3,93 su **92,84 s**, `volume: 0.4`, `aria-pressed="true"`, nome accessibile «Togli la musica» |
| Si preme di nuovo | si ferma | `paused: true`, `aria-pressed="false"`, nome «Metti la musica» |
| Al caricamento, senza toccare niente | silenzio | `play` non chiamato, `preload="none"`: i 2,1 MB non partono finché nessuno preme |
| **Quarto giro** — il cursore del volume, montato lontano dall'interruttore | lo comanda lo stesso | gruppo `role="group"` largo **192 px** con nome «Volume della musica», `value 40`, `step 10`; `audio.volume` 0,4 |
| Si abbassa il volume da tastiera mentre suona | il volume scende e **la musica non si interrompe** | da 40 a 30, `audio.volume` 0,3, `paused: false`, la traccia resta al suo punto |
| `Slider` di HeroUI senza i suoi sotto-pezzi | non rende niente da afferrare | un `<div role="group">` **vuoto**: nessuna traccia, nessun `<input type="range">` |
| **Quinto giro** (2026-09-23) — i versi ad `alto`, contati per 110 s | fino al tetto, **3** | **29** versi, **mai più di 2** insieme, due insieme per 2,8 s in tutto: il tetto non scattava mai, perché un verso vive 3,2 s e il successivo arriva dopo almeno 2,5 |
| La variante «versi fitti, al massimo tre» di `ToxicLevelProvider` — un verso ogni 0,4–0,7 s | tre, non sei | **13** in 15 s, al massimo **3** insieme |
| La variante «al massimo uno», stessa frequenza | uno per volta | **4** in 15 s, al massimo **1** |

⚠️ **Il contrasto si misura risolvendo il colore su una tela, non leggendo la stringa.** Oggi
`getComputedStyle` restituisce `lab(96.5432 -0.0000596046 0)` e `oklab(0.657609 …)`: una regex che
pesca i numeri e li tratta come RGB **risponde comunque**, e risponde numeri plausibili e falsi —
il primo giro di questo collaudo dava 1,81 alla prosa e 1,16 a un'opzione che sta a 14,52. Si
dipinge il colore su un canvas 1×1 e si legge il pixel.

⚠️ **E il tema si commuta ricaricando, non scrivendo la classe sulla radice a mano.** Cambiandola
da console, in questa pagina metà dei token seguivano e metà no, e ne usciva un 1,16 che non esiste.
Si scrive `pb-playground-theme` in `localStorage` e si ricarica, che è la via che usa la pagina.

⚠️ **Dopo aver aggiunto classi ai sorgenti della libreria, il dev server va riavviato.** Tailwind
scandaglia `dist/` per via dell'`@source` in `globals.css`, ma non lo **riscandaglia** quando `tsc`
lo riscrive: al secondo giro di questo collaudo la città era nel DOM — quattro `.pb-city-block`
contati — e misurava **0×0**, perché `inset-x-0`, `h-[28%]`, `bg-gray-900/80`, `bg-brand/50` e
`text-brand/70` non erano mai state generate. Si riconosce così: il markup c'è, i `getComputedStyle`
danno valori iniziali, e cercando la classe fra le `cssRules` non si trova.

⚠️ **I versi insieme si contano con un `MutationObserver`, non campionando.** Due versi convivono
per meno di un secondo, e un campione ogni 100 ms nel riquadro del browser ha detto «al massimo
uno» per 65 s — perché lo abbia mancato non è stato misurato; l'osservatore, che registra ogni
nascita e ogni rimozione, ha trovato sei sovrapposizioni in 110 s. Un campionamento che risponde «meno» di quanto
succede è la stessa forma di un contrasto letto da una stringa: una risposta plausibile e falsa.

⚠️ **Quello che questo collaudo non prova è `prefers-reduced-motion`**: il riquadro del browser non
emula la preferenza. Lì vale il test, che monta le bolle con `matchMedia` truccato e verifica che a
livello `alto` dopo un minuto non ne sia nata nessuna.

⚠️ **La musica si prova col clic, e il resto col test.** `HTMLMediaElement.play` in jsdom **non è
implementato**: lanciare è tutto quello che fa, quindi il comando lì si prova con una spia al posto
di `play`/`pause` — che è anche l'unico modo di provare il **rifiuto**, cioè il caso in cui il
browser dice di no e il comando non deve restare «premuto» sopra un silenzio. Quello che solo un
browser vero dice è se il file arriva e se suona davvero.

⚠️ **Tre cose del primo giro sono state rifatte al secondo, tutte segnalate dall'utente guardando
la pagina.** Le bolle «sembravano di sapone»: il riflesso quasi bianco e la sfera perfetta sono il
vocabolario del vetro, e nessun verde le avrebbe salvate finché restavano quelli. Le gocce erano
tre rettangoli identici col bordo **dritto in cima** — un taglio netto si legge come un pezzo
mancante, non come liquido — e ora sono la sagoma di `DripIcon` in tre misure. E mancava la città:
è in fondo a `ludoratti.it`, cioè nella pagina che decide come si veste un fondale dei Ludoratti, e
questo collaudo era stato scritto guardando solo RattInventario.

**Che cosa protegge:** un fondale ha un solo modo di essere rotto che conta, ed è **stare davanti**.
Di là succede, e non se ne accorge nessuno perché il testo torna leggibile appena la bolla passa.
La riga del riferimento in cima alla tabella è lì per ricordare che il difetto è quello, e le due
righe sui contrasti perché un comando che dice **quale** livello si è scelto, se quel testo non si
legge, non dice niente.

### La traccia viaggia col pacchetto, e l'indirizzo lo risolve il bundler — 2026-09-20

**Esegue:** agente — serve un `next build` e un browser vero: l'espressione che produce l'indirizzo
la sostituisce il bundler, quindi in jsdom non è mai stata risolta da nessuno.
**Ultima esecuzione:** agente, 2026-09-20.

**Preparazione:** `npm run build --workspace packages/plague-board-ui`, poi
`npm run build --workspace playground`; per le righe sul browser, `npm run playground` e
`http://localhost:3100/atmosfera`.

| Azione | Atteso | Ottenuto |
|---|---|---|
| `find playground/.next -name "*.mp3"` dopo il build | l'asset è stato emesso dall'applicazione, non copiato a mano | `.next/static/media/ludoratti.2g7la1ve2p52_.mp3` |
| `md5sum` dell'emesso contro `packages/plague-board-ui/assets/ludoratti.mp3` | identici: il bundler copia, non riconverte | `a2b1b94…` per entrambi, **1 286 311 byte** |
| La stringa nel chunk che monta il provider | non più `new URL(…)` ma un indirizzo assoluto | `"/_next/static/media/ludoratti.2g7la1ve2p52_.mp3"` |
| `next build` | dieci pagine statiche, come prima | ✅ tutte `○ (Static)` |
| Sulla pagina, l'attributo `src` dell'`<audio>` | lo stesso indirizzo anche in dev | `/_next/static/media/ludoratti.2g7la1ve2p52_.mp3` |
| Caricata la pagina, **prima** di premere: `performance.getEntriesByType('resource')` filtrato su `ludoratti` | nessuna richiesta: `preload="none"` | `[]`, con l'`<audio>` già nel DOM |
| Clic su «Metti la musica», tre secondi | suona dal file del pacchetto | `paused false`, `currentTime` **2,92**, `duration` **92,84**, `volume` 0,4, `aria-pressed` `true` |
| La richiesta di rete della traccia | servita a pezzi, come un file vero | `GET …/ludoratti.2g7la1ve2p52_.mp3 → 206 Partial Content` |

⚠️ **Il percorso webpack non è stato provato, e non per colpa nostra**: `next build --webpack` su
questo playground muore prima di arrivare agli asset, con «`client-only` cannot be imported from a
Server Component» dentro `react-aria-components`. È un'incompatibilità fra HeroUI 3 e il vecchio
compilatore in Next 16, non un difetto di questa riga: quindi la forma è **misurata su Turbopack**,
che di Next 16 è il predefinito, e su webpack resta dichiarata e non verificata.

⚠️ **La conversione della traccia si è decisa sui numeri, non a orecchio.** L'originale è un MP3
**VBR a 182 kbps** medi, stereo 48 kHz, 92,88 s, con dentro **19,7 KB di copertina JPEG** che in un
`<audio>` non serve a niente. Misurando l'energia per banda (`highpass`+`lowpass`+`astats`) contro
l'originale, lo scarto in alto è: MP3 128 CBR −0,3/−0,5/−1,0/−1,8 dB (1452 KB), **LAME `-q:a 6`
+0,4/+0,2/−0,4/−1,2 dB (1256 KB)**, `-q:a 7` +0,2/−0,3/−1,2/−2,3 (1104 KB), AAC 64 −2,0/−4,1/−6,5/−8,4
(747 KB), Opus 48 praticamente identico all'originale (516 KB) — ⚠️ ma quella misura **lo favorisce**,
perché il CELT di Opus l'energia in alto la **sintetizza** invece di trascriverla. Ha vinto `-q:a 6`
perché era il vincolo dichiarato: *la più compatibile che non degradi in modo sensibile*, e MP3 è
l'unico formato senza una sola riserva di compatibilità — Opus lo suona Safari solo dal **18.4**, e
AAC lo decodifica Firefox solo se glielo presta il sistema.

**Che cosa protegge:** un indirizzo che il bundler non riconoscesse non darebbe un errore: darebbe
una stringa **plausibile** che punta accanto al file JavaScript, e un `<audio>` che prende 404 non
lancia niente. Il difetto sarebbe silenzioso e comparirebbe solo nell'applicazione di chi installa,
mai qui. La riga del `206` è l'altra metà: dice che il file si comporta da file — si scarica a
pezzi e comincia a suonare prima di essere finito, che è esattamente ciò che un modulo base64 non
avrebbe potuto fare.

### I tre pezzi della scheda, nei due temi — 2026-09-20

**Esegue:** agente — sono misure di colore e di geometria, e in jsdom ogni rettangolo vale zero.
**Ultima esecuzione:** agente, 2026-09-20.

**Preparazione:** `npm run build --workspace packages/plague-board-ui`, poi **riavviare** il dev
server (`npm run playground`) — i tre pezzi portano classi nuove, e Tailwind non riscandaglia
`dist/` quando `tsc` lo riscrive. Pagina: `http://localhost:3100/profilo`. Il tema si commuta
scrivendo `pb-playground-theme` in `localStorage` e **ricaricando**.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Geometria del ritratto `lg` | 48 px tondo, non il quadrato stondato di HeroUI | **48×48**, `border-radius` a fondo scala, anello `rgb(163,230,53)` a **2px** |
| L'immagine arriva davvero | il ritratto si vede, non il ripiego | `<img>` `complete`, `naturalWidth` **288**, reso a 48 |
| Il ripiego dopo il caricamento | non resta sotto l'immagine | tolto dal DOM: restano **2** ripieghi su 7 ritratti, i due senza `src` |
| Il segno nell'angolo | pastiglia lime, segno scuro dentro | **16×16**, fondo `rgb(163,230,53)`, segno a **13,35** di contrasto |
| Anello sul pannello — scuro / chiaro | ≥ 3, che è la soglia della grafica che porta significato | **11,75** / **4,99** |
| Titolo e descrizione della scheda — scuro / chiaro | ≥ 4,5 | **17,27** e 6,91 / **17,72** e 7,73 |
| Le cinque pastiglie del grado — scuro / chiaro | ≥ 4,5, nessuna esclusa | peggiore **4,90** (`success`) / **4,80** (`warning`); `default` 14,52 / 14,87 |
| Teschio sul disco del ripiego, in tema chiaro | il disco resta scuro nei due temi, ed è un'isola | teschio **9,73**, disco sulla pagina **13,46** |
| Bordo del pannello al 50% — scuro / chiaro | visibile | **3,85** / **1,99** |
| A 375 px | niente scorrimento laterale | `scrollWidth` **375** = `innerWidth`; i 25 elementi che sbordano sono tutti dentro la tabella, che scorre nel suo riquadro |
| A 375 px, col nome del grado più lungo | la pastiglia va a capo, non si taglia | «Consigliere Bubbonico» misura **171 px** e scende sulla riga sotto; nessuna delle 12 pastiglie ha il testo tagliato |

⚠️ **Il velo del pannello non può scendere verso `background`.** Era la prima scrittura — `from-surface
to-background` — e in tema chiaro il fondo della scheda finiva **esattamente del colore della
pagina**: misurati `--surface` `#ffffff` e `--background` `#f5f5f5`, che è il fondo del `body`, con
**1,09** di contrasto. La scheda si dissolveva verso il basso. Adesso il fondo è `surface` pieno e
sopra c'è un velo del colore del marchio al 10%, che tinge senza sparire nei due temi. ⚠️ E
`surface` contro pagina fa comunque 1,09 in chiaro e 1,14 in scuro: a staccare una scheda, in
HeroUI, è **l'ombra**, non il fondo. Il nostro bordo verde ci si aggiunge.

⚠️ **Un colore traslucido non si misura come se fosse pieno.** Il metodo di `CLAUDE.md` —
dipingere il colore su una tela 1×1 e leggere il pixel — su un colore **traslucido** va completato
componendolo sul fondo con la sua alfa, `c·α + fondo·(1−α)`; letto come tinta piena, il bordo del
pannello misurava **2,75** invece di **1,99**. ⚠️ **E si compone soltanto: non si divide.** Questa
riga prescriveva anche una divisione per l'alfa, e il 2026-09-20 la sonda ha mostrato che è di
troppo — `getImageData` smonta da sé la premoltiplicazione della tela, quindi dividere raddoppia il
colore. Vedi la riga corretta in `CLAUDE.md` § Cose misurate.

**Che cosa protegge:** i tre pezzi sono i primi della libreria che **vestono** un componente di
HeroUI invece di essere scritti da zero, e il modo in cui si rompono è che il vestito non arrivi:
una classe che non vince sulla sua, un token che nel tema chiaro vale il colore della pagina, un
verde che in scuro c'è e in chiaro no. Nessuna di queste cose fa un errore: fanno una scheda che
sembra di qualcun altro.

### I quattro segni nuovi, e la riga che non si stringe più — 2026-09-20

**Esegue:** agente — sono misure di geometria e di colore, e in jsdom `getBBox` non esiste e ogni
rettangolo vale zero.
**Ultima esecuzione:** agente, 2026-09-20.

**Preparazione:** `npm run build`, poi **riavviare** il dev server (`npm run playground`) — Tailwind
non riscandaglia `dist/` quando `tsc` lo riscrive. Pagina: `http://localhost:3100/`, sezioni «i
segni» e «il gioco e la cappa». Il tema si commuta scrivendo `pb-playground-theme` in
`localStorage` e **ricaricando**; la misura del riquadro di un tracciato si prende montando un
`<path>` in un `<svg>` fuori schermo e leggendo `getBBox()`.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Riquadro della cappa | dentro le 24 unità, coi margini che hanno tutte | x **1,5 → 22,5**, y **4 → 19** |
| Riquadro della nuvola di Material, per confronto | — | x **0 → 24**, y 4 → 20: tocca i due bordi |
| Riquadro del dado | centrato, margine uguale sui quattro lati | **3 → 21** su tutti e due gli assi |
| Riquadro del bacillo (geometria, senza tratto) | dentro, col tratto che ne aggiunge uno per lato | x 2,6 → 21,8, y 3 → 20,3 → dipinto **1,6 → 22,8** |
| Riquadro del cocco (geometria, senza tratto) | idem | x 1,89 → 20,45, y 2,2 → 21,41 → dipinto **0,89 → 21,45** |
| Il dado a 56, 24, 16 | i cinque punti restano buchi | tre misure leggibili; a 16 i punti sono **2 px** ed è il suo limite |
| I due batteri a 16 | si impastano, ed è dichiarato | pili e flagelli saldati al corpo: due macchie |
| La cappa a 160 px al 20% — scuro / chiaro | tenue in tutti e due, nessun testo sopra | **1,44** / **1,30**: decorazione dichiarata, il senso lo porta l'etichetta accanto |
| La tabella dei segni a 375 px | la pagina non scorre di lato | `scrollWidth` **375** = `innerWidth`; l'involucro della tabella scorre da solo, 624 su 343 |
| Le icone della riga «56PX» a 375 px | 56 px davvero | **56**, e le altre due righe **24** e **16** |

⚠️ **Il batterio di `ludoratti.it`, portato a 24, è l'icona della luminosità.** È un cerchio vuoto
con sei raggi **dritti**: a 64px dentro un fondale verde passa per un germe, tirato fuori e messo
accanto a una parola no. È la seconda volta dopo il biohazard che un disegno dell'aggregatore non
dice quello che il suo nome promette, e la forma del difetto è la stessa — si vede solo
**affiancandolo** alle altre alla misura vera. Le due cure sono state misurate a occhio, grandi e
alle quattro misure: i **pili curvi tutti nello stesso verso** (i raggi di un sole sono dritti e
speculari) e **tre granuli** dentro il corpo. Due granuli soli, simmetrici, si leggono come **due
occhi**; tre flagelli tutti da una parte fanno uno scappamento di razzo.

⚠️ **Un `<svg>` con la larghezza scritta nell'attributo si lascia schiacciare lo stesso.** Nella
tabella dei segni le colonne erano `minmax(0, 1fr)`: a 375 px valevano **20,9 px** l'una, e la riga
etichettata «56PX» mostrava icone da ventuno — con l'attributo `width="56"` ancora addosso. Non
somiglia a un difetto, somiglia a una tabella stretta. Si cura scrivendo la misura nelle colonne
(`repeat(n, 3.5rem)`) e lasciando traboccare l'involucro, che scorre.

**Che cosa protegge:** i quattro disegni nuovi sono l'ultimo giro di icone della libreria, e il modo in
cui si rompono non è un errore: è un disegno che alla misura vera dice un'altra cosa — un sole, una
pillola, un razzo, una nuvoletta del meteo — oppure una tabella che mostra una misura e ne rende
un'altra. Nessuna di queste cose fa un test rosso.

### Il virione e l'ampolla, ridisegnati — 2026-09-20

**Esegue:** agente — sono misure di geometria, e in jsdom `getBBox` non esiste.
**Ultima esecuzione:** agente, 2026-09-20.

**Preparazione:** `npm run build`, poi **riavviare** il dev server. Pagine:
`http://localhost:3100/` (sezione «i segni»), `/profilo` (il veleno a 16 e il virus a 12 dentro una
pastiglia), `/stile` (il virus a 14 nel separatore, il dado a 36). Il riquadro di un tracciato si
prende montando un `<path>` in un `<svg>` fuori schermo e leggendo `getBBox()`.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Riquadro del virione | centrato e dentro, coi margini di famiglia | **2,85 → 21,15** su tutti e due gli assi |
| Riquadro del solo capside | ben dentro alle punte | 6,8 → 17,2 |
| Riquadro dell'ampolla | dentro, e centrata in larghezza | x **5,7 → 18,3** (centro esatto), y 1,8 → 21,1 |
| Il virione a 24 e a 16 | a 24 dice «virione», a 16 è una macchia irta | confermato a occhio: a 16 i pomelli si saldano al capside |
| Il virione a 12, dentro la pastiglia del grado | una macchia **piena**, diversa dai batteri a tratto | confermato su `/profilo` |
| L'ampolla a 16, accanto al nome della scheda | la boccia col tappo si legge, il collo è un accenno | collo **2,5 px** a 16, sagoma leggibile |
| Il dado di `/stile` | identico a prima, ma è quello della libreria | il segnaposto locale della pagina è sparito; la sezione rende uguale |
| Gate | verde | build, typecheck, lint 0/0, **331 test**, dieci pagine statiche |

⚠️ **Il vecchio virus era l'icona delle impostazioni.** Le sue protuberanze sono **denti
trapezoidali** attorno a due cerchi concentrici: a grandezza vera è un ingranaggio con un mirino in
mezzo, ed era il contagio più usato della libreria — dentro le pastiglie del grado, nel piede, nel
separatore della schermata di accesso. Non si vedeva perché a 12 e 14 px qualunque disegno è un
puntino: si è visto **ingrandendolo**, che è lo stesso metodo della pagina `/lente` per le cuciture
del ratto.

⚠️ **E il vecchio veleno erano due bolle con due puntini sopra.** L'utente: *«bella da vedere, ma
non si capisce»*. Al suo posto l'**ampolla che la mascotte tiene in mano** — scelta fra due
candidate, contro una boccetta col teschio ritagliato dentro: quella diceva «veleno» in modo più
letterale, ma l'ampolla lega l'icona al personaggio, che è la stessa ragione per cui il ratto che
corre porta l'inchiostro delle reference.

**Che cosa protegge:** quattro delle icone della libreria arrivano da fuori — tre glifi di Material
Design Icons da RattInventario, una nuvola da `ludoratti.it` — e il modo in cui sbagliano non è
un errore di codice: è un disegno adottato per il suo **nome** e mai guardato alla misura vera.

### Il nome che si disturba, e le tre copie negli appunti — 2026-09-20

**Esegue:** agente
**Ultima esecuzione:** agente, 2026-09-20

**Preparazione:** `npm run build`, poi **riavviare** il dev server — `animate-glitch` e
`animate-reveal` nascono da `@theme`, e Tailwind le cerca nel testo di `dist/`, che non
riscandaglia da sé. Pagina `http://localhost:3100/atmosfera`, sezione «il nome che si disturba».
I contrasti si misurano dipingendo il colore su una tela 1×1 e **componendolo sul fondo con la sua
alfa**; il tema si commuta scrivendo `pb-playground-theme` in `localStorage` e ricaricando.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Durata delle due lamelle | diverse, o le fette si aprono sempre insieme | **2,5 s** e **2 s**: la riga fuori da ogni layer vince sull'utility |
| Le loro fasce, a ciclo libero | due fette diverse nello stesso istante | `inset(33,49% … 43,11%)` e `inset(26,16% … 53,37%)` |
| Il fondo delle lamelle | quello dichiarato dove c'è, trasparente dove non c'è | `rgb(3, 7, 18)` e `rgba(0, 0, 0, 0)` |
| La fascia dichiarata nella classe | collassata, per quando l'animazione è spenta | `inset(50% 0px)` |
| «Meno movimento» | la regola in fondo ad `animations.css` le raggiunge | lamelle e lampo corrispondono a `[class*='animate-']` |
| I tempi del lampo, campionati ogni 1,5 ms (terzo giro) | due sbirciate rotte, e poi la parola intera che sfarfalla prima di tenere | **60** fascia alta · **60** fascia bassa · **45 · 45 · 165 ms** con `inset(0)`, su un ciclo di **3 s** |
| Il buio fra un colpo intero e l'altro | breve abbastanza da leggersi come un calo di tensione | **30 ms** fra il primo e il secondo, **30** fra il secondo e la tenuta |
| L'opacità del lampo lungo tutto il ciclo | solo 0 o 1, o i colpi diventano dissolvenze | due soli valori, `0` e `1` — `animationTimingFunction` vale `steps(1)` |
| La lastra sotto la parola intera | il colore dichiarato, o la parola nascosta si legge sopra il nome | `rgb(3, 7, 18)`; la parola misura **71 px** contro i **35** del nome che copre |
| Le lamelle **della parola nascosta** | due, col suo testo, dentro il lampo e non accanto | 2 copie «EVIL», fondo `rgb(3, 7, 18)`, ombre `rgb(8, 145, 178)` e `rgb(190, 24, 93)` |
| Selezionare il titolo col lampo che porta le sue copie | sempre «LUDORATTI E. CORP» | confermato: `user-select` si eredita, e le copie annidate sono già coperte |
| La striscia con `isRevealEnabled={false}` | il nome si disturba e la parola non c'è **affatto** | nel DOM restano `E.E.E.`, zero «EVIL»; la prima striscia, stesse prop, ne ha tre |
| Nome accessibile del titolo | il testo una volta sola | «LUDORATTI E. CORP» |
| **Selezionare il titolo e copiarlo** | «LUDORATTI E. CORP» | ⚠️ **«LUDORATTI E.E.E.EVIL CORP»** |
| Lo stesso, con `user-select: none` sulle copie | «LUDORATTI E. CORP» | confermato |
| Contrasti, tema **scuro** | ≥ 4,5 | titolo sulla striscia 18,30 · la `E.` 13,35 · titolo su pagina 19,74 · la `E.` 13,43 |
| Contrasti, tema **chiaro** | ≥ 4,5 | striscia 18,30 e 13,35 (non cambia: porta `dark`) · lampo rosso **5,29** · pagina 16,25 · la `E.` 4,58 |
| A 375px | niente scorrimento di lato | `scrollWidth` 375 = `innerWidth` |
| Gate | verde | build, typecheck, lint 0/0, **365 test**, undici pagine statiche |

⚠️ **`aria-hidden` non dice niente agli appunti.** Le due copie e il lampo sono nascosti ai lettori
di schermo — c'è un test che tiene il nome del titolo a una copia sola — ma la **selezione** è una
gamma nel DOM e quegli attributi non la guardano: chi selezionava il titolo per copiarlo si portava
via «LUDORATTI E.E.E.EVIL CORP», compresa la parola che l'easter egg dovrebbe nascondere. Si cura
con `user-select: none`, che è l'`aria-hidden` dell'altro mondo, più `pointer-events: none` perché
una lastra decorativa non deve intercettare il gesto che comincia la selezione.

⚠️ **Secondo giro, il 2026-09-20: la parola nascosta non si leggeva.** Segnalato dall'utente —
«si vede due volte incompleta, che è corretto per effetto glitch, ma risulta troppo difficile da
intravedere e leggerla». Di là il lampo sono **solo** le due fasce, quindi la parola non è mai
intera: un occhio può indovinarla, non leggerla. La cura è un **terzo tempo** con `inset(0)` che
dura più delle due sbirciate messe insieme, più la lastra sotto, più la curva a gradini perché i
tre tempi siano interruttori e non dissolvenze. E il ciclo è sceso da 5 a **3 secondi**, sempre su
richiesta: fra un lampo e l'altro l'attesa era lunga abbastanza da far credere che non ci fosse
niente da aspettare.

⚠️ **Terzo giro, lo stesso giorno: la parola si leggeva e sembrava un'insegna che si accende.**
L'utente: «ridurrei la sua durata, ma lo farei riapparire immediatamente dopo, un po' come stesse
flickerando o sbalzi di tensione». Il tempo intero da 255 ms è diventato **tre** — 45, 45 e 165, con
trenta millesimi di buio in mezzo — che è come un tubo al neon prende la corrente: due colpi che non
tengono e poi la tenuta. Il totale acceso non cambia, ma nessun singolo tempo è più lungo di due
decimi. ⚠️ Uno stacco da 30 ms esiste **solo** grazie a `steps(1, end)`: interpolato non si
vedrebbe affatto. E l'altra metà della segnalazione — «terrei lo stesso effetto glitch della E.,
noto che evil non lo ha proprio» — è diventata `GlitchSlices`, il pezzo che ora rende le due copie
per tutti e due: il nome le ha come fratelli, la parola nascosta **dentro** di sé.

**Che cosa protegge:** un elemento decorativo che **duplica testo vero** sbaglia in tre mondi
diversi e ognuno si ripara da solo — l'albero di accessibilità con `aria-hidden`, gli appunti con
`user-select`, il puntatore con `pointer-events`. Nessuno dei tre si vede guardando la pagina, e a
`ludoratti.it` le copie sono pseudo-elementi, dove il primo problema è **peggiore** e gli altri due
identici. E protegge la sola cosa che un easter egg di testo deve fare: **farsi leggere** quando
compare.

⚠️ **La riga «La lastra sotto la parola intera» non vale più dal 2026-09-23**: la lastra non c'è, e
al suo posto il nome si spegne. Lo scenario qui sotto.

### La parola nascosta sul chiaro: il nome si spegne invece di farsi coprire — 2026-09-23

**Esegue:** agente
**Ultima esecuzione:** agente, 2026-09-23

**Preparazione:** `npm run build` e **riavvio** del dev server — `pb-glitch-name--with-reveal` è
una classe nuova. Una scheda propria su `http://localhost:3100/cornice/GlitchText/0/light` (poi
`/dark`), le animazioni ferme con `getAnimations()` messe in pausa e portate a `currentTime`, il
titolo ingrandito a 110 px solo per guardarlo. Segnalato dall'utente: «la versione con la scritta
evil ha delle strisce nere e la scritta evil compare con un suo sfondo nero».

| Azione | Atteso | Ottenuto |
|---|---|---|
| Prima, ferma a 1000 · 2430 · 2850 ms, fondo `#030712` sul chiaro | — | una barra nera sotto «E.», la fetta di «EVIL» su nero, la parola intera dentro un rettangolo nero |
| Prima, lo stesso col fondo trasparente | — | niente nero, ma nella tenuta la `E.` traspare verde dentro la «V» |
| Il nome e la parola, campionati **ogni millisecondo** sui 3000 del ciclo | mai accesi insieme, mai spenti insieme | **0** e **0**; la parola accesa 374 ms in tutto |
| I tempi della parola visti dal nome | invariati | **60 · 60 · 45 · 45 · 165 ms**, buio di **31** e **29** fra i colpi interi |
| Le due animazioni | stessa durata, stessa curva, stesso istante di partenza | `pb-conceal` e `pb-reveal` a **3000 ms**, `steps(1)`, `startTime` uguale |
| Il fondo della parola e delle lamelle, senza `background` | trasparente | `rgba(0, 0, 0, 0)` tutti e due |
| Ferma a 1000 · 2430 · 2550 · 2850 ms, chiaro e scuro | nessun rettangolo; nelle sbirciate la sola fetta; nella tenuta «EVIL» senza la `E.` sotto | confermato nei due temi |
| Il riquadro sul fondo della pagina di `/atmosfera` | la parola senza fondo | quello che sembrava un fondo rosa, rimpicciolito, è l'alone `text-shadow` della parola: sfondo calcolato trasparente |
| Contrasti, tema **chiaro**, 30 px | ≥ 3, testo grande | la `E.` in `text-brand-ink` **4,58** · «EVIL» in `text-red-500` **3,49** · titolo 16,25 |
| Contrasti, tema **scuro** | ≥ 4,5 | la `E.` 13,43 · «EVIL» 5,32 · titolo 19,74 |
| Denti: una soglia di `pb-conceal` spostata, la riga di «meno movimento» tolta, la classe mai messa | tre rossi, ognuno sul suo caso | confermato, un caso per mutazione |
| Gate | verde | build, typecheck, lint 0/0, **931 test**, 308 cornici, `/` statica |

⚠️ **Prima di togliere la lastra la domanda era che cosa facesse**, e la risposta era tenere il nome
fuori da sotto la parola. Il fondo trasparente toglieva il nero e rimetteva quel difetto; spegnere
il nome toglie tutti e due, e vale anche sul fondale della peste, che non è un colore solo — dove
una lastra di `#030712` sarebbe stata un rettangolo appena più scuro della città.

⚠️ **«EVIL» sul chiaro fa 3,49**: passa la soglia del testo grande e non quella del testo normale.
È una parola decorativa e fuori dal nome accessibile, e il colore si rifinisce nella passata finale
sulle tinte; sotto i 24 px la leva è `revealClassName`.

**Che cosa protegge:** una parola che ne sostituisce un'altra senza sapere che cosa c'è dietro — il
modo in cui una lastra fallisce non si vede sul fondo per cui è stata scelta, e si vede solo col
chiaro accanto allo scuro, fermando l'animazione nell'istante giusto.

### Il fondale nei due temi, col marchio gigante — 2026-09-23

**Esegue:** agente
**Ultima esecuzione:** agente, 2026-09-23

**Preparazione:** `npm run build` e **riavvio** del dev server — `pb-scene-mark`, `bg-(--pb-scene)`
e le altre sono classi nuove. Il riquadro del browser **davanti**: con `document.hidden` bolle e
versi non nascono, per costruzione. Cornici `/cornice/LoginScreen/0/{light,dark}` col livello
«alto», `/cornice/PlagueBackground/4/light` (la scena scura su pagina chiara), e `/atmosfera` nei due
temi scrivendo `pb-playground-theme` e ricaricando. Contrasti col metodo della tela 1×1, strati
traslucidi composti dal basso.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Prima: le due cornici di `LoginScreen` | — | **identiche al pixel**: il fondale portava `dark` in tutti e due i temi |
| Il simbolo gigante di `ludoratti.it`, sul sito vivo | — | biohazard 1000×1000 su 1660×1250, `lime-900/20` che pulsa a metà: **1,10** · 1,04 |
| Prima, un prototipo a stili iniettati | una scena chiara leggibile | nebbia, marchio, bolle, versi e ratti: regge, e diventa la tavolozza di `theme.css` |
| Il fondo della scena | `#eef2ea` di giorno, `#030712` di notte | `rgb(238, 242, 234)` e `rgb(3, 7, 18)` |
| Il marchio | 80% del lato corto, pieno, col muso, che respira | 1000×1000 in 1660×1250, `pb-scene-breathe`, nessun `pb-mark-beat` |
| Il marchio, contrasto | si vede e non disturba | chiaro **1,17** · 1,10 respirando; scuro **1,12** · 1,06 |
| Testi di `LoginScreen`, **chiaro** | ≥ 4,5 | titolo 17,72 · sottotitolo 7,73 · Google 17,72 · livello scelto 5,93 · non scelto 14,87 · verso della città 8,65 |
| Testi di `LoginScreen`, **scuro** | invariati | titolo 17,27 · sottotitolo 6,91 · livello scelto 10,90 · non scelto **14,52**, come registrato · verso 17,25 |
| La scena dentro `dark text-foreground` su pagina chiara | notte: scena, pannello e marchio | fondo `rgb(3, 7, 18)`, pannello scuro, titolo quasi bianco, marchio `rgba(163, 230, 53, 0.08)` |
| La scheda di `/atmosfera` sul fondale | ≥ 4,5 | chiaro 17,07 · 7,45 · etichetta **4,81**; scuro 18,09 · 7,24 · 12,31 |
| Denti: `dark` rimesso, marchio che batte, marchio tolto, riga di «meno movimento» tolta, una variabile tolta dal blocco scuro | cinque rossi, ognuno sul suo caso | confermato |
| Gate | verde | build, typecheck, lint 0/0, **936 test**, 310 cornici, `/` statica |

⚠️ **Il filo di `PlagueDivider` nel pannello chiaro fa 1,98**, e `/accesso` lo dichiarava già: con
la schermata che ora esiste anche di giorno, quel filo lì si vede davvero. Resta per la passata
finale sui colori.

**Che cosa protegge:** la schermata di accesso di quattro applicazioni nel tema che la persona ha
scelto; e i due blocchi del tema con gli stessi colori della scena, che è il modo in cui un pezzo
sparisce in un tema solo senza che niente diventi rosso.

### Il segno dentro i controlli di HeroUI misura quello che dice — 2026-09-23

**Esegue:** agente
**Ultima esecuzione:** agente, 2026-09-23

**Preparazione:** `npm run build` e **riavvio** del dev server (classi nuove). Le cornici di
`MusicToggle` e di `GoogleSignInButton` caricate in un iframe fuori schermo, misurando
`getBoundingClientRect()` del primo `button` e del suo `svg`. Segnalato dall'utente: nella storia di
`MusicToggle` «più grande» e «le parole dell'applicazione» erano uguali alla prima.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Prima: `MusicToggle size={32}` | un teschio da 32 | attributi `32`, **16×16** a schermo in un bottone da 32: `.toggle-button--sm svg { size-4 }` |
| Prima: `GoogleSignInButton` | il marchio a 20, come il cerchio dell'attesa | attributo `20`, **16×16** a schermo |
| La misura predefinita di `MusicToggle` | 22 | **22×22** in un bottone da **38** |
| `size={32}` | 32 | **32×32** in un bottone da **48** |
| Il marchio di Google | 20 | **20×20**; il cerchio dell'attesa 20, che ruotando misura fino a 25,6 di riquadro |
| Il nome annunciato sotto ogni variante | quello dell'`aria-label` | «Metti la musica», «Metti la musica», «Accendi la radio» |
| Denti: via la classe dal teschio, via `size-5` dal marchio | due rossi | confermato |

⚠️ **Premere il comando nella cornice non si è provato**: farebbe partire la traccia vera nel
browser di chi guarda. Che il nome cambi con lo stato lo dice il test di `MusicToggle` su
`aria-label`, e l'osservatore della demo lo legge dal DOM.

**Che cosa protegge:** una prop di misura che il componente accetta e HeroUI ignora — la forma
peggiore di prop, perché a schermo non si vede niente e chi l'ha passata crede solo che non serva.

### La schermata di accesso, e l'attesa che sembrava un comando spento — 2026-09-20

**Esegue:** agente

**Ultima esecuzione:** agente, 2026-09-20

**Preparazione:** `npm run build`, poi **riavviare** il dev server — `bg-brand-ink/50` è una classe
nuova nei sorgenti della libreria, e Tailwind non riscandaglia `dist/` da sé. Pagina
`http://localhost:3100/accesso`. I contrasti si misurano dipingendo il colore su una tela 1×1 e
**componendolo sul fondo con la sua alfa**, un livello alla volta; il tema si commuta scrivendo
`pb-playground-theme` in `localStorage` e ricaricando.

| Azione | Atteso | Ottenuto |
|---|---|---|
| I tracciati di `GoogleIcon` | i quattro colori del marchio, nessuno `currentColor` | `#4285F4 · #34A853 · #FBBC05 · #EA4335`, in quest'ordine |
| Passargli `color` | errore in **compilazione** | `tsc` rosso; e togliendo `Omit<…,'color'>` diventa `TS2578: Unused '@ts-expect-error' directive` — il caso ha i denti |
| Il comando in attesa: attributi | non premibile, ma raggiungibile | `aria-disabled="true"` · `disabled` **false** · `tabIndex` 0 · `data-pending="true"` |
| Il comando in attesa: aspetto | qualcosa che dica «sta lavorando» | ⚠️ `opacity: 0.5`, `cursor: not-allowed`, `pointer-events: none` — cioè l'aspetto di un comando **disabilitato** |
| Da dove viene quell'aspetto | da `[data-pending]`, si direbbe | ⚠️ no: `status-pending` è solo `pointer-events: none`; a dipingere è la regola del **disabilitato**, che guarda `[aria-disabled="true"]` |
| Il cerchio che gira | c'è in attesa, non c'è a riposo, ed è muto | `[data-slot="spinner"]` presente solo in attesa, con `aria-hidden="true"` |
| L'etichetta sotto il velo, tema scuro | ≥ 4,5 anche a metà opacità | **19,74** a riposo, **5,20** in attesa |
| Il bordo della variante `outline` | ≥ 3 per identificare il comando | ⚠️ **1,38** in scuro e **1,23** in chiaro: è il `--border` di HeroUI, dichiarato e non corretto qui |
| I fili di `PlagueDivider` | due separatori veri, larghi uguali | due `<hr>` `data-slot="separator"`, `flex-grow: 1`, `flex-basis: 0%`, stessa larghezza |
| Il loro colore, prima | visibile su pagina e su pannello | ⚠️ `--separator`: **1,26** sulla pagina e **1,10** dentro il pannello, in scuro |
| Il loro colore, dopo (`bg-brand-ink/50`) | come il bordo di `PlaguePanel` | **3,85** sulla pagina e **3,83** sul pannello in scuro, **1,98** sulla pagina in chiaro |
| Le classi di HeroUI per una riga con la parola in mezzo | usarle, se ci sono | ⚠️ `separator__container`, `__line` e `__content` esistono **solo nel CSS**: zero occorrenze in tutto il `dist` dei componenti |
| Il segno del separatore | due di serie, nessuno con `icon={null}` | 2 `<svg>` e 0 |
| Il titolo di `LoginScreen` | l'`h1` della pagina, non un `h3` | `H1`, classi `card__title text-xl`, `font-size` **20px** — l'utility vince sul `text-sm` del layer `components` |
| Senza sottotitolo | niente paragrafo vuoto | `[data-slot="card-description"]` assente |
| Il fondale e i ratti | la città c'è sempre, i ratti passano da soli | `.pb-city-block` presente; con `hasRats={false}`, zero `.pb-rat-run` dopo 20 s |
| A 375px | niente scorrimento di lato, e la parola non va a capo | `scrollWidth` **375** = `innerWidth`; pannello 311, comando 277, fili 47–113, parola su una riga |
| Gate | verde | build, typecheck, lint 0/0, **390 test**, **dodici** pagine statiche |

⚠️ **In HeroUI 3 un comando in attesa si veste da comando spento, e nessuno dei due nomi lo dice.**
`isPending` di `react-aria` fa la cosa giusta dove conta — non parte niente, il fuoco resta dov'è,
il cambio viene annunciato — ma scrive `aria-disabled="true"`, e la regola del disabilitato di
HeroUI guarda proprio quell'attributo: velo al 50% e cursore sbarrato. Lo stato `pending` suo, di
grafica, non porta niente. Quindi il segno che distingue «sto lavorando» da «non si può» lo deve
mettere il componente, ed è lo scambio del marchio col cerchio.

⚠️ **Il `Separator` di HeroUI non accetta contenuto, e il suo CSS finge di sì.** Il foglio di stile
porta `separator__container`, `separator__line` e `separator__content` — cioè esattamente la riga
con la parola in mezzo — ma nessun componente le emette: sono classi morte, come lo erano
`animate-glitch` e `animate-reveal` qui prima di `GlitchText`. La riga si fa quindi con **due**
separatori e la parola in mezzo, e il prezzo — un annuncio in più — è dichiarato.

**Che cosa protegge:** è la prima superficie della libreria che tutte e quattro le applicazioni
useranno uguale, e il modo in cui si rompe non si vede guardandola: un'attesa che sembra un guasto,
una riga divisoria che non c'è, un marchio di terzi «sistemato» da chi non sapeva perché era
diverso, un titolo che a schermo è giusto e nell'albero dei livelli è un `h3` sotto a niente.

### I chip che si contano, e l'anello di fuoco che non c'era — 2026-09-20

**Esegue:** agente

**Ultima esecuzione:** agente, 2026-09-20

**Preparazione:** `npm run build`, poi **riavviare** il dev server — `focus-visible:focus-ring` è
una classe nuova nei sorgenti della libreria. Pagina `http://localhost:3100/profilo`, sezione «i
chip che si contano». ⚠️ **L'anello di fuoco si guarda col Tab, non col mouse**: `:focus-visible`
non corrisponde a un `focus()` da console né a un clic, quindi un anello rotto resta invisibile a
chi prova a mano nel modo sbagliato. I contrasti si misurano dipingendo il colore su una tela 1×1
e componendolo sul fondo con la sua alfa; il tema si commuta scrivendo `pb-playground-theme` in
`localStorage` e ricaricando.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Le quattro strisce di `CountedChips` | tre comandi e uno senza, su sei voci | `+3`, `+5`, `+6`, e la striscia sotto il limite non ne ha |
| Il nome dei comandi | contiene il testo che si vede | «Mostra tutti (+3)», «(+5)», «(+6)» |
| Lo stato da chiuso | dichiarato | `aria-expanded="false"` su tutt'e tre |
| Premere il primo | si aprono tutte, nella stessa riga | la riga passa a `cooperativo · medioevo · dadi · deck-building · due giocatori · peste · −`, `aria-expanded="true"` |
| Il nome dopo l'apertura | **non** cambia | «Mostra tutti (+3)» |
| Tab | i `+N` sono nell'ordine di tabulazione | dal primo si arriva al secondo, `tabIndex` 0 |
| L'anello di fuoco, **prima** | 2px attorno al comando | ⚠️ `:focus-visible` corrispondeva, `outline-width` **2px**, `outline-style` **none** — nessun anello |
| Perché | — | `outline-none` scrive `--tw-outline-style: none`, e `outline-2` vale `outline-style: var(--tw-outline-style, solid)` |
| Quanti componenti ne erano colpiti | — | ⚠️ **tre già in produzione**: `CreditCard`, `SupportButton`, `TalkingMascot` — tutti con `--tw-outline-style: none` |
| L'anello, **dopo** (`focus-visible:focus-ring`) | si disegna | `box-shadow` con anello a 2px e stacco a 2px, cioè `ring-*`, che `outline-none` non tocca |
| Il suo colore, tema chiaro, **prima** | ≥ 3 | ⚠️ **1,38** — `--focus` viene dal nostro `--accent`, cioè il lime pieno |
| Il suo colore, tema chiaro, **dopo** | ≥ 3 | **4,58** con `--focus` a lime-700 |
| Lo stesso, tema scuro | ≥ 3 | **13,43** col lime pieno |
| Lo stesso, nel **piede** con la pagina in chiaro | il valore scuro, perché il piede è un'isola `dark` | **11,00** — i valori scritti per esteso non si congelano, come per `--accent-soft-foreground` |
| Il testo del `+N` | ≥ 4,5 | **16,25** in chiaro |
| L'altezza del comando | uguale a quella delle pastiglie | 26 px contro 26 |
| Gate | verde | build, typecheck, lint 0/0, **475 test**, dodici pagine statiche |

⚠️ **Un anello di fuoco si prova col Tab, e per questo può restare rotto per settimane.** Le tre
classi che lo scrivevano c'erano tutte, il colore era quello giusto, la larghezza pure: mancava
solo lo `outline-style`, che `outline-none` aveva spento attraverso una variabile. Non lo vede una
passata sui contrasti — il colore dichiarato si misura lo stesso, ed è così che `CLAUDE.md` aveva
registrato l'1,38 della mascotte senza accorgersi che quell'anello non si disegnava affatto. Si
vede solo arrivando sul comando da tastiera e leggendo `outline-style` in pagina.

⚠️ **E il difetto era doppio.** Anche disegnandolo, l'anello veniva dal `--focus` di HeroUI, che
lui ricava dal nostro `--accent`: il lime pieno, che su una pagina chiara fa 1,38. Le due cure
sono indipendenti e servono tutt'e due — una fa comparire l'anello, l'altra lo fa vedere.

**Che cosa protegge:** il fuoco da tastiera è l'unica cosa che dice, a chi non usa il mouse, dove
si trova. È anche la cosa che nessuno guarda: si prova col mouse, si vede che «funziona», e nessun
test sulle prop la sfiora. Il guard `tests/focusRing.test.ts` tiene la combinazione fuori dai
sorgenti; questo scenario tiene i numeri.

### Il colore di una pastiglia, nei due temi — 2026-09-20

**Esegue:** agente

**Ultima esecuzione:** agente, 2026-09-20

**Preparazione:** `http://localhost:3100/profilo`, sezioni «il grado» e «i chip che si contano».
⚠️ **Va guardato in tutt'e due i temi**, e il tema si commuta scrivendo `pb-playground-theme` in
`localStorage` e ricaricando: il difetto sta in **uno solo** dei due, quindi chi lavora in scuro
non ha niente da notare.

| Azione | Atteso | Ottenuto |
|---|---|---|
| I cinque colori, **scuro**, variante predefinita | si distinguono | tinte sature accanto a un bianco: lime, sage, ambra, corallo |
| Gli stessi, **chiaro**, variante predefinita | si distinguono | ⚠️ tutti testi scuri su pastiglia grigia — oliva, bosco, marrone, mattone |
| `accent` contro `default`, chiaro | — | ⚠️ **2,50**: a colpo d'occhio la stessa pastiglia |
| Il bordo `border-current/40` | è lui a distinguerli, diceva la nota | ⚠️ no: **2,90** per `accent` e **1,97** per `danger` in scuro, **1,88** in chiaro — è una rifinitura |
| La variante `soft` di HeroUI | tinge anche il fondo | `--accent-soft` e compagne: il fondo prende il velo del colore |
| Il testo su fondo tinto, **chiaro** | ≥ 4,5 | default 15,54 · accent 6,61 · success 6,93 · warning 5,16 · danger **5,07** |
| Lo stesso, **scuro** | ≥ 4,5 | default 17,44 · accent 8,97 · success 6,14 · warning 9,21 · danger 6,47 |
| La demo dei chip, chiaro | le tre strisce che sforano si distinguono dalla quarta | pastiglie verde chiaro contro grigie: si vede |
| La demo dei chip, scuro | idem | pastiglie con velo verde scuro e testo lime contro grigie: si vede |
| Gate | verde | build, typecheck, lint 0/0, **476 test** |

⚠️ **Un difetto che vive in un tema solo non lo trova chi lavora sempre nell'altro.** Il colore
delle pastiglie è nato e si è collaudato in scuro, dove i testi di HeroUI sono tinte sature e la
differenza salta all'occhio; in chiaro gli stessi token diventano quattro colori scuri tutti
vicini al nero, e la pastiglia «colorata» è indistinguibile da quella neutra. Non lo prende la
passata sui contrasti — ognuno dei cinque sta sopra 5,7 sul fondo, quindi sono tutti *leggibili* —
perché la domanda non è «si legge» ma «si distingue da quella accanto». L'ha trovato l'utente
guardando il playground, che è il posto dove i due temi stanno a un clic di distanza.

**Che cosa protegge:** il colore di una pastiglia è l'unica cosa che dice, prima di leggerla, che
quel grado è diverso dagli altri. Se il colore non arriva, resta una parola in un riquadro grigio.

### Un'icona nuova, alla lente e alla misura vera — 2026-09-20

**Esegue:** agente

**Ultima esecuzione:** agente, 2026-09-20

**Preparazione:** la pagina del playground che mostra il segno. Due passate, e servono tutte e due.
La **lente**: clonare gli `<svg>` della riga più grande in un riquadro `position: fixed` e renderli
a **168px** su fondo scuro, affiancati. La **misura vera**: guardare la riga da 16, che è quella
dentro cui il segno vivrà davvero. Il tema si commuta scrivendo `pb-playground-theme` in
`localStorage` e ricaricando.

| Azione | Atteso | Ottenuto |
|---|---|---|
| Il segno a 56px nella tabella | dice quello che è | ⚠️ non basta a deciderlo: a quella misura un difetto di proporzione passa |
| Lo stesso a 168px | idem | due disegni su sette bocciati: un dente di puzzle che era un bozzo, due fiamme che erano punte di matita |
| Il segno a 16px | la sagoma si riconosce | sì |
| Il segno a 12px | idem | sagoma giusta, dettaglio interno chiuso su tre disegni su sette |
| Il verde, **chiaro** | ≥ 3 (grafica che porta significato) | `plague-ink` **4,60** · `brand-ink` **4,58** sul fondo `#f5f5f5` |
| Lo stesso, **scuro** | ≥ 3 | `plague-ink` **11,62** · `brand-ink` **13,43** |
| Una tabella per misura a 375px | scorre di lato, la pagina no | `scrollWidth` 375 = `clientWidth` con le colonne a misura fissa e l'involucro `overflow-x-auto` |

⚠️ **Un'icona si giudica ingrandita e si usa piccola.** Il difetto di un disegno a 16px non si
vede: il segno dice semplicemente un'altra cosa, e chi guarda non sa di aver letto la cosa
sbagliata. È la stessa forma del batterio che era un sole e del «virus» che era un ingranaggio.

⚠️ **I sette disegni su cui questo scenario è stato eseguito non sono più nel pacchetto**: erano
gli attributi di un gioco da tavolo, e il 2026-09-20 sono usciti perché il dominio di
un'applicazione non sta qui. Vivono nel commit `0d55bee`. Lo scenario resta, perché il metodo vale
per qualunque segno nuovo.

**Che cosa protegge:** un segno che dice un'altra cosa non si rompe, mente — e mente in silenzio.

### Il marchio: due stati, due perimetri di battito — 2026-09-20

**Esegue:** agente

**Ultima esecuzione:** agente, 2026-09-20

**Preparazione:** `http://localhost:3100/`, sezione «il marchio». I due **stati** si guardano
ingranditi — la sonda clona i due `<svg>` da 96 e li rende a 240px. I due **perimetri** non si
guardano: si **fermano**. `document.getAnimations()` filtrate per `pb-heartbeat`, messe in pausa e
portate a `currentTime = 256`, che è il picco del primo colpo; poi si legge la `transform`
calcolata su `<svg>` e `<g>`. Uno screenshot di un'animazione che gira è un fotogramma a caso.

| Azione | Atteso | Ottenuto |
|---|---|---|
| I due stati a 240px | il pieno è il vuoto riempito, stessa sagoma | sì: le orecchie restano staccate in tutti e due, il contorno non cambia spessore |
| Lo stato vuoto | identico al marchio di `ludoratti.it` | sì, i due tracciati e i due cerchi sono quelli di prima |
| `beat="whole"` al picco | la scala sull'`<svg>`, il gruppo fermo | `matrix(1.12, 0, 0, 1.12, 0, 0)` sull'`<svg>`, `none` sul gruppo |
| `beat="inner"` al picco | l'opposto | `none` sull'`<svg>`, `matrix(1.12, …)` sul gruppo |
| Quanti segni hanno **tutt'e due** le animazioni | zero | **0** — prima di questa passata l'intestazione le aveva entrambe, per un picco a 1,25 |
| Il perno, variante interna | unità del `viewBox` | `transform-box: view-box`, `transform-origin: 12px 13px` |
| Il perno, variante intera | il centro del rendering | `transform-origin` risolto a metà del riquadro |
| ⚠️ `transform-origin` su un `<svg>` **radice** da 96px | in unità del viewBox? | **no**: `center` → `48px 48px`, e `12px 13px` resta a dodici pixel dallo spigolo. È il motivo per cui le classi sono due |
| Quanti battono sulla pagina | solo quelli che `animateOn` permette | **9**, di cui 8 interi e 1 interno |
| I due stati, **chiaro** e **scuro** | si distinguono | sì; il colore è `brand-ink`, 4,58 e 13,43 — sopra la soglia 3 della grafica |
| Gate | verde | build, typecheck, lint 0/0, **486 test**, dodici pagine statiche |

⚠️ **Due animazioni sullo stesso segno si moltiplicano, e non sembra un difetto.** Finché il
battito era una `className`, l'intestazione e `/stile` lo passavano a mano; col battito dentro il
componente quelle righe davano `scale(1.12)` sull'`<svg>` **per** `scale(1.12)` sul gruppo. A
schermo si legge come un marchio che pulsa un po' troppo, non come un errore — si trova cercando
chi monta il pezzo, non guardandolo. Il conteggio dei doppioni nella tabella qui sopra è la riga
che lo prende.

**Che cosa protegge:** il marchio è la cosa che si vede per prima su ogni pagina di ogni
applicazione dei Ludoratti, e il suo battito è quello che lo fa sembrare vivo invece che stampato.

### Il muso del marchio: la sonda sul disegno a mano e i franchi al picco — 2026-09-21

**Esegue:** agente

**Ultima esecuzione:** agente, 2026-09-21

**Preparazione:** `http://localhost:3100/`, sezione «il marchio», blocco `muzzle`. Tre verifiche
diverse, e nessuna delle tre è guardare la pagina. **La forma** si legge dal disegno a mano
dell'utente con una sonda a componenti connesse: si classificano i pixel per colore, si prendono i
buchi *dentro* il riquadro della sagoma scura, e si riportano in unità del `viewBox` ricavando la
scala dall'anello, il cui riquadro esterno è noto per costruzione (1,25…22,75 su 24). **Il
pavimento** si legge sui pixel veri: si rende a 16, 18, 20, 24, 32 e 48 px e si ingrandisce col
vicino più prossimo, perché a quelle misure quello che conta è l'antialiasing e non la geometria.
**I franchi** si calcolano: si applica `scale(1.12)` attorno a (12 · 13) — il perno di
`.pb-mark-beat--inner` e il picco di `pb-heartbeat` — alle punte dei baffi, e si confronta la
distanza dal centro col bordo interno dell'anello (raggio 9,25) più mezzo tratto.

| Azione | Atteso | Ottenuto |
|---|---|---|
| La sonda sul disegno a mano | occhi e baffi in unità del viewBox | occhi **2,23 × 1,57** centrati a (10,3 · 12,7) e (13,9 · 12,7); tre baffi per lato |
| Il verso dell'inclinazione | punta esterna **più alta** della testa interna | sì: sinistro (9,16 · 12,34) → (11,39 · 13,23) |
| Prima taratura, occhi al centro dei lobi | un ratto | **no, un rospo**: a (9 · 11,9) stanno più esterni delle orecchie |
| Prima taratura, baffi a tratto 1,05 | baffi | **no, zampe**: e i due bassi si incrociavano sotto il naso |
| `evenodd` sul cuore pieno **senza** occhi | identico a `nonzero` | **0** byte diversi a 24, 96 e 512px |
| Occhi a 16 e 18px | due occhi | **no**: una fascia sola, con qualunque distanza |
| Occhi a 24px, varco **1,50** | due occhi | no: due macchie saldate |
| Occhi a 24px, varco **2,10** | due occhi | sì, col ponte sottile — è il numero che fissa il pavimento a 24 |
| Baffi a 0,45 e 24px | baffi | tratteggi; diventano baffi a **32** |
| Franchi delle punte, **da fermo** | > 0 | 1,41 · 1,25 · 1,28 |
| Franchi delle punte, **al picco 1,12** | > 0 | **0,54 · 0,38 · 0,43** — nella prima taratura erano 0,54 · 0,08 · **−0,16** |
| `muzzle` sul cuore **vuoto** | niente muso | sì: nessuna campitura, nessun baffo, tre tracciati |
| La finta lista di preferiti, 24px | il muso solo sui due scelti | sì: la riga non scelta non ha campitura |
| I tre gradini, **chiaro** e **scuro** | si leggono in entrambi | sì; il colore è `brand-ink`, 4,58 e 13,43 — sopra la soglia 3 della grafica che porta significato |
| Gate | verde | build, typecheck, lint 0/0, **495 test**, dodici pagine statiche |

⚠️ **Il caso dei franchi al picco è quello che nessun occhio trova.** L'anello non batte, quello che
gli sta dentro sì: una punta di baffo che da fermo ha un'unità di margine, al picco può tagliare una
riga a opacità 0,3 per un ottavo di secondo ogni 3,2 secondi. Non si vede scorrendo la pagina, non
lo prende uno screenshot e non lo prende un test di contratto. Si calcola — ed è per questo che nel
test c'è una riga che rifà quel conto a ogni run, perché allungare un baffo è la modifica più
innocua del mondo.

**Che cosa protegge:** la terza lettura del marchio — il muso del ratto — che è quella che lo rende
un personaggio invece di un cuore; e i tre pavimenti, che sono la sola cosa che impedisce di
accendere il muso dove diventa un cuore scheggiato.

### Che cosa esce davvero da `npm pack` — 2026-09-21

**Esegue:** agente — e **si rifà prima di ogni `npm publish`**, perché è l'unico momento in cui il
pacchetto si guarda da fuori.

**Ultima esecuzione:** agente, 2026-09-21

**Preparazione:** dalla cartella del pacchetto, `npm pack --dry-run`. Non si legge `package.json`:
quello dice che cosa il pacchetto **promette**, e il difetto che questo scenario cerca è
esattamente la distanza fra la promessa e il tarball. Il gate va lanciato prima, o `dist/` è quello
di ieri.

| Azione | Atteso | Ottenuto |
|---|---|---|
| `README.md` nel tarball | c'è | **no** — era in `files` e stava nella radice del repository, dove npm non guarda. Curato col README del pacchetto |
| `LICENSE` nel tarball | c'è | **no**, stesso motivo. Curato con la copia identica accanto al pacchetto |
| `styles/theme.css` e `styles/animations.css` | ci sono | sì — 12,6 KB e 45,4 KB |
| `assets/ludoratti.mp3` | c'è | sì, 1,3 MB, che è il grosso del pacchetto |
| `dist/index.js` e `dist/index.d.ts` | ci sono, e sono gli indirizzi degli `exports` | sì |
| Le 158 mappe di `dist/` | risolvono | **no**: dentro c'è `"sources": ["../../src/…"]` e `src/` non veniva spedito — 359 KB di mappe cieche. Curato spedendo anche `src/` |
| `tests/` | **non** c'è | sì: `files` non lo nomina |
| Avvisi di npm (licenza, campi) | nessuno | nessuno: `PolyForm-Noncommercial-1.0.0` è un identificatore SPDX valido |
| `npm view plague-board-ui` | 404, il nome è libero | 404 il 2026-09-22 — e resta libero finché non si pubblica |
| Peso | — | **393 file, 1,7 MB compresso, 2,4 MB aperto** (era 320 / 1,5 / 2,0 prima di README, LICENSE e sorgenti) |

⚠️ **Il momento per guardare è prima del primo publish, e non è una formalità.** Finché il nome non
è sul registry, la superficie pubblica e la forma del pacchetto si cambiano gratis; dopo, un cambio
incompatibile costa una minore in `0.x` — e chi ha scritto `^0.1.0` non la prende da solo, quindi
resta fermo — e una major dalla `1.0.0`. Le tre cose trovate qui (README, LICENSE, mappe cieche)
sarebbero state tutte scoperte da qualcun altro.

⚠️ **Il guard non sostituisce questo scenario, e viceversa.**
[`tests/publicSurface.test.ts`](packages/plague-board-ui/tests/publicSurface.test.ts) tiene i due
elenchi allineati — ogni indirizzo che `exports` promette sta dentro una cartella che `files`
spedisce, e ogni voce di `files` esiste sul disco — ma li legge tutti e due dal manifesto. Che cosa
npm ci metta davvero dentro dipende anche da `.npmignore`, da `.gitignore` e da che la build sia
stata lanciata: quello lo dice solo il tarball.

**Che cosa protegge:** che chi installa il pacchetto trovi gli stili, la traccia e il testo della
licenza. Un `@import "plague-board-ui/theme.css"` che non risolve è la prima riga del primo file di
chi ci prova, e a noi in casa funziona.

### Il tarball installato in un progetto finto — 2026-09-22

**Esegue:** agente — **prima di ogni `npm publish`**, e ogni volta che si tocca la forma del
pacchetto (`exports`, `files`, `tsconfig.build.json`, la build).

**Ultima esecuzione:** agente, 2026-09-22

**Preparazione:** `npm pack` dentro una cartella dello scratchpad, poi un progetto vuoto con
`"type": "module"` e `npm install ./plague-board-ui-0.1.0.tgz`. **Non si usa il playground**: quello
vede il workspace e ha un bundler davanti, cioè esattamente le due cose che nascondono i difetti
che si cercano qui. npm tira dentro da sé le quattro peer, ed è anche la prova che il contratto
delle peer regge senza che l'applicazione le nomini.

| Azione | Atteso | Ottenuto |
|---|---|---|
| `import 'plague-board-ui'` da Node | i nomi della libreria | **`ERR_MODULE_NOT_FOUND` su `./brand/BarRow`**: `tsc` non riscrive gli specificatori e Node non indovina l'estensione. Curato scrivendo `.js` nei 185 import relativi di `src/` |
| Di nuovo, dopo la cura | idem | **76 nomi** — 134 meno i 58 tipi, che a runtime non esistono |
| `RatIcon`, `PlagueBar`, `IconBase`, `useRandomPhrase`, `binaryRain` | funzioni | sì |
| `RAT_ICON_MUZZLE_FLOOR`, `PLAGUE_BAR_MARK_SIZE`, `RAT_PHRASES`, `LUDORATTI_COPY` | i valori, non `undefined` | sì |
| `plague-board-ui/dist/index.js`, `/src/index.ts`, `/package.json` | chiusi | `ERR_PACKAGE_PATH_NOT_EXPORTED` su tutti e tre |
| `plague-board-ui/theme.css`, `/animations.css`, `/assets/ludoratti.mp3` | risolvono a un file che c'è | sì |
| `'use client'` in cima a `dist/brand/PlagueBar.js` | c'è | sì — sopravvive a `tsc` e al tarball |
| La mappa di `PlagueBar.js` | punta a un file spedito | `../../src/brand/PlagueBar.tsx`, e il file c'è |
| `tsc` di un file che importa componenti **e tipi**, con `skipLibCheck: false` | pulito | pulito con `moduleResolution: bundler` **e** con `nodenext` |

⚠️ **Il difetto trovato qui non lo vedeva nessun'altra passata.** Il gate era verde, il playground
pure, e `npm pack` mostrava un tarball perfetto: l'ingresso pubblico era irreparabile solo quando
qualcuno lo importava **senza un bundler davanti**. È la differenza fra guardare il pacchetto e
usarlo.

**Che cosa protegge:** che `import { RatIcon } from 'plague-board-ui'` funzioni davvero — in un
bundler, in Node, e nei due modi in cui TypeScript risolve i moduli.

### Le storie: le cornici dicono il vero, e che cosa hanno trovato — 2026-09-22

**Esegue:** agente — quando si tocca `playground/stories/`, `app/cornice/` o `StoryFrames.tsx`, e
ogni volta che un componente cambia la sua risposta alla finestra o al contenitore.

**Ultima esecuzione:** agente, 2026-09-22

**Preparazione:** `npm run build` e `npm run playground`, poi `/storie/<Nome>`. Le misure dentro una
cornice si leggono dalla pagina del catalogo con `iframe.contentDocument` e
`iframe.contentWindow.innerWidth`: stessa origine, quindi si arriva dentro.

| Azione | Atteso | Ottenuto |
|---|---|---|
| `/storie/PlagueBar`, formato 360: la finestra della cornice | 360 | **358** al primo giro — il bordo stava sull'involucro e se ne prendeva due. Spostata la misura sull'iframe: 360 |
| Le cinque varianti a 360 | compatte, tranne `isCompactOnMobile={false}` | 37 · 37 · 37 · **53** · 29 px |
| Le stesse a 768 | tre altezze | 49 · 37 · 65 · 65 · 41 px, con la finestra a 768×480 |
| La grande in una cornice 768 alta 120 | — | **37**: per `pb-roomy` è un telefono coricato. È il motivo per cui a 768 e a pieno la finestra della cornice non scende sotto i 30rem |
| `/storie/CreditLine` a 768, a colpo d'occhio | le cinque varianti | al primo giro **una sola**: ogni cornice era alta 480 anche da vuota, e l'utente vedeva «soltanto la versione estesa». Ora l'iframe resta 768×480 e l'involucro è alto quanto la variante: cinque in uno schermo, e le barre a 768 misurano ancora 37 · 49 · 65 |
| Tutte le cornici delle 53 storie, in sviluppo | 200 senza errore | sì. `next build`: **308** cornici e 53 pagine, tutte statiche; `/` resta statica |
| `/storie/CreditLine`: le varianti si distinguono? | ognuna diversa dalle altre | al primo giro **no** (segnalato dall'utente): a 360 cinque su sei dicevano «By:», a 768 erano a coppie identiche — differivano per il perché, non per quello che si vede. Riscritta in quattro, con la regola mostrata in due contenitori di 34 e 18rem: «Creato da…» ‖ «By:…», «Scritto da…» ‖ «Di:…», «By:» ‖ «By:», e «Creato da…» senza contenitore — **uguali a 360 e a 768**. Lo stesso per `SupportButton`, da quattro a tre |
| `ParticleBurst`, «Sprigiona» | la fontana | 17 nodi `position: fixed` nel portale della cornice: il riferimento clonato da `WithHandle` arriva |
| `LoginScreen` in chiaro: le voci del selettore d'angolo | ≥ 4,5 | **1,19** — curato in `PlagueBackground` con `text-foreground`: 14,52, come in scuro |
| `CreditLine` **senza** `@container` sopra, a 768 | lunga, come dicono il suo JSDoc e `CLAUDE.md` | **corta**: «By: Superivan94». Le classi erano mobile-first dal primo commit, quindi il «resta lunga» non era mai stato misurato. Curato scrivendole al rovescio — la lunga di base, la corta dietro `@max-lg:` —, anche in `SupportButton` (utente, 2026-09-22) |
| La stessa, dopo la cura | lunga senza contenitore, corta in uno stretto | senza contenitore «Creato da · Superivan94 · AI-Dev» a 360 **e** a 768; in un contenitore «By: · Superivan94» a 360 e la forma lunga a 768. Il piede vero: «By:» e il comando senza testo a 360, «Creato da» e «Offrimi una pozione» a 768 |
| La firma, il comando e il piede **in una colonna stretta** (15rem), a 768 e a pieno | la forma corta anche su una finestra larga | «By: · Superivan94», «Di: · Superivan94», la sola tazza, e il piede con «By:» e la versione: la soglia è del contenitore, non della finestra |
| `CreditLine` con `isCompact`, senza contenitore, a 360 e a 768 | corta a tutti e due | «By: · Superivan94» e «Di: · Superivan94» a 360 **e** a 768, accanto alla stessa firma senza la prop che a 768 è intera |
| `HoverEmitter`, «col cenno sfasato di due secondi» — oggi «con l'animazione del salto sfasata di due secondi» | diverso dalla pioggia binaria | **identico** (segnalato dall'utente): lo sfasamento su una scheda sola non si vede. Ora due schede affiancate, la seconda sfasata: fasi del salto a **2000 ms** esatti l'una dall'altra, misurate con `getAnimations()` |
| Le altezze di tutte le cornici di una storia, ricaricando | uguali per varianti uguali | al primo giro **120** sulla prima cornice di `HoverEmitter` contro 214: il suo messaggio era partito prima che la pagina ascoltasse. Con la domanda e il primo invio al montaggio, tre caricamenti su tre a 214, anche in una scheda in secondo piano |
| «Prossima» da `BarRow` col formato a 768 | `CountedChips`, sempre a 768 | sì: cornice larga 768, il formato sta in `sessionStorage` |
| «← tutte le storie» dopo `BarRow` → `CountedChips` → `CreditCard` | l'indice accende l'ultima | `CreditCard` con «l'ultima vista», una sola accesa, in vista |
| La stessa cosa da `VirusIcon`, l'ultima dell'elenco | accesa e portata in vista | sì, con la pagina scorsa a 2955 px; `VirusIcon` ha solo «‹ SparklesIcon» |
| Una storia tolta dall'indice | `tsc` rosso | rosso, e l'errore nomina `DripIcon` |
| `CloudIcon: dripIconStory` | rosso da qualche parte | `tsc` **verde** — due icone hanno lo stesso tipo —, `/storie` in sviluppo **500** con «Storie sotto il nome di un altro componente: CloudIcon» |

⚠️ **I due difetti li hanno trovati le storie guardando quello che nessuna pagina mostrava**: il
selettore illeggibile c'era anche su `/accesso` in tema chiaro, ma lì nessuno guardava il chiaro
accanto allo scuro; la firma corta c'era in qualunque pagina che montasse `CreditLine` da sola, e
nessuna lo faceva. È la ragione per cui le cornici mostrano i due temi insieme, e per cui la storia
di `CreditLine` tiene apposta la variante senza contenitore.

**Che cosa protegge:** che un componente guardato a 360 sia guardato davvero a 360 — media query di
finestra comprese — e che ogni storia mostri il componente che nomina.

### I pezzi comuni: attesa, vuoto, dialoghi, avvisi, profilo, tema, navigazione — 2026-09-23

**Esegue:** agente — i test tengono i contratti (ruoli, nomi, chi chiama chi, il conto del ritiro);
quello che solo un browser dice è che cosa si vede e con che contrasto, nei due temi.
**Ultima esecuzione:** agente, 2026-09-23.

**Preparazione:** `npm run build`, **riavviare** il dev server (le classi sono nuove), poi le storie
di ogni pezzo in `/storie`. Contrasti col metodo della tela 1×1 e degli strati composti.

| Azione | Atteso | Ottenuto |
|---|---|---|
| `PlagueLoader` piccolo dentro il bottone di Google in attesa | il marchio a 20 px, muto | **20×20**, `pb-heartbeat 1.2s`, dentro un `aria-hidden` |
| Lo stesso dentro un `Button` qualunque | alto quanto il testo | **14×14**, cioè `1em` del bottone |
| `PlagueEmptyState` nei due temi | la mascotte, il titolo di casa, leggibili | la mascotte a 96, «Nessuna traccia nelle fogne» in `foreground` |
| `PlagueConfirmDialog` aperto dal suo comando | `alertdialog` col nome del titolo, bordo verde, teschio | `role="alertdialog"`, nome «Estingui il ceppo», bordo `brand-ink/50`, sfumatura, «Annulla» ed «Elimina» |
| `PlagueAlert`, i cinque toni | titolo e segno sopra 4,5 nei due temi | minimo **5,72** (avviso in chiaro), massimo 17,72 |
| `PlagueToastRegion`, quattro notifiche | idem, e la croce in italiano | minimo **5,72**, «Chiudi» su tutte, il marchio che batte nell'attesa |
| `ProfileMenu` aperto | nome, email, grado, le voci, l'uscita in rosso | tutto; l'uscita rossa solo dopo averla messa in `[data-slot="label"]` |
| Il rosso dell'uscita | ≥ 4,5 | **3,57** in chiaro e **3,97** in scuro ❌ — è `--danger` di HeroUI: va alla passata sui colori |
| `ThemeSwitch`, si sceglie «scuro» | la scelta passa, il riquadro di prova diventa scuro | `aria-checked` sul terzo, riquadro con `dark` |
| I tre segni a 168 px | un sole, una luna, uno schermo | i raggi staccati, la falce aperta in alto a destra, la cornice col piede |
| `PlagueDock` in basso | centrata sul bordo, voce corrente in lime | 325×63 a metà finestra, «Catalogo» `aria-current="page"` |
| Dopo 8 s senza toccarla | si raccoglie al centro, resta il marchio | `scale(0.15)`, `visibility: hidden`, `inert`; comando 44 px «Mostra la navigazione», `aria-expanded="false"` |
| A sinistra | in verticale | 95×222 attaccata al bordo |
| Le voci nell'isola scura | ≥ 4,5 | **6,47** le altre, **7,76** la corrente |
| **Dentro il catalogo**, `/storie/PlagueDock` a pieno — trovato dall'utente | il pannello in ognuna delle dodici cornici | ❌ prima: finestra 480, involucro 361, pannello a 406–468, tre varianti vuote; ✅ dopo `dad1a35`: involucro 481, **12 su 12** visibili a pieno, a 768 e a 360 |
| `/storie/PlagueToastRegion` a pieno, «Si è rotto» | la notifica nel riquadro | 412–464 su 481 |

⚠️ **Un pezzo in `position: fixed` si guarda dentro il catalogo, non nella sua cornice aperta da
sola.** Il primo giro di questo collaudo l'aveva fatto nella cornice, dove la finestra è quella
del browser e il fondo si vede sempre: il taglio dell'involucro non c'era, e le varianti vuote non
le ha viste nessuno finché non ci è passato l'utente.

⚠️ **Due misure che i test non danno.** Il rosso di `danger` sotto soglia è un token di HeroUI, e
lo si vede solo misurando. E la navigazione in `prefers-reduced-motion` il riquadro del browser
non la emula: lì vale il test che rilegge la riga `transition: none` nel foglio.

**Che cosa protegge:** che i pezzi nati dal giro delle due app sembrino **nostri** in tutti e due i
temi — il punto d'arrivo era «c'è, e sembra dei Ludoratti», non «c'è».
