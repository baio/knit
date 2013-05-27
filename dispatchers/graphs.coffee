request = require("./request")
cache = require "./cache/graphsCache"
async = require "async"
Stream = require "stream"

exports.get = (req, res) ->
  async.waterfall [
    (ck) ->
      if req.query.context != "data"
        cache.get (if !req.query.ref then "_default" else req.query.ref), ck
      else
        ck null, null
    (r, ck) ->
      if !r
        #https://github.com/dominictarr/event-stream
        mstream = new Stream()
        mstream.writable = true
        mstream.write = (data) ->
          console.log data
          @emit('data', data)
        mstream.end = ->
          console.log "end"
          @emit 'end'
        request.req(req, res, "graphs", true, mstream)
      else
        res.end r
      ck(null, r)
    ], (err) ->
      if !err
          console.log "err"

exports.post = (req, res) ->
  request.req(req, res, "graphs", true)

exports.put = (req, res) ->
  request.req(req, res, "graphs", true)

exports.patch = (req, res) ->
  request.req(req, res, "graphs", true)

exports.delete = (req, res) ->
  request.req(req, res, "graphs", true)
