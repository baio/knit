define ["ural/vm/itemVM"], (itemVM) ->

  class ItemVM extends itemVM

    constructor: (resource, index) ->
      @name_1 = ko.observable().extend
        required:
          message: "Имя 1 должно быть заполнено."
        pattern:
          message: 'Имя 1 должно состоять из имени и фамилии разделенных пробелом.'
          params: '^\\s*[А-Я]?[а-я]+\\s+[А-Я]?[а-я]+\\s*$'
      @name_2 = ko.observable().extend
        required:
          message: "Имя 2 должно быть заполнено."
        pattern:
          message: 'Имя 2 должно состоять из имени и фамилии разделенных пробелом.'
          params: '^\\s*[А-Я]?[а-я]+\\s+[А-Я]?[а-я]+\\s*$'
      @family_rel = ko.observable().extend
        pattern:
          message: 'Связь \'семья\' должна содержать только прописные, кирилические символы.'
          params: '^\\s*[а-я]+\\s*$'
      @private_rel = ko.observable().extend
        pattern:
          message: 'Связь \'частные\' должна содержать только прописные, кирилические символы.'
          params: '^\\s*[а-я]+\\s*$'
      @prof_rel = ko.observable()
        .extend
          pattern:
            message: 'Связь \'професиональные\' должна содержать только прописные, кирилические символы.'
            params: '^\\s*[а-я]+\\s*$'
      @_id = ko.observable().extend
        validation:
          validator: =>
            @family_rel() or @private_rel() or @prof_rel()
          message : "Одна из связей должна быть выбрана."
          params : [@family_rel, @prof_rel, @priv_rel]
      @_isModifyed = ko.observable()
      @_isRemoved = ko.observable()
      super resource, index
      @_isEditing = ko.observable()
      @displayMode = =>
        if @_isEditing() then "contrib-edit-item-template" else "contrib-item-template"

    edit: (data, event) ->
      if event then event.preventDefault()
      console.log "just edit"
      if @_isEditing()
        console.log "item in editing state"
        if @cancelEdit data, event
          console.log "cancel edit COMPLETE"
          @_isEditing false
      else
        console.log "item is NOT in editing state"
        if @startEdit data, event
          console.log "start edit COMPLETE"
          @_isEditing true
          $(".edit-item-focus", event.currentTarget).focus()

    onIsModifyedChanged: (val) ->
      console.log "modifyed changed : " + val
      if !val then @_isEditing val
      super val