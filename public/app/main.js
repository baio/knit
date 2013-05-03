// Generated by CoffeeScript 1.6.2
(function() {
  require.config({
    baseUrl: "/"
  });

  require(["ural/localization/localizationManager", "ural/router", "ural/bindings/_all"], function(localManager, router) {
    localManager.setup("en");
    return router.Router.StartRouting("app/controllers", [
      {
        url: "/",
        path: {
          controller: "contrib",
          action: "index"
        }
      }, {
        url: "{controller}/{action}"
      }
    ]);
  });

}).call(this);
