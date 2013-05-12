request = require("request")

exports.get = (req, res) ->
  if req.isAuthenticated()
    qs = req.query
    qs["user"] = req.user.name
    request(uri: "#{process.env.DISPATCH_URL}/contribs", qs: qs).pipe(res)
  else
    res.writeHead(401)
    res.end()
