import { Button } from '@heroui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// ⚠️ Questo non è il test di un nostro componente: la libreria è ancora vuota. È il test
// dell'impalcatura, e prova la decisione che regge tutto il resto — che HeroUI sia l'infrastruttura
// e che si monti nell'ambiente di prova. Senza, il primo componente vestito fallirebbe per un
// motivo che non ha niente a che vedere con lui.
describe('l\'impalcatura della libreria', () => {
  it('monta un componente di HeroUI in jsdom', () => {
    render(<Button>Squit</Button>);

    const button = screen.getByRole('button', { name: 'Squit' });
    expect(button).toBeInTheDocument();
  });
});
