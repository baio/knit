define ["ural/controller",
  "app/vm/menu",
  "app/cache/manager"
],
(controller, menu, cache) ->

  class GraphController extends controller.Controller

    constructor: ->
      @nav = new menu()
      super

    view_apply_user_important: (path, model, done) ->
      @nav.load null, (err, data)=>
        model._layouts._nav = data : (if !err then data else {})
        GraphController.__super__.view_apply.call(@, path, model, done)

    view_apply: (path, model, done) ->
      model._layouts._nav = @nav
      super path, model, done

  Controller : GraphController