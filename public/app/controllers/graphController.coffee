define [
        "app/controllers/controllerBase",
        "app/vm/graph/panel",
        "app/vm/graph/toolbox"
],
(controllerBase, panel, toolbox) ->

  class GraphController extends controllerBase.Controller

    panel: (contrib) ->
      if !contrib
        contrib = @nav.activeContrib().ref()
      pl = new panel()
      @view_apply "app/views/graph/panel.html",
        _layouts:
          _body: {loader : pl, filter : {contrib : contrib}}
          _toolbox: new toolbox(@nav, pl)

  Controller : GraphController
