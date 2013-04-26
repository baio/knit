// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/controller", "app/models/menu", "app/models/graph/panel", "app/models/graph/send"], function(controller, menu, panel, send) {
    var GraphController;
    GraphController = (function(_super) {

      __extends(GraphController, _super);

      function GraphController() {
        var nav;
        nav = new menu.Menu();
        ko.applyBindings(nav, $("#_nav")[0]);
        GraphController.__super__.constructor.apply(this, arguments);
      }

      GraphController.prototype.panel = function() {
        return this.view("app/views/graph/panel.html", new panel.Panel());
      };

      GraphController.prototype.send = function() {
        return this.view("app/views/graph/send.html", new send.Send());
      };

      return GraphController;

    })(controller.Controller);
    return {
      Controller: GraphController
    };
  });

}).call(this);
