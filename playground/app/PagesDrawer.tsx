'use client';

import { Button, Drawer } from '@heroui/react';
import { TechLabel, TechRule } from 'plague-board-ui';
import { useState } from 'react';

import { FamilyEntry } from './FamilyEntry';
import { PLAYGROUND_FAMILIES, PLAYGROUND_PAGES, isCurrentPage, type PlaygroundFamily } from './pages';

/** Le sezioni del cassetto, nell'ordine della barra piena: le tre famiglie, il catalogo, la filosofia. */
const SECTIONS: readonly { key: PlaygroundFamily; title: string; blurb?: string }[] = [
  ...PLAYGROUND_FAMILIES,
  { key: 'catalogo', title: 'Il catalogo' },
  { key: 'filosofia', title: 'La filosofia' },
];

/**
 * Tutte le pagine in un cassetto che si apre da sinistra: la barra quando la finestra è stretta.
 *
 * ⚠️ **È il `Drawer` di HeroUI, e non una finestra scritta qui**: è il modo in cui la sua
 * documentazione fa la navigazione, e porta già quello che una finestra modale deve fare — il fuoco
 * intrappolato dentro, Esc che chiude, il fondo che non scorre, il ritorno del fuoco al comando.
 *
 * ⚠️ **Il comando dice dove si è**, non solo «menù»: su un telefono è l'unica voce della barra, e il
 * nome della pagina corrente è quello che la barra piena mostrerebbe acceso.
 */
export function PagesDrawer({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const current = PLAYGROUND_PAGES.find((page) => isCurrentPage(page, pathname));

  return (
    <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button size="sm" variant="secondary">
        <TechLabel className="text-muted">pagine</TechLabel>
        {current ? <span className="text-brand-ink">{current.title}</span> : null}
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Le pagine</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav aria-label="Le pagine del playground" className="flex flex-col gap-5">
                {SECTIONS.map((section) => (
                  <section key={section.key} className="flex flex-col gap-1">
                    <TechRule>{section.title}</TechRule>
                    {section.blurb ? <p className="px-3 pb-1 text-xs text-muted">{section.blurb}</p> : null}
                    {PLAYGROUND_PAGES.filter((page) => page.family === section.key).map((page) => (
                      <FamilyEntry
                        key={page.href}
                        page={page}
                        isCurrent={isCurrentPage(page, pathname)}
                        onGo={() => setIsOpen(false)}
                      />
                    ))}
                  </section>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
