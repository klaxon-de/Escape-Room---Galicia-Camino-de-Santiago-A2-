import { useState } from 'react';
import { ArrowLeft, ArrowUp, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { STAGES, TRAIL_STEPS } from '../data/escapeRoomData';
import { StageIllustration } from './StageIllustration';
import { StampEmblem } from './ShellIcons';

interface StageFlechasProps {
  solved: boolean;
  onSolve: () => void;
  onNext: () => void;
  onSound: (type: 'click' | 'error' | 'stamp') => void;
}

const WAYPOINT_COORDS = [
  { x: 65, y: 120, label: 'Inicio' },
  { x: 185, y: 80, label: 'Puente' },
  { x: 315, y: 125, label: 'Hórreo' },
  { x: 445, y: 72, label: 'Bosque' },
  { x: 565, y: 105, label: 'Arzúa' },
];

export function StageFlechas({
  solved,
  onSolve,
  onNext,
  onSound,
}: StageFlechasProps) {
  const stage = STAGES[2];
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(
    solved ? TRAIL_STEPS.length : 0
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeStep = TRAIL_STEPS[currentStepIdx];
  const progressNodes = solved ? TRAIL_STEPS.length : currentStepIdx;

  const handleChooseDirection = (dir: 'left' | 'straight' | 'right') => {
    if (solved || !activeStep) return;

    if (dir === activeStep.correctDirection) {
      setFeedback(null);
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      if (nextIdx >= TRAIL_STEPS.length) {
        onSound('stamp');
        onSolve();
      } else {
        onSound('click');
      }
    } else {
      onSound('error');
      setFeedback(activeStep.wrongFeedback);
    }
  };

  const pilgrimPos = WAYPOINT_COORDS[Math.min(progressNodes, WAYPOINT_COORDS.length - 1)];

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
          Etapa 2 de 4 · {stage.location} · {stage.kmRemaining}
        </p>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {stage.title}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">{stage.story}</p>
      </div>

      {/* Interactive Galician Camino Trail Map */}
      <div className="rounded-xl border border-line bg-paper p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-semibold text-ink">Mapa de la etapa</h2>
          <span className="font-mono text-xs tabular-nums text-muted">
            Cruce {Math.min(progressNodes + (solved ? 0 : 1), 4)}/4
          </span>
        </div>

        <svg
          viewBox="0 0 630 175"
          className="w-full h-auto rounded-lg border border-line bg-white"
          role="img"
          aria-label="Mapa del Camino con cinco puntos desde el inicio hasta Arzúa"
        >
          {/* Subtle terrain contours */}
          <path
            d="M 0 155 Q 150 130 310 148 T 630 138 L 630 175 L 0 175 Z"
            fill="#ECFDF5"
          />
          <path
            d="M 0 42 Q 190 22 390 48 T 630 30 L 630 0 L 0 0 Z"
            fill="#F1F5F9"
          />

          {/* Base dotted path */}
          <path
            d="M 65 120 C 115 110, 140 85, 185 80 C 235 75, 270 125, 315 125 C 365 125, 395 75, 445 72 C 495 70, 520 105, 565 105"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="4"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />

          {/* Completed segments */}
          {WAYPOINT_COORDS.slice(0, progressNodes).map((pt, idx) => {
            const next = WAYPOINT_COORDS[idx + 1];
            if (!next) return null;
            return (
              <line
                key={idx}
                x1={pt.x}
                y1={pt.y}
                x2={next.x}
                y2={next.y}
                stroke="#D97706"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* Waypoint nodes */}
          {WAYPOINT_COORDS.map((pt, idx) => {
            const reached = idx <= progressNodes;
            const current = idx === progressNodes;
            return (
              <g key={pt.label}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={current ? 12 : 9}
                  fill={reached ? (idx === 4 ? '#047857' : '#D97706') : '#FFFFFF'}
                  stroke={reached ? '#FFFFFF' : '#94A3B8'}
                  strokeWidth="2.5"
                />
                {reached && (
                  <text
                    x={pt.x}
                    y={pt.y + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="#FFFFFF"
                  >
                    {idx === 4 ? '✓' : idx + 1}
                  </text>
                )}
                <text
                  x={pt.x}
                  y={pt.y + 28}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight={current ? '700' : '500'}
                  fill={current ? '#1E293B' : '#475569'}
                >
                  {pt.label}
                </text>
              </g>
            );
          })}

          {/* Active Pilgrim Marker Ring */}
          <circle
            cx={pilgrimPos.x}
            cy={pilgrimPos.y}
            r="18"
            fill="none"
            stroke={solved ? '#047857' : '#0369A1'}
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        </svg>

        {/* Active Crossroad Question */}
        {!solved && activeStep && (
          <div className="mt-5 space-y-4 border-t border-line pt-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-camino">
                Punto actual: {activeStep.landmark}
              </p>
              <p className="text-base font-medium leading-relaxed text-ink">
                {activeStep.instruction}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => handleChooseDirection('left')}
                className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-atlantic hover:bg-atlantic/[0.04] whitespace-nowrap"
              >
                <ArrowLeft className="h-4 w-4 text-camino shrink-0" />
                <span>Girar a la izquierda</span>
              </button>

              <button
                type="button"
                onClick={() => handleChooseDirection('straight')}
                className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-atlantic hover:bg-atlantic/[0.04] whitespace-nowrap"
              >
                <ArrowUp className="h-4 w-4 text-camino shrink-0" />
                <span>Seguir recto</span>
              </button>

              <button
                type="button"
                onClick={() => handleChooseDirection('right')}
                className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-atlantic hover:bg-atlantic/[0.04] whitespace-nowrap"
              >
                <ArrowRight className="h-4 w-4 text-camino shrink-0" />
                <span>Girar a la derecha</span>
              </button>
            </div>

            {feedback && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-brick/25 bg-brick-soft px-4 py-3 text-sm text-brick"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}
          </div>
        )}

        {/* Completed Steps Summary */}
        {progressNodes > 0 && !solved && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-galicia">
            {TRAIL_STEPS.slice(0, progressNodes).map((step) => (
              <span key={step.id} className="inline-flex items-center gap-1 font-medium">
                <Check className="h-3.5 w-3.5" />
                <span>{step.landmark}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Etapa Resuelta */}
      {solved && (
        <div className="space-y-4 rounded-xl border border-galicia/30 bg-galicia-soft/50 p-5">
          <div className="flex items-start gap-3.5">
            <div className="animate-stamp flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-galicia/50 bg-white text-galicia">
              <StampEmblem stageId={2} className="h-6 w-6" />
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
              <span>Ir a la Etapa 3</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
