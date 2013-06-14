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
      dataProvider.get "graphs", filter, (err, data) =>
        if !err
          @id = data.id
          for edge in data.edges
            edge.target = data.nodes.filter((n) -> n.id == edge.target_id)[0]
            edge.source = data.nodes.filter((n) -> n.id == edge.source_id)[0]
            edge.isType = (type) ->
              pp = @tags.filter((t) -> t.type.indexOf("pp-") == 0).length
              po = @tags.filter((t) -> t.type.indexOf("po-") == 0).length
              oo = @tags.filter((t) -> t.type.indexOf("oo-") == 0).length
              switch type
                when "pp"
                  pp
                when "po"
                  po
                when "oo"
                  oo
          for node in data.nodes
            pos = node.meta.pos
            if pos[0] == -1 then pos[0] = 500
            if pos[1] == -1 then pos[1] = 500
            source_edge = data.edges.filter((f) -> f.source == node)[0]
            target_edge = data.edges.filter((f) -> f.target == node)[0]
            if source_edge
              type = source_edge.tags[0].type
              node.type = "person" if type.indexOf("pp-") == 0 or type.indexOf("po-") == 0
              node.type = "org" if type.indexOf("oo-") == 0
            if target_edge
              type = target_edge.tags[0].type
              node.type = "person" if type.indexOf("pp-") == 0
              node.type = "org" if type.indexOf("po-") == 0 or type.indexOf("oo-") == 0
            node.isType = (type) ->
              @type == type
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
        .classed("link", true)
        .classed("person-person", (d) -> d.isType("pp"))
        .classed("person-org", (d) -> d.isType("po"))
        .classed("org-org", (d) -> d.isType("oo"))
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
        .attr("class", "node")
        .attr("cx", (d) -> d.meta.pos[0])
        .attr("cy", (d) -> d.meta.pos[1])
        .classed("org", (d) -> d.isType("org"))
        .classed("person", (d) -> d.isType("person"))
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


