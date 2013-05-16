define ["app/cache/graph"],
(
  graph
) ->

  (resource) ->
    switch resource
      when "graphs" then graph
      else null

