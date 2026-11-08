// 참고: Tailwind의 기본 리셋(Preflight)은 <p>의 기본 여백(1em)을 없애므로, 원래 디자인에서 그 여백에 기대던 곳은 mb-[1em]처럼 직접 지정합니다.
// 여러 컴포넌트에서 반복해서 쓰는 Tailwind 클래스 묶음.
// (예전 globals.css의 button / button.ghost / .tab / input / label 전역 스타일을 대신합니다.)

const buttonBase =
  'cursor-pointer rounded-[9px] font-medium transition-[translate,opacity] duration-[120ms] ease-[ease] ' +
  'enabled:hover:-translate-y-px enabled:active:translate-y-0 disabled:cursor-default disabled:opacity-60 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const buttonSizes = {
  md: 'px-[22px] py-3 text-[15px]',
  sm: 'px-3.5 py-1.5 text-[13px]',
} as const;

const buttonVariants = {
  primary: 'bg-accent text-accent-contrast shadow-card',
  ghost: 'border border-border bg-transparent text-ink',
} as const;

export function buttonClass(
  variant: keyof typeof buttonVariants = 'primary',
  size: keyof typeof buttonSizes = 'md',
  extra = '',
): string {
  return `${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]} ${extra}`.trim();
}

/** 상단 메뉴 탭과 프로필 하위 탭 */
export const tabClass =
  'flex-1 cursor-pointer select-none rounded-t-[10px] border border-b-0 border-border bg-surface-2 ' +
  'px-2 pt-3 pb-3.5 text-center font-serif text-[16px] font-medium tracking-[0.03em] text-ink-muted shadow-card ' +
  'transition-[background-color,color,translate] duration-150 ease-[ease] hover:-translate-y-px ' +
  'aria-selected:relative aria-selected:z-1 aria-selected:bg-surface aria-selected:font-normal aria-selected:text-accent ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'max-[480px]:px-1 max-[480px]:pt-2.5 max-[480px]:pb-3 max-[480px]:text-[14px]';

export const tabListClass = 'flex gap-1.5';

export const labelClass = 'mb-1.5 block text-[12.5px] uppercase tracking-[0.04em] text-ink-muted';

const controlBase = 'w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-[15px] text-ink';
export const inputClass = `${controlBase} focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent`;
export const selectClass = controlBase;

/** 입력 칸 하나(라벨 + 컨트롤) */
export const fieldClass = 'min-w-0 flex-[1_1_160px]';
export const fieldRowClass = 'mb-4 flex flex-wrap gap-3.5';
export const actionsClass = 'mt-1.5 flex flex-wrap gap-2.5';

export const hintClass = 'mt-3.5 mb-[1em] text-[13px] leading-[1.6] text-ink-muted';
export const errorClass = 'mt-3.5 mb-[1em] text-[13px] leading-[1.6] text-accent';
export const dividerClass = 'my-[26px] h-px border-0 bg-border';

/** 일간·오행 해설 같은 강조 상자 */
export const noteBoxClass = 'rounded-xl border border-border bg-surface-2 px-[18px] py-4';
