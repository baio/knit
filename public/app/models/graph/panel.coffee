define ->

  class Panel

    load: (done) ->

      d3.xml "/data/main.gexf", "application/xml", (gexf) ->

        console.log gexf

        nodes =  d3.select(gexf).selectAll("node")[0]
        edges =  d3.select(gexf).selectAll("edge")[0]

        grp_nodes = nodes.map (d) ->
          for cn in d.childNodes
            if cn.localName == "position"
              position = cn
              break
          attrs :
            id : d.attributes.id.value
            label : d.attributes.label.value
            x : position.attributes.x.value
            y : position.attributes.y.value

        grp_edges = edges.map (d) ->
          attrs = {}
          for cn in d.childNodes[1].childNodes
            if cn.attributes
              fr = d3.select(cn).attr("for")
              if fr in ["family_rel", "private_rel", "prof_rel", "link"]
                attrs[fr] = d3.select(cn).attr("value")
          attrs : attrs
          source : grp_nodes.filter((f) -> d3.select(d).attr("source") == f.attrs.id)[0]
          target : grp_nodes.filter((f) -> d3.select(d).attr("target") == f.attrs.id)[0]
          weight: 1

        done null, {nodes : grp_nodes, edges : grp_edges}

    render: (model) ->

      color = d3.scale.category20()

      grp_nodes = model.nodes
      grp_edges = model.edges

      xscale = d3.scale.linear()
        .domain([d3.min(grp_nodes, (d) -> d.attrs.x), d3.max(grp_nodes, (d) -> d.attrs.x)]).range([400, 900])
      yscale = d3.scale.linear()
        .domain([d3.min(grp_nodes, (d) -> d.attrs.y), d3.max(grp_nodes, (d) -> d.attrs.y)]).range([200, 500])

      svg = d3.select("#graph").append("svg")
        .attr("height", 900)

      link = svg.selectAll("link")
        .data(grp_edges)
        .enter()
        .append("line")
        .classed("link", true)
        .classed("family_rel", (d) -> d.attrs.family_rel)
        .classed("private_rel", (d) -> !d.attrs.family_rel and d.attrs.private_rel)
        .classed("prof_rel", (d) -> !(d.attrs.family_rel or d.attrs.private_rel) and d.attrs.prof_rel)
        .attr("x1", (d) -> xscale(d.source.attrs.x))
        .attr("y1", (d) -> yscale(d.source.attrs.y))
        .attr("x2", (d) -> xscale(d.target.attrs.x))
        .attr("y2", (d) -> yscale(d.target.attrs.y))

      node = svg.selectAll("node")
        .data(grp_nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("class", "node")
        .attr("cx", (d) -> xscale(d.attrs.x))
        .attr("cy", (d) -> yscale(d.attrs.y))

      text = svg.selectAll("text")
        .data(grp_nodes)
        .enter()
        .append("text")
        .attr("class", "text")
        .attr("text-anchor", "middle")
        .text((d) -> d.attrs.label)
        .attr("x", (d) -> xscale(d.attrs.x))
        .attr("y", (d) -> yscale(d.attrs.y - 10))

  Panel : Panel