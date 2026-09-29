# 《다음 역은 없습니다》 게임 기획 문서

**기획 기준:** 웹 프로토타입을 바탕으로 한 확장 설계  
**문서 버전:** 1.1-review · 2026-09-28

## 기획 문서 구조

    game-design/
      README.md
      ACCEPTANCE.md
      00_vision/
        game-overview.md
      10_gameplay/
        core-loop.md
      20_systems/
        증거-판정-엔딩.md
      30_content/
        content-architecture.md
        episode-01.md
      40_presentation/
        ui-and-audio.md
        graphic-resources.md
      assets/
        README.md
        imagegen/
        ui/
      50_production/
        roadmap.md
        review-2026-09-28.md
      templates/
        call-template.md
      90_references/
        README.md
        superseded/
          게임-역기획서.md
          데이터-기반-콘텐츠-확장-기획.md

## 문서 안내

| 문서 | 책임 |
|---|---|
| [게임 개요](00_vision/game-overview.md) | 플레이어 약속, 장르, 대상 경험, 범위와 성공 기준 |
| [핵심 루프와 조작](10_gameplay/core-loop.md) | 한 호출의 행동 순서, 입력, 게임 상태와 진행 |
| [증거·판정·엔딩](20_systems/증거-판정-엔딩.md) | 정보 신뢰, 선택 판정, 기록 신뢰도, 잔향, 결말 |
| [콘텐츠·데이터 구조](30_content/content-architecture.md) | 팩/근무/사건/증거 구조와 데이터 전용 확장 경계 |
| [첫 번째 근무 구성](30_content/episode-01.md) | 현재 5개 호출의 사건 흐름, 단서와 선택 |
| [UI·아트·오디오](40_presentation/ui-and-audio.md) | 화면 역할, 시각·음향 규칙, 반응형·접근성 원칙 |
| [그래픽 리소스 목록](40_presentation/graphic-resources.md) | 필요한 그래픽 에셋, 제작 우선순위와 VFX 스프라이트 시트 사양 |
| [생성 그래픽 에셋](assets/README.md) | ImageGen 배경·인물·소품 시안과 사용 가능한 SVG 아이콘 |
| [제작 로드맵](50_production/roadmap.md) | 프로토타입에서 데이터 기반 버전으로 옮기는 단계와 완료 조건 |
| [기획 검수 기록](50_production/review-2026-09-28.md) | 발견한 문제, 반영한 결정, 프로토타입 구현에 남은 작업 |
| [수용 기준](ACCEPTANCE.md) | 첫 근무의 기능·콘텐츠·표현 검증 항목과 판정 기록 양식 |
| [호출 작성 템플릿](templates/call-template.md) | 새 사건을 기획할 때 사용하는 표준 입력 양식 |

## 문서 사용 원칙

- 이 폴더의 00–50 문서가 목표 설계의 정본이다. 현재 브라우저 프로토타입의 동작을 설명하는 보관 역기획서와 목표 규칙이 다르면 목표 설계가 우선한다.
- superseded 폴더는 이전 초안과 관찰 기록을 보존하는 곳이며, 요구사항 판단에 사용하지 않는다. 검수 기록은 차이와 인계 항목을 설명하지만 규칙의 정본은 아니다.
- 조사 자료는 배경 근거이고 제품 규칙의 정본이 아니다. 레거시 갤러그 스펙은 프로젝트 archive에 보관되어 있으며 이 게임에 적용하지 않는다.
- 시스템 규칙은 한 문서에만 권위 있게 정의한다. 다른 문서는 해당 문서를 링크한다.
- 사건에는 안정적인 ID를 부여한다. 예: CALL-01-001, EVID-01-001, END-01-A.
- 기능 변경 시 먼저 해당 문서의 규칙을 고친 뒤, 데이터와 구현을 같은 규칙에 맞춘다.
- 새 사건은 호출 작성 템플릿을 복사해 작성하고, 콘텐츠·데이터 구조의 검증 항목을 충족해야 한다.

## 프로젝트 상위 구조 제안

기획·콘텐츠·실행 코드를 함께 관리할 경우 아래 구조를 권장한다. 현재 존재하는 research와 horror-prototype은 유지하고, 데이터 기반 구현 단계에서 game-data와 web-game 내부 코드를 분리한다.

    project-root/
      research/                  조사 및 사례 분석
      game-design/               이 폴더의 요구사항과 설계 문서
      game-data/                 에피소드, 호출, 장면, 현지화 데이터
      horror-prototype/          현재 단일 페이지 플레이어블 기준선
      web-game/                  분리 이후의 실행 코드와 정적 자산

기획 문서가 게임 데이터 파일이나 런타임 코드 안에 중복되지 않게 한다. 기획은 원칙과 규칙을, game-data는 실행 가능한 사건 내용을, web-game은 공통 동작과 화면을 소유한다.
