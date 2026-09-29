(function (root) {
  "use strict";

  var evidence = [
    { evidenceId: "EVID-01-001-A", incidentId: "CALL-01-001", schemaVersion: 1, sourceId: "SOURCE-CCTV-C01", sourceKey: "source.cctv.exit", observedAt: "00:16", displayedStateKey: "state.observed", viewId: "VIEW-CCTV", feedId: "FEED-EXIT-02", preAccessible: true, titleKey: "evidence.EVID-01-001-A.title", contentKey: "evidence.EVID-01-001-A.content" },
    { evidenceId: "EVID-01-001-B", incidentId: "CALL-01-001", schemaVersion: 1, sourceId: "SOURCE-FACILITY-LOG", sourceKey: "source.facility", observedAt: "00:10", displayedStateKey: "state.closed", viewId: "VIEW-OPERATIONS", preAccessible: true, titleKey: "evidence.EVID-01-001-B.title", contentKey: "evidence.EVID-01-001-B.content" },
    { evidenceId: "EVID-01-002-A", incidentId: "CALL-01-002", schemaVersion: 1, sourceId: "SOURCE-TRAIN-SCHEDULE", sourceKey: "source.schedule", observedAt: "00:05 / 00:21", displayedStateKey: "state.cancelled", viewId: "VIEW-OPERATIONS", preAccessible: true, titleKey: "evidence.EVID-01-002-A.title", contentKey: "evidence.EVID-01-002-A.content" },
    { evidenceId: "EVID-01-002-B", incidentId: "CALL-01-002", schemaVersion: 1, sourceId: "SOURCE-VIBRATION-SENSOR", sourceKey: "source.sensor", observedAt: "00:25", displayedStateKey: "state.sensorNormal", viewId: "VIEW-OPERATIONS", preAccessible: true, titleKey: "evidence.EVID-01-002-B.title", contentKey: "evidence.EVID-01-002-B.content" },
    { evidenceId: "EVID-01-002-C", incidentId: "CALL-01-002", schemaVersion: 1, sourceId: "SOURCE-CCTV-C02", sourceKey: "source.cctv.platform", observedAt: "00:26", displayedStateKey: "state.observed", viewId: "VIEW-CCTV", feedId: "FEED-PLATFORM-03", preAccessible: true, titleKey: "evidence.EVID-01-002-C.title", contentKey: "evidence.EVID-01-002-C.content" },
    { evidenceId: "EVID-01-003-A", incidentId: "CALL-01-003", schemaVersion: 1, sourceId: "SOURCE-CCTV-C02", sourceKey: "source.cctv.platform", observedAt: "00:35", displayedStateKey: "state.observed", viewId: "VIEW-CCTV", feedId: "FEED-PLATFORM-03", preAccessible: true, titleKey: "evidence.EVID-01-003-A.title", contentKey: "evidence.EVID-01-003-A.content" },
    { evidenceId: "EVID-01-003-B", incidentId: "CALL-01-003", schemaVersion: 1, sourceId: "SOURCE-SAFETY-RULE", sourceKey: "source.safety", observedAt: "상시", displayedStateKey: "state.safetyStanding", viewId: "VIEW-RULES", preAccessible: true, titleKey: "evidence.EVID-01-003-B.title", contentKey: "evidence.EVID-01-003-B.content" },
    { evidenceId: "EVID-01-003-C", incidentId: "CALL-01-003", schemaVersion: 1, sourceId: "SOURCE-TRAIN-SCHEDULE", sourceKey: "source.schedule", observedAt: "00:27 / 00:35", displayedStateKey: "state.cancelled", viewId: "VIEW-OPERATIONS", preAccessible: true, titleKey: "evidence.EVID-01-003-C.title", contentKey: "evidence.EVID-01-003-C.content" },
    { evidenceId: "EVID-01-004-A", incidentId: "CALL-01-004", schemaVersion: 1, sourceId: "SOURCE-PHONE-REGISTER", sourceKey: "source.phone", observedAt: "6년 전 / 현재", displayedStateKey: "state.discontinued", viewId: "VIEW-OPERATIONS", preAccessible: true, titleKey: "evidence.EVID-01-004-A.title", contentKey: "evidence.EVID-01-004-A.content" },
    { evidenceId: "EVID-01-004-B", incidentId: "CALL-01-004", schemaVersion: 1, sourceId: "SOURCE-NIGHT-ROSTER", sourceKey: "source.roster", observedAt: "00:40", displayedStateKey: "state.onePerson", viewId: "VIEW-OPERATIONS", preAccessible: true, titleKey: "evidence.EVID-01-004-B.title", contentKey: "evidence.EVID-01-004-B.content" },
    { evidenceId: "EVID-01-004-C", incidentId: "CALL-01-004", schemaVersion: 1, sourceId: "SOURCE-CCTV-C03", sourceKey: "source.cctv.hall", observedAt: "00:44", displayedStateKey: "state.locked", viewId: "VIEW-CCTV", feedId: "FEED-STAFF-HALL", preAccessible: true, titleKey: "evidence.EVID-01-004-C.title", contentKey: "evidence.EVID-01-004-C.content" },
    { evidenceId: "EVID-01-005-A", incidentId: "CALL-01-005", schemaVersion: 1, sourceId: "SOURCE-RETURN-SCHEDULE", sourceKey: "source.dispatch", observedAt: "00:05 / 00:58", displayedStateKey: "state.confirmed", viewId: "VIEW-OPERATIONS", preAccessible: true, titleKey: "evidence.EVID-01-005-A.title", contentKey: "evidence.EVID-01-005-A.content" },
    { evidenceId: "EVID-01-005-B", incidentId: "CALL-01-005", schemaVersion: 1, sourceId: "SOURCE-CLOSING-RULE", sourceKey: "source.rulecard", observedAt: "근무 시작부터 열람 가능", displayedStateKey: "state.safetyStanding", viewId: "VIEW-RULES", preAccessible: true, titleKey: "evidence.EVID-01-005-B.title", contentKey: "evidence.EVID-01-005-B.content" },
    { evidenceId: "EVID-01-005-C", incidentId: "CALL-01-005", schemaVersion: 1, sourceId: "SOURCE-CCTV-C01", sourceKey: "source.cctv.exit", observedAt: "00:58", displayedStateKey: "state.observed", viewId: "VIEW-CCTV", feedId: "FEED-EXIT-02", preAccessible: true, titleKey: "evidence.EVID-01-005-C.title", contentKey: "evidence.EVID-01-005-C.content" }
  ];

  var incidents = [
    {
      incidentId: "CALL-01-001", schemaVersion: 1, timeLabel: "00:17", titleKey: "incident.001.title", primaryFeedId: "FEED-EXIT-02",
      caller: { type: "extension", displayKey: "incident.001.caller", messageKey: "incident.001.message", contextKey: "incident.001.context" },
      evidenceIds: ["EVID-01-001-A", "EVID-01-001-B"],
      choices: [
        { choiceId: "CH-001-CLOSED", channel: "broadcast", textKey: "choice.CH-001-CLOSED", judgement: "matched", recordTrustDelta: 1, echoDelta: 0, effectIds: ["FX-001-CLOSED-SHUTTER", "FX-001-CLOSED-LIGHT", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-001-CLOSED", logKey: "log.CH-001-CLOSED" },
        { choiceId: "CH-001-OPEN", channel: "broadcast", textKey: "choice.CH-001-OPEN", judgement: "unmatched", recordTrustDelta: 0, echoDelta: 2, effectIds: ["FX-001-OPEN-SHUTTER", "FX-001-OPEN-EXTERIOR", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-001-OPEN", logKey: "log.CH-001-OPEN" },
        { choiceId: "CH-001-HOLD", channel: "withhold", textKey: "choice.CH-001-HOLD", judgement: "unmatched", recordTrustDelta: 0, echoDelta: 1, effectIds: ["FX-001-HOLD-CALL", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-001-HOLD", logKey: "log.CH-001-HOLD" }
      ]
    },
    {
      incidentId: "CALL-01-002", schemaVersion: 1, timeLabel: "00:26", titleKey: "incident.002.title", primaryFeedId: "FEED-PLATFORM-03",
      caller: { type: "emergency-phone", displayKey: "incident.002.caller", messageKey: "incident.002.message", contextKey: "incident.002.context" },
      evidenceIds: ["EVID-01-002-A", "EVID-01-002-B", "EVID-01-002-C"],
      choices: [
        { choiceId: "CH-002-NONE", channel: "broadcast", textKey: "choice.CH-002-NONE", judgement: "matched", recordTrustDelta: 1, echoDelta: 0, effectIds: ["FX-002-NONE-DISPLAY", "FX-002-NONE-VIBRATION", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-002-NONE", logKey: "log.CH-002-NONE" },
        { choiceId: "CH-002-ARRIVAL", channel: "broadcast", textKey: "choice.CH-002-ARRIVAL", judgement: "unmatched", recordTrustDelta: 0, echoDelta: 2, effectIds: ["FX-002-ARRIVAL-LIGHTS", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-002-ARRIVAL", logKey: "log.CH-002-ARRIVAL" },
        { choiceId: "CH-002-HOLD", channel: "withhold", textKey: "choice.CH-002-HOLD", judgement: "unmatched", recordTrustDelta: 0, echoDelta: 1, effectIds: ["FX-002-HOLD-VIBRATION", "FX-002-HOLD-HANDPRINT", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-002-HOLD", logKey: "log.CH-002-HOLD" }
      ]
    },
    {
      incidentId: "CALL-01-003", schemaVersion: 1, timeLabel: "00:35", titleKey: "incident.003.title", primaryFeedId: "FEED-PLATFORM-03",
      enterSceneStates: [
        { componentId: "C02.person", state: "near" },
        { componentId: "C02.platformLights", state: "flickering" }
      ],
      caller: { type: "patrol-call", displayKey: "incident.003.caller", messageKey: "incident.003.message", contextKey: "incident.003.context" },
      evidenceIds: ["EVID-01-003-A", "EVID-01-003-B", "EVID-01-003-C"],
      choices: [
        { choiceId: "CH-003-SAFETY", channel: "broadcast", textKey: "choice.CH-003-SAFETY", judgement: "matched", recordTrustDelta: 1, echoDelta: 0, effectIds: ["FX-003-SAFETY-PERSON", "FX-003-SAFETY-LIGHTS", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-003-SAFETY", logKey: "log.CH-003-SAFETY" },
        { choiceId: "CH-003-TRAIN", channel: "broadcast", textKey: "choice.CH-003-TRAIN", judgement: "unmatched", recordTrustDelta: 0, echoDelta: 2, effectIds: ["FX-003-TRAIN-DOOR", "FX-003-TRAIN-ADDITIONAL", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-003-TRAIN", logKey: "log.CH-003-TRAIN" },
        { choiceId: "CH-003-HOLD", channel: "withhold", textKey: "choice.CH-003-HOLD", judgement: "unmatched", recordTrustDelta: 0, echoDelta: 1, effectIds: ["FX-003-HOLD-FACE", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-003-HOLD", logKey: "log.CH-003-HOLD" }
      ]
    },
    {
      incidentId: "CALL-01-004", schemaVersion: 1, timeLabel: "00:44", titleKey: "incident.004.title", primaryFeedId: "FEED-STAFF-HALL",
      caller: { type: "staff-extension", displayKey: "incident.004.caller", messageKey: "incident.004.message", contextKey: "incident.004.context" },
      evidenceIds: ["EVID-01-004-A", "EVID-01-004-B", "EVID-01-004-C"],
      choices: [
        { choiceId: "CH-004-OPEN", channel: "broadcast", textKey: "choice.CH-004-OPEN", judgement: "unmatched", recordTrustDelta: 0, echoDelta: 1, effectIds: ["FX-004-OPEN-DOOR", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-004-OPEN", logKey: "log.CH-004-OPEN" },
        { choiceId: "CH-004-ARRIVED", channel: "broadcast", textKey: "choice.CH-004-ARRIVED", judgement: "unmatched", recordTrustDelta: 0, echoDelta: 2, effectIds: ["FX-004-ARRIVED-SPEAKER", "FX-004-ARRIVED-FIGURE", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-004-ARRIVED", logKey: "log.CH-004-ARRIVED" },
        { choiceId: "CH-004-HOLD", channel: "withhold", textKey: "choice.CH-004-HOLD", judgement: "matched", recordTrustDelta: 1, echoDelta: 0, effectIds: ["FX-004-HOLD-BREATH", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-004-HOLD", logKey: "log.CH-004-HOLD" }
      ]
    },
    {
      incidentId: "CALL-01-005", schemaVersion: 1, timeLabel: "00:58", titleKey: "incident.005.title", primaryFeedId: "FEED-EXIT-02",
      caller: { type: "control-room-microphone", displayKey: "incident.005.caller", messageKey: "incident.005.message", contextKey: "incident.005.context" },
      evidenceIds: ["EVID-01-005-A", "EVID-01-005-B", "EVID-01-005-C"],
      choices: [
        { choiceId: "CH-005-NEXT-NONE", channel: "broadcast", textKey: "choice.CH-005-NEXT-NONE", judgement: "matched", recordTrustDelta: 1, echoDelta: 1, effectIds: ["FX-005-NONE-DISPLAY", "FX-005-NONE-LIGHTS", "FX-005-NONE-ECHO", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-005-NEXT-NONE", logKey: "log.CH-005-NEXT-NONE" },
        { choiceId: "CH-005-CONTINUE", channel: "broadcast", textKey: "choice.CH-005-CONTINUE", judgement: "unmatched", recordTrustDelta: 0, echoDelta: 2, effectIds: ["FX-005-CONTINUE-CALL", "FX-005-CONTINUE-NUMBER", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-005-CONTINUE", logKey: "log.CH-005-CONTINUE" },
        { choiceId: "CH-005-HOLD", channel: "withhold", textKey: "choice.CH-005-HOLD", judgement: "unmatched", recordTrustDelta: 0, echoDelta: 1, effectIds: ["FX-005-HOLD-POWER", "FX-005-HOLD-REFLECTION", "FX-RELAY-CLICK"], feedbackKey: "feedback.CH-005-HOLD", logKey: "log.CH-005-HOLD" }
      ]
    }
  ];

  var effects = [
    { effectId: "FX-RELAY-CLICK", type: "play_feedback", cueId: "relay-click" },
    { effectId: "FX-001-CLOSED-SHUTTER", type: "set_scene_state", targetId: "C01.shutter", state: "closed", persistence: "shift" },
    { effectId: "FX-001-CLOSED-LIGHT", type: "set_scene_state", targetId: "C01.lockLight", state: "steady", persistence: "shift" },
    { effectId: "FX-001-OPEN-SHUTTER", type: "set_scene_state", targetId: "C01.shutter", state: "open", persistence: "shift" },
    { effectId: "FX-001-OPEN-EXTERIOR", type: "set_scene_state", targetId: "C01.exterior", state: "unreal", persistence: "shift" },
    { effectId: "FX-001-HOLD-CALL", type: "set_scene_state", targetId: "C01.pendingCall", state: "pending", persistence: "shift" },
    { effectId: "FX-002-NONE-DISPLAY", type: "set_scene_state", targetId: "C02.cancelDisplay", state: "confirmed", persistence: "shift" },
    { effectId: "FX-002-NONE-VIBRATION", type: "set_scene_state", targetId: "C02.phoneVibration", state: "stopped", persistence: "shift" },
    { effectId: "FX-002-ARRIVAL-LIGHTS", type: "set_scene_state", targetId: "C02.tunnelLights", state: "twin", persistence: "temporary", resolution: { beforeIncidentId: "CALL-01-003", storyTime: "00:27", state: "off", residue: { targetId: "C02.rail", state: "wet" } } },
    { effectId: "FX-002-HOLD-VIBRATION", type: "set_scene_state", targetId: "C02.phoneVibration", state: "stopped", persistence: "shift" },
    { effectId: "FX-002-HOLD-HANDPRINT", type: "set_scene_state", targetId: "C02.handprint", state: "visible", persistence: "shift" },
    { effectId: "FX-003-SAFETY-PERSON", type: "set_scene_state", targetId: "C02.person", state: "withdrawn", persistence: "shift" },
    { effectId: "FX-003-SAFETY-LIGHTS", type: "set_scene_state", targetId: "C02.platformLights", state: "stable", persistence: "shift" },
    { effectId: "FX-003-TRAIN-DOOR", type: "set_scene_state", targetId: "C02.platformLights", state: "off", persistence: "shift" },
    { effectId: "FX-003-TRAIN-ADDITIONAL", type: "set_scene_state", targetId: "C02.additionalPerson", state: "visible", persistence: "shift" },
    { effectId: "FX-003-HOLD-FACE", type: "set_scene_state", targetId: "C02.face", state: "erased", persistence: "shift" },
    { effectId: "FX-004-OPEN-DOOR", type: "set_scene_state", targetId: "C03.staffDoor", state: "ajar", persistence: "shift" },
    { effectId: "FX-004-ARRIVED-SPEAKER", type: "set_scene_state", targetId: "C03.staffSpeaker", state: "answering", persistence: "shift" },
    { effectId: "FX-004-ARRIVED-FIGURE", type: "set_scene_state", targetId: "C03.staffFigure", state: "visible", persistence: "shift" },
    { effectId: "FX-004-HOLD-BREATH", type: "set_scene_state", targetId: "C03.breath", state: "short", persistence: "shift" },
    { effectId: "FX-005-NONE-DISPLAY", type: "set_scene_state", targetId: "C01.destination", state: "fixedLine", persistence: "shift" },
    { effectId: "FX-005-NONE-LIGHTS", type: "set_scene_state", targetId: "C01.lockLight", state: "off", persistence: "shift" },
    { effectId: "FX-005-NONE-ECHO", type: "set_scene_state", targetId: "C01.micEcho", state: "present", persistence: "shift" },
    { effectId: "FX-005-CONTINUE-CALL", type: "set_scene_state", targetId: "C01.consoleCall", state: "pending", persistence: "shift" },
    { effectId: "FX-005-CONTINUE-NUMBER", type: "set_scene_state", targetId: "C01.destination", state: "shiftNumber", persistence: "shift" },
    { effectId: "FX-005-HOLD-POWER", type: "set_scene_state", targetId: "C01.roomPower", state: "off", persistence: "shift" },
    { effectId: "FX-005-HOLD-REFLECTION", type: "set_scene_state", targetId: "C01.reflection", state: "present", persistence: "shift" }
  ];

  root.NextStationData.register("packs", "PACK-NIGHT-01", {
    schemaVersion: 1,
    packId: "PACK-NIGHT-01",
    localeId: "ko-KR",
    routeId: "ROUTE-04",
    stationId: "STATION-04",
    episodeId: "EP-01",
    titleKey: "shift.title",
    shift: {
      shiftId: "SHIFT-01",
      titleKey: "shift.title",
      introKey: "shift.intro",
      rulesIntroKey: "shift.rulesIntro",
      endNoteKey: "shift.endNote",
      incidentIds: ["CALL-01-001", "CALL-01-002", "CALL-01-003", "CALL-01-004", "CALL-01-005"],
      profileId: "PROFILE-NIGHT-01",
      startingRecordTrust: 0,
      startingEcho: 0
    },
    flags: [],
    evidence: evidence,
    incidents: incidents,
    effects: effects,
    expectedPathDistribution: {
      "END-01-A": 1,
      "END-01-B": 28,
      "END-01-C": 214
    },
    profiles: [
      {
        profileId: "PROFILE-NIGHT-01",
        schemaVersion: 1,
        perfectRunEndingId: "END-01-A",
        recordTrust: { minimum: 0, maximum: 5 },
        echo: { minimum: 0, maximum: 4, cap: 4 },
        endings: [
          {
            endingId: "END-01-C",
            priority: 1,
            titleKey: "ending.END-01-C.title",
            copyKey: "ending.END-01-C.copy",
            condition: { anyOf: [
              { metric: "recordTrust", operator: "lte", value: 2 },
              { metric: "echo", operator: "gte", value: 4 }
            ] }
          },
          {
            endingId: "END-01-A",
            priority: 2,
            titleKey: "ending.END-01-A.title",
            copyKey: "ending.END-01-A.copy",
            condition: { allOf: [
              { metric: "recordTrust", operator: "eq", value: 5 },
              { metric: "echo", operator: "lte", value: 1 }
            ] }
          },
          {
            endingId: "END-01-B",
            priority: 3,
            titleKey: "ending.END-01-B.title",
            copyKey: "ending.END-01-B.copy",
            condition: { always: true }
          }
        ]
      }
    ]
  });
}(window));
