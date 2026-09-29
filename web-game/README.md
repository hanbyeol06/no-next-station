# 다음 역은 없습니다 · 웹 실행판

첫 근무를 데이터 팩으로 구동하는 패키지 없는 브라우저 구현입니다. 기존 기준선 [horror-prototype/index.html](../horror-prototype/index.html)과 [horror-prototype/game.js](../horror-prototype/game.js)는 비교용으로 보존했습니다.

## 실행

web-game/index.html을 브라우저에서 직접 엽니다. 런타임은 외부 패키지와 fetch를 사용하지 않습니다. game-data/manifest.js에 등록된 순수 JavaScript 데이터 파일을 일반 스크립트로 차례로 불러오므로 로컬 file:// 실행을 지원합니다.

프로젝트 폴더 전체를 함께 배포해야 합니다. 현재 배경과 인물 이미지는 game-design/assets/imagegen/을 참조합니다. 해당 파일이 없거나 아직 준비되지 않은 에셋이면 벡터 장면 대체 요소가 표시됩니다.

## 구조와 규칙

- game-data/manifest.js: 기본 팩과 로드할 문구·역·장면·팩 스크립트 등록
- game-data/packs/: 호출, 증거, 선택, 효과, 결말 프로필
- game-data/stations/, game-data/scenes/: CCTV 피드와 720×405 장면 요소·허용 상태
- game-data/locales/: UI·사건·증거·결과 문구
- game-data/schemas/: manifest·팩·호출·역·장면·문구 필드 계약
- web-game/runtime/: 로더, 세션, 평가기, 결말 결정, 팩 검증
- web-game/ui/, web-game/renderers/: 화면 입력과 자료·장면·결과 렌더러
- web-game/assets/asset-manifest.js: 안정된 assetId와 실제 파일 경로 연결

팩의 콘텐츠 객체는 로드 뒤 동결됩니다. 실행 중에는 세션 상태만 바뀝니다. 선택은 선택지 ID로 찾아 적용합니다. 사건 ID, 문구, 배열 위치에 정답 분기가 없습니다. 허용 효과 타입은 set_scene_state, grant_flag, consume_flag, play_feedback입니다. JSON Schema 파일은 데이터 작성 계약으로 두고, 시작 전 브라우저 검증기도 같은 필수 참조·상태·점수 규칙을 확인합니다.

## 새 콘텐츠와 에셋 추가

1. 새 순수 데이터 파일을 game-data/packs/에 만듭니다. 근무·호출·증거·선택·효과·프로필 ID를 새로 발급하고 지원 중인 효과와 장면 상태만 참조합니다. 프로필에는 모든 선택이 기준에 맞았을 때의 `perfectRunEndingId`, 팩에는 `expectedPathDistribution`을 선언합니다.
2. 문구 키를 game-data/locales/ko.js에 추가합니다. 새 역이나 장면 템플릿이 필요할 때만 station/scene 데이터를 추가합니다.
3. game-data/manifest.js의 scriptFiles, packIds, defaultPackId에 새 팩을 등록합니다. 기존 규칙과 렌더 요소를 조합하는 한 런타임의 사건별 분기는 필요하지 않습니다.
4. 이미지가 준비되면 web-game/assets/asset-manifest.js에서 assetId의 src를 생성된 파일 경로에 연결하거나 교체합니다. 셔터·문처럼 상태별 모양이 달라지는 소품은 `states`의 해당 상태 경로를 채웁니다. 지금은 이 경로를 null로 두었으므로 벡터 대체 장면과 텍스트 캡션으로 플레이할 수 있습니다. 인물 에셋은 로딩이 실패해도 실루엣 대체 요소가 남습니다. 사건 데이터에는 파일 경로나 SVG/HTML 문자열을 넣지 않습니다.
5. 근무를 시작할 때 팩 검증기가 ID·참조·문구·출처·상태를 확인하고 3⁵개 경로 및 기록·잔향 조합의 결말을 검사합니다. 오류가 있으면 시작 버튼을 잠그고 ID와 필드 경로를 표시합니다.

## 현재 범위와 검수 기록

- 구현된 P0 흐름: 시작, 조사, 결과, 다음 호출, 종료, 재시작; 5개 호출과 15개 선택; ID 기반 점수·효과·로그; 결말 판정; 세 CCTV와 네 자료 탭; 키보드·터치 UI; 음향 기본 끔; 움직임 줄이기; asset ID 대체 렌더링.
- 앱 실행 시 자동 검증은 243개 선택 경로와 30개 기록 신뢰도·잔향 조합을 실행하고 기준 분포 정상 1, 보류 28, 미귀가 214를 비교합니다.
- 기존 기준선의 브라우저 실행 기록은 브라우저 도구의 file:// 차단으로 남기지 못했습니다. 같은 로컬 페이지를 우회해 여는 방법은 사용하지 않았습니다. 따라서 새 실행판도 이 작업에서 브라우저 수동 검수 및 320px 시각 확인까지 완료했다고 표시하지 않습니다.
- T17 관찰 플레이는 실제 참가자 5명이 필요한 후속 작업입니다. 기록을 만들어 내지 않았습니다.
- P2 VFX 스프라이트는 생성 전입니다. manifest에 선택 연결 지점을 마련했으며, 현재 장면은 해당 이미지 없이도 단서와 결과를 전달하도록 구성했습니다.

자세한 제품 규칙은 [game-design/README.md](../game-design/README.md)가 가리키는 00_vision–50_production 문서를 따릅니다.
