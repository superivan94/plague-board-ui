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
| I cenni delle due schede autore | non partono insieme | `animation-delay` **0s** e **2s**: due schede che saltellano allo stesso istante sembrano una cosa sola che pulsa |
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

**Esegue:** agente — la cadenza, la raffica del tocco, il cenno e il silenzio sotto «meno
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
| Si carica la pagina | tre emettitori fermi, ognuno col suo cenno acceso | 3 nodi `.pb-hover-hint`, animazione `pb-hover-hint` di 6000 ms, iterazioni infinite |
| Si porta il mouse sulla scheda di Superivan94 | un fumetto per volta, e il cenno di **quella** scheda si spegne | i cenni passano da 3 a 2; `left: 48.4%; top: -77.5%; animation-duration: 3s` |
| Si campiona ogni 120 ms per undici secondi e si conta quanti ce ne sono insieme | **mai più di uno**, e fra l'uno e l'altro la scena resta vuota | `maxN` **1** su 90 letture, 5 delle quali a scena vuota; nascite a 2860, 3115 e 3240 ms l'una dall'altra, cioè i 3200 dichiarati |
| Si guarda dove nascono, uno dopo l'altro | ogni volta da un'altra parte: tre altezze a turno | `-77,5%`, `-55%`, `-100%`, in giro — e il fondo del fumetto sta fra **6 e 23 px** sopra il bordo della scheda, cioè dove la sua punta indica qualcosa |
| Si guarda quanto sbordano dalla scheda | poco, e da tutti e due i lati: il fumetto si **centra** sul punto in cui nasce | mai oltre il bordo destro (**−13 px** il più sporgente) e al massimo **24 px** oltre il sinistro, su una scheda larga 142 |
| Si mette in pausa l'animazione di un fumetto e la si porta a mano sui suoi istanti | entrata 0,25 s, due secondi e mezzo fermo, uscita 0,25 s | opacità **0 → 1 fra 0 e 180 ms** (con lo sbalzo a `scale(1.08)`), posato a `scale(1)` a **250**, fermo e opaco fino a **2750**, poi 0,32 a 2875 e **0** a 2999 |
| Si guarda se due frasi di fila sono uguali | mai: si pesca fra le altre | **0** ripetizioni su 11 uscite, 10 frasi diverse |
| Si misura la frase più lunga dentro un fumetto vero | sotto il `max-width`, o si scrive sul niente | «SONO UN MAGO DELLA PROGRAMMAZIONE!» fa **179 px** — sui 180 di RattInventario era a un pixel dal bordo, ed è il motivo dei 200 di adesso. Nessuna delle ventidue supera il riquadro |
| Si porta il mouse su AI-Dev | la pioggia sale e si assesta | 4, 8, 12, 16, 17, 18 campionando ogni 300 ms: è l'equilibrio fra 80 ms di cadenza e 0,8–1,8 s di vita |
| Si porta il mouse altrove | smette di generarne, e i diciotto in volo **finiscono la loro corsa** | 18, 10, 5, 3, 1, 0, 0 in due secondi e mezzo — nessuno sparito di colpo, e i tre cenni tornano |
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
