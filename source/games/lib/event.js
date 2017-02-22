var _eventHandlers = {};

function addEvent(dom, event, handler, capture) {
  var nodes = [];
  if (dom.length && dom.nodeName !== 'SELECT') {
    nodes = dom;
  } else {
    nodes.push(dom);
  }
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if(!(node in _eventHandlers)) {
      _eventHandlers[node] = {};
    }
    if(!(event in _eventHandlers[node])) {
      _eventHandlers[node][event] = [];
    }

    _eventHandlers[node][event].push([handler, capture]);
    if (window.addEventListener) {
      node.addEventListener(event, handler, capture);
    } else {
      node.attachEvent('on' + event, handler);
    }
  }
}
function removeAllListeners(node, event) {
  if(node in _eventHandlers) {
    var handlers = _eventHandlers[node];
    if(event in handlers) {
      var eventHandlers = handlers[event];
      for(var i = eventHandlers.length; i--;) {
        var handler = eventHandlers[i];
        node.removeEventListener(event, handler[0], handler[1]);
      }
    }
  }
}
