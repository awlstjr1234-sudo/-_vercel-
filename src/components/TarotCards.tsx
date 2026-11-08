import { getCardEssence, type DrawnCard } from '@/lib/tarot';
import TarotArtwork from './TarotArtwork';

const headingClass = 'mt-2.5 mb-[3px] text-[13px] font-bold text-gold';
const bodyClass = 'text-[13px] leading-[1.7] text-ink-muted';

export default function TarotCards({ cards }: { cards: DrawnCard[] }) {
  return (
    <div className="mt-3 mb-5 flex flex-wrap items-start gap-4 max-[480px]:grid max-[480px]:grid-cols-1">
      {cards.map((item, i) => (
        <article className="min-w-0 flex-[1_1_190px] rounded-[14px] border border-border bg-surface p-3" key={`${item.card.id}-${i}`}>
          <div className="mx-auto max-w-[260px] overflow-hidden rounded-[14px] shadow-card">
            <TarotArtwork card={item.card} reversed={item.reversed} />
          </div>
          <p className="mt-3 text-center text-[12px] text-ink-muted">{item.position}</p>
          <h3 className="mt-0.5 text-center font-serif text-[20px]">{item.card.title}</h3>
          <p className="mt-1 mb-3 text-center text-[12px] text-gold">{item.reversed ? '역방향' : '정방향'}</p>
          <div className="border-t border-border pt-2.5">
            <h4 className={headingClass}>카드의 상징</h4>
            <p className={bodyClass}>{getCardEssence(item.card)}</p>
            <h4 className={headingClass}>이번 카드의 해석</h4>
            <p className={bodyClass}>{item.reversed ? item.card.rev : item.card.up}</p>
            {item.reversed && (
              <>
                <h4 className={headingClass}>살펴볼 점</h4>
                <p className={bodyClass}>이 카드의 에너지가 막히거나 안으로 향하는 모습일 수 있어요. 서두르기보다 준비가 덜 된 부분과 반복되는 습관을 확인해보세요.</p>
              </>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
