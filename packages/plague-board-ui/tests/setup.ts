import '@testing-library/jest-dom/vitest';

// jsdom non implementa `matchMedia`, e un componente che chiede la preferenza di tema o di
// movimento ridotto lo chiama al montaggio: senza polyfill non degrada, lancia.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Stessa storia per `ResizeObserver`, che i componenti di HeroUI usano per misurarsi.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
