// Generated by CoffeeScript 1.3.3
(function() {

  define(["app/config"], function(config) {
    var Panel;
    Panel = (function() {

      function Panel() {
        var _this = this;
        this.name_src = ko.observable();
        this.name_tgt = ko.observable();
        this.url_src = ko.computed(function() {
          return "https://www.google.ru/search?q=" + (_this.name_src());
        });
        this.url_tgt = ko.computed(function() {
          return "https://www.google.ru/search?q=" + (_this.name_tgt());
        });
        this.tags = ko.observableArray();
      }

      Panel.prototype.load = function(done) {
        return d3.xml(config.links.panel_gexf_url, "application/xml", function(gexf) {
          var edges, grp_edges, grp_nodes, nodes;
          console.log(gexf);
          nodes = d3.select(gexf).selectAll("node")[0];
          edges = d3.select(gexf).selectAll("edge")[0];
          grp_nodes = nodes.map(function(d) {
            var cn, position, _i, _len, _ref;
            _ref = d.childNodes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              cn = _ref[_i];
              if (cn.localName === "position") {
                position = cn;
                break;
              }
            }
            return {
              attrs: {
                id: d.attributes.id.value,
                label: d.attributes.label.value,
                x: position.attributes.x ? position.attributes.x.value : 10,
                y: position.attributes.x ? position.attributes.y.value : 10
              }
            };
          });
          grp_edges = edges.map(function(d) {
            var attrs, cn, fr, node, _i, _j, _len, _len1, _ref, _ref1;
            attrs = {};
            _ref = d.childNodes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              node = _ref[_i];
              _ref1 = node.childNodes;
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                cn = _ref1[_j];
                if (cn.attributes) {
                  fr = d3.select(cn).attr("for");
                  if (fr === "family_rel" || fr === "private_rel" || fr === "prof_rel" || fr === "url") {
                    attrs[fr] = d3.select(cn).attr("value");
                  }
                }
              }
            }
            return {
              attrs: attrs,
              source: grp_nodes.filter(function(f) {
                return d3.select(d).attr("source") === f.attrs.id;
              })[0],
              target: grp_nodes.filter(function(f) {
                return d3.select(d).attr("target") === f.attrs.id;
              })[0],
              weight: 1
            };
          });
          return done(null, {
            nodes: grp_nodes,
            edges: grp_edges
          });
        });
      };

      Panel.prototype.render = function(model) {
        var color, grp_edges, grp_nodes, link, node, svg, text, xscale, yscale,
          _this = this;
        color = d3.scale.category20();
        grp_nodes = model.nodes;
        grp_edges = model.edges;
        xscale = d3.scale.linear().domain([
          d3.min(grp_nodes, function(d) {
            return d.attrs.x;
          }), d3.max(grp_nodes, function(d) {
            return d.attrs.x;
          })
        ]).range([400, 900]);
        yscale = d3.scale.linear().domain([
          d3.min(grp_nodes, function(d) {
            return d.attrs.y;
          }), d3.max(grp_nodes, function(d) {
            return d.attrs.y;
          })
        ]).range([200, 500]);
        svg = d3.select("#graph").append("svg").attr("height", 900);
        link = svg.selectAll("link").data(grp_edges).enter().append("line").classed("link", true).classed("family_rel", function(d) {
          return d.attrs.family_rel;
        }).classed("private_rel", function(d) {
          return !d.attrs.family_rel && d.attrs.private_rel;
        }).classed("prof_rel", function(d) {
          return !(d.attrs.family_rel || d.attrs.private_rel) && d.attrs.prof_rel;
        }).attr("x1", function(d) {
          return xscale(d.source.attrs.x);
        }).attr("y1", function(d) {
          return yscale(d.source.attrs.y);
        }).attr("x2", function(d) {
          return xscale(d.target.attrs.x);
        }).attr("y2", function(d) {
          return yscale(d.target.attrs.y);
        }).on("mouseover", function(d) {
          var tgs;
          _this.name_src(d.source.attrs.label);
          _this.name_tgt(d.target.attrs.label);
          tgs = [];
          if (d.attrs.family_rel) {
            tgs.push({
              type: "family",
              val: d.attrs.family_rel,
              url: d.attrs.url
            });
          }
          if (d.attrs.private_rel) {
            tgs.push({
              type: "private",
              val: d.attrs.private_rel,
              url: d.attrs.url
            });
          }
          if (d.attrs.prof_rel) {
            tgs.push({
              type: "prof",
              val: d.attrs.prof_rel,
              url: d.attrs.url
            });
          }
          return _this.tags(tgs);
        });
        text = svg.selectAll("text").data(grp_nodes).enter().append("text").attr("class", "text").attr("text-anchor", "middle").text(function(d) {
          return d.attrs.label;
        }).attr("x", function(d) {
          return xscale(d.attrs.x);
        }).attr("y", function(d) {
          return yscale(d.attrs.y) - 10;
        });
        return node = svg.selectAll("node").data(grp_nodes).enter().append("circle").attr("r", 5).attr("class", "node").attr("cx", function(d) {
          return xscale(d.attrs.x);
        }).attr("cy", function(d) {
          return yscale(d.attrs.y);
        }).call(d3.behavior.drag().origin(function(d) {
          return d;
        }).on("drag", function(d) {
          var x, y;
          x = parseFloat(d3.select(this).attr("cx")) + d3.event.dx;
          y = parseFloat(d3.select(this).attr("cy")) + d3.event.dy;
          d3.select(this).attr("cx", x).attr("cy", y);
          link.filter(function(l) {
            return l.source === d;
          }).attr("x1", x).attr("y1", y);
          link.filter(function(l) {
            return l.target === d;
          }).attr("x2", x).attr("y2", y);
          return text.filter(function(t) {
            return t.attrs.id === d.attrs.id;
          }).attr("x", x).attr("y", y - 10);
        }));
      };

      return Panel;

    })();
    return {
      Panel: Panel
    };
  });

}).call(this);
