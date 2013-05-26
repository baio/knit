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
        { url: "/", path : {controller : "public", action : "item", arg : "51933fc300238619d035f4a5"} }
        { url: "{controller}/{action}/:id:" }
      ]
