import type { StageId } from '../data/escapeRoomData';

export function ScallopShellIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 26L6 14C6 8.5 10.5 5 16 5C21.5 5 26 8.5 26 14L16 26Z" />
      <path d="M16 26V5.5" />
      <path d="M16 26L11 7" />
      <path d="M16 26L21 7" />
      <path d="M16 26L8 10.5" />
      <path d="M16 26L24 10.5" />
      <path d="M12.5 26.5H19.5" />
    </svg>
  );
}

export function CaminoArrowIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 16H26" />
      <path d="M19 9L26 16L19 23" />
    </svg>
  );
}

export function HorreoIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 12L16 6L26 12" />
      <rect x="8" y="12" width="16" height="9" rx="0.5" />
      <path d="M12 12V21M16 12V21M20 12V21" />
      <path d="M10 21V26M22 21V26M7 26H13M19 26H25" />
      <path d="M16 3V6M14.5 4.5H17.5" />
    </svg>
  );
}

export function CathedralIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 26H27" />
      <path d="M7 26V13L9.5 7L12 13V26" />
      <path d="M20 26V13L22.5 7L25 13V26" />
      <path d="M12 26V15L16 11L20 15V26" />
      <path d="M14.5 26V21.5C14.5 20.4 15.2 19.5 16 19.5C16.8 19.5 17.5 20.4 17.5 21.5V26" />
      <path d="M9.5 4.5V7M22.5 4.5V7" />
    </svg>
  );
}

export function StampEmblem({
  stageId,
  className = 'w-7 h-7',
}: {
  stageId: StageId;
  className?: string;
}) {
  if (stageId === 1) return <ScallopShellIcon className={className} />;
  if (stageId === 2) return <CaminoArrowIcon className={className} />;
  if (stageId === 3) return <HorreoIcon className={className} />;
  return <CathedralIcon className={className} />;
}
