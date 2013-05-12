connect = require("connect")
passport = require('passport')
TwitterStrategy = require('passport-twitter').Strategy
url = require("url")

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
    done null, { name: "twitter@" + profile.username, displayName: profile.displayname, img: profile.photos[0] }

passport.serializeUser (user, done) ->
  done null, user.name + ":" + user.displayName + ":" + user.img

passport.deserializeUser (id, done) ->
  sp = id.split ":"
  done null, name: sp[0], displayName: sp[1], img: sp[2]

connect()
  .use(connect.cookieParser())
  .use(_redirect)
  .use(connect.query())
  .use(connect.session secret: 'keyboard cat' )
  .use(passport.initialize())
  .use(_router)
  .use(connect.static("public"))
  .listen( process.env.PORT || 8001)