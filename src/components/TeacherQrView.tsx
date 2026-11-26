import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Printer,
  Copy,
  Check,
  Maximize2,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  Info,
  QrCode,
} from 'lucide-react';
import { SHARED_APP_URL, STAGES, STAGE_ORDER } from '../data/escapeRoomData';
import { ScallopShellIcon } from './ShellIcons';

interface TeacherQrViewProps {
  onResetGame: () => void;
}

const QR_URL_STORAGE_KEY = 'rumbo_a_santiago_qr_url_v1';

function detectEnvironment(): { isPrivatePreview: boolean; liveUrl: string } {
  if (typeof window === 'undefined') {
    return { isPrivatePreview: true, liveUrl: '' };
  }
  const { hostname, origin, pathname } = window.location;
  const isPrivatePreview =
    hostname.includes('ais-dev-') ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1';

  if (isPrivatePreview) {
    return { isPrivatePreview: true, liveUrl: '' };
  }

  return {
    isPrivatePreview: false,
    liveUrl: `${origin}${pathname}`,
  };
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function TeacherQrView({ onResetGame }: TeacherQrViewProps) {
  const env = detectEnvironment();

  const [targetUrl, setTargetUrl] = useState<string>(() => {
    if (!env.isPrivatePreview) return env.liveUrl;
    try {
      return localStorage.getItem(QR_URL_STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });

  const [qrSvg, setQrSvg] = useState<string>('');
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [projectorOpen, setProjectorOpen] = useState(false);
  const [solutionsUnlocked, setSolutionsUnlocked] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const trimmedUrl = targetUrl.trim();
  const hasValidUrl = isValidHttpUrl(trimmedUrl);

  useEffect(() => {
    if (!env.isPrivatePreview) return;
    try {
      if (trimmedUrl) {
        localStorage.setItem(QR_URL_STORAGE_KEY, trimmedUrl);
      } else {
        localStorage.removeItem(QR_URL_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [env.isPrivatePreview, trimmedUrl]);

  useEffect(() => {
    let active = true;

    if (!hasValidUrl) {
      setQrSvg('');
      setQrPngUrl('');
      return () => {
        active = false;
      };
    }

    const generate = async () => {
      try {
        const [svg, png] = await Promise.all([
          QRCode.toString(trimmedUrl, {
            type: 'svg',
            width: 320,
            margin: 2,
            errorCorrectionLevel: 'M',
            color: {
              dark: '#1E293B',
              light: '#FFFFFF',
            },
          }),
          QRCode.toDataURL(trimmedUrl, {
            width: 1024,
            margin: 2,
            errorCorrectionLevel: 'M',
            color: {
              dark: '#1E293B',
              light: '#FFFFFF',
            },
          }),
        ]);

        if (active) {
          setQrSvg(svg);
          setQrPngUrl(png);
        }
      } catch {
        if (active) {
          setQrSvg('');
          setQrPngUrl('');
        }
      }
    };

    generate();
    return () => {
      active = false;
    };
  }, [trimmedUrl, hasValidUrl]);

  const handleCopy = async () => {
    if (!hasValidUrl) return;
    try {
      await navigator.clipboard.writeText(trimmedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be blocked inside iframe
    }
  };

  const handleDownloadPng = () => {
    if (!qrPngUrl) return;
    const link = document.createElement('a');
    link.href = qrPngUrl;
    link.download = 'qr-rumbo-a-santiago.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    onResetGame();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 2500);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="no-print space-y-1.5 border-b border-line pb-5">
        <p className="text-xs font-medium text-muted">
          Bereich für Lehrkräfte · Kostenloses Hosting & QR-Code · ¡Vamos! ¡Adelante! 3, Unidad 3
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          QR-Code für den Unterricht & Lösungen
        </h1>
      </div>

      {/* Main QR Code + Free Hosting Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Printable QR Card */}
        <section className="print-card lg:col-span-5 rounded-2xl border border-line bg-white p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-camino/40 bg-camino-soft/50 text-camino">
            <ScallopShellIcon className="h-5 w-5" />
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold text-ink">
            ¡Rumbo a Santiago!
          </h2>
          <p className="mt-1 text-xs text-muted">
            Escape Room · Galicia y el Camino de Santiago · Español A2
          </p>

          <div className="mx-auto mt-5 flex aspect-square max-w-[260px] items-center justify-center rounded-xl border border-line bg-white p-4">
            {hasValidUrl && qrSvg ? (
              <div
                className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
                aria-label={`QR-Code zur Webseite ${trimmedUrl}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2.5 text-center px-2">
                <QrCode className="h-10 w-10 text-slate-300" />
                <p className="text-xs font-semibold text-ink">
                  Noch keine öffentliche URL aktiv
                </p>
                <p className="text-[11px] leading-relaxed text-muted">
                  Trage rechts deine kostenlose Netlify- oder GitHub-Pages-Adresse ein – oder
                  öffne die Seite direkt nach dem Hochladen, dann erscheint der QR-Code
                  automatisch.
                </p>
              </div>
            )}
          </div>

          {hasValidUrl && (
            <>
              <p className="mt-4 break-all font-mono text-[11px] text-muted">
                {trimmedUrl}
              </p>
              <p className="mt-3 text-xs text-muted">
                Scanne den Code mit Tablet oder Smartphone – kein Login nötig.
              </p>
            </>
          )}

          <div className="no-print mt-5 flex flex-wrap items-center justify-center gap-2 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => setProjectorOpen(true)}
              disabled={!hasValidUrl}
              className="inline-flex items-center gap-1.5 rounded-lg bg-atlantic px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-atlantic-dark disabled:opacity-45 whitespace-nowrap"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Groß für Beamer</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={!qrPngUrl}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-surface-subtle disabled:opacity-45 whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" />
              <span>PNG laden</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!hasValidUrl}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-surface-subtle disabled:opacity-45 whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Drucken</span>
            </button>
          </div>
        </section>

        {/* Link Configuration & Free Static Hosting Guide */}
        <section className="no-print lg:col-span-7 space-y-6 rounded-2xl border border-line bg-white p-6">
          {/* Status Banner (Neutral hairline, icon + text — never hue-only) */}
          {env.isPrivatePreview ? (
            <div className="flex items-start gap-3 rounded-xl border border-camino/35 bg-camino-soft/35 p-4 text-xs leading-relaxed text-ink">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-camino" />
              <div className="space-y-1">
                <p className="font-semibold text-ink">
                  Vorschau-Modus erkannt (noch nicht öffentlich erreichbar)
                </p>
                <p className="text-muted">
                  Die Editor-Vorschau läuft privat in deinem Browser. Sobald du das Projekt
                  kostenlos bei <strong>Netlify</strong>, <strong>GitHub Pages</strong> oder{' '}
                  <strong>Cloudflare Pages</strong> veröffentlichst und dort öffnest, erzeugt
                  diese Seite automatisch den scanbaren QR-Code ohne 404-Fehler.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-xl border border-galicia/35 bg-galicia-soft/45 p-4 text-xs leading-relaxed text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-galicia" />
              <div className="space-y-1">
                <p className="font-semibold text-galicia">
                  Öffentliche Live-Adresse erkannt
                </p>
                <p className="text-muted">
                  Der QR-Code links verweist automatisch auf diese gehostete Webseite und kann
                  sofort von der Klasse gescannt werden.
                </p>
              </div>
            </div>
          )}

          {/* URL Input */}
          <div className="space-y-2.5">
            <label htmlFor="qr-url-input" className="block text-xs font-semibold text-ink">
              Öffentliche Webadresse für den QR-Code
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="qr-url-input"
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://mein-escaperoom.netlify.app"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs text-ink focus:border-atlantic focus:outline-none focus:ring-2 focus:ring-atlantic/20"
              />
              <button
                type="button"
                onClick={handleCopy}
                disabled={!hasValidUrl}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-surface-subtle disabled:opacity-45 whitespace-nowrap shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-galicia" />
                    <span>Kopiert</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Link kopieren</span>
                  </>
                )}
              </button>
            </div>

            {trimmedUrl.length > 0 && !hasValidUrl && (
              <p className="text-xs font-medium text-brick">
                Bitte gib eine vollständige Adresse mit https:// ein (z. B.
                https://dein-name.github.io/camino-a2/).
              </p>
            )}

            {env.isPrivatePreview && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-xs text-muted">
                <span>Du nutzt stattdessen den Teilen-Button oben rechts?</span>
                <button
                  type="button"
                  onClick={() => setTargetUrl(SHARED_APP_URL)}
                  className="font-semibold text-atlantic hover:underline"
                >
                  Share-Link hier einsetzen
                </button>
              </div>
            )}
          </div>

          {/* 3-Step Free Static Hosting Guide */}
          <div className="border-t border-line pt-5 space-y-3">
            <h3 className="text-sm font-semibold text-ink">
              In 3 Schritten dauerhaft kostenlos online (kompatibel mit allen Gratis-Hostern)
            </h3>
            <ol className="space-y-2.5 text-sm text-muted list-decimal pl-5">
              <li>
                <strong className="text-ink">Projekt herunterladen oder zu GitHub exportieren:</strong>{' '}
                Alle Bilder und Skripte nutzen relative Dateipfade – sie funktionieren auf
                Hauptdomains und auf GitHub-Pages-Unterpfaden ohne 404.
              </li>
              <li>
                <strong className="text-ink">Kostenlos veröffentlichen (0 €):</strong> Verbinde das
                Repository kostenlos mit <strong>Netlify</strong>,{' '}
                <strong>Cloudflare Pages</strong> oder aktiviere{' '}
                <strong>GitHub Pages</strong> (Build-Befehl:{' '}
                <code className="font-mono text-xs text-ink">npm run build</code>,
                Ausgabeordner: <code className="font-mono text-xs text-ink">dist</code>).
              </li>
              <li>
                <strong className="text-ink">QR-Code nutzen:</strong> Öffne die fertige Seite – der
                QR-Code links stellt sich automatisch auf deine Live-Adresse ein und kann direkt
                projiziert oder als PNG heruntergeladen werden.
              </li>
            </ol>
          </div>
        </section>
      </div>

      {/* Protected Teacher Solutions */}
      <section className="no-print rounded-2xl border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-semibold text-ink">
              Lösungsübersicht & Didaktik (Lehrkraft)
            </h2>
            <p className="text-xs text-muted">
              Standardmäßig ausgeblendet, damit Lernende im Raum keine Lösungen sehen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setSolutionsUnlocked((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-surface-subtle whitespace-nowrap"
            >
              {solutionsUnlocked ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Lösungen ausblenden</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>Lösungen anzeigen</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-brick hover:text-brick whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{resetConfirmed ? 'Zurückgesetzt ✓' : 'Gerät für neue Klasse leeren'}</span>
            </button>
          </div>
        </div>

        {solutionsUnlocked && (
          <div className="mt-6 divide-y divide-line border-t border-line">
            {STAGE_ORDER.map((id) => {
              const stage = STAGES[id];
              return (
                <div
                  key={id}
                  className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:gap-4"
                >
                  <div className="sm:col-span-3">
                    <p className="text-sm font-semibold text-ink">{stage.title}</p>
                    <p className="text-xs text-muted">{stage.location}</p>
                  </div>
                  <div className="sm:col-span-5 text-sm font-medium text-ink">
                    {stage.teacherSolution}
                  </div>
                  <div className="sm:col-span-4 text-xs text-muted">
                    {stage.teacherFocus}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Fullscreen Beamer Projector Modal */}
      {projectorOpen && hasValidUrl && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="QR-Code Großansicht für Beamer"
          onClick={() => setProjectorOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setProjectorOpen(false)}
              aria-label="Großansicht schließen"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-line text-muted hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-xs font-medium text-muted">
              Escape Room · Español A2 · Galicia y el Camino
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
              ¡Rumbo a Santiago!
            </h2>

            <div className="mx-auto mt-6 flex aspect-square max-w-[360px] items-center justify-center rounded-xl border border-line bg-white p-4">
              {qrSvg && (
                <div
                  className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              )}
            </div>

            <p className="mt-4 break-all font-mono text-xs text-muted">{trimmedUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
}
