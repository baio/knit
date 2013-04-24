connect = require("connect")

_router = (req, res, next) ->
  if req.url == "/"
    req.url = "/main.html"
  next()

connect()
  .use(_router)
  .use(connect.static("public"))
  .listen(8005)