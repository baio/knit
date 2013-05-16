define ["ural/controller",
  "app/vm/menu",
  "app/cache/manager"
],
(controller, menu, cache) ->

  class GraphController extends controller.Controller

    constructor: ->
      @nav = new menu()
      super

    view_apply: (path, model, done) ->
      model._layouts._nav = @nav
      super path, model, done

  Controller : GraphController