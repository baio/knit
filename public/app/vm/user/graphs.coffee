define ["ural/vm/indexVM", "app/vm/user/graph"]
, (indexVM, Graph) ->


  class Graphs extends indexVM

    constructor: ->
      super "graph"

    onCreateItem: ->
      new Graph @resource, @
