define ["ural/vm/itemVM", "app/dataProvider"], (itemVM, dataProvider) ->

  class ItemVM extends itemVM

    constructor: (resource, index) ->
      @name_1 = ko.observable("").extend
        required:
          message: "Имя 1 должно быть заполнено."
        pattern:
          message: 'Имя 1 должно состоять из имени и фамилии разделенных пробелом.'
          params: '^\\s*[А-Я]?[а-я]+\\s+[А-Я]?[а-я]+\\s*$'
      @name_2 = ko.observable("").extend
        required:
          message: "Имя 2 должно быть заполнено."
        pattern:
          message: 'Имя 2 должно состоять из имени и фамилии разделенных пробелом.'
          params: '^\\s*[А-Я]?[а-я]+\\s+[А-Я]?[а-я]+\\s*$'
      @relations = ko.observableArray([])
      @date = ko.observable()
      @dateTo = ko.observable()
      @url = ko.observable()
      @source = ko.observable()
      @scheme = ko.observable()
      @_id = ko.observable()
      #@_isModifyed = ko.observable()
      #@_isRemoved = ko.observable()
      @_scheme = ko.computed =>
        res = index.schemes.filter((f) => f["_id"] == @scheme())[0]
        res ?= {}
        console.log res
        return res
      @_availableSchemes = ko.observableArray(
        [{id: "person-person.ru", label: "Персона - Персона"},
         {id: "person-org.ru", label: "Персона - Организация"},
         {id: "org-org.ru", label: "Организация - Организация"}])
      @scheme.subscribe (val) =>
        if val
          @_readOnly false
        else
          @_readOnly true

      @_readOnly = ko.observable(true)
      super resource, index

    onCreate: (done) ->
      data =
        id: @_index.contrib.ref()
        items: [@toData()]
      dataProvider.ajax "contribs", "patch", data, (err, data) =>
        if !err
          @_id data.data[0]._id
        #we don't wont map item from response here, since responce doesn't return item content
        done err, null

    onUpdate: (done) ->
      data =
        id: @_index.contrib.ref()
        items: [@toData()]
      dataProvider.ajax "contribs", "patch", data, (err, data) ->
        #we don't wont map item from response here, since responce doesn't return item content
        done err, null

    onRemove: (done) ->
      item = @toData()
      item._isRemoved = true
      data =
        id: @_index.contrib.ref()
        items: [item]
      dataProvider.ajax "contribs", "patch", data, done

    onGetRemoveType: -> "update"

    onCreateItem: ->
      new ItemVM @resource, @_index
