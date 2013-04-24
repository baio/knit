// Generated by CoffeeScript 1.3.3
(function() {

  define(function() {
    var ViewRender;
    ViewRender = (function() {

      function ViewRender() {}

      ViewRender.Render = function(bodyPath, done) {
        return async.waterfall([
          function(ck) {
            return require(["Ural/Libs/text!" + bodyPath], function(bodyHtml) {
              return ck(null, bodyHtml);
            });
          }, function(bodyHtml, ck) {
            return ViewRender._renderPartialViews(bodyHtml, ck);
          }
        ], function(err, bodyHtml) {
          if (!err) {
            $("#_body").append(bodyHtml);
          }
          if (done) {
            return done(err);
          }
        });
      };

      ViewRender._renderPartialViews = function(html, callback) {
        return ViewRender.__renderPartialViews(html, function(err, renderedHtml) {
          if (renderedHtml) {
            renderedHtml = $(renderedHtml).html();
          }
          return callback(err, renderedHtml);
        });
      };

      ViewRender.__renderPartialViews = function(html, callback) {
        var partialViews, paths, rawPaths;
        partialViews = $("[data-partial-view]", html);
        rawPaths = $.makeArray(partialViews.map(function(i, p) {
          return $(p).attr("data-partial-view");
        }));
        paths = rawPaths.map(function(p) {
          return "Ural/Libs/text!" + p;
        });
        if (paths.length) {
          return require(paths, function() {
            var $h, $pratialViewTag, i, idx, jViewBag, partialHtml, partialHtmls, viewBag, viewsHash, _i, _len;
            partialHtmls = ViewRender._argsToArray(arguments);
            viewsHash = [];
            for (i = _i = 0, _len = partialHtmls.length; _i < _len; i = ++_i) {
              partialHtml = partialHtmls[i];
              $h = $(html);
              idx = viewsHash[rawPaths[i]];
              if (idx == null) {
                idx = 0;
              }
              $pratialViewTag = $h.find("[data-partial-view='" + rawPaths[i] + "']:eq(" + idx + ")");
              viewsHash[rawPaths[i]] = idx + 1;
              viewBag = $pratialViewTag.attr("data-partial-view-bag");
              $pratialViewTag.removeAttr("data-partial-view");
              $pratialViewTag.removeAttr("data-partial-view-bag");
              jViewBag = viewBag ? eval("(" + viewBag + ")") : {};
              $.templates({
                pvt: partialHtml
              });
              partialHtml = $.render.pvt(jViewBag);
              $pratialViewTag.html(partialHtml);
            }
            return async.forEachSeries(partialHtmls, function(ph, ck) {
              return ControllerBase.__renderPartialViews(html, function(err, renderedHtml) {
                html = renderedHtml;
                return ck(err);
              });
            }, function(err) {
              return callback(err, html);
            });
          });
        } else {
          return callback(null, html);
        }
      };

      ViewRender._argsToArray = function(args) {
        var i, _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = args.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(args[i]);
        }
        return _results;
      };

      return ViewRender;

    })();
    return {
      ViewRender: ViewRender
    };
  });

}).call(this);
