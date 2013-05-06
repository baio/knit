define ["ural/controller",
  "app/vm/menu",
  "app/vm/user/user"],
(controller, menu, user) ->

  class ContribController extends controller.Controller

    constructor: ->
      nav = new menu.Menu()
      ko.applyBindings(nav, $("#_nav")[0])
      super

    index: ->
      @view_apply "app/views/contrib/start.html", new user()

  Controller : ContribController