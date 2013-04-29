connect = require("connect")

_router = (req, res, next) ->
  if req.url == "/"
    req.url = "/main.html"
    next()
  else if req.url.match /^\/\w+\/\w+$/
    res.writeHead(302, {'Location' : '/'})
    res.end()
  else
    next()

connect()
  .use(_router)
  .use(connect.static("public"))
  .listen( process.env.PORT || 8001)