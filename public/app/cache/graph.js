// Generated by CoffeeScript 1.6.2
(function() {
  define(function() {
    var TTL, _default_ref;

    TTL = 1000 * 60 * 60 * 3;
    _default_ref = "518b989739ed9714289d0bc1";
    return {
      _getName: function(ref) {
        if (!ref) {
          ref = _default_ref;
        }
        return "graph_" + ref;
      },
      _auth: function() {
        return true;
      },
      get: function(filter) {
        var d;

        if (filter.context !== "data") {
          console.log("get graph cache : " + this._getName(filter.graph));
          d = $.jStorage.get(this._getName(filter.graph));
          if (d) {
            return JSON.parse(d);
          } else {
            return null;
          }
        }
      },
      update: function(filter, data) {
        var _data;

        if ((!filter || filter.context !== "data") && !data.isYours) {
          console.log("update graph cache : " + data.id);
          _data = JSON.stringify(data);
          return $.jStorage.set(this._getName(data.id), _data, {
            TTL: TTL
          });
        }
      }
    };
  });

}).call(this);

/*
//@ sourceMappingURL=graph.map
*/
