(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};
  var audioContext = null;
  var ambience = null;
  var ambienceGain = null;
  var soundEnabled = false;
  var motionReduced = false;

  function render(content, session) {
    var panel = document.getElementById("resultPanel");
    if (session.phase !== "result") {
      panel.hidden = true;
      return;
    }
    var incident = runtime.Session.currentIncident(content, session);
    var choice = incident.choices.find(function (item) { return item.choiceId === session.currentChoiceId; });
    if (!choice) return;
    var label = content.locale.messages[choice.channel === "broadcast" ? "ui.resultBroadcast" : "ui.resultWithhold"];
    document.getElementById("resultLabel").textContent = label;
    document.getElementById("resultChoice").textContent = content.locale.messages[choice.textKey];
    document.getElementById("resultCopy").textContent = content.locale.messages[choice.feedbackKey];
    document.getElementById("resultAction").textContent =
      content.locale.messages[choice.channel === "broadcast" ? "ui.broadcastDispatched" : "ui.withholdRecorded"];
  }

  function getContext() {
    if (audioContext) return audioContext;
    var Constructor = root.AudioContext || root.webkitAudioContext;
    if (!Constructor) return null;
    audioContext = new Constructor();
    ambience = audioContext.createOscillator();
    ambience.type = "sine";
    ambience.frequency.value = 46;
    ambienceGain = audioContext.createGain();
    ambienceGain.gain.value = 0;
    ambience.connect(ambienceGain);
    ambienceGain.connect(audioContext.destination);
    ambience.start();
    return audioContext;
  }

  function setSound(enabled, content) {
    var button = document.getElementById("soundToggle");
    if (enabled) {
      try {
        var context = getContext();
        if (!context) throw new Error("Web Audio is unavailable");
        if (context.state === "suspended") context.resume();
        ambienceGain.gain.setTargetAtTime(0.006, context.currentTime, 0.08);
        soundEnabled = true;
      } catch (error) {
        soundEnabled = false;
      }
    } else {
      soundEnabled = false;
      if (audioContext && ambienceGain) ambienceGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.08);
    }
    button.textContent = content.locale.messages[soundEnabled ? "ui.soundOn" : "ui.soundOff"];
    button.setAttribute("aria-pressed", String(soundEnabled));
    return soundEnabled;
  }

  function toggleSound(content) {
    return setSound(!soundEnabled, content);
  }

  function playCue(cueId) {
    if (!soundEnabled || cueId !== "relay-click" || !audioContext) return;
    try {
      var oscillator = audioContext.createOscillator();
      var gain = audioContext.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = 170;
      gain.gain.setValueAtTime(0.009, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.055);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.06);
    } catch (error) {
      // Audio is optional; result text and scene state carry the full feedback.
    }
  }

  function setMotionReduced(reduced, content) {
    motionReduced = Boolean(reduced);
    document.body.classList.toggle("reduce-motion", motionReduced);
    var button = document.getElementById("motionToggle");
    button.textContent = content.locale.messages[motionReduced ? "ui.motionReduced" : "ui.motionFull"];
    button.setAttribute("aria-pressed", String(motionReduced));
    return motionReduced;
  }

  function toggleMotion(content) {
    return setMotionReduced(!motionReduced, content);
  }

  function prefersReducedMotion() {
    return Boolean(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  runtime.FeedbackRenderer = {
    render: render,
    setSound: setSound,
    toggleSound: toggleSound,
    playCue: playCue,
    setMotionReduced: setMotionReduced,
    toggleMotion: toggleMotion,
    prefersReducedMotion: prefersReducedMotion
  };
}(window));
