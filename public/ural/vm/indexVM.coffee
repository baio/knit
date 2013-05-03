define ["ural/vm/itemVM", "ural/modules/pubSub"], (itemVM, pubSub) ->

  class ViewModel

    constructor: (@resource, @parentItem) ->
      @list = ko.observableArray()
      pubSub.sub "crud", "complete_create", (item) => @completeCreate item
      pubSub.sub "crud", "complete_delete", (item) => @completeDelete item

    completeDelete: (item) ->
      if item.resource == @resource
        @list.remove item.src.item
      if @parentItem
        @parentItem.startEdit()

    completeCreate: (item) ->
      if item.resource == @resource
        item.setSrc null, null
        @list.push item
      if @parentItem
        @parentItem.startEdit()

    map: (data) ->
      underlyingArray = @list()
      underlyingArray.splice 0, underlyingArray.length
      underlyingArray.push(@createItem(d)) for d in data
      @list.valueHasMutated()

    load: (done) ->
      @onLoad (err, data) =>
        if !err
          @map data
        done err, @

    onLoad: (done) ->
      done null, []

    createItem: (data, status) ->
      vm = @onCreateItem()
      if data
        vm.map data
      if status
        vm.setSrc null, status
      vm

    onCreateItem: ->
      new itemVM @resource, @parentItem

    startCreate: (some, event) ->
      event.preventDefault()
      pubSub.pub "crud", "start_create", @createItem(null, "create")
