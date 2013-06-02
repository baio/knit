define ->

  ko.bindingHandlers.datetime =

    init: (element, valueAccessor, allBindingsAccessor) ->
      #initialize datepicker with some optional options
      if valueAccessor().extend and valueAccessor().extend().rules
        dminRule = valueAccessor().extend().rules().filter((f) -> f.rule == "min")[0]
        minDate = moment(dminRule.params).toDate() if dminRule
        dmaxRule = valueAccessor().extend().rules().filter((f) -> f.rule == "max")[0]
        maxDate = moment(dmaxRule.params).toDate() if dmaxRule

      opts = allBindingsAccessor().datetimeOpts

      dateFormat = if opts and opts.dateFormat then opts.dateFormat else "dd.mm.yy"

      $(element).datepicker
          minDate: minDate
          maxDate: maxDate
          dateFormat: dateFormat
          beforeShow: (el) ->
            return if $(el).attr('readonly') then false else true

      #handle the field changing
      ko.utils.registerEventHandler element, "change", ->
        observable = valueAccessor()
        date = $(element).datepicker "getDate"
        observable date

      #handle disposal (if KO removes by the template binding)
      ko.utils.domNodeDisposal.addDisposeCallback element, ->
        $(element).datepicker "destroy"

    update: (element, valueAccessor) ->
      value = ko.utils.unwrapObservable(valueAccessor())
      $(element).datepicker "setDate", if value then value else null
      valueAccessor()($(element).datepicker "getDate")

  _setDate = (element, date, format) ->
    format ?= "DD MMMM YYYY"
    $(element).text if date then moment(date).format(format) else ""

  ko.bindingHandlers.displaydate =
    init: (element, valueAccessor, allBindingsAccessor) ->
      option = allBindingsAccessor().ddateOpts
      format =  option.format if option
      valAccessor = valueAccessor()
      _setDate element, ko.utils.unwrapObservable(valAccessor), format
      if ko.isObservable valAccessor
        valAccessor.subscribe (newValue) ->
          _setDate element, newValue, format

  ko.bindingHandlers.validationCss =

    init: (element, valueAccessor) ->
      observable = valueAccessor()
      f = false
      _setClass = (val) ->
        if !val
          $(element).addClass "error"
        else
          $(element).removeClass "error"

      observable.isModified.subscribe ->
        f = true
        _setClass observable.isValid()

      observable.isValid.subscribe (val) ->
        #skip first apperance
        if f then _setClass val

      ko.utils.domNodeDisposal.addDisposeCallback element, ->
        $(element).removeClass "error"

  ko.bindingHandlers.validation =

    init: (element, valueAccessor, allBindingsAccessor) ->
      all = allBindingsAccessor()
      prop =
        if all.value
          all.value
        else if all.autocomplete
          all.autocomplete
        else if all.datetime
          all.datetime
      if prop
        validation = valueAccessor()
        validation = [validation] if !Array.isArray validation
        for v in validation
          prop.extend v

  ko.bindingHandlers.val =

    init: (element, valueAccessor, allBindingsAccessor) ->
      #http://stackoverflow.com/questions/12643455/knockout-js-extending-value-binding-with-interceptor
      underlyingObservable = valueAccessor()
      valOpts = allBindingsAccessor().valOpts
      #type = if valOpts and valOpts.type then valOpts.type else "int"
      #format = valOpts.format if valOpts and valOpts.type
      $(element).inputmask('decimal', radixPoint : ',', autoUnmask : true, clearMaskOnLostFocus: true )
      interceptor = ko.computed
        read: =>
          val = if ko.isObservable underlyingObservable then underlyingObservable() else underlyingObservable
          if val
            val = val.toString()
            val.replace ".", ","
        write: (val) =>
          fmtVal = parseFloat val.replace ",", "."
          underlyingObservable fmtVal
        deferEvaluation : true
      ko.applyBindingsToNode element, value : interceptor
