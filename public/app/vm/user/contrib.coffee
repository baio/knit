define [
        "ural/vm/itemVM"
        "app/dataProvider"
        "ural/modules/pubSub"
]
, (itemVM, dataProvider, pubSub) ->

  class Contrib extends itemVM

    constructor: (resource, _index) ->
      @ref = ko.observable()
      @name = ko.observable()
      @url = ko.observable()
      @isSelected = ko.observable()
      super "contrib", _index

    onCreateItem: ->
      new Contrib @resource, @_index

    onCreate: (done) ->
      data = @toData()
      if @_index._graph then data.graph_ref = @_index._graph.ref()
      dataProvider.ajax "contribs", "post", data, done

    onRemove: (done) ->
      data = @toData()
      dataProvider.ajax "contribs", "delete", data, done

    onUpdate: (done) ->
      data = @toData()
      dataProvider.ajax "contribs", "put", data, done

    create: (done) ->
      super (err) =>
        done err
        if !err
          @openContrib()

    openContrib: ->
      pubSub.pub "href", "change", href: "/contrib/item/#{@ref()}"

