import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// ⚠️ Il percorso si ricava dalla cartella di lavoro e non da `import.meta.url`, per la stessa
// ragione di `boundaries.test.ts`: in jsdom quell'URL è un `http://localhost/…`.
const SRC = join(process.cwd(), 'src');

const sources = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
  .filter((name) => name.endsWith('.ts') || name.endsWith('.tsx'))
  .map((name) => ({ name: name.replace(/\\/g, '/'), text: readFileSync(join(SRC, name), 'utf8') }));

describe('l’anello di fuoco', () => {
  it('trova i sorgenti da controllare', () => {
    // Un guard che scandaglia zero file è verde per costruzione.
    expect(sources.length).toBeGreaterThan(5);
  });

  it.each(sources)('$name non disegna il fuoco con `outline`', ({ text }) => {
    // ⚠️ Misurato il 2026-09-20, ed è un difetto che era già **in produzione** in tre componenti:
    // `outline-none` non spegne solo il contorno, scrive `--tw-outline-style: none`, e in Tailwind
    // v4 un `outline-2` vale `outline-style: var(--tw-outline-style, solid)`. Messi insieme —
    // ed è l'accoppiata che viene in mente per prima — la larghezza cambia, il colore pure, e lo
    // **stile resta `none`**: l'anello non si disegna affatto. Sulla pagina viva:
    // `:focus-visible` corrispondeva, `outline-width` valeva 2px, `outline-style` valeva `none`.
    //
    // Non si vede guardando, perché per vederlo bisogna arrivarci col Tab, ed è la stessa forma di
    // `animate-scale-bounce` e `text-default-500`: una classe che non produce nessuna regola.
    //
    // L'alternativa legittima non è spegnere questo caso: è `focus-visible:focus-ring`, l'utility
    // di HeroUI, che l'anello lo fa con `ring-*` — cioè con un'ombra, che `outline-none` non tocca
    // — e che dà a ogni comando della pagina lo stesso fuoco.
    expect(text).not.toMatch(/focus-visible:outline-/);
  });
});
