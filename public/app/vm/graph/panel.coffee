define ["app/dataProvider"], (dataProvider) ->

  class Panel

    constructor: ->

      @name_src = ko.observable()
      @name_tgt = ko.observable()
      @url_src = ko.computed => "https://www.google.ru/search?q=#{@name_src()}"
      @url_tgt = ko.computed => "https://www.google.ru/search?q=#{@name_tgt()}"
      @tags = ko.observableArray()

    load: (filter, done) ->
      dataProvider.get "graphs", contrib : "518b989739ed9714289d0bc1", (err, data) ->
        if !err
          for edge in data.edges
            edge.target = data.nodes.filter((n) -> n.id == edge.target_id)[0]
            edge.source = data.nodes.filter((n) -> n.id == edge.source_id)[0]
          for node in data.nodes
            pos = node.meta.pos
            if pos[0] == -1 then pos[0] = 0.5
            if pos[1] == -1 then pos[1] = 0.5
        done err, data

    render: (data) ->

      color = d3.scale.category20()

      grp_nodes = data.nodes
      grp_edges = data.edges

      xscale = d3.scale.linear()
        .domain([d3.min(grp_nodes, (d) -> d.meta.pos[0]), d3.max(grp_nodes, (d) -> d.meta.pos[0])]).range([400, 900])
      yscale = d3.scale.linear()
        .domain([d3.min(grp_nodes, (d) -> d.meta.pos[1]), d3.max(grp_nodes, (d) -> d.meta.pos[1])]).range([200, 500])

      svg = d3.select("#graph").append("svg")
        .attr("height", 900)

      link = svg.selectAll("link")
        .data(grp_edges)
        .enter()
        .append("line")
        .classed("link", true)
        .classed("family_rel", (d) -> d.tags.filter((t) -> t.type == "family").length)
        .classed("private_rel", (d) -> d.tags.filter((t) -> t.type == "private").length)
        .classed("prof_rel", (d) -> d.tags.filter((t) -> t.type == "prof").length)
        .attr("x1", (d) -> xscale(d.source.meta.pos[0]))
        .attr("y1", (d) -> yscale(d.source.meta.pos[1]))
        .attr("x2", (d) -> xscale(d.target.meta.pos[0]))
        .attr("y2", (d) -> yscale(d.target.meta.pos[1]))
        .on("mouseover", (d) =>
          @name_src d.source.name
          @name_tgt d.target.name
          @tags d.tags
        )

      text = svg.selectAll("text")
        .data(grp_nodes)
        .enter()
        .append("text")
        .attr("class", "text")
        .attr("text-anchor", "middle")
        .text((d) -> d.name)
        .attr("x", (d) -> xscale(d.meta.pos[0]))
        .attr("y", (d) -> yscale(d.meta.pos[1] - 10))

      node = svg.selectAll("node")
        .data(grp_nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("class", "node")
        .attr("cx", (d) -> xscale(d.meta.pos[0]))
        .attr("cy", (d) -> yscale(d.meta.pos[1]))
        .call(d3.behavior.drag()
          .origin((d) -> d)
          .on("drag", (d) ->
            x = parseFloat(d3.select(@).attr("cx")) + d3.event.dx
            y = parseFloat(d3.select(@).attr("cy")) + d3.event.dy
            d3.select(@).attr("cx", x).attr("cy", y)
            link.filter((l) -> l.source == d).attr("x1", x).attr("y1", y)
            link.filter((l) -> l.target == d).attr("x2", x).attr("y2", y)
            text.filter((t) -> t.id == d.id).attr("x", x).attr("y", y - 10)
          ))

  Panel : Panel