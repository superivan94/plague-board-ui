'use client';

import { Disclosure, EmptyState, ScrollShadow, SearchField } from '@heroui/react';
import { TechLabel } from 'plague-board-ui';
import { useMemo, useState } from 'react';

export interface PhraseGroup {
  /** Il nome con cui l'elenco è esportato dalla libreria. */
  readonly name: string;
  readonly phrases: readonly string[];
}

/**
 * ⚠️ **Confronto senza accenti**: `NFD` separa la lettera dal suo segno, e la classe di caratteri
 * toglie i segni. Serve perché le frasi gli accenti ce li hanno davvero — «È solo l'inizio...» —
 * e chi cerca scrive «e solo». Gli emoji restano interi: `NFD` non li tocca.
 */
const piatto = (testo: string) =>
  testo
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

interface Esito extends PhraseGroup {
  /** Le frasi che passano il filtro, **con il posto che occupano nell'array originale**. */
  readonly matches: readonly { readonly index: number; readonly phrase: string }[];
}

/**
 * L'elenco delle frasi, consultabile. Sta chiuso finché non serve, perché 33 righe in fondo a una
 * pagina di demo sono rumore; aperto, è lo strumento per cercare una parola e vedere in un colpo
 * chi la ripete.
 *
 * ⚠️ **Non c'è nessun segnalatore automatico di doppioni, ed è una scelta misurata.** Cercandoli a
 * macchina — stessa forma a meno di punteggiatura, oppure metà delle parole in comune — sulle 33
 * frasi escono **zero** doppioni veri e **otto** falsi allarmi, e sei sono le varianti di «Squit!»,
 * che sono volute. Un avviso che grida al lupo sulle cose giuste è peggio di nessun avviso: si
 * impara a ignorarlo. La ricerca fa il lavoro vero — si scrive «squit» e le quattro varianti stanno
 * una sotto l'altra.
 *
 * ⚠️ **Il numero accanto a ogni frase è il suo posto nell'array**, non la riga del risultato: è
 * quello che serve quando si va a modificare `phrases.ts`, e non cambia quando si filtra.
 */
export function PhraseBrowser({ groups }: { groups: readonly PhraseGroup[] }) {
  const [query, setQuery] = useState('');

  const esiti = useMemo<readonly Esito[]>(() => {
    const ago = piatto(query.trim());
    return groups.map((group) => ({
      ...group,
      matches: group.phrases
        .map((phrase, index) => ({ index, phrase }))
        .filter(({ phrase }) => ago === '' || piatto(phrase).includes(ago)),
    }));
  }, [groups, query]);

  const totale = groups.reduce((somma, g) => somma + g.phrases.length, 0);
  const trovate = esiti.reduce((somma, e) => somma + e.matches.length, 0);

  return (
    <Disclosure className="rounded-lg border border-border">
      {/* ⚠️ `level={2}`: il `Heading` di react-aria vale `h3` se non gli si dice altro, e su questa
          pagina sotto un `h1` sarebbe un salto di livello — misurato leggendo la scaletta dei
          titoli. Così i due nomi degli elenchi qui dentro restano `h3`, cioè figli di questo. */}
      <Disclosure.Heading level={2}>
        <Disclosure.Trigger className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm">
          {/* ⚠️ Lo spazio fra i due è un **nodo di testo**, non la `gap` della flex: la spaziatura
              in CSS non entra nel testo, e il nome accessibile del comando veniva «…tutte
              quante33 in 2 elenchi», attaccato. Letto nell'albero di accessibilità, non immaginato. */}
          <span className="font-medium">Le frasi, tutte quante</span>{' '}
          <TechLabel className="text-muted">
            · {totale} in {groups.length} elenchi
          </TechLabel>
          <Disclosure.Indicator className="ml-auto" />
        </Disclosure.Trigger>
      </Disclosure.Heading>

      <Disclosure.Content>
        <Disclosure.Body className="flex flex-col gap-3 border-t border-border p-4">
          <SearchField
            value={query}
            onChange={setQuery}
            aria-label="Cerca fra le frasi"
            className="w-full"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="una parola, per vedere chi la ripete" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          {/* ⚠️ Una regione viva, e nasce **prima** del filtro: chi non vede lo schermo scrive e
              deve sentire quante frasi restano, altrimenti il campo non dà nessuna risposta. */}
          <p role="status" className="text-xs text-muted">
            {query.trim() === ''
              ? `${totale} frasi, numerate come nell'array. Esc svuota il campo.`
              : `${trovate} su ${totale}`}
          </p>

          {trovate === 0 ? (
            <EmptyState className="text-sm text-muted">
              Nessuna frase contiene «{query.trim()}».
            </EmptyState>
          ) : (
            // Il tetto d'altezza è quello che tiene la pagina governabile con l'elenco aperto; le
            // ombre ai bordi le mette `ScrollShadow`, e sono l'unica cosa che dice che c'è altro.
            <ScrollShadow className="max-h-80">
              <div className="flex flex-col gap-4">
                {esiti.map(({ name, phrases, matches }) => (
                  <section key={name} className="flex flex-col gap-1">
                    <h3 className="flex items-baseline gap-2">
                      <TechLabel className="text-brand-ink">{name}</TechLabel>{' '}
                      <TechLabel className="text-muted">
                        {matches.length === phrases.length
                          ? `${phrases.length} frasi`
                          : `${matches.length} su ${phrases.length}`}
                      </TechLabel>
                    </h3>

                    {matches.length === 0 ? (
                      <p className="text-xs text-muted">niente qui dentro</p>
                    ) : (
                      <ol className="flex flex-col">
                        {matches.map(({ index, phrase }) => (
                          <li key={phrase} className="flex gap-3 py-0.5 text-sm">
                            {/* Stesso motivo dello spazio nel titolo: senza il nodo di testo, chi
                                ascolta sente «0Squit!» invece di «0 Squit!». */}
                            <span className="w-6 shrink-0 text-right font-mono text-xs text-muted">
                              {index}
                            </span>{' '}
                            <span className="font-mono text-xs">{phrase}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </section>
                ))}
              </div>
            </ScrollShadow>
          )}
        </Disclosure.Body>
      </Disclosure.Content>
    </Disclosure>
  );
}
