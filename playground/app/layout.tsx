import type { Metadata, Viewport } from 'next';
import { Poppins, Share_Tech_Mono } from 'next/font/google';
import { themeBootScript } from 'plague-board-ui';

import './globals.css';

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

/**
 * ⚠️ **`viewport-fit=cover` è quello che accende `env(safe-area-inset-*)`.** Senza, il browser
 * tiene da sé la pagina lontana dagli incavi — l'orecchia della fotocamera in cima, la barra del
 * gesto in fondo — e quei valori restano a **zero**: le due lastre non arriverebbero mai fino al
 * bordo dello schermo, e il rientro che `PlagueBar` calcola non servirebbe a niente. Dichiararlo
 * vuol dire prendersi la responsabilità degli incavi, ed è appunto quello che la lastra fa.
 */
export const viewport: Viewport = {
  viewportFit: 'cover',
};

// ⚠️ Gira **prima** che la pagina si disegni, quindi chi torna col tema chiaro non vede un lampo
// scuro. Non può essere un effetto di React: gli effetti partono dopo il primo disegno, ed è lì
// che il lampo si vede. È lo script della libreria senza opzioni — la chiave di `useTheme` di
// HeroUI, che è il gancio della barra, e «del sistema» come valore di serie.
const THEME_BOOT = themeBootScript();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // La classe sulla radice è il modo in cui sia HeroUI sia `theme.css` riconoscono il tema. Qui
  // parte `dark`, e lo script qui sopra la corregge subito se la scelta — o il sistema — dice altro.
  return (
    // ⚠️ `suppressHydrationWarning` è qui perché la differenza è **voluta**: il server scrive
    // `dark`, lo script qui sopra la cambia — e aggiunge `data-theme` — prima che React idrati, e
    // React trova una radice diversa da quella che ha reso. Senza questa riga è un avviso a ogni caricamento; con un
    // effetto al posto dello script, sarebbe un lampo del tema sbagliato a ogni caricamento.
    <html
      lang="it"
      suppressHydrationWarning
      className={`dark ${poppins.variable} ${shareTechMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      {/* ⚠️ `flex-col` con la pagina che cresce: è quello che tiene il piede **in fondo** anche
          sulle pagine corte, invece che a metà schermo. E il piede è appiccicato come la barra —
          resta in vista mentre si scorre — perché `position: sticky` lascia l'elemento **nel
          flusso**: non copre niente, si limita a non uscire dalla finestra. Barra e piede li mette
          il layout di `(vetrina)`: le cornici delle storie non li vogliono. */}
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
