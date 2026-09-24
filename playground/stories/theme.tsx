import { ThemeSwitch } from 'plague-board-ui';

import { WithThemeChoice } from './demos/WithThemeChoice';
import { defineStory } from './types';

export const themeSwitchStory = defineStory(ThemeSwitch, {
  description:
    'Il commutatore del tema: chiaro, scuro, o quello del sistema. È controllato — `value` e `onChange` —, e a salvare la scelta da una visita all’altra è il gancio accanto: `useThemePreference`, con la chiave dell’applicazione, oppure `next-themes`. `themeBootScript` con la stessa chiave la applica prima del primo disegno. La barra in cima a questa pagina è montata così.',
  variants: [
    {
      name: 'con un riquadro che segue la scelta',
      note: '«Del sistema» lascia il riquadro col tema della cornice, che qui fa da sistema.',
      args: { value: 'system', onChange: () => {} },
      decorators: [(variant) => <WithThemeChoice>{variant}</WithThemeChoice>],
    },
    {
      name: 'le parole dell’applicazione',
      note: 'I nomi si sentono e non si vedono: passa il puntatore o ascolta col lettore di schermo.',
      args: {
        value: 'dark',
        onChange: () => {},
        label: 'Aspetto',
        labels: { light: 'Giorno', dark: 'Notte', system: 'Automatico' },
      },
    },
  ],
});
