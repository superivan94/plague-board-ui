import { LUDORATTI_COPY, TechLabel, TechRule } from 'plague-board-ui';

/**
 * ⚠️ Le voci si leggono da `Object.entries`, non da un elenco scritto qui: un termine aggiunto al
 * dizionario compare in questa pagina **da sé**. Scriverlo a mano vorrebbe dire che il giorno in
 * cui la libreria ne esporta uno nuovo, l'unico posto in cui si guardano è indietro di una voce —
 * ed è lo stesso difetto della pagina orfana che `pages.ts` esiste per non far succedere.
 */
const VOCI = Object.entries(LUDORATTI_COPY);

/** La pagina è un componente **server**: il dizionario è un dato, e i dati attraversano il confine. */
export default function LessicoPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Il lessico</h1>
        <p className="text-sm text-muted">
          Le parole di casa, ognuna accanto a quella generica che sostituisce.{' '}
          <code>LUDORATTI_COPY</code> è un <strong>dato</strong>, come <code>RAT_PHRASES</code>: i
          componenti continuano a ricevere le parole come prop, la libreria esporta il dizionario, e
          chi vuole la voce dei Ludoratti lo applica. Chi non la vuole lo ignora, e il pacchetto non
          se ne accorge.
        </p>
      </div>

      <TechRule>le {VOCI.length} voci</TechRule>

      <div className="overflow-x-auto">
        <table className="w-full min-w-lg border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4 font-medium">chiave</th>
              <th className="py-2 pr-4 font-medium">che cosa sostituisce</th>
              <th className="py-2 font-medium">la parola di casa</th>
            </tr>
          </thead>
          <tbody>
            {VOCI.map(([chiave, { plain, house }]) => (
              <tr key={chiave} className="border-b border-border/60 align-top">
                <td className="py-2 pr-4">
                  <code>{chiave}</code>
                </td>
                <td className="py-2 pr-4 text-muted line-through">{plain}</td>
                <td className="py-2 font-medium text-brand-ink">{house}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TechRule>le regole</TechRule>

      <p className="text-sm text-muted">
        ⚠️ <strong>Ogni voce porta il termine generico, e non è decorazione: è dove va messa.</strong>{' '}
        Un dizionario di sole parole nostre è un elenco di battute che nessuno sa dove mettere —{' '}
        «Torna nelle fogne», da solo, non dice che è il comando di uscita. Il generico è anche la
        chiave di ricerca umana: si cerca la parola che si stava per scrivere, e si trova la nostra.
      </p>

      <p className="text-sm text-muted">
        ⚠️ <strong>È di casa, non di un&apos;applicazione.</strong> Qui stanno i termini che tutte e
        quattro le app hanno — accedere, uscire, cercare, le impostazioni. «I tuoi manuali» e «il
        tuo inventario» <strong>non ci stanno</strong>: sono di una sola, e un dizionario di casa
        che nomina il dominio di un&apos;app smette di valere per le altre tre. È la stessa riga
        che tiene <code>RAT_PHRASES</code> senza frasi sull&apos;inventario.
      </p>

      <p className="text-sm text-muted">
        ⚠️ <strong>In italiano, e non è rimandabile.</strong> Una frase tradotta a metà è peggio di
        una non tradotta. Il giorno che servisse l&apos;inglese è un <strong>secondo dizionario con
        le stesse chiavi</strong>, non un campo in più qui dentro.
      </p>

      <p className="text-sm text-muted">
        ⚠️ <strong>Un comando che cancella per sempre tiene il generico accanto, non al suo
        posto.</strong> <code>delete</code> è l&apos;unica voce con questa avvertenza:
        «Estingui» è una bella parola e non è un&apos;etichetta sufficiente da sola, perché chi non
        conosce il nostro vocabolario deve capire lo stesso che cosa sta per succedere. La forma che
        regge è il titolo di casa e la conferma in chiaro.
      </p>

      <TechRule>come lo monta un&apos;applicazione</TechRule>

      <p className="text-sm text-muted">
        Si prendono le voci di casa dal dizionario e si affiancano le proprie. È quello che fa la
        pagina <strong>La direzione</strong>, che accanto a cinque voci della libreria ne tiene una
        sua — «I tuoi manuali» — perché quella è di Rattoteca:
      </p>

      <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-xs leading-relaxed">
        {`const lexicon: readonly LudorattiTerm[] = [
  LUDORATTI_COPY.signIn,
  { plain: 'I tuoi manuali', house: 'I manuali della diffusione' },
  LUDORATTI_COPY.catalog,
];`}
      </pre>

      <p className="text-sm text-muted">
        Le chiavi sono tipate: <code>LUDORATTI_COPY.signin</code> non compila. È il motivo per cui
        il dizionario è dichiarato con <code>as const satisfies</code> — il{' '}
        <code>satisfies</code> controlla che ogni voce abbia le sue due parole,{' '}
        l&apos;<code>as const</code> tiene le chiavi letterali invece di appiattirle a{' '}
        <code>string</code>. Senza, un refuso tornerebbe <code>undefined</code> a schermo.
      </p>

      <TechRule>da dove vengono</TechRule>

      <div className="flex flex-col gap-2">
        <TechLabel className="text-muted">tredici dalle app, invariate</TechLabel>
        <p className="text-sm text-muted">
          Vengono da <code>ludoratti.it</code> e dalla schermata di accesso di RattInventario, e non
          sono state ritoccate: riscriverle sarebbe riscrivere l&apos;identità, che è la cosa che
          questa libreria deve conservare — la stessa regola delle frasi del ratto.
        </p>
        <TechLabel className="mt-2 text-muted">dieci coniate qui</TechLabel>
        <p className="text-sm text-muted">
          Con le sole tredici il dizionario copriva l&apos;accesso e niente altro. Un caricamento,
          un elenco vuoto e un errore sono le tre schermate che un&apos;applicazione mostra più
          spesso: senza una parola nostra, tornano a essere quelle di chiunque.
        </p>
      </div>
    </main>
  );
}
