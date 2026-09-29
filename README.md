# 다음 역은 없습니다

야간 관제실에서 CCTV와 운행 기록을 대조해 다섯 번의 호출을 처리하는 브라우저 공포 게임입니다.

[게임 바로 플레이](https://hanbyeol06.github.io/no-next-station/)

## 실행

GitHub Pages에서 바로 플레이하거나, 저장소를 내려받아 `web-game/index.html`을 브라우저에서 직접 여세요. 별도 패키지나 로컬 서버가 필요하지 않습니다.

## 구성

- `web-game/`: 브라우저 UI, 세션 런타임, 렌더러, 에셋 manifest
- `game-data/`: 첫 근무 콘텐츠, 한국어 문구, 역·장면 데이터 및 스키마
- `game-design/`: 기준 기획 문서와 생성 이미지 에셋
- `horror-prototype/`: 구현 전 시제품 기준선
- `.github/workflows/pages.yml`: Pages용 정적 파일 묶기와 자동 배포

장면 에셋은 `game-design/assets/imagegen/`에 둡니다. 새 파일을 게임에 연결할 때는 `web-game/assets/asset-manifest.js`에서 `assetId`의 경로를 지정하세요. 셔터·문 상태별 대체 경로도 같은 manifest에 준비되어 있습니다.

## 검수 상태

데이터 검증기와 전체 선택 경로 검증을 구현했습니다. Acceptance의 데스크톱·320px 브라우저 수동 검수(T15)와 5명 관찰 플레이(T17)는 아직 완료되지 않았습니다. VFX 아틀라스는 선택 제작 항목이며 현재 게임은 해당 효과 없이 동작합니다.
