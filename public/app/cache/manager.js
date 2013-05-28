// Generated by CoffeeScript 1.6.2
(function() {
  define(["app/cache/graph", "app/cache/curUser", "app/config"], function(graph, curUser, config) {
    return function(resource) {
      if (config.disable_cache) {
        return null;
      }
      switch (resource) {
        case "graphs":
          return graph;
        case "curUser":
          return curUser;
        default:
          return null;
      }
    };
  });

}).call(this);

/*
//@ sourceMappingURL=manager.map
*/
