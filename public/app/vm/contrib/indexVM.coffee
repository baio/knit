define ["ural/vm/indexVM", "app/vm/contrib/itemVM"], (indexVM, itemVM) ->

  class IndexVM extends indexVM

    onCreateItem: ->

      new itemVM()

    onLoad: (done)->

      done null,
        [{id : 'elena_skrinnik', name : 'elena skrinnik', family_rel : "father", private_rel : null, prof_rel : "employee" }]

    render: ->
      Mousetrap.bind ['tab'], (e) =>
        #more handy would make this via handler
        #check if this is top row of the list
        idx = $("#items_list>:first-child").index($(e.target).closest(".row-fluid"))
        if idx == 0
          item = @list()[0]
          if item.name()
            @add id : null,  name : null, family_rel : null, private_rel : null, prof_rel : null
            $("#items_list .name-input:eq(0)").focus()
          false
        else
          true