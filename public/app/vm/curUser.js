// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/vm/itemVM", "app/dataProvider", "ural/modules/pubSub"], function(ItemVM, dataProvider, pubSub) {
    var User;

    return User = (function(_super) {
      __extends(User, _super);

      function User() {
        this._id = ko.observable();
        this.name = ko.observable();
        this.graphs = ko.observableArray();
        this.popular = ko.observableArray();
      }

      User.prototype.open = function(data, event) {
        event.preventDefault();
        return pubSub.pub("href", "change", {
          href: "/graph/panel/" + (data.ref())
        });
      };

      User.prototype.onLoad = function(filter, done) {
        var _this = this;

        return dataProvider.get("curUser", filter, function(err, data) {
          if (!err) {
            ko.mapping.fromJS(data, {}, _this);
          } else if (err.code === 401) {
            err = null;
            data = null;
          }
          return done(err, data);
        });
      };

      return User;

    })(ItemVM);
  });

}).call(this);

/*
//@ sourceMappingURL=curUser.map
*/
