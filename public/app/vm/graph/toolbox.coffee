define ["app/dataProvider"], (dataProvider) ->

  class Toolbox

    constructor: (@panel)->

    save: ->
      dataProvider.ajax "graphs", "post", @panel.toData(), ->