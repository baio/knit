define ["ural/modules/pubSub"], (pubSub) ->


  class Menu

    constructor: ->

      @active = ko.observable()

      pubSub.sub "href", "changed", (data) =>
        @active "/" + data.controller + "/" + data.action

  Menu : Menu
