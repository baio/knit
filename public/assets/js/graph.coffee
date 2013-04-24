
$ ->


  #"http://cryptic-hamlet-8915.herokuapp.com/links"
  d3.xml "data/main.gexf", "application/xml", (gexf) ->

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
      source  :
        grp_nodes.filter((f) -> d3.select(d).attr("source") == f.attrs.id)[0]
      target:
        grp_nodes.filter((f) -> d3.select(d).attr("target") == f.attrs.id)[0]
      weight: 1

    console.log grp_edges

    color = d3.scale.category20()
    xscale = d3.scale.linear()
      .domain([d3.min(grp_nodes, (d) -> d.attrs.x), d3.max(grp_nodes, (d) -> d.attrs.x)]).range([400, 900])
    yscale = d3.scale.linear()
      .domain([d3.min(grp_nodes, (d) -> d.attrs.y), d3.max(grp_nodes, (d) -> d.attrs.y)]).range([200, 500])


    svg = d3.select("#viz").append("svg")
      .attr("height", 900)


    link = svg.selectAll("link")
      .data(grp_edges)
      .enter()
      .append("line")
      .attr("class", "link")
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


