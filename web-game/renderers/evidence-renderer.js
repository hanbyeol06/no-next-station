(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};

  function appendText(parent, tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text;
    parent.appendChild(node);
    return node;
  }

  function card(content, evidence, viewed) {
    var article = document.createElement("article");
    article.className = "evidence-card" + (viewed ? " evidence-card--viewed" : "");
    var header = document.createElement("div");
    header.className = "evidence-card__header";
    var title = appendText(header, "h3", "evidence-card__title", content.locale.messages[evidence.titleKey]);
    title.id = "evidence-" + evidence.evidenceId;
    var badge = appendText(header, "span", "evidence-state", content.locale.messages[evidence.displayedStateKey]);
    article.setAttribute("aria-labelledby", title.id);
    header.appendChild(badge);
    article.appendChild(header);
    appendText(article, "p", "evidence-card__content", content.locale.messages[evidence.contentKey]);
    var meta = document.createElement("dl");
    meta.className = "evidence-meta";
    [
      [content.locale.messages["ui.evidenceSource"], content.locale.messages[evidence.sourceKey]],
      [content.locale.messages["ui.evidenceObserved"], evidence.observedAt],
      [content.locale.messages["ui.evidenceState"], content.locale.messages[evidence.displayedStateKey]]
    ].forEach(function (pair) {
      var item = document.createElement("div");
      var term = appendText(item, "dt", "", pair[0]);
      var detail = appendText(item, "dd", "", pair[1]);
      meta.appendChild(item);
    });
    article.appendChild(meta);
    if (viewed) appendText(article, "span", "evidence-viewed", content.locale.messages["ui.evidenceViewed"]);
    return article;
  }

  function renderCallerPanel(container, content, incident) {
    var panel = document.createElement("article");
    panel.className = "claim-card";
    appendText(panel, "p", "claim-card__label", content.locale.messages["ui.claimLabel"]);
    appendText(panel, "h3", "claim-card__caller", content.locale.messages[incident.caller.displayKey]);
    appendText(panel, "p", "claim-card__message", content.locale.messages[incident.caller.messageKey]);
    container.appendChild(panel);
  }

  function renderWorkLog(container, content, session) {
    var heading = document.createElement("h3");
    heading.className = "subsection-title";
    heading.textContent = content.locale.messages["ui.workLog"];
    container.appendChild(heading);
    if (!session.choiceLog.length) {
      appendText(container, "p", "empty-state", content.locale.messages["ui.noWorkLog"]);
      return;
    }
    session.choiceLog.forEach(function (entry) {
      var item = document.createElement("article");
      item.className = "work-log-item";
      appendText(item, "p", "work-log-item__meta", String(entry.order).padStart(2, "0") + " · " + entry.timeLabel);
      appendText(item, "p", "work-log-item__text", content.locale.messages[entry.logKey]);
      container.appendChild(item);
    });
  }

  function renderRules(container, content) {
    var cardNode = document.createElement("article");
    cardNode.className = "rules-card";
    appendText(cardNode, "p", "data-kicker", "SHIFT / 04");
    appendText(cardNode, "h3", "rules-card__heading", content.locale.messages["rules.card.heading"]);
    appendText(cardNode, "p", "rules-card__intro", content.locale.messages[content.pack.shift.rulesIntroKey]);
    var list = document.createElement("ol");
    ["shift.rules1", "shift.rules2", "shift.rules3"].forEach(function (key) {
      appendText(list, "li", "", content.locale.messages[key]);
    });
    cardNode.appendChild(list);
    appendText(cardNode, "p", "rules-card__ending", content.locale.messages[content.pack.shift.endNoteKey]);
    container.appendChild(cardNode);
  }

  function render(content, session) {
    var incident = runtime.Session.currentIncident(content, session);
    if (!incident) return;
    var area = document.getElementById("evidenceContent");
    var scenePanel = document.getElementById("cctvPanel");
    var cameraTabs = document.getElementById("cameraTabs");
    var caption = document.getElementById("sceneCaption");
    var viewId = session.currentViewId;

    area.replaceChildren();
    scenePanel.hidden = viewId !== "VIEW-CCTV";
    cameraTabs.hidden = viewId !== "VIEW-CCTV";
    if (viewId === "VIEW-CCTV") {
      runtime.StationSceneRenderer.render(document.getElementById("sceneStage"), caption, content, session);
    } else {
      caption.replaceChildren();
    }

    if (viewId === "VIEW-CALLS") renderCallerPanel(area, content, incident);
    if (viewId === "VIEW-RULES") renderRules(area, content);

    var cameraFeedId = session.currentFeedId;
    var visibleItems = content.pack.evidence.filter(function (item) {
      return incident.evidenceIds.indexOf(item.evidenceId) >= 0 &&
        item.viewId === viewId &&
        (viewId !== "VIEW-CCTV" || item.feedId === cameraFeedId);
    });
    runtime.Session.recordViewed(session, incident, visibleItems.map(function (item) { return item.evidenceId; }));
    visibleItems.forEach(function (item) {
      var viewed = runtime.Session.viewedEvidence(session, incident.incidentId).indexOf(item.evidenceId) >= 0;
      area.appendChild(card(content, item, viewed));
    });
    if (viewId === "VIEW-CALLS") renderWorkLog(area, content, session);
    if (viewId === "VIEW-CCTV" && visibleItems.length === 0) {
      appendText(area, "p", "empty-state", content.locale.messages["ui.cameraGeneric"]);
    } else if (viewId !== "VIEW-CALLS" && viewId !== "VIEW-RULES" && visibleItems.length === 0) {
      appendText(area, "p", "empty-state", content.locale.messages["ui.noEvidence"]);
    }
  }

  runtime.EvidenceRenderer = { render: render };
}(window));
