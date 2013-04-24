define ["ural/controller", "app/models/menu"], (controller, menu) ->

  class GraphController extends controller.Controller

    constructor: ->
      nav = new menu.Menu()
      ko.applyBindings(nav, $("#_nav")[0])
      super

    panel: ->
      @view "app/views/graph/panel.html"

    send: ->
      @view "app/views/graph/send.html"

  Controller : GraphController