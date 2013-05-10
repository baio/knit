// Generated by CoffeeScript 1.6.2
(function() {
  define(["ural/modules/pubSub"], function(pubSub) {
    var Router;

    Router = (function() {
      function Router(controllerDirectory) {
        var _this = this;

        this.controllerDirectory = controllerDirectory;
        this._controllers = [];
        pubSub.sub("href", "change", function(data) {
          console.log("!!!");
          return _this._hash(data.href);
        });
      }

      Router.StartRouting = function(controllerDirectory, routes) {
        var route, router, _i, _len,
          _this = this;

        router = new Router(controllerDirectory);
        for (_i = 0, _len = routes.length; _i < _len; _i++) {
          route = routes[_i];
          router.addRoute(route.url, function(controller, action, index) {
            var defaultRoute;

            if (!controller) {
              defaultRoute = routes.filter(function(f) {
                return f.url === "/";
              })[0];
              if (defaultRoute) {
                controller = defaultRoute.path.controller;
                action = defaultRoute.path.action;
                index = defaultRoute.path.arg;
              }
            }
            if (controller) {
              return router.onRoute(controller, action, index, function() {
                return pubSub.pub("href", "changed", {
                  controller: controller,
                  action: action,
                  index: index
                });
              });
            }
          });
        }
        return router.startRouting();
      };

      Router.prototype._hash = function(val, silent) {
        var hash;

        if (val === void 0) {
          return window.history.state;
        } else if (val) {
          val = val.replace(/^(\/)/, "");
          hash = "/" + val;
          if (!silent) {
            window.history.pushState(val, val, hash);
            return crossroads.parse(val);
          } else {
            return window.history.replaceState(val, val, hash);
          }
        }
      };

      Router.prototype.removeRoute = function(route) {
        return crossroads.removeRoute(route);
      };

      Router.prototype.addRoute = function(route, callback) {
        return crossroads.addRoute(route, callback);
      };

      Router.prototype.onRoute = function(controller, action, index, callback) {
        var controllerName, ctl,
          _this = this;

        controllerName = "" + controller + "Controller";
        ctl = this._controllers[controllerName];
        if (!ctl) {
          return require(["" + this.controllerDirectory + "/" + controllerName], function(controllerModule) {
            ctl = eval("new controllerModule.Controller()");
            ctl[action](index);
            _this._controllers[controllerName] = ctl;
            if (callback) {
              return callback();
            }
          });
        } else {
          ctl[action](index);
          if (callback) {
            return callback();
          }
        }
      };

      Router.prototype.startRouting = function() {
        var _this = this;

        window.onpopstate = function(e) {
          return crossroads.parse(e.state);
        };
        crossroads.bypassed.add(function() {
          return console.log("Not found");
        });
        return this._hash(window.location.pathname);
      };

      return Router;

    })();
    return {
      Router: Router
    };
  });

}).call(this);
