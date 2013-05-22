// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["ural/vm/itemVM"], function(itemVM) {
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
            params: '^[а-я]+\\s[а-я]+$'
          }
        });
        this.name_2 = ko.observable().extend({
          required: {
            message: "Имя 2 должно быть заполнено."
          },
          pattern: {
            message: 'Имя 2 должно состоять из имени и фамилии разделенных пробелом.',
            params: '^[а-я]+\\s[а-я]+$'
          }
        });
        this.family_rel = ko.observable().extend({
          pattern: {
            message: 'Связь \'семья\' должна содержать только прописные, кирилические символы.',
            params: '^[а-я]+$'
          }
        });
        this.private_rel = ko.observable().extend({
          pattern: {
            message: 'Связь \'частные\' должна содержать только прописные, кирилические символы.',
            params: '^[а-я]+$'
          }
        });
        this.prof_rel = ko.observable().extend({
          pattern: {
            message: 'Связь \'професиональные\' должна содержать только прописные, кирилические символы.',
            params: '^[а-я]+$'
          }
        });
        this._id = ko.observable().extend({
          validation: {
            validator: function() {
              return _this.family_rel() || _this.private_rel() || _this.prof_rel();
            },
            message: "Одна из связей должна быть выбрана.",
            params: [this.family_rel, this.prof_rel, this.priv_rel]
          }
        });
        this._isModifyed = ko.observable();
        this._isRemoved = ko.observable();
        ItemVM.__super__.constructor.call(this, resource, index);
        this._isEditing = ko.observable();
        this.displayMode = function() {
          if (_this._isEditing()) {
            return "contrib-edit-item-template";
          } else {
            return "contrib-item-template";
          }
        };
      }

      ItemVM.prototype.edit = function(data, event) {
        if (event) {
          event.preventDefault();
        }
        console.log("just edit");
        if (this._isEditing()) {
          console.log("item in editing state");
          if (this.cancelEdit(data, event)) {
            console.log("cancel edit COMPLETE");
            return this._isEditing(false);
          }
        } else {
          console.log("item is NOT in editing state");
          if (this.startEdit(data, event)) {
            console.log("start edit COMPLETE");
            this._isEditing(true);
            return $(".edit-item-focus", event.currentTarget).focus();
          }
        }
      };

      ItemVM.prototype.onIsModifyedChanged = function(val) {
        console.log("modifyed changed");
        if (!val) {
          this._isEditing(val);
        }
        return ItemVM.__super__.onIsModifyedChanged.call(this, val);
      };

      return ItemVM;

    })(itemVM);
  });

}).call(this);

/*
//@ sourceMappingURL=item.map
*/
