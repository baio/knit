define ["ural/bindings/tag-edit"], ->


  ko.bindingHandlers.tageditWithScheme =

    init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
      _opts = allBindingsAccessor().tageditOpts
      _opts ?= {}
      _opts.filterParams = {index: (-> _opts.scheme.index), type: (-> _opts.scheme.type.join(","))}
      _opts.getDefault = (label) ->
        key: label
        label: label
        value: label
        data:
          key: label
          label: label
          val: label
          type: _opts.scheme.default_type

      ko.bindingHandlers.tagedit.init element, valueAccessor, allBindingsAccessor, viewModel

    update: (element, valueAccessor, allBindingsAccessor) ->
      ko.bindingHandlers.tagedit.update element, valueAccessor, allBindingsAccessor
