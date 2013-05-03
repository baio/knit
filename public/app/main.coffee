require.config
  baseUrl: "/"

require ["ural/localization/localizationManager", "ural/router", "ural/bindings/_all"],
  (localManager, router) ->
    localManager.setup "en"
    router.Router.StartRouting "app/controllers",
      [
        { url: "/", path : {controller : "contrib", action : "index"} }
        { url: "{controller}/{action}" }
      ]
