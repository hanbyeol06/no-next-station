(function (root) {
  "use strict";

  var buckets = {
    locales: Object.create(null),
    stations: Object.create(null),
    scenes: Object.create(null),
    packs: Object.create(null)
  };

  function freezeDeep(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freezeDeep(value[key]); });
    return Object.freeze(value);
  }

  root.NextStationData = {
    manifest: Object.freeze({
      schemaVersion: 1,
      manifestId: "MANIFEST-NEXT-STATION",
      defaultPackId: "PACK-NIGHT-01",
      packIds: Object.freeze(["PACK-NIGHT-01"]),
      scriptFiles: Object.freeze([
        "../game-data/locales/ko.js",
        "../game-data/stations/station-04.js",
        "../game-data/scenes/station-04-common.js",
        "../game-data/packs/night-shift-01.js"
      ])
    }),
    buckets: buckets,
    register: function (kind, id, value) {
      if (!Object.prototype.hasOwnProperty.call(buckets, kind)) {
        throw new Error("등록할 수 없는 콘텐츠 종류: " + kind);
      }
      if (buckets[kind][id]) throw new Error("중복 콘텐츠 ID: " + id);
      buckets[kind][id] = freezeDeep(value);
    }
  };
}(window));
