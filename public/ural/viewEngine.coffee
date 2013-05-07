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
  #+ Rendered `layoutHtml` html will be appended to the container element with `id=_layout`
  #+ `layoutModelData :
  #     [{layot : "name of the layout to apply data binding to"},
  #     {data : data to apply as data-binding for corresponding layout}]`
  #
  #This abstraction level needed because binding is depended on view engine used,
  #also you could choose diffrent procedures to bind data, for example - bind model to jsrender templates values instead
  #of knockout ones, or before applying values to html template merge model and viewBag data.
  applyData = (bodyHtml, layoutModelsData, viewBag, isApply) ->

    $.templates pvt : bodyHtml
    layoutHtml = $.render.pvt viewBag

    $("#_layout").empty()
    $("#_layout").append layoutHtml

    if isApply
      for lmd in layoutModelsData
        ko.applyBindings lmd.data, $("#" + lmd.layout)[0]

  render : render
  applyData : applyData