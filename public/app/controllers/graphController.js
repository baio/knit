// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["app/controllers/controllerBase", "app/vm/graph/panel", "app/vm/graph/data", "app/vm/graph/toolbox"], function(controllerBase, Panel, Data, toolbox) {
    var GraphController, _ref;

    GraphController = (function(_super) {
      __extends(GraphController, _super);

      function GraphController() {
        _ref = GraphController.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GraphController.prototype.panel = function(graph) {
        var pl,
          _this = this;

        pl = new Panel();
        return this.view_apply("app/views/graph/panel.html", {
          _layouts: {
            _body: {
              loader: pl,
              filter: {
                graph: graph
              }
            },
            _toolbox: new toolbox(this.nav, pl)
          }
        }, function(err) {
          if (!err) {
            return _this.nav.activeGraph({
              id: pl.data.id,
              name: pl.data.name,
              isYours: pl.data.isYours
            });
          }
        });
      };

      GraphController.prototype.data = function(graph) {
        var d,
          _this = this;

        d = new Data();
        return this.view_apply("app/views/graph/data.html", {
          _layouts: {
            _body: {
              loader: d,
              filter: {
                graph: graph,
                context: "data"
              }
            }
          }
        }, function(err) {
          return console.log(err);
        });
      };

      return GraphController;

    })(controllerBase.Controller);
    return {
      Controller: GraphController
    };
  });

}).call(this);

/*
//@ sourceMappingURL=graphController.map
*/
