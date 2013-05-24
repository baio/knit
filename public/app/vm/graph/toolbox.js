// Generated by CoffeeScript 1.6.2
(function() {
  define(function() {
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
          _this.name_src(edge.source.name);
          _this.name_tgt(edge.target.name);
          return _this.tags(edge.tags);
        };
        this.panel.onClickEdge = function(edge) {
          var offset, pos, x, y;

          pos = d3.mouse(this);
          console.log(pos);
          offset = $("#_body").offset();
          x = pos[0] - $("body").scrollLeft() - offset.left;
          y = pos[1] - $("body").scrollTop() - offset.top;
          console.log(x);
          console.log(y);
          $("#_toolbox").css({
            left: x,
            top: y
          });
          return console.log($("#_toolbox").offset());
        };
      }

      Toolbox.prototype.moveToConner = function(data, event) {
        event.preventDefault();
        return $("#_toolbox").css({
          left: '',
          top: ''
        });
      };

      return Toolbox;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=toolbox.map
*/
