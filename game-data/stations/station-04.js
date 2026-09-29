(function (root) {
  "use strict";

  root.NextStationData.register("stations", "STATION-04", {
    schemaVersion: 1,
    stationId: "STATION-04",
    routeId: "ROUTE-04",
    nameKey: "ui.shiftLabel",
    sceneTemplateId: "SCENE-TEMPLATE-STATION-04",
    feedIds: ["FEED-EXIT-02", "FEED-PLATFORM-03", "FEED-STAFF-HALL"],
    views: [
      { viewId: "VIEW-CCTV", labelKey: "ui.view.cctv" },
      { viewId: "VIEW-OPERATIONS", labelKey: "ui.view.operations" },
      { viewId: "VIEW-CALLS", labelKey: "ui.view.calls" },
      { viewId: "VIEW-RULES", labelKey: "ui.view.rules" }
    ],
    feeds: [
      { feedId: "FEED-EXIT-02", cameraId: "C01", labelKey: "feed.exit.label", shortLabelKey: "feed.exit.short", captionKey: "feed.exit.caption", sceneId: "SCENE-EXIT-02", assetId: "ASSET-ENV-EXIT-02" },
      { feedId: "FEED-PLATFORM-03", cameraId: "C02", labelKey: "feed.platform.label", shortLabelKey: "feed.platform.short", captionKey: "feed.platform.caption", sceneId: "SCENE-PLATFORM-03", assetId: "ASSET-ENV-PLATFORM-03" },
      { feedId: "FEED-STAFF-HALL", cameraId: "C03", labelKey: "feed.hall.label", shortLabelKey: "feed.hall.short", captionKey: "feed.hall.caption", sceneId: "SCENE-STAFF-HALL", assetId: "ASSET-ENV-STAFF-HALL" }
    ]
  });
}(window));
