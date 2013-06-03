define ["ural/vm/indexVM",
  "app/vm/contrib/item",
  "app/dataProvider",
  "app/vm/user/contrib"
]
, (indexVM, itemVM, dataProvider, Contrib) ->

  class IndexVM extends indexVM

    constructor: ->
      @defItem = _id : null,  name_1 : null, name_2 : null, family_rel : null, private_rel : null, prof_rel : null
      @scheme = ko.observable()
      @contrib = new Contrib()
      @editItem = new itemVM("contrib")
      @editItem.map(@defItem)
      @_isModifyed = ko.observable()
      super "contrib"

    onCreateItem: ->
      new itemVM(@resource, @)

    onLoad: (filter, done)->
      dataProvider.get "contribs", filter, (err, data) =>
        if !err
          items = data.items
          if data.scheme
            @scheme data.scheme
          delete data.items
          @contrib.map data, true
          done err, items
        else
          done null

    onUpdate: (data, done) ->
      d = {id: @contrib.ref(), items: data}
      dataProvider.ajax "contribs", "patch", d, (err, data) ->
        if !err
          data = data.data
        done err, data

    render: ->

      _appendRow = =>
        if @editItem.isValid()
          @add @editItem.toData(), 0
          @editItem.map(@defItem)
          $("#append_item_focus").focus()
          return false
        else
          return true

      @editItem.startEdit()
      @startEdit()

      Mousetrap.bind ['ctrl+s'], (e) =>
        $(e.target).blur()
        $(e.target).focus()
        @save()
        return false
      Mousetrap.bind ['ctrl+a'], (e) =>
        if $(e.target).closest("tr").attr("id") == "append_row"
          return _appendRow()
        else
          return true
      Mousetrap.bind ['tab'], (e) =>
        if $(e.target).attr("id") == "append_item_trigger"
          @editItem.prof_rel($(e.target).val())
          return _appendRow()
        else if $(e.target).hasClass "edit_item_trigger"
          return @editItem.isValid()
        return true
