// Generated by CoffeeScript 1.6.2
(function() {
  define(["ural/modules/pubSub"], function(pubSub) {
    return ko.bindingHandlers.link = {
      init: function(element, valueAccessor) {
        $(element).bind("click", function(e) {
          var href, value;

          e.preventDefault();
          href = $(element).attr("href");
          href = href.replace(/^#/, "");
          value = ko.utils.unwrapObservable(valueAccessor());
          if (value) {
            href = href + "/" + value;
          }
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
