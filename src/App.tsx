import { useEffect, useState } from 'react';
import { ArrowRight, Check, QrCode } from 'lucide-react';
import {
  HERO_IMAGE,
  STAGES,
  STAGE_ORDER,
  type StageId,
} from './data/escapeRoomData';
import { playTone } from './utils/audio';
import { StageIllustration } from './components/StageIllustration';
import { CredencialSidebar } from './components/CredencialSidebar';
import { StageAlbergue } from './components/StageAlbergue';
import { StageFlechas } from './components/StageFlechas';
import { StageTaberna } from './components/StageTaberna';
import { StageOficina } from './components/StageOficina';
import { CompostelaCertificate } from './components/CompostelaCertificate';
import { GlosarioView } from './components/GlosarioView';
import { TeacherQrView } from './components/TeacherQrView';
import { StampEmblem } from './components/ShellIcons';

type AppView = 'inicio' | 'jugar' | 'victoria' | 'glosario' | 'docentes';

interface PersistedState {
  teamName: string;
  activeStage: StageId;
  solvedStages: StageId[];
  hintsRevealed: Record<StageId, number>;
  elapsedSeconds: number;
  soundEnabled: boolean;
}

const STORAGE_KEY = 'rumbo_a_santiago_a2_v1';

const INITIAL_STATE: PersistedState = {
  teamName: '',
  activeStage: 1,
  solvedStages: [],
  hintsRevealed: { 1: 0, 2: 0, 3: 0, 4: 0 },
  elapsedSeconds: 0,
  soundEnabled: true,
};

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      teamName: typeof parsed.teamName === 'string' ? parsed.teamName : '',
      activeStage:
        parsed.activeStage && [1, 2, 3, 4].includes(parsed.activeStage)
          ? parsed.activeStage
          : 1,
      solvedStages: Array.isArray(parsed.solvedStages)
        ? (parsed.solvedStages.filter((n) => [1, 2, 3, 4].includes(n)) as StageId[])
        : [],
      hintsRevealed: {
        1: parsed.hintsRevealed?.[1] ?? 0,
        2: parsed.hintsRevealed?.[2] ?? 0,
        3: parsed.hintsRevealed?.[3] ?? 0,
        4: parsed.hintsRevealed?.[4] ?? 0,
      },
      elapsedSeconds:
        typeof parsed.elapsedSeconds === 'number' && parsed.elapsedSeconds >= 0
          ? parsed.elapsedSeconds
          : 0,
      soundEnabled:
        typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
    };
  } catch {
    return INITIAL_STATE;
  }
}

