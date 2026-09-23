import { BiohazardIcon, DiceIcon, PlagueDock, PlagueDockItem, PoisonIcon, SkullIcon } from 'plague-board-ui';

import { defineStory, type StoryDecorator } from './types';

/**
 * Le quattro sezioni di RattInventario, coi segni della peste. `#` come indirizzo: nella storia
 * una voce non porta da nessuna parte.
 */
const sections = (
  <>
    <PlagueDockItem href="#" icon={<DiceIcon />} label="Catalogo" isCurrent />
    <PlagueDockItem href="#" icon={<PoisonIcon />} label="Operazioni" />
    <PlagueDockItem href="#" icon={<SkullIcon />} label="Prestiti" />
    <PlagueDockItem href="#" icon={<BiohazardIcon />} label="Inventario" />
  </>
);

export const plagueDockStory = defineStory(PlagueDock, {
  description:
    'La navigazione fissa: le sezioni principali attaccate a un lato, con lo stile della barra. Dopo 8 secondi senza un gesto su di lei si raccoglie verso il centro, e il marchio la fa ricrescere.',
  layout: 'fullscreen',
  frameHeight: 360,
  variants: [
    {
      name: 'in basso',
      note: 'Aspetta 8 secondi senza toccarla: si ritira. Col puntatore sopra o col fuoco dentro, no.',
      args: { children: sections },
    },
    { name: 'in alto', args: { placement: 'top', children: sections } },
    { name: 'a sinistra, in verticale', args: { placement: 'left', children: sections } },
    { name: 'a destra, in verticale', args: { placement: 'right', children: sections } },
    { name: 'si ritira dopo 3 secondi', args: { autoHideMs: 3000, children: sections } },
    { name: 'senza ritiro', args: { autoHideMs: 0, children: sections } },
  ],
});

/** La voce vive dentro la navigazione, che è un'isola scura in tutti e due i temi: qui la si imita. */
const inDockIsland: StoryDecorator = (variant) => (
  <div className="dark inline-flex rounded-2xl border border-brand/20 bg-gray-950/90 p-1.5 text-foreground">{variant}</div>
);

export const plagueDockItemStory = defineStory(PlagueDockItem, {
  description:
    'Una voce della navigazione fissa: un segno, una parola, e la sezione corrente nel verde del marchio. Con `href` è un collegamento, senza un bottone; `render` lo sostituisce con quello dell’applicazione.',
  variants: [
    { name: 'la sezione corrente', args: { href: '#', icon: <DiceIcon />, label: 'Catalogo', isCurrent: true } },
    { name: 'un’altra sezione', args: { href: '#', icon: <SkullIcon />, label: 'Prestiti' } },
    { name: 'un comando, senza pagina', args: { onPress: () => {}, icon: <PoisonIcon />, label: 'Scansiona' } },
  ],
  decorators: [inDockIsland],
});
