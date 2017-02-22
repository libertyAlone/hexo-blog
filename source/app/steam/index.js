(function () {
  var gameListNode = document.querySelector('.game-list');
  document.querySelector('#steam-id').value = localStorage.getItem('steamId') || '';
  var gameList = [];
  var games = {
    init: function () {
      this.initLeanCloud();
      this.bindEvents();
    },
    initLeanCloud: function () {
      var APP_ID = 'vx2W53NT02Amcjq5Ats4FFNr-gzGzoHsz';
      var APP_KEY = '8aasEiBmiAdeeHtcMBptCexJ';
      AV.init({
        appId: APP_ID,
        appKey: APP_KEY
      });
    },
    bindEvents: function () {
      var self = this;
      addEvent(document.querySelector('#submit'), 'click', function () {
        var idValue = document.querySelector('#steam-id').value;
        var steamId = idValue;
        if (!steamId) {
          alert('Steam ID不能为空');
          return;
        }
        self.recordSteamId(steamId);
        self.queryOwnedGames(steamId);
      });
      addEvent(document.querySelector('#count-select'), 'change', function (ev) {
        var e = ev || event;
        self.getRecentPlayedGames({
          count: this.value,
          steamId: document.querySelector('#steam-id').value
        });
        e.cancelBubble = true;
      });
      addEvent(document.querySelector('.self-info'), 'click', function () {
        location.assign('info.html?id=' + this.dataset['id']);
      });
    },
    recordSteamId: function (steamId) {
      var query = new AV.Query('Steam');
      query.equalTo('steamId', steamId);
      query.find().then(function (results) {
        if (results.length == 0) {
          var Steam = AV.Object.extend('Steam');
          var account = new Steam();
          account.set('steamId', steamId);
          account.save().then(function (data) {
            console.log('save steamId success');
          }, function (err) {
            console.log(err);
          });
        }
      });
    },
    queryOwnedGames: function (param) {
      gameListNode.innerHTML = '';
      document.querySelector('#count-select').innerHTML = '';
      var self = this;
      http({
        url: '/steam/IPlayerService/GetOwnedGames/v0001/?key=FEDC86137480195B06A74AAF01A45FC6&include_appinfo=1&format=json&steamid=' + param,
        success: function (res) {
          var data = res.response;
          gameList = data.games;
          for (var i = 0; i < data.game_count; i++) {
            var game = document.createElement('li');
            game.classList.add('clearfix');
            game.setAttribute('data-appid', gameList[i].appid);

            var gameLogo = document.createElement('img');
            gameLogo.classList.add('game-logo');
            gameLogo.src = 'http://media.steampowered.com/steamcommunity/public/images/apps/' + gameList[i].appid + '/' + gameList[i].img_logo_url + '.jpg';

            var gameName = document.createElement('span');
            gameName.classList.add('game-name');
            gameName.innerHTML = gameList[i].name;

            var totalMinutes = document.createElement('span');
            totalMinutes.classList.add('game-minutes');
            totalMinutes.innerHTML = gameList[i].playtime_forever + '分钟';

            var gameUsers = document.createElement('span');
            gameUsers.classList.add('game-users');
            gameUsers.innerText = '查看游戏总人数';

            game.appendChild(gameLogo);
            game.appendChild(gameName);
            game.appendChild(totalMinutes);
            game.appendChild(gameUsers);
            gameListNode.appendChild(game);
          }
          var countSelect = document.querySelector('#count-select');
          for (var i = 1; i <= data.game_count; i++) {
            var countOpt = document.createElement('option');
            countOpt.value = i;
            countOpt.innerText = i;
            countSelect.appendChild(countOpt);
          }
          document.querySelector('label[for="count-select"]').style.display = 'inline-block';
          document.querySelector('#steam-id').value = param;
          document.querySelector('.self-info').setAttribute('data-id', param);
          localStorage.setItem('steamId', param);
          addEvent(document.querySelectorAll('.game-users'), 'click', function (ev) {
            var e = ev || event;
            self.getCurrentGameUsers(this.parentElement.dataset.appid, this);
            e.cancelBubble = true;
          });
        }
      });
    },
    getRecentPlayedGames: function (param) {
      for (var j = 0; j < gameListNode.children.length; j++) {
        gameListNode.children[j].classList.remove('recent');
      }
      http({
        url: '/steam/IPlayerService/GetRecentlyPlayedGames/v0001/?key=FEDC86137480195B06A74AAF01A45FC6&format=json&steamid=' + param.steamId + '&count=' + param.count,
        success: function (data) {
          var recentGames = data.response.games;
          for (var i = 0; i < recentGames.length; i++) {
            for (var j = 0; j < gameListNode.children.length; j++) {
              if (gameListNode.children[j].dataset.appid == recentGames[i].appid) {
                gameListNode.children[j].classList.add('recent');
              }
            }
          }
        }
      });
    },
    getCurrentGameUsers: function (appId, dom) {
      http({
        url: '/steam/ISteamUserStats/GetNumberOfCurrentPlayers/v0001/?key=FEDC86137480195B06A74AAF01A45FC6&appid=' + appId,
        success: function (data) {
          dom.innerText = data.response.player_count;
        }
      });
    }
  };
  games.init();
})();
