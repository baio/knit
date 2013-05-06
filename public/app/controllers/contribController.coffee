define ["ural/controller",
  "app/vm/menu",
  "app/vm/user/user",
  "app/vm/contrib/indexVM"
],
(controller, menu, user, contrib) ->

  class ContribController extends controller.Controller

    constructor: ->
      nav = new menu.Menu()
      ko.applyBindings(nav, $("#_nav")[0])
      super

    start: ->
      @view_apply "app/views/contrib/start.html", new user()

    item: (id) ->
      @view_apply "app/views/contrib/item.html", new contrib(), {id : id}

  Controller : ContribController