// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/vm/indexVM", "app/vm/contrib/item", "app/dataProvider", "app/vm/user/contrib"], function(indexVM, itemVM, dataProvider, Contrib) {
    var IndexVM;

    return IndexVM = (function(_super) {
      __extends(IndexVM, _super);

      function IndexVM() {
        this.defItem = {
          _id: null,
          name_1: null,
          name_2: null,
          family_rel: null,
          private_rel: null,
          prof_rel: null
        };
        this.contrib = new Contrib();
        this.editItem = new itemVM("contrib");
        this.editItem.map(this.defItem);
        this.isModifyed = ko.observable();
        IndexVM.__super__.constructor.call(this, "contrib");
      }

      IndexVM.prototype.onCreateItem = function() {
        return new itemVM(this.resource, this);
      };

      IndexVM.prototype.onLoad = function(filter, done) {
        var _this = this;

        return dataProvider.get("contribs", filter, function(err, data) {
          var items;

          if (!err) {
            items = data.items;
            delete data.items;
            _this.contrib.map(data, true);
            return done(err, items);
          } else {
            return done(null);
          }
        });
      };

      IndexVM.prototype.onUpdate = function(data, done) {
        var d;

        d = {
          id: this.contrib.ref(),
          items: data
        };
        return dataProvider.ajax("contribs", "patch", d, function(err, data) {
          return done(err, data);
        });
      };

      IndexVM.prototype.render = function() {
        var _this = this;

        this.editItem.startEdit();
        this.startEdit();
        return Mousetrap.bind(['tab'], function(e) {
          if ($(e.target).attr("id") === "append_item_trigger") {
            _this.editItem.prof_rel($(e.target).val());
            if (_this.editItem.isValid()) {
              _this.add(_this.editItem.toData(), 0);
              _this.editItem.map(_this.defItem);
              $("#append_item_focus").focus();
            }
            return false;
          } else if ($(e.target).hasClass("edit_item_trigger")) {
            return _this.editItem.isValid();
          }
          return true;
        });
      };

      return IndexVM;

    })(indexVM);
  });

}).call(this);

/*
//@ sourceMappingURL=index.map
*/
