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
          @panel.updateText(@_getTextCls())
        if val == 1
          $("#show_toolbox_panel_button").css(color: "black")
          $("#_body").addClass("light")
          @panel.updateText(@_getTextCls())
      )
      @font = ko.observable(0)
      @fontsList = ko.observableArray([
        {key: 0, val: "Маленькие"},
        {key: 1, val: "Большие"},
        {key: 2, val: "Не показывать"}
      ])
      @font.subscribe =>
        @panel.updateText(@_getTextCls())

    _getTextCls: ->
      cls = "text"
      if @colorScheme() == 1
        cls += " light"
      if @font() == 1
        cls += " big"
      else if @font() == 2
        cls += " hidden"
      cls

    hide: ->
      @isShown false

    show: ->
      @isShown true