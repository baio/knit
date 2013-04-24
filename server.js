// Generated by CoffeeScript 1.3.3
(function() {
  var connect, _router;

  connect = require("connect");

  _router = function(req, res, next) {
    if (req.url === "/") {
      req.url = "/main.html";
      return next();
    } else if (req.url.match(/^\/\w+\/\w+$/)) {
      res.writeHead(302, {
        'Location': '/'
      });
      return res.end();
    } else {
      return next();
    }
  };

  connect().use(_router).use(connect["static"]("public")).listen(8005);

}).call(this);
