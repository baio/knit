define ["ural/bindings/autocomplete"], (autocomplete) ->


  ko.bindingHandlers.autocompleteWithScheme =

    init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
      ko.bindingHandlers.autocomplete.init element, valueAccessor, allBindingsAccessor, viewModel
      opts = allBindingsAccessor()
      console.log opts.autocompleteOpts.scheme

    update: (element, valueAccessor, allBindingsAccessor) ->
      ko.bindingHandlers.autocomplete.update element, valueAccessor, allBindingsAccessor


