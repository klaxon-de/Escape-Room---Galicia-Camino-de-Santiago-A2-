import { useState, type FormEvent } from 'react';
import { Check, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import {
  ALBERGUE_LOCK_CODE,
  BACKPACK_ITEMS,
  SOFIA_ALBERGUE_NOTES,
  STAGES,
} from '../data/escapeRoomData';
import { StageIllustration } from './StageIllustration';
import { StampEmblem } from './ShellIcons';

interface StageAlbergueProps {
  solved: boolean;
  onSolve: () => void;
  onNext: () => void;
  onSound: (type: 'click' | 'error' | 'stamp') => void;
}

export function StageAlbergue({
  solved,
  onSolve,
  onNext,
  onSound,
}: StageAlbergueProps) {
  const stage = STAGES[1];
  const [selectedIds, setSelectedIds] = useState<string[]>(
    solved ? ['chubasquero', 'botas', 'cantimplora', 'credencial'] : []
  );
  const [packVerified, setPackVerified] = useState<boolean>(solved);
  const [packFeedback, setPackFeedback] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState<string>(solved ? ALBERGUE_LOCK_CODE : '');
  const [codeError, setCodeError] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    if (solved || packVerified) return;
    onSound('click');
    setPackFeedback(null);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckPack = () => {
    const selectedItems = BACKPACK_ITEMS.filter((item) => selectedIds.includes(item.id));
    const wrongItem = selectedItems.find((item) => !item.required);

    if (wrongItem) {
      onSound('error');
      setPackFeedback(
        wrongItem.wrongHint || 'Uno de los objetos elegidos no sirve para caminar.'
      );
      return;
    }

    if (selectedItems.length < 4) {
      onSound('error');
      const remaining = 4 - selectedItems.length;
      setPackFeedback(
        `Todavía te falta${remaining === 1 ? '' : 'n'} ${remaining} objeto${remaining === 1 ? '' : 's'} importante${remaining === 1 ? '' : 's'} de la nota de Sofía.`
      );
      return;
    }

    onSound('click');
    setPackFeedback(null);
    setPackVerified(true);
  };

  const handleCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = codeInput.replace(/\D/g, '');
    if (cleaned === ALBERGUE_LOCK_CODE) {
      setCodeError(null);
      onSound('stamp');
      onSolve();
    } else {
      onSound('error');
      setCodeError(
        'Ese código no abre la taquilla. Mira el orden de las frases 1, 2, 3 y 4 en la nota de Sofía y escribe el número de cada objeto.'
      );
    }
  };

  return (
    <div className="space-y-6">
      <StageIllustration
        src={stage.image}
        alt={stage.imageAlt}
        caption={`${stage.location} · ${stage.kmRemaining}`}
        aspectClass="aspect-[16/10]"
      />

      <div className="space-y-3">
        <p className="text-xs font-medium text-muted">
          Etapa 1 de 4 · {stage.location} · {stage.kmRemaining}
        </p>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {stage.title}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">{stage.story}</p>
      </div>

      {/* Nota de Sofía */}
      <div className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-semibold text-ink">Nota de Sofía en el albergue</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
          {SOFIA_ALBERGUE_NOTES.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      {/* Paso 1: Elegir los 4 objetos */}
      <div className="space-y-4 border-t border-line pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold text-ink">
            Paso 1 · Selecciona los 4 objetos correctos para la mochila
          </h2>
          <span className="font-mono text-xs tabular-nums text-muted">
            {selectedIds.length}/4 seleccionados
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BACKPACK_ITEMS.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                disabled={solved || packVerified}
                onClick={() => toggleItem(item.id)}
                aria-pressed={isSelected}
                className={`flex min-h-[72px] items-start justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                  isSelected
                    ? packVerified
                      ? 'border-galicia bg-galicia-soft/50 text-ink'
                      : 'border-atlantic bg-atlantic/[0.06] text-ink'
                    : 'border-line bg-white text-ink hover:border-slate-300'
                } disabled:cursor-default`}
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-ink">{item.name}</p>
                  <p className="text-xs text-muted">{item.detail}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-mono text-xs font-semibold tabular-nums text-muted">
                    Nº {item.codeDigit}
                  </span>
                  {isSelected && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        packVerified ? 'text-galicia' : 'text-atlantic'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Elegido</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {packFeedback && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-brick/25 bg-brick-soft px-4 py-3 text-sm text-brick"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{packFeedback}</span>
          </div>
        )}

        {!packVerified && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleCheckPack}
              className="rounded-lg bg-atlantic px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-atlantic-dark whitespace-nowrap"
            >
              Comprobar mochila
            </button>
          </div>
        )}
      </div>

      {/* Paso 2: Código de la taquilla */}
      {packVerified && !solved && (
        <form
          onSubmit={handleCodeSubmit}
          className="space-y-4 border-t border-line pt-6"
        >
          <div className="flex items-center gap-2 text-galicia text-sm font-semibold">
            <Check className="h-4 w-4" />
            <span>¡Mochila lista! Ahora abre la taquilla del albergue.</span>
          </div>

          <p className="text-sm leading-relaxed text-muted">
            Paso 2 · Escribe el código de 4 cifras con los números (Nº) de tus 4 objetos,
            en el orden de las frases 1 a 4 de la nota de Sofía.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-xs">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value.replace(/\D/g, ''));
                  setCodeError(null);
                }}
                placeholder="Ej. 1234"
                aria-label="Código de 4 cifras de la taquilla"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 font-mono text-base font-semibold tracking-[0.25em] tabular-nums text-ink focus:border-atlantic focus:outline-none focus:ring-2 focus:ring-atlantic/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-atlantic px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-atlantic-dark whitespace-nowrap"
            >
              Abrir taquilla
            </button>
          </div>

          {codeError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-brick/25 bg-brick-soft px-4 py-3 text-sm text-brick"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{codeError}</span>
            </div>
          )}
        </form>
      )}

      {/* Etapa Resuelta */}
      {solved && (
        <div className="space-y-4 rounded-xl border border-galicia/30 bg-galicia-soft/50 p-5">
          <div className="flex items-start gap-3.5">
            <div className="animate-stamp flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-galicia/50 bg-white text-galicia">
              <StampEmblem stageId={1} className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-galicia">
                ✓ Resuelto · Sello conseguido: {stage.stampName}
              </p>
              <h3 className="font-display text-lg font-semibold text-ink">
                {stage.culturalFactTitle}
              </h3>
              <p className="text-sm leading-relaxed text-ink">{stage.culturalFact}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-galicia/20 pt-4">
            <p className="text-xs font-medium text-muted">
              Guardado en tu Credencial: <strong className="text-ink">{stage.clueValue}</strong>
            </p>
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-lg bg-atlantic px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-atlantic-dark whitespace-nowrap"
            >
              <span>Ir a la Etapa 2</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
