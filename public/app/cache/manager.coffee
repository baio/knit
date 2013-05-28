define ["app/cache/graph", "app/cache/curUser"],
(
  graph,
  curUser
) ->

  (resource) ->
    switch resource
      when "graphs" then graph
      when "curUser" then curUser
      else null