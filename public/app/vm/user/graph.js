// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/vm/itemVM", "app/dataProvider", "ural/modules/pubSub"], function(itemVM, dataProvider, pubSub) {
    var Graph;

    return Graph = (function(_super) {
      __extends(Graph, _super);

      function Graph(resource, _index, _contribs) {
        this._contribs = _contribs;
        this.ref = ko.observable();
        this.name = ko.observable();
        this.date = ko.observable();
        this.contribs = ko.observableArray();
        Graph.__super__.constructor.call(this, "graph", _index);
      }

      Graph.prototype.map = function(data, skipStratEdit) {
        var contrib, _i, _len, _ref, _results;

        Graph.__super__.map.call(this, data, skipStratEdit);
        _ref = this._contribs.list();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          contrib = _ref[_i];
          if (this.contribs()) {
            _results.push(contrib.isSelected(this.contribs().filter(function(f) {
              return f === contrib.ref();
            }).length));
          } else {
            _results.push(contrib.isSelected(false));
          }
        }
        return _results;
      };

      Graph.prototype.onCreateItem = function() {
        return new Graph(this.resource, this._index, this._contribs);
      };

      Graph.prototype.onCreate = function(done) {
        var data;

        data = {
          name: this.name(),
          contribs: this._contribs.list().filter(function(f) {
            return f.isSelected();
          }).map(function(m) {
            return m.ref();
          })
        };
        return dataProvider.create("graphs", data, done);
      };

      Graph.prototype.onRemove = function(done) {
        var data;

        data = this.toData();
        return dataProvider.ajax("graphs", "delete", data, done);
      };

      Graph.prototype.onUpdate = function(done) {
        var data;

        data = {
          id: this.ref(),
          name: this.name(),
          contribs: this._contribs.list().filter(function(f) {
            return f.isSelected();
          }).map(function(m) {
            return m.ref();
          })
        };
        return dataProvider.ajax("graphs", "put", data, done);
      };

      Graph.prototype.create = function(done) {
        var _this = this;

        return Graph.__super__.create.call(this, function(err) {
          done(err);
          if (!err) {
            return _this.openGraph();
          }
        });
      };

      Graph.prototype.open = function(data, event) {
        event.preventDefault();
        return pubSub.pub("href", "change", {
          href: "/graph/panel/" + (this.ref())
        });
      };

      return Graph;

    })(itemVM);
  });

}).call(this);