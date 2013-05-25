#http://smellegantcode.wordpress.com/2012/12/26/jquery-ui-drag-and-drop-bindings-for-knockout-js/
#http://www.knockmeout.net/2011/05/dragging-dropping-and-sorting-with.html

#connect items with observableArrays
###
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
###

ko.bindingHandlers.draggable =
  init: (element, valueAccessor) ->
    options = valueAccessor()
    $(element).draggable
      containment: 'window',
      helper: (evt, ui) ->
        h = $(element).clone().css width: $(element).width(), height: $(element).height()
        h.data("ko.draggable.item", options.item)
        h.data("ko.draggable.parentList", options.parentList)
        return h
      appendTo: 'body'

ko.bindingHandlers.droppable =
  init: (element, valueAccessor, allBindingsAccessor, context) ->
    opts = allBindingsAccessor().droppableOpts
    dropList = valueAccessor()
    $(element).droppable
      tolerance: 'pointer'
      hoverClass: 'dragHover'
      activeClass: 'dragActive'
      drop: (evt, ui) ->
        item = ui.helper.data("ko.draggable.item")
        if opts and opts.compareField
          f = dropList().filter((f) -> f[opts.compareField]() == item[opts.compareField]())[0]
          if f
            return
        dropList.splice 0, 0, item
        console.log item
