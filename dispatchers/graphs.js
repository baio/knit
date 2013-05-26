// Generated by CoffeeScript 1.6.2
(function() {
  var Stream, async, cache, request;

  request = require("./request");

  cache = require("./cache/graphsCache");

  async = require("async");

  Stream = require("stream");

  exports.get = function(req, res) {
    return async.waterfall([
      function(ck) {
        if (req.query.context !== "data") {
          return cache.get((!req.query.ref ? "_default" : req.query.ref), ck);
        } else {
          return ck(null, null);
        }
      }, function(r, ck) {
        var mstream;

        if (!r) {
          mstream = new Stream();
          mstream.writable = true;
          mstream.write = function(data) {
            console.log(data);
            return this.emit('data', data);
          };
          mstream.end = function() {
            console.log("end");
            return this.emit('end');
          };
          request.req(req, res, "graphs", true, mstream);
        } else {
          res.end(r);
        }
        return ck(null, r);
      }
    ], function(err) {
      if (!err) {
        return console.log("err");
      }
    });
  };

  exports.post = function(req, res) {
    return request.req(req, res, "graphs", true);
  };

  exports.put = function(req, res) {
    return request.req(req, res, "graphs", true);
  };

  exports.patch = function(req, res) {
    return request.req(req, res, "graphs", true);
  };

  exports["delete"] = function(req, res) {
    return request.req(req, res, "graphs", true);
  };

}).call(this);

/*
//@ sourceMappingURL=graphs.map
*/
