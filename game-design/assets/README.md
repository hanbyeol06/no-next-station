# 《다음 역은 없습니다》 생성 그래픽 에셋

**제작 방식:** 내장 ImageGen으로 래스터 이미지 생성·편집, UI 아이콘은 생성 시안 검수 후 SVG로 정리  
**기준 문서:** [그래픽 리소스 목록](../40_presentation/graphic-resources.md) · [생성 프롬프트](imagegen/PROMPTS.md)

## 장면 배경

아래 7개 PNG는 모두 **1672×941**이며 같은 CCTV 구도로 제작했다. HTML/CSS에서 16:9 화면에 맞춰 축소할 수 있다. 각각 전체 배경 이미지이므로 선택 상태에 따라 교체하는 시안이다. 원래 명세의 독립 SVG 레이어는 아직 아니다.

| ID/용도 | 파일 | 상태 |
|---|---|---|
| ENV-01 출구 열린 상태 | [exit02-base](imagegen/env-station04-exit02-base-v01.png) | 셔터가 없는 출구 홀 |
| ENV-01 출구 닫힌 상태 | [exit02-shutter-closed](imagegen/env-station04-exit02-shutter-closed-v01.png) | 내려온 셔터 |
| ENV-02 기본 승강장 | [platform03-base](imagegen/env-station04-platform03-base-v01.png) | 빈 선로 |
| ENV-02 잘못된 도착 방송 | [platform03-headlights](imagegen/env-station04-platform03-headlights-v01.png) | 터널 끝 두 불빛 |
| ENV-02 사라진 뒤 흔적 | [platform03-wet-rail](imagegen/env-station04-platform03-wet-rail-v01.png) | 불빛 없이 젖은 레일 |
| ENV-03 기본 복도 | [staffhall-base](imagegen/env-station04-staffhall-base-v01.png) | 닫힌 문 |
| ENV-03 문 개방 방송 | [staffhall-door-ajar](imagegen/env-station04-staffhall-door-ajar-v01.png) | 열린 틈 |

## 투명 인물·소품

| ID/용도 | 파일 | 상태 |
|---|---|---|
| CHAR-01 승강장 인물 | [passenger](imagegen/char-platform-passenger-v01.png) | 투명 PNG, 1536×1024. 거리·위치는 화면에서 조절 |
| CHAR-01 얼굴 소실 | [passenger-faceless](imagegen/char-platform-passenger-faceless-v01.png) | 같은 인물의 얼굴 소실 상태 |
| CHAR-02 복도 이상 인물 | [staffhall-figure](imagegen/char-staffhall-figure-v01.png) | 투명 PNG, 1024×1536 |
| PROP-01 젖은 손자국 | [wet-handprint](imagegen/prop-wet-handprint-v01.png) | 투명 PNG, CCTV 유리 오버레이 |
| PROP-01 시설 소품 시안 | [station-kit](imagegen/prop-station-kit-concept-v01.png) | 투명 시트. 개별 소품 분리와 장면 좌표 정합 필요 |

인물 PNG는 투명 여백이 넓다. 게임에서 실제 바닥 기준점과 크기를 확정할 때 여백·배치를 조정해야 한다. 배경 상태별 그림은 한 장면을 편집한 결과지만 픽셀 단위로 완전히 같다는 보장은 없으므로 교체 시 흔들림을 확인해야 한다.

## UI·VFX

- [UI 아이콘 생성 시안](imagegen/ui-icons-concept-v01.png)은 선에 잡음이 있어 런타임에 사용하지 않는다. 실제 24×24 SVG는 [ui 폴더](ui/)에 9종을 제작했다. 각 SVG는 `currentColor`를 사용하며 접근 가능한 이름은 HTML 버튼에 붙인다.
- [VFX 생성 시안](imagegen/vfx-cctv-atlas-concept-v01.png)은 **1448×1086**이다. [명세의 1024×768, 8×6, 128px 셀](../40_presentation/graphic-resources.md#4-vfx-스프라이트-시트-사양)을 충족하지 않아 애니메이션 아틀라스로 사용할 수 없다. 시각 방향 참고용이다.
- UI-02의 스캔라인·비네팅·상태 막대는 문서대로 CSS/HTML 요소이며 이미지 파일을 만들지 않았다. ENV-04 시작·종료 장식은 선택 제작(P2) 항목이다.

## 사용 전 확인

1. 사건별 선택 결과에 맞는 배경 상태와 투명 오버레이를 연결한다.
2. CCTV 캡션·운행표·표지판 문구는 이미지에 굽지 않고 UI 텍스트로 표시한다.
3. 실제 게임 크기에서 단서가 읽히는지 확인하고, 부족하면 장면의 명암과 오버레이 크기를 조정한다.
4. 레이어 분리와 정확한 VFX 아틀라스가 필요한 단계에서는 생성 시안을 제작 원본으로 삼아 별도 규격화한다.
