define ["ural/vm/itemVM"], (itemVM) ->

  class ItemVM extends itemVM

    constructor: (resource, index) ->
      @name_1 = ko.observable().extend
        required:
          message: "Имя 1 должно быть заполнено."
        pattern:
          message: 'Имя 1 должно состоять из имени и фамилии разделенных пробелом.'
          params: '^[а-я]+\\s[а-я]+$'
      @name_2 = ko.observable().extend
        required:
          message: "Имя 2 должно быть заполнено."
        pattern:
          message: 'Имя 2 должно состоять из имени и фамилии разделенных пробелом.'
          params: '^[а-я]+\\s[а-я]+$'
      @family_rel = ko.observable().extend
        pattern:
          message: 'Связь \'семья\' должна содержать только прописные, кирилические символы.'
          params: '^[а-я]+$'
      @private_rel = ko.observable().extend
        pattern:
          message: 'Связь \'частные\' должна содержать только прописные, кирилические символы.'
          params: '^[а-я]+$'
      @prof_rel = ko.observable()
        .extend
          pattern:
            message: 'Связь \'професиональные\' должна содержать только прописные, кирилические символы.'
            params: '^[а-я]+$'
      @_id = ko.observable().extend
        validation:
          validator: =>
            @family_rel() or @private_rel() or @prof_rel()
          message : "Одна из связей должна быть выбрана."
          params : [@family_rel, @prof_rel, @priv_rel]
      @isModifyed = ko.observable()
      @_isRemoved = ko.observable()
      super resource, index
