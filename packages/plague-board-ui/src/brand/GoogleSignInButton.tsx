import { Button, Spinner } from '@heroui/react';

import { GoogleIcon } from '../icons/GoogleIcon';

export interface GoogleSignInButtonProps {
  /**
   * Che cosa succede quando lo si preme: la libreria non sa che cosa sia Firebase, e chi la usa
   * passa la funzione che accede davvero.
   */
  onPress: () => void;
  /**
   * Che cosa c'è scritto, che è anche il nome accessibile.
   *
   * ⚠️ **È l'unica parola della libreria che non viene da `LUDORATTI_COPY`**, ed è una scelta: le
   * linee guida di Google prescrivono la formula — «Accedi con Google», tradotta ma non riscritta
   * — perché chi legge deve riconoscere il comando, non la nostra voce. Chi si prende la
   * responsabilità di cambiarla passa la sua.
   */
  label?: string;
  /**
   * Che l'accesso sia in corso. Spegne la pressione **senza** togliere il comando dalla tastiera,
   * e mette al posto del marchio il cerchio che gira.
   */
  isPending?: boolean;
  /**
   * Che occupi tutta la riga. Acceso di serie, perché un comando di accesso sta da solo in una
   * colonna stretta: il `Button` di HeroUI è `w-fit`, e senza questo si stringerebbe attorno alle
   * sue tre parole in mezzo al pannello.
   */
  fullWidth?: boolean;
  /** Classi aggiuntive. */
  className?: string;
}

/**
 * **Il comando che accede con Google**, vestito una volta sola per tutte e quattro le applicazioni.
 *
 * Sopra il `Button` di HeroUI, variante `outline`: il marchio a sinistra e la formula accanto. Di
 * là ce ne sono due versioni diverse — un `Button` con `variant="bordered"` in Rattoteca e un
 * `<button>` blu scritto a mano in RattInventario, che il logo non ce l'ha affatto.
 *
 * ⚠️ **Non sa che cosa sia Firebase.** Riceve `onPress` e basta: l'autenticazione, gli errori e
 * dove si va dopo sono dell'applicazione. È la stessa regola di `TalkingMascot` con le frasi — il
 * componente porta il gesto, non quello che il gesto scatena.
 *
 * ⚠️ **L'attesa è `isPending`, non `isDisabled`.** Sono due cose diverse e la differenza si sente
 * solo con la tastiera: un comando disabilitato esce dall'ordine di tabulazione, e chi ci aveva il
 * fuoco sopra se lo ritrova sul `body` proprio nel momento in cui la pagina gli sta rispondendo.
 * `isPending` di `react-aria` — che il `Button` di HeroUI inoltra così com'è — spegne pressione e
 * puntatore, lascia il fuoco dov'è, mette `aria-disabled`, e annuncia il cambio a chi sta sul
 * comando.
 *
 * ⚠️ **E proprio per via di quell'`aria-disabled`, in attesa il comando sembra _disabilitato_.**
 * Lo stato `pending` di HeroUI vale `pointer-events: none` e nient'altro — `status-pending` è
 * tutta lì — ma la sua regola del disabilitato guarda `[aria-disabled="true"]`, che `react-aria`
 * scrive: misurato in pagina, `opacity: 0.5` e `cursor: not-allowed`, cioè l'aspetto di un
 * comando che non si può usare invece di uno che sta lavorando. Lo scambio del marchio col
 * cerchio è quindi l'**unica** cosa che dice la differenza. (L'etichetta regge il velo: 19,74 di
 * contrasto a riposo e **5,20** in attesa, in tema scuro.)
 *
 * ⚠️ **Il bordo della variante `outline` è quello di HeroUI, e resta debole**: misurato il
 * 2026-09-20, **1,38** in tema scuro e **1,23** in chiaro. Non si corregge qui: è il suo token
 * `--border`, cioè l'aspetto di *tutti* i suoi comandi bordati, e ritoccarlo in un componente solo
 * farebbe di questo l'unico bottone diverso dagli altri dell'applicazione. A identificarlo restano
 * il marchio e l'etichetta, che stanno sopra 16. La leva, il giorno che si decidesse che è troppo
 * poco, è ridichiarare `--border` in `theme.css` nei due blocchi del tema — come si è già fatto con
 * `--accent-soft-foreground`.
 *
 * ⚠️ **E il cerchio è muto.** Lo `Spinner` di HeroUI nasce `role="status"` con dentro «Loading»,
 * una parola inglese che nessuno può tradurre; l'annuncio dell'attesa lo fa già `react-aria`, con
 * l'etichetta vera del comando. Due annunci per lo stesso fatto sono peggio di uno.
 *
 * @example
 * ```tsx
 * <GoogleSignInButton isPending={accessoInCorso} onPress={() => void accediConGoogle()} />
 * ```
 */
export function GoogleSignInButton({
  onPress,
  label = 'Accedi con Google',
  isPending = false,
  fullWidth = true,
  className = '',
}: GoogleSignInButtonProps) {
  return (
    <Button
      variant="outline"
      fullWidth={fullWidth}
      isPending={isPending}
      onPress={onPress}
      className={className}
    >
      {/* Venti e non ventiquattro: il marchio di Google riempie il suo riquadro più delle icone
          di casa, e accanto a un testo alla stessa taglia sembrerebbe più grande. */}
      {isPending ? <Spinner aria-hidden="true" className="size-5" /> : <GoogleIcon size={20} />}
      {label}
    </Button>
  );
}
