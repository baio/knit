define ["ural/vm/itemVM",
        "app/vm/user/contribs",
        "app/dataProvider"
]
, (indexVM, contribs, dataProvider) ->

  class User extends indexVM

    constructor: ->
      @name = ko.observable("baio")
      @contribs = new contribs()

    onLoad: (done)->
      done(null, @)
