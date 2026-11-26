import { useState } from 'react';
import { ScallopShellIcon } from './ShellIcons';

interface StageIllustrationProps {
  src: string;
  alt: string;
  caption?: string;
  aspectClass?: string;
  fillHeight?: boolean;
}

export function StageIllustration({
  src,
  alt,
  caption,
  aspectClass = 'aspect-[16/9]',
  fillHeight = false,
}: StageIllustrationProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={`overflow-hidden rounded-xl border border-line bg-paper ${
        fillHeight ? 'h-full flex flex-col' : ''
      }`}
    >
      <div
        className={`relative w-full overflow-hidden bg-surface-subtle ${
          fillHeight ? 'flex-1 min-h-[280px]' : aspectClass
        }`}
      >
        {!failed ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#F1F5F9] via-[#FBF9F5] to-[#FEF3C7]/40 p-6 text-center text-muted">
            <ScallopShellIcon className="h-10 w-10 text-camino" />
            <p className="max-w-sm text-sm font-medium text-ink">{alt}</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="border-t border-line bg-white px-4 py-2.5 text-xs text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
