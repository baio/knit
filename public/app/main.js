// Generated by CoffeeScript 1.6.2
(function() {
  require.config({
    baseUrl: "/"
  });

  require(["ural/localization/localizationManager", "ural/router", "ural/bindings/_all"], function(localManager, router) {
    localManager.setup("En");
    return router.Router.StartRouting("app/controllers", [
      {
        url: "/",
        path: {
          controller: "graph",
          action: "panel"
        }
      }, {
        url: "{controller}/{action}"
      }
    ]);
  });

}).call(this);
