// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/vm/itemVM", "app/dataProvider", "ural/modules/pubSub"], function(itemVM, dataProvider, pubSub) {
    var Contrib;

    return Contrib = (function(_super) {
      __extends(Contrib, _super);

      function Contrib(resource, _index) {
        this.ref = ko.observable();
        this.name = ko.observable();
        this.url = ko.observable();
        Contrib.__super__.constructor.call(this, "contrib", _index);
      }

      Contrib.prototype.onCreateItem = function() {
        return new Contrib(this.resource, this._index);
      };

      Contrib.prototype.onCreate = function(done) {
        var data;

        data = this.toData();
        return dataProvider.create("contribs", data, done);
      };

      Contrib.prototype.onRemove = function(done) {
        var data;

        data = this.toData();
        return dataProvider.ajax("contribs", "delete", data, done);
      };

      Contrib.prototype.onUpdate = function(done) {
        var data;

        data = this.toData();
        return dataProvider.ajax("contribs", "put", data, done);
      };

      Contrib.prototype.create = function(done) {
        var _this = this;

        return Contrib.__super__.create.call(this, function(err) {
          done(err);
          if (!err) {
            return _this.openContrib();
          }
        });
      };

      Contrib.prototype.openContrib = function() {
        return pubSub.pub("href", "change", {
          href: "/contrib/item/" + (this.ref())
        });
      };

      Contrib.prototype.openGraph = function(data, event) {
        event.preventDefault();
        return pubSub.pub("href", "change", {
          href: "/graph/panel/" + (this.ref())
        });
      };

      return Contrib;

    })(itemVM);
  });

}).call(this);
