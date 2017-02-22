(function () {
  var canvas = document.getElementById('clock');
  var ctx = canvas.getContext('2d');

  var clock = {
    init: function () {
      this.renderPanel(200, 200, 100);
      this.renderPointer(200, 200, 70);
    },
    /*
     * 绘制表盘刻度及数字
     * param x 圆心横坐标
     * param y 圆心纵坐标
     * param R 钟表半径
     * param width 刻度宽度
     */
    renderPanel: function (x, y, R, width) {
      var angle = '';
      var number = 0;
      var offsetX = 0;
      // ctx.save();

      for (var i = 1; i <= 60; i++) {
        // 刻度间隔角度
        angle = (i - 1) * Math.PI / 30;

        // 12点到6点
        if (i == 1 || i == 31) {
          offsetX = 5;
        } else if (i <= 30 && (i != 6 && i != 26)) {
          offsetX = 25;
        } else if (i == 6 || i == 26) {
          offsetX = 18;
        } else {
          offsetX = -12;
        }
        // 3点到9点
        if (i > 16 && i < 46) {
          offsetY = 10;
        }  else if (i == 16 || i == 46) {
          offsetY = 5;
        } else {
          offsetY = 0;
        }
        if ((i - 1) % 5) {
          padding = 5;
        } else {
          padding = 10;
          ctx.fillText(number ? number : 12, x + R * Math.sin(angle) - offsetX, y - (R - 25) * Math.cos(angle) + offsetY);
          number += 1;
        }
        ctx.strokeStyle = '#f00';
        ctx.save();
        ctx.beginPath();

        ctx.moveTo(x + 100 * Math.sin(angle), y - 100 * Math.cos(angle));
        ctx.lineTo(x + (100 - padding) * Math.sin(angle), y - (100 - padding) * Math.cos(angle));

        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        this.renderPointer(x, y, 70);
        var that = this;
        setTimeout(function () {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          that.renderPanel(x, y, R);
        }, 1000)
      }
    },
    /*
     * 绘制指针
     */
    renderPointer: function (x, y, r) {
      // var context = canvas.getContext('2d');
      var now = new Date();
      // 秒针
      var second = now.getSeconds(); // 0-59
      var secAngle = second * Math.PI / 30;
      ctx.strokeStyle = '#f00';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + r * Math.sin(secAngle), y - r * Math.cos(secAngle));
      ctx.stroke();
      ctx.closePath();

      // 分针
      var minute = now.getMinutes();
      var minAngle = minute * Math.PI /30;
      ctx.strokeStyle = '#0f0';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (r - 15) * Math.sin(minAngle), y - (r - 15) * Math.cos(minAngle));
      ctx.stroke();
      ctx.closePath();

      var hour = now.getHours() % 12;
      var hourAngle = (hour + minute / 60.0) * (Math.PI / 6);
      ctx.strokeStyle = '#00f';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (r - 30) * Math.sin(hourAngle), y - (r - 30) * Math.cos(hourAngle));
      ctx.stroke();
      ctx.closePath();
    }
  }
  clock.init();
})();
