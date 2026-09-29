(function (root) {
  "use strict";

  var runtime = root.NextStationGame = root.NextStationGame || {};

  function testClause(clause, totals) {
    if (!clause || typeof clause !== "object" || Array.isArray(clause)) return false;
    if (clause.always === true) return true;
    if (Array.isArray(clause.anyOf)) return clause.anyOf.some(function (child) { return testClause(child, totals); });
    if (Array.isArray(clause.allOf)) return clause.allOf.every(function (child) { return testClause(child, totals); });
    var value = totals[clause.metric];
    switch (clause.operator) {
      case "eq": return value === clause.value;
      case "lte": return value <= clause.value;
      case "gte": return value >= clause.value;
      case "lt": return value < clause.value;
      case "gt": return value > clause.value;
      default: return false;
    }
  }

  function matchingEndings(profile, totals) {
    return profile.endings
      .filter(function (ending) { return testClause(ending.condition, totals); })
      .sort(function (a, b) { return a.priority - b.priority; });
  }

  function resolve(profile, totals) {
    var matches = matchingEndings(profile, totals);
    if (!matches.length) return null;
    if (matches.length > 1 && matches[0].priority === matches[1].priority) return null;
    return matches[0];
  }

  runtime.EndingResolver = {
    resolve: resolve,
    countMatches: function (profile, totals) {
      var matches = matchingEndings(profile, totals);
      if (!matches.length) return 0;
      return matches.filter(function (ending) { return ending.priority === matches[0].priority; }).length;
    }
  };
}(window));
