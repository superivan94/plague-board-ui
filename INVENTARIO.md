# INVENTARIO.md — che cosa HeroUI copre già

📌 **La regola che questo file fa rispettare:** *prima si cerca in HeroUI; si scrive da zero solo
ciò che non c'è, e si dice quale pezzo manca.* Nel diff «non c'è» e «non l'ho cercato» si scrivono
uguale — questo file è la differenza fra i due.

Si aggiorna **prima** di disegnare un componente nuovo, non dopo.

## La misura

HeroUI `3.2.5` porta **84 componenti React** (`node_modules/@heroui/react/dist/components`, meno
`rac`, `icons` e l'indice) e altrettanti fogli di stile. Il conto si rifà con un comando, non a
memoria:

```bash
ls node_modules/@heroui/react/dist/components | grep -v '\.' | grep -v '^rac$' | wc -l
```

⚠️ **Le icone sono l'eccezione, e va detta subito**: `@heroui/shared-icons` porta i **45 glifi
interni** del kit — frecce, spunte, chiusure — e **nessuna icona di dominio**. Un teschio, un
biohazard, un dado o un segnalino lì non ci sono e non ci saranno.

## Che cosa serve alla libreria, e che cosa se ne fa

`vestire` = il componente è di HeroUI e ci mettiamo sopra l'aspetto dei Ludoratti.
`da zero` = HeroUI non ha niente che ci somigli.
`composizione` = mette insieme pezzi che esistono già, nostri o suoi.

| Ci serve | In HeroUI | Che si fa | Perché |
|---|---|---|---|
| Pulsante primario e «Accedi con Google» | `button` | **vestire** | ✅ già fatto: legge `--accent` e `--accent-foreground` da `theme.css`, senza una riga sua |
| Il pannello della peste | `card`, `surface` | **vestire** | `surface` è esattamente la superficie su cui poggia tutto; a noi restano bordo, alone e sfocatura |
| L'avatar con l'anello verde | `avatar` | **vestire** | l'anello è un `ring`, non un componente |
| La pastiglia col nome tematico | `badge`, `chip` | **vestire** | due componenti per due usi: `badge` sta *addosso* a qualcosa, `chip` sta da solo |
| Il separatore «oppure» | `separator` | **vestire** | serve solo lo slot per l'icona in mezzo |
| Il livello tossico, quattro stati | `toggle-button-group`, `slider`, `meter` | **vestire** | ⚠️ da verificare quale dei tre: è un valore ordinato di quattro passi, e i tre lo dicono in modi diversi |
| Il comando della musica | `toggle-button` + `slider` | **vestire** | acceso/spento e volume sono due controlli, non uno |
| Il gruppo di chip che si conta | `chip`, `tag-group` | **misto** | il chip si veste; ⚠️ **il contenitore che ne mostra pochi e si espande non c'è** |
| Il fumetto del ratto | `tooltip`, `popover` | **da zero** — ✅ verificato il 2026-09-17 | `Tooltip` **accetta** di essere pilotato con `isOpen`: la domanda non era quella. Con una sonda si è letto che cosa produce, e produce `role="tooltip"` legato al grilletto con **`aria-describedby`** dentro un contenitore di sovrapposizione: la frase diventa la *descrizione permanente* di chi la dice, riannunciata a ogni fuoco. «Squit!» non descrive il ratto — è una cosa che dice una volta. Per un messaggio che arriva e se ne va il ruolo è `status`, e il fumetto sta appeso a chi parla invece che in un portale |
| La mascotte che al clic parla | `button` — ⚠️ e `Pressable` / `usePress` di `react-aria` | **da zero, sul `usePress` di `react-aria`** | `Button` è un controllo **con una taglia**, e una mascotte è contenuto di misura qualunque: `.button` è `h-10 md:h-9 px-4 rounded-3xl`, e `.button--sm` arriva a scrivere `svg { size-4 }` — un segno da 56px ci finirebbe dentro a 16. `Pressable` di `react-aria` invece **non** aggiunge né `role` né `tabIndex`: clona il figlio e pretende che sia già focalizzabile, quindi serve a chi un pulsante ce l'ha già. Resta `usePress`, che è il pezzo giusto e viaggia già fra le peer |
| Le icone di dominio | — | **da zero** | vedi sopra: `shared-icons` non ne ha |
| Il ratto: disegno, corsa, sciame | — | **da zero** | manca il soggetto, non il meccanismo: una mascotte di marca non è un componente di un kit. ⚠️ `RatMascot` non è nemmeno codice — è **il disegno**, un WebP da 19,3 KB incorporato in un modulo, perché una libreria che si costruisce con `tsc` non può fabbricare l'URL di un proprio file binario. ⚠️ `Rat` è **ricalcato** (2026-09-18) dalle tre illustrazioni in `art/reference/`, generate nello stile della mascotte: non è codice disegnato, è `ratArt.ts` prodotto da `scripts/genera-ratto.mjs`. Tre giri a mano prima — punti Bézier a numeri — non sono arrivati alla qualità della mascotte, e il limite era il metodo, non l'SVG. Del disegno di `RunningRat` non resta niente: le livree stesse sono ora misurate sulle reference |
| Fondale, bolle tossiche, gocce che colano | — | **da zero** | |
| Il pulsare, e l'emettitore all'hover | — | **da zero** | sono animazioni su ciò che avvolgono, non controlli |
| La firma «umano e AI» | `card` | **misto** | la scheda si veste, l'easter egg è nostro |
| La schermata di accesso | — | **composizione** | |
| La barra in cima alla pagina | `surface` — ⚠️ **non** `header` e **non** `toolbar` | **vestire `Surface`** | letti prima di decidere: il suo `header` è l'intestazione di una *sezione* di elenco (`text-xs text-muted`), e `toolbar` è un gruppo di controlli `w-fit` con navigazione a frecce. Una lastra appiccicata in cima, semitrasparente e sfocata, non c'è. ⚠️ E `Surface` porta **solo** `variant` — `default`, `secondary`, `tertiary`, `transparent`: nessuna taglia e nessuna spaziatura, quindi le tre altezze sono nostre |
| Il pallino che pulsa | — | **da zero** | è un `<span>` tondo con `animate-pulse`: non c'è niente da vestire, e metterlo in un `chip` sarebbe un componente intero per un cerchio |
| Il confine fra due categorie, col nome | `separator` | **vestire `Separator`** | ha `orientation` e tre `variant`, e sotto c'è il primitivo di `react-aria`: ruolo e `aria-orientation` li mette lui — e **non** scrive `aria-orientation` sull'orizzontale, perché è il valore predefinito del ruolo. Manca solo l'etichetta accanto, che è `TechRule`. ⚠️ Il **colore** però è nostro: `--separator` su `gray-950` fa **1,24** di contrasto e la riga sparisce, perché quel token è tarato sulle superfici del suo tema |
| L'etichetta di servizio a caratteri fissi | `typography` | **da zero** | ⚠️ da rivedere: `typography` esiste e non l'ho ancora letto. Per ora è tre classi, e il valore sta nell'averle in un posto solo |

## ⚠️ Quello che HeroUI ha e che le nostre app si sono scritte a mano

Non è roba della libreria — è **materiale per il punto 4**, quando Rattoteca passa alla 3. Vale la
pena che sia scritto qui, perché un componente che esiste già e che nessuno ha guardato si
riscrive due volte:

`empty-state` · `skeleton` · `spinner` · `toast` · `drawer` · `kbd` · `input-otp` ·
`scroll-shadow` · `meter` · `progress-circle` · `progress-bar` · `pagination` · `table` ·
`typography` · `breadcrumbs` · `disclosure` · `search-field` · `number-field` · `input-group`

✅ **Quattro di questi sono stati usati davvero**, nell'elenco consultabile delle frasi del
playground (2026-09-17), e reggono senza una riga di stile nostra:

- **`Disclosure`** — `Root`/`Heading`/`Trigger`/`Content`/`Body`/`Indicator`. Il grilletto è un
  `<button>` con `aria-expanded` e `aria-controls` già cablati. ⚠️ **`Heading` vale `h3` se non gli
  si dice `level`**, quindi sotto un `h1` è un salto di livello: si passa `level={2}`.
- **`SearchField`** — `type="search"`, Esc che svuota, e il pulsante di pulizia già dentro. Serve
  solo `aria-label`, perché un campo senza etichetta visibile resterebbe senza nome.
- **`ScrollShadow`** — un `<div>` che scorre e si sfuma ai bordi quando c'è altro sopra o sotto.
  `size`, `offset`, `visibility`, `hideScrollBar`.
- **`EmptyState`** — ⚠️ è **solo un contenitore vestito**: non ha sotto-componenti per icona,
  titolo e testo, quindi il contenuto è tutto di chi lo usa.

## Come si aggiorna

Una riga per componente nuovo, **prima** di scriverlo. Se la riga dice `da zero`, deve dire anche
**quale pezzo manca**: «non c'è» da solo non è una motivazione, è una scorciatoia.
