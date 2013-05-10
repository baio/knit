define ["app/controllers/controllerBase",
  "app/vm/user/user",
  "app/vm/contrib/index"
],
(controller, user, contrib) ->

  class ContribController extends controller.Controller

    start: ->
      @view_apply "app/views/contrib/start.html",
        _layouts:
          _body: new user()

    item: (id) ->
      @view_apply "app/views/contrib/item.html",
        _layouts:
          _body: {loader : new contrib(), filter : {id : id}}

  Controller : ContribController