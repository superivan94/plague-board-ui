# Contribuire

Le **issue** e le **pull request** sono aperte a chiunque. Segnalare un difetto, proporre un
componente o sistemare un contrasto illeggibile è benvenuto, e non serve chiedere il permesso
prima.

**La decisione di accettare o rifiutare una pull request resta di chi possiede il progetto**, cioè
i Ludoratti E. Corp. Non è una formalità: questa libreria è l'identità visiva di quattro
applicazioni in produzione, e una modifica al modo in cui si comporta un componente le tocca tutte
e quattro insieme.

## Come è fatto il progetto

Due workspace npm:

- `packages/plague-board-ui/` — la libreria, l'unica cosa che viene pubblicata
- `playground/` — un'applicazione Next che la guarda, e che **non** viene pubblicata

```bash
npm install
npm run playground     # il playground, per vedere i componenti
npm run build          # compila la libreria
npm test               # i test della libreria
npm run typecheck      # tsc su tutto
npm run lint           # eslint su tutto
```

## Che cosa chiediamo a una pull request

- **Tutti e quattro i comandi del gate verdi.** Se uno fallisce, dillo nella pull request invece di
  toglierlo di mezzo.
- **Un componente nuovo ha la sua storia** in `playground/stories/`, e un test lo verifica: c'è un
  controllo automatico che fallisce se un componente esportato non ha la sua storia.
- **Si rende nei due temi**, chiaro e scuro. Un componente che si vede solo sullo scuro è un
  componente non finito.
- **Niente dipendenze nuove** senza averne parlato in una issue. Questa libreria ha solo peer
  dependency, ed è una scelta: chi la installa non si deve trovare in casa un albero che non ha
  scelto.
- **I nomi del codice in inglese, i commenti in italiano.** È la convenzione di tutti i progetti
  dei Ludoratti.

## Segnalare un difetto

Nella issue serve **che cosa hai visto** e **dove**: quale componente, quale tema, quale larghezza.
Le larghezze che ci interessano sono tre — 360, 768 e schermo pieno — e la prima è quella dove i
difetti si nascondono.
