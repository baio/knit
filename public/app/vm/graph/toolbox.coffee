define ["app/dataProvider"], (dataProvider) ->

  class Toolbox

    constructor: (@nav, @panel)->

    save: ->
      dataProvider.ajax "graphs", "post", {contrib: @nav.activeContrib().ref(), data : @panel.toData()}, ->