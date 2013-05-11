define [
        "app/controllers/controllerBase",
        "app/vm/graph/panel",
        "app/vm/graph/toolbox"
],
(controllerBase, panel, toolbox) ->

  class GraphController extends controllerBase.Controller

    panel: (graph) ->
      pl = new panel()
      @view_apply "app/views/graph/panel.html",
        _layouts:
          _body: {loader : pl, filter : {graph : graph}}
          _toolbox: new toolbox(@nav, pl)
      ,(err) =>
        if !err
          @nav.activeGraph id: pl.data.id, name: pl.data.name

  Controller : GraphController
