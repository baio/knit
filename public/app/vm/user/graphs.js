// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/vm/indexVM", "app/vm/user/graph"], function(indexVM, Graph) {
    var Graphs;

    return Graphs = (function(_super) {
      __extends(Graphs, _super);

      function Graphs(contribs) {
        this.contribs = contribs;
        Graphs.__super__.constructor.call(this, "graph");
      }

      Graphs.prototype.onCreateItem = function() {
        return new Graph(this.resource, this, this.contribs);
      };

      Graphs.prototype.switchContentShown = function(data, event) {
        var $wcontent, t;

        event.preventDefault();
        t = event.currentTarget;
        $wcontent = $(".widget-content", $(t).closest("table"));
        if ($wcontent.is(':visible')) {
          $(t).children('i').removeClass('icon-chevron-up');
          $(t).children('i').addClass('icon-chevron-down');
        } else {
          $(t).children('i').removeClass('icon-chevron-down');
          $(t).children('i').addClass('icon-chevron-up');
        }
        return $wcontent.toggle(500);
      };

      return Graphs;

    })(indexVM);
  });

}).call(this);

/*
//@ sourceMappingURL=graphs.map
*/
