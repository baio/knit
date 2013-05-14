define ["ural/vm/itemVM",
        "app/dataProvider"
]
, (ItemVM, dataProvider) ->

  class User extends ItemVM

    constructor: ->
      @_id = ko.observable()
      @name = ko.observable()
      @graphs = ko.observableArray()
      @popular = ko.observableArray()

    onLoad: (filter, done) ->
      dataProvider.get "curUser", filter, (err, data) =>
        if !err
          ko.mapping.fromJS data, {}, @
        else if err.code == 401
          err = null
          data = null
        done err, data

