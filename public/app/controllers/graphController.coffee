define [
        "app/controllers/controllerBase",
        "app/vm/graph/panel",
        "app/vm/graph/toolbox"
],
(controllerBase, panel, toolbox) ->

  class GraphController extends controllerBase.Controller

    panel: (contrib) ->
      pl = new panel()
      @view_apply "app/views/graph/panel.html",
        _layouts:
          _body: {loader : pl, filter : {contrib : contrib}}
          _toolbox: new toolbox(@nav, pl)
      ,(err) =>
        if !err
          @nav.activeContrib pl.data.name

  Controller : GraphController
