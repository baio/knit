request = require("./request")
cache = require "./cache/redis"
es = require "event-stream"

_del = (req) ->
  r =
    isAuthenticated : -> req.isAuthenticated()
    user: req.user
    query: {ref : req.body.id}
    body: {}
    method: "get"
  request.req r, null, "contrib_graphs", false, es.join((err, data) ->
    console.log "delete graph from cache" + err
    if !err
      j = JSON.parse(data)
      cache.del "graph", j
  )

exports.get = (req, res) ->
  request.req(req, res, "contribs")

exports.post = (req, res) ->
  request.req(req, res, "contribs")

exports.put = (req, res) ->
  request.req(req, res, "contribs", _del(req))

exports.patch = (req, res) ->
  request.req(req, res, "contribs", _del(req))

exports.delete = (req, res) ->
  request.req(req, res, "contribs", _del(req))

exports.copy = (req, res) ->
  request.req(req, res, "contribs")