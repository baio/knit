define ["ural/controller",
  "app/vm/menu",
  "app/vm/user/user",
  "app/vm/contrib/indexVM"
],
(controller, menu, user, contrib) ->

  class ContribController extends controller.Controller

    constructor: ->
      @nav = new menu.Menu()
      super

    start: ->
      @view_apply "app/views/contrib/start.html",
        _layouts:
          _body: new user()
          _nav:  @nav

    item: (id) ->
      @view_apply "app/views/contrib/item.html",
        _layouts:
          _body: {loader : new contrib(), filter : {id : id}}
          _nav:  @nav

  Controller : ContribController