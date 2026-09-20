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

  it('la parola nascosta lampeggia, ed è decorativa', () => {
    const { container } = render(<GlitchText reveal="EVIL">E.</GlitchText>);

    expect(lampo(container)).toHaveTextContent('EVIL');
    expect(lampo(container)).toHaveClass('animate-reveal');
    expect(lampo(container)).toHaveAttribute('aria-hidden', 'true');
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
