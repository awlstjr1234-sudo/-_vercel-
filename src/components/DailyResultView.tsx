import type { DailyFortuneResult } from '@/lib/dailyFortune';
import { ANIMAL_KR, ANIMAL_EMOJI } from '@/lib/dailyFortune';

const luckyChipClass = 'flex-[1_1_140px] rounded-[10px] border border-border bg-bg px-3.5 py-3';
const luckyKeyClass = 'text-[11.5px] uppercase tracking-[0.05em] text-ink-muted';
const luckyValueClass = 'mt-1 font-serif text-[19px] text-gold';

export default function DailyResultView({ result }: { result: DailyFortuneResult }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2.5">
        <h2 className="text-[22px]">{result.name}님의 오늘의 운세</h2>
        <span className="text-[13.5px] tabular-nums text-ink-muted">{result.todayLabel}</span>
      </div>
      <p className="mt-3.5 text-[14px] text-gold">
        {ANIMAL_EMOJI[result.zodiacBranch]} <strong>{ANIMAL_KR[result.zodiacBranch]}띠</strong> · 오늘의
        일진과 <strong>{result.relationLabel}</strong> 관계
      </p>
      <p className="mt-3.5 mb-[1em] rounded-xl bg-navy px-[18px] py-4 text-[15px] text-navy-contrast">{result.leadText}</p>

      <div className="mt-[22px] flex flex-col gap-3.5">
        {result.meters.map((m) => (
          <div key={m.key}>
            <div className="mb-1.5 flex justify-between text-[14px]">
              <span>{m.label}</span>
              <span className="tabular-nums text-ink-muted">{m.score}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-md bg-surface-2">
              <div
                className="h-full rounded-md bg-accent transition-[width] duration-500 ease-[ease]"
                style={{ width: `${m.score}%` }}
              />
            </div>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">{m.message}</p>
          </div>
        ))}
      </div>

      <div className="mt-[22px] flex flex-wrap gap-2.5">
        <div className={luckyChipClass}>
          <div className={luckyKeyClass}>행운의 색</div>
          <div className={luckyValueClass}>{result.lucky.color}</div>
        </div>
        <div className={luckyChipClass}>
          <div className={luckyKeyClass}>행운의 숫자</div>
          <div className={luckyValueClass}>{result.lucky.number}</div>
        </div>
        <div className={luckyChipClass}>
          <div className={luckyKeyClass}>행운의 아이템</div>
          <div className={luckyValueClass}>{result.lucky.item}</div>
        </div>
      </div>
    </div>
  );
}
