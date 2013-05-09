define ["ural/vm/indexVM"
        "ural/vm/itemVM"
        "app/dataProvider"
        "ural/modules/pubSub"
]
, (indexVM, itemVM, dataProvider, pubSub) ->

  class Contrib extends itemVM

    constructor: (resource, _index) ->
      @id = ko.observable()
      @name = ko.observable()
      @url = ko.observable()
      super "contrib", _index

    onCreateItem: ->
      new Contrib @resource, @_index

    onCreate: (done) ->
      data = @toData()
      dataProvider.create "contribs", data, done

    onRemove: (done) ->
      data = @toData()
      dataProvider.ajax "contribs", "delete", data, done

    create: (done) ->
      super (err) =>
        done err
        if !err
          pubSub.pub "href", "change", href: "/contrib/item/#{@ref()}"

  class Contribs extends indexVM

    constructor: ->
      super "contrib"

    onCreateItem: ->
      new Contrib @resource, @
