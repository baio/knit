define ["ural/vm/itemVM",
        "app/vm/user/contribs",
        "app/vm/user/graphs",
        "app/dataProvider",
        "ural/modules/pubSub"
]
, (indexVM, contribs, graphs, dataProvider, pubSub) ->

  class User extends indexVM

    constructor: ->
      @name = ko.observable("baio")
      @contribs = new contribs()
      @graphs = new graphs()

    onLoad: (filter, done) ->
      dataProvider.get "users", filter, done
