(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function applyEffect(session, effect, incident) {
    if (effect.type === "set_scene_state") {
      session.sceneStates[effect.targetId] = effect.state;
      if (effect.persistence === "temporary") {
        session.pendingSceneTransitions.push({
          effectId: effect.effectId,
          sourceIncidentId: incident.incidentId,
          targetId: effect.targetId,
          state: effect.state,
          resolution: effect.resolution
        });
      }
      return null;
    }
    if (effect.type === "grant_flag") {
      session.flags[effect.flagId] = true;
      return null;
    }
    if (effect.type === "consume_flag") {
      session.flags[effect.flagId] = false;
      return null;
    }
    if (effect.type === "play_feedback") return effect.cueId;
    return null;
  }

  function choose(session, content, choiceId) {
    if (session.phase !== "investigation") return { applied: false, reason: "phase-locked" };
    var incident = runtime.Session.currentIncident(content, session);
    if (!incident) return { applied: false, reason: "no-current-incident" };
    var choice = incident.choices.find(function (item) { return item.choiceId === choiceId; });
    if (!choice) return { applied: false, reason: "unknown-choice" };

    // Lock synchronously before touching scores or effects so rapid input cannot commit twice.
    session.phase = "result";
    session.currentChoiceId = choice.choiceId;
    var profile = content.pack.profiles.find(function (item) { return item.profileId === content.pack.shift.profileId; });
    var previousTrust = session.recordTrust;
    var previousEcho = session.echo;
    session.recordTrust = clamp(previousTrust + choice.recordTrustDelta, profile.recordTrust.minimum, profile.recordTrust.maximum);
    session.echo = clamp(previousEcho + choice.echoDelta, profile.echo.minimum, profile.echo.cap);

    var cues = [];
    choice.effectIds.forEach(function (effectId) {
      var effect = content.pack.effects.find(function (item) { return item.effectId === effectId; });
      var cue = applyEffect(session, effect, incident);
      if (cue) cues.push(cue);
    });

    var event = {
      incidentId: incident.incidentId,
      choiceId: choice.choiceId,
      timeLabel: incident.timeLabel,
      order: session.choiceLog.length + 1,
      judgement: choice.judgement,
      channel: choice.channel,
      recordTrustDelta: choice.recordTrustDelta,
      appliedRecordTrustDelta: session.recordTrust - previousTrust,
      echoDelta: choice.echoDelta,
      appliedEchoDelta: session.echo - previousEcho,
      resultKey: choice.feedbackKey,
      logKey: choice.logKey,
      availableEvidenceIds: incident.evidenceIds.slice(),
      viewedEvidenceIds: runtime.Session.viewedEvidence(session, incident.incidentId)
    };
    session.choiceLog.push(event);
    return { applied: true, event: event, cues: cues };
  }

  runtime.Evaluation = { choose: choose };
}(window));
