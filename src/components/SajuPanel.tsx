'use client';

import { useState } from 'react';
import { buildSajuReading, type SajuInput, type SajuResult } from '@/lib/saju';
import { parseCalendarDate } from '@/lib/calendar';
import type { SajuProfile } from '@/lib/profiles';
import { postJson } from '@/lib/api';
import { sajuReaction, type GuideContent } from '@/lib/guideReactions';
import SajuResultView from './SajuResultView';
import { actionsClass, buttonClass, dividerClass, errorClass } from './ui';

export default function SajuPanel({ profile, onReaction }: { profile: SajuProfile; onReaction?: (content: GuideContent) => void }) {
  const [result, setResult] = useState<SajuResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    const solarDate = parseCalendarDate(profile.date, profile.calendarType ?? 'solar', profile.leapMonth ?? false);
    if (!solarDate) {
      setError('프로필의 생년월일을 확인해주세요.');
      return;
    }
    const hour = profile.noTime || !profile.time ? null : Number(profile.time.split(':')[0]);
    const input: SajuInput = {
      name: profile.profileName,
      year: solarDate.year,
      month: solarDate.month,
      day: solarDate.day,
      hour,
    };
    setError(null);
    const next = (await postJson<{ result: SajuResult }>('/api/saju', input))?.result ?? buildSajuReading(input);
    setResult(next);
    onReaction?.(sajuReaction(next));
  }

  return (
    <section>
      <div className={actionsClass}>
        <button type="button" className={buttonClass()} onClick={handleRun}>사주팔자 풀이하기</button>
      </div>
      {error && <p className={errorClass}>{error}</p>}

      {result && (
        <>
          <hr className={dividerClass} />
          <SajuResultView result={result} />
        </>
      )}
    </section>
  );
}
