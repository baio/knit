// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/vm/indexVM", "app/vm/contrib/itemVM"], function(indexVM, itemVM) {
    var IndexVM, _ref;

    return IndexVM = (function(_super) {
      __extends(IndexVM, _super);

      function IndexVM() {
        _ref = IndexVM.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      IndexVM.prototype.onCreateItem = function() {
        return new itemVM();
      };

      IndexVM.prototype.onLoad = function(done) {
        return done(null, [
          {
            id: 'elena_skrinnik_viktor_hristenko',
            name_1: 'elena skrinnik',
            name_2: 'viktor hristenko',
            family_rel: "father",
            private_rel: null,
            prof_rel: "employee"
          }
        ]);
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
