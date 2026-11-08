'use client';

import { useEffect, useRef, useState } from 'react';
import SajuPanel from '@/components/SajuPanel';
import DailyPanel from '@/components/DailyPanel';
import ProfileSetupPanel from '@/components/ProfileSetupPanel';
import TarotPanel from '@/components/TarotPanel';
import GwaeCharacter from '@/components/GwaeCharacter';
import FortuneGuide, { type GuideReaction, type GuideTopic } from '@/components/FortuneGuide';
import type { GuideContent } from '@/lib/guideReactions';
import { buttonClass, labelClass, selectClass, tabClass, tabListClass } from '@/components/ui';
import { loadActiveProfileId, loadProfiles, saveActiveProfileId, saveProfiles, type SajuProfile } from '@/lib/profiles';

type MainTab = 'profile' | 'tarot';
type ProfileTab = 'saju' | 'daily' | 'specific';
const MAIN_TABS: { key: MainTab; label: string }[] = [
  { key: 'profile', label: '프로필 생성' },
  { key: 'tarot', label: '타로' },
];
const PROFILE_TABS: { key: ProfileTab; label: string }[] = [
  { key: 'saju', label: '사주' },
  { key: 'daily', label: '오늘의 운세' },
  { key: 'specific', label: '지정일 운세' },
];

export default function HomePage() {
  const [activeMain, setActiveMain] = useState<MainTab>('profile');
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>('saju');
  const [profiles, setProfiles] = useState<SajuProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState('');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [ready, setReady] = useState(false);
  const [reaction, setReaction] = useState<GuideReaction | null>(null);
  const reactionId = useRef(0);

  useEffect(() => {
    const loadedProfiles = loadProfiles();
    const storedId = loadActiveProfileId();
    const selected = loadedProfiles.find((profile) => profile.id === storedId) ?? loadedProfiles[0];
    setProfiles(loadedProfiles);
    setActiveProfileId(selected?.id ?? '');
    if (selected) saveActiveProfileId(selected.id);
    setReady(true);
  }, []);

  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) ?? null;
  function handleReaction(content: GuideContent | null) {
    setReaction(content ? { ...content, id: ++reactionId.current } : null);
  }

  const guideTopic: GuideTopic =
    activeMain === 'tarot' ? 'tarot' : showProfileForm || !activeProfile ? 'profile' : activeProfileTab;

  function handleSaveProfile(profile: SajuProfile) {
    const nextProfiles = [...profiles.filter((item) => item.id !== profile.id), profile];
    saveProfiles(nextProfiles);
    saveActiveProfileId(profile.id);
    setProfiles(nextProfiles);
    setActiveProfileId(profile.id);
    setShowProfileForm(false);
    setActiveProfileTab('saju');
  }

  function handleProfileChange(profileId: string) {
    setActiveProfileId(profileId);
    saveActiveProfileId(profileId);
    setActiveProfileTab('saju');
  }

  function handleDeleteProfile() {
    if (!activeProfile) return;
    const nextProfiles = profiles.filter((profile) => profile.id !== activeProfile.id);
    saveProfiles(nextProfiles);
    const nextActiveProfile = nextProfiles[0] ?? null;
    setProfiles(nextProfiles);
    setActiveProfileId(nextActiveProfile?.id ?? '');
    saveActiveProfileId(nextActiveProfile?.id ?? '');
  }

  // 탭이나 프로필이 바뀌면 이전 결과에 대한 반응은 지워요.
  useEffect(() => {
    setReaction(null);
  }, [guideTopic, activeProfileId]);

  return (
    <div className="mx-auto max-w-[760px]">
      <header className="mb-7 text-center">
        <GwaeCharacter className="mx-auto mb-2 block size-[84px] animate-bob drop-shadow-[0_6px_8px_rgba(30,27,22,0.18)] motion-reduce:animate-none" />
        <h1 className="text-[clamp(28px,5vw,38px)] tracking-[0.02em]">점괘방</h1>
        <p className="mt-2 text-[14.5px] text-ink-muted">괘돌이와 함께 보는 사주 · 타로 · 오늘의 운세</p>
      </header>

      <div className={`${tabListClass} mt-[26px] px-1.5 max-[480px]:px-0`} role="tablist" aria-label="주요 메뉴">
        {MAIN_TABS.map((t) => (
          <button
            key={t.key}
            className={tabClass}
            role="tab"
            aria-selected={activeMain === t.key}
            onClick={() => setActiveMain(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main className="rounded-[0_10px_14px_14px] border border-border bg-surface px-[clamp(16px,4vw,34px)] pt-7 pb-[34px] shadow-card">
        {activeMain === 'tarot' ? (
          <TarotPanel onReaction={handleReaction} />
        ) : !ready ? null : showProfileForm || !activeProfile ? (
          <ProfileSetupPanel
            profileCount={profiles.length}
            onSave={handleSaveProfile}
            onCancel={activeProfile ? () => setShowProfileForm(false) : undefined}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-[18px]">
              <div className="min-w-0 max-w-[360px] flex-[1_1_220px]">
                <label htmlFor="active-profile" className={labelClass}>사용 중인 프로필</label>
                <select id="active-profile" className={selectClass} value={activeProfile.id} onChange={(event) => handleProfileChange(event.target.value)}>
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>{profile.profileName}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={buttonClass('ghost')} onClick={() => setShowProfileForm(true)}>새 프로필</button>
                <button type="button" className={buttonClass('ghost')} onClick={handleDeleteProfile}>프로필 삭제</button>
              </div>
            </div>
            <div className={`${tabListClass} mt-[22px]`} role="tablist" aria-label="프로필 운세 메뉴">
              {PROFILE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={tabClass}
                  role="tab"
                  aria-selected={activeProfileTab === tab.key}
                  onClick={() => setActiveProfileTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="pt-[22px]">
              {activeProfileTab === 'saju' && <SajuPanel key={activeProfile.id} profile={activeProfile} onReaction={handleReaction} />}
              {activeProfileTab === 'daily' && <DailyPanel key={activeProfile.id} profile={activeProfile} onReaction={handleReaction} />}
              {activeProfileTab === 'specific' && <DailyPanel key={`${activeProfile.id}-specific`} profile={activeProfile} specificDate onReaction={handleReaction} />}
            </div>
          </>
        )}
      </main>

      <p className="mt-[30px] mb-[1em] text-center text-[12.5px] leading-[1.7] text-ink-muted">

      </p>

      <FortuneGuide topic={guideTopic} reaction={reaction} />
    </div>
  );
}
