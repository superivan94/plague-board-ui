'use client';

import { Popover } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarRow,
  PLAGUE_BAR_MARK_CLASS,
  PLAGUE_BAR_MARK_SIZE,
  PlagueBar,
  RatIcon,
  TechLabel,
  TechRule,
} from 'plague-board-ui';
import { useState } from 'react';

import { FamilyEntry } from './FamilyEntry';
import {
  PLAYGROUND_FAMILIES,
  PLAYGROUND_PAGES,
  isCurrentPage,
  type PlaygroundFamilyInfo,
  type PlaygroundPage,
} from './pages';
import { PagesDrawer } from './PagesDrawer';
import { ThemeToggle } from './ThemeToggle';

/**
 * La barra del playground.
 *
 * ⚠️ **La barra è della libreria, quello che ci sta dentro è dell'applicazione.** `PlagueBar` è la
 * lastra; il marchio, le voci e gli indirizzi li mette questo file, perché sono roba di questo
 * playground e di nessun altro. È la stessa regola per cui nella libreria non entra un header.
 *
 * ⚠️ **Le pagine stanno in tre popover e non più in fila.** A sette nomi la barra era diventata
 * una riga da leggere tutta per trovarne uno; adesso in vista ci sono tre famiglie e «La
 * direzione», e il nome preciso di quello che si cerca — `RatRun`, `HoverEmitter` — sta dentro,
 * sotto al nome di casa. ⚠️ E si aprono **alla pressione, non al passaggio del mouse**: è la
 * stessa regola di `TalkingMascot`, e il motivo è lo stesso — su un telefono «sopra» non esiste.
 */
// ⚠️ **La voce corrente porta una pastiglia, non solo una sottolineatura.** Con sette pagine in
// fila la sottolineatura bastava; con tre famiglie che si aprono, chi guarda deve capire in un
// colpo **dove si trova** fra tre nomi quasi uguali di lunghezza. Il fondo verde al 15% sulla
// lastra scura della barra è il segno che si vede prima di leggere.
const STILE_VOCE = 'rounded-full px-3 py-1 text-sm transition-colors cursor-pointer';
const STILE_CORRENTE = 'bg-brand/15 font-medium text-brand-ink';
const STILE_ALTRE = 'text-muted hover:bg-default/10 hover:text-foreground';

function NavLink({ page, isCurrent }: { page: PlaygroundPage; isCurrent: boolean }) {
  return (
    <Link
      href={page.href}
      // ⚠️ Niente `title`: il nome che uno screen reader annuncia diventerebbe la frase lunga
      // invece di «Tavolozza», e il collegamento si leggerebbe in due modi diversi.
      aria-current={isCurrent ? 'page' : undefined}
      className={`${STILE_VOCE} ${isCurrent ? STILE_CORRENTE : STILE_ALTRE}`}
    >
      {page.title}
    </Link>
  );
}

