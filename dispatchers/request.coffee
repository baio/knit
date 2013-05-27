request = require "request"

exports.req = (req, res, resource, skipAuth, stream) ->
  if req.isAuthenticated() or skipAuth
    if req.isAuthenticated()
      req.query["user"] = req.user.name
      req.body["user"] = req.user.name
    r = request(uri: "#{process.env.DISPATCH_URL}/#{resource}", qs: req.query, json: req.body, method: req.method)
    if stream
      r.pipe(stream).pipe(res)
    else
      r.pipe(res)
  else
    res.writeHead(401)
    res.end()