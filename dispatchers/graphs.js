// Generated by CoffeeScript 1.6.2
(function() {
  var request;

  request = require("./request");

  exports.get = function(req, res) {
    return request.req(req, res, "graphs", true);
  };

}).call(this);

/*
//@ sourceMappingURL=graphs.map
*/
