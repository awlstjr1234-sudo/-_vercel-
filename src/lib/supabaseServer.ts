// 서버(API Routes)에서만 쓰는 Supabase 클라이언트.
// 서비스 롤 키는 NEXT_PUBLIC_ 접두어가 없으므로 브라우저 번들에 들어가지 않습니다.
// 환경변수가 없으면 기록만 건너뛰고 앱은 그대로 동작합니다.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type ReadingKind = 'saju' | 'daily' | 'tarot';

let client: SupabaseClient | null | undefined;

function getClient(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}

/** 풀이 결과를 익명으로 기록합니다. 이름·생년월일은 저장하지 않고, 실패해도 예외를 던지지 않습니다. */
export async function logReading(kind: ReadingKind, payload: Record<string, unknown>): Promise<boolean> {
  const supabase = getClient();
  if (!supabase) return false;
  const { error } = await supabase.from('readings').insert({ kind, payload });
  if (error) {
    console.error('[supabase] readings insert 실패:', error.message);
    return false;
  }
  return true;
}
