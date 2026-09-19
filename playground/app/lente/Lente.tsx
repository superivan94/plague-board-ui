'use client';

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';
import { RAT_LIVERIES, Rat, TechLabel, type RatLivery } from 'plague-board-ui';
import { useEffect, useRef, useState } from 'react';

const LIVREE = Object.keys(RAT_LIVERIES) as RatLivery[];
type Kit = 'skull' | 'collar' | 'vial';
/** Il mezzo passo di `animations.css`, in millisecondi; il ciclo intero è il doppio. */
const MEZZO_PASSO_MS = 300;
const CICLO_MS = MEZZO_PASSO_MS * 2;

/**
 * Le tinte del pupazzo: un colore per pezzo, l'inchiostro lasciato stare. ⚠️ Il selettore
 * `[fill="#100020"]` è l'inchiostro della livrea: i percorsi non hanno classi, ma hanno il colore
 * come attributo, e il CSS sull'attributo lo può escludere.
 */
const TINTE: Record<string, string> = {
  'tail-1': '#38bdf8', 'tail-2': '#0ea5e9', 'tail-3': '#6366f1', 'tail-4': '#38bdf8', 'tail-5': '#0ea5e9',
  'leg-back-far': '#facc15', 'leg-front-far': '#fde047', 'leg-back-near': '#ef4444', 'leg-front-near': '#f97316',
  torso: '#a3a3a3',
};
const CSS_TINTE = Object.entries(TINTE)
  .map(([parte, colore]) => `.lente-tinte .pb-rat-${parte} > path:not([fill="#100020"]) { fill: ${colore}; }`)
  .join('\n');

/**
 * La lente: il ratto **da solo**, grande quanto si vuole, fermo a un istante qualunque del passo.
 *
 * Serve a guardare le cuciture del pupazzo — i giunti, le radici delle zampe, la coda — senza il
 * resto della pagina attorno e a una scala in cui un pixel della reference è un pixel a schermo.
 * La fase si sceglie col cursore: **mette in pausa tutte le animazioni** del ratto e le porta a
 * quell'istante con `currentTime`, che è ciò che il browser fa da sé mentre corrono; «riprendi» le
 * rilascia. Le tinte colorano ogni pezzo con un colore suo, così si vede dove finisce uno e comincia
 * l'altro.
 *
 * ⚠️ È uno strumento del playground, non della libreria: il ratto non sa di essere osservato.
 */
