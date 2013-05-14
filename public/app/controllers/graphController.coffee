define [
        "app/controllers/controllerBase",
        "app/vm/graph/panel",
        "app/vm/graph/data",
        "app/vm/graph/toolbox"
],
(controllerBase, Panel, Data, toolbox) ->

  class GraphController extends controllerBase.Controller

    panel: (graph) ->
      pl = new Panel()
      @view_apply "app/views/graph/panel.html",
        _layouts:
          _body: {loader : pl, filter : {graph : graph}}
          _toolbox: new toolbox(@nav, pl)
      ,(err) =>
        if !err
          @nav.activeGraph id: pl.data.id, name: pl.data.name, isYours: pl.data.isYours

    data: (graph) ->
      d = new Data()
      @view_apply "app/views/graph/data.html",
        _layouts :
          _body: {loader : d, filter : {graph : graph, context: "data"}}
      ,(err) =>
        console.log err

  Controller : GraphController
