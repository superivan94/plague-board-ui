import { notFound } from 'next/navigation';

import { STORIES, STORY_NAMES, isStoryName } from '@/stories';

import { StoryCanvas } from '../../../StoryCanvas';

const THEMES = ['light', 'dark'] as const;
type FrameTheme = (typeof THEMES)[number];

const isTheme = (value: string): value is FrameTheme => THEMES.some((theme) => theme === value);

/**
 * Il tema della cornice, scritto sulla radice **prima** che la variante si disegni.
 *
 * ⚠️ Lo script del layout ha già messo quello che il playground ricorda, e i due iframe di una
 * variante leggono lo stesso `localStorage`: senza questa riga sarebbero tutti e due dello stesso
 * tema. Sulla radice e non su un contenitore, perché quello che vola vive in un portale sul
 * `body` e il tema lo legge da lì.
 *
 * ⚠️ **E scrive anche `data-theme`, non solo la classe.** Lo script del layout li mette tutti e due,
 * e `theme.css` dichiara `.light, [data-theme='light']` sopra `.dark, [data-theme='dark']`: con la
 * classe `light` e l'attributo rimasto `dark`, a parità di specificità vince il secondo blocco.
 * Misurato il 2026-09-24 con la scelta salvata scura: la cornice chiara aveva il fondo a `6,6,7`.
 */
const themeScript = (theme: FrameTheme) =>
  `(function(d){d.classList.toggle('dark',${theme === 'dark'});d.classList.toggle('light',${theme === 'light'});d.setAttribute('data-theme','${theme}')})(document.documentElement)`;

// ⚠️ Una cornice per ogni variante di ogni storia, in tutti e due i temi, costruita al build: una
// variante che lancia rende rosso `next build` invece di aspettare che qualcuno apra la sua pagina.
export const dynamicParams = false;

export function generateStaticParams() {
  return STORY_NAMES.flatMap((name) =>
    STORIES[name].variants.flatMap((_, index) => THEMES.map((theme) => ({ name, variant: String(index), theme }))),
  );
}

/**
 * Una variante di una storia, da sola e senza la barra del playground: la pagina che il catalogo
 * mette dentro un iframe, alla larghezza di un telefono o di un tablet.
 *
 * ⚠️ **Un iframe e non un riquadro stretto**, perché le media query guardano la finestra: dentro un
 * `<div>` largo 360 px, `PlagueBar` si vestirebbe da desktop.
 */
export default async function FramePage({
  params,
}: {
  params: Promise<{ name: string; variant: string; theme: string }>;
}) {
  const { name, variant, theme } = await params;
  const index = Number(variant);
  if (!isStoryName(name) || !isTheme(theme) || STORIES[name].variants[index] === undefined) notFound();

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript(theme) }} />
      {/* ⚠️ Il distintivo di sviluppo di Next sta in basso a sinistra, e in una cornice alta cento
          pixel si posa sopra la variante — un'icona da 56 ci sparisce sotto. Qui dentro non serve:
          gli errori di una cornice arrivano comunque in console. Il nome dell'elemento è di Next,
          e se un giorno cambia il distintivo torna a vedersi, che è il modo innocuo di sbagliare. */}
      <style>{'nextjs-portal { display: none; }'}</style>
      <StoryCanvas name={name} index={index} />
    </>
  );
}
