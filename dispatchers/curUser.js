// Generated by CoffeeScript 1.6.2
(function() {
  var request;

  request = require("./request");

  exports.get = function(req, res) {
    if (req.isAuthenticated()) {
      req.query["name"] = req.user.name;
    }
    return request.req(req, res, "curUser", true);
  };

}).call(this);

/*
//@ sourceMappingURL=curUser.map
*/
