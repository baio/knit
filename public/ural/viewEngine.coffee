define ["ural/viewRender"], (viewRender) ->

  #** render(path, done) **
  #
  #see viewRender.render
  render = (path, done) ->
    viewRender.render path, done

  #** render(path, done) **
  #
  #Apply data binding to generated html, append generated html to layot (static .html)
  #
  #This is default view engine
  #+ All viewbag data will be bound to `bodyHtml` jsrender template values
  #+ All model data will be bound to element with id `_body` via `knockout` binding, if isApply is defined
  #
  #This abstraction level needed because binding is depended on view engine used,
  # also you could choose diffrent procedures to bind data, for example -bind model to jsrander templates values instead
  # of knockout ones, or before applying values to html template merge model and viewBag data.
  applyData = (bodyHtml, model, viewBag, isApplay) ->

    $.templates pvt : bodyHtml
    bodyHtml = $.render.pvt viewBag

    $("#_body").empty()
    $("#_body").append bodyHtml

    if model and isApplay
      ko.applyBindings model, $("#_body")[0]

  render : render
  applyData : applyData