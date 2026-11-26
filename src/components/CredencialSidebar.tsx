import { Check, HelpCircle, Volume2, VolumeX, Clock, RotateCcw } from 'lucide-react';
import { STAGES, STAGE_ORDER, type StageId } from '../data/escapeRoomData';
import { formatDuration } from '../utils/text';
import { StampEmblem } from './ShellIcons';

interface CredencialSidebarProps {
  teamName: string;
  activeStage: StageId;
  solvedStages: StageId[];
  hintsRevealed: Record<StageId, number>;
  elapsedSeconds: number;
  timerPaused: boolean;
  soundEnabled: boolean;
  onSelectStage: (stage: StageId) => void;
  onRevealHint: (stage: StageId) => void;
  onToggleTimer: () => void;
  onToggleSound: () => void;
  onReset: () => void;
  onOpenCertificate: () => void;
}

export function CredencialSidebar({
  teamName,
  activeStage,
  solvedStages,
  hintsRevealed,
  elapsedSeconds,
  timerPaused,
  soundEnabled,
  onSelectStage,
  onRevealHint,
  onToggleTimer,
  onToggleSound,
  onReset,
  onOpenCertificate,
}: CredencialSidebarProps) {
  const currentStage = STAGES[activeStage];
  const currentHintsCount = hintsRevealed[activeStage] ?? 0;
  const isCurrentSolved = solvedStages.includes(activeStage);
  const allSolved = solvedStages.length === STAGE_ORDER.length;

  return (
    <aside className="flex flex-col gap-6">
      {/* Credencial del Peregrino */}
      <section className="rounded-xl border border-line bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted">Credencial del peregrino</p>
            <h2 className="mt-0.5 font-display text-lg font-semibold text-ink">
              {teamName.trim() || 'Equipo Peregrino'}
            </h2>
          </div>
          <span className="font-mono text-sm font-semibold tabular-nums text-atlantic">
            {solvedStages.length}/4
          </span>
        </div>

        {/* Utility strip: Timer & Audio */}
        <div className="mt-4 flex items-center justify-between gap-2 border-y border-line py-2.5 text-xs text-muted">
          <button
            type="button"
            onClick={onToggleTimer}
            className="inline-flex items-center gap-1.5 font-mono tabular-nums text-ink hover:text-atlantic transition-colors whitespace-nowrap shrink-0"
            title={timerPaused ? 'Reanudar reloj' : 'Pausar reloj'}
          >
            <Clock className="h-3.5 w-3.5 text-muted" />
            <span>{formatDuration(elapsedSeconds)}</span>
            <span className="font-sans text-muted">
              · {timerPaused ? 'En pausa' : 'En curso'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-ink transition-colors whitespace-nowrap shrink-0"
            aria-label={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span>Sonido</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span>Silencio</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Stamp Boxes */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {STAGE_ORDER.map((id) => {
            const stage = STAGES[id];
            const solved = solvedStages.includes(id);
            const isActive = activeStage === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectStage(id)}
                className={`group flex flex-col items-start rounded-lg border p-3 text-left transition-colors ${
                  isActive
                    ? 'border-atlantic bg-atlantic/[0.04]'
                    : solved
                      ? 'border-galicia/30 bg-galicia-soft/40 hover:border-galicia/60'
                      : 'border-line bg-paper/60 hover:border-slate-300'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-xs tabular-nums text-muted">
                    Etapa {id}
                  </span>
                  {solved ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-galicia">
                      <Check className="h-3.5 w-3.5" />
                      <span>Sello</span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted">Pendiente</span>
                  )}
                </div>

                <div
                  className={`mt-2.5 flex h-11 w-11 items-center justify-center rounded-full border ${
                    solved
                      ? 'animate-stamp border-galicia/50 bg-white text-galicia'
                      : isActive
                        ? 'border-dashed border-atlantic/50 bg-white text-atlantic'
                        : 'border-dashed border-slate-300 bg-white/70 text-slate-400'
                  }`}
                >
                  <StampEmblem stageId={id} className="h-5 w-5" />
                </div>

                <p className="mt-2 text-xs font-semibold text-ink">{stage.stampName}</p>
                <p className="text-[11px] text-muted">{stage.shortTitle}</p>
              </button>
            );
          })}
        </div>

        {/* Collected Clues (Datos guardados) */}
        <div className="mt-5 border-t border-line pt-4">
          <h3 className="text-xs font-semibold text-ink">Datos guardados para la meta</h3>
          {solvedStages.length === 0 ? (
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              Resuelve cada etapa para guardar aquí las pistas necesarias para el candado final.
            </p>
          ) : (
            <dl className="mt-2.5 space-y-2 text-xs">
              {STAGE_ORDER.filter((id) => solvedStages.includes(id)).map((id) => (
                <div
                  key={id}
                  className="flex items-baseline justify-between gap-2 border-b border-line/70 pb-1.5 last:border-b-0 last:pb-0"
                >
                  <dt className="text-muted">{STAGES[id].clueLabel}</dt>
                  <dd className="font-semibold text-ink text-right">{STAGES[id].clueValue}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {allSolved && (
          <div className="mt-5 border-t border-line pt-4">
            <button
              type="button"
              onClick={onOpenCertificate}
              className="w-full rounded-lg bg-galicia px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 whitespace-nowrap"
            >
              Ver mi Compostela
            </button>
          </div>
        )}
      </section>

      {/* 3-Tier Hints Deck (Pistas) */}
      <section className="rounded-xl border border-line bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-camino" />
            <h3 className="text-sm font-semibold text-ink">
              Pistas · Etapa {activeStage}
            </h3>
          </div>
          <span className="font-mono text-xs tabular-nums text-muted">
            {currentHintsCount}/3
          </span>
        </div>

        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          ¿Necesitas ayuda? Puedes abrir hasta tres pistas paso a paso.
        </p>

        {currentHintsCount > 0 && (
          <ol className="mt-3.5 space-y-2.5 border-t border-line pt-3.5">
            {currentStage.hints.slice(0, currentHintsCount).map((hint, idx) => (
              <li
                key={idx}
                className="rounded-lg bg-paper px-3 py-2.5 text-xs leading-relaxed text-ink border border-line/80"
              >
                <span className="font-semibold text-camino">Pista {idx + 1}: </span>
                {hint}
              </li>
            ))}
          </ol>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          {currentHintsCount < 3 && !isCurrentSolved ? (
            <button
              type="button"
              onClick={() => onRevealHint(activeStage)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-surface-subtle whitespace-nowrap"
            >
              Mostrar pista {currentHintsCount + 1} de 3
            </button>
          ) : (
            <p className="text-xs text-muted">
              {isCurrentSolved
                ? 'Etapa completada. Puedes avanzar o repasar.'
                : 'Ya has abierto las tres pistas de esta etapa.'}
            </p>
          )}
        </div>

        <div className="mt-4 border-t border-line pt-3 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-brick transition-colors whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reiniciar partida</span>
          </button>
        </div>
      </section>
    </aside>
  );
}