export function Lente() {
  const [livrea, setLivrea] = useState<RatLivery>('grey');
  const [kit, setKit] = useState<Set<Kit>>(() => new Set<Kit>(['vial']));
  const [altezza, setAltezza] = useState(420);
  const [tinte, setTinte] = useState(false);
  /** L'istante del ciclo a cui il ratto è fermo, in millisecondi; conta solo quando non corre. */
  const [fase, setFase] = useState(0);
  const [corre, setCorre] = useState(true);
  /** Quante volte più veloce del foglio di stile: 1 è com'è scritto in `animations.css`. */
  const [velocita, setVelocita] = useState(1);
  const cornice = useRef<HTMLDivElement>(null);

  // Le animazioni del ratto si fermano e si portano alla fase scelta, o si rilasciano, e vanno alla
  // velocità scelta. È l'unico posto che tocca il DOM del ratto, e lo fa a ogni render perché il
  // ratto cambia con le prop. ⚠️ `playbackRate` scala **tutte** le animazioni insieme — zampe,
  // coda, sobbalzo, pendagli — che è l'unico modo sensato di provare un passo più veloce: i
  // rapporti fra i cicli (i pendagli al doppio, i ritardi della coda) restano quelli.
  useEffect(() => {
    const svg = cornice.current?.querySelector('svg');
    if (!svg) return;
    for (const a of svg.getAnimations({ subtree: true })) {
      a.playbackRate = velocita;
      if (corre) a.play();
      else { a.pause(); a.currentTime = fase; }
    }
  });

  // ⚠️ Muovere il cursore ferma il ratto: è l'unico gesto sensato, e senza questo l'istante zero
  // non si poteva scegliere — il cursore era già lì e non cambiava valore.
  const scegliFase = (ms: number) => { setFase(ms); setCorre(false); };

  return (
    <div className="flex flex-col gap-6">
      <style>{CSS_TINTE}</style>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleButtonGroup size="sm" selectionMode="single" disallowEmptySelection selectedKeys={[livrea]} onSelectionChange={(k) => { const v = [...k][0] as RatLivery | undefined; if (v) setLivrea(v); }} aria-label="Livrea">
          {LIVREE.map((l) => <ToggleButton key={l} id={l}><TechLabel>{l}</TechLabel></ToggleButton>)}
        </ToggleButtonGroup>
        <ToggleButtonGroup size="sm" selectionMode="multiple" selectedKeys={[...kit]} onSelectionChange={(k) => setKit(new Set([...k] as Kit[]))} aria-label="Kit">
          <ToggleButton id="skull"><TechLabel>teschio</TechLabel></ToggleButton>
          <ToggleButton id="collar"><TechLabel>collare</TechLabel></ToggleButton>
          <ToggleButton id="vial"><TechLabel>ampolla</TechLabel></ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup size="sm" selectionMode="multiple" selectedKeys={tinte ? ['tinte'] : []} onSelectionChange={(k) => setTinte([...k].includes('tinte'))} aria-label="Aspetto">
          <ToggleButton id="tinte"><TechLabel>tinte dei pezzi</TechLabel></ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-sm">
        <label className="flex items-center gap-3">
          <TechLabel className="text-muted">altezza</TechLabel>
          <input type="range" min={120} max={1200} step={20} value={altezza} onChange={(e) => setAltezza(Number(e.target.value))} className="w-48 accent-brand-ink" aria-label="Altezza del ratto in pixel" />
          <span className="w-16 tabular-nums text-muted">{altezza} px</span>
        </label>
        <label className="flex items-center gap-3">
          <TechLabel className="text-muted">fase</TechLabel>
          <input type="range" min={0} max={CICLO_MS} step={10} value={fase} onChange={(e) => scegliFase(Number(e.target.value))} className="w-64 accent-brand-ink" aria-label="Istante del passo" />
          <span className="w-20 tabular-nums text-muted">{corre ? 'corre' : `${fase} ms`}</span>
          <button type="button" onClick={() => (corre ? scegliFase(fase) : setCorre(true))} className="rounded-md border border-border px-2 py-1 text-xs text-brand-ink hover:bg-surface">
            {corre ? 'ferma' : 'riprendi'}
          </button>
        </label>
        <label className="flex items-center gap-3">
          <TechLabel className="text-muted">velocità</TechLabel>
          <input type="range" min={0.5} max={3} step={0.1} value={velocita} onChange={(e) => setVelocita(Number(e.target.value))} className="w-48 accent-brand-ink" aria-label="Velocità del passo rispetto al foglio di stile" />
          <span className="w-44 tabular-nums text-muted">
            ×{velocita.toFixed(1)} · mezzo passo {Math.round(MEZZO_PASSO_MS / velocita)} ms
          </span>
        </label>
      </div>

      {/* ⚠️ Il fondo è la superficie del tema, non un colore fisso: si guarda il ratto anche in scuro. */}
      <div ref={cornice} className={`overflow-auto rounded-lg border border-border bg-surface p-6 ${tinte ? 'lente-tinte' : ''}`}>
        <Rat livery={livrea} size={altezza} isRunning hasSkull={kit.has('skull')} hasCollar={kit.has('collar')} hasVial={kit.has('vial')} title="Il ratto sotto la lente" />
      </div>
      <p className="text-xs text-muted">
        Con la fase ferma si legge un istante del ciclo di 0,6 secondi. La velocità moltiplica tutte le animazioni insieme
        e dice il mezzo passo che ne risulta: è il numero da riportare in <code>animations.css</code>. Con «tinte dei pezzi»
        ogni parte ha un colore suo e l&apos;inchiostro resta inchiostro.
      </p>
    </div>
  );
}
