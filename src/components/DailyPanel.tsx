'use client';

import { useEffect, useRef, useState } from 'react';
import { buildDailyFortune, type DailyFortuneInput, type DailyFortuneResult } from '@/lib/dailyFortune';
import { parseCalendarDate } from '@/lib/calendar';
import type { SajuProfile } from '@/lib/profiles';
import { postJson } from '@/lib/api';
import { dailyReaction, type GuideContent } from '@/lib/guideReactions';
import DailyResultView from './DailyResultView';
import {
  actionsClass,
  buttonClass,
  dividerClass,
  errorClass,
  fieldClass,
  fieldRowClass,
  hintClass,
  inputClass,
  labelClass,
} from './ui';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function DailyPanel({ profile, specificDate = false, onReaction }: { profile: SajuProfile; specificDate?: boolean; onReaction?: (content: GuideContent) => void }) {
  const [result, setResult] = useState<DailyFortuneResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const dateInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedDate(todayISO());
  }, []);

  async function handleRun() {
    const solarDate = parseCalendarDate(profile.date, profile.calendarType ?? 'solar', profile.leapMonth ?? false);
    if (!solarDate) {
      setError('프로필의 생년월일을 확인해주세요.');
      return;
    }
    const fortuneDate = specificDate ? selectedDate : todayISO();
    if (!fortuneDate) {
      setError('달력에서 날짜를 지정해주세요.');
      return;
    }
    setError(null);
    const nextInput: DailyFortuneInput = {
      name: profile.profileName || '당신',
      birthYear: solarDate.year,
      birthMonth: solarDate.month,
      birthDay: solarDate.day,
      todayISO: fortuneDate,
    };
    const next = (await postJson<{ result: DailyFortuneResult }>('/api/daily', nextInput))?.result ?? buildDailyFortune(nextInput);
    setResult(next);
    onReaction?.(dailyReaction(next));
  }

  return (
    <section>
      <fieldset>
        {specificDate && (
          <div className={fieldRowClass}>
            <div className={fieldClass}>
              <label htmlFor="fortune-date" className={labelClass}>운세를 볼 날짜</label>
              <input
                id="fortune-date"
                className={inputClass}
                ref={dateInput}
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </div>
            <div className={`${fieldClass} flex flex-col justify-end`}>
              <span className="mb-1.5 block h-6" aria-hidden="true">&nbsp;</span>
              <button type="button" className={buttonClass('ghost', 'md', 'whitespace-nowrap')} onClick={() => dateInput.current?.showPicker()}>
                날짜 지정
              </button>
            </div>
          </div>
        )}
        <div className={actionsClass}>
          <button type="button" className={buttonClass()} onClick={handleRun} disabled={specificDate && !selectedDate}>
            {specificDate ? '지정일 운세 보기' : '오늘의 운세 보기'}
          </button>
        </div>
        <p className={hintClass}>
          생년월일로 띠를 확인하고, 오늘의 일진(日辰)과 합·충·형 관계를 따져 운세를 풀이해요. 같은 띠라면 같은
          날엔 같은 운세가 나와요.
        </p>
        {error && <p className={errorClass}>{error}</p>}
      </fieldset>

      {result && (
        <>
          <hr className={dividerClass} />
          <DailyResultView result={result} />
        </>
      )}
    </section>
  );
}
