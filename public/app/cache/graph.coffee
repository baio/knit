define ->

  #update every 3 hours
  TTL = 1000 * 60 * 60 * 3

  _getName: (filter) ->
    if filter then "graph" + JSON.stringify(filter) else "graph"

  get: (filter) ->
    if filter.context != "data"
      console.log "g : " + filter.graph
      d = $.jStorage.get @_getName filter.graph
      if d then JSON.parse(d) else null

  update: (filter, data) ->
    return
    if filter.context != "data" and !data.isYours
      #cache only graph panel
      _data = JSON.stringify(data)
      console.log "u : " + filter.graph + " : " + data.ref
      $.jStorage.set(@_getName(filter.graph), _data, {TTL: TTL})
      if filter.graph != data.ref
        $.jStorage.set(@_getName(data.ref), _data, {TTL: TTL})