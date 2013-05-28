define ->

  get: ->
    null

  update: (filter, data) ->
    console.log "curUser", filter, data
    strored_user = $.jStorage.get "curUser"
    if strored_user != data._id
      console.log "new user, swap cache [was #{strored_user}, become #{data._id}]"
      $.jStorage.flush()
      $.jStorage.set "curUser", data._id
