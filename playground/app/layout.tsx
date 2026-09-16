import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'plague-board-ui — playground',
  description: 'I componenti dei Ludoratti, ai tre formati e nei due temi.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ⚠️ La classe `dark` sulla radice è il modo in cui HeroUI 3 riconosce il tema scuro — accetta
  // anche `data-theme="dark"`. Qui è fissa perché il playground il tema lo commuterà per riquadro,
  // affiancando chiaro e scuro: la pagina intera non deve avere un tema suo.
  return (
    <html lang="it" className="dark">
      <body className="min-h-dvh bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
