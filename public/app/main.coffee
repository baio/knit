require.config
  baseUrl: "/"

require ["ural/localization/localizationManager", "ural/router", "ural/bindings/_all"],
  (localManager, router) ->
    localManager.setup "en"
    ko.validation.configure(
      messagesOnModified: true
      insertMessages: false
    )

    router.Router.StartRouting "app/controllers",
      [
        { url: "/", path : {controller : "contrib", action : "start"} }
        { url: "{controller}/{action}" }
      ]
