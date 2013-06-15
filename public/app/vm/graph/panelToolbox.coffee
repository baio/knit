define ->

  class PanelToolbox

    constructor: (@nav, @panel)->
      @isShown = ko.observable(false)
      @colorScheme = ko.observable(0)
      @colorSchemesList = ko.observableArray([
        {key: 0, val: "Темная"}
        {key: 1, val: "Светлая"},
      ])
      @colorScheme.subscribe((val) =>
        if val == 0
          $("#_body").removeClass("light")
          $("#show_toolbox_panel_button").css(color: "white")
          @panel.updateText("text")
        if val == 1
          $("#show_toolbox_panel_button").css(color: "black")
          $("#_body").addClass("light")
          @panel.updateText("text light")
      )

    hide: ->
      @isShown false

    show: ->
      @isShown true