import { NextResponse } from 'next/server';
import { DECK, spreadReasons, type DrawnCard } from '@/lib/tarot';
import { logReading } from '@/lib/supabaseServer';

// 브라우저가 고른 카드(id, 방향, 위치)를 덱과 대조해 검증하고, 조합 해석과 함께 기록합니다.
function parseCards(body: unknown): DrawnCard[] | null {
  const list = (body as { cards?: unknown } | null)?.cards;
  if (!Array.isArray(list) || list.length < 1 || list.length > 3) return null;
  const cards: DrawnCard[] = [];
  for (const item of list) {
    const { id, reversed, position } = (item ?? {}) as Record<string, unknown>;
    const card = DECK.find((c) => c.id === id);
    if (!card || typeof reversed !== 'boolean' || typeof position !== 'string') return null;
    cards.push({ card, reversed, position: position.slice(0, 10) });
  }
  if (new Set(cards.map((c) => c.card.id)).size !== cards.length) return null;
  return cards;
}

export async function POST(request: Request) {
  const cards = parseCards(await request.json().catch(() => null));
  if (!cards) return NextResponse.json({ error: '카드 정보를 확인해주세요.' }, { status: 400 });

  const saved = await logReading('tarot', {
    cards: cards.map((c) => ({ id: c.card.id, reversed: c.reversed, position: c.position })),
  });
  return NextResponse.json({ reasons: spreadReasons(cards), saved });
}
