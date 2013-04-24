define  ["ural/modules/pubSub"], (pubSub) ->

  ko.bindingHandlers.link =

    init: (element) ->

      href = $(element).attr "href"
      href = href.replace /^#/, ""

      $(element).bind "click", (e) ->
        e.preventDefault()
        pubSub.pub "href", "change", href : href

      ko.utils.domNodeDisposal.addDisposeCallback element, ->
        $(element).unbind "click"