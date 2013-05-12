connect = require("connect")
passport = require('passport')
TwitterStrategy = require('passport-twitter').Strategy
MongoStore = require "connect-mongodb"
url = require("url")
dispatchers =
  users : require("./dispatchers/users")
  graphs : require("./dispatchers/graphs")
  contribs : require("./dispatchers/contribs")

_redirect = (req, res, next) ->
  res.redirect = (url) ->
    @writeHead(302, {'Location' : url})
    @end()
  next()

_router = (req, res, next) ->
  path = url.parse(req.url).pathname
  if path == "/auth/twitter"
    console.log "auth"
    passport.authenticate('twitter')(req, res, next)
  else if path == "/auth/twitter/callback"
    passport.authenticate('twitter', {successRedirect: '/', failureRedirect: '/login'})(req, res, next)
  else if path == "/"
    req.url = "/main.html"
    next()
  else if path.match /^\/srv\/\w+$/
    match = /^\/srv\/(\w+)$/.exec(path)
    srv_path = match[1]
    srv_method = req.method.toLowerCase()
    dispatchers[srv_path][srv_method](req, res)
  else if path.match /^\/\w+\/\w+$/
    res.writeHead(302, {'Location' : '/'})
    res.end()
  else
    next()

passport.use new TwitterStrategy
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "http://localhost:8001/auth/twitter/callback",
  (token, tokenSecret, profile, done) ->
    done null, { name: "twitter@" + profile.username, displayName: profile.displayName, img: profile.photos[0].value }

passport.serializeUser (user, done) ->
  done null, user.name + ":" + user.displayName + ":" + user.img

passport.deserializeUser (id, done) ->
  sp = id.split ":"
  done null, name: sp[0], displayName: sp[1], img: sp[2]

connect()
  .use(connect.cookieParser())
  .use(connect.bodyParser())
  .use(_redirect)
  .use(connect.query())
  .use(connect.session secret: 'keyboard cat', store: new MongoStore(url: "mongodb://adm:123@ds059957.mongolab.com:59957/knit"))
  .use(passport.initialize())
  .use(passport.session())
  .use(_router)
  .use(connect.static("public"))
  .listen( process.env.PORT || 8001)