define ["app/dataProvider"], (dataProvider) ->

  class Toolbox

    constructor: (@nav, @panel)->
      @name_src = ko.observable()
      @name_tgt = ko.observable()
      @tags = ko.observableArray()
      @url_src = ko.computed => "https://www.google.ru/search?q=#{@name_src()}"
      @url_tgt = ko.computed => "https://www.google.ru/search?q=#{@name_tgt()}"
      @panel.onHoverEdge = (edge) =>
        @name_src edge.source.name
        @name_tgt edge.target.name
        @tags edge.tags

    save: ->
      dataProvider.ajax "graphs", "post", {contrib: @nav.activeContrib().id, data : @panel.toData()}, ->