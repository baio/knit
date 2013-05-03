define ["ural/controller",
  "app/vm/menu",
  "app/vm/contrib/indexVM"],
(controller, menu, indexVM) ->

  class ContribController extends controller.Controller

    constructor: ->
      nav = new menu.Menu()
      ko.applyBindings(nav, $("#_nav")[0])
      super

    index: ->
      @view_apply "app/views/contrib/index.html", new indexVM()

  Controller : ContribController