define ["ural/modules/pubSub", "app/vm/user/user"], (pubSub, user) ->


  class Menu

    constructor: ->

      @active = ko.observable()
      @activeContrib = ko.observable("Choose graph")

      pubSub.sub "href", "changed", (data) =>
        @active "/" + data.controller + "/" + data.action

      @user = new user()


    load: (filter, done) ->
      @user.load filter, (err) =>
        done err, @

