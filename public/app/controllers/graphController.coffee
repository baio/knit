define ["ural/controller",
 "app/vm/menu",
 "app/vm/graph/panel",
 "app/vm/graph/toolbox",
],
(controller, menu, panel, toolbox) ->

  class GraphController extends controller.Controller

    constructor: ->
      @nav = new menu.Menu()
      #ko.applyBindings(nav, $("#_nav")[0])
      super

    panel: ->
      pl = new panel()
      @view_apply "app/views/graph/panel.html",
        _layouts:
          _body: pl
          _nav:  @nav
          _toolbox: new toolbox(pl)


  Controller : GraphController