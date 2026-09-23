import type * as Library from 'plague-board-ui';
import { createElement, type ComponentType, type ReactNode } from 'react';

/**
 * Le storie del playground: un componente, a che cosa serve, e le sue varianti.
 *
 * ⚠️ **La forma è quella di Storybook apposta** — `component`, `args`, `decorators` — così il
 * giorno che si passerà a lui ogni variante diventa un export coi suoi `args` e non si riscrive
 * niente. Qui non c'è Storybook perché il playground è già un'applicazione Next che consuma il
 * pacchetto **costruito**, cioè vede quello che vedrà Rattoteca; Storybook ne sarebbe una seconda.
 *
 * ⚠️ **Un file di storie non importa ganci di React.** Lo legge anche il catalogo, che è una
 * pagina server, per sapere nomi, descrizioni e varianti — e un modulo server che importa
 * `useState` rompe `next build`. Una variante che ha bisogno di stato, di un riferimento o di un
 * gancio della libreria monta un pezzo di `stories/demos/`, che dichiara `'use client'` e che il
 * server vede come un riferimento. Le funzioni negli `args`, invece, vanno bene: le varianti si
 * rendono nel client, dentro la cornice, e lì una funzione non attraversa nessun confine.
 */

/**
 * Avvolge una variante in quello che le serve per esistere — un provider, un fondo, una colonna
 * stretta. È il `decorator` di Storybook, con la variante già resa al posto del componente.
 */
export type StoryDecorator = (variant: ReactNode) => ReactNode;

/** Una configurazione fissa di prop, con un nome da leggere sopra la cornice. */
export interface StoryVariant<P> {
  /** Che cosa mostra, in poche parole: «senza collegamento», «in attesa». */
  readonly name: string;
  readonly args: P;
  /**
   * Che cosa guardare, quando la differenza con le altre varianti **non si vede da ferma**: un
   * nome che si annuncia, un tasto da premere. È la descrizione di una storia sola in Storybook.
   *
   * ⚠️ Una variante che a schermo è identica a un'altra e non lo dice è peggio di nessuna
   * variante: chi guarda cerca una differenza che non c'è, o crede che la prop non funzioni.
   */
  readonly note?: string;
  /**
   * Quello che vale per questa variante sola — un livello tossico diverso, un antenato che accende
   * l'animazione. Sta **dentro** i decoratori della storia, come in Storybook, dove ogni variante
   * è un export coi suoi.
   */
  readonly decorators?: readonly StoryDecorator[];
}

export interface StorySpec<P> {
  /** A che cosa serve, in una frase. È la riga sotto il nome, nel catalogo e nella pagina. */
  readonly description: string;
  readonly variants: readonly StoryVariant<P>[];
  /** Dal più esterno al più interno, come in Storybook. */
  readonly decorators?: readonly StoryDecorator[];
  /**
   * `padded`, il predefinito, lascia un margine attorno alla variante; `fullscreen` la mette a filo
   * della cornice, per chi occupa la finestra — una barra, un fondale, una schermata.
   */
  readonly layout?: 'padded' | 'fullscreen';
  /**
   * L'altezza della cornice in pixel, per chi **non ne ha una sua**. ⚠️ Serve a quello che vive in
   * `position: fixed` — un ratto che attraversa, uno sciame —, che non occupa spazio nella pagina:
   * senza, la cornice si stringerebbe a zero e il ratto correrebbe dentro una riga invisibile.
   * ⚠️ **Dichiararla vuol dire «vivo nella finestra»**, e allora della finestra si vede tutto: a 768
   * e a pieno la finestra non scende sotto i 480, e quello che sta attaccato al fondo — una
   * navigazione, una notifica — se ne tagliasse una parte non si vedrebbe.
   */
  readonly frameHeight?: number;
}

export interface Story<P> extends StorySpec<P> {
  readonly component: ComponentType<P>;
  /**
   * La variante resa, già avvolta nei suoi `decorators`.
   *
   * ⚠️ **Sta qui e non nella cornice perché è l'unico posto in cui il tipo delle prop è noto.**
   * L'indice tiene cinquantatré storie con cinquantatré tipi diversi, e chi le prende per nome ne
   * riceve l'unione: `<story.component {...variant.args} />` scritto fuori non compilerebbe senza
   * un cast. Chiuso dentro `defineStory`, il legame fra componente e prop resta verificato.
   */
  readonly renderVariant: (index: number) => ReactNode;
}

/** Costruisce una storia. È l'unica via, perché è l'unica che scrive `renderVariant`. */
export function defineStory<P extends object>(component: ComponentType<P>, spec: StorySpec<NoInfer<P>>): Story<P> {
  return {
    component,
    ...spec,
    renderVariant: (index) => {
      const variant = spec.variants[index];
      if (!variant) return null;
      const decorators = [...(spec.decorators ?? []), ...(variant.decorators ?? [])];
      return decorators.reduceRight<ReactNode>(
        (inner, decorate) => decorate(inner),
        createElement(component, variant.args),
      );
    },
  };
}

type LibraryExports = typeof Library;

/**
 * I componenti della libreria, ricavati dal **tipo** del pacchetto costruito.
 *
 * La regola è quella dei nomi: l'iniziale maiuscola, e non tutto maiuscolo — `RatIcon` sì,
 * `RAT_LIVERIES` e `useMusic` no. ⚠️ Non è una seconda definizione messa a caso accanto a quella
 * del guard della superficie, che guarda il **nome del file**: le due oggi coincidono sui
 * cinquantatré, e quel guard lega già ogni file maiuscolo all'export col suo nome.
 */
export type ComponentName = {
  [K in keyof LibraryExports]: K extends string
    ? K extends Capitalize<K>
      ? K extends Uppercase<K>
        ? never
        : K
      : never
    : never;
}[keyof LibraryExports];

/** Le prop di un componente; `{}` per chi non ne prende, come `ToxicBubbles`. */
type PropsOf<C> = C extends (props: infer P) => ReactNode
  ? unknown extends P
    ? Record<never, never>
    : P
  : never;

/**
 * La forma dell'indice: **una storia per ogni componente**, e nient'altro.
 *
 * ⚠️ **È questo il guard.** `STORIES` la dichiara con `satisfies`, quindi un componente nuovo senza
 * storia è un errore di `tsc` che lo nomina — «Property 'DripIcon' is missing» — e una storia per
 * un componente che non c'è più è una proprietà di troppo. Non c'è un elenco da tenere in pari a
 * mano: si accorcia e si allunga col pacchetto.
 */
export type StoryIndex = { readonly [K in ComponentName]: Story<PropsOf<LibraryExports[K]>> };
