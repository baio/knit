// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty;

  define(["ural/viewEngine", "ural/Modules/pubSub", "ural/Modules/dataProvider"], function(viewEngine, pubSub, dataProvider) {
    var Controller;

    Controller = (function() {
      function Controller(viewModel) {
        var _this = this;

        this.viewModel = viewModel;
        this.dataProvider = dataProvider.get();
        if (viewModel) {
          ko.applyBindings(viewModel, $("#_body")[0]);
        }
        pubSub.sub("crud", "start_create", function(item) {
          return _this.crudStartCreate(item);
        });
        pubSub.sub("crud", "start_update", function(opts) {
          return _this.crudStartUpdate(opts);
        });
        pubSub.sub("crud", "start_delete", function(item) {
          return _this.crudStartDelete(item);
        });
        pubSub.sub("crud", "get", function(opts) {
          return _this.crudGet(opts);
        });
        pubSub.sub("crud", "create", function(item) {
          return _this.crudCreate(item);
        });
        pubSub.sub("crud", "update", function(opts) {
          return _this.crudUpdate(opts);
        });
        pubSub.sub("crud", "delete", function(item) {
          return _this.crudDelete(item);
        });
        pubSub.sub("crud", "details", function(opts) {
          return _this.crudDetails(opts);
        });
        pubSub.sub("crud", "cancel", function(opts) {
          return _this.crudCancel(opts);
        });
        pubSub.sub("crud", "start_action", function(opts) {
          return _this.crudStartAction(opts);
        });
        pubSub.sub("crud", "action", function(opts) {
          return _this.crudAction(opts);
        });
        pubSub.sub("msg", "display", function(opts) {
          return _this.displayMsg(opts);
        });
      }

      Controller.prototype.displayMsg = function(opts) {
        if (opts.type === "success") {
          return toastr.success(opts.msg);
        } else if (opts.type === "error") {
          return toastr.error(opts.msg);
        }
      };

      Controller.prototype.getActionParams = function(opts) {
        var data, item, name, resource;

        name = opts.name;
        if (!opts.data) {
          item = opts.item ? opts.item : this.viewModel;
          resource = opts.resource ? opts.resource : item.resource;
          data = item.toData();
        } else {
          resource = opts.resource;
          data = opts.data;
        }
        return {
          name: name,
          item: item,
          resource: resource,
          data: data
        };
      };

      Controller.prototype.getUpdateParams = function(opts) {
        if (opts.item) {
          return {
            item: opts.item,
            formType: opts.formType
          };
        } else {
          return {
            item: opts,
            formType: "update"
          };
        }
      };

      Controller.prototype.crudStartAction = function(opts) {
        var params;

        params = this.getActionParams(opts);
        if (!params.item) {
          throw "opts should contain [item] field in order to execute crudStartAction";
        }
        return this.showForm(params.resource, params.name, params.item);
      };

      Controller.prototype.crudAction = function(opts) {
        var params,
          _this = this;

        params = this.getActionParams(opts);
        if (params.item) {
          if (!params.item.isValid()) {
            this.crudDone(params.item, {
              message: localization.controller.text.wrong_data
            });
            return;
          }
        }
        return this.dataProvider.action(params.resource, params.name, params.data, function(err, data) {
          _this.crudDone(null, err, localization.controller.text.success);
          if (!err) {
            if (params.item) {
              _this.hideForm(params.resource, params.name);
            }
            if (opts.success) {
              opts.success(data);
            }
            return _this.onCrudActionSuccess(params);
          }
        });
      };

      Controller.prototype.onCrudActionSuccess = function(params) {};

      Controller.prototype.crudDetails = function(opts) {
        var params;

        params = this.getActionParams(opts);
        return window.location = this.dataProvider.getUrl(params.resource, "details", params.data);
      };

      Controller.prototype.crudGet = function(opts) {
        var _this = this;

        return this.dataProvider.get(opts.resource, opts.filter, function(err, data) {
          var prop, vm, _ref;

          vm = null;
          if (opts.resource === _this.viewModel.resource) {
            vm = _this.viewModel;
          } else {
            _ref = _this.viewModel;
            for (prop in _ref) {
              if (!__hasProp.call(_ref, prop)) continue;
              if (_this.viewModel[prop] && _this.viewModel[prop].list && _this.viewModel[prop].resource === opts.resource) {
                vm = _this.viewModel[prop];
                break;
              }
            }
          }
          if (vm) {
            return vm.map(data);
          }
        });
      };

      Controller.prototype.crudStartDelete = function(item) {
        return this.showForm(item.resource, "delete", item);
      };

      Controller.prototype.crudStartCreate = function(item) {
        var _this = this;

        if (item.useGetNewRemote) {
          return this.dataProvider.getNew(item.resource, (item.parentItem ? item.parentItem.toData() : null), function(err, data) {
            if (err) {
              return _this.crudDone(err);
            } else {
              item.map(data);
              item.errors.showAllMessages(false);
              return _this.showForm(item.resource, "create", item);
            }
          });
        } else {
          return this.showForm(item.resource, "create", item);
        }
      };

      Controller.prototype.crudStartUpdate = function(opts) {
        var params;

        params = this.getUpdateParams(opts);
        return this.showForm(params.item.resource, params.formType, params.item);
      };

      Controller.prototype.crudCancel = function(opts) {
        return this.hideForm(opts.resource, opts.status);
      };

      Controller.prototype.crudCreate = function(item) {
        var _this = this;

        if (item.isValid()) {
          return this.dataProvider.create(item.resource, item.toData(true), function(err, data) {
            _this.crudDone(item, err, localization.controller.text.created_success);
            if (!err) {
              if (!item.useRepeatCreate || !item.useRepeatCreate()) {
                _this.hideForm(item.resource, "create");
                item.completeCreate(data);
              } else {
                item.map(data);
              }
              return pubSub.pub("crud", "complete_create", item.clone());
            }
          });
        } else {
          return this.crudDone(item, {
            message: localization.controller.text.wrong_data
          });
        }
      };

      Controller.prototype.crudUpdate = function(opts) {
        var formType, item, params,
          _this = this;

        params = this.getUpdateParams(opts);
        item = params.item;
        formType = params.formType;
        if (item.isValid()) {
          return this.dataProvider.update(item.resource, item.toData(), function(err, data) {
            _this.crudDone(item, err, localization.controller.text.updated_success);
            if (!err) {
              _this.hideForm(item.resource, formType);
              return item.completeUpdate(data);
            }
          });
        } else {
          return this.crudDone(item, {
            message: localization.controller.text.wrong_data
          });
        }
      };

      Controller.prototype.crudDelete = function(item) {
        var _this = this;

        return this.dataProvider["delete"](item.resource, item.toData(true), function(err) {
          _this.crudDone(item, err, localization.controller.text.deleted_success);
          if (!err) {
            _this.hideForm(item.resource, "update");
            return pubSub.pub("crud", "complete_delete", item);
          }
        });
      };

      Controller.prototype.crudDone = function(item, err, succ) {
        if (err) {
          toastr.error(err.message);
          if (item) {
            if (err.errors) {
              item.setErrors(err.errors);
            }
            return item.errors.showAllMessages();
          }
        } else {
          return toastr.success(succ);
        }
      };

      Controller.prototype.showForm = function(resource, formType, item) {
        var form;

        form = $("[data-form-type='" + formType + "'][data-form-resource='" + resource + "']");
        if (!form[0]) {
          throw "Required form not implemented";
        }
        ko.applyBindings(item, form[0]);
        return form.modal("show").on("hidden", function() {
          if (item != null) {
            item.cleanUp();
          }
          return ko.cleanNode(form[0]);
        });
      };

      Controller.prototype.hideForm = function(resource, formType) {
        var form;

        form = $("[data-form-type='" + formType + "'][data-form-resource='" + resource + "']");
        return form.modal("hide");
      };

      Controller.prototype.view = function(path, model, isApply, done) {
        var _this = this;

        if ($.isFunction(isApply)) {
          done = isApplay;
        }
        return async.parallel([
          function(ck) {
            if (path) {
              return viewEngine.render(path, ck);
            } else {
              return ck(null);
            }
          }, function(ck) {
            if (model && $.isFunction(model.load)) {
              return model.load(ck);
            } else {
              return ck(null, model);
            }
          }
        ], function(err, res) {
          var data, html;

          if (!err) {
            html = res[0];
            data = res[1];
            viewEngine.applyData(html, model, _this.viewBag, isApply);
            if ($.isFunction(model.render)) {
              model.render(data);
            }
          }
          if (done) {
            return done(err, data);
          }
        });
      };

      Controller.prototype.view_apply = function(path, model, done) {
        return this.view(path, model, true, done);
      };

      return Controller;

    })();
    return {
      Controller: Controller
    };
  });

}).call(this);
