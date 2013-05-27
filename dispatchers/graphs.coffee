request = require("./request")
cache = require "./cache/redis"
async = require "async"
es = require "event-stream"

exports.get = (req, res) ->
  ref = if !req.query.graph then "_default" else req.query.graph
  async.waterfall [
    (ck) ->
      if req.query.context != "data"
        cache.get "graph", ref, ck
      else
        ck null, null
    (r, ck) ->
      if !r
        request.req(req, res, "graphs", true, es.join(ck))
      else
        console.log "graph found in cache it's allrigth!"
        res.writeHead(200, { 'Content-Type': 'application/json' })
        r = JSON.parse(r)
        r.isYours = req.user and req.user.name == r.owner
        res.write JSON.stringify(r)
        #res.write r
        res.end()
        ck null, null
    ], (err, data) ->
        if !err and data and req.query.context != "data"
          cache.set "graph", ref, data

exports.post = (req, res) ->
  request.req(req, res, "graphs", true)

exports.put = (req, res) ->
  request.req(req, res, "graphs", true)

exports.patch = (req, res) ->
  request.req(req, res, "graphs", true)

exports.delete = (req, res) ->
  request.req(req, res, "graphs", true)
