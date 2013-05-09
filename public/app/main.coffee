require.config
  baseUrl: "/"

require ["ural/localization/localizationManager", "ural/router", "ural/vm/itemVM", "ural/bindings/_all"],
  (localManager, router, itemVM, bindingOpts) ->
    localManager.setup "en"
    ko.validation.configure(
      messagesOnModified: true
      insertMessages: false
    )
    itemVM.KeyFieldName = "_id"
    bindingOpts.autocomplete =
      baseUrl: "http://localhost:8080"
      fields:
        key:  "key"
        value: "val"
        label: "val"
      data:
        term: "term"

    router.Router.StartRouting "app/controllers",
      [
        { url: "/", path : {controller : "graph", action : "panel"} }
        { url: "{controller}/{action}/:id:" }
      ]
