// Generated by CoffeeScript 1.6.2
(function() {
  var MongoStore, TwitterStrategy, connect, dispatchers, passport, url, _redirect, _router;

  connect = require("connect");

  passport = require('passport');

  TwitterStrategy = require('passport-twitter').Strategy;

  MongoStore = require("./mongo/connect-mongodb");

  url = require("url");

  dispatchers = {
    users: require("./dispatchers/users"),
    graphs: require("./dispatchers/graphs"),
    contribs: require("./dispatchers/contribs"),
    names: require("./dispatchers/names"),
    tags: require("./dispatchers/tags"),
    pushes: require("./dispatchers/pushes"),
    curUser: require("./dispatchers/curUser"),
    index: require("./dispatchers/index")
  };

  _redirect = function(req, res, next) {
    res.redirect = function(url) {
      this.writeHead(302, {
        'Location': url
      });
      return this.end();
    };
    return next();
  };

  _router = function(req, res, next) {
    var match, path, srv_method, srv_path, url_parsed;

    url_parsed = url.parse(req.url, true);
    path = url_parsed.pathname;
    if (path === "/auth/logout") {
      req.session.destroy();
      req.logout();
      res.writeHead(302, {
        'Location': '/'
      });
      return res.end();
    } else if (path === "/auth/twitter") {
      console.log("auth");
      return passport.authenticate('twitter')(req, res, next);
    } else if (path === "/auth/twitter/callback") {
      return passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login'
      })(req, res, next);
    } else if (path === "/") {
      req.url = "/main.html";
      return next();
    } else if (path.match(/^\/srv\/\w+$/)) {
      match = /^\/srv\/(\w+)$/.exec(path);
      srv_path = match[1];
      srv_method = req.method.toLowerCase();
      return dispatchers[srv_path][srv_method](req, res);
    } else if (path.match(/^[\/\w+]+$/)) {
      res.writeHead(302, {
        'Location': '/?hash=' + path
      });
      return res.end();
    } else {
      return next();
    }
  };

  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK
  }, function(token, tokenSecret, profile, done) {
    return done(null, {
      name: "twitter@" + profile.username,
      displayName: profile.displayName,
      img: profile.photos[0].value
    });
  }));

  passport.serializeUser(function(user, done) {
    return done(null, user.name + "|" + user.displayName + "|" + user.img);
  });

  passport.deserializeUser(function(id, done) {
    var sp;

    sp = id.split("|");
    return done(null, {
      name: sp[0],
      displayName: sp[1],
      img: sp[2]
    });
  });

  connect().use(connect.cookieParser()).use(connect.bodyParser()).use(_redirect).use(connect.query()).use(connect.session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      url: process.env.MONGO_STORE
    })
  })).use(passport.initialize()).use(passport.session()).use(_router).use(connect["static"]("public")).listen(process.env.PORT || 8001);

}).call(this);

/*
//@ sourceMappingURL=server.map
*/
