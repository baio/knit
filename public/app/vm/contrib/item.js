// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/vm/itemVM", "app/dataProvider", "ural/modules/pubSub"], function(itemVM, dataProvider, pubSub) {
    var ItemVM;

    return ItemVM = (function(_super) {
      __extends(ItemVM, _super);

      function ItemVM(resource, index) {
        var _this = this;

        this.name_1 = ko.observable().extend({
          required: {
            message: "Имя 1 должно быть заполнено."
          },
          pattern: {
            message: 'Имя 1 должно состоять из имени и фамилии разделенных пробелом.',
            params: '^\\s*\\w+\\s+\\w+\\s*$'
          }
        });
        this.name_2 = ko.observable().extend({
          required: {
            message: "Имя 2 должно быть заполнено."
          },
          pattern: {
            message: 'Имя 2 должно состоять из имени и фамилии разделенных пробелом.',
            params: '^\\s*\\w+\\s+\\w+\\s*$'
          }
        });
        this.url = ko.observable().extend({
          required: {
            message: "Ссылка на источник долна быть заполнена."
          },
          pattern: {
            message: 'Ссылка на источник имеет неверный формат.',
            params: '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$'
          }
        });
        this.relations = ko.observableArray([]).extend({
          minLength: {
            params: 1,
            message: "Должна быть указана хоть одна связь."
          }
        });
        this.date = ko.observable();
        this.dateTo = ko.observable();
        this.source = ko.observable();
        this.scheme = ko.observable();
        this._id = ko.observable();
        ItemVM.__super__.constructor.call(this, resource, index);
        this._scheme = ko.computed(function() {
          var res;

          res = index.schemes.filter(function(f) {
            return f["_id"] === _this.scheme();
          })[0];
          if (res == null) {
            res = {};
          }
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
            _this._readOnly(false);
          } else {
            _this._readOnly(true);
          }
          if (_this.src && val) {
            return _this.swapFieldsWhenSchemeChanged();
          }
        });
        this._readOnly = ko.observable(true);
        this._isCreateNext = ko.observable(true);
        this.headerCss = ko.computed(function() {
          switch (_this.scheme()) {
            case "person-person.ru":
              return "blue";
            case "person-org.ru":
              return "green";
            case "org-org.ru":
              return "wiolet";
          }
        });
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
        var data, item;

        item = this.toData();
        item._isRemoved = true;
        data = {
          id: this._index.contrib.ref(),
          items: [item]
        };
        return dataProvider.ajax("contribs", "patch", data, done);
      };

      ItemVM.prototype.onGetRemoveType = function() {
        return "update";
      };

      ItemVM.prototype.onCreateItem = function() {
        return new ItemVM(this.resource, this._index);
      };

      ItemVM.prototype.swapFields = function() {
        this.name_1(null);
        this.name_2(null);
        this.relations([]);
        this.date(null);
        this.dateTo(null);
        this.source(null);
        this.scheme(null);
        this.setIsModified(false);
        return $("[data-default-focus]", $("[data-form-resource='contrib-item']:visible")).focus();
      };

      ItemVM.prototype.swapFieldsWhenSchemeChanged = function() {
        if (this.relations().length) {
          this.relations([]);
          return this.relations.isModified(false);
        }
      };

      ItemVM.prototype.onSaved = function(err, status) {
        if (!err && status === "create" && this._isCreateNext()) {
          pubSub.pub("msg", "show", {
            err: err,
            msg: "Success"
          });
          return this.swapFields();
        } else {
          return ItemVM.__super__.onSaved.call(this, err, status);
        }
      };

      return ItemVM;

    })(itemVM);
  });

}).call(this);

/*
//@ sourceMappingURL=item.map
*/
