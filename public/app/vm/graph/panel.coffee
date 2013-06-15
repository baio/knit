define ["app/dataProvider", "ural/modules/pubSub"], (dataProvider, pubSub) ->

  class Panel

    constructor: ->
      pubSub.sub "graph", "save", => @save()

    save: ->
      if @id
        data = @toData().filter((d) -> d.meta.isMoved)
        dataProvider.ajax "graphs", "patch", {graph: @id, data : data}, (err) ->
          if err then toastr.error err, "Ошибка сохранения" else toastr.success "Сохранено успешно"



    load: (filter, done) ->

      getEdgeGroup = (edge) ->
        tags = edge.tags
        if tags.filter((t) -> t.type.indexOf("pp-") == 0).length
          return 0
        else if tags.filter((t) -> t.type.indexOf("po-") == 0).length
          return 1
        else if tags.filter((t) -> t.type.indexOf("oo-") == 0).length
          return 2
        else
          return 3

      getNodeGroup = (edges, node) ->
        source_edge = edges.filter((f) -> f.source == node)[0]
        target_edge = edges.filter((f) -> f.target == node)[0]
        if source_edge
          type = source_edge.tags[0].type
          if type.indexOf("pp-") == 0 or type.indexOf("po-") == 0
            return 0
          else if type.indexOf("oo-") == 0
            return 1
        if target_edge
          type = target_edge.tags[0].type
          if type.indexOf("pp-") == 0
            return 0
          else if type.indexOf("po-") == 0 or type.indexOf("oo-") == 0
            return 1
        return 2

      dataProvider.get "graphs", filter, (err, data) =>
        if !err
          @id = data.id
          for edge in data.edges
            edge.target = data.nodes.filter((n) -> n.id == edge.target_id)[0]
            edge.source = data.nodes.filter((n) -> n.id == edge.source_id)[0]
            edge.group = getEdgeGroup edge
          for node in data.nodes
            pos = node.meta.pos
            if pos[0] == -1 then pos[0] = 500
            if pos[1] == -1 then pos[1] = 500
            node.group = getNodeGroup data.edges, node
        done err, data

    render: (data) ->
      @data = data

      color = d3.scale.category20()

      grp_nodes = data.nodes
      grp_edges = data.edges

      ###
      xscale = d3.scale.linear()
        .domain([d3.min(grp_nodes, (d) -> d.meta.pos[0]), d3.max(grp_nodes, (d) -> d.meta.pos[0])]).range([400, 900])
      yscale = d3.scale.linear()
        .domain([d3.min(grp_nodes, (d) -> d.meta.pos[1]), d3.max(grp_nodes, (d) -> d.meta.pos[1])]).range([200, 500])
      ###

      svg = d3.select("#graph").append("svg")
        .attr("width", 2500)
        .attr("height", 1200)

      link = svg.selectAll("link")
        .data(grp_edges)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", (d) -> color(d.group))
        .attr("x1", (d) -> d.source.meta.pos[0])
        .attr("y1", (d) -> d.source.meta.pos[1])
        .attr("x2", (d) -> d.target.meta.pos[0])
        .attr("y2", (d) -> d.target.meta.pos[1])
        .on("mouseover", @onHoverEdge)
        .on("click", @onClickEdge)

      text = svg.selectAll("text")
        .data(grp_nodes)
        .enter()
        .append("text")
        .attr("class", "text")
        .attr("text-anchor", "middle")
        .text((d) -> d.name)
        .attr("x", (d) -> d.meta.pos[0])
        .attr("y", (d) -> d.meta.pos[1] - 10)

      node = svg.selectAll("node")
        .data(grp_nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", (d) -> d.meta.pos[0])
        .attr("cy", (d) -> d.meta.pos[1])
        .attr("class", "link")
        .style("fill", (d) -> color(d.group))
        .call(d3.behavior.drag()
          .origin((d) -> d)
          .on("drag", (d) ->
            x = parseFloat(d3.select(@).attr("cx")) + d3.event.dx
            y = parseFloat(d3.select(@).attr("cy")) + d3.event.dy
            d3.select(@).attr("cx", x).attr("cy", y)
            link.filter((l) -> l.source == d).attr("x1", x).attr("y1", y)
            link.filter((l) -> l.target == d).attr("x2", x).attr("y2", y)
            text.filter((t) -> t.id == d.id).attr("x", x).attr("y", y - 10)
            d.meta.pos = [x, y]
            d.meta.isMoved = true
          ))

      Mousetrap.bind ['ctrl+s'], =>
        if @data.isYours
          @save()
        return false

    onHoverEdge: (edge) ->
    onClickEdge: (edge) ->

    toData: ->
      @data.nodes


