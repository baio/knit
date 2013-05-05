// Generated by CoffeeScript 1.6.2
(function() {
  define(["ural/vm/itemVM", "ural/modules/pubSub"], function(itemVM, pubSub) {
    var ViewModel;

    return ViewModel = (function() {
      function ViewModel(resource, parentItem) {
        var _this = this;

        this.resource = resource;
        this.parentItem = parentItem;
        this.list = ko.observableArray();
        pubSub.sub("crud", "complete_create", function(item) {
          return _this.completeCreate(item);
        });
        pubSub.sub("crud", "complete_delete", function(item) {
          return _this.completeDelete(item);
        });
      }

      ViewModel.prototype.completeDelete = function(item) {
        if (item.resource === this.resource) {
          this.list.remove(item.src.item);
        }
        if (this.parentItem) {
          return this.parentItem.startEdit();
        }
      };

      ViewModel.prototype.completeCreate = function(item) {
        if (item.resource === this.resource) {
          item.setSrc(null, null);
          this.list.push(item);
        }
        if (this.parentItem) {
          return this.parentItem.startEdit();
        }
      };

      ViewModel.prototype.add = function(data, idx) {
        var item;

        item = this.createItem(data);
        if (idx === !void 0) {
          idx = this.list().length - 1;
        }
        return this.list.splice(idx, 0, item);
      };

      ViewModel.prototype.map = function(data) {
        var d, underlyingArray, _i, _len;

        underlyingArray = this.list();
        underlyingArray.splice(0, underlyingArray.length);
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          d = data[_i];
          underlyingArray.push(this.createItem(d));
        }
        return this.list.valueHasMutated();
      };

      ViewModel.prototype.load = function(done) {
        var _this = this;

        return this.onLoad(function(err, data) {
          if (!err) {
            _this.map(data);
          }
          return done(err, _this);
        });
      };

      ViewModel.prototype.onLoad = function(done) {
        return done(null, []);
      };

      ViewModel.prototype.save = function() {
        return this.update(function() {});
      };

      ViewModel.prototype.update = function(done) {
        var item, res, _i, _len, _ref;

        res = [];
        _ref = this.list();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.toData) {
            res.push(item.toData());
          } else {
            res.push(item);
          }
        }
        return this.onUpdate(res, done);
      };

      ViewModel.prototype.onUpdate = function(data, done) {
        return done(null);
      };

      ViewModel.prototype.createItem = function(data, status) {
        var vm;

        vm = this.onCreateItem();
        if (data) {
          vm.map(data);
        }
        if (status) {
          vm.setSrc(null, status);
        }
        return vm;
      };

      ViewModel.prototype.onCreateItem = function() {
        return new itemVM(this.resource, this.parentItem);
      };

      ViewModel.prototype.startCreate = function(some, event) {
        event.preventDefault();
        return pubSub.pub("crud", "start_create", this.createItem(null, "create"));
      };

      return ViewModel;

    })();
  });

}).call(this);
