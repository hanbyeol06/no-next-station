(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};

  function render(content, session) {
    var incident = runtime.Session.currentIncident(content, session);
    if (!incident) return;
    document.getElementById("callState").lastChild.textContent =
      " " + content.locale.messages[session.phase === "result" ? "ui.callRecorded" : "ui.callChecking"];
    var list = document.getElementById("responseList");
    list.replaceChildren();
    incident.choices.forEach(function (choice, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "response-option" + (session.currentChoiceId === choice.choiceId ? " is-selected" : "");
      button.dataset.choiceId = choice.choiceId;
      button.disabled = session.phase !== "investigation";
      button.setAttribute("aria-pressed", String(session.currentChoiceId === choice.choiceId));

      var number = document.createElement("span");
      number.className = "response-option__number";
      number.setAttribute("aria-hidden", "true");
      number.textContent = String(index + 1).padStart(2, "0");
      var text = document.createElement("span");
      text.className = "response-option__text";
      text.textContent = content.locale.messages[choice.textKey];
      var channel = document.createElement("span");
      channel.className = "response-option__channel";
      channel.textContent = content.locale.messages[choice.channel === "broadcast" ? "ui.broadcast" : "ui.withhold"];
      button.append(number, text, channel);
      list.appendChild(button);
    });

    var resultPanel = document.getElementById("resultPanel");
    resultPanel.hidden = session.phase !== "result";
    document.getElementById("nextButton").hidden = session.phase !== "result";
    if (session.phase === "result") {
      var isFinal = session.currentIncidentIndex === content.pack.incidents.length - 1;
      document.getElementById("nextButton").textContent =
        content.locale.messages[isFinal ? "ui.finishShift" : "ui.nextCall"];
    }
  }

  runtime.ResponsePanel = { render: render };
}(window));
