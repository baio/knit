redis = require "redis"
client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
client.auth process.env.REDIS_PASSWORD, (err) ->
  console.log "Redis connect : " + err

get = (type, key, done) ->
  client.get type + "_" + key, (err, reply) ->
    done err, reply

set = (type, key, data) ->
  console.log type + "_" + key
  console.log data
  client.set type + "_" + key, data,  redis.print

getJSON = (type, key, done) ->
  get type, key, (err, reply) ->
    done err, (if !err and reply then JSON.parse reply)

setJSON = (type, key, data) ->
  set type, key, JSON.stringify(data)

exports.get = get
exports.set = set
exports.getJSON = getJSON
exports.setJSON = setJSON
