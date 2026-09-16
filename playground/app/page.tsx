import { Button } from '@heroui/react';

// La libreria è ancora vuota: questa pagina serve a dimostrare che l'impalcatura regge — HeroUI si
// monta, Tailwind genera, il tema dei Ludoratti è caricato. Le storie dei componenti arriveranno
// qui al punto 3, e questa pagina diventerà il loro indice.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">plague-board-ui</h1>

      <p className="text-default-500">
        L&apos;impalcatura c&apos;è: HeroUI 3, Tailwind v4 e il tema dei Ludoratti. I componenti
        arrivano al punto 2 del subplan, e ognuno avrà la sua storia qui.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Button>Un bottone di HeroUI</Button>
        <span className="rounded-md bg-plague-600 px-3 py-1 text-sm text-white">
          verde della peste
        </span>
        <span className="rounded-md bg-brand px-3 py-1 text-sm text-white">ciano del marchio</span>
        <span className="text-toxic">verde tossico</span>
      </div>
    </main>
  );
}
