define ->

  get: ->
    $.jStorage.get "curUser"

  update: (method, req_data, res_data) ->
    console.log "curUser", method, req_data, res_data
    if method == "get"
      stored_user = $.jStorage.get "curUser"
      if !stored_user or strored_user._id != res_data._id
        console.log "new user, swap cache [was #{stored_user}, become #{res_data._id}]"
        if stored_user then $.jStorage.flush()
        $.jStorage.set "curUser", res_data
