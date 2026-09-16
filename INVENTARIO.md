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
| Il fumetto del ratto | `tooltip`, `popover` | ⚠️ **da verificare** | i suoi sono ancorati e a innesco d'interazione; il nostro nasce da un **clic** e si spegne **da sé** dopo 2,5s. Se `Tooltip` accetta di essere pilotato si veste, altrimenti da zero |
| Le icone di dominio | — | **da zero** | vedi sopra: `shared-icons` non ne ha |
| Il ratto: disegno, corsa, sciame | — | **da zero** | |
| Fondale, bolle tossiche, gocce che colano | — | **da zero** | |
| Il pulsare, e l'emettitore all'hover | — | **da zero** | sono animazioni su ciò che avvolgono, non controlli |
| La firma «umano e AI» | `card` | **misto** | la scheda si veste, l'easter egg è nostro |
| La schermata di accesso | — | **composizione** | |
| La barra in cima alla pagina | `surface` — ⚠️ **non** `header` e **non** `toolbar` | **vestire `Surface`** | letti prima di decidere: il suo `header` è l'intestazione di una *sezione* di elenco (`text-xs text-muted`), e `toolbar` è un gruppo di controlli `w-fit` con navigazione a frecce. Una lastra appiccicata in cima, semitrasparente e sfocata, non c'è |
| Il pallino che pulsa | — | **da zero** | è un `<span>` tondo con `animate-pulse`: non c'è niente da vestire, e metterlo in un `chip` sarebbe un componente intero per un cerchio |
| L'etichetta di servizio a caratteri fissi | `typography` | **da zero** | ⚠️ da rivedere: `typography` esiste e non l'ho ancora letto. Per ora è tre classi, e il valore sta nell'averle in un posto solo |

## ⚠️ Quello che HeroUI ha e che le nostre app si sono scritte a mano

Non è roba della libreria — è **materiale per il punto 4**, quando Rattoteca passa alla 3. Vale la
pena che sia scritto qui, perché un componente che esiste già e che nessuno ha guardato si
riscrive due volte:

`empty-state` · `skeleton` · `spinner` · `toast` · `drawer` · `kbd` · `input-otp` ·
`scroll-shadow` · `meter` · `progress-circle` · `progress-bar` · `pagination` · `table` ·
`typography` · `breadcrumbs` · `disclosure` · `search-field` · `number-field` · `input-group`

## Come si aggiorna

Una riga per componente nuovo, **prima** di scriverlo. Se la riga dice `da zero`, deve dire anche
**quale pezzo manca**: «non c'è» da solo non è una motivazione, è una scorciatoia.
