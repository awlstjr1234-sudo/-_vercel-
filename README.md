# 점괘방 (Next.js)

생년월일로 사주팔자를 풀이하고, 오늘·지정일 운세와 타로점(직접 고르는 오늘의 카드 / 과거·현재·미래 3장 스프레드)을
볼 수 있는 오락용 웹앱입니다. 마스코트 **괘돌이**가 결과마다 어떤 원리로 나온 풀이인지 설명해 줍니다.

로그인과 결과 공유 기능은 없습니다 — 입력하면 API Routes가 계산해서 보여주고, 풀이 결과만 익명으로 Supabase에 기록합니다.

- **프론트엔드**: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS v4
- **백엔드**: Next.js API Routes (`src/app/api/{saju,daily,tarot}/route.ts`)
- **데이터베이스**: Supabase (`readings` 테이블, 익명 풀이 기록)
- **배포**: Vercel + GitHub 연동 (`main` 브랜치 push 시 자동 배포)

기존에 있던 순수 HTML/JS 버전은 `legacy-static/`에 참고용으로 남겨뒀습니다(실제 서비스에는 사용하지 않음).


## 주요 기능

화면은 **프로필 생성**과 **타로** 두 개의 큰 탭으로 나뉩니다.

- **프로필**
  - 프로필 이름, 생년월일, 양력/음력(음력이면 평달/윤달), 태어난 시간(모르면 "시간 모름")을 입력합니다.
  - 태어난 시간은 `1914`처럼 숫자 네 자리만 입력해도 `19:14`로 자동 표시됩니다.
  - 음력 생일은 `korean-lunar-calendar`로 양력으로 바꿔 계산합니다. 미래 날짜는 입력할 수 없습니다.
  - 프로필은 여러 개 만들어 두고 선택·삭제할 수 있으며, 브라우저 `localStorage`에만 저장됩니다.
- **프로필 → 사주**: 네 기둥(연·월·일·시주), 천간·지지 오행 분포, 일간(日干) 성격 해설, 오행 균형 해설.
- **프로필 → 오늘의 운세 / 지정일 운세**: 띠와 그날 일진(日辰)의 합·충·형 관계로 총운·애정운·재물운·
  건강운·직장·학업운 점수와 문구, 행운의 색·숫자·아이템을 보여줍니다. 지정일 운세는 날짜를 직접 고릅니다.
- **타로**: 78장(메이저 22 + 마이너 56) 덱을 섞어 뒷면으로 펼친 뒤, 카드를 직접 골라 정/역방향 해설과
  3장 스프레드의 조합 해석을 보여줍니다.
- **괘돌이 도우미**: 화면 구석의 괘돌이를 누르면 현재 탭의 원리를 설명하고, 결과가 나오면 그 결과에 맞춘
  설명을 보여줍니다.


## 폴더 구조

