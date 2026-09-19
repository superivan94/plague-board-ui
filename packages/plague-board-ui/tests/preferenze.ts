/**
 * Le preferenze del sistema, truccate per il tempo di un test.
 *
 * ⚠️ Sta in un file a parte perché al terzo caso identico — sciame, emettitore, scoppio — tre
 * copie dello stesso `matchMedia` finto sono la cosa che la regola sul copiare vieta. Chi la usa
 * deve rimettere `window.matchMedia` com'era in un `afterEach`: il polyfill vero sta in
 * `setup.ts` e risponde sempre «no».
 */
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
