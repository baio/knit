define ["ural/modules/pubSub"], (pubSub) ->

  class ViewModel

    constructor: (@resource, @_index) ->
      @init()

    @KeyFieldName: null

    _isAdded: ->
      if ViewModel.KeyFieldName then (@[ViewModel.KeyFieldName]() is null) else false

    init: ->
      # `ko.mapping.toJS` - works only after `ko.mapping.fromJS` was executed
      data = {}
      for own prop of @
        if ko.isObservable @[prop]
          data[prop] = null
      ko.mapping.fromJS data, {}, @

    completeUpdate: (data, skipStratEdit) ->
      if @src
        #item was in edit mode
        @src.item.map data, skipStratEdit
      else
        #direct update
        @map data, skipStratEdit

    completeCreate: (data) ->
      if @_index then @_index.add data, 0
      @setSrc null, null
      @map data

    completeRemove: ->
      if @src.item._index
        @src.item._index.list.remove @src.item
      @setSrc null, null

    map: (data) ->

      data = data[0] if $.isArray()
      dataIndexVM = {}

      #exclude index view models from mapping
      for own prop of @
        #TO DO: change property check to instanceof ItemVM (Circular Dependencies problem)
        if @[prop] and data[prop] and @[prop].list
          dataIndexVM[prop] = data[prop]
          delete data[prop]

      #convert fields to js dates
      for own prop of data
        d = @tryDate data[prop]
        data[prop] = d if d

      ko.mapping.fromJS data, {}, @

      #map index view models now
      for own prop of dataIndexVM
        @[prop].map dataIndexVM[prop]

      @errors = ko.validation?.group @

    tryDate: (str) ->
      if str and typeof str == "string"
        match = /\/Date\((\d+)\)\//.exec str
        if match
          moment(str).toDate()

    clone: (status) ->
      vm = @onCreateItem()
      vm.map @toData()
      vm.setSrc @, status
      vm

    onCreateItem: ->
      new ViewModel @resource, @_index

    setSrc: (item, status) ->
      @src =
        item : item
        status : status

    cancel: (item, event) ->
      event.preventDefault()
      pubSub.pub "crud", "end",
        resource : @resource
        type: @src.status

    confirmEvent: (event, eventName) ->
      if !event then return true
      attr = $(event.target).attr "data-bind-event"
      !attr or attr == eventName

    startUpdate: (item, event) ->
      if @confirmEvent event, "startUpdate"
        event.preventDefault()
        pubSub.pub "crud", "start",
          resource: @resource
          item: @clone "update"
          type: "update"

    startRemove: (item, event) ->
      if @confirmEvent event, "startRemove"
        event.preventDefault()
        pubSub.pub "crud", "start",
          resource: @resource
          item: @clone "delete"
          type: "delete"

    remove: ->
      if ko.isObservable(@_isRemoved)
        @_isRemoved true
      else
        @onRemove (err) =>
          @completeRemove()
          pubSub.pub "crud", "end",
            err: err
            type: "delete"
            msg: "Success"
            resource: @resource

    onRemove: (done)->
      done()

    details: (item, event) ->
      if @confirmEvent event, "details"
        event.preventDefault()
        pubSub.pub "crud", "details", item : @clone "details"

    startEdit: (data, event) ->
      f = @confirmEvent event, "start-edit"
      if f
        console.log "REAL start edit - store src"
        @stored_data = @toData()
        if ko.isObservable(@_isModifyed)
          @updateIsModifyed @getIsModifyed()
          if !@_isModifyedActivated
            @activateIsModifyed()
            @_isModifyedActivated = true
      f

    updateIsModifyed: (val) ->
      if @_isModifyed() != val
        @onIsModifyedChanged val

    onIsModifyedChanged: (val) ->
      @_isModifyed val

    cancelEdit: (data, event) ->
      f = @confirmEvent event, "cancel-edit"
      if f and @stored_data
        console.log "REAL cancel edit - map from src"
        @map @stored_data, true
      f


    setErrors: (errs) ->
      for err in errs
        flag = false
        #check if not exists
        rule = @[err.field].rules().filter((f) -> f.params == "custom")[0]
        if rule then @[err.field].rules.remove rule
        @[err.field].extend
          validation:
            params: "custom"
            validator: (val, otherVal) ->
              _flag = flag
              flag = true
              _flag
            message:
              err.message

    toData: ->
      data = ko.mapping.toJS @
      #map children list properties
      for own prop of @
        #TO DO: change property check to instanceof ItemVM (Circular Dependencies problem)
        #if property name starts with _, this is private property, don't map (recursive index <-> item problem)
        if prop.indexOf("_") != 0 and @[prop] and @[prop].list
          data[prop] = @[prop].list().map (m) -> m.toData()
        else if prop == "_isModifyed" or prop == "_isAdded"
          delete data[prop]
      data

    activateIsModifyed: ->
      for own prop of @
        if prop != "isModifyed" and ko.isObservable @[prop]
          @[prop].subscribe =>
            @updateIsModifyed (@_isRemoved() or @isValid()) and @getIsModifyed()

    getIsModifyed: ->
      if !@stored_data then return false
      for own prop of @stored_data
        val = ko.utils.unwrapObservable(@[prop])
        if @_isAdded() or @_isRemoved()
            return not (@_isAdded() and @_isRemoved())
        if  val != @stored_data[prop] then return true
      return false

    save: ->
      status = @src.status
      _done = (err) =>
        pubSub.pub "crud", "end",
          resource: @resource
          type: status
          err: err
          msg: "Success"
      if status == "create"
        @create _done
      else if status == "update"
        @update _done
      else
        throw new Error("Item not in edit state")

    create: (done) ->
      @onCreate (err, data) =>
        if !err
          @completeCreate data
        done err

    onCreate: (done) ->
      done()

    update: (done) ->
      @onUpdate (err, data) =>
        if !err
          @completeUpdate data
        done err

    onUpdate: (done) ->
      done()

    load: (filter, done) ->
      @onLoad filter, (err, data) =>
        if !err and data
          @map data
        done err, @

    onLoad: (filter, done) ->
      done null, []
