define ["ural/controller",
 "app/vm/menu",
 "app/vm/graph/panel",
 "app/vm/graph/toolbox",
],
(controller, menu, panel, toolbox) ->

  class GraphController extends controller.Controller

    constructor: ->
      @nav = new menu()
      super

    panel: (contrib) ->
      if !contrib
        contrib = @nav.activeContrib().ref()
      pl = new panel()
      @view_apply "app/views/graph/panel.html",
        _layouts:
          _body: {loader : pl, filter : {contrib : contrib}}
          _nav:  @nav
          _toolbox: new toolbox(@nav, pl)


  Controller : GraphController