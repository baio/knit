request = require("./request")

exports.get = (req, res) ->
  request.req(req, res, "graphs", true)

exports.post = (req, res) ->
  request.req(req, res, "graphs", true)

exports.put = (req, res) ->
  request.req(req, res, "graphs", true)

exports.patch = (req, res) ->
  request.req(req, res, "graphs", true)
