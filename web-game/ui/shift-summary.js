(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};

  function text(parent, tag, className, value) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value;
    parent.appendChild(node);
    return node;
  }

  function evidenceDetails(parent, content, event) {
    var group = document.createElement("details");
    group.className = "log-evidence";
    var summary = document.createElement("summary");
    summary.textContent = content.locale.messages["ui.logEvidence"] + " (" + event.availableEvidenceIds.length + ")";
    group.appendChild(summary);
    var viewed = event.viewedEvidenceIds || [];
    event.availableEvidenceIds.forEach(function (evidenceId) {
      var item = content.pack.evidence.find(function (evidence) { return evidence.evidenceId === evidenceId; });
      if (!item) return;
      var card = document.createElement("article");
      card.className = "log-evidence__item";
      var wasViewed = viewed.indexOf(item.evidenceId) >= 0;
      var title = text(card, "h5", "", content.locale.messages[item.titleKey]);
      title.id = "log-evidence-" + event.order + "-" + item.evidenceId;
      text(card, "p", "log-evidence__content", content.locale.messages[item.contentKey]);
      var meta = [
        content.locale.messages[item.sourceKey],
        item.observedAt,
        content.locale.messages[item.displayedStateKey]
      ].join(" · ");
      text(card, "p", "log-evidence__meta", meta);
      text(card, "p", "log-evidence__viewed", content.locale.messages[wasViewed ? "ui.evidenceViewed" : "ui.evidenceAvailable"]);
      card.setAttribute("aria-labelledby", title.id);
      group.appendChild(card);
    });
    parent.appendChild(group);

    if (viewed.length) {
      var opened = document.createElement("details");
      opened.className = "log-evidence log-evidence--opened";
      var openedSummary = document.createElement("summary");
      openedSummary.textContent = content.locale.messages["ui.logDirectEvidence"] + " (" + viewed.length + ")";
      opened.appendChild(openedSummary);
      viewed.forEach(function (evidenceId) {
        var item = content.pack.evidence.find(function (evidence) { return evidence.evidenceId === evidenceId; });
        if (!item) return;
        text(opened, "p", "log-evidence__opened-item", content.locale.messages[item.titleKey] + " · " + item.observedAt);
      });
      parent.appendChild(opened);
    }
  }

  function render(content, session) {
    var ending = session.ending;
    if (!ending) return;
    document.getElementById("endingTitle").textContent = content.locale.messages[ending.titleKey];
    document.getElementById("endingCopy").textContent = content.locale.messages[ending.copyKey];
    document.getElementById("endingRecordTrust").textContent = String(session.recordTrust) + " / 5";
    document.getElementById("endingEcho").textContent = String(session.echo) + " / 4";
    document.getElementById("endingVerdict").textContent = content.locale.messages[ending.titleKey];

    var list = document.getElementById("endingLog");
    list.replaceChildren();
    session.choiceLog.forEach(function (event) {
      var incident = content.pack.incidents.find(function (item) { return item.incidentId === event.incidentId; });
      var choice = incident.choices.find(function (item) { return item.choiceId === event.choiceId; });
      var article = document.createElement("article");
      article.className = "ending-entry";
      var heading = text(article, "h3", "ending-entry__title",
        String(event.order).padStart(2, "0") + " · " + event.timeLabel + " · " + content.locale.messages[incident.titleKey]);
      heading.id = "ending-entry-" + event.order;
      text(article, "p", "ending-entry__choice", content.locale.messages[choice.channel === "broadcast" ? "ui.broadcast" : "ui.withhold"] + " · " + content.locale.messages[choice.textKey]);
      var judgement = content.locale.messages[event.judgement === "matched" ? "ui.logMatched" : "ui.logUnmatched"];
      text(article, "p", "ending-entry__judgement", judgement + " · " + content.locale.messages[event.logKey]);
      var scoreLine = "기록 신뢰도 +" + event.appliedRecordTrustDelta +
        " · 잔향 원래 변화 +" + event.echoDelta + " / 실제 적용 +" + event.appliedEchoDelta;
      text(article, "p", "ending-entry__scores", scoreLine);
      evidenceDetails(article, content, event);
      article.setAttribute("aria-labelledby", heading.id);
      list.appendChild(article);
    });
  }

  runtime.ShiftSummary = { render: render };
}(window));
