request = require("request")

exports.get = (req, res) ->
  userName = req.user.name if req.isAuthenticated()
  request("#{process.env.DISPATCH_URL}/users", qs: {user: userName}).pipe(res)
