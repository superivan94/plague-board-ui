import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GlitchText } from '../src';

const lamelle = (container: HTMLElement) => container.querySelectorAll('.pb-glitch-slice');
const lampo = (container: HTMLElement) => container.querySelector('.pb-glitch-reveal');
const nome = (container: HTMLElement) => container.querySelector('.pb-glitch-name');
const radice = (container: HTMLElement) => container.firstElementChild as HTMLElement;

/** Il foglio delle animazioni, senza commenti: i tempi dei fotogrammi stanno solo lì. */
const ANIMATIONS = readFileSync(join(process.cwd(), 'styles', 'animations.css'), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

/** Le opacità di un blocco `@keyframes`, soglia per soglia: `'80%' → '1'`. */
function keyframeOpacities(name: string): Map<string, string> {
  const header = ANIMATIONS.indexOf(`@keyframes ${name} {`);
  if (header < 0) throw new Error(`In animations.css non c'è @keyframes ${name}`);
  const open = ANIMATIONS.indexOf('{', header);
  let depth = 0;
  let close = open;
  for (let i = open; i < ANIMATIONS.length; i++) {
    if (ANIMATIONS[i] === '{') depth++;
    if (ANIMATIONS[i] === '}' && --depth === 0) {
      close = i;
      break;
    }
  }
  const opacities = new Map<string, string>();
  for (const [, selectors, declarations] of ANIMATIONS.slice(open + 1, close).matchAll(/([\d.%,\s]+)\{([^}]*)\}/g)) {
    const opacity = /opacity:\s*([\d.]+)/.exec(declarations)?.[1];
    if (opacity === undefined) continue;
    for (const selector of selectors.split(',')) opacities.set(selector.trim(), opacity);
  }
  return opacities;
}

