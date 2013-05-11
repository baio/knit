define ["ural/modules/pubSub", "app/vm/user/user"], (pubSub, user) ->


  class Menu

    constructor: ->

      @active = ko.observable()
      @activeGraph = ko.observable(id: null, name: "Choose graph")

      pubSub.sub "href", "changed", (data) =>
        @active "/" + data.controller + "/" + data.action

      @user = new user()


    load: (filter, done) ->
      @user.load filter, (err) =>
        done err, @

