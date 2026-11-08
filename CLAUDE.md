# CLAUDE.md

이 파일은 VS Code의 Claude Code 확장이 이 저장소에서 작업할 때 참고하는 컨텍스트입니다.

## 프로젝트 개요

생년월일로 사주팔자를 풀이하고, 오늘의 운세와 타로점을 볼 수 있는 오락용 웹앱 "점괘방"입니다.
마스코트 "괘돌이"가 결과마다 원리를 설명해 주는 도우미 역할을 합니다.
로그인과 공유 링크는 없습니다 — 입력 → API Routes 계산 → 화면 표시, 그리고 익명 풀이 기록이 전부입니다.

- 프론트엔드: Next.js 15 (App Router), TypeScript, Tailwind CSS v4 (`postcss.config.mjs`, `src/app/globals.css`)
- 백엔드: Next.js API Routes (`src/app/api/{saju,daily,tarot}/route.ts`)
- 데이터베이스: Supabase (`readings` 테이블, 스키마는 `supabase/schema.sql`)
- 배포: Vercel + GitHub 연동(main 브랜치 push 시 자동 배포)

자세한 설정/배포 절차는 `README.md` 참고.

## 아키텍처 원칙 (바꿀 때 지켜야 할 것)

- **계산 로직은 순수 함수로, `src/lib/*.ts`에 둡니다.** `saju.ts`(사주), `dailyFortune.ts`(오늘의 운세),
  `tarot.ts`(타로), `random.ts`(시드 난수), `guideReactions.ts`(괘돌이 반응 문구)로 나뉩니다.
  API Routes는 입력을 검증하고 이 함수들을 호출할 뿐이고, UI 컴포넌트(`src/components/*Panel.tsx`)는
  `/api/*`를 호출해 상태에 담고 렌더링만 합니다. API 호출이 실패하면 같은 함수를 브라우저에서 직접 실행합니다.
- **로그인은 만들지 않습니다.** 프로필(이름·생년월일)은 브라우저 `localStorage`에만 저장합니다.
- **Supabase에는 익명 풀이 기록만 남깁니다.** 이름·생년월일은 저장하지 않습니다.
  Supabase는 서버(`src/lib/supabaseServer.ts`)에서만 서비스 롤 키로 접근하고, 키를 `NEXT_PUBLIC_`으로
  노출하지 마세요. 환경변수(`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)가 없으면 기록만 건너뜁니다.
- **스타일은 Tailwind CSS 유틸리티 클래스로 작성합니다.** 새 CSS 클래스를 `globals.css`에 추가하지 말고
  컴포넌트의 `className`에 쓰세요. 색은 `globals.css`의 CSS 변수(라이트/다크)를 `@theme`로 연결한 이름
  (`bg-bg`, `bg-surface`, `bg-surface-2`, `text-ink`, `text-ink-muted`, `border-border`, `text-accent`,
  `text-gold`, `bg-navy`, `bg-el-{wood,fire,earth,metal,water}`, `shadow-card`)을 씁니다.
  버튼·탭·입력칸처럼 반복되는 묶음은 `src/components/ui.ts`(`buttonClass()`, `tabClass`, `inputClass` 등)를 재사용하세요.
  Tailwind는 클래스 이름을 정적으로 찾으므로 `` `bg-el-${k}` `` 같은 동적 조합 대신 문자열 맵을 쓰세요.
- 결과 공유 링크는 이전에 넣었다가 제거한 기능입니다. 사용자가 다시 요청하기 전까지 추가하지 않습니다.

## 콘텐츠(텍스트) 위치

디자인/레이아웃을 건드리지 않고 문구만 수정하거나 늘리고 싶을 때 볼 위치:

- 일간(日干) 성격 해설: `src/lib/saju.ts`의 `DAYMASTER_TEXT`
- 오행 균형 해설: `src/lib/saju.ts`의 `EL_TRAIT`, `elementalInsight()`
- 오늘의 운세 문구: `src/lib/dailyFortune.ts`의 `MSG`, `RELATION_INFO`
- 타로 카드 뜻풀이: `src/lib/tarot.ts`의 `MAJOR`(메이저 22장), `MINOR_RANKS`(마이너 순위별 공통 해설)

## 자주 쓰는 명령

```bash
npm run dev     # 로컬 개발 서버
npm run build   # 프로덕션 빌드 (타입 체크 포함)
npm run lint    # ESLint
```

## 레거시

`legacy-static/`에 있던 원래의 단일 HTML(index.html) 버전은 참고용으로만 남겨둔 것이고, 더 이상
유지보수 대상이 아닙니다. 새 기능은 `src/` 아래 Next.js 코드에 추가하세요.
