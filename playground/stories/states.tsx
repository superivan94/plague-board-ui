import { Button } from '@heroui/react';
import { PlagueLoader } from 'plague-board-ui';

import { defineStory } from './types';

export const plagueLoaderStory = defineStory(PlagueLoader, {
  description:
    'L’attesa: piccola è il marchio che batte, alto quanto il testo; grande è il ratto che corre sul posto, al posto di un riquadro che si sta caricando. Si annuncia con la frase, e con «meno movimento» si ferma senza sparire.',
  variants: [
    {
      name: 'piccola, accanto a un testo',
      note: 'La frase non si vede, si annuncia: dentro un bottone o una riga il testo c’è già.',
      args: {},
      decorators: [
        (variant) => (
          <p className="flex items-center gap-2 text-sm text-brand-ink">
            {variant}
            <span className="text-foreground">Tre manuali in arrivo</span>
          </p>
        ),
      ],
    },
    {
      name: 'piccola, dentro un bottone',
      args: {},
      decorators: [
        (variant) => (
          <Button variant="secondary">
            {variant}
            Sigilla
          </Button>
        ),
      ],
    },
    { name: 'grande, al posto di un riquadro', args: { variant: 'block' } },
    { name: 'le parole dell’applicazione', args: { variant: 'block', label: 'Apertura della tana…' } },
  ],
});
