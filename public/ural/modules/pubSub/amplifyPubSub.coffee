define ->

  _once_subs = {}

  pub: (target, topic, data) ->
    amplify.publish "#{target}_#{topic}", data

  sub: (target, topic, once, callback) ->

    if $.isFunction(once)
      callback = once
      once = false

    name = "#{target}_#{topic}"
    if once
      s = _once_subs[name]
      if s
        amplify.unsubscribe(name, s)
      _once_subs[name] = callback

    amplify.subscribe name, callback

