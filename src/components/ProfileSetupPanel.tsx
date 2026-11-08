'use client';

import { useState } from 'react';
import { toSolarDate, type CalendarType } from '@/lib/calendar';
import type { SajuProfile } from '@/lib/profiles';
import {
  actionsClass,
  buttonClass,
  errorClass,
  fieldClass,
  fieldRowClass,
  inputClass,
  labelClass,
  selectClass,
} from './ui';

type ProfileSetupPanelProps = {
  profileCount: number;
  onSave: (profile: SajuProfile) => void;
  onCancel?: () => void;
};

function newProfileId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatBirthTime(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
}

export default function ProfileSetupPanel({ profileCount, onSave, onCancel }: ProfileSetupPanelProps) {
  const [profileName, setProfileName] = useState('');
  const [date, setDate] = useState('');
  const [calendarType, setCalendarType] = useState<CalendarType>('solar');
  const [leapMonth, setLeapMonth] = useState(false);
  const [time, setTime] = useState('');
  const [noTime, setNoTime] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    const name = profileName.trim();
    if (!name) {
      setError('프로필 이름을 입력해주세요.');
      return;
    }
    const solarDate = toSolarDate(
      { year: Number(date.slice(0, 4)), month: Number(date.slice(5, 7)), day: Number(date.slice(8, 10)) },
      calendarType,
      leapMonth,
    );
    if (!date || !solarDate) {
      setError('생년월일을 확인해주세요.');
      return;
    }
    const today = new Date();
    if (
      solarDate.year > today.getFullYear() ||
      (solarDate.year === today.getFullYear() && solarDate.month > today.getMonth() + 1) ||
      (solarDate.year === today.getFullYear() && solarDate.month === today.getMonth() + 1 && solarDate.day > today.getDate())
    ) {
      setError('생년월일은 오늘 이후 날짜로 입력할 수 없습니다.');
      return;
    }
    if (!noTime && time && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      setError('태어난 시간은 00:00부터 23:59 사이로 입력해주세요.');
      return;
    }

    const hasTime = !noTime && !!time;
    onSave({
      id: newProfileId(),
      profileName: name,
      name: '',
      date,
      time: hasTime ? time : '',
      noTime,
      calendarType,
      leapMonth,
    });
  }

  return (
    <section>
      <h2 className="mb-[18px] text-[20px]">프로필 생성</h2>
      <fieldset>
        <div className={fieldRowClass}>
          <div className={fieldClass}>
            <label htmlFor="profile-name" className={labelClass}>프로필 이름</label>
            <input
              id="profile-name"
              className={inputClass}
              type="text"
              placeholder="예: 나, 엄마, 친구"
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
            />
          </div>
          <div className={fieldClass}>
            <label htmlFor="profile-date" className={labelClass}>생년월일</label>
            <input id="profile-date" className={inputClass} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </div>
          <div className={fieldClass}>
            <label htmlFor="profile-calendar" className={labelClass}>양력 / 음력</label>
            <select
              id="profile-calendar"
              className={selectClass}
              value={calendarType}
              onChange={(event) => setCalendarType(event.target.value as CalendarType)}
            >
              <option value="solar">양력</option>
              <option value="lunar">음력</option>
            </select>
          </div>
          {calendarType === 'lunar' && (
            <div className={fieldClass}>
              <label htmlFor="profile-leap-month" className={labelClass}>음력 월</label>
              <select
                id="profile-leap-month"
                className={selectClass}
                value={leapMonth ? 'leap' : 'regular'}
                onChange={(event) => setLeapMonth(event.target.value === 'leap')}
              >
                <option value="regular">평달</option>
                <option value="leap">윤달</option>
              </select>
            </div>
          )}
          <div className={fieldClass}>
            <label htmlFor="profile-time" className={labelClass}>태어난 시간</label>
            <input
              id="profile-time"
              className={inputClass}
              type="text"
              inputMode="numeric"
              placeholder="예: 00:00"
              value={time}
              disabled={noTime}
              onChange={(event) => setTime(formatBirthTime(event.target.value))}
            />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[13.5px] text-ink-muted">
          <input id="profile-no-time" className="m-[3px_3px_3px_4px] size-4" type="checkbox" checked={noTime} onChange={(event) => setNoTime(event.target.checked)} />
          <label htmlFor="profile-no-time" className="block text-[13.5px] text-ink-muted">
            태어난 시간을 몰라요 (사주 분석 시 시간 미입력으로 인한 오차가 발생할 수 있어요)
          </label>
        </div>
        <div className={actionsClass}>
          <button type="button" className={buttonClass()} onClick={handleSave}>프로필 저장하고 분석 보기</button>
          {onCancel && <button type="button" className={buttonClass('ghost')} onClick={onCancel}>취소</button>}
        </div>
        {error && <p className={errorClass}>{error}</p>}
      </fieldset>
    </section>
  );
}