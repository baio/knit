redis = require "redis"
client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
client.auth process.env.REDIS_PASSWORD, (err) ->
  console.log "Redis connect : " + err

_default_graph = "518b989739ed9714289d0bc1"

_get_key = (type, key) ->
  if !key
    key = _default_graph
  type + "_" + key

get = (type, key, done) ->
  client.get _get_key(type, key), (err, reply) ->
    done err, reply

set = (type, key, data) ->
  client.set _get_key(type, key), data, redis.print

del = (type, key) ->
  key = [key] if  !Array.isArray key
  key = key.map((k) -> _get_key(type, k))
  client.del key, redis.print

getJSON = (type, key, done) ->
  get type, key, (err, reply) ->
    done err, (if !err and reply then JSON.parse reply)

setJSON = (type, key, data) ->
  set type, key, JSON.stringify(data)

exports.get = get
exports.set = set
exports.del = del
exports.getJSON = getJSON
exports.setJSON = setJSON
