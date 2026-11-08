import type { Element, SajuResult } from '@/lib/saju';
import { STEM_KR, STEM_HANJA, BRANCH_KR, BRANCH_HANJA, STEM_EL, BRANCH_EL, EL_LABEL, EL_ORDER } from '@/lib/saju';
import { noteBoxClass } from './ui';

// Tailwind는 클래스 이름을 소스에서 정적으로 찾아 생성하므로, 오행별 색 클래스는 문자열로 미리 나열해 둡니다.
const EL_BG: Record<Element, string> = {
  wood: 'bg-el-wood',
  fire: 'bg-el-fire',
  earth: 'bg-el-earth',
  metal: 'bg-el-metal',
  water: 'bg-el-water',
};

const pillarClass = 'overflow-hidden rounded-xl border border-border bg-bg text-center';
const pillarHeadClass = 'px-1 pt-2 pb-1.5 text-[11.5px] uppercase tracking-[0.06em] text-ink-muted';
const cellBase = 'px-1 py-3.5 font-serif leading-[1.1]';
const cellClass = `${cellBase} text-[26px] text-accent-contrast`;
const cellSmallClass = 'mt-[5px] block font-sans text-[11px] font-medium tracking-[0.02em]';

function PillarCell({ head, stem, branch }: { head: string; stem: number; branch: number }) {
  return (
    <div className={pillarClass}>
      <div className={pillarHeadClass}>{head}</div>
      <div className={`${cellClass} ${EL_BG[STEM_EL[stem]]}`}>
        {STEM_HANJA[stem]}
        <small className={cellSmallClass}>{STEM_KR[stem]}</small>
      </div>
      <div className={`${cellClass} ${EL_BG[BRANCH_EL[branch]]} brightness-[0.92]`}>
        {BRANCH_HANJA[branch]}
        <small className={cellSmallClass}>{BRANCH_KR[branch]}</small>
      </div>
    </div>
  );
}

export default function SajuResultView({ result }: { result: SajuResult }) {
  const { pillars, elementCounts, elementalInsight, daymasterText } = result;
  const total = EL_ORDER.reduce((s, k) => s + elementCounts[k], 0);

  return (
    <div>
      <h2 className="mb-1 text-[20px]">
        {result.name ? `${result.name}님의 사주팔자` : '사주팔자'}
      </h2>

      <div className="mt-[18px] grid grid-cols-4 gap-2.5 max-[480px]:grid-cols-2">
        <PillarCell head="년주" stem={pillars.year.stem} branch={pillars.year.branch} />
        <PillarCell head="월주" stem={pillars.month.stem} branch={pillars.month.branch} />
        <PillarCell head="일주" stem={pillars.day.stem} branch={pillars.day.branch} />
        {pillars.hour ? (
          <PillarCell head="시주" stem={pillars.hour.stem} branch={pillars.hour.branch} />
        ) : (
          <div className={pillarClass}>
            <div className={pillarHeadClass}>시주</div>
            {/* 시간 모름: 오행 색 배경이 없으므로 글자를 흐린 본문색으로 표시해요 (라이트/다크 모두 잘 보이게). */}
            <div className={`${cellBase} text-[26px] text-ink-muted`}>?</div>
            <div className={`${cellBase} bg-surface-2 text-[14px] text-ink-muted`}>시간 모름</div>
          </div>
        )}
      </div>

      <div className={`${noteBoxClass} mt-5`}>
        <h3 className="mb-1.5 text-[16px] text-accent">
          일간(日干) · {STEM_KR[pillars.day.stem]}
          {STEM_HANJA[pillars.day.stem]} ({EL_LABEL[STEM_EL[pillars.day.stem]]})
        </h3>
        <p className="text-[14.5px]">{daymasterText}</p>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        {EL_ORDER.map((k) => {
          const pct = total ? Math.round((elementCounts[k] / total) * 100) : 0;
          return (
            <div className="grid grid-cols-[56px_1fr_26px] items-center gap-2.5 text-[13.5px]" key={k}>
              <span>{EL_LABEL[k]}</span>
              <div className="h-[9px] overflow-hidden rounded-[5px] bg-surface-2">
                <div className={`h-full rounded-[5px] ${EL_BG[k]}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-right tabular-nums text-ink-muted">{elementCounts[k]}</span>
            </div>
          );
        })}
      </div>

      <div className={`${noteBoxClass} mt-4`}>
        <h3 className="mb-1.5 text-[16px] text-accent">오행(五行) 균형 해설</h3>
        <p className="text-[14.5px]">
          사주 여덟 글자 중 {elementalInsight.strongLabel} 기운이 가장 많이 나타나요. {elementalInsight.strongText}
        </p>
        {elementalInsight.balanced ? (
          <p className="mt-2.5 text-[14.5px]">
            다섯 가지 오행이 고루 섞여 있어 어느 한쪽으로 치우치지 않는 균형 잡힌 사주예요. 상황에 따라 여러
            기운을 유연하게 꺼내 쓸 수 있는 것이 큰 장점이에요.
          </p>
        ) : (
          <p className="mt-2.5 text-[14.5px]">
            {elementalInsight.weakLabel} 기운은 사주 원국에 드러나지 않아요. {elementalInsight.weakText}
          </p>
        )}
      </div>
    </div>
  );
}
