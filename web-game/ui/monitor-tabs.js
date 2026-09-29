(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};

  function render(content, session) {
    var viewTabs = document.getElementById("viewTabs");
    var cameraTabs = document.getElementById("cameraTabs");
    viewTabs.replaceChildren();
    cameraTabs.replaceChildren();

    var viewList = document.createElement("div");
    viewList.className = "tab-list";
    viewList.setAttribute("role", "tablist");
    viewList.setAttribute("aria-label", "관제 자료 화면");
    content.station.views.forEach(function (view) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "view-tab";
      button.dataset.viewId = view.viewId;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(session.currentViewId === view.viewId));
      button.tabIndex = session.currentViewId === view.viewId ? 0 : -1;
      button.setAttribute("aria-controls", "evidencePanel");
      button.id = "tab-" + view.viewId;
      button.textContent = content.locale.messages[view.labelKey];
      viewList.appendChild(button);
    });
    viewTabs.appendChild(viewList);
    document.getElementById("evidencePanel").setAttribute("aria-labelledby", "tab-" + session.currentViewId);

    var cameraList = document.createElement("div");
    cameraList.className = "camera-list";
    cameraList.setAttribute("role", "group");
    cameraList.setAttribute("aria-label", content.locale.messages["ui.cameraHeading"]);
    content.station.feeds.forEach(function (feed) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "camera-tab";
      button.id = "camera-" + feed.feedId;
      button.dataset.feedId = feed.feedId;
      button.setAttribute("aria-pressed", String(session.currentFeedId === feed.feedId));
      button.textContent = content.locale.messages[feed.shortLabelKey];
      cameraList.appendChild(button);
    });
    cameraTabs.appendChild(cameraList);
  }

  runtime.MonitorTabs = { render: render };
}(window));
