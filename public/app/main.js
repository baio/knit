// Generated by CoffeeScript 1.6.2
(function() {
  require.config({
    baseUrl: "/"
  });

  require(["ural/localization/localizationManager", "ural/router", "ural/vm/itemVM", "ural/bindings/_all", "app/config", "ural/libs/localization/ru/moment.ru"], function(localManager, router, itemVM, bindingOpts, config) {
    var rr;

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
    $.jStorage.set("app_reload", "true");
    rr = new router.Router("app/controllers");
    rr.onSwitchLoadingView = function() {
      $("#layout_loading").show();
      $("#layout_content").hide();
      $(".loading_quote").hide();
      return $("#loading_quote_" + (Math.floor(Math.random() * (5 - 1 + 1)) + 1)).show();
    };
    return rr.startRouting([
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
    /*
    router.Router.StartRouting "app/controllers",
      [
        { url: "/", path : {controller : "graph", action : "panel"} }
        { url: "{controller}/{action}/:id:" }
      ]
    */

  });

}).call(this);

/*
//@ sourceMappingURL=main.map
*/
