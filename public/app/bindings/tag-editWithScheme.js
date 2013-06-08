// Generated by CoffeeScript 1.6.2
(function() {
  define(["ural/bindings/tag-edit"], function() {
    return ko.bindingHandlers.tageditWithScheme = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var _opts;

        _opts = allBindingsAccessor().tageditOpts;
        if (_opts == null) {
          _opts = {};
        }
        _opts.filterParams = {
          index: (function() {
            return _opts.scheme.index;
          }),
          type: (function() {
            return _opts.scheme.type.join(",");
          })
        };
        _opts.getDefault = function(label) {
          return {
            key: label,
            label: label,
            value: label,
            data: {
              key: label,
              label: label,
              val: label,
              type: _opts.scheme.default_type
            }
          };
        };
        return ko.bindingHandlers.tagedit.init(element, valueAccessor, allBindingsAccessor, viewModel);
      },
      update: function(element, valueAccessor, allBindingsAccessor) {
        return ko.bindingHandlers.tagedit.update(element, valueAccessor, allBindingsAccessor);
      }
    };
  });

}).call(this);

/*
//@ sourceMappingURL=tag-editWithScheme.map
*/