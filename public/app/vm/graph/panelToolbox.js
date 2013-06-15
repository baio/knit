// Generated by CoffeeScript 1.6.2
(function() {
  define(function() {
    var PanelToolbox;

    return PanelToolbox = (function() {
      function PanelToolbox(nav, panel) {
        var _this = this;

        this.nav = nav;
        this.panel = panel;
        this.isShown = ko.observable(false);
        this.colorScheme = ko.observable(0);
        this.colorSchemesList = ko.observableArray([
          {
            key: 0,
            val: "Темная"
          }, {
            key: 1,
            val: "Светлая"
          }
        ]);
        this.colorScheme.subscribe(function(val) {
          if (val === 0) {
            $("#_body").removeClass("light");
            $("#show_toolbox_panel_button").css({
              color: "white"
            });
            _this.panel.updateText(_this._getTextCls());
          }
          if (val === 1) {
            $("#show_toolbox_panel_button").css({
              color: "black"
            });
            $("#_body").addClass("light");
            return _this.panel.updateText(_this._getTextCls());
          }
        });
        this.font = ko.observable(0);
        this.fontsList = ko.observableArray([
          {
            key: 0,
            val: "Маленькие"
          }, {
            key: 1,
            val: "Большие"
          }, {
            key: 2,
            val: "Не показывать"
          }
        ]);
        this.font.subscribe(function() {
          return _this.panel.updateText(_this._getTextCls());
        });
        this.layout = ko.observable(0);
        this.layoutsList = ko.observableArray([
          {
            key: 0,
            val: "Использовать силу связей"
          }, {
            key: 1,
            val: "Не использовать"
          }
        ]);
        this.layout.subscribe(function(val) {
          return _this.panel.setForceLayout(val === 0);
        });
      }

      PanelToolbox.prototype._getTextCls = function() {
        var cls;

        cls = "text";
        if (this.colorScheme() === 1) {
          cls += " light";
        }
        if (this.font() === 1) {
          cls += " big";
        } else if (this.font() === 2) {
          cls += " hidden";
        }
        return cls;
      };

      PanelToolbox.prototype.hide = function() {
        return this.isShown(false);
      };

      PanelToolbox.prototype.show = function() {
        return this.isShown(true);
      };

      return PanelToolbox;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=panelToolbox.map
*/
