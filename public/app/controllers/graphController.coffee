define ["ural/controller"], (controller) ->

  class GraphController extends controller.Controller

    panel: ->
      console.log "index"
      @view "app/views/graph/panel.html"

  Controller : GraphController