request = require("./request")

exports.get = (req, res) ->
  if req.isAuthenticated()
    req.query["name"] = req.user.name
  request.req(req, res, "curUser", true)
