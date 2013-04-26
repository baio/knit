define ["ural/controller",
 "app/models/menu",
 "app/models/graph/panel",
 "app/models/graph/send"],
(controller, menu, panel, send) ->

  class GraphController extends controller.Controller

    constructor: ->
      nav = new menu.Menu()
      ko.applyBindings(nav, $("#_nav")[0])
      super

    panel: ->
      @view "app/views/graph/panel.html", new panel.Panel()

    send: ->
      @view "app/views/graph/send.html", new send.Send()

  Controller : GraphController