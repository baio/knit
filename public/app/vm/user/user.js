// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/vm/itemVM", "app/vm/user/contribs", "app/vm/user/graphs", "app/dataProvider"], function(indexVM, contribs, graphs, dataProvider) {
    var User;

    return User = (function(_super) {
      __extends(User, _super);

      function User() {
        var _this = this;

        this._id = ko.observable();
        this.contribs = new contribs();
        this.graphs = new graphs(this.contribs);
        this.name = ko.computed(function() {
          if (_this._id()) {
            return _this._id().split("@")[1];
          } else {
            return null;
          }
        });
      }

      User.prototype.onLoad = function(filter, done) {
        return dataProvider.get("users", filter, done);
      };

      return User;

    })(indexVM);
  });

}).call(this);

/*
//@ sourceMappingURL=user.map
*/
