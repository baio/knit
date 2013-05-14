// Generated by CoffeeScript 1.6.2
(function() {
  require.config({
    baseUrl: "/"
  });

  require(["ural/localization/localizationManager", "ural/router", "ural/vm/itemVM", "ural/bindings/_all", "app/config"], function(localManager, router, itemVM, bindingOpts, config) {
    localManager.setup("en");
    ko.validation.configure({
      messagesOnModified: true,
      insertMessages: false
    });
    itemVM.KeyFieldName = "_id";
    bindingOpts.autocomplete = {
      baseUrl: config.base_url,
      fields: {
        key: "key",
        value: "val",
        label: "val"
      },
      data: {
        term: "term"
      }
    };
    return router.Router.StartRouting("app/controllers", [
      {
        url: "/",
        path: {
          controller: "graph",
          action: "panel"
        }
      }, {
        url: "{controller}/{action}/:id:"
      }
    ]);
  });

}).call(this);

/*
//@ sourceMappingURL=main.map
*/
