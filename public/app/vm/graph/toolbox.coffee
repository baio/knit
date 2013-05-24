define ->

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
      @panel.onClickEdge = (edge) ->
        pos = d3.mouse(@)
        console.log pos
        offset = $("#_body").offset()
        x = pos[0] - $("body").scrollLeft() - offset.left
        y = pos[1] - $("body").scrollTop() - offset.top
        console.log x
        console.log y
        $("#_toolbox").css(left : x, top: y)
        console.log $("#_toolbox").offset()


    moveToConner: (data, event) ->
      event.preventDefault()
      $("#_toolbox").css(left : '', top: '')
