define ["ural/vm/indexVM",
  "app/vm/contrib/item",
  "app/dataProvider"
]
, (indexVM, itemVM, dataProvider) ->

  class IndexVM extends indexVM

    constructor: ->
      @defItem = _id : null,  name_1 : null, name_2 : null, family_rel : null, private_rel : null, prof_rel : null
      @ref = ko.observable()
      @name = ko.observable()
      @date = ko.observable()
      @url = ko.observable()
      @editItem = new itemVM("contrib")
      @editItem.map(@defItem)
      @isModifyed = ko.observable()
      super "contrib"

    onCreateItem: ->
      new itemVM(@resource, @)

    onLoad: (filter, done)->
      dataProvider.get "contribs", filter, (err, data) =>
        if !err
          @ref data.ref
          @name data.name
          @date data.date
          @url data.url
          done err, data.items
        else
          done null

    onUpdate: (data, done) ->
      d = {id: @ref(), items: data}
      dataProvider.ajax "contribs", "patch", d, (err, data) ->
        done err, data

    render: ->
      @startEdit()
      Mousetrap.bind ['tab'], (e) =>
        if $(e.target).attr("id") == "append_item_trigger"
          @editItem.prof_rel($(e.target).val())
          if @editItem.isValid()
            @add @editItem.toData(), 0
            @editItem.map(@defItem)
            $("#append_item_focus").focus()
          return false
        return true
