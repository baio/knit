// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty;

  define(["ural/modules/pubSub"], function(pubSub) {
    var ViewModel;

    return ViewModel = (function() {
      function ViewModel(resource, _index) {
        this.resource = resource;
        this._index = _index;
        this.init();
      }

      ViewModel.KeyFieldName = null;

      ViewModel.prototype._isAdded = function() {
        if (ViewModel.KeyFieldName) {
          return this[ViewModel.KeyFieldName]() === null;
        } else {
          return false;
        }
      };

      ViewModel.prototype.init = function() {
        var data, prop;

        data = {};
        for (prop in this) {
          if (!__hasProp.call(this, prop)) continue;
          if (ko.isObservable(this[prop])) {
            data[prop] = null;
          }
        }
        return ko.mapping.fromJS(data, {}, this);
      };

      ViewModel.prototype.completeUpdate = function(data, skipStratEdit) {
        if (this.src) {
          return this.src.item.map(data, skipStratEdit);
        } else {
          return this.map(data, skipStratEdit);
        }
      };

      ViewModel.prototype.completeCreate = function(data) {
        if (this._index) {
          this._index.add(data, 0);
        }
        this.setSrc(null, null);
        return this.map(data);
      };

      ViewModel.prototype.completeRemove = function() {
        if (this.src.item._index) {
          this.src.item._index.list.remove(this.src.item);
        }
        return this.setSrc(null, null);
      };

      ViewModel.prototype.map = function(data) {
        var d, dataIndexVM, prop, _ref;

        if ($.isArray()) {
          data = data[0];
        }
        dataIndexVM = {};
        for (prop in this) {
          if (!__hasProp.call(this, prop)) continue;
          if (this[prop] && data[prop] && this[prop].list) {
            dataIndexVM[prop] = data[prop];
            delete data[prop];
          }
        }
        for (prop in data) {
          if (!__hasProp.call(data, prop)) continue;
          d = this.tryDate(data[prop]);
          if (d) {
            data[prop] = d;
          }
        }
        ko.mapping.fromJS(data, {}, this);
        for (prop in dataIndexVM) {
          if (!__hasProp.call(dataIndexVM, prop)) continue;
          this[prop].map(dataIndexVM[prop]);
        }
        return (_ref = ko.validation) != null ? _ref.group(this) : void 0;
      };

      ViewModel.prototype.tryDate = function(str) {
        var match;

        if (str && typeof str === "string") {
          match = /\/Date\((\d+)\)\//.exec(str);
          if (match) {
            return moment(str).toDate();
          }
        }
      };

      ViewModel.prototype.clone = function(status) {
        var vm;

        vm = this.onCreateItem();
        vm.map(this.toData());
        vm.setSrc(this, status);
        return vm;
      };

      ViewModel.prototype.onCreateItem = function() {
        return new ViewModel(this.resource, this._index);
      };

      ViewModel.prototype.setSrc = function(item, status) {
        return this.src = {
          item: item,
          status: status
        };
      };

      ViewModel.prototype.cancel = function(item, event) {
        event.preventDefault();
        return pubSub.pub("crud", "end", {
          resource: this.resource,
          type: this.src.status
        });
      };

      ViewModel.prototype.confirmEvent = function(event, eventName) {
        var attr;

        if (!event) {
          return true;
        }
        attr = $(event.target).attr("data-bind-event");
        return !attr || attr === eventName;
      };

      ViewModel.prototype.startUpdate = function(item, event) {
        if (this.confirmEvent(event, "startUpdate")) {
          event.preventDefault();
          return pubSub.pub("crud", "start", {
            resource: this.resource,
            item: this.clone("update"),
            type: "update"
          });
        }
      };

      ViewModel.prototype.startRemove = function(item, event) {
        if (this.confirmEvent(event, "startRemove")) {
          event.preventDefault();
          return pubSub.pub("crud", "start", {
            resource: this.resource,
            item: this.clone("delete"),
            type: "delete"
          });
        }
      };

      ViewModel.prototype.remove = function() {
        var _this = this;

        if (ko.isObservable(this._isRemoved)) {
          return this._isRemoved(true);
        } else {
          return this.onRemove(function(err) {
            _this.completeRemove();
            return pubSub.pub("crud", "end", {
              err: err,
              type: "delete",
              msg: "Success",
              resource: _this.resource
            });
          });
        }
      };

      ViewModel.prototype.onRemove = function(done) {
        return done();
      };

      ViewModel.prototype.details = function(item, event) {
        if (this.confirmEvent(event, "details")) {
          event.preventDefault();
          return pubSub.pub("crud", "details", {
            item: this.clone("details")
          });
        }
      };

      ViewModel.prototype.startEdit = function(data, event) {
        var f;

        f = this.confirmEvent(event, "start-edit");
        if (f) {
          console.log("REAL start edit - store src");
          this.stored_data = this.toData();
          if (this._isModifyedActivated) {
            this.updateIsModifyed(false);
          }
          if (ko.isObservable(this._isModifyed)) {
            if (!this._isModifyedActivated) {
              this.activateIsModifyed();
              this._isModifyedActivated = true;
            }
          }
        }
        return f;
      };

      ViewModel.prototype.updateIsModifyed = function(val) {
        if (this._isModifyed() !== val) {
          return this.onIsModifyedChanged(val);
        }
      };

      ViewModel.prototype.onIsModifyedChanged = function(val) {
        return this._isModifyed(val);
      };

      ViewModel.prototype.cancelEdit = function(data, event) {
        var f;

        f = this.confirmEvent(event, "cancel-edit");
        if (f && this.stored_data) {
          console.log("REAL cancel edit - map from src");
          this.map(this.stored_data, true);
        }
        return f;
      };

      ViewModel.prototype.setErrors = function(errs) {
        var err, flag, rule, _i, _len, _results;

        _results = [];
        for (_i = 0, _len = errs.length; _i < _len; _i++) {
          err = errs[_i];
          flag = false;
          rule = this[err.field].rules().filter(function(f) {
            return f.params === "custom";
          })[0];
          if (rule) {
            this[err.field].rules.remove(rule);
          }
          _results.push(this[err.field].extend({
            validation: {
              params: "custom",
              validator: function(val, otherVal) {
                var _flag;

                _flag = flag;
                flag = true;
                return _flag;
              },
              message: err.message
            }
          }));
        }
        return _results;
      };

      ViewModel.prototype._isIgnoreProp = function(prop) {
        return prop === "errors" || (prop.indexOf("_") === 0 && prop !== "_isRemoved" && prop !== ViewModel.KeyFieldName);
      };

      ViewModel.prototype.toData = function() {
        var data, prop;

        data = ko.mapping.toJS(this);
        for (prop in this) {
          if (!__hasProp.call(this, prop)) continue;
          if (this._isIgnoreProp(prop)) {
            delete data[prop];
          } else if (this[prop] && this[prop].list) {
            data[prop] = this[prop].list().map(function(m) {
              return m.toData();
            });
          }
        }
        return data;
      };

      ViewModel.prototype.activateIsModifyed = function() {
        var prop, _results,
          _this = this;

        this._isModifyed(false);
        this.updateIsModifyed(this.getIsModifyed());
        _results = [];
        for (prop in this) {
          if (!__hasProp.call(this, prop)) continue;
          if (!this._isIgnoreProp(prop) && ko.isObservable(this[prop])) {
            _results.push(this[prop].subscribe(function() {
              return _this.updateIsModifyed((_this._isRemoved() || _this.isValid()) && _this.getIsModifyed());
            }));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      ViewModel.prototype.getIsChanged = function() {
        var data, prop, src_data;

        if (!this.src) {
          return false;
        }
        if (this.src.status === "create") {
          return true;
        }
        src_data = this.src.item.toData();
        data = this.toData();
        for (prop in src_data) {
          if (!__hasProp.call(src_data, prop)) continue;
          if (src_data[prop] !== data[prop]) {
            return true;
          }
        }
        return false;
      };

      ViewModel.prototype.getIsModifyed = function() {
        var prop, val, _ref;

        if (!this.stored_data) {
          return false;
        }
        _ref = this.stored_data;
        for (prop in _ref) {
          if (!__hasProp.call(_ref, prop)) continue;
          val = ko.utils.unwrapObservable(this[prop]);
          if (this._isAdded() || this._isRemoved()) {
            return !(this._isAdded() && this._isRemoved());
          }
          if (val !== this.stored_data[prop]) {
            return true;
          }
        }
        return false;
      };

      ViewModel.prototype.save = function(data, event) {
        var status, _done,
          _this = this;

        if (event) {
          event.preventDefault();
        }
        status = this.src.status;
        _done = function(err) {
          return pubSub.pub("crud", "end", {
            resource: _this.resource,
            type: status,
            err: err,
            msg: "Success"
          });
        };
        if (!this.getIsChanged()) {
          return _done();
        } else if (!this.isValid()) {
          return _done("Not valid");
        } else if (status === "create") {
          return this.create(_done);
        } else if (status === "update") {
          return this.update(_done);
        } else {
          throw new Error("Item not in edit state");
        }
      };

      ViewModel.prototype.create = function(done) {
        var _this = this;

        return this.onCreate(function(err, data) {
          if (!err) {
            _this.completeCreate(data);
          }
          return done(err);
        });
      };

      ViewModel.prototype.onCreate = function(done) {
        return done();
      };

      ViewModel.prototype.update = function(done) {
        var _this = this;

        return this.onUpdate(function(err, data) {
          if (!err) {
            _this.completeUpdate(data);
          }
          return done(err);
        });
      };

      ViewModel.prototype.onUpdate = function(done) {
        return done();
      };

      ViewModel.prototype.load = function(filter, done) {
        var _this = this;

        return this.onLoad(filter, function(err, data) {
          if (!err && data) {
            _this.map(data);
          }
          return done(err, _this);
        });
      };

      ViewModel.prototype.onLoad = function(filter, done) {
        return done(null, []);
      };

      return ViewModel;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=itemVM.map
*/
