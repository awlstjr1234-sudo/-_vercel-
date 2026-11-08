'use client';

import { useEffect, useState } from 'react';
import GwaeCharacter from './GwaeCharacter';
import type { GuideContent } from '@/lib/guideReactions';
import { buttonClass } from './ui';

const pressable =
  'cursor-pointer transition-[translate,opacity] duration-[120ms] ease-[ease] hover:-translate-y-px active:translate-y-0 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const toggleClass = `${pressable} flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pr-3 pl-1.5 text-ink shadow-card`;
const closeClass = `${pressable} rounded-[9px] px-[22px] py-3 text-[20px] leading-none font-medium text-ink-muted shadow-card`;
const switchClass = `${pressable} mb-2.5 block rounded-[9px] text-[13px] font-medium text-accent underline shadow-card`;

export type GuideReaction = GuideContent & { id: number };
export type GuideTopic = 'profile' | 'saju' | 'daily' | 'specific' | 'tarot';

const GUIDE: Record<GuideTopic, { title: string; steps: string[] }> = {
  profile: {
    title: '프로필은 왜 필요할까요?',
    steps: [
      '안녕하세요, 저는 괘돌이예요! 사주는 태어난 순간의 하늘 기운을 글자로 옮긴 거라서 생년월일이 꼭 필요해요.',
      '음력으로 입력하셔도 괜찮아요. 양력으로 바꿔서 계산해 드릴게요.',
      '태어난 시간을 모르면 "시간 모름"을 선택해 주세요. 그러면 시주(時柱)만 빼고 세 기둥으로 풀이해요.',
    ],
  },
  saju: {
    title: '사주팔자는 이렇게 계산해요',
    steps: [
      '사주는 네 개의 기둥(년·월·일·시)이에요. 기둥마다 하늘의 글자 천간과 땅의 글자 지지가 한 쌍씩이라 모두 여덟 글자, 그래서 팔자(八字)라고 해요.',
      '년주는 태어난 해로 정하는데, 설날이 아니라 입춘(2월 4일경)부터 새해로 쳐요. 그래서 1월생이나 2월 초생은 전년도 띠가 되기도 해요.',
      '월주는 절기(대략 매월 4~8일)를 기준으로 달을 나눠요. 일주는 1900년 1월 31일 갑자일부터 며칠이 지났는지 세어서 10과 12로 나눈 나머지로 정해요.',
      '시주는 하루를 2시간씩 12칸으로 나눈 거예요. 자시는 밤 11시부터 새벽 1시까지고, 그날의 일간에 따라 시간의 천간이 달라져요.',
      '여덟 글자는 각각 목·화·토·금·수 다섯 기운 중 하나예요. 막대그래프는 그 개수를 센 거고, 가장 많은 기운과 하나도 없는 기운을 해설해 드려요.',
      '일주의 천간인 일간(日干)이 "나 자신"을 뜻해요. 그래서 성격 풀이는 일간을 중심으로 나와요.',
    ],
  },
  daily: {
    title: '오늘의 운세는 이렇게 봐요',
    steps: [
      '태어난 해의 띠와 오늘의 기운(일진)이 어떻게 어우러지는지를 살펴요.',
      '잘 맞는 날은 삼합·육합, 부딪히기 쉬운 날은 충·형, 그 밖에는 무난한 날로 보고 총운부터 직장운까지 풀이해요.',
      '같은 띠는 같은 날 같은 운세가 나와요.',
    ],
  },
  specific: {
    title: '지정일 운세는 이렇게 봐요',
    steps: [
      '오늘의 운세와 같은 방식으로, 고른 날짜의 기운과 내 띠의 어우러짐을 살펴요.',
      '면접이나 약속처럼 중요한 날을 미리 가늠해 볼 때 참고해 보세요.',
    ],
  },
  tarot: {
    title: '타로는 이렇게 진행돼요',
    steps: [
      '타로는 78장이에요. 큰 그림의 메이저 아르카나 22장과 컵·지팡이·검·펜타클 4가지 문양의 마이너 56장으로 이뤄져 있어요.',
      '방식을 고르면 카드를 섞어서 그중 12장만 뒷면으로 펼쳐 드려요. 마음속으로 질문을 떠올리고 끌리는 카드를 직접 골라 보세요.',
      '카드는 정방향과 역방향이 반반 확률로 정해져요. 역방향은 나쁜 카드가 아니라 기운이 막히거나 안으로 향한다는 뜻이에요.',
      '3장 뽑기는 과거·현재·미래 순서로 골라요. 세 장을 따로 보지 말고, 앞의 카드가 지금 선택에 어떤 영향을 주는지 이어서 읽어 보세요.',
      '타로는 정해진 답이 아니라 생각을 정리하는 거울이에요. 재미로 즐기시고, 중요한 결정은 스스로 판단하세요!',
    ],
  },
};

export default function FortuneGuide({ topic, reaction }: { topic: GuideTopic; reaction: GuideReaction | null }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [showReaction, setShowReaction] = useState(false);
  const guide = showReaction && reaction ? reaction : GUIDE[topic];

  useEffect(() => {
    setStep(0);
    setShowReaction(false);
  }, [topic]);

  // 결과가 새로 나오면 도우미가 먼저 말을 걸어요.
  useEffect(() => {
    setStep(0);
    setShowReaction(reaction !== null);
    if (reaction) setOpen(true);
  }, [reaction]);

  const last = step === guide.steps.length - 1;

  function toggleView() {
    setShowReaction(!showReaction);
    setStep(0);
  }

  return (
    <aside className="fixed right-4 bottom-4 z-20 flex max-w-[calc(100vw-32px)] flex-col items-end gap-2" aria-label="점괘 도우미">
      {open && (
        <div className="w-[300px] max-w-full rounded-[14px] border border-border bg-surface px-4 py-3.5 shadow-card" role="dialog" aria-label={guide.title}>
          <div className="flex items-center justify-between gap-2 font-serif">
            <strong>{guide.title}</strong>
            <button type="button" className={closeClass} onClick={() => setOpen(false)} aria-label="설명 닫기">
              ×
            </button>
          </div>
          <p className="mt-2 mb-3 whitespace-pre-line break-keep text-[14px] leading-[1.7]" aria-live="polite">{guide.steps[step]}</p>
          {reaction && (
            <button type="button" className={switchClass} onClick={toggleView}>
              {showReaction ? '원리 설명 보기' : '이 결과 설명 보기'}
            </button>
          )}
          <div className="flex items-center justify-between text-[13px] text-ink-muted">
            <button type="button" className={buttonClass('ghost', 'sm')} disabled={step === 0} onClick={() => setStep(step - 1)}>
              이전
            </button>
            <span>{step + 1} / {guide.steps.length}</span>
            <button type="button" className={buttonClass('primary', 'sm')} onClick={() => (last ? setOpen(false) : setStep(step + 1))}>
              {last ? '알겠어요!' : '다음'}
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        className={toggleClass}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? '점괘 도우미 닫기' : '점괘 도우미에게 원리 물어보기'}
      >
        <GwaeCharacter
          className={`size-12 flex-none motion-reduce:animate-none ${open ? 'animate-bob-fast' : 'animate-bob'}`}
        />
        {!open && <span className="text-[14px] text-ink-muted">이건 어떤 원리?</span>}
      </button>
    </aside>
  );
}
