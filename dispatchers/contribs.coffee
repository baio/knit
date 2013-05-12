request = require("./request")

exports.get = (req, res) ->
  request.req(req, res, "contribs")

exports.post = (req, res) ->
  request.req(req, res, "contribs")

exports.put = (req, res) ->
  request.req(req, res, "contribs")

exports.patch = (req, res) ->
  request.req(req, res, "contribs")

exports.delete = (req, res) ->
  request.req(req, res, "contribs")