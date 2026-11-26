import { Printer, RotateCcw, ArrowLeft } from 'lucide-react';
import { STAGES, STAGE_ORDER } from '../data/escapeRoomData';
import { formatDuration } from '../utils/text';
import { ScallopShellIcon, StampEmblem } from './ShellIcons';

interface CompostelaCertificateProps {
  teamName: string;
  elapsedSeconds: number;
  totalHintsUsed: number;
  onUpdateTeamName: (name: string) => void;
  onBackToStages: () => void;
  onRestart: () => void;
}

export function CompostelaCertificate({
  teamName,
  elapsedSeconds,
  totalHintsUsed,
  onUpdateTeamName,
  onBackToStages,
  onRestart,
}: CompostelaCertificateProps) {
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToStages}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a las etapas</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-atlantic px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-atlantic-dark whitespace-nowrap"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir Compostela</span>
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-subtle whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Jugar otra vez</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate */}
      <article className="print-card rounded-2xl border border-slate-300 bg-paper p-6 sm:p-10">
        <div className="rounded-xl border border-line bg-white p-6 sm:p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-camino/40 bg-camino-soft/50 text-camino">
            <ScallopShellIcon className="h-8 w-8" />
          </div>

          <p className="mt-5 text-xs font-medium text-muted">
            Oficina del Peregrino · Santiago de Compostela · Nivel A2
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Certificado de la Compostela
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Por haber completado las cuatro etapas del escape room sobre Galicia y el
            Camino de Santiago y haber reunido los cuatro sellos oficiales de la
            Credencial.
          </p>

          <div className="mx-auto mt-7 max-w-md border-y border-line py-5">
            <p className="text-xs text-muted">Otorgado a</p>
            <p className="mt-1 font-display text-2xl font-semibold text-atlantic sm:text-3xl">
              {teamName.trim() || 'Equipo Peregrino'}
            </p>
          </div>

          {/* 4 Collected Stamps */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STAGE_ORDER.map((id) => {
              const stage = STAGES[id];
              return (
                <div
                  key={id}
                  className="flex flex-col items-center rounded-lg border border-galicia/30 bg-galicia-soft/30 px-3 py-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-galicia/50 bg-white text-galicia">
                    <StampEmblem stageId={id} className="h-6 w-6" />
                  </div>
                  <p className="mt-2.5 text-xs font-semibold text-ink">
                    {stage.stampName}
                  </p>
                  <p className="text-[11px] text-muted">{stage.stampPlace}</p>
                </div>
              );
            })}
          </div>

          {/* Metrics Row */}
          <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-line pt-6 text-left sm:grid-cols-3 sm:text-center">
            <div>
              <dt className="text-xs text-muted">Tiempo total</dt>
              <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink">
                {formatDuration(elapsedSeconds)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Pistas utilizadas</dt>
              <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink">
                {totalHintsUsed} / 12
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Fecha</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{formattedDate}</dd>
            </div>
          </dl>

          <p className="mt-7 font-display text-base italic text-camino">
            ¡Buen Camino!
          </p>
        </div>
      </article>

      {/* Optional team name update before printing */}
      <div className="no-print rounded-xl border border-line bg-white p-5">
        <label
          htmlFor="certificate-name"
          className="block text-sm font-semibold text-ink"
        >
          ¿Quieres personalizar el nombre antes de imprimir?
        </label>
        <input
          id="certificate-name"
          type="text"
          value={teamName}
          onChange={(e) => onUpdateTeamName(e.target.value)}
          placeholder="Ej. Ana y Lukas · Clase 9b"
          className="mt-2.5 w-full max-w-md rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-ink focus:border-atlantic focus:outline-none focus:ring-2 focus:ring-atlantic/20"
        />
      </div>
    </div>
  );
}
