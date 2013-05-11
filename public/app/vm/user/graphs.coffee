define ["ural/vm/indexVM", "app/vm/user/graph"]
, (indexVM, Graph) ->


  class Graphs extends indexVM

    constructor: (@contribs) ->
      super "graph"

    onCreateItem: ->
      new Graph @resource, @, @contribs
