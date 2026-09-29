(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};
  var content = null;
  var session = null;
  var validation = null;

  function show(elementId, visible) {
    document.getElementById(elementId).hidden = !visible;
  }

  function renderValidation(result) {
    var status = document.getElementById("validationStatus");
    var details = document.getElementById("validationDetails");
    var list = document.getElementById("validationIssues");
    var messages = content && content.locale && content.locale.messages ? content.locale.messages : {};
    list.replaceChildren();
    status.textContent = result.issues.length
      ? (messages["ui.validationFail"] || "콘텐츠 검사 실패")
      : (messages["ui.validationPass"] || "콘텐츠 검사 완료");
    status.classList.toggle("validation-status--error", result.issues.length > 0);
    status.classList.toggle("validation-status--ok", result.issues.length === 0);

    if (result.report) {
      var profile = content.pack.profiles.find(function (item) { return item.profileId === content.pack.shift.profileId; });
      var pathLine = document.createElement("li");
      pathLine.textContent = messages["ui.validationPaths"] + ": " +
        result.report.completedPaths + " / " + result.report.pathCount;
      list.appendChild(pathLine);
      var comboLine = document.createElement("li");
      comboLine.textContent = messages["ui.validationEndings"] + ": " +
        result.report.scoreCombinations + "개 기록·잔향 조합";
      list.appendChild(comboLine);
      Object.keys(result.report.endingDistribution).sort().forEach(function (endingId) {
        var ending = profile.endings.find(function (item) { return item.endingId === endingId; });
        var item = document.createElement("li");
        item.textContent = (ending ? messages[ending.titleKey] : endingId) + ": " + result.report.endingDistribution[endingId];
        list.appendChild(item);
      });
      var evidenceLine = document.createElement("li");
      evidenceLine.textContent = messages["ui.validationEvidence"] + ": " + content.pack.evidence.length + "개 자료 등록";
      list.appendChild(evidenceLine);
      var expectedLine = document.createElement("li");
      expectedLine.textContent = messages["validation.expected"];
      list.appendChild(expectedLine);
    }
    result.issues.forEach(function (item) {
      var row = document.createElement("li");
      row.className = "validation-issue";
      var location = document.createElement("code");
      location.textContent = item.path;
      var explanation = document.createElement("span");
      explanation.textContent = item.message;
      row.append(location, explanation);
      list.appendChild(row);
    });
    details.hidden = false;
    details.open = result.issues.length > 0;
    document.getElementById("startButton").disabled = result.issues.length > 0;
  }

  function render() {
    show("welcomePanel", session.phase === "welcome");
    show("workPanel", session.phase === "investigation" || session.phase === "result");
    show("endingPanel", session.phase === "ending");
    runtime.CallPanel.renderWelcome(content);

    if (session.phase === "investigation" || session.phase === "result") {
      runtime.CallPanel.renderIncident(content, session);
      runtime.MonitorTabs.render(content, session);
      runtime.EvidenceRenderer.render(content, session);
      runtime.ResponsePanel.render(content, session);
      runtime.FeedbackRenderer.render(content, session);
    } else if (session.phase === "ending") {
      runtime.ShiftSummary.render(content, session);
    }
  }

  function focusIncident() {
    var heading = document.getElementById("incidentTitle");
    if (heading) heading.focus({ preventScroll: true });
  }

  function startShift() {
    if (validation.issues.length || session.phase !== "welcome") return;
    runtime.Session.start(session, content);
    render();
    focusIncident();
  }

  function choose(choiceId) {
    var result = runtime.Evaluation.choose(session, content, choiceId);
    if (!result.applied) return;
    result.cues.forEach(runtime.FeedbackRenderer.playCue);
    render();
    document.getElementById("resultLabel").focus({ preventScroll: true });
  }

  function continueShift() {
    if (session.phase !== "result") return;
    runtime.Session.advance(session, content);
    render();
    if (session.phase === "investigation") focusIncident();
    else if (session.phase === "ending") document.getElementById("endingTitle").focus({ preventScroll: true });
  }

  function restart() {
    session = runtime.Session.create(content);
    render();
    document.getElementById("startButton").focus({ preventScroll: true });
  }

  function isInteractiveFocus(event) {
    var selector = "button, a, input, select, textarea, summary, [contenteditable='true'], [role='tab']";
    var target = event.target && event.target.closest ? event.target.closest(selector) : null;
    var active = document.activeElement && document.activeElement.closest ? document.activeElement.closest(selector) : null;
    return Boolean(target || active);
  }

  function handleShortcut(event) {
    if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (session.phase !== "investigation" || isInteractiveFocus(event)) return;
    if (!/^[1-3]$/.test(event.key)) return;
    var incident = runtime.Session.currentIncident(content, session);
    var choice = incident.choices[Number(event.key) - 1];
    if (!choice) return;
    event.preventDefault();
    choose(choice.choiceId);
  }

  function bind() {
    document.getElementById("startButton").addEventListener("click", startShift);
    document.getElementById("nextButton").addEventListener("click", continueShift);
    document.getElementById("restartButton").addEventListener("click", restart);
    document.getElementById("responseList").addEventListener("click", function (event) {
      var button = event.target.closest("[data-choice-id]");
      if (button && !button.disabled) choose(button.dataset.choiceId);
    });
    document.getElementById("viewTabs").addEventListener("click", function (event) {
      var button = event.target.closest("[data-view-id]");
      if (!button || !runtime.Session.selectView(session, button.dataset.viewId, content)) return;
      render();
      var activeTab = document.getElementById("tab-" + button.dataset.viewId);
      if (activeTab) activeTab.focus({ preventScroll: true });
    });
    document.getElementById("viewTabs").addEventListener("keydown", function (event) {
      var current = event.target.closest("[role='tab']");
      if (!current) return;
      var tabs = Array.from(document.querySelectorAll("#viewTabs [role='tab']"));
      var currentIndex = tabs.indexOf(current);
      var nextIndex = currentIndex;
      if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (currentIndex + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[nextIndex].click();
    });
    document.getElementById("cameraTabs").addEventListener("click", function (event) {
      var button = event.target.closest("[data-feed-id]");
      if (!button || !runtime.Session.selectFeed(session, button.dataset.feedId, content)) return;
      render();
      var activeCamera = document.getElementById("camera-" + button.dataset.feedId);
      if (activeCamera) activeCamera.focus({ preventScroll: true });
    });
    document.getElementById("soundToggle").addEventListener("click", function () {
      runtime.FeedbackRenderer.toggleSound(content);
    });
    document.getElementById("motionToggle").addEventListener("click", function () {
      runtime.FeedbackRenderer.toggleMotion(content);
    });
    document.addEventListener("keydown", handleShortcut);
  }

  function showFatalError(error) {
    var panel = document.getElementById("fatalError");
    panel.hidden = false;
    document.getElementById("fatalErrorCopy").textContent = error && error.message ? error.message : String(error);
    document.getElementById("startButton").disabled = true;
  }

  function initialize(loadedContent) {
    content = loadedContent;
    validation = runtime.ContentValidator.validate(content);
    if (validation.issues.length) {
      show("welcomePanel", true);
      show("workPanel", false);
      show("endingPanel", false);
      renderValidation(validation);
      return;
    }
    session = runtime.Session.create(content);
    runtime.CallPanel.renderWelcome(content);
    renderValidation(validation);
    runtime.FeedbackRenderer.setSound(false, content);
    runtime.FeedbackRenderer.setMotionReduced(runtime.FeedbackRenderer.prefersReducedMotion(), content);
    bind();
    render();
  }

  runtime.IncidentFlow = {
    initialize: initialize,
    showFatalError: showFatalError
  };
}(window));
