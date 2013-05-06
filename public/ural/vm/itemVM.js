// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty;

  define(["ural/modules/pubSub"], function(pubSub) {
    var ViewModel;

    return ViewModel = (function() {
      function ViewModel(resource, parentItem) {
        this.resource = resource;
        this.parentItem = parentItem;
        this.init();
      }

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
        this.setSrc(null, null);
        return this.map(data, keepEdit);
      };

      ViewModel.prototype.map = function(data, skipStratEdit) {
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
        this.errors = (_ref = ko.validation) != null ? _ref.group(this) : void 0;
        if (!skipStratEdit) {
          this.startEdit();
        }
        if (ko.isObservable(this.isModifyed) && !this._isModifyedActivated) {
          this.activateIsModifyed();
          return this._isModifyedActivated = true;
        }
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

        vm = this.onCreate();
        vm.map(this.toData());
        vm.setSrc(this, status);
        return vm;
      };

      ViewModel.prototype.onCreate = function() {
        return new ViewModel(this.resource, this.parentItem);
      };

      ViewModel.prototype.setSrc = function(item, status) {
        return this.src = {
          item: item,
          status: status
        };
      };

      ViewModel.prototype.cancel = function(item, event) {
        event.preventDefault();
        return pubSub.pub("crud", "cancel", {
          resource: this.resource,
          status: this.src.status
        });
      };

      ViewModel.prototype.confirmEvent = function(event, eventName) {
        var attr;

        attr = $(event.target).attr("data-bind-event");
        return !attr || attr === eventName;
      };

      ViewModel.prototype.startUpdate = function(item, event) {
        if (this.confirmEvent(event, "startUpdate")) {
          event.preventDefault();
          return pubSub.pub("crud", "start_update", this.clone("update"));
        }
      };

      ViewModel.prototype.startRemove = function(item, event) {
        if (this.confirmEvent(event, "startRemove")) {
          event.preventDefault();
          return pubSub.pub("crud", "start_delete", this.clone("delete"));
        }
      };

      ViewModel.prototype.create = function(item, event) {
        if (this.confirmEvent(event, "create")) {
          event.preventDefault();
          return pubSub.pub("crud", "create", this);
        }
      };

      ViewModel.prototype.onCreate = function(data, done) {
        return done(null);
      };

      /*
      update: (item, event) ->
        if @confirmEvent event, "update"
          event.preventDefault()
          pubSub.pub "crud", "update", @
      */


      ViewModel.prototype.remove = function(item, event) {
        if (this.confirmEvent(event, "remove")) {
          event.preventDefault();
          return pubSub.pub("crud", "delete", this);
        }
      };

      ViewModel.prototype.details = function(item, event) {
        if (this.confirmEvent(event, "details")) {
          event.preventDefault();
          return pubSub.pub("crud", "details", {
            item: this.clone("details")
          });
        }
      };

      ViewModel.prototype.startEdit = function() {
        this.stored_data = this.toData();
        return typeof this === "function" ? this(isModifyed(false)) : void 0;
      };

      ViewModel.prototype.cancelEdit = function(item, event) {
        event.preventDefault();
        if (this.stored_data) {
          return this.map(this.stored_data);
        }
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

      ViewModel.prototype.toData = function() {
        var data, prop;

        data = ko.mapping.toJS(this);
        for (prop in this) {
          if (!__hasProp.call(this, prop)) continue;
          if (prop.indexOf("_") !== 0 && this[prop] && this[prop].list) {
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

        _results = [];
        for (prop in this) {
          if (!__hasProp.call(this, prop)) continue;
          if (ko.isObservable(this[prop])) {
            _results.push(this[prop].subscribe(function() {
              return _this.isModifyed(_this.getIsModifyed());
            }));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      ViewModel.prototype.getIsModifyed = function() {
        var prop, _ref;

        if (!this.stored_data) {
          return false;
        }
        _ref = this.stored_data;
        for (prop in _ref) {
          if (!__hasProp.call(_ref, prop)) continue;
          if (ko.utils.unwrapObservable(this[prop]) !== this.stored_data[prop]) {
            return true;
          }
        }
        return false;
      };

      ViewModel.prototype.save = function() {
        if (this.src.status === "create") {
          return this.create(function() {});
        } else if (this.src.status === "update") {
          return this.update(function() {});
        } else {
          throw new Error("Item nt in edit state");
        }
      };

      ViewModel.prototype.create = function(done) {
        return this.onCreate(done);
      };

      ViewModel.prototype.onCreate = function(done) {
        return done();
      };

      return ViewModel;

    })();
  });

}).call(this);
