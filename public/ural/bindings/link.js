// Generated by CoffeeScript 1.3.3
(function() {

  define(["ural/modules/pubSub"], function(pubSub) {
    return ko.bindingHandlers.link = {
      init: function(element) {
        var href;
        href = $(element).attr("href");
        href = href.replace(/^#/, "");
        $(element).bind("click", function(e) {
          e.preventDefault();
          return pubSub.pub("href", "change", {
            href: href
          });
        });
        return ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
          return $(element).unbind("click");
        });
      }
    };
  });

}).call(this);
