define [
        "ural/vm/itemVM"
        "app/dataProvider"
        "ural/modules/pubSub"
        "app/vm/user/pushes"
        "app/vm/user/pulls"
]
, (itemVM, dataProvider, pubSub, Pushes, Pulls) ->

  class Graph extends itemVM

    constructor: (resource, _index, @_contribs) ->
      @ref = ko.observable()
      @name = ko.observable().extend
        required:
          message: "Имя должно быть заполнено."
        minLength:
          message: "Имя должно сотоять как минимум из 3-х символов."
          params: 3
      @date = ko.observable()
      @contribs = ko.observableArray()
      @pushes = new Pushes(@)
      @pulls = new Pulls(@)
      super "graph", _index

    map: (data, skipStratEdit) ->
      super data, skipStratEdit
      for contrib in @_contribs.list()
        if @contribs()
          contrib.isSelected @contribs().filter((f) -> f == contrib.ref()).length
        else
          contrib.isSelected false

    onCreateItem: ->
      new Graph @resource, @_index, @_contribs

    onCreate: (done) ->
      data = name: @name(), contribs: @_contribs.list().filter((f) -> f.isSelected()).map((m) -> m.ref())
      dataProvider.ajax "graphs", "post", data, done

    onRemove: (done) ->
      data = @toData()
      dataProvider.ajax "graphs", "delete", data, done

    onUpdate: (done) ->
      data = id: @ref(), name: @name(), contribs: @_contribs.list().filter((f) -> f.isSelected()).map((m) -> m.ref())
      dataProvider.ajax "graphs", "put", data, done

    create: (done) ->
      super (err) =>
        done err
        if !err
          @openGraph()

    open: (data, event)->
      event.preventDefault()
      pubSub.pub "href", "change", href: "/graph/panel/#{@ref()}"
