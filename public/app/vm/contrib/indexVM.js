// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/vm/indexVM", "app/vm/contrib/itemVM", "app/dataProvider"], function(indexVM, itemVM, dataProvider) {
    var IndexVM;

    return IndexVM = (function(_super) {
      __extends(IndexVM, _super);

      function IndexVM() {
        this.name = ko.observable();
        this.date = ko.observable();
        this.url = ko.observable();
        this.isModifyed = ko.observable();
        IndexVM.__super__.constructor.call(this, "contrib");
      }

      IndexVM.prototype.onCreateItem = function() {
        return new itemVM();
      };

      IndexVM.prototype.onLoad = function(filter, done) {
        var _this = this;

        return dataProvider.get("contribs", filter, function(err, data) {
          if (!err) {
            _this.name(data.name);
            _this.date(data.date);
            _this.url(data.url);
            return done(err, data.items);
          } else {
            return done(null);
          }
        });
      };

      IndexVM.prototype.onUpdate = function(data, done) {
        var d;

        d = {
          name: "data-gov-1",
          url: this.url(),
          data: data
        };
        return dataProvider.update("contribs", d, done);
      };

      IndexVM.prototype.render = function() {
        var _this = this;

        return Mousetrap.bind(['tab'], function(e) {
          var idx, item;

          idx = $("#items_list>:first-child").index($(e.target).closest(".row-fluid"));
          if (idx === 0) {
            item = _this.list()[0];
            if (item.isValid()) {
              _this.add({
                id: null,
                name_1: null,
                name_2: null,
                family_rel: null,
                private_rel: null,
                prof_rel: null
              });
              $("#items_list .name-input:eq(0)").focus();
              return false;
            }
          }
          return true;
        });
      };

      return IndexVM;

    })(indexVM);
  });

}).call(this);
