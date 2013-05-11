define [
        "ural/vm/itemVM"
        "app/dataProvider"
        "ural/modules/pubSub",
]
, (itemVM, dataProvider, pubSub) ->

  class Graph extends itemVM

    constructor: (resource, _index, @_contribs) ->
      @ref = ko.observable()
      @name = ko.observable()
      @date = ko.observable()
      super "graph", _index
      @contribsToInclude = @_contribs.list().filter((f) -> f.isSelected())

    onCreateItem: ->
      new Graph @resource, @_index, @_contribs

    onCreate: (done) ->
      data = name: @name(), contribs: @_contribs.list().map((m) -> m.ref())
      dataProvider.create "graphs", data, done

    onRemove: (done) ->
      data = @toData()
      dataProvider.ajax "graphs", "delete", data, done

    onUpdate: (done) ->
      data = @toData()
      dataProvider.ajax "graphs", "put", data, done

    create: (done) ->
      super (err) =>
        done err
        if !err
          @openGraph()

    open: (data, event)->
      event.preventDefault()
      pubSub.pub "href", "change", href: "/graph/panel/#{@ref()}"
