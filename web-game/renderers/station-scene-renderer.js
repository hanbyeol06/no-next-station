(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};
  var svgNamespace = "http://www.w3.org/2000/svg";

  function svgNode(name, attributes) {
    var node = document.createElementNS(svgNamespace, name);
    Object.keys(attributes || {}).forEach(function (key) { node.setAttribute(key, String(attributes[key])); });
    return node;
  }

  function rect(group, x, y, width, height, fill, stroke, extra) {
    var attributes = { x: x, y: y, width: width, height: height, fill: fill };
    if (stroke) attributes.stroke = stroke;
    Object.keys(extra || {}).forEach(function (key) { attributes[key] = extra[key]; });
    var node = svgNode("rect", attributes);
    group.appendChild(node);
    return node;
  }

  function line(group, x1, y1, x2, y2, stroke, width, opacity) {
    group.appendChild(svgNode("line", {
      x1: x1, y1: y1, x2: x2, y2: y2, stroke: stroke,
      "stroke-width": width, opacity: opacity === undefined ? 1 : opacity,
      "stroke-linecap": "round"
    }));
  }

  function circle(group, cx, cy, radius, fill, opacity) {
    group.appendChild(svgNode("circle", { cx: cx, cy: cy, r: radius, fill: fill, opacity: opacity === undefined ? 1 : opacity }));
  }

  function stateOf(session, component) {
    return session.sceneStates[component.componentId] || component.initialState;
  }

  function drawShutter(group, component, state) {
    var p = component.position;
    if (state === "closed") {
      rect(group, p.x, p.y, p.width, p.height, "#111a18", "#aab5a5", { "stroke-width": 3 });
      for (var row = 1; row < 7; row += 1) {
        line(group, p.x + 3, p.y + row * p.height / 7, p.x + p.width - 3, p.y + row * p.height / 7, "#5d7066", 3, 0.9);
      }
      for (var col = 1; col < 8; col += 1) {
        line(group, p.x + col * p.width / 8, p.y + 2, p.x + col * p.width / 8, p.y + p.height - 2, "#40514a", 1, 0.7);
      }
      return;
    }
    rect(group, p.x, p.y, p.width, p.height, "#030706", "#58665d", { "stroke-width": 2 });
    rect(group, p.x + 2, p.y + 2, p.width - 4, p.height * 0.27, "#31403a", "#819084", { "stroke-width": 2 });
    for (var openRow = 1; openRow < 3; openRow += 1) {
      line(group, p.x + 3, p.y + openRow * p.height * 0.09, p.x + p.width - 3, p.y + openRow * p.height * 0.09, "#66766b", 2, 0.9);
    }
  }

  function drawComponent(group, component, state, content) {
    var p = component.position;
    var componentLayer = group;
    group = svgNode("g", { class: "scene-component-vector" });
    if (component.renderKind === "shutter") {
      drawShutter(group, component, state);
    } else if (component.renderKind === "light") {
      var lightFill = state === "off" ? "#334039" : (state === "flickering" || state === "unsteady" ? "#c49461" : "#b9d4b4");
      rect(group, p.x, p.y, p.width, p.height, lightFill, "#d2d5bd", { rx: 4, opacity: state === "off" ? 0.55 : 0.9, class: state === "flickering" || state === "unsteady" ? "scene-light scene-light--unsteady" : "scene-light" });
    } else if (component.renderKind === "reveal" && state === "unreal") {
      rect(group, p.x, p.y, p.width, p.height, "#030607", "#584c48", { "stroke-width": 1, opacity: 0.96 });
      circle(group, p.x + p.width * 0.68, p.y + p.height * 0.76, 2, "#899b8c", 0.72);
    } else if (component.renderKind === "indicator") {
      if (state !== "hidden" && state !== "clear" && state !== "none") {
        rect(group, p.x, p.y, p.width, p.height, "#131b18", "#899384", { rx: 3, "stroke-width": 1 });
        circle(group, p.x + p.width - 9, p.y + p.height / 2, 4, "#d8b475", 0.92);
      }
    } else if (component.renderKind === "display") {
      rect(group, p.x, p.y, p.width, p.height, "#101815", "#6a796f", { rx: 2, "stroke-width": 2 });
      var ink = state === "blank" || state === "cancelled" ? "#9eae9e" : "#c9d7bd";
      var bars = state === "shiftNumber" ? 5 : 3;
      for (var bar = 0; bar < bars; bar += 1) {
        rect(group, p.x + 9 + bar * 9, p.y + p.height * 0.38, 5, p.height * 0.23, ink, null, { opacity: 0.78 });
      }
      if (state === "confirmed" || state === "fixedLine") {
        line(group, p.x + p.width - 27, p.y + 12, p.x + p.width - 12, p.y + 12, "#b7d2b0", 2, 0.9);
      }
    } else if (component.renderKind === "power") {
      for (var tick = 0; tick < 3; tick += 1) {
        rect(group, p.x + tick * 8, p.y + (2 - tick) * 6, 5, 9 + tick * 6, state === "off" ? "#37423d" : "#b3c2ad", null, { opacity: state === "off" ? 0.45 : 0.82 });
      }
    } else if (component.renderKind === "reflection" && state === "present") {
      group.appendChild(svgNode("ellipse", { cx: p.x + p.width / 2, cy: p.y + p.height / 2, rx: p.width / 2, ry: p.height / 2, fill: "#a7b5a8", opacity: 0.18 }));
      line(group, p.x + p.width * 0.35, p.y + 8, p.x + p.width * 0.44, p.y + p.height - 7, "#9dad9e", 3, 0.26);
    } else if (component.renderKind === "trace") {
      if (state === "wet" || state === "visible" || state === "present" || state === "short") {
        var traceColor = state === "short" ? "#c5c5ae" : "#9bb1a8";
        for (var mark = 0; mark < 4; mark += 1) {
          circle(group, p.x + 6 + mark * Math.max(5, p.width / 5), p.y + p.height * (0.3 + (mark % 2) * 0.32), Math.max(2, Math.min(6, p.height / 4)), traceColor, state === "short" ? 0.27 : 0.42);
        }
        if (state === "wet") {
          line(group, p.x, p.y + p.height * 0.85, p.x + p.width, p.y + p.height * 0.25, "#90a69c", 2, 0.32);
        }
      }
    } else if (component.renderKind === "signal" && state === "twin") {
      circle(group, p.x + p.width * 0.34, p.y + p.height * 0.36, 7, "#e2dfc4", 0.88);
      circle(group, p.x + p.width * 0.7, p.y + p.height * 0.36, 7, "#e2dfc4", 0.88);
      rect(group, p.x + 8, p.y + p.height * 0.62, p.width - 16, p.height * 0.18, "#b9c6b9", "#7e8a80", { opacity: 0.24 });
    } else if (component.renderKind === "speaker") {
      rect(group, p.x, p.y, p.width, p.height, "#1b2723", "#829084", { rx: 3, "stroke-width": 2 });
      for (var vent = 1; vent < 5; vent += 1) {
        line(group, p.x + 5, p.y + vent * p.height / 5, p.x + p.width - 5, p.y + vent * p.height / 5, "#849187", 1, 0.72);
      }
      if (state === "answering") {
        group.appendChild(svgNode("path", { d: "M" + (p.x + p.width + 5) + " " + (p.y + 7) + " Q" + (p.x + p.width + 18) + " " + (p.y + p.height / 2) + " " + (p.x + p.width + 5) + " " + (p.y + p.height - 7), fill: "none", stroke: "#b2b9aa", "stroke-width": 2, opacity: 0.55 }));
      }
    } else if (component.renderKind === "actor") {
      if (state !== "hidden" && state !== "absent") {
        var asset = root.NextStationAssets && root.NextStationAssets[component.assetId];
        var hasStateAsset = asset && asset.states && Object.prototype.hasOwnProperty.call(asset.states, state);
        var actorSource = hasStateAsset ? asset.states[state] : (asset && asset.src);
        var fallback = svgNode("g", { class: "scene-character-fallback" });
        circle(fallback, p.x + p.width / 2, p.y + 11, 9, "#111715", 0.94);
        rect(fallback, p.x + p.width * 0.3, p.y + 23, p.width * 0.4, p.height * 0.57, "#111715", null, { rx: 5, opacity: 0.94 });
        group.appendChild(fallback);
        if (actorSource) {
          var image = svgNode("image", {
            href: new URL(actorSource, document.baseURI).href,
            x: p.x + (state === "withdrawn" ? -11 : 0),
            y: p.y,
            width: p.width,
            height: p.height,
            preserveAspectRatio: "xMidYMax meet",
            class: "scene-character"
          });
          image.addEventListener("load", function () { fallback.remove(); }, { once: true });
          image.addEventListener("error", function () { image.remove(); }, { once: true });
          group.appendChild(image);
        }
        circle(group, p.x + p.width / 2, p.y + 15, 18, "#c1c6b0", 0.08);
      }
    } else if (component.renderKind === "mask" && state === "erased") {
      rect(group, p.x, p.y, p.width, p.height, "#020303", null, { rx: 4, opacity: 0.97 });
    } else if (component.renderKind === "door") {
      rect(group, p.x, p.y, p.width, p.height, "#101714", "#9aa396", { "stroke-width": 3 });
      if (state === "ajar") {
        rect(group, p.x + p.width * 0.57, p.y + 2, p.width * 0.42, p.height - 4, "#040706", "#55645a", { "stroke-width": 2 });
        line(group, p.x + p.width * 0.55, p.y + 3, p.x + p.width * 0.55, p.y + p.height - 3, "#9aa396", 2, 0.8);
      } else {
        line(group, p.x + p.width * 0.86, p.y + p.height * 0.53, p.x + p.width * 0.86, p.y + p.height * 0.68, "#b6a775", 3, 0.88);
      }
    }
    var stateImageSource = null;
    if (component.renderKind !== "actor" && component.assetId) {
      var stateAssets = root.NextStationAssets && root.NextStationAssets[component.assetId] && root.NextStationAssets[component.assetId].states;
      stateImageSource = stateAssets && stateAssets[state];
    }
    componentLayer.appendChild(group);
    if (stateImageSource) {
      var stateImage = svgNode("image", {
        href: new URL(stateImageSource, document.baseURI).href,
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height,
        preserveAspectRatio: "xMidYMid meet",
        class: "scene-component-image"
      });
      stateImage.addEventListener("load", function () { group.setAttribute("visibility", "hidden"); }, { once: true });
      stateImage.addEventListener("error", function () { stateImage.remove(); }, { once: true });
      componentLayer.appendChild(stateImage);
    }
  }

  function stateCaptions(content, session, feed) {
    var components = content.scene.components
      .filter(function (component) { return component.sceneId === feed.sceneId; })
      .sort(function (a, b) { return a.layer - b.layer; });
    var importantKinds = ["shutter", "door", "display"];
    var captions = [];
    components.forEach(function (component) {
      var state = stateOf(session, component);
      var stateInfo = component.states[state];
      if (!stateInfo || !stateInfo.captionKey) return;
      if (state !== component.initialState || importantKinds.indexOf(component.renderKind) >= 0) {
        captions.push(content.locale.messages[stateInfo.captionKey]);
      }
    });
    return captions;
  }

  function render(stage, caption, content, session) {
    var feed = content.station.feeds.find(function (item) { return item.feedId === session.currentFeedId; });
    if (!feed) return;
    stage.classList.remove("asset-unavailable");
    stage.replaceChildren();

    var asset = root.NextStationAssets && root.NextStationAssets[feed.assetId];
    var background = document.createElement("img");
    background.className = "scene-background";
    background.alt = "";
    background.decoding = "async";
    background.addEventListener("error", function () {
      background.hidden = true;
      stage.classList.add("asset-unavailable");
    }, { once: true });
    if (asset && asset.src) background.src = new URL(asset.src, document.baseURI).href;
    else {
      background.hidden = true;
      stage.classList.add("asset-unavailable");
    }
    stage.appendChild(background);

    var overlay = svgNode("svg", {
      class: "scene-overlay",
      viewBox: "0 0 " + content.scene.width + " " + content.scene.height,
      preserveAspectRatio: "xMidYMid meet",
      "aria-hidden": "true",
      focusable: "false"
    });
    var components = content.scene.components
      .filter(function (component) { return component.sceneId === feed.sceneId; })
      .sort(function (a, b) { return a.layer - b.layer; });
    components.forEach(function (component) {
      var layer = svgNode("g", { "data-layer": component.layer });
      drawComponent(layer, component, stateOf(session, component), content);
      overlay.appendChild(layer);
    });
    stage.appendChild(overlay);
    stage.setAttribute("aria-label", content.locale.messages[feed.labelKey]);

    var lines = [content.locale.messages[feed.captionKey]].concat(stateCaptions(content, session, feed));
    caption.replaceChildren();
    var heading = document.createElement("strong");
    heading.textContent = content.locale.messages["ui.feedStatus"];
    caption.appendChild(heading);
    var copy = document.createElement("p");
    copy.textContent = Array.from(new Set(lines)).join(" ");
    caption.appendChild(copy);
  }

  runtime.StationSceneRenderer = { render: render };
}(window));
