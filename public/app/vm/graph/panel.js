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
        var _this = this;

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
              edge.isType = function(type) {
                var family, priv, prof;

                family = this.tags.filter(function(t) {
                  return t.type === "family";
                }).length;
                priv = this.tags.filter(function(t) {
                  return t.type === "private";
                }).length;
                prof = this.tags.filter(function(t) {
                  return t.type === "prof";
                }).length;
                switch (type) {
                  case "family":
                    return family;
                  case "private":
                    return !family && priv;
                  case "prof":
                    return !family && !priv && prof;
                }
              };
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
            }
          }
          return done(err, data);
        });
      };

      Panel.prototype.render = function(data) {
        var color, grp_edges, grp_nodes, link, node, svg, text,
          _this = this;

        this.data = data;
        color = d3.scale.category20();
        grp_nodes = data.nodes;
        grp_edges = data.edges;
        /*
        xscale = d3.scale.linear()
          .domain([d3.min(grp_nodes, (d) -> d.meta.pos[0]), d3.max(grp_nodes, (d) -> d.meta.pos[0])]).range([400, 900])
        yscale = d3.scale.linear()
          .domain([d3.min(grp_nodes, (d) -> d.meta.pos[1]), d3.max(grp_nodes, (d) -> d.meta.pos[1])]).range([200, 500])
        */

        svg = d3.select("#graph").append("svg").attr("height", 900);
        link = svg.selectAll("link").data(grp_edges).enter().append("line").classed("link", true).classed("family_rel", function(d) {
          return d.isType("family");
        }).classed("private_rel", function(d) {
          return d.isType("private");
        }).classed("prof_rel", function(d) {
          return d.isType("prof");
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
        node = svg.selectAll("node").data(grp_nodes).enter().append("circle").attr("r", 5).attr("class", "node").attr("cx", function(d) {
          return d.meta.pos[0];
        }).attr("cy", function(d) {
          return d.meta.pos[1];
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
          text.filter(function(t) {
            return t.id === d.id;
          }).attr("x", x).attr("y", y - 10);
          d.meta.pos = [x, y];
          return d.meta.isMoved = true;
        }));
        return Mousetrap.bind(['ctrl+s'], function() {
          if (_this.data.isYours) {
            _this.save();
          }
          return false;
        });
      };

      Panel.prototype.onHoverEdge = function(edge) {};

      Panel.prototype.onClickEdge = function(edge) {};

      Panel.prototype.toData = function() {
        return this.data.nodes;
      };

      return Panel;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=panel.map
*/
