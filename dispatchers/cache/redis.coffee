redis = require "redis"
client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
client.auth process.env.REDIS_PASSWORD, (err) ->
  console.log "Redis connect : " + err

get = (type, key, done) ->
  client.get type + "_" + key, (err, reply) ->
    if !err and reply
      reply = JSON.parse reply
    done err, reply


set = (type, key, data) ->
  client.set type + "_" + key, JSON.stringify(data)

exports.get = get
exports.set = set


