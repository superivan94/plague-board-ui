import type { Metadata } from 'next';
import { Poppins, Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import { PlaygroundNav } from './PlaygroundNav';

// I due caratteri che `ludoratti.it` usa davvero, misurati sul sito vivo: `Poppins` per il testo e
// `Share Tech Mono` per i titoli e le etichette di servizio.
//
// ⚠️ `next/font` non è un font da CDN: scarica il file al build e lo serve dal proprio dominio.
// La regola «niente font da CDN» nasce dai font di ICONE — Material Symbols e Noto Color Emoji,
// che su iOS si comportano diversamente — ed è un'altra cosa.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-tech',
});

export const metadata: Metadata = {
  title: 'plague-board-ui — playground',
  description: 'I componenti dei Ludoratti, ai tre formati e nei due temi.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ⚠️ La classe `dark` sulla radice è il modo in cui HeroUI 3 riconosce il tema scuro — accetta
  // anche `data-theme="dark"`. Qui è fissa perché il playground il tema lo commuta per riquadro,
  // affiancando chiaro e scuro: la pagina intera non deve avere un tema suo.
  return (
    <html lang="it" className={`dark ${poppins.variable} ${shareTechMono.variable}`}>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <PlaygroundNav />
        {children}
      </body>
    </html>
  );
}
