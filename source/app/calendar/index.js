(function() {
  var HOLIDAY_DICT = {
    'New Year\'s Day': '元旦',
    'Chinese New Year': '春节',
    'Qingming': '清明节',
    'May Day': '劳动节',
    'Dragon Boat': '端午节',
    'Mid-Autumn Day': '中秋节',
    'National Day': '国庆节'
  };
  var CURRENCY_DICT = {
    'CNY': '人民币',
    'EUR': '欧元',
    'JPY': '日元',
    'GBP': '英镑',
    'AUD': '澳大利亚元',
    'SGD': '新加坡元',
    'CHF': '瑞士法郎',
    'HKD': '港币',
    'RUB': '卢布',
    'INR': '印度卢比',
    'IDR': '印尼盾',
    'VND': '越南盾',
    'KRW': '韩元'
  };
  var date = '';
  var now = new Date();
  var currentDate = now.getDate();
  var renderedCnt = 35; // 渲染的格子数量
  var DAYS_ENUM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var dateListNode = document.querySelector('#date-list');
  var yearSelect = document.querySelector('#year');
  var monthSelect = document.querySelector('#month');
  var holidays = [];

  var calendar = {
    init: function () {
      date = new Date();
      this.initDaysPerMonth(date);
      this.renderDateSelect(date);
      this.renderCalendar(date);
      this.queryConcurrency();
      this.bindEvents();
    },
    bindEvents: function () {
      var self = this;
      addEvent(yearSelect, 'change', function (e) {
        var ev = e || event;
        date.setFullYear(this.value);
        self.initDaysPerMonth(date);
        self.renderCalendar(date);
        if (self.needData(date)) {
          self.queryHistoryHoliday(date, self.paddingHolidays);
        }
        ev.cancelBubble = true;
      });
      addEvent(monthSelect, 'change', function (e) {
        var ev = e || event;
        date.setMonth(this.value - 1);
        self.renderCalendar(date);
        if (self.needData(date)) {
          self.queryHistoryHoliday(date, self.paddingHolidays);
        }
        ev.cancelBubble = true;
      });
      addEvent(document.querySelector('#to-today'), 'click', function (e) {
        var ev = e || event;
        date = new Date();
        self.initDaysPerMonth(date);
        self.renderDateSelect(date);
        self.renderCalendar(date);
      });
    },
    needData: function (date) {
      var nowMonthNum = +now.toLocaleDateString().substring(0, now.toLocaleDateString().lastIndexOf('/')).replace(/\//g, '');
      var currentNum = +date.toLocaleDateString().substring(0, date.toLocaleDateString().lastIndexOf('/')).replace(/\//g, '');
      var selectedMonth = date.getMonth() + 1;
      if (currentNum < nowMonthNum && selectedMonth < 12 && selectedMonth != 8 && selectedMonth != 7) {
        return true;
      }
      return false;
    },
    initDaysPerMonth: function (date) {
      if (this.isSpecialYear(date.getFullYear())) {
        DAYS_ENUM[1] = 29;
      } else {
        DAYS_ENUM[1] = 28;
      }
    },
    renderDateSelect: function (date) {
      yearSelect.innerHTML = '';
      monthSelect.innerHTML = '';
      for (var i = 1990; i <= now.getFullYear(); i++) {
        var yOption = document.createElement('option');
        yOption.setAttribute('value', i);
        yOption.innerHTML = i;
        yearSelect.appendChild(yOption);
        if (yOption.getAttribute('value') == date.getFullYear()) {
          yOption.selected = true;
        }
      }
      for (var i = 1; i <= 12; i++) {
        var mOption = document.createElement('option');
        mOption.setAttribute('value', i);
        mOption.innerHTML = i;
        monthSelect.appendChild(mOption);
        if (mOption.getAttribute('value') == date.getMonth() + 1) {
          mOption.selected = true;
        }
      }
    },
    renderCalendar: function (dateSource) {
      var dateCp = new Date(dateSource);
      dateListNode.innerHTML = '';
      var curMon = dateCp.getMonth();
      dateCp.setDate(1);
      var startDay = dateCp.getDay();
      dateCp.setDate(currentDate);
      if (DAYS_ENUM[curMon] == 28 && startDay == 0) {
        // 平年二月且第一天是周日
        renderedCnt = 28;
      } else if ((DAYS_ENUM[curMon] == 29)
                  ||
                  (DAYS_ENUM[curMon] == 30 && startDay < 6)
                  ||
                  (DAYS_ENUM[curMon] == 31 && startDay < 5)) {
        renderedCnt = 35;
      } else {
        renderedCnt = 42;
      }
      // 填充本月日期数据
      for (var i = 1; i <= renderedCnt; i++) {
        var li = document.createElement('li');
        dateListNode.appendChild(li);
        if (i > startDay && i <= DAYS_ENUM[curMon] + startDay) {
          var span = document.createElement('span');
          if (now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth() && (i - startDay) == currentDate) {
            span.classList.add('current');
          }
          var dateText = i - startDay;
          span.innerHTML = dateText;
          var dayValue = dateText > 9 ? dateText : ('0' + dateText);
          var dateString = dateCp.toLocaleDateString();
          var yearMonth = dateString.substring(0, dateString.lastIndexOf('/')).replace(/\//g, '-');
          var yearMonthFormat = yearMonth + '-';
          if (yearMonth.length == 6) {
            yearMonthFormat = yearMonth.substr(0, 5) + '0' + yearMonth[yearMonth.length-1] + '-';
          }
          var dateValue = yearMonthFormat + dayValue;
          li.setAttribute('data-date', dateValue);
          li.appendChild(span);
        }
      }
      // 填充上月日期
      var preMonthLastDay = DAYS_ENUM[curMon-1];
      if (curMon == 0) {
        preMonthLastDay = 31;
      }
      for (var i = startDay - 1; i >= 0; i--) {
        var span = document.createElement('span');
        // 获得第一个被填充节点的前一个节点
        var prevNode = document.querySelector('#date-list li span').parentElement.previousElementSibling;
        span.classList.add('no-current-month');
        prevNode.appendChild(span);
        prevNode.firstElementChild.innerHTML = preMonthLastDay;
        preMonthLastDay--;
      }

      var nextMonthStartDay = 1;
      for (var i = DAYS_ENUM[curMon] + startDay; i < renderedCnt; i++) {
        // 获得本月最后一天的下一个节点
        var nextNode = dateListNode.children[document.querySelectorAll('#date-list li span').length];
        var span = document.createElement('span');
        span.classList.add('no-current-month');
        nextNode.appendChild(span);
        nextNode.firstElementChild.innerHTML = nextMonthStartDay;
        nextMonthStartDay++;
      }
    },
    isSpecialYear: function (year) {
      if ((year % 400 == 0) || ((year % 4 == 0) && (year % 100))) {
        return true;
      }
      return false;
    },
    paddingHolidays: function (list) {
      holidays = list;
      for (var i = 0; i < renderedCnt; i++) {
        for (var j = 0; j < holidays.length; j++) {
          var currentItem = dateListNode.querySelectorAll('li')[i];
          if (currentItem.getAttribute('data-date') == holidays[j].date) {
            var holiday = document.createElement('span');
            holiday.classList.add('holiday-name');
            holiday.innerHTML = HOLIDAY_DICT[holidays[j].name];
            currentItem.appendChild(holiday);
          }
        }
      }
    },
    queryHistoryHoliday: function (date, callback) {
      http({
        url: 'https://holidayapi.com/v1/holidays?key=6c89e149-7b70-4e92-9b2c-54f692e2cdd4&country=CN&year=' + date.getFullYear() + '&month=' + (date.getMonth() + 1),
        success: function (data) {
          callback(data.holidays);
        }
      });
    },
    queryConcurrency: function () {
      var currencyNode = document.querySelector('#currency-list');
      http({
        url: '/currency/live?access_key=569af2d17215478d7bee3b142307452e',
        success: function (data) {
          var quotes = data.quotes;
          for (var key in quotes) {
            var cur = key.substr(3);
            if (CURRENCY_DICT.hasOwnProperty(cur)) {
              var item = document.createElement('li');
              item.innerHTML = CURRENCY_DICT[cur] + ': ' + quotes[key];
              currencyNode.appendChild(item);
            }
          }
        }
      });
    }
  };
  calendar.init();
})();
