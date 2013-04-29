define ["ural/controller",
 "app/models/menu",
 "app/models/graph/panel",
 "app/models/graph/send",
 "app/config"],
(controller, menu, panel, send, config) ->

  class GraphController extends controller.Controller

    constructor: ->
      nav = new menu.Menu()
      ko.applyBindings(nav, $("#_nav")[0])
      super

    panel: ->
      @view_apply "app/views/graph/panel.html", new panel.Panel()

    send: ->
      @viewBag =
        download_gexf_href : config.links.gexf_download
      @view "app/views/graph/send.html", new send.Send()

  Controller : GraphController