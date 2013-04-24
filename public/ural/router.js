// Generated by CoffeeScript 1.3.3
(function() {

  define(function() {
    var Router;
    Router = (function() {

      function Router(controllerDirectory) {
        this.controllerDirectory = controllerDirectory;
      }

      Router.StartRouting = function(controllerDirectory, routes) {
        var route, router, _i, _len,
          _this = this;
        router = new Router(controllerDirectory);
        for (_i = 0, _len = routes.length; _i < _len; _i++) {
          route = routes[_i];
          router.addRoute(route.url, function(controller, action, index) {
            var defaultRoute;
            if (controller) {
              return router.onRoute(controller, action, index);
            } else {
              defaultRoute = routes.filter(function(f) {
                return f.url === "/";
              })[0];
              if (defaultRoute) {
                return router.onRoute(defaultRoute.path.controller, defaultRoute.path.action, defaultRoute.path.arg);
              }
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
        var controllerName,
          _this = this;
        controllerName = "" + controller + "Controller";
        return require(["" + this.controllerDirectory + "/" + controllerName], function(controllerModule) {
          var ctl;
          ctl = eval("new controllerModule.Controller()");
          ctl[action](index);
          if (callback) {
            return callback();
          }
        });
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
