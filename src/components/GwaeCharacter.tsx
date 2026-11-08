// 점괘방의 마스코트 괘돌이. 머리 위 세 줄이 ☰(건괘)를 본뜬 모양이에요.
export default function GwaeCharacter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="14" y="4" width="36" height="5" rx="2.5" fill="var(--gold)" />
      <rect x="14" y="12" width="36" height="5" rx="2.5" fill="var(--gold)" />
      <rect x="14" y="20" width="36" height="5" rx="2.5" fill="var(--gold)" />
      <rect x="8" y="28" width="48" height="32" rx="14" fill="var(--navy)" />
      <circle cx="24" cy="42" r="3.4" fill="var(--navy-contrast)" />
      <circle cx="40" cy="42" r="3.4" fill="var(--navy-contrast)" />
      <circle cx="17" cy="49" r="3" fill="var(--accent)" opacity="0.55" />
      <circle cx="47" cy="49" r="3" fill="var(--accent)" opacity="0.55" />
      <path d="M27 50 Q32 55 37 50" stroke="var(--navy-contrast)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
