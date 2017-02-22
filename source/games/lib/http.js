function getSearchQuery(param) {
  var queryObj = {};
  var search = location.search.substr(1);
  var queryList = search.split('&');
  for (var i = 0; i < queryList.length; i++) {
    var item = queryList[i].split('=');
    queryObj[item[0]] = item[1];
  }
  return queryObj[param];
}
function serialize(data) {//将参数序列化
  if (!data) {
    return '';
  }
  var pairs = [];
  for (var name in data){
    if (!data.hasOwnProperty(name) || typeof data[name] === 'function') {
      continue;
    }
    var value = data[name].toString();
    name = encodeURIComponent(name);
    value = encodeURIComponent(value);
    pairs.push(name + '=' + value);
  }
  return pairs.join('&');
}
function http(param) {
  if (window.fetch) {
    var option = {
      method: param.method || 'GET',
    };
    if (param.method && param.method.toUpperCase() == 'POST' && param.body) {
      option.body = serialize(param.body);
    }
    if (param.headers) {
      if (!param.headers['Content-Type']) {
        param.headers['Content-Type'] = 'application/www-form-urlencoded';
      }
      if (param.headers['Content-Type'] == 'application/json') {
        option.body = JSON.stringify(param.body);
      }
      var myHeaders = new Headers(param.headers);
      option.headers = myHeaders;
    }
    if (param.isBin) {
      option.body = param.body;
    }
    fetch(param.url, option)
      .then(function (response) {
        if (response.ok) {
          if (response.status == 200) {
            return response.json();
          }
        } else {
          alert(response.statusText);
          return JSON.stringify({
            status: response.status,
            errMsg: response.statusText
          })
        }
      }).then(function(data) {
        if (typeof data == 'object') {
          param.success && param.success(data);
        }
      }, function (err) {
        param.fail && param.fail(data);
      });
  } else {
    var req = new XMLHttpRequest();
    var data = '';
    req.open(param.method || 'GET', param.url, param.async || true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (param.headers) {
      for (var key in param.headers) {
        req.setRequestHeader(key, param.headers[key]);
      }
    }
    if (param.body) {
      data = serialize(param.body);
    }
    if (param.headers && param.headers['Content-Type'] == 'application/json') {
      data = JSON.stringify(param.body);
    }
    if (param.isBin) {
      data = param.body;
    }
    req.send(data || null);
    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        param.success && param.success(JSON.parse(req.responseText));
      } else {
        param.fail && param.fail();
      }
    }
  }
}