export default function App() {
  const [state, setState] = useState<PersistedState>(() => loadState());
  const [view, setView] = useState<AppView>('inicio');
  const [timerPaused, setTimerPaused] = useState(false);

  const allSolved = state.solvedStages.length === STAGE_ORDER.length;
  const hasProgress = state.solvedStages.length > 0 || state.elapsedSeconds > 0;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // Run classroom timer only during active gameplay and before completion
  useEffect(() => {
    if (view !== 'jugar' || timerPaused || allSolved) return;
    const interval = window.setInterval(() => {
      setState((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [view, timerPaused, allSolved]);

  const handleSound = (type: 'click' | 'error' | 'stamp' | 'victory') => {
    playTone(type, state.soundEnabled);
  };

  const handleSolveStage = (stageId: StageId) => {
    setState((prev) => {
      if (prev.solvedStages.includes(stageId)) return prev;
      return {
        ...prev,
        solvedStages: [...prev.solvedStages, stageId].sort((a, b) => a - b) as StageId[],
      };
    });
  };

  const handleSelectStage = (stageId: StageId) => {
    handleSound('click');
    setState((prev) => ({ ...prev, activeStage: stageId }));
    setView('jugar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRevealHint = (stageId: StageId) => {
    handleSound('click');
    setState((prev) => ({
      ...prev,
      hintsRevealed: {
        ...prev.hintsRevealed,
        [stageId]: Math.min(3, (prev.hintsRevealed[stageId] ?? 0) + 1),
      },
    }));
  };

  const handleReset = () => {
    setState({ ...INITIAL_STATE, soundEnabled: state.soundEnabled });
    setTimerPaused(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    if (view === 'victoria' || view === 'jugar') {
      setView('inicio');
    }
  };

  const handleStartGame = () => {
    handleSound('click');
    setTimerPaused(false);
    setView('jugar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalHintsUsed =
    state.hintsRevealed[1] +
    state.hintsRevealed[2] +
    state.hintsRevealed[3] +
    state.hintsRevealed[4];

  const primaryHeaderAction = () => {
    if (allSolved && view !== 'victoria') {
      return { label: 'Ver Compostela', onClick: () => setView('victoria') };
    }
    if (view === 'jugar') {
      return { label: 'QR de clase', onClick: () => setView('docentes') };
    }
    return {
      label: hasProgress ? 'Continuar' : 'Comenzar',
      onClick: handleStartGame,
    };
  };

  const cta = primaryHeaderAction();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
          {/* Zone 1: Single-element display wordmark */}
          <button
            type="button"
            onClick={() => setView('inicio')}
            className="font-display text-lg font-semibold tracking-tight text-ink hover:text-atlantic transition-colors whitespace-nowrap shrink-0"
          >
            ¡Rumbo a Santiago!
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {(
              [
                { id: 'inicio', label: 'Inicio' },
                { id: 'jugar', label: 'Etapas' },
                { id: 'glosario', label: 'Glosario A2' },
                { id: 'docentes', label: 'QR & Docentes' },
              ] as const
            ).map((item) => {
              const active =
                view === item.id || (item.id === 'jugar' && view === 'victoria');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    active
                      ? 'border-atlantic text-ink'
                      : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={cta.onClick}
              className="rounded-lg bg-atlantic px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-atlantic-dark whitespace-nowrap shrink-0"
            >
              {cta.label}
            </button>
          </div>
        </div>

        {/* Compact mobile navigation row */}
        <nav
          aria-label="Navegación móvil"
          className="flex md:hidden items-center gap-5 overflow-x-auto border-t border-line px-4 py-2 text-xs font-medium"
        >
          {(
            [
              { id: 'inicio', label: 'Inicio' },
              { id: 'jugar', label: 'Etapas' },
              { id: 'glosario', label: 'Glosario A2' },
              { id: 'docentes', label: 'QR & Docentes' },
            ] as const
          ).map((item) => {
            const active =
              view === item.id || (item.id === 'jugar' && view === 'victoria');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={`py-0.5 whitespace-nowrap shrink-0 border-b-2 ${
                  active
                    ? 'border-atlantic text-ink font-semibold'
                    : 'border-transparent text-muted'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {view === 'inicio' && (
          <div className="space-y-12">
            {/* Hero 2-column balanced split */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <p className="text-xs font-medium text-muted">
                  Español A2 · Galicia y el Camino de Santiago · 4 etapas · 15–25 min
                </p>

                <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl leading-[1.12]">
                  El misterio de la Credencial perdida
                </h1>

                <p className="max-w-xl text-base leading-relaxed text-muted">
                  Estás a punto de llegar a Santiago de Compostela, pero tu pasaporte del
                  peregrino ha desaparecido. Sigue las pistas de Sofía por Galicia,
                  consigue los cuatro sellos en las etapas del Camino y abre la Oficina
                  del Peregrino para recibir tu Compostela.
                </p>

                <div className="max-w-md space-y-3 pt-1">
                  <label
                    htmlFor="team-name-input"
                    className="block text-xs font-semibold text-ink"
                  >
                    Tu nombre o nombre del equipo (para la Compostela)
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="team-name-input"
                      type="text"
                      value={state.teamName}
                      onChange={(e) =>
                        setState((prev) => ({ ...prev, teamName: e.target.value }))
                      }
                      placeholder="Ej. Elena y Max"
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink focus:border-atlantic focus:outline-none focus:ring-2 focus:ring-atlantic/20"
                    />
                    <button
                      type="button"
                      onClick={handleStartGame}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-atlantic px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-atlantic-dark whitespace-nowrap shrink-0"
                    >
                      <span>{hasProgress ? 'Continuar el Camino' : 'Comenzar el Camino'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs text-muted">
                  <span>Sin registro ni cuenta</span>
                  <span aria-hidden="true">·</span>
                  <span>Pistas paso a paso y Glosario A2</span>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => setView('docentes')}
                    className="inline-flex items-center gap-1 font-semibold text-atlantic hover:underline"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    <span>Código QR para clase</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <StageIllustration
                  src={HERO_IMAGE.src}
                  alt={HERO_IMAGE.alt}
                  fillHeight
                />
              </div>
            </section>

            {/* Full-width 4-Stage Overview Strip */}
            <section className="space-y-4 border-t border-line pt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-2xl font-semibold text-ink">
                  Las cuatro etapas del recorrido
                </h2>
                <p className="text-xs text-muted">
                  Haz clic en cualquier etapa para empezar o continuar
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {STAGE_ORDER.map((id) => {
                  const stage = STAGES[id];
                  const solved = state.solvedStages.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleSelectStage(id)}
                      className="group flex flex-col justify-between rounded-xl border border-line bg-white p-5 text-left transition-colors hover:border-atlantic"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs tabular-nums text-muted">
                            Etapa {id}
                          </span>
                          {solved ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-galicia">
                              <Check className="h-3.5 w-3.5" />
                              <span>Resuelto</span>
                            </span>
                          ) : (
                            <span className="text-xs text-muted">{stage.kmRemaining}</span>
                          )}
                        </div>

                        <div
                          className={`mt-4 flex h-10 w-10 items-center justify-center rounded-full border ${
                            solved
                              ? 'border-galicia/40 bg-galicia-soft/50 text-galicia'
                              : 'border-line bg-paper text-camino group-hover:border-atlantic/40'
                          }`}
                        >
                          <StampEmblem stageId={id} className="h-5 w-5" />
                        </div>

                        <h3 className="mt-3.5 font-display text-base font-semibold text-ink group-hover:text-atlantic transition-colors">
                          {stage.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted">{stage.location}</p>
                      </div>

                      <p className="mt-4 border-t border-line pt-3 text-xs font-medium text-muted">
                        Sello: <span className="text-ink">{stage.stampName}</span>
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {view === 'jugar' && (
          <div className="space-y-6">
            {/* Clean Stage Stepper */}
            <div
              role="tablist"
              aria-label="Etapas del escape room"
              className="flex flex-wrap items-center gap-1.5 rounded-xl bg-surface-subtle p-1.5"
            >
              {STAGE_ORDER.map((id) => {
                const stage = STAGES[id];
                const isActive = state.activeStage === id;
                const isSolved = state.solvedStages.includes(id);
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => handleSelectStage(id)}
                    className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-ink shadow-xs'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <span className="font-mono tabular-nums">0{id}.</span>
                    <span>{stage.shortTitle}</span>
                    {isSolved && <Check className="h-3.5 w-3.5 text-galicia shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Two-Zone Sandbox Layout: Stage (65-70%) + Credencial & Hints (30-35%) */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
              <section className="lg:col-span-8 rounded-2xl border border-line bg-white p-5 sm:p-8">
                {state.activeStage === 1 && (
                  <StageAlbergue
                    key={`s1-${state.solvedStages.includes(1)}`}
                    solved={state.solvedStages.includes(1)}
                    onSolve={() => handleSolveStage(1)}
                    onNext={() => handleSelectStage(2)}
                    onSound={handleSound}
                  />
                )}
                {state.activeStage === 2 && (
                  <StageFlechas
                    key={`s2-${state.solvedStages.includes(2)}`}
                    solved={state.solvedStages.includes(2)}
                    onSolve={() => handleSolveStage(2)}
                    onNext={() => handleSelectStage(3)}
                    onSound={handleSound}
                  />
                )}
                {state.activeStage === 3 && (
                  <StageTaberna
                    key={`s3-${state.solvedStages.includes(3)}`}
                    solved={state.solvedStages.includes(3)}
                    onSolve={() => handleSolveStage(3)}
                    onNext={() => handleSelectStage(4)}
                    onSound={handleSound}
                  />
                )}
                {state.activeStage === 4 && (
                  <StageOficina
                    key={`s4-${state.solvedStages.includes(4)}`}
                    solved={state.solvedStages.includes(4)}
                    onSolve={() => handleSolveStage(4)}
                    onOpenCertificate={() => {
                      setView('victoria');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onSound={handleSound}
                  />
                )}
              </section>

              <div className="lg:col-span-4 lg:sticky lg:top-20">
                <CredencialSidebar
                  teamName={state.teamName}
                  activeStage={state.activeStage}
                  solvedStages={state.solvedStages}
                  hintsRevealed={state.hintsRevealed}
                  elapsedSeconds={state.elapsedSeconds}
                  timerPaused={timerPaused}
                  soundEnabled={state.soundEnabled}
                  onSelectStage={handleSelectStage}
                  onRevealHint={handleRevealHint}
                  onToggleTimer={() => setTimerPaused((p) => !p)}
                  onToggleSound={() =>
                    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
                  }
                  onReset={handleReset}
                  onOpenCertificate={() => {
                    setView('victoria');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {view === 'victoria' && (
          <CompostelaCertificate
            teamName={state.teamName}
            elapsedSeconds={state.elapsedSeconds}
            totalHintsUsed={totalHintsUsed}
            onUpdateTeamName={(name) =>
              setState((prev) => ({ ...prev, teamName: name }))
            }
            onBackToStages={() => setView('jugar')}
            onRestart={handleReset}
          />
        )}

        {view === 'glosario' && (
          <GlosarioView onBackToGame={() => setView('jugar')} />
        )}

        {view === 'docentes' && <TeacherQrView onResetGame={handleReset} />}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs text-muted sm:px-6">
          <p>
            ¡Rumbo a Santiago! · Escape room educativo (Español A2 · Galicia y el Camino)
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setView('glosario')}
              className="hover:text-ink transition-colors"
            >
              Glosario A2
            </button>
            <button
              type="button"
              onClick={() => setView('docentes')}
              className="hover:text-ink transition-colors"
            >
              QR & Docentes
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
