'use client';

import { useState } from 'react';
import { DECK, interpretSpread, type DeckCard, type DrawnCard } from '@/lib/tarot';
import { shuffle } from '@/lib/random';
import { postJson } from '@/lib/api';
import { tarotReaction, type GuideContent } from '@/lib/guideReactions';
import TarotCards from './TarotCards';
import { buttonClass } from './ui';

// 뒷면으로 펼쳐진 카드 버튼 (선택한 카드는 무늬 없이 흐리게)
const pickCardClass =
  'flex min-h-[110px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-gold ' +
  'px-[22px] py-3 text-[15px] font-medium text-gold shadow-card transition-[translate,box-shadow] duration-[180ms] ease-[ease] ' +
  'enabled:hover:-translate-y-[3px] disabled:cursor-default disabled:opacity-[0.52] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none ' +
  'max-[480px]:min-h-[84px]';

type ReadingMode = 'daily' | 'spread';
const PICK_COUNT = 12;

export default function TarotPanel({ onReaction }: { onReaction?: (content: GuideContent | null) => void }) {
  const [mode, setMode] = useState<ReadingMode | null>(null);
  const [pool, setPool] = useState<DeckCard[]>([]);
  const [cards, setCards] = useState<DrawnCard[] | null>(null);

  function startReading(nextMode: ReadingMode) {
    onReaction?.(null);
    setMode(nextMode);
    setPool(shuffle(DECK, Math.random).slice(0, PICK_COUNT));
    setCards([]);
  }

  function pickCard(card: DeckCard) {
    if (!mode || !cards || cards.length >= (mode === 'daily' ? 1 : 3)) return;
    const positions = mode === 'daily' ? ['오늘의 카드'] : ['과거', '현재', '미래'];
    const nextCards = [...cards, {
      position: positions[cards.length],
      card,
      reversed: Math.random() < 0.5,
    }];
    setCards(nextCards);
    if (nextCards.length === (mode === 'daily' ? 1 : 3)) {
      onReaction?.(tarotReaction(nextCards));
      // 기록용 요청이라 응답을 기다리지 않고, 실패해도 화면에는 영향이 없어요.
      void postJson('/api/tarot', {
        cards: nextCards.map((c) => ({ id: c.card.id, reversed: c.reversed, position: c.position })),
      });
    }
  }

  function resetReading() {
    setMode(null);
    setPool([]);
    setCards(null);
    onReaction?.(null);
  }

  return (
    <section>
      <p className="mb-[1em] text-[13px] leading-[1.6] text-ink-muted">
        원하는 방식으로 펼친 카드 중 직접 골라보세요. 카드는 선택할 때까지 뒷면으로 가려져 있어요.
      </p>
      {!mode && (
        <div className="mb-5 flex flex-wrap gap-2.5">
          <button type="button" className={buttonClass()} onClick={() => startReading('daily')}>오늘의 카드 직접 뽑기</button>
          <button type="button" className={buttonClass('ghost')} onClick={() => startReading('spread')}>과거·현재·미래 3장 직접 뽑기</button>
        </div>
      )}

      {mode && cards && cards.length < (mode === 'daily' ? 1 : 3) && (
        <div className="mt-[22px]">
          <p className="mb-3.5 font-serif text-[19px]">
            {mode === 'daily'
              ? '마음속으로 질문을 떠올린 뒤 카드 한 장을 선택하세요.'
              : `${cards.length + 1}번째 카드: ${['과거', '현재', '미래'][cards.length]} 위치의 카드를 선택하세요.`}
          </p>
          <div className="mb-4 grid grid-cols-6 gap-2.5 max-[480px]:grid-cols-4 max-[480px]:gap-[7px]">
            {pool.map((card, index) => {
              const selected = cards.some((picked) => picked.card.id === card.id);
              return (
                <button
                  className={`${pickCardClass} ${selected ? 'bg-surface-2' : 'tarot-card-back'}`}
                  type="button"
                  key={`${card.id}-${index}`}
                  disabled={selected}
                  onClick={() => pickCard(card)}
                  aria-label={selected ? `${card.title}, 이미 선택함` : `뒷면 카드 ${index + 1} 선택`}
                >
                  <span className="text-[26px]" aria-hidden="true">✦</span>
                  <small className="text-[11px]">{selected ? '선택 완료' : '선택하기'}</small>
                </button>
              );
            })}
          </div>
          <button type="button" className={buttonClass('ghost')} onClick={() => startReading(mode)}>다시 섞기</button>
        </div>
      )}

      {cards && cards.length > 0 && (
        <div>
          <h3 className="mb-3.5 font-serif text-[19px]">{mode === 'daily' ? '오늘의 카드' : '선택한 카드'}</h3>
          <TarotCards cards={cards} />
          {cards.length === 3 && (
            <div className="my-[18px] rounded-xl border border-border bg-bg p-4">
              <h3 className="mb-2 text-[18px] text-gold">세 카드의 조합</h3>
              <p className="text-[13px] leading-[1.7] text-ink-muted">{interpretSpread(cards)}</p>
              <p className="mt-2.5 text-[13px] leading-[1.7] text-ink-muted">과거 카드는 지금까지 이어진 배경을, 현재 카드는 현재의 핵심 과제와 대응 방식을, 미래 카드는 지금의 흐름이 이어질 때 나타날 가능성을 보여줘요. 세 카드를 따로 보기보다 앞선 경험이 현재의 선택에 어떤 영향을 주고, 그 선택이 미래의 흐름을 어떻게 바꾸는지 함께 생각해보세요.</p>
            </div>
          )}
          {cards.length === (mode === 'daily' ? 1 : 3) ? (
            <button type="button" className={buttonClass('ghost')} onClick={resetReading}>다른 카드 뽑기</button>
          ) : (
            <p className="my-[1em] text-[14px] text-ink-muted" aria-live="polite">
              지금까지 {cards.length}장 선택했어요. 총 3장 중 {cards.length}장
            </p>
          )}
        </div>
      )}
    </section>
  );
}
