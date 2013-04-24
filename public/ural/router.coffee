define ["ural/modules/pubSub"], (pubSub) ->

  class Router

    constructor: (@controllerDirectory) ->
      @_controllers = []
      pubSub.sub "href", "change", (data) =>
        @_hash data.href

    @StartRouting:(controllerDirectory, routes) ->
      router = new Router controllerDirectory
      for route in routes
        router.addRoute route.url, (controller, action, index)=>
          if !controller
            defaultRoute = routes.filter((f) -> f.url == "/")[0]
            if defaultRoute
              controller = defaultRoute.path.controller
              action = defaultRoute.path.action
              index = defaultRoute.path.arg
          if controller
            router.onRoute controller, action, index, ->
              pubSub.pub "href", "changed",
                controller : controller,
                action : action,
                index : index,
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
      ctl = @_controllers[controllerName]
      if !ctl
        require ["#{@controllerDirectory}/#{controllerName}"], (controllerModule) =>
          ctl = eval "new controllerModule.Controller()"
          ctl[action] index
          @_controllers[controllerName] = ctl
          if callback then callback()
      else
        ctl[action] index
        if callback then callback()

    startRouting: ->
      window.onpopstate = (e) =>
        crossroads.parse e.state
      crossroads.bypassed.add =>
        console.log "Not found"
      @_hash window.location.pathname

  Router : Router