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
