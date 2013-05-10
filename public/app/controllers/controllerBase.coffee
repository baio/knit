define ["ural/controller",
        "app/vm/menu"
],
(controller, menu) ->

  class GraphController extends controller.Controller

    constructor: ->
      @nav = new menu()
      super

    view_apply: (path, model) ->
      model._layouts._nav = @nav
      super path, model

  Controller : GraphController