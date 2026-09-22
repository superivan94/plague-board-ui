import { Fragment, type ReactNode } from 'react';

/**
 * Una descrizione di storia, coi nomi di codice fra apici inversi resi come `<code>`.
 *
 * ⚠️ Le descrizioni restano **stringhe** apposta: sono un dato della storia, e il giorno che si
 * passerà a Storybook diventano la sua descrizione del componente così come sono.
 */
export function withInlineCode(text: string): ReactNode {
  return text
    .split('`')
    .map((piece, index) => (index % 2 === 1 ? <code key={index}>{piece}</code> : <Fragment key={index}>{piece}</Fragment>));
}
