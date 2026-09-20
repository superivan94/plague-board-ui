import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * Il contratto del marchio di Google: {@link IconProps} **meno il colore**.
 *
 * ⚠️ Non è una svista ed è l'unico caso in tutta la libreria: le linee guida di Google pretendono
 * il logo a quattro colori, così com'è, e vietano di ridisegnarlo o ricolorarlo. Togliere `color`
 * dal tipo fa fallire in **compilazione** il tentativo di uniformarlo alle altre icone — che è il
 * modo in cui va difeso, perché a schermo una `color` ignorata non si vede e chi la passa crede
 * solo che non funzioni.
 *
 * Resta assegnabile dove si aspetta un'icona qualunque: una funzione che accetta *meno* prop sta
 * al posto di una che ne accetta di più.
 */
export type GoogleIconProps = Omit<IconProps, 'color'>;

/**
 * I quattro tracciati del marchio, uno per colore, nell'ordine in cui Google li distribuisce:
 * blu, verde, giallo, rosso.
 *
 * ⚠️ **Sono gli unici tracciati della libreria che portano il `fill` addosso.** `IconBase` li
 * vuole senza, perché il colore arrivi da `currentColor` e un disegno si tinga tutto insieme: qui
 * è esattamente ciò che non deve succedere.
 */
const GOOGLE_MARK: readonly { fill: string; d: string }[] = [
  {
    fill: '#4285F4',
    d: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z',
  },
  {
    fill: '#34A853',
    d: 'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z',
  },
  {
    fill: '#FBBC05',
    d: 'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z',
  },
  {
    fill: '#EA4335',
    d: 'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z',
  },
];

/**
 * **Il marchio di Google**, quello vero: la G a quattro colori che va sul comando di accesso.
 *
 * Non è un'icona della peste e non prova a esserlo: è un **marchio di terzi**, e sta in questa
 * libreria per la stessa ragione per cui ci sta {@link GoogleSignInButton} — tutte e quattro le
 * applicazioni dei Ludoratti accedono con un account Google, quindi quel comando è una superficie
 * condivisa, e un comando che dice «Google» senza il suo segno non si riconosce.
 *
 * ⚠️ **È l'unica icona che non obbedisce a `color`, e l'unica a cui non si può nemmeno passare**:
 * vedi {@link GoogleIconProps}. Il perché sta scritto qui e nel tipo apposta — il primo che la
 * vede accanto alle altre ha l'istinto di «sistemarla», e il tipo lo ferma prima che lo faccia.
 *
 * ⚠️ **Riempie il riquadro più delle nostre**: il disegno di Google va da 1 a 23 su una griglia di
 * 24, mentre le icone di casa stanno fra 1,5 e 22,5 e il dado fra 3 e 21. Affiancata alle altre
 * alla stessa `size` sembra quindi un filo più grande, ed è la stessa proprietà per cui la nuvola
 * di Material non è entrata. Qui non si corregge: ritoccare le proporzioni del marchio è proprio
 * la cosa che le linee guida vietano. Chi lo affianca a un'icona di casa dà a lui un paio di pixel
 * in meno, come fa {@link GoogleSignInButton} con i suoi 20.
 */
export function GoogleIcon(props: GoogleIconProps) {
  return (
    <IconBase {...props}>
      {GOOGLE_MARK.map(({ fill, d }) => (
        <path key={fill} fill={fill} d={d} />
      ))}
    </IconBase>
  );
}
