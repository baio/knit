define ["ural/vm/indexVM",
        "ural/vm/itemVM"
        "app/dataProvider"
]
, (indexVM, itemVM, dataProvider) ->

  class Contrib extends itemVM

    constructor: (resource, _index) ->
      @id = ko.observable()
      @name = ko.observable()
      @url = ko.observable()
      super "contrib", _index

    onCreate: (done) ->
      data = @toData()
      dataProvider.create "contribs", data, done

    onRemove: (done) ->
      data = @toData()
      dataProvider.ajax "contribs", "delete", data, done

  class Contribs extends indexVM

    constructor: ->
      super "contrib"

    onCreateItem: ->
      new Contrib "contrib", @
