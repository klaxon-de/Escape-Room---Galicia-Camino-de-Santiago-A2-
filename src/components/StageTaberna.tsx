import { useState, type FormEvent } from 'react';
import { Check, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import {
  DIARY_BLANKS,
  STAGES,
  TABERNA_SECRET_WORD,
} from '../data/escapeRoomData';
import { normalizeSpanish } from '../utils/text';
import { StageIllustration } from './StageIllustration';
import { StampEmblem } from './ShellIcons';

interface StageTabernaProps {
  solved: boolean;
  onSolve: () => void;
  onNext: () => void;
  onSound: (type: 'click' | 'error' | 'stamp') => void;
}

export function StageTaberna({
  solved,
  onSolve,
  onNext,
  onSound,
}: StageTabernaProps) {
  const stage = STAGES[3];
  const [answers, setAnswers] = useState<Record<number, string>>(
    solved
      ? { 1: 'pulpo', 2: 'ayer', 3: 'Santiago', 4: 'océano' }
      : {}
  );
  const [blankErrors, setBlankErrors] = useState<Record<number, boolean>>({});
  const [wordInput, setWordInput] = useState<string>(
    solved ? TABERNA_SECRET_WORD : ''
  );
  const [wordError, setWordError] = useState<string | null>(null);

  const allBlanksCorrect = DIARY_BLANKS.every(
    (b) => answers[b.id] === b.correctWord
  );

  const handleSelectOption = (blankId: number, option: string, correctWord: string) => {
    if (solved) return;
    if (option === correctWord) {
      onSound('click');
      setAnswers((prev) => ({ ...prev, [blankId]: option }));
      setBlankErrors((prev) => ({ ...prev, [blankId]: false }));
    } else {
      onSound('error');
      setBlankErrors((prev) => ({ ...prev, [blankId]: true }));
    }
  };

  const handleWordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (normalizeSpanish(wordInput) === normalizeSpanish(TABERNA_SECRET_WORD)) {
      setWordError(null);
      onSound('stamp');
      onSolve();
    } else {
      onSound('error');
      setWordError(
        'Esa no es la palabra secreta. Junta la primera letra de cada una de las 4 palabras correctas del diario.'
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
          Etapa 3 de 4 · {stage.location} · {stage.kmRemaining}
        </p>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {stage.title}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">{stage.story}</p>
      </div>

      {/* Diario de viaje */}
      <div className="space-y-4 rounded-xl border border-line bg-paper p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-ink">
            Paso 1 · Completa el diario de viaje de Sofía
          </h2>
          <span className="font-mono text-xs tabular-nums text-muted">
            {DIARY_BLANKS.filter((b) => answers[b.id] === b.correctWord).length}/4
            completadas
          </span>
        </div>

        <div className="divide-y divide-line">
          {DIARY_BLANKS.map((blank) => {
            const isCorrect = answers[blank.id] === blank.correctWord;
            const hasError = blankErrors[blank.id];
            return (
              <div key={blank.id} className="py-4 first:pt-1 last:pb-1 space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-xs font-medium text-muted">
                    Frase {blank.id} · {blank.grammarCue}
                  </span>
                  {isCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-galicia">
                      <Check className="h-3.5 w-3.5" />
                      <span>Letra: {blank.letter}</span>
                    </span>
                  )}
                </div>

                <p className="text-[15px] leading-relaxed text-ink">
                  {blank.before}{' '}
                  <span
                    className={`inline-block border-b-2 px-1.5 font-semibold ${
                      isCorrect
                        ? 'border-galicia text-galicia'
                        : 'border-slate-300 text-muted'
                    }`}
                  >
                    {isCorrect ? blank.correctWord : '________'}
                  </span>{' '}
                  {blank.after}
                </p>

                {!isCorrect && (
                  <div className="flex flex-wrap gap-2">
                    {blank.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          handleSelectOption(blank.id, opt, blank.correctWord)
                        }
                        className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-atlantic hover:bg-atlantic/[0.04] whitespace-nowrap"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {hasError && !isCorrect && (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-brick">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Esa palabra no encaja aquí. Prueba otra opción.</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Palabra secreta */}
      {!solved && (
        <form
          onSubmit={handleWordSubmit}
          className="space-y-4 border-t border-line pt-6"
        >
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-ink">
              Paso 2 · Descubre la palabra secreta de 4 letras
            </h2>
            <p className="text-sm text-muted">
              Toma la <strong>primera letra</strong> de cada una de las cuatro respuestas
              correctas (1 a 4):
            </p>
          </div>

          {/* 4 Letter Slots */}
          <div className="flex items-center gap-2.5">
            {DIARY_BLANKS.map((blank) => {
              const unlocked = answers[blank.id] === blank.correctWord;
              return (
                <div
                  key={blank.id}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border font-mono text-lg font-semibold ${
                    unlocked
                      ? 'border-camino bg-camino-soft/60 text-ink'
                      : 'border-dashed border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  {unlocked ? blank.letter : '?'}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-xs">
              <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                maxLength={10}
                value={wordInput}
                onChange={(e) => {
                  setWordInput(e.target.value);
                  setWordError(null);
                }}
                placeholder="Palabra de 4 letras"
                aria-label="Palabra secreta de 4 letras"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 font-mono text-base font-semibold uppercase tracking-[0.2em] text-ink focus:border-atlantic focus:outline-none focus:ring-2 focus:ring-atlantic/20"
              />
            </div>
            <button
              type="submit"
              disabled={!allBlanksCorrect && wordInput.trim().length < 4}
              className="rounded-lg bg-atlantic px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-atlantic-dark disabled:opacity-50 whitespace-nowrap"
            >
              Comprobar palabra
            </button>
          </div>

          {wordError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-brick/25 bg-brick-soft px-4 py-3 text-sm text-brick"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{wordError}</span>
            </div>
          )}
        </form>
      )}

      {/* Etapa Resuelta */}
      {solved && (
        <div className="space-y-4 rounded-xl border border-galicia/30 bg-galicia-soft/50 p-5">
          <div className="flex items-start gap-3.5">
            <div className="animate-stamp flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-galicia/50 bg-white text-galicia">
              <StampEmblem stageId={3} className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-galicia">
                ✓ Resuelto · Palabra: PASO · Sello conseguido: {stage.stampName}
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
              <span>Ir a la Etapa 4 (Meta)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
