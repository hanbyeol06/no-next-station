(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};

  function loadScript(relativePath) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = new URL(relativePath, document.baseURI).href;
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error("콘텐츠 스크립트를 읽을 수 없습니다: " + relativePath)); };
      document.head.appendChild(script);
    });
  }

  function loadManifestScripts(manifest) {
    return manifest.scriptFiles.reduce(function (chain, path) {
      return chain.then(function () { return loadScript(path); });
    }, Promise.resolve());
  }

  function load() {
    var data = root.NextStationData;
    if (!data || !data.manifest || !data.buckets) {
      return Promise.reject(new Error("게임 데이터 manifest가 먼저 로드되어야 합니다."));
    }
    if (!Array.isArray(data.manifest.scriptFiles)) {
      return Promise.reject(new Error("manifest.scriptFiles: 스크립트 파일 경로 배열이 필요합니다."));
    }
    for (var index = 0; index < data.manifest.scriptFiles.length; index += 1) {
      if (typeof data.manifest.scriptFiles[index] !== "string" || !data.manifest.scriptFiles[index]) {
        return Promise.reject(new Error("manifest.scriptFiles[" + index + "]: 비어 있지 않은 파일 경로가 필요합니다."));
      }
    }
    return loadManifestScripts(data.manifest).then(function () {
      var packId = data.manifest.defaultPackId;
      var pack = data.buckets.packs[packId];
      var packRecord = pack && typeof pack === "object" ? pack : null;
      var station = packRecord && data.buckets.stations[packRecord.stationId];
      return {
        manifest: data.manifest,
        pack: pack || null,
        station: station || null,
        scene: station && data.buckets.scenes[station.sceneTemplateId] || null,
        locale: packRecord && data.buckets.locales[packRecord.localeId] || null
      };
    });
  }

  runtime.ContentLoader = { load: load };
}(window));
