define [
        "ural/vm/itemVM"
        "app/dataProvider"
        "ural/modules/pubSub",
]
, (itemVM, dataProvider, pubSub) ->

  class Graph extends itemVM

    constructor: (resource, _index) ->
      @ref = ko.observable()
      @name = ko.observable()
      @date = ko.observable()
      super "graph", _index

    onCreateItem: ->
      new Graph @resource, @_index

    onCreate: (done) ->
      data = @toData()
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
