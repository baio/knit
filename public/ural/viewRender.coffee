#### loads and generate views ###
define ->

  class ViewRender

    @Render: (bodyPath, done) ->
      async.waterfall [
        (ck) ->
          require ["Ural/Libs/text!#{bodyPath}"], (bodyHtml) ->
            ck null, bodyHtml
        , (bodyHtml, ck) ->
          ViewRender._renderPartialViews bodyHtml, ck
      ], (err, bodyHtml) ->
        if !err then $("#_body").append bodyHtml
        if done then done err

    @_renderPartialViews: (html, callback) ->
      #html = "<div>#{html}</div>"
      ViewRender.__renderPartialViews html, (err, renderedHtml) ->
        if renderedHtml then renderedHtml = $(renderedHtml).html()
        callback err, renderedHtml

    @__renderPartialViews: (html, callback) ->
      partialViews = $("[data-partial-view]", html)
      rawPaths = $.makeArray(partialViews.map (i, p) -> $(p).attr "data-partial-view")
      paths = rawPaths.map (p) -> "Ural/Libs/text!#{p}"
      if paths.length
        require paths, ->
          partialHtmls = ViewRender._argsToArray arguments
          viewsHash = []
          for partialHtml, i in partialHtmls
            $h = $(html)
            idx = viewsHash[rawPaths[i]]
            idx ?= 0
            $pratialViewTag = $h.find "[data-partial-view='#{rawPaths[i]}']:eq(#{idx})"
            viewsHash[rawPaths[i]] = idx+1
            viewBag = $pratialViewTag.attr "data-partial-view-bag"
            $pratialViewTag.removeAttr "data-partial-view"
            $pratialViewTag.removeAttr "data-partial-view-bag"
            jViewBag = if viewBag then eval "(#{viewBag})" else {}
            $.templates pvt : partialHtml
            partialHtml = $.render.pvt jViewBag
            $pratialViewTag.html partialHtml
            #html = "<div>#{html}</div>"
          async.forEachSeries partialHtmls
          ,(ph, ck) ->
            ControllerBase.__renderPartialViews html, (err, renderedHtml) ->
              html = renderedHtml
              ck err
          ,(err) -> callback err, html
      else
        callback null, html

    @_argsToArray: (args) ->
      for i in [0..args.length-1]
        args[i]

  ViewRender : ViewRender