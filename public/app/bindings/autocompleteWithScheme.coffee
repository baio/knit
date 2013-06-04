define ["ural/bindings/autocomplete"], (autocomplete) ->


  ko.bindingHandlers.autocompleteWithScheme =

    init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
      _opts = allBindingsAccessor().autocompleteOpts
      _opts ?= {}
      _opts.filterParams = {index: (-> _opts.scheme.index), type: (-> _opts.scheme.type)}
      ko.bindingHandlers.autocomplete.init element, valueAccessor, allBindingsAccessor, viewModel
      opts = allBindingsAccessor()
      console.log opts.autocompleteOpts.scheme

    update: (element, valueAccessor, allBindingsAccessor) ->
      ko.bindingHandlers.autocomplete.update element, valueAccessor, allBindingsAccessor


