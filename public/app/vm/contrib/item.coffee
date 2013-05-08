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
          message: 'Таг \'семья\' должен содержать только прописные, кирилические символы.'
          params: '^[а-я]+$'
      @private_rel = ko.observable().extend
        pattern:
          message: 'Таг \'частные\' должен содержать только прописные, кирилические символы.'
          params: '^[а-я]+$'
      @prof_rel = ko.observable()
        .extend
          pattern:
            message: 'Таг \'проффесиональные\' должен содержать только прописные, кирилические символы.'
            params: '^[а-я]+$'
      @_id = ko.observable().extend
        validation:
          validator: =>
            @family_rel() or @private_rel() or @prof_rel()
          message : "Один из тагов должен быть выбран."
          params : [@family_rel, @prof_rel, @priv_rel]
      @isModifyed = ko.observable()
      super resource, index
