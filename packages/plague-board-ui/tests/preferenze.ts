/**
 * Le preferenze del sistema, truccate per il tempo di un test.
 *
 * ⚠️ Sta in un file a parte perché al terzo caso identico — sciame, emettitore, scoppio — tre
 * copie dello stesso `matchMedia` finto sono la cosa che la regola sul copiare vieta. Chi la usa
 * deve rimettere `window.matchMedia` com'era in un `afterEach`: il polyfill vero sta in
 * `setup.ts` e risponde sempre «no».
 */
/**
 * Mette la pagina in secondo piano, come una scheda dietro a un'altra.
 *
 * ⚠️ Sta qui accanto alle preferenze perché al terzo caso identico — sciame, bolle, versi della
 * città — tre copie dello stesso `defineProperty` sono la cosa che la regola sul copiare vieta.
 * Chi la usa deve rimetterla a `false` in un `afterEach`.
 */
export const paginaNascosta = (nascosta: boolean) => {
  Object.defineProperty(document, 'visibilityState', {
    value: nascosta ? 'hidden' : 'visible',
    configurable: true,
  });
  Object.defineProperty(document, 'hidden', { value: nascosta, configurable: true });
};

export const menoMovimento = (acceso: boolean) => {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: acceso && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
};