describe('GlitchText', () => {
  it('si annuncia una volta sola, per quante copie ne disegni', () => {
    render(
      <h1>
        LUDORATTI <GlitchText>E.</GlitchText> CORP
      </h1>,
    );

    // ⚠️ È il motivo per cui le copie sono `<span aria-hidden>` e non due pseudo-elementi con
    // `content: attr(data-text)`: il contenuto generato alcuni lettori di schermo lo leggono, e
    // il nome del titolo diventerebbe «LUDORATTI E.E.E. CORP».
    expect(screen.getByRole('heading', { name: 'LUDORATTI E. CORP' })).toBeInTheDocument();
  });

  it('disegna due lamelle, decorative e con lo stesso testo sotto', () => {
    const { container } = render(<GlitchText>E.</GlitchText>);

    const copie = lamelle(container);

    expect(copie).toHaveLength(2);
    copie.forEach((copia) => {
      expect(copia).toHaveAttribute('aria-hidden', 'true');
      expect(copia).toHaveClass('animate-glitch');
      expect(copia).toHaveTextContent('E.');
    });
  });

  it('non lampeggia niente, se non gli si dà niente da rivelare', () => {
    const { container } = render(<GlitchText>E.</GlitchText>);

    expect(lampo(container)).toBeNull();
  });

  it('col lampo spento resta il nome che si disturba, e basta', () => {
    const { container } = render(
      <GlitchText reveal="EVIL" isRevealEnabled={false}>
        E.
      </GlitchText>,
    );

    // ⚠️ Spento vuol dire **non reso**, non «reso e invisibile»: un elemento fermo a opacità zero
    // sarebbe una copia di testo che nessuno vede e che tutto il resto continua a trovare.
    expect(lampo(container)).toBeNull();
    expect(container).not.toHaveTextContent('EVIL');
    expect(lamelle(container)).toHaveLength(2);
  });

  it('il lampo è acceso senza doverlo chiedere', () => {
    const { container } = render(<GlitchText reveal="EVIL">E.</GlitchText>);

    expect(lampo(container)).not.toBeNull();
  });

  it("l'interruttore acceso non inventa un lampo senza parola", () => {
    const { container } = render(<GlitchText isRevealEnabled>E.</GlitchText>);

    expect(lampo(container)).toBeNull();
  });

  it('la parola nascosta lampeggia, ed è decorativa', () => {
    const { container } = render(<GlitchText reveal="EVIL">E.</GlitchText>);

    expect(lampo(container)).toHaveTextContent('EVIL');
    expect(lampo(container)).toHaveClass('animate-reveal');
    expect(lampo(container)).toHaveAttribute('aria-hidden', 'true');
  });

  it('la parola nascosta porta le stesse due lamelle del nome', () => {
    const { container } = render(<GlitchText reveal="EVIL">E.</GlitchText>);

    // ⚠️ Sono **dentro** il lampo, non accanto: così ne ereditano l'opacità e il ritaglio, e si
    // vedono solo quando si vede lui. Fuori girerebbero sopra il nome tutto il tempo.
    const sue = lampo(container)!.querySelectorAll('.pb-glitch-slice');

    expect(sue).toHaveLength(2);
    sue.forEach((copia) => expect(copia).toHaveTextContent('EVIL'));
    expect(lamelle(container)).toHaveLength(4);
  });

  it('mentre la parola nascosta è accesa il nome si spegne, con le sue lamelle e senza la parola', () => {
    const { container } = render(<GlitchText reveal="EVIL">E.</GlitchText>);

    // ⚠️ È ciò che tiene il nome fuori da sotto la parola **senza una lastra**: la lastra doveva
    // sapere il colore del fondo, e sul chiaro un fondo scuro dichiarato era un rettangolo nero
    // (utente, 2026-09-23). Le lamelle del nome si spengono con lui o girerebbero sopra la parola;
    // la parola sta fuori, o si spegnerebbe insieme a ciò che deve sostituire.
    const pezzo = nome(container)!;

    expect(pezzo).toHaveClass('pb-glitch-name--with-reveal');
    expect(pezzo.querySelectorAll('.pb-glitch-slice')).toHaveLength(2);
    expect(pezzo).not.toContainElement(lampo(container) as HTMLElement);
  });

  it('senza una parola da mostrare il nome non si spegne mai', () => {
    const senza = render(<GlitchText>E.</GlitchText>);
    const spenta = render(
      <GlitchText reveal="EVIL" isRevealEnabled={false}>
        E.
      </GlitchText>,
    );

    expect(nome(senza.container)).not.toHaveClass('pb-glitch-name--with-reveal');
    expect(nome(spenta.container)).not.toHaveClass('pb-glitch-name--with-reveal');
  });

  it('il nome si spegne esattamente quando la parola si accende, fotogramma per fotogramma', () => {
    const parola = keyframeOpacities('pb-reveal');
    const atteso = new Map([...parola].map(([soglia, opacita]) => [soglia, String(1 - Number(opacita))]));

    // ⚠️ Sono due `@keyframes` perché i due pezzi sono fratelli, e un'animazione non passa da un
    // fratello all'altro: chi ritocca i tempi della parola — è successo due volte in un giorno —
    // deve ritoccare anche questi, e questo caso glielo dice.
    expect(parola.size).toBeGreaterThan(5);
    expect(keyframeOpacities('pb-conceal')).toEqual(atteso);
  });

  it('con «meno movimento» il nome resta acceso', () => {
    const fermate = /@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\{\s*animation: none !important/.exec(
      ANIMATIONS,
    )?.[1];

    // ⚠️ La parola nasce a opacità zero e con l'animazione spenta non compare; il nome, se la sua
    // animazione restasse accesa, sparirebbe ogni tre secondi per niente. La regola generica non
    // lo prende: `[class*='animate-']` vale per le utility, e questa è una classe nostra.
    expect(fermate).toContain('.pb-glitch-name--with-reveal');
  });

  it('la parola nascosta resta fuori dal nome accessibile', () => {
    render(
      <h1>
        <GlitchText reveal="EVIL">E.</GlitchText>
      </h1>,
    );

    // ⚠️ Un lampo di due decimi di secondo che nel nome del titolo resta **sempre** non è un
    // easter egg: è una parola in più che chi non vede la pagina si porta dietro per intero.
    expect(screen.getByRole('heading', { name: 'E.' })).toBeInTheDocument();
  });

  it('il colore di ciò che sta dietro arriva alla variabile, non addosso alle lamelle', () => {
    const { container } = render(<GlitchText background="#030712">E.</GlitchText>);

    // Sta sulla radice perché le due lamelle la ereditano: scritta su ognuna sarebbe la stessa
    // cosa detta due volte, e il giorno che le lamelle diventano tre lo diventerebbe tre.
    expect(radice(container).style.getPropertyValue('--pb-glitch-bg')).toBe('#030712');
  });

  it('senza un colore dietro le lamelle sono trasparenti, non nere', () => {
    const { container } = render(<GlitchText>E.</GlitchText>);

    // ⚠️ Il valore predefinito è quello che **non può rompersi**: una lamella opaca del colore
    // sbagliato dipinge un rettangolo in mezzo al testo, una trasparente al massimo attenua
    // l'effetto. Chi sa che cosa ha dietro lo passa.
    expect(radice(container).style.getPropertyValue('--pb-glitch-bg')).toBe('transparent');
  });

  it('la classe del lampo sostituisce quella predefinita invece di aggiungersi', () => {
    const { container } = render(
      <GlitchText reveal="EVIL" revealClassName="text-plague-400">
        E.
      </GlitchText>,
    );

    // ⚠️ Sostituisce, e non è pigrizia: due classi di colore nella stessa `class` vengono
    // decise dall'**ordine nel CSS generato**, non da quello in cui sono scritte. Aggiungendo,
    // chi passa la sua non saprebbe se vince.
    expect(lampo(container)).toHaveClass('text-plague-400');
    expect(lampo(container)).not.toHaveClass('text-red-500');
  });
});
