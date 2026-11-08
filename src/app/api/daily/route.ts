import { NextResponse } from 'next/server';
import { buildDailyFortune, type DailyFortuneInput } from '@/lib/dailyFortune';
import { logReading } from '@/lib/supabaseServer';

function inRange(value: unknown, min: number, max: number): value is number {
  return Number.isInteger(value) && (value as number) >= min && (value as number) <= max;
}

function parseInput(body: unknown): DailyFortuneInput | null {
  if (!body || typeof body !== 'object') return null;
  const { name, birthYear, birthMonth, birthDay, todayISO } = body as Record<string, unknown>;
  if (!inRange(birthYear, 1900, 2100) || !inRange(birthMonth, 1, 12) || !inRange(birthDay, 1, 31)) return null;
  if (typeof todayISO !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(todayISO)) return null;
  return { name: typeof name === 'string' ? name.slice(0, 30) : '', birthYear, birthMonth, birthDay, todayISO };
}

export async function POST(request: Request) {
  const input = parseInput(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: '입력값을 확인해주세요.' }, { status: 400 });

  const result = buildDailyFortune(input);
  const saved = await logReading('daily', {
    date: input.todayISO,
    zodiacBranch: result.zodiacBranch,
    relation: result.relationLabel,
    scores: Object.fromEntries(result.meters.map((m) => [m.key, m.score])),
  });
  return NextResponse.json({ result, saved });
}
