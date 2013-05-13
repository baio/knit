// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty;

  define(["ural/viewEngine", "ural/modules/pubSub"], function(viewEngine, pubSub) {
    var Controller;
    Controller = (function() {

      function Controller(viewModel) {
        var _this = this;
        this.viewModel = viewModel;
        if (viewModel) {
          ko.applyBindings(viewModel, $("#_body")[0]);
        }
        if (!Controller.IsSubscribed) {
          Controller.IsSubscribed = true;
          pubSub.sub("crud", "start", function(params) {
            return _this.crudStart(params);
          });
          pubSub.sub("crud", "end", function(params) {
            return _this.crudEnd(params);
          });
        }
      }

      Controller.IsSubscribed = false;

      Controller.prototype.crudStart = function(params) {
        return this.showForm(params.resource, params.type, params.item);
      };

      Controller.prototype.crudEnd = function(params) {
        var msg, notifyType;
        if (!params.err) {
          this.hideForm(params.resource, params.type);
        }
        if (params.err) {
          notifyType = "error";
          msg = params.err;
        } else if (params.msg) {
          notifyType = "success";
          msg = params.msg;
        }
        if (notifyType) {
          return this.notify(msg, null, notifyType);
        }
      };

      Controller.prototype.notify = function(msg, caption, type) {
        return toastr[type](msg, caption);
      };

      Controller.prototype.showForm = function(resource, formType, item) {
        var form;
        form = $("[data-form-type='" + formType + "'][data-form-resource='" + resource + "']");
        if (!form[0]) {
          throw "Required form not implemented";
        }
        ko.applyBindings(item, form[0]);
        return form.modal("show").on("hidden", function() {
          ko.cleanNode(form[0]);
          return $("[data-view-engine-clean]", form[0]).empty();
        });
      };

      Controller.prototype.hideForm = function(resource, formType) {
        var form;
        form = $("[data-form-type='" + formType + "'][data-form-resource='" + resource + "']");
        return form.modal("hide");
      };

      Controller.prototype._loadLayoutModel = function(layoutModel, done) {
        if ($.isFunction(layoutModel.load)) {
          return layoutModel.load(null, done);
        } else if (layoutModel.loader) {
          return layoutModel.loader.load(layoutModel.filter, done);
        } else {
          return done(null, layoutModel);
        }
      };

      Controller.prototype._loadLayoutModels = function(layoutModels, done) {
        var layouts, lms, prop;
        lms = [];
        layouts = [];
        for (prop in layoutModels) {
          if (!__hasProp.call(layoutModels, prop)) continue;
          layouts.push(prop);
          lms.push(layoutModels[prop]);
        }
        return async.map(lms, this._loadLayoutModel, function(err, data) {
          var i, lm, lmd, _i, _ref;
          lmd = [];
          if (!err) {
            for (i = _i = 0, _ref = lms.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
              lm = lms[i];
              if (lm.loader) {
                lm = lm.loader;
              }
              lmd.push({
                layout: layouts[i],
                lm: lm,
                data: data[i]
              });
            }
          }
          return done(err, lmd);
        });
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
            var layoutModels;
            layoutModels = model._layouts ? model._layouts : {
              _body: model
            };
            return _this._loadLayoutModels(layoutModels, ck);
          }
        ], function(err, res) {
          var html, layoutModelsData, lmd, _i, _len;
          if (!err) {
            html = res[0];
            layoutModelsData = res[1];
            viewEngine.applyData(html, layoutModelsData, _this.viewBag, isApply);
            for (_i = 0, _len = layoutModelsData.length; _i < _len; _i++) {
              lmd = layoutModelsData[_i];
              if (lmd.lm && $.isFunction(lmd.lm.render)) {
                lmd.lm.render(lmd.data);
              }
            }
          }
          if (done) {
            return done(err);
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
