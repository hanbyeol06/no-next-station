(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};

  function setText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function renderWelcome(content) {
    setText("brandTitle", content.locale.messages["ui.brand"]);
    setText("welcomeTitle", content.locale.messages[content.pack.shift.titleKey]);
    setText("welcomeIntro", content.locale.messages[content.pack.shift.introKey]);
    setText("welcomeRulesIntro", content.locale.messages[content.pack.shift.rulesIntroKey]);
    setText("welcomeEndNote", content.locale.messages[content.pack.shift.endNoteKey]);
    setText("welcomeTime", content.locale.messages["shift.estimatedTime"]);
    setText("welcomeRuleHeading", content.locale.messages["rules.card.heading"]);
    var ruleList = document.getElementById("welcomeRules");
    ruleList.replaceChildren();
    ["shift.rules1", "shift.rules2", "shift.rules3"].forEach(function (key) {
      var item = document.createElement("li");
      item.textContent = content.locale.messages[key];
      ruleList.appendChild(item);
    });
  }

  function renderProgress(content, session) {
    var count = content.pack.incidents.length;
    var current = session.currentIncidentIndex;
    document.getElementById("progressCount").textContent =
      String(current + 1).padStart(2, "0") + " / " + String(count).padStart(2, "0");
    var steps = document.getElementById("progressSteps");
    steps.replaceChildren();
    content.pack.incidents.forEach(function (incident, index) {
      var dot = document.createElement("span");
      dot.className = "progress-step" + (index < current ? " is-done" : "") + (index === current ? " is-current" : "");
      dot.setAttribute("aria-hidden", "true");
      steps.appendChild(dot);
    });
  }

  function renderIncident(content, session) {
    var incident = runtime.Session.currentIncident(content, session);
    if (!incident) return;
    var title = document.getElementById("incidentTitle");
    title.textContent = content.locale.messages[incident.titleKey];
    title.dataset.incidentId = incident.incidentId;
    document.getElementById("callTime").textContent = incident.timeLabel;
    document.getElementById("cameraTimestamp").textContent = incident.timeLabel;
    document.getElementById("callerInfo").textContent = content.locale.messages[incident.caller.displayKey];
    document.getElementById("callQuote").textContent = content.locale.messages[incident.caller.messageKey];
    document.getElementById("callContext").textContent = content.locale.messages[incident.caller.contextKey];
    renderProgress(content, session);
    return title;
  }

  runtime.CallPanel = {
    renderWelcome: renderWelcome,
    renderIncident: renderIncident
  };
}(window));
