(function () {
  var steamId = getSearchQuery('id');
  var info = {
    init: function () {
      this.initLeanCloud();
      this.queryInfo();
    },
    initLeanCloud: function () {
      var APP_ID = 'vx2W53NT02Amcjq5Ats4FFNr-gzGzoHsz';
      var APP_KEY = '8aasEiBmiAdeeHtcMBptCexJ';
      AV.init({
        appId: APP_ID,
        appKey: APP_KEY
      });
    },
    queryInfo: function () {
      http({
        url: '/steam/ISteamUser/GetPlayerSummaries/v0002/?key=FEDC86137480195B06A74AAF01A45FC6&steamids=' + steamId,
        success: function (data) {
          document.querySelector('.info').style.display = 'block';
          var info = data.response.players[0];
          document.querySelector('#avatar').src = info.avatarfull;
          document.querySelector('#person-name').innerText = info.personaname;
          document.querySelector('#logoff-time').innerText = new Date(+info.lastlogoff*1000).toLocaleDateString();
          document.querySelector('#create-time').innerText = new Date(+info.timecreated*1000).toLocaleDateString();
          document.querySelector('#profile').href = info.profileurl;
        }
      });
    }
  };
  info.init();
})();