function FamilyMenu({
  family,
  pages,
  pathname,
}: {
  family: PlaygroundFamilyInfo;
  pages: readonly PlaygroundPage[];
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contieneLaCorrente = pages.some((page) => isCurrentPage(page, pathname));

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      {/* ⚠️ Il grilletto è un `<button>` vero, passato con `render`: `Popover.Trigger` di HeroUI
          usa `Pressable` di react-aria, che **clona il figlio** e pretende che sia già
          focalizzabile e con un ruolo interattivo — non aggiunge né `role` né `tabIndex`. Con il
          suo `<div>` predefinito il menù non si aprirebbe da tastiera. */}
      <Popover.Trigger<'button'>
        render={(props) => <button type="button" {...props} />}
        className={`${STILE_VOCE} ${contieneLaCorrente ? STILE_CORRENTE : STILE_ALTRE}`}
      >
        {family.title}
      </Popover.Trigger>

      <Popover.Content placement="bottom start" className="max-w-sm">
        {/* Il nome della famiglia dà il nome al dialogo: senza, chi ascolta sente «dialogo» e
            basta, e tre menù identici non si distinguono. */}
        <Popover.Dialog aria-label={family.title} className="flex flex-col gap-1 p-2">
          <p className="px-3 pt-1 pb-2 text-xs text-muted">{family.blurb}</p>
          {pages.map((page) => (
            <FamilyEntry
              key={page.href}
              page={page}
              isCurrent={isCurrentPage(page, pathname)}
              onGo={() => setIsOpen(false)}
            />
          ))}
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

export function PlaygroundNav() {
  const pathname = usePathname();
  const catalogo = PLAYGROUND_PAGES.filter((page) => page.family === 'catalogo');
  const filosofia = PLAYGROUND_PAGES.filter((page) => page.family === 'filosofia');

  return (
    <PlagueBar>
      {/* ⚠️ Niente `py` qui: l'altezza è della barra, che la porta con la sua taglia. Questo
          `<nav>` decide solo quanto è larga la colonna — che è roba della pagina, non della
          libreria.
          ⚠️ E dentro c'è `BarRow`, non una flex che va a capo: su un telefono le voci stavano su
          **tre righe** e la lastra diventava alta il triplo. Una riga sola che scorre di lato è
          la regola, e vale per la barra come per il piede. */}
      {/* ⚠️ **Due forme, e le sceglie il CSS.** Da `xl` — 1280 px di finestra — le voci stanno in
          fila in una colonna di 1152 (`max-w-6xl`); sotto, passano nel cassetto e in barra resta
          un comando solo. La soglia non è a caso: la fila piena misura **1090 px** con le voci di
          oggi, e la colonna da 1024 di prima la tagliava anche su una finestra da 1660 con seicento
          pixel liberi. Chi aggiunge una famiglia rimisura, e il segno che non ci sta più è la riga
          che scorre di lato proprio a `xl`. Scelta in CSS e non misurando in JavaScript per la
          regola della barra: il server non sa quanto è larga la finestra, e ogni caricamento su un
          telefono farebbe saltare la lastra a pagina già disegnata. */}
      <nav className="mx-auto w-full max-w-6xl px-4">
        <BarRow>
          {/* Il marchio, e batte. ⚠️ Scelto fra cinque candidati il 2026-09-17, e il motivo non è
              estetico: quel segno a prima vista è un cuore, poi due che si abbracciano, e solo per
              via delle orecchie il muso di un ratto. Un cuore che batte dice «acceso» raccontando
              la prima delle sue tre letture, invece di aggiungerne una quarta — che era il difetto
              del pallino che stava qui prima.
              ⚠️ La misura non è scritta a mano: la barra è `medium`, e chi mette il segno chiede
              alla libreria quanto farlo grande per quella taglia.
              ⚠️ E la chiede **due volte**, numero e classe: la barra sul telefono torna `small`,
              e un numero già stampato dentro `width` non risponde a una media query. Senza la
              classe il marchio resterebbe a 24 dentro una barra alta come una da 20 — che è il
              modo giusto di sbagliare, ma è comunque sbagliato. */}
          <span className="flex items-center gap-2">
            {/* ⚠️ Niente `animate-heartbeat` addosso: dal 2026-09-20 il battito lo governa il
                componente, e le due scale si **moltiplicano** — 1,12 sull'`<svg>` per 1,12 sul
                gruppo fa un picco a 1,25. Non sembra un difetto: sembra un marchio che pulsa un
                po' troppo. Qui la variante è quella predefinita, cioè esattamente quello che la
                barra faceva prima. */}
            <RatIcon
              size={PLAGUE_BAR_MARK_SIZE.medium}
              className={`shrink-0 text-brand ${PLAGUE_BAR_MARK_CLASS.medium}`}
            />
            {/* Sul telefono il nome del pacchetto cede il posto al comando delle pagine. */}
            <TechLabel className="hidden text-muted sm:inline">plague-board-ui</TechLabel>
          </span>

          <span className="hidden items-center gap-x-5 xl:flex">
            {PLAYGROUND_FAMILIES.map((family) => (
              <FamilyMenu
                key={family.key}
                family={family}
                pages={PLAYGROUND_PAGES.filter((page) => page.family === family.key)}
                pathname={pathname}
              />
            ))}

            {/* Il catalogo è una voce sola, e resta accesa anche dentro una storia. */}
            {catalogo.map((page) => (
              <NavLink key={page.href} page={page} isCurrent={isCurrentPage(page, pathname)} />
            ))}

            {filosofia.length > 0 && (
              <span className="flex items-center gap-4">
                {/* ⚠️ Il filo e il nome erano scritti qui a mano. Adesso sono `TechRule`, e non è un
                    riordino: era il segno che divide due categorie di pagine, cioè una cosa che
                    qualunque app dei Ludoratti rifarebbe uguale. Si ricompone, non si copia. */}
                <TechRule orientation="vertical">filosofia</TechRule>
                {filosofia.map((page) => (
                  <NavLink key={page.href} page={page} isCurrent={isCurrentPage(page, pathname)} />
                ))}
              </span>
            )}
          </span>

          <span className="xl:hidden">
            <PagesDrawer pathname={pathname} />
          </span>

          <span className="ml-auto">
            <ThemeToggle />
          </span>
        </BarRow>
      </nav>
    </PlagueBar>
  );
}
