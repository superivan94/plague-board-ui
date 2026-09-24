import {
  GoogleSignInButton,
  LoginScreen,
  PlagueDivider,
  SkullIcon,
  ToxicLevelProvider,
  ToxicLevelSwitch,
  VersionTag,
} from 'plague-board-ui';

import { defineStory } from './types';

/** Nella storia non si accede a niente: il comando si preme e basta. */
const noop = () => {};

export const googleSignInButtonStory = defineStory(GoogleSignInButton, {
  description:
    'Il comando di accesso con Google, sopra il `Button` di HeroUI. L’accesso vero lo fa l’applicazione, che passa la funzione.',
  variants: [
    { name: 'a riposo', args: { onPress: noop } },
    { name: 'in attesa', args: { onPress: noop, isPending: true } },
    { name: 'le parole dell’applicazione', args: { onPress: noop, label: 'Entra nella tana con Google' } },
    { name: 'a tutta larghezza', args: { onPress: noop, fullWidth: true } },
  ],
});

export const plagueDividerStory = defineStory(PlagueDivider, {
  description: 'La riga che separa due modi di fare la stessa cosa: un filo, il segno, la parola, il segno, un filo.',
  variants: [
    { name: 'il segno di casa', args: { children: 'Alternative Access' } },
    { name: 'un altro segno', args: { children: 'oppure', icon: <SkullIcon size={16} /> } },
  ],
});

export const loginScreenStory = defineStory(LoginScreen, {
  description:
    'La schermata di accesso intera: fondale, ratti, pannello, e un angolo per un comando. I testi e l’accesso sono dell’applicazione.',
  layout: 'fullscreen',
  frameHeight: 640,
  variants: [
    {
      name: 'intera',
      args: {
        title: 'Entra nella tana',
        subtitle: 'Gestisci i manuali della diffusione',
        aside: <ToxicLevelSwitch />,
        footer: <VersionTag version="0.1.0" />,
        children: (
          <>
            <GoogleSignInButton onPress={noop} fullWidth />
            <PlagueDivider>Alternative Access</PlagueDivider>
            <p className="text-center text-xs text-muted">Qui ci va quello che l’applicazione vuole.</p>
          </>
        ),
      },
    },
    {
      name: 'senza ratti né angolo',
      args: {
        title: 'Entra nella tana',
        hasRats: false,
        children: <GoogleSignInButton onPress={noop} fullWidth />,
      },
    },
  ],
  decorators: [(variant) => <ToxicLevelProvider defaultLevel="medium">{variant}</ToxicLevelProvider>],
});
