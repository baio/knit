define ["ural/vm/itemVM"], (itemVM) ->

  class ItemVM extends itemVM

    constructor: ->
      @name_1 = ko.observable().extend(required : {message : "name_1 is required."})
      @name_2 = ko.observable().extend(required : {message : "name_2 is required."})
      @family_rel = ko.observable()
      @private_rel = ko.observable()
      @prof_rel = ko.observable()
      @id = ko.observable().extend
        validation:
          validator: =>
            @family_rel() or @private_rel() or @prof_rel()
          message : "One of the relations, should be defined."
          params : [@family_rel, @prof_rel, @priv_rel]
