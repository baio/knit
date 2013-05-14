define ["ural/vm/itemVM"
        "app/dataProvider"
        "ural/modules/pubSub"
]
, (ItemVM, dataProvider, pubSub) ->

  class User extends ItemVM

    constructor: ->
      @_id = ko.observable()
      @name = ko.observable()
      @graphs = ko.observableArray()
      @popular = ko.observableArray()

    open: (data, event) ->
      event.preventDefault()
      pubSub.pub "href", "change", href: "/graph/panel/#{data.ref()}"

    onLoad: (filter, done) ->
      dataProvider.get "curUser", filter, (err, data) =>
        if !err
          ko.mapping.fromJS data, {}, @
        else if err.code == 401
          err = null
          data = null
        done err, data