```
src/
  app/
    page.tsx              # 메인 화면 (탭: 프로필(사주/오늘의 운세/지정일 운세) / 타로, 프로필 선택·삭제)
    layout.tsx            # 공통 레이아웃 + Google Fonts(Song Myung, Noto Sans KR)
    globals.css           # Tailwind 불러오기 + 디자인 토큰(라이트/다크 색) + @theme 설정
    icon.svg              # 파비콘 (괘돌이)
    api/
      saju/route.ts       # POST /api/saju  — 사주 계산 + 기록
      daily/route.ts      # POST /api/daily — 오늘/지정일 운세 계산 + 기록
      tarot/route.ts      # POST /api/tarot — 뽑은 카드 검증 + 조합 해석 + 기록
  components/
    ProfileSetupPanel.tsx # 프로필 생성 폼 (양력/음력·윤달·태어난 시간)
    SajuPanel.tsx         # 사주 탭 (API 호출 → 실패 시 로컬 계산)
    SajuResultView.tsx    # 사주 결과 화면 (네 기둥, 오행 분포, 해설)
    DailyPanel.tsx        # 오늘의 운세 / 지정일 운세 탭
    DailyResultView.tsx   # 운세 결과 화면 (점수 막대, 행운 아이템)
    TarotPanel.tsx        # 타로 탭 (카드 섞기·펼치기·직접 선택)
    TarotCards.tsx        # 뽑은 카드와 해설 표시
    TarotArtwork.tsx      # 라이더-웨이트 타로 카드 이미지 표시
    FortuneGuide.tsx      # 괘돌이 도우미 말풍선 (탭별 원리 설명 + 결과 반응)
    GwaeCharacter.tsx     # 괘돌이 캐릭터 SVG
    ui.ts                 # 버튼·탭·입력칸 등 반복되는 Tailwind 클래스 묶음
  lib/
    saju.ts               # 사주팔자 계산 + 일간/오행 해설 텍스트
    dailyFortune.ts       # 띠 + 일진 합충형 기반 운세
    tarot.ts              # 78장 타로 덱 + 카드 해설 + 스프레드 조합 해석
    random.ts             # 시드 기반 난수와 카드 섞기
    calendar.ts           # 양력/음력 날짜 파싱, 음력 → 양력 변환
    profiles.ts           # 프로필 localStorage 저장/불러오기
    guideReactions.ts     # 결과별 괘돌이 설명 문구
    api.ts                # 브라우저 → API Routes 호출 헬퍼 (실패 시 null)
    supabaseServer.ts     # 서버 전용 Supabase 클라이언트 (익명 기록)
public/tarot/             # 라이더-웨이트 타로 78장 이미지(.webp) + CREDITS.md
supabase/schema.sql       # readings 테이블 생성 SQL
legacy-static/            # 예전 단일 HTML 버전 (참고용, 유지보수 안 함)
postcss.config.mjs        # Tailwind CSS PostCSS 플러그인 설정
.env.example              # Supabase 환경변수 예시

웹앱 실행방법.md           # 처음 쓰는 사람을 위한 실행 안내
사이트맵.svg, service-flow-*.svg/png   # 사이트맵·서비스 흐름도 그림
```

화면(컴포넌트)은 `/api/*`를 호출해 결과를 받아 렌더링합니다. 계산 로직은 순수 함수(`lib/*.ts`)라서
API 호출이 실패하면 같은 함수를 브라우저에서 직접 실행해 결과를 보여줍니다.

스타일은 Tailwind CSS 유틸리티 클래스로 컴포넌트 안에 작성합니다. 색은 `globals.css`의 CSS 변수를
`@theme`로 연결해 `bg-surface`, `text-ink-muted`, `text-gold`, `bg-el-wood`처럼 쓰고, 다크 모드는 OS
설정에 따라 변수 값만 바뀝니다.

타로 이미지는 퍼블릭 도메인 라이더-웨이트-스미스 덱을 사용하며, 자세한 출처는
[`public/tarot/CREDITS.md`](./public/tarot/CREDITS.md)에 있습니다.


## API

모두 `POST` + JSON입니다. 입력값이 잘못되면 `400`과 `{ "error": "..." }`를 돌려줍니다.
응답의 `saved`는 Supabase에 기록됐는지 여부입니다.

| 경로 | 요청 본문 | 응답 |
| --- | --- | --- |
| `/api/saju` | `{ name, year, month, day, hour }` (`hour`는 0–23 또는 `null`, 날짜는 양력) | `{ result, saved }` |
| `/api/daily` | `{ name, birthYear, birthMonth, birthDay, todayISO }` (`todayISO`는 `YYYY-MM-DD`) | `{ result, saved }` |
| `/api/tarot` | `{ cards: [{ id, reversed, position }] }` (1–3장, 중복 불가) | `{ reasons, saved }` |

Supabase에는 이름·생년월일 없이 결과 요약만 남깁니다 — 사주는 네 기둥·오행 개수·시간 입력 여부,
운세는 날짜·띠·관계·점수, 타로는 카드 id·방향·위치.


## 1. 로컬 개발

