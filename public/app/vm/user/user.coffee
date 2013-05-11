define ["ural/vm/itemVM",
        "app/vm/user/contribs",
        "app/vm/user/graphs",
        "app/dataProvider"
]
, (indexVM, contribs, graphs, dataProvider) ->

  class User extends indexVM

    constructor: ->
      @name = ko.observable("baio")
      @contribs = new contribs()
      @graphs = new graphs(@contribs)

    onLoad: (filter, done) ->
      dataProvider.get "users", filter, done
