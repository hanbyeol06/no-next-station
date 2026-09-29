(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};

  function cloneArray(items) { return items ? items.slice() : []; }

  function create(content) {
    var sceneStates = Object.create(null);
    content.scene.components.forEach(function (component) {
      sceneStates[component.componentId] = component.initialState;
    });
    return {
      phase: "welcome",
      currentIncidentIndex: -1,
      currentViewId: "VIEW-CCTV",
      currentFeedId: null,
      currentChoiceId: null,
      recordTrust: content.pack.shift.startingRecordTrust,
      echo: content.pack.shift.startingEcho,
      flags: Object.create(null),
      sceneStates: sceneStates,
      pendingSceneTransitions: [],
      timelineEvents: [],
      choiceLog: [],
      viewedEvidenceByIncident: Object.create(null),
      ending: null
    };
  }

  function currentIncident(content, session) {
    return content.pack.incidents[session.currentIncidentIndex] || null;
  }

  function incidentIndex(content, incidentId) {
    return content.pack.incidents.findIndex(function (incident) { return incident.incidentId === incidentId; });
  }

  function applyDueTransitions(session, content, enteringIncident) {
    session.pendingSceneTransitions = session.pendingSceneTransitions.filter(function (pending) {
      var resolution = pending.resolution;
      if (!resolution || resolution.beforeIncidentId !== enteringIncident.incidentId) return true;
      session.sceneStates[pending.targetId] = resolution.state;
      if (resolution.residue) {
        session.sceneStates[resolution.residue.targetId] = resolution.residue.state;
      }
      session.timelineEvents.push({
        effectId: pending.effectId,
        incidentId: enteringIncident.incidentId,
        storyTime: resolution.storyTime,
        targetId: pending.targetId,
        state: resolution.state,
        residue: resolution.residue || null
      });
      return false;
    });
  }

  function enterIncident(session, content, index) {
    var incident = content.pack.incidents[index];
    applyDueTransitions(session, content, incident);
    session.currentIncidentIndex = index;
    session.currentChoiceId = null;
    session.currentFeedId = incident.primaryFeedId;
    session.currentViewId = "VIEW-CCTV";
    (incident.enterSceneStates || []).forEach(function (entry) {
      session.sceneStates[entry.componentId] = entry.state;
    });
  }

  function start(session, content) {
    if (session.phase !== "welcome") return false;
    session.phase = "investigation";
    enterIncident(session, content, 0);
    return true;
  }

  function advance(session, content) {
    if (session.phase !== "result") return false;
    var nextIndex = session.currentIncidentIndex + 1;
    if (nextIndex >= content.pack.incidents.length) {
      var profile = content.pack.profiles.find(function (item) { return item.profileId === content.pack.shift.profileId; });
      session.ending = runtime.EndingResolver.resolve(profile, {
        recordTrust: session.recordTrust,
        echo: session.echo
      });
      session.phase = "ending";
      return Boolean(session.ending);
    }
    enterIncident(session, content, nextIndex);
    session.phase = "investigation";
    return true;
  }

  function selectView(session, viewId, content) {
    if (session.phase !== "investigation" && session.phase !== "result") return false;
    if (!content.station.views.some(function (view) { return view.viewId === viewId; })) return false;
    session.currentViewId = viewId;
    return true;
  }

  function selectFeed(session, feedId, content) {
    if (session.phase !== "investigation" && session.phase !== "result") return false;
    if (!content.station.feeds.some(function (feed) { return feed.feedId === feedId; })) return false;
    session.currentFeedId = feedId;
    session.currentViewId = "VIEW-CCTV";
    return true;
  }

  function recordViewed(session, incident, evidenceIds) {
    if (session.phase !== "investigation" && session.phase !== "result") return;
    var stored = session.viewedEvidenceByIncident[incident.incidentId] || (session.viewedEvidenceByIncident[incident.incidentId] = []);
    evidenceIds.forEach(function (evidenceId) {
      if (incident.evidenceIds.indexOf(evidenceId) >= 0 && stored.indexOf(evidenceId) < 0) stored.push(evidenceId);
    });
  }

  function viewedEvidence(session, incidentId) {
    return cloneArray(session.viewedEvidenceByIncident[incidentId]);
  }

  runtime.Session = {
    create: create,
    currentIncident: currentIncident,
    start: start,
    advance: advance,
    selectView: selectView,
    selectFeed: selectFeed,
    recordViewed: recordViewed,
    viewedEvidence: viewedEvidence
  };
}(window));
