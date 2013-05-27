// Generated by CoffeeScript 1.6.2
/*
ko.bindingHandlers.sortableList =
  init: (element, valueAccessor, allBindingsAccessor, context) ->
    $(element).data("sortList", valueAccessor()) #attach meta-data
    $(element).sortable
      update: (event, ui) ->
        item = ui.item.data("sortItem")
        if item
          #identify parents
          originalParent = ui.item.data "parentList"
          newParent = ui.item.parent().data "sortList"
          #figure out its new position
          position = ko.utils.arrayIndexOf ui.item.parent().children(), ui.item[0]
          if (position >= 0)
            #originalParent.remove item
            newParent.splice position, 0, item
      connectWith: '.container'

#attach meta-data
ko.bindingHandlers.sortableItem =
  init: (element, valueAccessor) ->
    options = valueAccessor()
    $(element).data("sortItem", options.item)
    $(element).data("parentList", options.parentList)
*/


(function() {
  ko.bindingHandlers.draggable = {
    init: function(element, valueAccessor, allBindingsAccessor) {
      var options;

      options = valueAccessor();
      return $(element).draggable({
        containment: 'window',
        helper: function(evt, ui) {
          var h;

          h = $(element).clone().css({
            width: $(element).width(),
            height: $(element).height()
          });
          h.data("ko.draggable.item", options.item);
          h.data("ko.draggable.parentList", options.parentList);
          h.data("ko.draggable.options", allBindingsAccessor().draggableOpts);
          return h;
        },
        appendTo: 'body'
      });
    }
  };

  ko.bindingHandlers.droppable = {
    init: function(element, valueAccessor, allBindingsAccessor, context) {
      return $(element).droppable({
        drop: function(evt, ui) {
          var dragList, dragOpts, dropList, f, item, opts;

          opts = allBindingsAccessor().droppableOpts;
          dropList = valueAccessor();
          item = ui.helper.data("ko.draggable.item");
          dragList = ui.helper.data("ko.draggable.parentList");
          dragOpts = ui.helper.data("ko.draggable.options");
          if (opts && opts.compareField) {
            f = dropList().filter(function(f) {
              return f[opts.compareField]() === item[opts.compareField]();
            })[0];
            if (f) {
              return;
            }
          }
          if (dragOpts && dragOpts.removeFromList) {
            dragList.remove(item);
            if (dragOpts && dragOpts.afterRemove) {
              dragOpts.afterRemove(dropList, item);
            }
          }
          if (opts && opts.appendToList === false) {
            return;
          }
          dropList.splice(0, 0, item);
          if (opts && opts.afterAppend) {
            opts.afterAppend(dropList, item);
          }
          return console.log(item);
        }
      });
    }
  };

}).call(this);

/*
//@ sourceMappingURL=drag-and-drop.map
*/
