define ->

  class Router

    constructor: (@controllerDirectory) ->

    @StartRouting:(controllerDirectory, routes) ->
      router = new Router controllerDirectory
      for route in routes
        router.addRoute route.url, (controller, action, index)=>
          if controller
            router.onRoute controller, action, index
          else
            defaultRoute = routes.filter((f) -> f.url == "/")[0]
            if defaultRoute
              router.onRoute defaultRoute.path.controller, defaultRoute.path.action, defaultRoute.path.arg
      router.startRouting()

    _hash: (val, silent) ->
      if val == undefined
        window.history.state
      else if val
        val = val.replace /^(\/)/, ""
        hash = "/" + val
        if !silent
          window.history.pushState val, val, hash
          crossroads.parse val
        else
          window.history.replaceState val, val, hash

    removeRoute: (route) ->
      crossroads.removeRoute route

    addRoute: (route, callback) ->
      crossroads.addRoute route, callback

    onRoute: (controller, action, index, callback) ->
      controllerName = "#{controller}Controller"
      require ["#{@controllerDirectory}/#{controllerName}"], (controllerModule) =>
        ctl = eval "new controllerModule.Controller()"
        ctl[action] index
        if callback then callback()

    startRouting: ->
      window.onpopstate = (e) =>
        crossroads.parse e.state
      crossroads.bypassed.add =>
        console.log "Not found"
      @_hash window.location.pathname

  Router : Router