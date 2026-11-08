// 점괘 도우미(괘돌이)가 결과를 보고 들려주는 반응 문구를 만듭니다. 계산은 하지 않고, 이미 나온 결과를 풀어서 설명해요.

import { EL_LABEL, EL_ORDER, STEM_EL, STEM_HANJA, STEM_KR, type SajuResult } from './saju';
import { ANIMAL_KR, RELATION_INFO, type DailyFortuneResult } from './dailyFortune';
import { spreadReasons, type DrawnCard } from './tarot';

export interface GuideContent {
  title: string;
  steps: string[];
}

function firstSentence(text: string): string {
  const s = text.split('. ')[0];
  return s.endsWith('.') ? s : `${s}.`;
}

export function sajuReaction(result: SajuResult): GuideContent {
  const { pillars, elementCounts, elementalInsight, daymasterText } = result;
  const who = result.name ? `${result.name}님` : '회원님';
  const dayStem = pillars.day.stem;
  const letters = pillars.hour ? 8 : 6;
  const maxCount = Math.max(...EL_ORDER.map((k) => elementCounts[k]));

  const steps = [
    `${who}의 사주가 나왔어요! 일주의 천간이 ${STEM_KR[dayStem]}${STEM_HANJA[dayStem]}, 즉 ${EL_LABEL[STEM_EL[dayStem]]} 기운이라 일간은 ${STEM_KR[dayStem]}이에요. ${firstSentence(daymasterText)}`,
    `${letters}글자를 오행별로 세어 보니 ${elementalInsight.strongLabel} 기운이 ${maxCount}개로 가장 많아요. 그래서 해설도 이 기운의 특징을 먼저 짚었어요.`,
    elementalInsight.balanced
      ? '다섯 오행이 모두 하나 이상씩 있어서 비어 있는 기운은 따로 짚지 않았어요. 고르게 섞인 사주예요!'
      : `${elementalInsight.weakLabel} 기운은 하나도 없어서 부족한 기운으로 짚었어요. 부족하다고 나쁜 건 아니고, 의식해서 채우면 균형이 잡힌다는 뜻이에요.`,
  ];
  if (!pillars.hour) {
    steps.push('태어난 시간을 몰라서 시주 없이 여섯 글자로만 풀었어요. 시간을 아시면 결과가 조금 달라질 수 있어요.');
  }
  return { title: '이 사주는 이렇게 읽었어요', steps };
}

export function dailyReaction(result: DailyFortuneResult): GuideContent {
  const info = Object.values(RELATION_INFO).find((r) => r.label === result.relationLabel);
  const animal = `${ANIMAL_KR[result.zodiacBranch]}띠`;
  const mood = info?.tier === 'high' ? '오, 좋은 날이에요!' : info?.tier === 'low' ? '음, 오늘은 조금 조심하세요.' : '무난하게 흘러가는 날이에요.';

  const best = result.meters.reduce((a, b) => (b.score > a.score ? b : a));
  const worst = result.meters.reduce((a, b) => (b.score < a.score ? b : a));

  const steps = [
    `${animal}와 ${result.todayLabel}의 기운이 "${result.relationLabel}" 관계로 만났어요. ${mood}`,
    best.key === worst.key
      ? '항목마다 고른 흐름이라 유독 두드러지는 운은 없어요.'
      : `그래서 ${best.label}은 가장 힘이 있고, ${worst.label}은 한 걸음 천천히 가는 게 좋아요.`,
  ];
  return { title: '이 운세는 이렇게 봤어요', steps };
}

export function tarotReaction(cards: DrawnCard[]): GuideContent {
  const orient = (c: DrawnCard) => (c.reversed ? '역방향' : '정방향');
  const meaning = (c: DrawnCard) => firstSentence(c.reversed ? c.card.rev : c.card.up);

  if (cards.length === 1) {
    const [c] = cards;
    return {
      title: '이 카드는 이렇게 읽었어요',
      steps: [
        `뽑은 카드는 ${c.card.title}, ${orient(c)}이에요. ${c.reversed ? '정방향이라면' : '역방향이라면'} 다른 뜻이 나오는 카드인데, 이번엔 ${orient(c)}이라서 이렇게 읽었어요. ${meaning(c)}`,
        '한 장만 뽑으면 다른 카드와의 조합은 없어서, 카드 한 장의 뜻과 방향만으로 해석했어요.',
      ],
    };
  }

  const originals = cards.map((c) => `${c.position} · ${c.card.title}(${orient(c)}): ${meaning(c)}`).join('\n');
  const reasons = spreadReasons(cards);
  return {
    title: '세 카드를 이렇게 엮었어요',
    steps: [
      `먼저 카드를 하나씩 보면 이런 뜻이에요.\n${originals}`,
      '그런데 카드는 혼자 볼 때와 함께 놓였을 때 의미가 달라져요. 그래서 세 장을 함께 놓고 네 가지를 살폈어요.',
      ...reasons.map((r, i) => `${i + 1}. ${r.fact}\n→ ${r.reading}`),
      '이 네 가지를 이어 붙인 것이 화면의 "세 카드의 조합" 해석이에요. 카드 하나하나의 뜻에 이 조합의 특징이 더해져서 원래 해석과 조금 다르게 나온 거예요.',
    ],
  };
}
