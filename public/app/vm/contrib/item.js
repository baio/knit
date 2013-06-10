// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/vm/itemVM", "app/dataProvider"], function(itemVM, dataProvider) {
    var ItemVM;

    return ItemVM = (function(_super) {
      __extends(ItemVM, _super);

      function ItemVM(resource, index) {
        var _this = this;

        this.name_1 = ko.observable("").extend({
          required: {
            message: "Имя 1 должно быть заполнено."
          },
          pattern: {
            message: 'Имя 1 должно состоять из имени и фамилии разделенных пробелом.',
            params: '^\\s*[А-Я]?[а-я]+\\s+[А-Я]?[а-я]+\\s*$'
          }
        });
        this.name_2 = ko.observable("").extend({
          required: {
            message: "Имя 2 должно быть заполнено."
          },
          pattern: {
            message: 'Имя 2 должно состоять из имени и фамилии разделенных пробелом.',
            params: '^\\s*[А-Я]?[а-я]+\\s+[А-Я]?[а-я]+\\s*$'
          }
        });
        this.relations = ko.observableArray([]);
        this.date = ko.observable();
        this.dateTo = ko.observable();
        this.url = ko.observable();
        this.source = ko.observable();
        this.scheme = ko.observable();
        this._id = ko.observable();
        this._isModifyed = ko.observable();
        this._isRemoved = ko.observable();
        this._scheme = ko.computed(function() {
          var res;

          res = index.schemes.filter(function(f) {
            return f["_id"] === _this.scheme();
          })[0];
          if (res == null) {
            res = {};
          }
          console.log(res);
          return res;
        });
        this._availableSchemes = ko.observableArray([
          {
            id: "person-person.ru",
            label: "Персона - Персона"
          }, {
            id: "person-org.ru",
            label: "Персона - Организация"
          }, {
            id: "org-org.ru",
            label: "Организация - Организация"
          }
        ]);
        this.scheme.subscribe(function(val) {
          if (val) {
            return _this._readOnly(false);
          } else {
            return _this._readOnly(true);
          }
        });
        this._readOnly = ko.observable(true);
        ItemVM.__super__.constructor.call(this, resource, index);
      }

      ItemVM.prototype.onCreate = function(done) {
        var data,
          _this = this;

        data = {
          id: this._index.contrib.ref(),
          items: [this.toData()]
        };
        return dataProvider.ajax("contribs", "patch", data, function(err, data) {
          if (!err) {
            _this._id(data.data[0]._id);
          }
          return done(err, null);
        });
      };

      ItemVM.prototype.onUpdate = function(done) {
        var data;

        data = {
          id: this._index.contrib.ref(),
          items: [this.toData()]
        };
        return dataProvider.ajax("contribs", "patch", data, function(err, data) {
          return done(err, null);
        });
      };

      ItemVM.prototype.onRemove = function(done) {
        var data;

        data = this.toData();
        return dataProvider.ajax("contribs", "patch", data, done);
      };

      ItemVM.prototype.onCreateItem = function() {
        return new ItemVM(this.resource, this._index);
      };

      return ItemVM;

    })(itemVM);
  });

}).call(this);

/*
//@ sourceMappingURL=item.map
*/
