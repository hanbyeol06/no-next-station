(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};
  var allowedEffectTypes = ["set_scene_state", "grant_flag", "consume_flag", "play_feedback"];
  var allowedChannels = ["broadcast", "withhold"];
  var allowedJudgements = ["matched", "unmatched"];
  var allowedCues = ["relay-click"];
  var allowedRenderKinds = ["shutter", "light", "reveal", "indicator", "display", "power", "reflection", "trace", "signal", "speaker", "actor", "mask", "door"];
  var allowedStatesByKind = {
    shutter: ["closed", "open"],
    light: ["off", "flickering", "unsteady", "stable", "steady"],
    reveal: ["absent", "unreal"],
    indicator: ["hidden", "clear", "none", "pending", "logged"],
    display: ["blank", "cancelled", "shiftNumber", "confirmed", "fixedLine"],
    power: ["on", "off"],
    reflection: ["absent", "present"],
    trace: ["absent", "dry", "wet", "visible", "short", "present", "none"],
    signal: ["off", "twin"],
    speaker: ["active", "stopped", "idle", "answering"],
    actor: ["hidden", "absent", "near", "withdrawn", "visible"],
    mask: ["normal", "erased"],
    door: ["locked", "ajar"]
  };
  var sharedTextKeys = [
    "ui.brand", "ui.callChecking", "ui.callRecorded", "ui.cameraHeading", "ui.cameraGeneric", "ui.noEvidence",
    "ui.claimLabel", "ui.workLog", "ui.noWorkLog", "ui.evidenceSource", "ui.evidenceObserved", "ui.evidenceState",
    "ui.evidenceViewed", "ui.evidenceAvailable", "ui.logEvidence", "ui.logDirectEvidence", "ui.logMatched",
    "ui.logUnmatched", "ui.broadcast", "ui.withhold", "ui.resultBroadcast", "ui.resultWithhold",
    "ui.broadcastDispatched", "ui.withholdRecorded", "ui.nextCall", "ui.finishShift", "ui.soundOn", "ui.soundOff",
    "ui.motionReduced", "ui.motionFull", "ui.feedStatus", "ui.validationPass", "ui.validationFail",
    "ui.validationPaths", "ui.validationEndings", "ui.validationEvidence", "validation.expected",
    "rules.card.heading", "shift.estimatedTime", "shift.rules1", "shift.rules2", "shift.rules3"
  ];

  function issue(list, path, message) {
    list.push({ path: path, message: message });
  }

  function isRecord(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function hasAssetDescriptor(assetId) {
    var asset = root.NextStationAssets && root.NextStationAssets[assetId];
    return isRecord(asset) && (asset.src === null || (typeof asset.src === "string" && Boolean(asset.src.trim()))) &&
      (asset.states === undefined || isRecord(asset.states));
  }

  function hasKey(locale, key) {
    return Boolean(locale && locale.messages && typeof locale.messages[key] === "string" && locale.messages[key].trim());
  }

  function checkTextKey(issues, content, key, path) {
    if (typeof key !== "string" || !hasKey(content.locale, key)) {
      issue(issues, path, "문구 키를 찾을 수 없습니다: " + String(key));
    }
  }

  function checkRequiredString(issues, value, path) {
    if (typeof value !== "string" || !value.trim()) issue(issues, path, "비어 있지 않은 문자열이 필요합니다.");
  }

  function checkId(issues, value, path, pattern) {
    if (typeof value !== "string" || !pattern.test(value)) {
      issue(issues, path, "ID 형식이 올바르지 않습니다: " + String(value));
    }
  }

  function minutesFromStoryTime(value) {
    var match = typeof value === "string" && /^(\d{2}):(\d{2})$/.exec(value);
    if (!match || Number(match[2]) > 59) return null;
    return Number(match[1]) * 60 + Number(match[2]);
  }

  function checkUnique(issues, items, key, path) {
    var seen = Object.create(null);
    (items || []).forEach(function (item, index) {
      var id = item && item[key];
      if (typeof id !== "string" || !id) {
        issue(issues, path + "[" + index + "]." + key, "필수 ID가 없습니다.");
      } else if (seen[id]) {
        issue(issues, path + "[" + index + "]." + key, "중복 ID: " + id);
      } else {
        seen[id] = true;
      }
    });
  }

  function checkUniqueStrings(issues, items, path) {
    if (!Array.isArray(items)) return;
    var seen = Object.create(null);
    items.forEach(function (value, index) {
      if (typeof value !== "string" || !value) return;
      if (seen[value]) issue(issues, path + "[" + index + "]", "중복 ID 참조: " + value);
      else seen[value] = true;
    });
  }

  function checkLocaleReferences(issues, content) {
    var pack = content.pack;
    sharedTextKeys.forEach(function (key) { checkTextKey(issues, content, key, "locale.messages." + key); });
    checkTextKey(issues, content, pack.titleKey, "pack.titleKey");
    ["titleKey", "introKey", "rulesIntroKey", "endNoteKey"].forEach(function (field) {
      checkTextKey(issues, content, pack.shift[field], "shift." + field);
    });
    content.station.views.forEach(function (view, index) {
      checkTextKey(issues, content, view.labelKey, "station.views[" + index + "].labelKey");
    });
    checkTextKey(issues, content, content.station.nameKey, "station.nameKey");
    content.station.feeds.forEach(function (feed, index) {
      ["labelKey", "shortLabelKey", "captionKey"].forEach(function (field) {
        checkTextKey(issues, content, feed[field], "station.feeds[" + index + "]." + field);
      });
    });
    pack.evidence.forEach(function (evidenceItem, index) {
      ["sourceKey", "displayedStateKey", "titleKey", "contentKey"].forEach(function (field) {
        checkTextKey(issues, content, evidenceItem[field], "evidence[" + evidenceItem.evidenceId + "]." + field);
      });
    });
    pack.incidents.forEach(function (incident) {
      ["titleKey"].forEach(function (field) {
        checkTextKey(issues, content, incident[field], "incidents[" + incident.incidentId + "]." + field);
      });
      ["displayKey", "messageKey", "contextKey"].forEach(function (field) {
        checkTextKey(issues, content, incident.caller && incident.caller[field], "incidents[" + incident.incidentId + "].caller." + field);
      });
      incident.choices.forEach(function (choice) {
        ["textKey", "feedbackKey", "logKey"].forEach(function (field) {
          checkTextKey(issues, content, choice[field], "incidents[" + incident.incidentId + "].choices[" + choice.choiceId + "]." + field);
        });
      });
    });
    var profile = pack.profiles.find(function (item) { return item.profileId === pack.shift.profileId; });
    if (profile) profile.endings.forEach(function (ending) {
      checkTextKey(issues, content, ending.titleKey, "profiles[" + profile.profileId + "].endings[" + ending.endingId + "].titleKey");
      checkTextKey(issues, content, ending.copyKey, "profiles[" + profile.profileId + "].endings[" + ending.endingId + "].copyKey");
    });
  }

  function checkSceneAndAssets(issues, content) {
    var componentMap = Object.create(null);
    if (content.scene.width !== 720 || content.scene.height !== 405) {
      issue(issues, "scene", "장면 기준 크기는 720×405여야 합니다.");
    }
    content.scene.components.forEach(function (component, index) {
      var path = "scene.components[" + (component.componentId || index) + "]";
      if (typeof component.componentId !== "string" || !component.componentId) issue(issues, path + ".componentId", "장면 요소 ID가 필요합니다.");
      componentMap[component.componentId] = component;
      if (!component.states || !Object.prototype.hasOwnProperty.call(component.states, component.initialState)) {
        issue(issues, path + ".initialState", "초기 상태가 허용 상태에 없습니다.");
      }
      if (!component.position || ["x", "y", "width", "height"].some(function (field) { return !Number.isFinite(component.position[field]); }) ||
          component.position.x < 0 || component.position.y < 0 || component.position.width <= 0 || component.position.height <= 0 ||
          component.position.x + component.position.width > 720 || component.position.y + component.position.height > 405) {
        issue(issues, path + ".position", "720×405 장면 좌표가 필요합니다.");
      }
      if (!Number.isInteger(component.layer) || component.layer < 0) issue(issues, path + ".layer", "장면 레이어는 0 이상의 정수여야 합니다.");
      if (allowedRenderKinds.indexOf(component.renderKind) < 0) {
        issue(issues, path + ".renderKind", "등록되지 않은 렌더 요소 종류입니다: " + component.renderKind);
      } else {
        Object.keys(component.states || {}).forEach(function (state) {
          if (allowedStatesByKind[component.renderKind].indexOf(state) < 0) {
            issue(issues, path + ".states." + state, "렌더 요소에 등록되지 않은 상태입니다: " + component.renderKind + "/" + state);
          }
        });
      }
      if (component.assetId && !hasAssetDescriptor(component.assetId)) {
        issue(issues, path + ".assetId", "에셋 manifest에 등록되지 않은 assetId: " + component.assetId);
      } else if (component.assetId && root.NextStationAssets[component.assetId].states) {
        Object.keys(root.NextStationAssets[component.assetId].states).forEach(function (state) {
          var source = root.NextStationAssets[component.assetId].states[state];
          if (!Object.prototype.hasOwnProperty.call(component.states || {}, state)) {
            issue(issues, path + ".assetId.states." + state, "에셋 상태에 대응하는 장면 상태가 없습니다.");
          }
          if (source !== null && (typeof source !== "string" || !source.trim())) {
            issue(issues, path + ".assetId.states." + state, "에셋 경로는 비어 있지 않은 경로 또는 null이어야 합니다.");
          }
        });
      }
      Object.keys(component.states || {}).forEach(function (state) {
        var stateInfo = component.states[state];
        if (!isRecord(stateInfo) || !Object.prototype.hasOwnProperty.call(stateInfo, "captionKey")) {
          issue(issues, path + ".states." + state, "상태 캡션 설정 객체가 필요합니다.");
        } else if (stateInfo.captionKey !== null) {
          checkTextKey(issues, content, stateInfo.captionKey, path + ".states." + state + ".captionKey");
        }
      });
    });
    content.station.feeds.forEach(function (feed) {
      if (!componentMap || !content.scene) return;
      if (!hasAssetDescriptor(feed.assetId)) {
        issue(issues, "station.feeds[" + feed.feedId + "].assetId", "에셋 manifest에 등록되지 않은 배경 assetId: " + feed.assetId);
      }
      if (!content.scene.components.some(function (component) { return component.sceneId === feed.sceneId; })) {
        issue(issues, "station.feeds[" + feed.feedId + "].sceneId", "렌더할 장면 구성요소가 없습니다: " + feed.sceneId);
      }
    });
    return componentMap;
  }

  function checkEvidenceAndChoices(issues, content, componentMap) {
    var pack = content.pack;
    var stationViews = Object.create(null);
    var feedMap = Object.create(null);
    content.station.views.forEach(function (view) { stationViews[view.viewId] = true; });
    content.station.feeds.forEach(function (feed) { feedMap[feed.feedId] = true; });
    var evidenceMap = Object.create(null);
    pack.evidence.forEach(function (item, index) {
      var path = "evidence[" + (item.evidenceId || index) + "]";
      evidenceMap[item.evidenceId] = item;
      if (item.schemaVersion !== 1) issue(issues, path + ".schemaVersion", "지원하는 스키마 버전은 1입니다.");
      if (!stationViews[item.viewId]) issue(issues, path + ".viewId", "등록된 자료 화면이 아닙니다: " + item.viewId);
      if (item.viewId === "VIEW-CCTV" && !feedMap[item.feedId]) issue(issues, path + ".feedId", "등록된 CCTV 피드가 아닙니다: " + item.feedId);
      if (item.preAccessible !== true) issue(issues, path + ".preAccessible", "선택 전에 열람 가능해야 합니다.");
      checkRequiredString(issues, item.sourceId, path + ".sourceId");
      checkRequiredString(issues, item.observedAt, path + ".observedAt");
    });
    var incidentMap = Object.create(null);
    pack.incidents.forEach(function (incident, index) {
      var path = "incidents[" + (incident.incidentId || index) + "]";
      incidentMap[incident.incidentId] = incident;
      if (incident.schemaVersion !== 1) issue(issues, path + ".schemaVersion", "지원하는 스키마 버전은 1입니다.");
      if (!feedMap[incident.primaryFeedId]) issue(issues, path + ".primaryFeedId", "기본 CCTV 피드가 없습니다: " + incident.primaryFeedId);
      if (!incident.caller || !incident.caller.type) issue(issues, path + ".caller.type", "발신 유형이 필요합니다.");
      else checkRequiredString(issues, incident.caller.type, path + ".caller.type");
      var sources = Object.create(null);
      (incident.evidenceIds || []).forEach(function (evidenceId) {
        var item = evidenceMap[evidenceId];
        if (!item) {
          issue(issues, path + ".evidenceIds", "등록되지 않은 자료 ID: " + evidenceId);
          return;
        }
        if (item.incidentId !== incident.incidentId) issue(issues, path + ".evidenceIds", evidenceId + "는 이 호출에 속하지 않습니다.");
        if (!item.preAccessible) issue(issues, path + ".evidenceIds", evidenceId + "를 선택 전에 열람할 수 없습니다.");
        if (item.sourceId) sources[item.sourceId] = true;
      });
      if (Object.keys(sources).length < 2) issue(issues, path + ".evidenceIds", "호출자의 주장을 제외한 독립 출처 자료가 두 개 이상 필요합니다.");
      if (!Array.isArray(incident.choices) || incident.choices.length !== 3) {
        issue(issues, path + ".choices", "선택지는 정확히 세 개여야 합니다.");
        return;
      }
      var matchedCount = 0;
      incident.choices.forEach(function (choice, choiceIndex) {
        var choicePath = path + ".choices[" + (choice.choiceId || choiceIndex) + "]";
        if (choice.judgement === "matched") matchedCount += 1;
        if (allowedChannels.indexOf(choice.channel) < 0) issue(issues, choicePath + ".channel", "허용되지 않은 채널입니다: " + choice.channel);
        if (allowedJudgements.indexOf(choice.judgement) < 0) issue(issues, choicePath + ".judgement", "판정은 matched 또는 unmatched여야 합니다.");
        if (choice.recordTrustDelta !== (choice.judgement === "matched" ? 1 : 0)) issue(issues, choicePath + ".recordTrustDelta", "기준에 맞으면 +1, 그 외에는 +0이어야 합니다.");
        if (!Number.isInteger(choice.echoDelta) || choice.echoDelta < 0 || choice.echoDelta > 2) issue(issues, choicePath + ".echoDelta", "잔향 변화는 0–2 정수여야 합니다.");
        if (!Array.isArray(choice.effectIds)) issue(issues, choicePath + ".effectIds", "effectIds 배열이 필요합니다.");
      });
      if (matchedCount !== 1) issue(issues, path + ".choices", "기준에 맞는 선택지는 정확히 하나여야 합니다.");
      (incident.enterSceneStates || []).forEach(function (entry, entryIndex) {
        var component = componentMap[entry.componentId];
        if (!component) issue(issues, path + ".enterSceneStates[" + entryIndex + "].componentId", "등록되지 않은 장면 구성요소입니다.");
        else if (!Object.prototype.hasOwnProperty.call(component.states || {}, entry.state)) issue(issues, path + ".enterSceneStates[" + entryIndex + "].state", "등록되지 않은 장면 상태입니다.");
      });
      if (incident.enterSceneStates) checkUnique(issues, incident.enterSceneStates, "componentId", path + ".enterSceneStates");
    });
    return { evidenceMap: evidenceMap, incidentMap: incidentMap };
  }

  function checkEffects(issues, content, componentMap, incidentMap) {
    var pack = content.pack;
    var effectMap = Object.create(null);
    var flagMap = Object.create(null);
    (pack.flags || []).forEach(function (flag) { flagMap[flag.flagId] = true; });
    pack.effects.forEach(function (effect, index) {
      var path = "effects[" + (effect.effectId || index) + "]";
      effectMap[effect.effectId] = effect;
      if (allowedEffectTypes.indexOf(effect.type) < 0) {
        issue(issues, path + ".type", "등록되지 않은 효과 유형입니다: " + effect.type);
        return;
      }
      if (effect.type === "set_scene_state") {
        var component = componentMap[effect.targetId];
        if (!component) issue(issues, path + ".targetId", "장면 요소가 등록되지 않았습니다: " + effect.targetId);
        else if (!Object.prototype.hasOwnProperty.call(component.states || {}, effect.state)) issue(issues, path + ".state", "해당 요소에 등록되지 않은 상태입니다: " + effect.state);
        if (effect.persistence === "temporary") {
          var resolution = effect.resolution;
          if (!resolution || !resolution.beforeIncidentId || !resolution.storyTime || !resolution.state || !resolution.residue) {
            issue(issues, path + ".resolution", "일시 효과에는 해소 시각·호출·상태와 잔여 흔적이 필요합니다.");
          } else {
            var targetIndex = incidentMap[resolution.beforeIncidentId] && pack.incidents.indexOf(incidentMap[resolution.beforeIncidentId]);
            var sourceIndices = [];
            pack.incidents.forEach(function (incident, incidentIndex) {
              if (incident.choices.some(function (choice) { return choice.effectIds.indexOf(effect.effectId) >= 0; })) sourceIndices.push(incidentIndex);
            });
            if (targetIndex === undefined || targetIndex < 0) issue(issues, path + ".resolution.beforeIncidentId", "해소 호출이 근무에 등록되지 않았습니다.");
            else if (sourceIndices.some(function (sourceIndex) { return targetIndex <= sourceIndex; })) issue(issues, path + ".resolution.beforeIncidentId", "일시 효과는 발생한 호출보다 뒤에서 해소되어야 합니다.");
            if (!sourceIndices.length) issue(issues, path + ".effectId", "선택지에서 참조하지 않는 일시 효과입니다.");
            var resolutionMinute = minutesFromStoryTime(resolution.storyTime);
            if (resolutionMinute === null) issue(issues, path + ".resolution.storyTime", "해소 시각은 HH:MM 형식이어야 합니다.");
            if (targetIndex !== undefined && targetIndex >= 0 && resolutionMinute !== null) {
              var targetMinute = minutesFromStoryTime(pack.incidents[targetIndex].timeLabel);
              if (targetMinute !== null && resolutionMinute > targetMinute) issue(issues, path + ".resolution.storyTime", "해소 시각은 다음 호출 시각보다 늦을 수 없습니다.");
              sourceIndices.forEach(function (sourceIndex) {
                var sourceMinute = minutesFromStoryTime(pack.incidents[sourceIndex].timeLabel);
                if (sourceMinute !== null && resolutionMinute <= sourceMinute) issue(issues, path + ".resolution.storyTime", "해소 시각은 효과가 발생한 호출 이후여야 합니다.");
              });
            }
            if (!component || !Object.prototype.hasOwnProperty.call(component.states || {}, resolution.state)) issue(issues, path + ".resolution.state", "해소 상태가 장면 요소에 등록되지 않았습니다.");
            var residueTarget = resolution.residue && componentMap[resolution.residue.targetId];
            if (!residueTarget || !Object.prototype.hasOwnProperty.call(residueTarget.states || {}, resolution.residue.state)) issue(issues, path + ".resolution.residue", "남는 흔적과 상태가 장면 manifest에 등록되지 않았습니다.");
          }
        } else if (effect.persistence !== "shift") {
          issue(issues, path + ".persistence", "지속 효과는 shift 또는 temporary로 선언해야 합니다.");
        }
      }
      if (effect.type === "grant_flag" || effect.type === "consume_flag") {
        if (!flagMap[effect.flagId]) issue(issues, path + ".flagId", "등록되지 않은 플래그입니다: " + effect.flagId);
      }
      if (effect.type === "play_feedback" && allowedCues.indexOf(effect.cueId) < 0) {
        issue(issues, path + ".cueId", "등록되지 않은 분위기 피드백입니다: " + effect.cueId);
      }
    });
    pack.incidents.forEach(function (incident) {
      incident.choices.forEach(function (choice) {
        (choice.effectIds || []).forEach(function (effectId) {
          if (!effectMap[effectId]) issue(issues, "incidents[" + incident.incidentId + "].choices[" + choice.choiceId + "].effectIds", "등록되지 않은 효과 ID: " + effectId);
        });
      });
    });
    return effectMap;
  }

  function checkIds(issues, content) {
    var pack = content.pack;
    [
      [pack.packId, "pack.packId", /^PACK-[A-Z0-9-]+$/],
      [pack.routeId, "pack.routeId", /^ROUTE-[A-Z0-9-]+$/],
      [pack.stationId, "pack.stationId", /^STATION-[A-Z0-9-]+$/],
      [pack.episodeId, "pack.episodeId", /^EP-[A-Z0-9-]+$/],
      [pack.shift.shiftId, "shift.shiftId", /^SHIFT-[A-Z0-9-]+$/],
      [pack.shift.profileId, "shift.profileId", /^PROFILE-[A-Z0-9-]+$/],
      [content.station.stationId, "station.stationId", /^STATION-[A-Z0-9-]+$/],
      [content.station.routeId, "station.routeId", /^ROUTE-[A-Z0-9-]+$/],
      [content.scene.sceneTemplateId, "scene.sceneTemplateId", /^SCENE-TEMPLATE-[A-Z0-9-]+$/],
      [content.scene.stationId, "scene.stationId", /^STATION-[A-Z0-9-]+$/],
      [content.manifest.manifestId, "manifest.manifestId", /^MANIFEST-[A-Z0-9-]+$/]
    ].forEach(function (entry) { checkId(issues, entry[0], entry[1], entry[2]); });
    checkRequiredString(issues, pack.localeId, "pack.localeId");
    checkRequiredString(issues, content.locale.localeId, "locale.localeId");
    checkRequiredString(issues, content.station.nameKey, "station.nameKey");
    content.station.views.forEach(function (view, index) { checkId(issues, view.viewId, "station.views[" + index + "].viewId", /^VIEW-[A-Z0-9-]+$/); });
    content.station.feeds.forEach(function (feed, index) {
      checkId(issues, feed.feedId, "station.feeds[" + index + "].feedId", /^FEED-[A-Z0-9-]+$/);
      checkId(issues, feed.cameraId, "station.feeds[" + index + "].cameraId", /^C[0-9]{2}$/);
      checkId(issues, feed.sceneId, "station.feeds[" + index + "].sceneId", /^SCENE-[A-Z0-9-]+$/);
      checkId(issues, feed.assetId, "station.feeds[" + index + "].assetId", /^ASSET-[A-Z0-9-]+$/);
    });
    pack.evidence.forEach(function (item, index) {
      checkId(issues, item.evidenceId, "evidence[" + index + "].evidenceId", /^EVID-[A-Z0-9-]+$/);
      checkId(issues, item.incidentId, "evidence[" + index + "].incidentId", /^CALL-[A-Z0-9-]+$/);
    });
    pack.incidents.forEach(function (incident, index) {
      checkId(issues, incident.incidentId, "incidents[" + index + "].incidentId", /^CALL-[A-Z0-9-]+$/);
      if (!/^\d{2}:\d{2}$/.test(incident.timeLabel || "")) issue(issues, "incidents[" + incident.incidentId + "].timeLabel", "근무 내 시각은 HH:MM 형식이어야 합니다.");
      incident.choices.forEach(function (choice, choiceIndex) {
        checkId(issues, choice.choiceId, "incidents[" + incident.incidentId + "].choices[" + choiceIndex + "].choiceId", /^CH-[A-Z0-9-]+$/);
      });
    });
    pack.effects.forEach(function (effect, index) { checkId(issues, effect.effectId, "effects[" + index + "].effectId", /^FX-[A-Z0-9-]+$/); });
    (pack.flags || []).forEach(function (flag, index) { checkId(issues, flag.flagId, "flags[" + index + "].flagId", /^FLAG-[A-Z0-9-]+$/); });
    pack.profiles.forEach(function (profile, index) {
      checkId(issues, profile.profileId, "profiles[" + index + "].profileId", /^PROFILE-[A-Z0-9-]+$/);
      checkId(issues, profile.perfectRunEndingId, "profiles[" + profile.profileId + "].perfectRunEndingId", /^END-[A-Z0-9-]+$/);
      if (profile.schemaVersion !== 1) issue(issues, "profiles[" + profile.profileId + "].schemaVersion", "지원하는 스키마 버전은 1입니다.");
      profile.endings.forEach(function (ending, endingIndex) {
        checkId(issues, ending.endingId, "profiles[" + profile.profileId + "].endings[" + endingIndex + "].endingId", /^END-[A-Z0-9-]+$/);
      });
    });
    content.scene.components.forEach(function (component, index) {
      checkId(issues, component.componentId, "scene.components[" + index + "].componentId", /^C[0-9]{2}\.[A-Za-z][A-Za-z0-9]*$/);
      checkId(issues, component.sceneId, "scene.components[" + index + "].sceneId", /^SCENE-[A-Z0-9-]+$/);
      if (component.assetId !== null && component.assetId !== undefined) checkId(issues, component.assetId, "scene.components[" + index + "].assetId", /^ASSET-[A-Z0-9-]+$/);
    });
    [
      [pack.evidence, "evidenceId", "evidence"],
      [pack.incidents, "incidentId", "incidents"],
      [pack.effects, "effectId", "effects"],
      [pack.profiles, "profileId", "profiles"]
    ].forEach(function (set) { checkUnique(issues, set[0], set[1], set[2]); });
    pack.incidents.forEach(function (incident) {
      checkUnique(issues, incident.choices, "choiceId", "incidents[" + incident.incidentId + "].choices");
    });
    pack.profiles.forEach(function (profile) {
      checkUnique(issues, profile.endings, "endingId", "profiles[" + profile.profileId + "].endings");
    });
    checkUnique(issues, content.station.views, "viewId", "station.views");
    checkUnique(issues, content.station.feeds, "feedId", "station.feeds");
    checkUnique(issues, content.scene.components, "componentId", "scene.components");
    var nested = Object.create(null);
    function reserve(id, path) {
      if (!id) return;
      if (nested[id] && nested[id] !== path) issue(issues, path, "콘텐츠 ID가 중복됩니다: " + id + " (" + nested[id] + ")");
      else nested[id] = path;
    }
    [content.manifest.manifestId, pack.packId, pack.routeId, pack.stationId, pack.episodeId, pack.shift.shiftId].forEach(function (id, index) {
      reserve(id, ["manifest.manifestId", "pack.packId", "pack.routeId", "pack.stationId", "pack.episodeId", "shift.shiftId"][index]);
    });
    pack.evidence.forEach(function (item) { reserve(item.evidenceId, "evidence"); });
    pack.incidents.forEach(function (incident) {
      reserve(incident.incidentId, "incidents");
      incident.choices.forEach(function (choice) { reserve(choice.choiceId, "choices[" + incident.incidentId + "]"); });
    });
    pack.effects.forEach(function (effect) { reserve(effect.effectId, "effects"); });
    pack.profiles.forEach(function (profile) {
      reserve(profile.profileId, "profiles");
      profile.endings.forEach(function (ending) { reserve(ending.endingId, "endings[" + profile.profileId + "]"); });
    });
    checkUnique(issues, pack.flags || [], "flagId", "flags");
    (pack.flags || []).forEach(function (flag) { reserve(flag.flagId, "flags"); });
    reserve(content.scene.sceneTemplateId, "sceneTemplate");
    reserve(content.locale.localeId, "locale");
    content.station.views.forEach(function (view) { reserve(view.viewId, "station.views"); });
    content.station.feeds.forEach(function (feed) { reserve(feed.feedId, "station.feeds"); });
    content.scene.components.forEach(function (component) {
      reserve(component.componentId, "scene.components");
    });
    var seenSceneIds = Object.create(null);
    content.scene.components.forEach(function (component) {
      if (component.sceneId && !seenSceneIds[component.sceneId]) {
        seenSceneIds[component.sceneId] = true;
        reserve(component.sceneId, "sceneIds");
      }
    });
  }

  function checkEndingCondition(issues, condition, path) {
    if (!isRecord(condition)) {
      issue(issues, path, "결말 조건은 객체여야 합니다.");
      return false;
    }
    var keys = Object.keys(condition);
    if (condition.always === true && keys.length === 1) return true;
    var groupKey = Array.isArray(condition.anyOf) ? "anyOf" : (Array.isArray(condition.allOf) ? "allOf" : null);
    if (groupKey) {
      if (keys.length !== 1 || !condition[groupKey].length) {
        issue(issues, path, "anyOf/allOf 조건은 비어 있지 않은 단일 조건 배열이어야 합니다.");
        return false;
      }
      var childrenValid = true;
      condition[groupKey].forEach(function (child, index) {
        if (!checkEndingCondition(issues, child, path + "." + groupKey + "[" + index + "]")) childrenValid = false;
      });
      return childrenValid;
    }
    if (keys.length !== 3 || ["metric", "operator", "value"].some(function (key) { return !Object.prototype.hasOwnProperty.call(condition, key); }) ||
        ["recordTrust", "echo"].indexOf(condition.metric) < 0 ||
        ["eq", "lte", "gte", "lt", "gt"].indexOf(condition.operator) < 0 || !Number.isFinite(condition.value)) {
      issue(issues, path, "결말 조건에는 등록된 점수·연산자·숫자 값이 필요합니다.");
      return false;
    }
    return true;
  }

  function checkProfile(issues, content) {
    var pack = content.pack;
    var profile = pack.profiles.find(function (item) { return item && item.profileId === pack.shift.profileId; });
    if (!profile) {
      issue(issues, "shift.profileId", "판정 프로필을 찾을 수 없습니다: " + pack.shift.profileId);
      return null;
    }
    var endingIds = Object.create(null);
    if (Array.isArray(profile.endings)) profile.endings.forEach(function (ending) { if (ending && ending.endingId) endingIds[ending.endingId] = true; });
    Object.keys(pack.expectedPathDistribution || {}).forEach(function (endingId) {
      if (!endingIds[endingId]) issue(issues, "expectedPathDistribution." + endingId, "활성 프로필에 없는 결말 ID입니다: " + endingId);
    });
    Object.keys(endingIds).forEach(function (endingId) {
      if (!Object.prototype.hasOwnProperty.call(pack.expectedPathDistribution || {}, endingId)) {
        issue(issues, "expectedPathDistribution." + endingId, "활성 결말의 기대 경로 수가 없습니다.");
      }
    });
    if (!Array.isArray(profile.endings)) {
      issue(issues, "profiles[" + profile.profileId + "].endings", "결말 규칙 배열이 필요합니다.");
      return null;
    }
    if (!profile.endings.some(function (ending) { return ending && ending.endingId === profile.perfectRunEndingId; })) {
      issue(issues, "profiles[" + profile.profileId + "].perfectRunEndingId", "모든 기준 일치 선택 경로에 사용할 결말을 찾을 수 없습니다.");
    }
    var rangeValid = profile.recordTrust && profile.echo &&
      Number.isInteger(profile.recordTrust.minimum) && Number.isInteger(profile.recordTrust.maximum) &&
      Number.isInteger(profile.echo.minimum) && Number.isInteger(profile.echo.maximum) &&
      Number.isInteger(profile.echo.cap) && profile.echo.cap === profile.echo.maximum &&
      profile.recordTrust.minimum === 0 && profile.recordTrust.maximum === 5 &&
      profile.echo.minimum === 0 && profile.echo.maximum === 4;
    if (!rangeValid) {
      issue(issues, "profiles[" + profile.profileId + "]", "기록 신뢰도와 잔향의 정수 범위·상한이 필요합니다.");
      return profile;
    }
    if (profile.endings.length !== 3) issue(issues, "profiles[" + profile.profileId + "].endings", "첫 근무에는 결말 규칙이 세 개 필요합니다.");
    checkUnique(issues, profile.endings, "endingId", "profiles[" + profile.profileId + "].endings");
    var endingsValid = profile.endings.length === 3;
    profile.endings.forEach(function (ending, index) {
      if (!Number.isInteger(ending.priority)) {
        issue(issues, "profiles[" + profile.profileId + "].endings[" + index + "].priority", "결말 우선순위가 필요합니다.");
        endingsValid = false;
      }
      if (!checkEndingCondition(issues, ending.condition, "profiles[" + profile.profileId + "].endings[" + ending.endingId + "].condition")) endingsValid = false;
    });
    if (content.pack.shift.startingRecordTrust !== 0 || content.pack.shift.startingEcho !== 0 ||
        !Number.isInteger(content.pack.shift.startingRecordTrust) || !Number.isInteger(content.pack.shift.startingEcho)) {
      issue(issues, "shift", "첫 근무의 기록 신뢰도와 잔향은 0에서 시작해야 합니다.");
      endingsValid = false;
    }
    if (!endingsValid) return profile;
    for (var trust = profile.recordTrust.minimum; trust <= profile.recordTrust.maximum; trust += 1) {
      for (var echo = profile.echo.minimum; echo <= profile.echo.maximum; echo += 1) {
        var total = { recordTrust: trust, echo: echo };
        if (runtime.EndingResolver.countMatches(profile, total) !== 1) {
          issue(issues, "profiles[" + profile.profileId + "]", "기록 " + trust + " / 잔향 " + echo + "에 일치하는 결말은 정확히 하나여야 합니다.");
        }
      }
    }
    return profile;
  }

  function sameMap(left, right) {
    var leftKeys = Object.keys(left || {}).sort();
    var rightKeys = Object.keys(right || {}).sort();
    return leftKeys.join("|") === rightKeys.join("|") && leftKeys.every(function (key) { return left[key] === right[key]; });
  }

  function simulatePath(content, choiceIndexes) {
    var session = runtime.Session.create(content);
    runtime.Session.start(session, content);
    var expectedStates = Object.create(null);
    var expectedFlags = Object.create(null);
    var pending = [];
    var expectedTimelineEvents = [];
    content.scene.components.forEach(function (component) { expectedStates[component.componentId] = component.initialState; });
    var firstIncident = runtime.Session.currentIncident(content, session);
    (firstIncident.enterSceneStates || []).forEach(function (entry) { expectedStates[entry.componentId] = entry.state; });
    var valid = true;
    for (var index = 0; index < choiceIndexes.length; index += 1) {
      var incident = runtime.Session.currentIncident(content, session);
      var choice = incident && incident.choices[choiceIndexes[index]];
      if (!choice) {
        valid = false;
        break;
      }
      runtime.Session.recordViewed(session, incident, incident.evidenceIds);
      var applied = runtime.Evaluation.choose(session, content, choice.choiceId);
      if (!applied.applied) {
        valid = false;
        break;
      }
      choice.effectIds.forEach(function (effectId) {
        var effect = content.pack.effects.find(function (item) { return item.effectId === effectId; });
        if (!effect) return;
        if (effect.type === "set_scene_state") {
          expectedStates[effect.targetId] = effect.state;
          if (effect.persistence === "temporary") pending.push(effect);
        } else if (effect.type === "grant_flag") {
          expectedFlags[effect.flagId] = true;
        } else if (effect.type === "consume_flag") {
          expectedFlags[effect.flagId] = false;
        }
      });
      var beforeDuplicate = JSON.stringify({
        recordTrust: session.recordTrust,
        echo: session.echo,
        sceneStates: session.sceneStates,
        flags: session.flags,
        pending: session.pendingSceneTransitions,
        timeline: session.timelineEvents,
        choiceLog: session.choiceLog
      });
      var duplicate = runtime.Evaluation.choose(session, content, choice.choiceId);
      if (duplicate.applied || beforeDuplicate !== JSON.stringify({
        recordTrust: session.recordTrust,
        echo: session.echo,
        sceneStates: session.sceneStates,
        flags: session.flags,
        pending: session.pendingSceneTransitions,
        timeline: session.timelineEvents,
        choiceLog: session.choiceLog
      })) {
        valid = false;
        break;
      }
      if (index + 1 < content.pack.incidents.length) {
        var nextIncident = content.pack.incidents[index + 1];
        pending = pending.filter(function (effect) {
          if (effect.resolution.beforeIncidentId !== nextIncident.incidentId) return true;
          expectedStates[effect.targetId] = effect.resolution.state;
          expectedStates[effect.resolution.residue.targetId] = effect.resolution.residue.state;
          expectedTimelineEvents.push({
            effectId: effect.effectId,
            incidentId: nextIncident.incidentId,
            storyTime: effect.resolution.storyTime,
            targetId: effect.targetId,
            state: effect.resolution.state,
            residue: effect.resolution.residue
          });
          return false;
        });
        (nextIncident.enterSceneStates || []).forEach(function (entry) { expectedStates[entry.componentId] = entry.state; });
      }
      if (!runtime.Session.advance(session, content)) {
        valid = false;
        break;
      }
      if (index < choiceIndexes.length - 1 && session.phase !== "investigation") {
        valid = false;
        break;
      }
      if (!sameMap(session.sceneStates, expectedStates) || !sameMap(session.flags, expectedFlags) ||
          JSON.stringify(session.timelineEvents) !== JSON.stringify(expectedTimelineEvents)) {
        valid = false;
        break;
      }
    }
    return { session: session, valid: valid };
  }

  function checkAllPaths(issues, content, profile) {
    var incidents = content.pack.incidents;
    var pathCount = incidents.reduce(function (count, incident) {
      return count * (incident.choices ? incident.choices.length : 0);
    }, 1);
    var distribution = Object.create(null);
    var completed = 0;
    var expected = content.pack.expectedPathDistribution || null;

    function visit(index, indexes) {
      if (index === incidents.length) {
        var outcome = simulatePath(content, indexes);
        completed += 1;
        if (!outcome.valid) {
          issue(issues, "paths[" + indexes.join(",") + "]", "경로가 응답 잠금부터 결말까지 완료되지 않았습니다.");
          return;
        }
        var session = outcome.session;
        var endingId = session.ending && session.ending.endingId;
        distribution[endingId] = (distribution[endingId] || 0) + 1;
        if (session.choiceLog.length !== incidents.length) issue(issues, "paths[" + indexes.join(",") + "].choiceLog", "선택 로그가 호출 수와 다릅니다.");
        if (session.recordTrust < profile.recordTrust.minimum || session.recordTrust > profile.recordTrust.maximum) issue(issues, "paths[" + indexes.join(",") + "].recordTrust", "기록 신뢰도 상한/하한을 벗어났습니다.");
        if (session.echo < profile.echo.minimum || session.echo > profile.echo.cap) issue(issues, "paths[" + indexes.join(",") + "].echo", "잔향 상한/하한을 벗어났습니다.");
        session.choiceLog.forEach(function (entry, logIndex) {
          if (!isRecord(entry)) {
            issue(issues, "paths[" + indexes.join(",") + "].choiceLog[" + logIndex + "]", "선택 로그 객체가 없습니다.");
            return;
          }
          var chosen = incidents[logIndex].choices[indexes[logIndex]];
          var priorLogs = session.choiceLog.slice(0, logIndex);
          var previousTrust = Math.min(profile.recordTrust.maximum, Math.max(profile.recordTrust.minimum,
            priorLogs.reduce(function (sum, item) { return sum + item.recordTrustDelta; }, content.pack.shift.startingRecordTrust)));
          var currentTrust = Math.min(profile.recordTrust.maximum, Math.max(profile.recordTrust.minimum,
            priorLogs.concat([entry]).reduce(function (sum, item) { return sum + item.recordTrustDelta; }, content.pack.shift.startingRecordTrust)));
          var previousEcho = Math.min(profile.echo.cap, Math.max(profile.echo.minimum,
            priorLogs.reduce(function (sum, item) { return sum + item.echoDelta; }, content.pack.shift.startingEcho)));
          var currentEcho = Math.min(profile.echo.cap, Math.max(profile.echo.minimum,
            priorLogs.concat([entry]).reduce(function (sum, item) { return sum + item.echoDelta; }, content.pack.shift.startingEcho)));
          if (entry.order !== logIndex + 1 || entry.incidentId !== incidents[logIndex].incidentId) {
            issue(issues, "paths[" + indexes.join(",") + "].choiceLog[" + logIndex + "]", "호출 순서 또는 로그 순서가 고정 순서와 다릅니다.");
          }
          if (!chosen || entry.choiceId !== chosen.choiceId || entry.judgement !== chosen.judgement || entry.channel !== chosen.channel ||
              entry.timeLabel !== incidents[logIndex].timeLabel || entry.resultKey !== chosen.feedbackKey || entry.logKey !== chosen.logKey) {
            issue(issues, "paths[" + indexes.join(",") + "].choiceLog[" + logIndex + "]", "선택 로그에 실제 선택 ID·시각·채널·판정·결과가 보존되지 않았습니다.");
          }
          if (!chosen || entry.recordTrustDelta !== chosen.recordTrustDelta || entry.echoDelta !== chosen.echoDelta ||
              entry.appliedRecordTrustDelta !== currentTrust - previousTrust || entry.appliedEchoDelta !== currentEcho - previousEcho) {
            issue(issues, "paths[" + indexes.join(",") + "].choiceLog[" + logIndex + "].scoreDelta", "원래 변화와 상한 적용 뒤 실제 점수 변화가 맞지 않습니다.");
          }
          if (!Array.isArray(entry.availableEvidenceIds) || entry.availableEvidenceIds.join("|") !== incidents[logIndex].evidenceIds.join("|")) {
            issue(issues, "paths[" + indexes.join(",") + "].choiceLog[" + logIndex + "].availableEvidenceIds", "선택 당시 자료 참조가 보존되지 않았습니다.");
          }
          if (!Array.isArray(entry.viewedEvidenceIds) || entry.viewedEvidenceIds.join("|") !== incidents[logIndex].evidenceIds.join("|")) {
            issue(issues, "paths[" + indexes.join(",") + "].choiceLog[" + logIndex + "].viewedEvidenceIds", "선택 당시 직접 열람한 자료 기록이 보존되지 않았습니다.");
          }
          if (Object.prototype.hasOwnProperty.call(entry, "wallClockTime")) {
            issue(issues, "paths[" + indexes.join(",") + "].choiceLog[" + logIndex + "]", "벽시계 시각을 생성하면 안 됩니다.");
          }
        });
        var allMatched = indexes.every(function (choiceIndex, incidentIndex) {
          return incidents[incidentIndex].choices[choiceIndex].judgement === "matched";
        });
        var perfectEcho = incidents.reduce(function (sum, incident) {
          var matchedChoice = incident.choices.find(function (choice) { return choice.judgement === "matched"; });
          return sum + (matchedChoice ? matchedChoice.echoDelta : 0);
        }, content.pack.shift.startingEcho);
        perfectEcho = Math.min(profile.echo.cap, Math.max(profile.echo.minimum, perfectEcho));
        if (allMatched && (session.recordTrust !== profile.recordTrust.maximum || session.echo !== perfectEcho || endingId !== profile.perfectRunEndingId)) {
          issue(issues, "paths[" + indexes.join(",") + "].ending", "모든 기준 일치 선택 경로의 점수 또는 지정된 정상 결말이 맞지 않습니다.");
        }
        return;
      }
      var options = incidents[index].choices || [];
      for (var choiceIndex = 0; choiceIndex < options.length; choiceIndex += 1) {
        visit(index + 1, indexes.concat(choiceIndex));
      }
    }
    visit(0, []);
    if (completed !== pathCount) issue(issues, "pathValidation", "전체 선택 경로를 모두 실행하지 못했습니다.");
    if (expected) {
      var expectedTotal = Object.keys(expected).reduce(function (sum, endingId) { return sum + expected[endingId]; }, 0);
      if (expectedTotal !== pathCount) issue(issues, "expectedPathDistribution", "기대 결말 분포의 합이 경로 수와 다릅니다.");
      Object.keys(expected).forEach(function (endingId) {
        if ((distribution[endingId] || 0) !== expected[endingId]) {
          issue(issues, "expectedPathDistribution." + endingId, "기대 " + expected[endingId] + "경로, 실제 " + (distribution[endingId] || 0) + "경로입니다.");
        }
      });
      Object.keys(distribution).forEach(function (endingId) {
        if (!Object.prototype.hasOwnProperty.call(expected, endingId)) issue(issues, "expectedPathDistribution." + endingId, "기대 분포에 없는 결말 ID입니다.");
      });
    }
    return { pathCount: pathCount, completed: completed, distribution: distribution };
  }

  function validate(content) {
    var issues = [];
    if (!isRecord(content)) return { issues: [{ path: "content", message: "콘텐츠 묶음 객체가 필요합니다." }], report: null };
    var coreObjects = [
      [content.manifest, "manifest"], [content.pack, "pack"], [content.station, "station"],
      [content.scene, "scene"], [content.locale, "locale"]
    ];
    coreObjects.forEach(function (entry) {
      if (!isRecord(entry[0])) issue(issues, entry[1], "필수 데이터 객체를 불러오지 못했습니다.");
    });
    if (issues.length) return { issues: issues, report: null };
    var pack = content.pack;
    function requireArray(value, path) {
      if (!Array.isArray(value)) {
        issue(issues, path, "필수 배열이 없습니다.");
        return false;
      }
      value.forEach(function (item, index) {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          issue(issues, path + "[" + index + "]", "데이터 객체가 필요합니다.");
        }
      });
      return true;
    }
    function requireStringArray(value, path) {
      if (!Array.isArray(value)) {
        issue(issues, path, "문자열 배열이 필요합니다.");
        return false;
      }
      value.forEach(function (item, index) {
        if (typeof item !== "string" || !item) issue(issues, path + "[" + index + "]", "비어 있지 않은 문자열이 필요합니다.");
      });
      return true;
    }
    requireStringArray(content.manifest.packIds, "manifest.packIds");
    requireStringArray(content.manifest.scriptFiles, "manifest.scriptFiles");
    checkUniqueStrings(issues, content.manifest.packIds, "manifest.packIds");
    checkUniqueStrings(issues, content.manifest.scriptFiles, "manifest.scriptFiles");
    if (content.manifest.defaultPackId !== pack.packId) issue(issues, "manifest.defaultPackId", "기본 팩 ID와 불러온 팩이 다릅니다.");
    requireArray(content.station.views, "station.views");
    requireArray(content.station.feeds, "station.feeds");
    requireStringArray(content.station.feedIds, "station.feedIds");
    checkUniqueStrings(issues, content.station.feedIds, "station.feedIds");
    requireArray(content.scene.components, "scene.components");
    if (!isRecord(content.locale.messages)) {
      issue(issues, "locale.messages", "문구 데이터가 필요합니다.");
    }
    if (!isRecord(pack.shift)) {
      issue(issues, "pack.shift", "근무 데이터가 필요합니다.");
    } else {
      requireStringArray(pack.shift.incidentIds, "shift.incidentIds");
      checkUniqueStrings(issues, pack.shift.incidentIds, "shift.incidentIds");
    }
    ["evidence", "incidents", "effects", "profiles"].forEach(function (field) {
      requireArray(pack[field], "pack." + field);
    });
    if (pack.flags !== undefined) requireArray(pack.flags, "pack.flags");
    if (!isRecord(pack.expectedPathDistribution)) issue(issues, "pack.expectedPathDistribution", "결말별 기대 경로 수 객체가 필요합니다.");
    else Object.keys(pack.expectedPathDistribution).forEach(function (endingId) {
      if (!Number.isInteger(pack.expectedPathDistribution[endingId]) || pack.expectedPathDistribution[endingId] < 0) {
        issue(issues, "pack.expectedPathDistribution." + endingId, "기대 경로 수는 0 이상의 정수여야 합니다.");
      }
    });
    if (Array.isArray(content.scene.components)) content.scene.components.forEach(function (component, index) {
      if (component && !isRecord(component.states)) issue(issues, "scene.components[" + (component.componentId || index) + "].states", "허용 장면 상태 객체가 필요합니다.");
      if (component && component.position !== undefined && !isRecord(component.position)) issue(issues, "scene.components[" + (component.componentId || index) + "].position", "장면 좌표 객체가 필요합니다.");
      if (component && isRecord(component.states)) Object.keys(component.states).forEach(function (state) {
        if (!isRecord(component.states[state])) issue(issues, "scene.components[" + (component.componentId || index) + "].states." + state, "상태 캡션 설정 객체가 필요합니다.");
      });
    });
    if (Array.isArray(pack.incidents)) pack.incidents.forEach(function (incident, index) {
      if (incident && !Array.isArray(incident.evidenceIds)) issue(issues, "incidents[" + (incident.incidentId || index) + "].evidenceIds", "자료 ID 배열이 필요합니다.");
      else if (incident) incident.evidenceIds.forEach(function (id, evidenceIndex) {
        if (typeof id !== "string" || !id) issue(issues, "incidents[" + (incident.incidentId || index) + "].evidenceIds[" + evidenceIndex + "]", "자료 ID 문자열이 필요합니다.");
      });
      if (incident && Array.isArray(incident.evidenceIds)) checkUniqueStrings(issues, incident.evidenceIds, "incidents[" + (incident.incidentId || index) + "].evidenceIds");
      if (incident && !Array.isArray(incident.choices)) issue(issues, "incidents[" + (incident.incidentId || index) + "].choices", "선택지 배열이 필요합니다.");
      else if (incident) {
        requireArray(incident.choices, "incidents[" + (incident.incidentId || index) + "].choices");
        incident.choices.forEach(function (choice, choiceIndex) {
          if (choice && !Array.isArray(choice.effectIds)) issue(issues, "incidents[" + (incident.incidentId || index) + "].choices[" + (choice.choiceId || choiceIndex) + "].effectIds", "effectIds 배열이 필요합니다.");
          else if (choice) choice.effectIds.forEach(function (effectId, effectIndex) {
            if (typeof effectId !== "string" || !effectId) issue(issues, "incidents[" + (incident.incidentId || index) + "].choices[" + (choice.choiceId || choiceIndex) + "].effectIds[" + effectIndex + "]", "효과 ID 문자열이 필요합니다.");
          });
          if (choice && Array.isArray(choice.effectIds)) checkUniqueStrings(issues, choice.effectIds, "incidents[" + (incident.incidentId || index) + "].choices[" + (choice.choiceId || choiceIndex) + "].effectIds");
        });
      }
      if (incident && incident.enterSceneStates !== undefined) requireArray(incident.enterSceneStates, "incidents[" + (incident.incidentId || index) + "].enterSceneStates");
    });
    if (Array.isArray(pack.profiles)) pack.profiles.forEach(function (profile, index) {
      if (profile && !Array.isArray(profile.endings)) issue(issues, "profiles[" + (profile.profileId || index) + "].endings", "결말 규칙 배열이 필요합니다.");
      else if (profile) requireArray(profile.endings, "profiles[" + (profile.profileId || index) + "].endings");
    });
    if (issues.length) return { issues: issues, report: null };

    if (pack.schemaVersion !== 1) issue(issues, "pack.schemaVersion", "지원하는 스키마 버전은 1입니다.");
    if (content.manifest.schemaVersion !== 1) issue(issues, "manifest.schemaVersion", "지원하는 manifest 스키마 버전은 1입니다.");
    if (content.station.schemaVersion !== 1) issue(issues, "station.schemaVersion", "지원하는 역 스키마 버전은 1입니다.");
    if (content.scene.schemaVersion !== 1) issue(issues, "scene.schemaVersion", "지원하는 장면 스키마 버전은 1입니다.");
    if (content.locale.schemaVersion !== 1) issue(issues, "locale.schemaVersion", "지원하는 문구 스키마 버전은 1입니다.");
    if (content.manifest.packIds.indexOf(pack.packId) < 0) issue(issues, "manifest.packIds", "manifest에 등록되지 않은 팩입니다: " + pack.packId);
    if (pack.stationId !== content.station.stationId) issue(issues, "pack.stationId", "팩이 요구하는 역 데이터와 실제 역이 다릅니다.");
    if (pack.routeId !== content.station.routeId) issue(issues, "pack.routeId", "팩이 요구하는 노선 데이터와 실제 노선이 다릅니다.");
    if (content.scene.sceneTemplateId !== content.station.sceneTemplateId) issue(issues, "station.sceneTemplateId", "역에서 참조한 장면 템플릿이 일치하지 않습니다.");
    if (content.scene.stationId !== content.station.stationId) issue(issues, "scene.stationId", "장면 템플릿과 역 ID가 일치하지 않습니다.");
    if (content.locale.localeId !== pack.localeId) issue(issues, "pack.localeId", "팩의 문구 데이터가 일치하지 않습니다.");
    if (pack.shift.incidentIds.length !== pack.incidents.length ||
        pack.shift.incidentIds.some(function (id, index) { return !pack.incidents[index] || pack.incidents[index].incidentId !== id; })) {
      issue(issues, "shift.incidentIds", "근무 순서와 호출 데이터 순서가 다릅니다.");
    }
    if (content.station.feedIds.length !== content.station.feeds.length ||
        content.station.feedIds.some(function (id, index) { return !content.station.feeds[index] || content.station.feeds[index].feedId !== id; })) {
      issue(issues, "station.feedIds", "역의 CCTV 피드 목록과 실제 피드 순서가 다릅니다.");
    }
    if (typeof content.station.nameKey !== "string" || !content.station.nameKey) issue(issues, "station.nameKey", "역 이름 문구 키가 필요합니다.");
    if (content.station.views.length !== 4) issue(issues, "station.views", "첫 근무에는 CCTV·운행 기록·통화 기록·근무 수칙 화면이 필요합니다.");
    if (content.station.feeds.length !== 3) issue(issues, "station.feeds", "첫 근무에는 CCTV 피드 세 개가 필요합니다.");
    if (pack.incidents.length !== 5 || pack.incidents.some(function (incident) { return incident.choices.length !== 3; })) {
      issue(issues, "shift", "첫 근무 출시 규칙은 호출 5개, 호출당 선택지 3개입니다.");
    }
    checkIds(issues, content);
    var componentMap = checkSceneAndAssets(issues, content);
    checkLocaleReferences(issues, content);
    var refs = checkEvidenceAndChoices(issues, content, componentMap);
    var effects = checkEffects(issues, content, componentMap, refs.incidentMap);
    pack.incidents.forEach(function (incident) {
      incident.choices.forEach(function (choice) {
        (choice.effectIds || []).forEach(function (effectId) {
          var effect = effects[effectId];
          if (effect && effect.type === "set_scene_state" && !componentMap[effect.targetId]) {
            issue(issues, "incidents[" + incident.incidentId + "].choices[" + choice.choiceId + "].effectIds", "등록되지 않은 장면 상태 효과를 참조합니다.");
          }
        });
      });
    });
    var profile = checkProfile(issues, content);
    var pathReport = null;
    if (!issues.length && profile) {
      pathReport = checkAllPaths(issues, content, profile);
    }
    return {
      issues: issues,
      report: pathReport ? {
        pathCount: pathReport.pathCount,
        completedPaths: pathReport.completed,
        endingDistribution: pathReport.distribution,
        scoreCombinations: (profile.recordTrust.maximum - profile.recordTrust.minimum + 1) * (profile.echo.maximum - profile.echo.minimum + 1)
      } : null
    };
  }

  runtime.ContentValidator = { validate: validate };
}(window));
