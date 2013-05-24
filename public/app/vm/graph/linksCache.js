// Generated by CoffeeScript 1.6.2
(function() {
  define(function() {
    var LinksCache;

    LinksCache = (function() {
      function LinksCache() {
        this.links = [];
      }

      LinksCache.prototype.getTitles = function(links) {
        var _this = this;

        return async.map(links(), function(link, ck) {
          return _this.getTitle(link, ck);
        }, function(err, res) {
          links(res);
          return console.log("get titles done");
        });
      };

      LinksCache.prototype.getTitle = function(link, done) {
        var t,
          _this = this;

        if (/^(http:\/\/)?bit.ly\/\w+$/.test(link)) {
          t = this.links[link];
          if (!t) {
            return this._req(link, function(err, title) {
              _this.links[link] = title;
              return done(err, title);
            });
          } else {
            return done(null, t);
          }
        }
      };

      LinksCache.prototype._req = function(link, done) {
        var key;

        key = "12b0031480e55c61cd57bf97026ea94ec1f0a85e";
        return $.ajax({
          url: "https://api-ssl.bitly.com/v3/link/info",
          data: {
            link: link,
            access_token: key
          },
          dataType: "jsonp",
          success: function(data) {
            if (data.data) {
              return done(null, data.data.html_title ? data.html_title : (data.data.canonical_url ? data.data.canonical_url : link));
            } else {
              return done(null, link);
            }
          },
          error: function() {
            return done(null, link);
          }
        });
      };

      return LinksCache;

    })();
    return new LinksCache();
    /*
    constructor: (bitlyLinks) ->
      @links = []
      @links[l] = l for l in bitlyLinks
      @_updateLinkTitles()
    
    getLink: (bitlyLink) ->
      @links[bitlyLink]
    
    _updateLinkTitles: ->
      async.forEach @links, ((linkTitle, ck) => @_updateLinkTitle(linkTitle, ck)), (err) ->
        console.log "links updated " + err
    
    _updateLinkTitle: (linkTitle, done) ->
      username = "baio1980"
      key = "12b0031480e55c61cd57bf97026ea94ec1f0a85e"
      $.ajax
          url: "http://api.bit.ly/v3/link/info"
          data: link:linkTitle, apiKey:key, login:username
          dataType:"jsonp"
          success: (data) ->
            console.log data
            done()
          error: ->
    */

  });

}).call(this);

/*
//@ sourceMappingURL=linksCache.map
*/