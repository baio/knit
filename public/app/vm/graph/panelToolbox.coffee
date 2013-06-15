define ->

  class PanelToolbox

    constructor: (@nav, @panel)->
      @isShown = ko.observable(false)

    hide: ->
      @isShown false

    show: ->
      @isShown true