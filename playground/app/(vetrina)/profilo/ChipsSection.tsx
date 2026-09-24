import { CountedChips, TechLabel, TechRule, ThematicBadge } from 'plague-board-ui';

/** Sei tag di un gioco da tavolo, per far vedere a che serve contarli. */
const TAG = ['cooperativo', 'medioevo', 'dadi', 'deck-building', 'due giocatori', 'peste'];

/**
 * La sezione di `/profilo` dedicata a `CountedChips`.
 *
 * ⚠️ Sta in un file suo perché la pagina era arrivata a trecento righe, non perché serva altrove:
 * è la stessa ragione per cui `/atmosfera` ha `GlitchSection` e `/corsa` ha `SwarmDemo`. Resta un
 * componente **server** — `CountedChips` è client, ma le pastiglie gli arrivano come figli già
 * resi, e nessuna funzione attraversa il confine.
 */
export function ChipsSection() {
  return (
    <>
      <TechRule>i chip che si contano</TechRule>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">
          <code>CountedChips</code> ne mostra poche e mette il resto dietro un <code>+N</code> che
          le apre. Serve dove le pastiglie sono tante e lo spazio è quello di una scheda: i tag di
          un manuale, gli autori, chi l’ha inserito.
        </p>

        <p className="text-sm text-muted">
          Le tre strisce verdi qui sotto <strong>sforano il limite</strong>, l’ultima no — e il
          colore è una scelta di questa demo, non qualcosa che il componente fa: lui conta e
          nasconde, il colore delle pastiglie resta di chi le passa.
        </p>

        <div className="flex flex-col gap-4 rounded-xl border border-border p-6">
          {[3, 1, 0].map((visible) => (
            <div key={visible} className="flex flex-col gap-2">
              {/* ⚠️ Il colore marca le strisce che **sforano**, e va detto: è una scelta di questa
                  demo, non una cosa che il componente fa. L'etichetta qui sotto lo dichiara. */}
              <CountedChips visible={visible}>
                {TAG.map((tag) => (
                  <ThematicBadge key={tag} color="accent">
                    {tag}
                  </ThematicBadge>
                ))}
              </CountedChips>
              <TechLabel className="text-muted">
                visible={`{${visible}}`} · {TAG.length} voci · sopra il limite
              </TechLabel>
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <CountedChips>
              {TAG.slice(0, 2).map((tag) => (
                <ThematicBadge key={tag}>{tag}</ThematicBadge>
              ))}
            </CountedChips>
            <TechLabel className="text-muted">sotto il limite · nessun comando</TechLabel>
          </div>
        </div>

        <p className="text-sm text-muted">
          <strong>Non disegna le pastiglie: gliele si passa.</strong> Il colore di un tag è
          dell’applicazione — di là è una tabella <code>tagColors</code> — e farglielo arrivare
          vorrebbe dire o una funzione che disegna, che da una pagina server non attraversa il
          confine, o inventare uno schema di dati per una cosa che JSX dice già. Qui si conta e si
          nasconde, e basta.
        </p>

        <p className="text-sm text-muted">
          ⚠️ <strong>Quello che non si vede non è nella pagina.</strong> Le pastiglie chiuse non
          esistono nel DOM, invece di essere nascoste con una classe: altrimenti le troverebbero lo
          stesso la ricerca del browser, la selezione e chi copia.
        </p>

        <p className="text-sm text-muted">
          ⚠️ <strong>Il nome del comando non cambia aprendo</strong> — resta «Mostra tutti (+2)», e
          a dire lo stato è <code>aria-expanded</code>. Il conto entra nel nome perché chi comanda
          il browser a voce legge <code>+2</code> e lo pronuncia: se il nome non contenesse quel
          testo, quel comando non si potrebbe dire. La parola è una prop.
        </p>
      </div>
    </>
  );
}
