(function (root) {
  "use strict";

  // 에셋이 교체되면 콘텐츠의 assetId는 그대로 두고 이 표의 경로만 바꿉니다.
  root.NextStationAssets = Object.freeze({
    "ASSET-ENV-EXIT-02": { src: "../game-design/assets/imagegen/env-station04-exit02-base-v01.png" },
    "ASSET-ENV-PLATFORM-03": { src: "../game-design/assets/imagegen/env-station04-platform03-base-v01.png" },
    "ASSET-ENV-STAFF-HALL": { src: "../game-design/assets/imagegen/env-station04-staffhall-base-v01.png" },
    "ASSET-CHAR-PASSENGER": { src: "../game-design/assets/imagegen/char-platform-passenger-v01.png" },
    "ASSET-CHAR-STAFF-HALL": { src: "../game-design/assets/imagegen/char-staffhall-figure-v01.png" },
    "ASSET-PROP-EXIT-SHUTTER": { src: null, states: { closed: null, open: null } },
    "ASSET-PROP-STAFF-DOOR": { src: null, states: { locked: null, ajar: null } },
    "ASSET-VFX-CCTV-ATLAS": {
      src: null,
      frameWidth: 128,
      frameHeight: 128,
      columns: 8,
      rows: 6,
      frameCount: 48
    }
  });
}(window));
