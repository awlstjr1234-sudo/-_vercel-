import { NextResponse } from 'next/server';
import { buildSajuReading, type SajuInput } from '@/lib/saju';
import { logReading } from '@/lib/supabaseServer';

function inRange(value: unknown, min: number, max: number): value is number {
  return Number.isInteger(value) && (value as number) >= min && (value as number) <= max;
}

function parseInput(body: unknown): SajuInput | null {
  if (!body || typeof body !== 'object') return null;
  const { name, year, month, day, hour } = body as Record<string, unknown>;
  if (!inRange(year, 1900, 2100) || !inRange(month, 1, 12) || !inRange(day, 1, 31)) return null;
  if (hour !== null && !inRange(hour, 0, 23)) return null;
  return { name: typeof name === 'string' ? name.slice(0, 30) : '', year, month, day, hour };
}

export async function POST(request: Request) {
  const input = parseInput(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: '입력값을 확인해주세요.' }, { status: 400 });

  const result = buildSajuReading(input);
  const saved = await logReading('saju', {
    pillars: result.pillars,
    elementCounts: result.elementCounts,
    hasHour: input.hour !== null,
  });
  return NextResponse.json({ result, saved });
}
