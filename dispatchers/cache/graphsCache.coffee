redis = require "./redis"

exports.get = (id, done) ->
  redis.get "graph", id, done

