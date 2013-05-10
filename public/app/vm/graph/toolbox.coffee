define ["app/dataProvider"], (dataProvider) ->

  class Toolbox

    constructor: (@nav, @panel)->

    save: ->
      dataProvider.ajax "graphs", "post", {contrib: @nav.activeContrib().id, data : @panel.toData()}, ->