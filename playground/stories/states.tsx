import { Button, toast } from '@heroui/react';
import {
  PlagueAlert,
  PlagueConfirmDialog,
  PlagueDialog,
  PlagueEmptyState,
  PlagueLoader,
  PlagueToastRegion,
  SkullIcon,
} from 'plague-board-ui';

import { OpenWithButton } from './demos/OpenWithButton';
import { defineStory, type StoryDecorator } from './types';

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

export const plagueEmptyStateStory = defineStory(PlagueEmptyState, {
  description:
    'Il vuoto: la mascotte con l’ampolla, il titolo, una riga e il comando che lo riempie. Il livello del titolo lo sceglie chi lo monta, perché dipende dalla pagina.',
  variants: [
    { name: 'le parole di casa', args: {} },
    {
      name: 'con la spiegazione e il comando',
      args: {
        title: 'Nessun manuale',
        description: 'Crea il primo, o importalo da Notion.',
        action: <Button>Nuovo manuale</Button>,
      },
    },
    {
      name: 'un altro disegno',
      args: {
        title: 'Nessun prestito attivo',
        description: 'Quando un gioco esce dalla tana, compare qui.',
        illustration: <SkullIcon size={56} className="text-plague-ink" />,
      },
    },
    { name: 'senza disegno', args: { title: 'Nessun risultato per «pandemia»', illustration: null } },
  ],
});

/** Chi apre e chiude è `OpenWithButton`: qui gli si dà il posto e le parole del comando. */
function openedBy(label: string): StoryDecorator {
  return function withOpenButton(variant) {
    return <OpenWithButton label={label}>{variant}</OpenWithButton>;
  };
}

/** Nella storia il dialogo lo governa `OpenWithButton`, che sostituisce questi due. */
const closed = { isOpen: false, onOpenChange: () => {} };
const unanswered = { isOpen: false, onConfirm: () => {}, onCancel: () => {} };

export const plagueDialogStory = defineStory(PlagueDialog, {
  description:
    'Il dialogo, sulla superficie della peste: lo stesso bordo e la stessa sfumatura del pannello. Per chiedere una conferma prima di distruggere c’è `PlagueConfirmDialog`.',
  frameHeight: 420,
  variants: [
    {
      name: 'col piede',
      args: {
        ...closed,
        title: 'Le tue colonie',
        children: <p>Test Onlus e Default: sei amministratore di tutte e due.</p>,
        footer: <Button>Fatto</Button>,
      },
      decorators: [openedBy('Apri le colonie')],
    },
    {
      name: 'stretto, senza piede',
      args: { ...closed, size: 'sm', title: 'Parametri del Grande Piano', children: <p>Prossimamente.</p> },
      decorators: [openedBy('Apri i parametri')],
    },
  ],
});

export const plagueConfirmDialogStory = defineStory(PlagueConfirmDialog, {
  description:
    'La conferma prima di un’azione che non si disfa: un `alertdialog`, che non si chiude cliccando fuori e si annulla con Esc. In `danger` il comando dice che cosa fa in chiaro.',
  frameHeight: 380,
  variants: [
    {
      name: 'distrugge',
      args: {
        ...unanswered,
        title: 'Estingui il ceppo',
        message: 'La scheda di PARKS verrà eliminata, e non si torna indietro.',
      },
      decorators: [openedBy('Elimina PARKS')],
    },
    {
      name: 'non distrugge',
      args: {
        ...unanswered,
        tone: 'primary',
        title: 'Torna nelle fogne',
        message: 'Esci dall’account su questo dispositivo.',
        confirmLabel: 'Esci',
      },
      decorators: [openedBy('Esci')],
    },
    {
      name: 'in attesa',
      note: 'Aperto, non si chiude più: né con Esc né con «Annulla». Per rifarlo, «ricomincia».',
      args: {
        ...unanswered,
        isPending: true,
        title: 'Estingui il ceppo',
        message: 'La scheda di PARKS verrà eliminata, e non si torna indietro.',
      },
      decorators: [openedBy('Elimina PARKS')],
    },
  ],
});

export const plagueAlertStory = defineStory(PlagueAlert, {
  description:
    'L’avviso dentro la pagina, coi segni della peste. Si annuncia da sé: `status` per informare, `alert` — che interrompe — solo per avvisi ed errori.',
  variants: [
    { name: 'informa', args: { title: 'Questa scheda è in sola lettura', children: 'L’ha creata un’altra colonia.' } },
    { name: 'un accento', args: { status: 'accent', title: 'Nuovo: l’importazione da Notion' } },
    { name: 'è andata', args: { status: 'success', title: 'Sigillato', children: 'Le modifiche sono al sicuro.' } },
    { name: 'avverte', args: { status: 'warning', title: 'Tre immagini non hanno una didascalia' } },
    {
      name: 'si è rotto',
      args: { status: 'danger', title: 'Il ceppo è degenerato', children: 'Il salvataggio non è riuscito: riprova fra poco.' },
    },
  ],
});

export const plagueToastRegionStory = defineStory(PlagueToastRegion, {
  description:
    'La regione delle notifiche a comparsa, coi segni della peste. Si monta una volta, e le notifiche si mandano con `toast()` di HeroUI.',
  frameHeight: 360,
  variants: [
    {
      name: 'in basso a destra',
      note: 'Le notifiche partono dai comandi: `toast()` di HeroUI, che la libreria non riesporta.',
      args: {},
      decorators: [
        (variant) => (
          <div className="flex flex-wrap gap-2">
            {variant}
            <Button variant="secondary" onPress={() => toast.success('Sigillato', { description: 'Le modifiche sono al sicuro.' })}>
              È andata
            </Button>
            <Button variant="secondary" onPress={() => toast.warning('Tre immagini senza didascalia')}>
              Avverte
            </Button>
            <Button variant="secondary" onPress={() => toast.danger('Il ceppo è degenerato')}>
              Si è rotto
            </Button>
            <Button variant="secondary" onPress={() => toast('Importo da Notion…', { isLoading: true })}>
              Attende
            </Button>
          </div>
        ),
      ],
    },
  ],
});
