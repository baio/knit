define ["ural/modules/pubSub", "app/vm/user/user", "app/vm/curUser"], (pubSub, user, curUser) ->


  class Menu

    constructor: ->

      @active = ko.observable()
      @activeGraph = ko.observable(id: null, name: null, isYours: null)

      pubSub.sub "href", "changed", (data) =>
        @active "/" + data.controller + "/" + data.action

      @user = new curUser()
      #@curUser = new curUser()


    load: (filter, done) ->
      @user.load filter, (err) =>
        done err, @
      #@curUser.load filter, (err) ->

