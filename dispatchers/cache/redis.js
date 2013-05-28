// Generated by CoffeeScript 1.6.2
(function() {
  var client, del, get, getJSON, redis, set, setJSON, _checkCacheEnabled, _default_graph, _get_key;

  if (!process.env.CACHE_DISABLED) {
    redis = require("redis");
    client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
    client.auth(process.env.REDIS_PASSWORD, function(err) {
      return console.log("Redis connect : " + err);
    });
  }

  _default_graph = "518b989739ed9714289d0bc1";

  _checkCacheEnabled = function(done) {
    if (process.env.CACHE_DISABLED) {
      if (done) {
        done(null, null);
      }
      return false;
    } else {
      return true;
    }
  };

  _get_key = function(type, key) {
    if (!key) {
      key = _default_graph;
    }
    return type + "_" + key;
  };

  get = function(type, key, done) {
    if (!_checkCacheEnabled(done)) {
      return;
    }
    return client.get(_get_key(type, key), function(err, reply) {
      return done(err, reply);
    });
  };

  set = function(type, key, data) {
    if (!_checkCacheEnabled()) {
      return;
    }
    return client.set(_get_key(type, key), data, redis.print);
  };

  del = function(type, key) {
    if (!_checkCacheEnabled()) {
      return;
    }
    if (!Array.isArray(key)) {
      key = [key];
    }
    key = key.map(function(k) {
      return _get_key(type, k);
    });
    return client.del(key, redis.print);
  };

  getJSON = function(type, key, done) {
    return get(type, key, function(err, reply) {
      return done(err, (!err && reply ? JSON.parse(reply) : void 0));
    });
  };

  setJSON = function(type, key, data) {
    return set(type, key, JSON.stringify(data));
  };

  exports.get = get;

  exports.set = set;

  exports.del = del;

  exports.getJSON = getJSON;

  exports.setJSON = setJSON;

}).call(this);

/*
//@ sourceMappingURL=redis.map
*/
