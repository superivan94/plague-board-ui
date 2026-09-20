import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GlitchText } from '../src';

const lamelle = (container: HTMLElement) => container.querySelectorAll('.pb-glitch-slice');
const lampo = (container: HTMLElement) => container.querySelector('.pb-glitch-reveal');
const radice = (container: HTMLElement) => container.firstElementChild as HTMLElement;

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
