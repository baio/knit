define ["ural/vm/indexVM",
        "ural/vm/itemVM"
        "app/dataProvider"
]
, (indexVM, itemVM, dataProvider) ->

  class Contrib extends itemVM

    constructor: ->
      @id = ko.observable()
      @name = ko.observable()
      @url = ko.observable()
      super "contrib"

    onCreate: (done) ->
      data = @toData()
      dataProvider.create "contribs", data, done

  class Contribs extends indexVM

    constructor: ->
      super "contrib"

    onCreateItem: ->
      new Contrib()
