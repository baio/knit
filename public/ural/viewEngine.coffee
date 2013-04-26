define ["ural/viewRender"], (viewRender) ->

  render = (path, done) ->
    viewRender.render path, done

  applyData = (bodyHtml, model, viewBag, isApplay) ->

    $.templates pvt : bodyHtml
    bodyHtml = $.render.pvt viewBag

    $("#_body").empty()
    $("#_body").append bodyHtml

    if model and isApplay
      ko.applyBindings model, $("#_body")[0]

  render : render
  applyData : applyData