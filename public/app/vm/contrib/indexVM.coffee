define ["ural/vm/indexVM", "app/vm/contrib/itemVM"], (indexVM, itemVM) ->

  class IndexVM extends indexVM

    onCreateItem: ->

      new itemVM()

    onLoad: (done)->

      done null,
        [{id : 'elena_skrinnik', name : 'elena skrinnik', family_rel : "father", private_rel : null, prof_rel : "employee" }]


