(function () {
  var doc = window.document;
  var items = doc.querySelectorAll('.row li');
  var data = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  var randomArr = [];
  var movedFlag = false;
  var userId = '';
  var score = 0;
  var previousScore = 0;
  var game = {
    init: function () {
      this.initLeanCloud();
      this.renderPannel();
      this.generateId();
      this.setupEvents();
    },
    initLeanCloud: function () {
      var APP_ID = 'vx2W53NT02Amcjq5Ats4FFNr-gzGzoHsz';
      var APP_KEY = '8aasEiBmiAdeeHtcMBptCexJ';
      AV.init({
        appId: APP_ID,
        appKey: APP_KEY
      });
    },
    generateId: function () {
      http({
        url: 'https://api.ipify.org?format=json',
        method: 'GET',
        success: function (data) {
          userId = data.ip.split('.').join('');
        }
      });
    },
    recordScore: function () {
      // 已有对应ip
      var query = new AV.Query('Record');
      query.equalTo('ip', userId);
      query.find().then(function (results) {
        if (results.length > 0) {
          var record = AV.Object.createWithoutData('Record', results[0].get('id'));
          // 修改属性
          record.set('score', score);
          // 保存到云端
          record.save().then(function (data) {
            console.log('update success')
          });
        } else {
          var Record = new AV.Object.extend('Record');
          var record = new Record();
          record.set('ip', userId);
          record.set('score', score);
          record.save().then(function (data) {
            console.log('save success');
          }, function (err) {
            console.log(err);
          });
        }
      });
    },
    setupEvents: function () {
      var self = this;
      addEvent(doc.querySelector('.start'), 'click', function () {
        self.renderPannel();
        addEvent(doc, 'keydown', function (e) {

          e.stopPropagation();
          e.preventDefault();

          if (e.keyCode < 37 || e.keyCode > 40) {
            return;
          }
          switch (e.keyCode) {
            case 37:
              self.leftHandle();
              break;
            case 38:
              // up
              self.upHandle();
              break;
            case 39:
              // right
              self.rightHandle();
              break;
            case 40:
              // down
              self.downHandle();
              break;
            default:
              break;
          }
          if (movedFlag) {
            self.generateOneNum();
          }
          self.countSum();
          self.reRender();
          self.checkWin();
          if (self.gameOver()) {
            alert('你输了');
            self.recordScore(score);
          }
        });
        addEvent(doc.querySelector('#continue'), 'click', function (ev) {
          var ev = ev || event;
          doc.querySelector('.mask').style.display = 'none';
          ev.cancelBubble = true;
        });
        addEvent(doc.querySelector('#exit'), 'click', function (ev) {
          var ev = ev || event;
          doc.querySelector('.mask').style.display = 'none';
          self.recordScore(score);
          self.renderPannel();
          ev.cancelBubble = true;
        });
      }, false);
    },
    leftHandle: function () {
      var oneDimArr = data + '';
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
          for (var k = j + 1; k < 4; k++) {
            if (data[i][j] == data[i][k]) {
              if (
                   (k - j == 1)
                     ||
                   (k - j == 2 && data[i][j+1] == 0)
                     ||
                   (k - j == 3 && data[i][j+1] == 0 && data[i][j+2] == 0)
                 ) {
                data[i][j] += data[i][k];
                data[i][k] = 0;
              }
            } else if (data[i][j] != data[i][k] && data[i][j] == 0) {
              data[i][j] = data[i][k];
              data[i][k] = 0;
            }
          }
        }
      }
      var transArr = data + '';
      movedFlag = oneDimArr != transArr ? true : false;
    },
    upHandle: function () {
      var oneDimArr = data + '';
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
          for (var k = j + 1; k < 4; k++) {
            if (data[j][i] == data[k][i]) {
              if (
                   (k - j == 1)
                     ||
                   (k - j == 2 && data[j+1][i] == 0)
                     ||
                   (k - j == 3 && data[j+1][i] == 0 && data[j+2][i] == 0)
                 ) {
                data[j][i] += data[k][i];
                data[k][i] = 0;
              }
            } else if (data[j][i] != data[k][i] && data[j][i] == 0) {
              data[j][i] += data[k][i];
              data[k][i] = 0;
            }
          }
        }
      }
      var transArr = data + '';
      movedFlag = oneDimArr != transArr ? true : false;
    },
    rightHandle: function () {
      var oneDimArr = data + '';
      for (var i = 0; i < 4; i++) {
        for (var j = 3; j >= 1; j--) {
          for (var k = j - 1; k >= 0; k--) {
            if (data[i][j] == data[i][k]) {
              if (
                   (j - k == 1)
                     ||
                   (j - k == 2 && data[i][j-1] == 0)
                     ||
                   (j - k == 3 && data[i][j-1] == 0 && data[i][j-2] == 0)
                 ) {
                data[i][j] += data[i][k];
                data[i][k] = 0;
              }
            } else if (data[i][j] != data[i][k] && data[i][j] == 0) {
              data[i][j] = data[i][k];
              data[i][k] = 0;
            }
          }
        }
      }
      var transArr = data + '';
      movedFlag = oneDimArr != transArr ? true : false;
    },
    downHandle: function () {
      var oneDimArr = data + '';
      for (var i = 0; i < 4; i++) {
        for (var j = 3; j >= 1; j--) {
          for (var k = j - 1; k >= 0; k--) {
            if (data[j][i] == data[k][i]) {
              if (
                   (j - k == 1)
                     ||
                   (j - k == 2 && data[j-1][i] == 0)
                     ||
                   (j - k == 3 && data[j-1][i] == 0 && data[j-2][i] == 0)
                 ) {
                data[j][i] += data[k][i];
                data[k][i] = 0;
              }
            } else if (data[j][i] != data[k][i] && data[j][i] == 0) {
              data[j][i] += data[k][i];
              data[k][i] = 0;
            }
          }
        }
      }
      var transArr = data + '';
      movedFlag = oneDimArr != transArr ? true : false;
    },
    reRender: function () {
      var oneDimArr = (data + '').split(',');
      for (var i = 0; i < oneDimArr.length; i++) {
        if (oneDimArr[i] != 0) {
          items[i].children[0].innerHTML = oneDimArr[i];
          items[i].className = '';
          items[i].classList.add('num-' + oneDimArr[i]);
        } else {
          items[i].children[0].innerHTML = '';
          items[i].className = '';
        }
      }
    },
    reset: function () {
      randomArr = [];
      for (var i = 0; i < 16; i++) {
        items[i].className = '';
        items[i].children[0].innerHTML = '';
      }
      data = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      previousScore = 0;
      removeAllListeners(doc, 'keydown');
    },
    renderPannel: function () {
      this.reset();
      this.generateRandom();
      var x1 = Math.floor(randomArr[0] / 4);
      var y1 = randomArr[0] % 4;
      var x2 = Math.floor(randomArr[1] / 4);
      var y2 = randomArr[1] % 4;
      data[x1][y1] = 2;
      data[x2][y2] = 2;
      items[randomArr[0]].classList.add('num-2')
      items[randomArr[1]].classList.add('num-2')
      items[randomArr[0]].children[0].innerHTML = 2;
      items[randomArr[1]].children[0].innerHTML = 2;
      this.countSum();
    },
    countSum: function () {
      var sum = 0
      var oneDimArr = (data + '').split(',');
      previousScore = score;
      for (var i = 0; i < oneDimArr.length; i++) {
        sum += +oneDimArr[i]
      }
      score = sum;
      doc.querySelector('#score-text').innerHTML = sum;
    },
    /*
     * 初始生成两个位置的数
     */
    generateRandom: function () {
      var rand = 0;
      while (randomArr.length < 2) {
        rand = Math.floor(Math.random() * 16);
        var found = false;
        for (var i = 0; i < randomArr.length; i++) {
          if (randomArr[i] == rand) {
            found = true;
            break;
          }
        }
        if (!found) {
          randomArr.push(rand);
        }
      }
    },
    generateOneNum: function () {
      var indexArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      var oneDimArr = (data + '').split(',');
      var randIndex = 0;
      for (var i = 0; i < oneDimArr.length; i++) {
        if (oneDimArr[i] != 0) {
          for (var j = 0; j < indexArr.length; j++) {
            if (indexArr[j] == i) {
              indexArr.splice(j, 1);
            }
          }
        }
      }
      randIndex = Math.floor(Math.random() * indexArr.length);
      var num = Math.floor(Math.random() * 2) ? 4 : 2;
      data[Math.floor(indexArr[randIndex]/4)][indexArr[randIndex]%4] = num;
    },
    checkWin: function () {
      var oneDimArr = (data + '').split(',');
      for (var i = 0; i < oneDimArr.length; i++) {
        if (oneDimArr[i] == 1024) {
          doc.querySelector('.mask').style.display = 'block';
        }
      }
    },
    gameOver: function () {
      var oneDimArr = (data + '').split(',');
      var hasZero = oneDimArr.some(function (data) {
        return data == 0;
      });
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
          if (data[i][j] == data[i][j+1] || data[j][i] == data[j+1][i]) {
            if (data[i][j] && data[j][i] && data[i][j+1] && data[j+1][i]) {
              return false;
            }
          }
        }
      }
      if (!hasZero) {
        return true;
      }
    }
  }
  game.init();
})();
