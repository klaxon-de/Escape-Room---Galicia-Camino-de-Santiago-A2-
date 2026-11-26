import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Award } from 'lucide-react';
import { OFFICE_LOCK_DIALS, STAGES } from '../data/escapeRoomData';
import { StageIllustration } from './StageIllustration';
import { StampEmblem } from './ShellIcons';

interface StageOficinaProps {
  solved: boolean;
  onSolve: () => void;
  onOpenCertificate: () => void;
  onSound: (type: 'click' | 'error' | 'stamp' | 'victory') => void;
}

export function StageOficina({
  solved,
  onSolve,
  onOpenCertificate,
  onSound,
}: StageOficinaProps) {
  const stage = STAGES[4];
  const [dialIndices, setDialIndices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    OFFICE_LOCK_DIALS.forEach((dial) => {
      initial[dial.id] = solved ? dial.options.indexOf(dial.correctValue) : 0;
    });
    return initial;
  });
  const [checkedStatus, setCheckedStatus] = useState<Record<string, boolean> | null>(
    null
  );

  const cycleDial = (dialId: string, optionsLength: number, delta: number) => {
    if (solved) return;
    onSound('click');
    setCheckedStatus(null);
    setDialIndices((prev) => {
      const current = prev[dialId] ?? 0;
      const next = (current + delta + optionsLength) % optionsLength;
      return { ...prev, [dialId]: next };
    });
  };

  const handleCheckLock = () => {
    const results: Record<string, boolean> = {};
    let allCorrect = true;

    OFFICE_LOCK_DIALS.forEach((dial) => {
      const selectedValue = dial.options[dialIndices[dial.id] ?? 0];
      const ok = selectedValue === dial.correctValue;
      results[dial.id] = ok;
      if (!ok) allCorrect = false;
    });

    setCheckedStatus(results);

    if (allCorrect) {
      onSound('victory');
      onSolve();
    } else {
      onSound('error');
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
          Etapa 4 de 4 · {stage.location} · {stage.kmRemaining}
        </p>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {stage.title}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">{stage.story}</p>
      </div>

      {/* 4-Dial Combination Lock */}
      <div className="space-y-4 rounded-xl border border-line bg-paper p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-ink">
            Candado de la Oficina del Peregrino
          </h2>
          <span className="text-xs text-muted">Usa las flechas para girar cada rueda</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {OFFICE_LOCK_DIALS.map((dial) => {
            const idx = dialIndices[dial.id] ?? 0;
            const currentValue = dial.options[idx];
            const dialStatus = checkedStatus ? checkedStatus[dial.id] : undefined;

            return (
              <div
                key={dial.id}
                className={`flex flex-col justify-between rounded-xl border bg-white p-4 transition-colors ${
                  solved || dialStatus === true
                    ? 'border-galicia/50 bg-galicia-soft/20'
                    : dialStatus === false
                      ? 'border-brick/40 bg-brick-soft/20'
                      : 'border-line'
                }`}
              >
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted">
                    {dial.label} · {dial.clueRef}
                  </p>
                  <p className="text-sm font-medium leading-snug text-ink">
                    {dial.question}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-line bg-canvas p-1.5">
                  <button
                    type="button"
                    disabled={solved}
                    onClick={() => cycleDial(dial.id, dial.options.length, -1)}
                    aria-label={`Opción anterior para ${dial.label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-md bg-white border border-line text-ink hover:border-atlantic hover:text-atlantic transition-colors disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="px-2 text-center font-mono text-sm font-semibold text-ink">
                    {currentValue}
                  </span>

                  <button
                    type="button"
                    disabled={solved}
                    onClick={() => cycleDial(dial.id, dial.options.length, 1)}
                    aria-label={`Opción siguiente para ${dial.label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-md bg-white border border-line text-ink hover:border-atlantic hover:text-atlantic transition-colors disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {dialStatus === true && (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-galicia">
                    <Check className="h-3.5 w-3.5" />
                    <span>Rueda correcta</span>
                  </p>
                )}
                {dialStatus === false && (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brick">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Revisa esta rueda</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {!solved && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCheckLock}
              className="rounded-lg bg-atlantic px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-atlantic-dark whitespace-nowrap"
            >
              Abrir el candado
            </button>
          </div>
        )}
      </div>

      {/* Etapa Final Resuelta */}
      {solved && (
        <div className="space-y-4 rounded-xl border border-galicia/30 bg-galicia-soft/50 p-5">
          <div className="flex items-start gap-3.5">
            <div className="animate-stamp flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-galicia/50 bg-white text-galicia">
              <StampEmblem stageId={4} className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-galicia">
                ✓ Candado abierto · Último sello conseguido: {stage.stampName}
              </p>
              <h3 className="font-display text-lg font-semibold text-ink">
                {stage.culturalFactTitle}
              </h3>
              <p className="text-sm leading-relaxed text-ink">{stage.culturalFact}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-galicia/20 pt-4">
            <p className="text-xs font-medium text-muted">
              ¡Buen Camino! Ya tienes los 4 sellos en tu Credencial.
            </p>
            <button
              type="button"
              onClick={onOpenCertificate}
              className="inline-flex items-center gap-2 rounded-lg bg-galicia px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 whitespace-nowrap"
            >
              <Award className="h-4 w-4" />
              <span>Recoger mi Compostela</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
