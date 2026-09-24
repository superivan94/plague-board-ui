import { Card } from '@heroui/react';
import {
  BiohazardIcon,
  CountedChips,
  PlagueAvatar,
  PlaguePanel,
  PoisonIcon,
  ProfileMenu,
  RAT_MASCOT_SRC,
  SparklesIcon,
  ThematicBadge,
  VirusIcon,
} from 'plague-board-ui';

import { defineStory } from './types';

export const plagueAvatarStory = defineStory(PlagueAvatar, {
  description:
    'Il ritratto con l’anello e il segno del contagio, sopra `Avatar` e `Badge` di HeroUI. Senza immagine mostra un teschio.',
  variants: [
    { name: 'con immagine, grande', args: { src: RAT_MASCOT_SRC, name: 'Ratto Zero', size: 'lg' } },
    { name: 'che pulsa', args: { src: RAT_MASCOT_SRC, name: 'Ratto Zero', size: 'lg', isPulsing: true } },
    { name: 'piccolo', args: { src: RAT_MASCOT_SRC, name: 'Ratto Zero', size: 'sm' } },
    { name: 'senza immagine', args: { size: 'lg' } },
    { name: 'con le iniziali', args: { size: 'lg', fallback: <span className="text-sm font-semibold">RZ</span> } },
    { name: 'con un altro segno', args: { src: RAT_MASCOT_SRC, name: 'Ratto Zero', size: 'lg', badge: <SparklesIcon size={10} /> } },
    { name: 'senza segno', args: { src: RAT_MASCOT_SRC, name: 'Ratto Zero', size: 'lg', badge: null } },
  ],
});

export const thematicBadgeStory = defineStory(ThematicBadge, {
  description:
    'La pastiglia del grado, sopra `Chip` di HeroUI nella variante che tinge anche il fondo. I nomi dei gradi sono dell’applicazione.',
  variants: [
    { name: 'neutra', args: { children: 'Portatore sano' } },
    { name: 'accento, con un segno', args: { children: 'Paziente zero', color: 'accent', icon: <VirusIcon size={12} /> } },
    { name: 'successo', args: { children: 'Immune', color: 'success' } },
    { name: 'attenzione', args: { children: 'Contagio alto', color: 'warning', icon: <BiohazardIcon size={12} /> } },
    { name: 'pericolo', args: { children: 'In quarantena', color: 'danger' } },
  ],
});

export const plaguePanelStory = defineStory(PlaguePanel, {
  description:
    'La superficie della scheda del profilo, sopra `Card` di HeroUI: il bordo e il velo del marchio. Dentro si compone con i pezzi di `Card`.',
  variants: [
    {
      name: 'una scheda',
      args: {
        className: 'max-w-md',
        children: (
          <>
            <Card.Header className="flex-row items-center gap-4">
              <PlagueAvatar src={RAT_MASCOT_SRC} name="Ratto Zero" size="lg" />
              <div className="flex min-w-0 flex-col">
                <Card.Title className="flex items-center gap-2">
                  <PoisonIcon size={16} className="shrink-0 text-brand-ink" />
                  Ratto Zero
                </Card.Title>
                <Card.Description>ratto.zero@ludoratti.it</Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="text-sm text-muted">Membro della rete dal primo contagio.</Card.Content>
          </>
        ),
      },
    },
  ],
});

const TAGS = ['cooperativo', 'medioevo', 'dadi', 'deck-building', 'due giocatori', 'peste'];

export const countedChipsStory = defineStory(CountedChips, {
  description:
    'Una riga di pastiglie che ne mostra poche e mette il resto dietro un `+N`. Le pastiglie le passa l’applicazione: lui conta e nasconde.',
  variants: [
    {
      name: 'sopra il limite',
      args: { children: TAGS.map((tag) => <ThematicBadge key={tag} color="accent">{tag}</ThematicBadge>) },
    },
    {
      name: 'ne mostra una sola',
      args: { visible: 1, children: TAGS.map((tag) => <ThematicBadge key={tag} color="accent">{tag}</ThematicBadge>) },
    },
    {
      name: 'sotto il limite',
      args: { children: TAGS.slice(0, 2).map((tag) => <ThematicBadge key={tag}>{tag}</ThematicBadge>) },
    },
  ],
});

/** Nella storia il menù non porta da nessuna parte: le voci si scelgono e basta. */
const nowhere = () => {};

export const profileMenuStory = defineStory(ProfileMenu, {
  description:
    'Il comando del profilo nell’intestazione: il ritratto col nome e il grado, e un menù con chi è entrato, le voci dell’applicazione e l’uscita.',
  frameHeight: 320,
  variants: [
    {
      name: 'col grado e le voci',
      note: 'Sul telefono resta il ritratto: il nome si vede da `sm` in su.',
      args: {
        name: 'Superivan94',
        email: 'superivan94@ludoratti.it',
        avatarSrc: RAT_MASCOT_SRC,
        rank: { label: 'Signore Dabbonico', color: 'warning' },
        items: [
          { key: 'profile', label: 'La tua cartella clinica' },
          { key: 'settings', label: 'Parametri del Grande Piano' },
        ],
        onAction: nowhere,
        onSignOut: nowhere,
      },
    },
    {
      name: 'senza ritratto né grado',
      args: { name: 'Ratto Zero', onSignOut: nowhere, signOutLabel: 'Esci' },
    },
  ],
  decorators: [(variant) => <div className="flex justify-end">{variant}</div>],
});
