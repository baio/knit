define ->

  #update every 3 hours
  TTL = 1000 * 60 * 60 * 3

  _default_ref = "518b989739ed9714289d0bc1"

  _getName: (ref) ->
    ref = _default_ref if !ref
    "graph_" + ref

  _auth: ->
    true

  get: (filter) ->
    if filter.context != "data"
      console.log "get graph cache : " + @_getName filter.graph
      d = $.jStorage.get @_getName filter.graph
      if d then JSON.parse(d) else null

  update: (filter, data) ->
    if (!filter or filter.context != "data") and !data.isYours
      #cache only if this is not graph of the user
      console.log "update graph cache : " + data.id
      _data = JSON.stringify(data)
      $.jStorage.set(@_getName(data.id), _data, {TTL: TTL})
