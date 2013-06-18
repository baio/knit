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
        var d, i, n, nodes_data, upd_data, _i, _len,
          _this = this;

        if (this.id) {
          upd_data = [];
          nodes_data = this.node[0].map(function(d) {
            return {
              x: d.cx.baseVal.value,
              y: d.cy.baseVal.value
            };
          });
          for (i = _i = 0, _len = nodes_data.length; _i < _len; i = ++_i) {
            d = nodes_data[i];
            n = this.grp_nodes[i];
            if (d.x !== n.meta.pos[0] || d.y !== n.meta.pos[1]) {
              d.id = n.id;
              upd_data.push(d);
            }
          }
          if (upd_data.length !== 0) {
            return dataProvider.ajax("graphs", "patch", {
              graph: this.id,
              data: upd_data
            }, function(err) {
              var _j, _len1, _results;

              if (err) {
                toastr.error(err, "Ошибка сохранения");
              } else {
                toastr.success("Сохранено успешно");
              }
              if (!err) {
                _results = [];
                for (i = _j = 0, _len1 = nodes_data.length; _j < _len1; i = ++_j) {
                  d = nodes_data[i];
                  _results.push(_this.grp_nodes[i].meta.pos = [d.x, d.y]);
                }
                return _results;
              }
            });
          } else {
            return toastr.warning("Нечего сохранять");
          }
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
        force.nodes(grp_nodes).links(grp_edges).start();
        force.on("tick", function() {
          link.attr("x1", function(d) {
            return _this._getX(d.source.x);
          }).attr("y1", function(d) {
            return _this._getY(d.source.y);
          }).attr("x2", function(d) {
            return _this._getX(d.target.x);
          }).attr("y2", function(d) {
            return _this._getY(d.target.y);
          });
          node.attr("cx", function(d) {
            return _this._getX(d.x);
          }).attr("cy", function(d) {
            return _this._getY(d.y);
          });
          return text.attr("x", function(d) {
            return _this._getX(d.x);
          }).attr("y", function(d) {
            return _this._getY(d.y) - 10;
          });
        });
        Mousetrap.bindGlobal(['ctrl+s'], function() {
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
        this.force = force;
        this.grp_nodes = grp_nodes;
        this.grp_edges = grp_edges;
        this.svg = svg;
        this.node = node;
        this.link = link;
        return this.text = text;
      };

      Panel.prototype._getX = function(x) {
        var r, width;

        width = 2500;
        r = 20;
        return Math.max(r, Math.min(width - r, x));
      };

      Panel.prototype._getY = function(y) {
        var height, r;

        height = 1200;
        r = 20;
        return Math.max(r, Math.min(height - r, y));
      };

      Panel.prototype.onHoverEdge = function(edge) {};

      Panel.prototype.onClickEdge = function(edge) {};

      Panel.prototype.onClickSvg = function() {};

      Panel.prototype.toData = function() {
        return this.data.nodes;
      };

      Panel.prototype.updateText = function(cls) {
        return this.text.attr("class", cls);
      };

      Panel.prototype.setForceLayout = function(isSet) {
        if (isSet) {
          this.node.call(this.force.drag);
          return this.force.start();
        } else {
          this.node.call(this._getDrag());
          return this.force.stop();
        }
      };

      Panel.prototype._getDrag = function() {
        var _this;

        _this = this;
        return d3.behavior.drag().origin(function(d) {
          return d;
        }).on("drag", function(d) {
          var x, y;

          x = parseFloat(d3.select(this).attr("cx")) + d3.event.dx;
          y = parseFloat(d3.select(this).attr("cy")) + d3.event.dy;
          d3.select(this).attr("cx", x).attr("cy", y);
          _this.link.filter(function(l) {
            return l.source === d;
          }).attr("x1", x).attr("y1", y);
          _this.link.filter(function(l) {
            return l.target === d;
          }).attr("x2", x).attr("y2", y);
          return _this.text.filter(function(t) {
            return t.id === d.id;
          }).attr("x", x).attr("y", y - 10);
        });
      };

      Panel.prototype.resetPositions = function() {
        this.node.attr("cx", function(d) {
          return d.meta.pos[0];
        });
        this.node.attr("cy", function(d) {
          return d.meta.pos[1];
        });
        this.link.attr("x1", function(d) {
          return d.source.meta.pos[0];
        });
        this.link.attr("y1", function(d) {
          return d.source.meta.pos[1];
        });
        this.link.attr("x2", function(d) {
          return d.target.meta.pos[0];
        });
        this.link.attr("y2", function(d) {
          return d.target.meta.pos[1];
        });
        this.text.attr("x", function(d) {
          return d.meta.pos[0];
        });
        return this.text.attr("y", function(d) {
          return d.meta.pos[1] - 10;
        });
        /*
        @svg.selectAll("node")
          .data(@node)
          .attr("cx", (d) ->
            console.log "cx"
            d.meta.pos[0])
          .attr("cy", (d) -> d.meta.pos[1])
        
        @svg.selectAll("link")
          .data(@grp_edges)
          .attr("x1", (d) -> d.source.meta.pos[0])
          .attr("y1", (d) -> d.source.meta.pos[1])
          .attr("x2", (d) -> d.target.meta.pos[0])
          .attr("y2", (d) -> d.target.meta.pos[1])
        
        @svg.selectAll("text")
          .data(@grp_nodes)
          .attr("x", (d) -> d.meta.pos[0])
          .attr("y", (d) -> d.meta.pos[1] - 10)
        */

      };

      return Panel;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=panel.map
*/