```bash
npm install
npm run dev     # 개발 서버 (http://localhost:3000)
npm run build   # 프로덕션 빌드 (타입 체크 포함)
npm run lint    # ESLint
```

Supabase 환경변수가 없어도 동작하며, 이 경우 풀이 기록만 저장하지 않습니다(아래 "Supabase 연결" 참고).
처음 실행하는 분을 위한 단계별 안내는 [`웹앱 실행방법.md`](./웹앱%20실행방법.md)에 있습니다.


## 2. Supabase 연결 (익명 풀이 기록)

로그인 없이, 풀이 결과만 익명으로 `readings` 테이블에 쌓습니다. 이름과 생년월일은 저장하지 않습니다.

1. Supabase에서 프로젝트를 만들고 SQL Editor에서 `supabase/schema.sql`을 실행합니다.
   (RLS를 켜고 정책은 만들지 않으므로, 브라우저에서는 접근할 수 없고 서버의 서비스 롤 키로만 기록됩니다.)
2. `.env.example`을 `.env.local`로 복사해 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 채웁니다 (Settings > API).
3. `npm run dev`를 다시 시작합니다. API 응답의 `saved: true`로 기록 여부를 확인할 수 있습니다.

서비스 롤 키는 서버(API Routes)에서만 쓰이므로 `NEXT_PUBLIC_` 접두어를 붙이지 마세요.


## 3. Vercel + GitHub로 배포

1. 변경 사항을 GitHub 저장소의 `main` 브랜치에 push 합니다.
   ```bash
   git add .
   git commit -m "변경 내용"
   git push origin main
   ```
   (새 저장소에 처음 올리는 경우에는 `git remote add origin <your-repo-url>` 후 `git push -u origin main`.)
2. [vercel.com](https://vercel.com)에서 **Add New → Project**로 GitHub 저장소를 가져옵니다.
   Framework Preset은 Next.js가 자동으로 잡힙니다. 풀이 기록을 남기려면 Project Settings > Environment
   Variables에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 추가하세요.
3. 이후 `main` 브랜치에 push할 때마다 Vercel이 자동으로 다시 빌드/배포합니다(GitHub 연동 기본 동작).


## 4. VS Code + Claude Code로 이어서 개발하기

- VS Code에서 이 저장소 폴더를 열고 Claude Code 확장을 사용하면 됩니다.
- 프로젝트 맥락은 `CLAUDE.md`에 정리해뒀습니다 (구조, 규칙, 자주 건드릴 파일 위치).
- 텍스트 콘텐츠는 전부 `src/lib/*.ts` 안의 데이터 객체라서, 디자인/레이아웃 코드를 건드리지 않고도
  내용만 늘리거나 수정하기 쉽습니다.
  - 일간 성격 해설: `saju.ts`의 `DAYMASTER_TEXT`
  - 오행 균형 해설: `saju.ts`의 `EL_TRAIT`, `elementalInsight()`
  - 운세 문구: `dailyFortune.ts`의 `MSG`, `RELATION_INFO`
  - 타로 뜻풀이: `tarot.ts`의 `MAJOR`, `MINOR_RANKS`
  - 괘돌이 설명 문구: `guideReactions.ts`


## 알려진 제한 사항

- 만세력 계산은 근사 구현으로, 절기 기준일이 연도별로 최대 하루 정도 오차가 있을 수 있고 자시(23시~1시)
  경계 등 세부 규칙은 단순화되어 있습니다. 음력 생일은 라이브러리로 양력 변환한 뒤 계산합니다.
- 오락용 풀이이며, 실제 명리학·타로 상담을 대신하지 않습니다.
- 의존성 보안 알림은 시점에 따라 달라지므로 `npm audit`로 확인하세요. 2026-11-16 기준으로 `next`(및
  내부 번들 `postcss`), `sharp`, ESLint 관련 패키지에 알림이 있어, Next.js 등을 최신 패치 버전으로
  올리는 것을 권장합니다.
