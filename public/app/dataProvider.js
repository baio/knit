// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty;

  define(["app/config", "app/cache/manager"], function(config, cache) {
    var DataProvider;

    DataProvider = (function() {
      function DataProvider() {}

      DataProvider.prototype.onGetBaseUrl = function() {
        return config.base_url;
      };

      DataProvider.prototype.onFlatData = function(data) {
        var prop;

        for (prop in data) {
          if (!__hasProp.call(data, prop)) continue;
          if (!(data[prop] instanceof Date) && (typeof data[prop] === "object" || Array.isArray(data[prop]))) {
            delete data[prop];
          }
        }
        this.date2json(data);
        return data;
      };

      DataProvider.prototype.parseDate = function(str) {
        var dt;

        dt = moment(str, "YYYY-MM-DDTHH:mm:ss.Z");
        if (dt && dt.isValid()) {
          return dt.toDate();
        } else {
          return void 0;
        }
      };

      DataProvider.prototype.formatDate = function(obj) {
        return obj.toUTCString();
      };

      DataProvider.prototype.date2json = function(data) {
        var d, prop, _results;

        _results = [];
        for (prop in data) {
          if (!__hasProp.call(data, prop)) continue;
          if (data[prop] instanceof Date) {
            _results.push(data[prop] = formatDate(data[prop]));
          } else if (typeof data[prop] === "object") {
            _results.push(this.date2json(data[prop]));
          } else if (Array.isArray(data[prop])) {
            _results.push((function() {
              var _i, _len, _ref, _results1;

              _ref = data[prop];
              _results1 = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                d = _ref[_i];
                _results1.push(this.date2json(d));
              }
              return _results1;
            }).call(this));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      DataProvider.prototype.json2date = function(data) {
        var d, dt, prop, _results;

        _results = [];
        for (prop in data) {
          if (!__hasProp.call(data, prop)) continue;
          if (typeof data[prop] === "string") {
            dt = this.parseDate(data[prop]);
            if (dt) {
              _results.push(data[prop] = dt);
            } else {
              _results.push(void 0);
            }
          } else if (Array.isArray(data[prop])) {
            _results.push((function() {
              var _i, _len, _ref, _results1;

              _ref = data[prop];
              _results1 = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                d = _ref[_i];
                _results1.push(this.json2date(d));
              }
              return _results1;
            }).call(this));
          } else if (typeof data[prop] === "object") {
            _results.push(this.json2date(data[prop]));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      DataProvider.prototype.onGetUrl = function(resource, action) {
        var res;

        if (action) {
          res = "/" + resource + "/" + action;
        } else {
          res = "/" + resource;
        }
        return this.onGetBaseUrl() + res;
      };

      DataProvider.prototype.onGetError = function(resp, res) {
        if (res === "error") {
          return {
            code: resp.status,
            message: resp.statusText
          };
        } else if (resp.errors || resp.error) {
          return {
            code: 500,
            message: (resp.error ? resp.error : "Error"),
            errors: resp.errors
          };
        }
      };

      DataProvider.prototype.get = function(resource, filter, done) {
        return this.ajax(resource, "get", filter, done);
        /*
        $.get(@onGetUrl(resource), filter)
          .always (resp, res) =>
            err = @onGetError(resp, res)
            if !err
              @json2date resp
            done err, resp
        */

      };

      DataProvider.prototype.update = function(resource, data, done) {
        var _this = this;

        this.date2json(data);
        return $.post(this.onGetUrl(resource), JSON.stringify(data)).always(function(resp, res) {
          var err;

          err = _this.onGetError(resp, res);
          if (!err) {
            _this.json2date(resp);
          }
          return done(err, resp);
        });
      };

      DataProvider.prototype.create = function(resource, data, done) {
        var _this = this;

        this.date2json(data);
        return $.post(this.onGetUrl(resource), JSON.stringify(data)).always(function(resp, res) {
          var err;

          err = _this.onGetError(resp, res);
          if (!err) {
            _this.json2date(resp);
          }
          return done(err, resp);
        });
      };

      DataProvider.prototype.ajax = function(resource, method, data, done) {
        var c,
          _this = this;

        if (method === "get") {
          c = this._cache_get(resource, data);
          if (c) {
            done(null, c);
            return;
          }
        }
        this.date2json(data);
        return $.ajax({
          url: this.onGetUrl(resource),
          data: data && !$.isEmptyObject(data) ? data : void 0,
          method: method,
          crossDomain: true,
          contentType: "application/json; charset=UTF-8",
          dataType: 'json'
        }).always(function(resp, res) {
          var err;

          err = _this.onGetError(resp, res);
          if (!err) {
            _this.json2date(resp);
            _this._cache_upd(resource, (method === "get" ? data : null), resp);
          }
          return done(err, resp);
        });
      };

      DataProvider.prototype._cache_get = function(resource, filter) {
        var c;

        c = cache(resource);
        if (c) {
          return c.get(filter);
        } else {
          return null;
        }
      };

      DataProvider.prototype._cache_upd = function(resource, filter, data) {
        var c;

        c = cache(resource);
        if (c) {
          return c.update(filter, data);
        }
      };

      return DataProvider;

    })();
    return new DataProvider();
  });

}).call(this);

/*
//@ sourceMappingURL=dataProvider.map
*/
