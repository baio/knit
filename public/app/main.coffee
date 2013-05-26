require.config
  baseUrl: "/"

require [
  "ural/localization/localizationManager",
  "ural/router",
  "ural/vm/itemVM",
  "ural/bindings/_all",
  "app/config",
  "ural/libs/localization/ru/moment.ru"
],
  (localManager, router, itemVM, bindingOpts, config) ->
    localManager.setup "en"
    ko.validation.configure(
      messagesOnModified: true
      insertMessages: false
    )
    itemVM.KeyFieldName = "_id"
    bindingOpts.autocomplete =
      baseUrl: config.base_url
      fields:
        key:  "key"
        value: "val"
        label: "val"
      data:
        term: "term"

    router.Router.StartRouting "app/controllers",
      [
        { url: "/", path : {controller : "graph", action : "data", arg : "518b989739ed9714289d0bc1"} }
        { url: "{controller}/{action}/:id:" }
      ]
