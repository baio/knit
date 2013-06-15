// Generated by CoffeeScript 1.6.2
(function() {
  define(["app/dataProvider", "ural/modules/pubSub"], function(dataProvider, pubSub) {
    var Panel;

    return Panel = (function() {
      function Panel() {
        var _this = this;

        pubSub.sub("graph", "save", function() {
          return _this.save();
        });
      }

      Panel.prototype.save = function() {
        var data;

        if (this.id) {
          data = this.toData().filter(function(d) {
            return d.meta.isMoved;
          });
          return dataProvider.ajax("graphs", "patch", {
            graph: this.id,
            data: data
          }, function(err) {
            if (err) {
              return toastr.error(err, "Ошибка сохранения");
            } else {
              return toastr.success("Сохранено успешно");
            }
          });
        }
      };

      Panel.prototype.load = function(filter, done) {
        var getEdgeGroup, getNodeGroup,
          _this = this;

        getEdgeGroup = function(edge) {
          var tags;

          tags = edge.tags;
          if (tags.filter(function(t) {
            return t.type.indexOf("pp-") === 0;
          }).length) {
            return 0;
          } else if (tags.filter(function(t) {
            return t.type.indexOf("po-") === 0;
          }).length) {
            return 1;
          } else if (tags.filter(function(t) {
            return t.type.indexOf("oo-") === 0;
          }).length) {
            return 2;
          } else {
            return 3;
          }
        };
        getNodeGroup = function(edges, node) {
          var source_edge, target_edge, type;

          source_edge = edges.filter(function(f) {
            return f.source === node;
          })[0];
          target_edge = edges.filter(function(f) {
            return f.target === node;
          })[0];
          if (source_edge) {
            type = source_edge.tags[0].type;
            if (type.indexOf("pp-") === 0 || type.indexOf("po-") === 0) {
              return 0;
            } else if (type.indexOf("oo-") === 0) {
              return 1;
            }
          }
          if (target_edge) {
            type = target_edge.tags[0].type;
            if (type.indexOf("pp-") === 0) {
              return 0;
            } else if (type.indexOf("po-") === 0 || type.indexOf("oo-") === 0) {
              return 1;
            }
          }
          return 2;
        };
        return dataProvider.get("graphs", filter, function(err, data) {
          var edge, node, pos, _i, _j, _len, _len1, _ref, _ref1;

          if (!err) {
            _this.id = data.id;
            _ref = data.edges;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              edge = _ref[_i];
              edge.target = data.nodes.filter(function(n) {
                return n.id === edge.target_id;
              })[0];
              edge.source = data.nodes.filter(function(n) {
                return n.id === edge.source_id;
              })[0];
              edge.group = getEdgeGroup(edge);
            }
            _ref1 = data.nodes;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              node = _ref1[_j];
              pos = node.meta.pos;
              if (pos[0] === -1) {
                pos[0] = 500;
              }
              if (pos[1] === -1) {
                pos[1] = 500;
              }
              node.group = getNodeGroup(data.edges, node);
            }
          }
          return done(err, data);
        });
      };

      Panel.prototype.render = function(data) {
        var color, dx, dy, force, grp_edges, grp_nodes, height, link, node, sh, svg, sw, text, width,
          _this = this;

        this.data = data;
        color = d3.scale.category20();
        console.log(color(0));
        grp_nodes = data.nodes;
        grp_edges = data.edges;
        /*
        xscale = d3.scale.linear()
          .domain([d3.min(grp_nodes, (d) -> d.meta.pos[0]), d3.max(grp_nodes, (d) -> d.meta.pos[0])]).range([400, 900])
        yscale = d3.scale.linear()
          .domain([d3.min(grp_nodes, (d) -> d.meta.pos[1]), d3.max(grp_nodes, (d) -> d.meta.pos[1])]).range([200, 500])
        */

        width = 2500;
        height = 1200;
        force = d3.layout.force().charge(-500).linkDistance(30).linkStrength(0.1).size([width, height]);
        svg = d3.select("#graph").append("svg").attr("width", width).attr("height", height).on("click", this.onClickSvg);
        link = svg.selectAll("link").data(grp_edges).enter().append("line").attr("class", "link").style("stroke", function(d) {
          return color(d.group);
        }).attr("x1", function(d) {
          return d.source.meta.pos[0];
        }).attr("y1", function(d) {
          return d.source.meta.pos[1];
        }).attr("x2", function(d) {
          return d.target.meta.pos[0];
        }).attr("y2", function(d) {
          return d.target.meta.pos[1];
        }).on("mouseover", this.onHoverEdge).on("click", this.onClickEdge);
        text = svg.selectAll("text").data(grp_nodes).enter().append("text").attr("class", "text").attr("text-anchor", "middle").text(function(d) {
          return d.name;
        }).attr("x", function(d) {
          return d.meta.pos[0];
        }).attr("y", function(d) {
          return d.meta.pos[1] - 10;
        });
        node = svg.selectAll("node").data(grp_nodes).enter().append("circle").attr("r", 5).attr("cx", function(d) {
          return d.meta.pos[0];
        }).attr("cy", function(d) {
          return d.meta.pos[1];
        }).attr("class", "link").style("fill", function(d) {
          return color(d.group);
        }).call(force.drag);
        /*
          .call(d3.behavior.drag()
            .origin((d) -> d)
            .on("dragend", (d) ->
              x = parseFloat(d3.select(@).attr("cx")) + d3.event.dx
              y = parseFloat(d3.select(@).attr("cy")) + d3.event.dy
              d3.select(@).attr("cx", x).attr("cy", y)
              link.filter((l) -> l.source == d).attr("x1", x).attr("y1", y)
              link.filter((l) -> l.target == d).attr("x2", x).attr("y2", y)
              text.filter((t) -> t.id == d.id).attr("x", x).attr("y", y - 10)
              d.meta.pos = [x, y]
              d.meta.isMoved = true
              console.log "drag"
            ))
        */

        force.nodes(grp_nodes).links(grp_edges).start();
        force.on("tick", function() {
          link.attr("x1", function(d) {
            return d.source.x;
          }).attr("y1", function(d) {
            return d.source.y;
          }).attr("x2", function(d) {
            return d.target.x;
          }).attr("y2", function(d) {
            return d.target.y;
          });
          node.attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
          return text.attr("x", function(d) {
            return d.x;
          }).attr("y", function(d) {
            return d.y - 10;
          });
        });
        Mousetrap.bind(['ctrl+s'], function() {
          if (_this.data.isYours) {
            _this.save();
          }
          return false;
        });
        sh = screen.height;
        sw = screen.width;
        if (sh < height) {
          dy = (height - sh) / 2;
          $(document).scrollTop(dy);
        }
        if (sw < width) {
          dx = (width - sw) / 2;
          $(document).scrollLeft(dx);
        }
        this.grp_nodes = grp_nodes;
        return this.svg = svg;
      };

      Panel.prototype.onHoverEdge = function(edge) {};

      Panel.prototype.onClickEdge = function(edge) {};

      Panel.prototype.onClickSvg = function() {};

      Panel.prototype.toData = function() {
        return this.data.nodes;
      };

      Panel.prototype.updateText = function(cls) {
        var text;

        return text = this.svg.selectAll("text").data(this.grp_nodes).attr("class", cls);
      };

      return Panel;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=panel.map
*/
