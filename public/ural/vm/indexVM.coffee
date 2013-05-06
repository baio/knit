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

    add: (data, idx) ->
      item = @createItem data
      idx = @list().length - 1 if idx is not undefined
      @list.splice idx, 0, item

    map: (data) ->
      underlyingArray = @list()
      underlyingArray.splice 0, underlyingArray.length
      underlyingArray.push(@createItem(d)) for d in data
      @list.valueHasMutated()
      #activate isModifyed behaviour after first map
      if ko.isObservable(@isModifyed) and !@_isModifyedActivated
        @activateIsModifyed()
        @_isModifyedActivated = true

    load: (done) ->
      @onLoad (err, data) =>
        if !err
          @map data
        done err, @

    onLoad: (done) ->
      done null, []

    save: ->
      @update ->

    update: (done) ->
      res = []
      list = if @_isModifyedActivated then @getModifyedItems() else @list()
      for item in list
        if item.toData
          res.push item.toData()
        else
          res.push item
      @onUpdate res, (err) ->
        if !err
          for item in list
            item.startEdit()
        done err

    onUpdate: (data, done) ->
      done null

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
      pubSub.pub "crud", "start_create", @createItem(@resource, "create")

    activateIsModifyed: ->
      for item in @list()
        item.activateIsModifyed()
        item.isModifyed.subscribe (val) =>
          @isModifyed(val or @getIsModifyed())

    getIsModifyed: ->
      for item in @list()
        if item.isModifyed()
          return true
      return false

    getModifyedItems: ->
      res = []
      for item in @list()
        if item.isModifyed()
          res.push item
      res