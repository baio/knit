// Generated by CoffeeScript 1.6.2
(function() {
  define(["app/dataProvider"], function(dataProvider) {
    var Toolbox;

    return Toolbox = (function() {
      function Toolbox(nav, panel) {
        var _this = this;

        this.nav = nav;
        this.panel = panel;
        this.name_src = ko.observable();
        this.name_tgt = ko.observable();
        this.tags = ko.observableArray();
        this.url_src = ko.computed(function() {
          return "https://www.google.ru/search?q=" + (_this.name_src());
        });
        this.url_tgt = ko.computed(function() {
          return "https://www.google.ru/search?q=" + (_this.name_tgt());
        });
        this.panel.onHoverEdge = function(edge) {
          console.log("hover : " + edge);
          _this.name_src(edge.source.name);
          _this.name_tgt(edge.target.name);
          return _this.tags(edge.tags);
        };
      }

      Toolbox.prototype.save = function() {
        return dataProvider.ajax("graphs", "post", {
          contrib: this.nav.activeContrib().id,
          data: this.panel.toData()
        }, function() {});
      };

      return Toolbox;

    })();
  });

}).call(this);
