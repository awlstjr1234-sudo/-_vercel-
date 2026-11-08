# 점괘방 (Next.js)

생년월일로 사주팔자를 풀이하고, 오늘의 운세와 타로점(직접 선택하는 오늘의 카드 / 3장 스프레드)을 볼 수 있는 웹앱입니다.
로그인과 결과 공유 기능은 없습니다 — 입력하면 API Routes가 계산해서 보여주고, 풀이 결과만 익명으로 Supabase에 기록합니다.

- **프론트엔드**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **백엔드**: Next.js API Routes (`src/app/api/{saju,daily,tarot}/route.ts`)
- **데이터베이스**: Supabase (`readings` 테이블, 익명 풀이 기록)
- **배포**: Vercel + GitHub 연동

기존에 있던 순수 HTML/JS 버전은 `legacy-static/`에 참고용으로 남겨뒀습니다(실제 서비스에는 사용하지 않음).


## 폴더 구조

```
src/
  app/
    page.tsx            # 메인 화면 (탭: 프로필(사주/오늘의 운세/지정일 운세) / 타로)
    layout.tsx          # 공통 레이아웃 + 폰트
    globals.css         # Tailwind 불러오기 + 디자인 토큰(라이트/다크 색) + @theme 설정
    icon.svg            # 파비콘 (괘돌이)
    api/
      saju/route.ts     # POST /api/saju  — 사주 계산 + 기록
      daily/route.ts    # POST /api/daily — 오늘/지정일 운세 계산 + 기록
      tarot/route.ts    # POST /api/tarot — 뽑은 카드 검증 + 기록
  components/           # 화면 조각들 (입력 폼, 결과 뷰, 타로 카드, 괘돌이 도우미)
    ui.ts               # 버튼·탭·입력칸 등 반복되는 Tailwind 클래스 묶음
    TarotArtwork.tsx    # 라이더-웨이트 타로 카드 이미지 표시
  lib/
    saju.ts             # 사주팔자 계산 + 일간/오행 해설 텍스트
    dailyFortune.ts     # 띠 + 오늘 일진 합충형 기반 오늘의 운세
    tarot.ts            # 78장 타로 덱 + 카드 해설
    random.ts           # 시드 기반 난수와 카드 섞기
    calendar.ts         # 음력 → 양력 변환
    profiles.ts         # 프로필 localStorage 저장/불러오기
    guideReactions.ts   # 결과별 괘돌이 설명 문구
    api.ts              # 브라우저 → API Routes 호출 헬퍼
    supabaseServer.ts   # 서버 전용 Supabase 클라이언트 (익명 기록)
public/tarot/           # 라이더-웨이트 타로 78장 이미지
supabase/schema.sql     # readings 테이블 생성 SQL
postcss.config.mjs      # Tailwind CSS PostCSS 플러그인 설정
```

화면(컴포넌트)은 `/api/*`를 호출해 결과를 받아 렌더링합니다. 계산 로직은 순수 함수(`lib/*.ts`)라서
API 호출이 실패하면 같은 함수를 브라우저에서 직접 실행해 결과를 보여줍니다.

스타일은 Tailwind CSS 유틸리티 클래스로 컴포넌트 안에 작성합니다. 색은 `globals.css`의 CSS 변수를
`@theme`로 연결해 `bg-surface`, `text-ink-muted`, `text-gold`, `bg-el-wood`처럼 쓰고, 다크 모드는 OS
설정에 따라 변수 값만 바뀝니다.
태어난 시간은 `1914`처럼 숫자 네 자리만 입력해도 `19:14`로 자동 표시되고, 타로는 펼쳐진 카드 중 직접 선택합니다.
타로 이미지는 퍼블릭 도메인 라이더-웨이트-스미스 덱을 사용하며, 자세한 출처는
[`public/tarot/CREDITS.md`](./public/tarot/CREDITS.md)에 있습니다.


## 1. 로컬 개발

```bash
npm install
npm run dev
```

`http://localhost:3000` 접속하면 바로 사용할 수 있습니다. Supabase 환경변수가 없어도 동작하며, 이 경우 풀이 기록만 저장하지 않습니다(아래 "Supabase 연결" 참고).


## 2. Vercel + GitHub로 배포

1. 이 프로젝트를 GitHub 저장소에 push 합니다.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com)에서 **Add New → Project**로 방금 만든 GitHub 저장소를 가져옵니다.
   Framework Preset은 Next.js가 자동으로 잡히고, Deploy할 수 있습니다. 풀이 기록을 남기려면 Project Settings > Environment Variables에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 추가하세요.
3. 이후 `main` 브랜치에 push할 때마다 Vercel이 자동으로 다시 빌드/배포합니다(GitHub 연동 기본 동작).


## 3. VS Code + Claude Code로 이어서 개발하기

- VS Code에서 이 저장소 폴더를 열고 Claude Code 확장을 사용하면 됩니다.
- 프로젝트 맥락은 `CLAUDE.md`에 정리해뒀습니다 (구조, 규칙, 자주 건드릴 파일 위치).
- 텍스트 콘텐츠(일간 해설, 타로 카드 뜻풀이, 운세 문구 등)는 전부 `src/lib/*.ts` 안의 데이터 객체라서,
  디자인/레이아웃 코드를 건드리지 않고도 내용만 늘리거나 수정하기 쉽습니다.


## 알려진 제한 사항

- 만세력 계산은 근사 구현으로, 절기 기준일이 연도별로 최대 하루 정도 오차가 있을 수 있고 음력 생일·자시
  경계 등은 단순화되어 있습니다.
- `npm audit` 결과 Next.js가 내부적으로 번들링하는 `postcss`에 대한 낮은 실사용 위험도의 취약점 알림이
  하나 남아 있습니다(빌드 도구 자체의 이슈로, 이 프로젝트에는 악용 경로가 없습니다). Next.js가 이후
  버전에서 postcss를 올리면 함께 해결됩니다.

## Supabase 연결 (익명 풀이 기록)

로그인 없이, 풀이 결과만 익명으로 `readings` 테이블에 쌓습니다. 이름과 생년월일은 저장하지 않습니다.

1. Supabase에서 프로젝트를 만들고 SQL Editor에서 `supabase/schema.sql`을 실행합니다.
2. `.env.example`을 `.env.local`로 복사해 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 채웁니다 (Settings > API).
3. `npm run dev`를 다시 시작합니다. API 응답의 `saved: true`로 기록 여부를 확인할 수 있습니다.

서비스 롤 키는 서버(API Routes)에서만 쓰이므로 `NEXT_PUBLIC_` 접두어를 붙이지 마세요.
