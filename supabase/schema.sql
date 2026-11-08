-- 점괘방 익명 풀이 기록 테이블
-- Supabase 대시보드 > SQL Editor에서 한 번 실행하세요.
-- src/lib/supabaseServer.ts 의 logReading()이 { kind, payload } 형태로 insert 합니다.
-- 이름·생년월일 같은 개인정보는 저장하지 않습니다.

create table if not exists public.readings (
  id          bigint generated always as identity primary key,
  kind        text        not null check (kind in ('saju', 'daily', 'tarot')),
  payload     jsonb       not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists readings_kind_created_at_idx
  on public.readings (kind, created_at desc);

-- RLS를 켜고 정책은 만들지 않습니다.
-- → 브라우저(anon 키)에서는 읽기/쓰기가 모두 막히고,
--   서버(API Routes)의 서비스 롤 키만 RLS를 우회해 기록할 수 있습니다.
alter table public.readings enable row level security;
