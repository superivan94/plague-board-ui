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

| Azione | Atteso | Ottenuto |
|---|---|---|
| Aperto senza cercare | 33 frasi, numerate come nell'array | 33, numerate da 0 |
| Si scrive `squit` | le quattro varianti, e zero fra le frasi dello sviluppatore | «4 su 33» · indici 0, 3, 7, 11 · `DEV_PHRASES 0 su 14` |
| Si scrive `e solo l` (senza accento) | trova «È solo l'inizio... 🏭» | «1 su 33» · indice 4 |
| Si scrive `zzz` | lo dice, invece di mostrare il vuoto | «0 su 33» e «Nessuna frase contiene «zzz».» |
| Esc nel campo | svuota e rimette tutto | valore `""`, 33 righe |
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
