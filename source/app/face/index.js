(function () {
  var api = '';
  var face = {
    init: function () {
      api = new FacePP(
        '76b0139dcaef8f7d9b899cade25d9d35',
        'vxjjHRdad4LvwZ8F08p8rN59i7obvkbQ',
        {
          apiURL: 'http://apius.faceplusplus.com/v2'
        });
      this.bindEvents();

    },
    bindEvents: function () {
      addEvent(document.querySelector('#detect'), 'click', function (ev) {
        var e = ev || event;
        var file = this.previousElementSibling.files[0];
        var formData = new FormData();
        formData.append('img', file);
        http({
          url: '/facepp/detection/detect?api_key=76b0139dcaef8f7d9b899cade25d9d35&api_secret=vxjjHRdad4LvwZ8F08p8rN59i7obvkbQ&mode=oneface',
          method: 'POST',
          body: formData,
          isBin: true,
          success: function (res) {
            if (res.face.length == 0) {
              alert('请上传人脸');
            } else {
              var face = res.face[0];
              var attr = face.attribute;
              var position = face.position;
              alert('你的年龄在' + (attr.age.value - attr.age.range) + '~' + (attr.age.value + attr.age.range) + '岁之间');
            }
          }
        });
      });
    }
  };
  face.init();
}());
