define ["ural/vm/indexVM",
  "app/vm/contrib/item",
  "app/dataProvider"
]
, (indexVM, itemVM, dataProvider) ->

  class IndexVM extends indexVM

    constructor: ->
      @ref = ko.observable()
      @name = ko.observable()
      @date = ko.observable()
      @url = ko.observable()
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
      @add _id : null,  name_1 : null, name_2 : null, family_rel : null, private_rel : null, prof_rel : null
      $("#items_list .name-input:eq(0)").focus()
      Mousetrap.bind ['tab'], (e) =>
        #more handy would make this via handler
        #check if this is top row of the list
        idx = $("#items_list>:first-child").index($(e.target).closest(".row-fluid"))
        if idx == 0
          item = @list()[0]
          if item.isValid() #item.name_1() and item.name_2()
            @add _id : null,  name_1 : null, name_2 : null, family_rel : null, private_rel : null, prof_rel : null
            $("#items_list .name-input:eq(0)").focus()
            return false
        true