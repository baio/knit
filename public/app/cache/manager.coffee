define ["app/cache/graph", "app/cache/curUser", "app/config"],
(
  graph,
  curUser,
  config
) ->

  (resource) ->
    if config.disable_cache then return null
    switch resource
      when "graphs" then graph
      when "curUser" then curUser
      else null