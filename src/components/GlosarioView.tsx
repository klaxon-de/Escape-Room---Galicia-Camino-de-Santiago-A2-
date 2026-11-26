import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { GLOSSARY_ENTRIES, type GlossaryEntry } from '../data/escapeRoomData';

type CategoryFilter = 'Todas' | GlossaryEntry['category'];

const CATEGORIES: CategoryFilter[] = [
  'Todas',
  'Camino',
  'Galicia',
  'Comida',
  'Direcciones y estados',
];

interface GlosarioViewProps {
  onBackToGame: () => void;
}

export function GlosarioView({ onBackToGame }: GlosarioViewProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('Todas');

  const filtered = GLOSSARY_ENTRIES.filter((entry) => {
    const matchesCategory = category === 'Todas' || entry.category === category;
    const q = query.trim().toLowerCase();
    if (!q) return matchesCategory;
    return (
      matchesCategory &&
      (entry.es.toLowerCase().includes(q) ||
        entry.de.toLowerCase().includes(q) ||
        entry.example.toLowerCase().includes(q))
    );
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted">
            Ayuda de vocabulario · Español – Alemán · Nivel A2
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Glosario A2 · Galicia y el Camino
          </h1>
        </div>
        <button
          type="button"
          onClick={onBackToGame}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-subtle whitespace-nowrap"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a las etapas</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-surface-subtle p-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                category === cat
                  ? 'bg-white text-ink shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar palabra..."
            aria-label="Buscar palabra en el glosario"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-ink focus:border-atlantic focus:outline-none focus:ring-2 focus:ring-atlantic/20"
          />
        </div>
      </div>

      {/* Table / List */}
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">
            No hay palabras que coincidan con «{query}».
          </div>
        ) : (
          <div className="divide-y divide-line">
            {filtered.map((entry) => (
              <div
                key={entry.es}
                className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-12 sm:items-baseline sm:gap-4"
              >
                <div className="sm:col-span-4">
                  <p className="text-sm font-semibold text-ink">{entry.es}</p>
                  <p className="text-xs text-muted">{entry.category}</p>
                </div>
                <div className="sm:col-span-4 text-sm text-ink">{entry.de}</div>
                <div className="sm:col-span-4 text-xs italic text-muted">
                  «{entry.example}»
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
