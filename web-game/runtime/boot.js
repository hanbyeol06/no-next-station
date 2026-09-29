(function (root) {
  "use strict";

  function start() {
    root.NextStationGame.ContentLoader.load()
      .then(function (content) { root.NextStationGame.IncidentFlow.initialize(content); })
      .catch(function (error) { root.NextStationGame.IncidentFlow.showFatalError(error); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
}(window));
