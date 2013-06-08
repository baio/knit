define ["ural/bindings/tag-edit"], ->


  ko.bindingHandlers.tageditWithScheme =

    init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
      _opts = allBindingsAccessor().tageditOpts
      _opts ?= {}
      _opts.filterParams =
        index: ->
          opts = allBindingsAccessor().tageditOpts
          opts.scheme.index
        type: ->
          opts = allBindingsAccessor().tageditOpts
          opts.scheme.type.join(",")
      _opts.getDefault = (label) ->
        opts = allBindingsAccessor().tageditOpts
        key: label
        label: label
        value: label
        data:
          key: label
          label: label
          val: label
          type: opts.scheme.default_type

      ko.bindingHandlers.tagedit.init element, valueAccessor, allBindingsAccessor, viewModel

    update: (element, valueAccessor, allBindingsAccessor) ->
      ko.bindingHandlers.tagedit.update element, valueAccessor, allBindingsAccessor
