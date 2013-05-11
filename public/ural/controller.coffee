define ["ural/viewEngine",
        "ural/modules/pubSub"],
(viewEngine, pubSub) ->

  class Controller

    constructor: (@viewModel) ->

      if viewModel
        ko.applyBindings viewModel, $("#_body")[0]

      #TODO: crudStart - static?
      if !Controller.IsSubscribed
        Controller.IsSubscribed = true
        pubSub.sub "crud", "start", (params) => @crudStart params
        pubSub.sub "crud", "end", (params) => @crudEnd params

    @IsSubscribed: false

    crudStart: (params) ->
      @showForm params.resource, params.type, params.item

    crudEnd: (params) ->
      if !params.err
        @hideForm params.resource, params.type
      if params.err
        notifyType = "error"
        msg = params.err
      else if params.msg
        notifyType = "success"
        msg = params.msg
      if notifyType
        @notify msg, null, notifyType

    notify: (msg, caption, type) ->
      toastr[type] msg, caption

    showForm: (resource, formType, item) ->
      form = $("[data-form-type='"+formType+"'][data-form-resource='"+resource+"']")
      if !form[0] then throw "Required form not implemented"
      ko.applyBindings item, form[0]
      form.modal("show").on("hidden", ->
        ko.cleanNode form[0]
        $("[data-view-engine-clean]", form[0]).empty()
      )

    hideForm: (resource, formType) ->
      form = $("[data-form-type='"+formType+"'][data-form-resource='"+resource+"']")
      form.modal "hide"

    _loadLayoutModel: (layoutModel, done) ->
      if $.isFunction(layoutModel.load)
        layoutModel.load null, done
      else if layoutModel.loader
        layoutModel.loader.load layoutModel.filter, done
      else
        done null, layoutModel

    _loadLayoutModels: (layoutModels, done) ->
      lms = []
      layouts = []
      for own prop of layoutModels
        layouts.push prop
        lms.push layoutModels[prop]
      async.map lms, @_loadLayoutModel, (err, data) ->
        lmd = []
        if !err
          for i in [0..lms.length-1]
            lm = lms[i]
            lm = lm.loader if lm.loader
            lmd.push layout : layouts[i], lm : lm, data : data[i]
        done err, lmd

    #**Load data, render view**
    #
    # Data and model loading are going in parallel
    #
    #+ If `path` is presented, view loaded from file and then added to html layout (`_body` tag)
    #+ If `path` is not presnted, skip view loading
    #+ If `model` presented
    # `model` is considered in form `_layout : {_lt1 : model1, _lt2 : model2}`, where _lt is the name of the `html`
    # layout (tag with `id` = `_lt`), if `model` doesn't contain `_layout` field it would be initilized by default with
    # `_layout : {_body : model}` - consider this model for `_body` tag
    # Model for each layout will be loaded separatedly by following rules:
    #  + check if it contains `load` method, if so invoke `model.load( callback(err, data) )`
    #  + check if it contains `render` method, if so invoke `model.render( data )`
    #+ If `model` is not presnted, skip model loading
    #+ If `model` doesn't contain `load` method, consider it simple `object` model (just `data`)
    #`[isApply]` - not required, if presented and `true` then `data` will be applied to the view (see `viewEngine.applyData)
    #`[done]` - not required, if presented will be invoked as `done(err, data)`
    view: (path, model, isApply, done) ->
      done = isApplay if $.isFunction(isApply)
      async.parallel [
        (ck) ->
          if path
            viewEngine.render(path, ck)
          else
            ck null
        (ck) =>
          layoutModels = if model._layouts then model._layouts else _body : model
          @_loadLayoutModels layoutModels, ck
        ], (err, res) =>
            if !err
              html = res[0]
              layoutModelsData = res[1]
              viewEngine.applyData(html, layoutModelsData, @viewBag, isApply)
              for lmd in layoutModelsData
                if lmd.lm and $.isFunction(lmd.lm.render)
                  lmd.lm.render lmd.data
            if done then done err

    #Shortcut for view(path, model, `True`, done)
    view_apply: (path, model, done) ->
      @view path, model, true, done

  Controller : Controller