require.config
  baseUrl: "/"

require ["ural/Localization/localizationManager", "ural/router", "ural/bindings/_all"],
  (localManager, router) ->
    localManager.setup "En"
    router.Router.StartRouting "app/controllers",
      [
        { url: "/", path : {controller : "graph", action : "panel"} }
        { url: "{controller}/{action}" }
      ]
