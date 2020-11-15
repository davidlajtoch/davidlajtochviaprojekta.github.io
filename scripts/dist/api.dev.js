"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Config =
/*#__PURE__*/
function () {
  function Config() {
    _classCallCheck(this, Config);
  }

  _createClass(Config, [{
    key: "getSettings",
    value: function getSettings(request) {
      var settings = {
        "async": false,
        "crossDomain": true,
        "url": "https://jikan1.p.rapidapi.com" + request.url,
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "c3a6a399damshebebad606f0458fp1424dfjsn33d93a032272",
          "x-rapidapi-host": "jikan1.p.rapidapi.com"
        }
      };
      return settings;
    }
  }]);

  return Config;
}();

var Client =
/*#__PURE__*/
function () {
  function Client(config) {
    _classCallCheck(this, Client);

    this.config = config;
  }

  _createClass(Client, [{
    key: "sendRequest",
    value: function sendRequest(request) {
      var ajax = $.ajax(this.config.getSettings(request)).done(function (response) {});
      return ajax.responseJSON;
    }
  }, {
    key: "getTop",
    value: function getTop() {
      var request = new Request('/top/anime/1/upcoming');
      return this.sendRequest(request);
    }
  }, {
    key: "getSearch",
    value: function getSearch(search_string) {
      var url = '/search/anime?q=' + search_string;
      var request = new Request(url);
      return this.sendRequest(request);
    }
  }, {
    key: "getAnimeStats",
    value: function getAnimeStats(mal_id) {
      var url = '/anime/' + mal_id + '/stats';
      var request = new Request(url);
      return this.sendRequest(request);
    }
  }, {
    key: "getAnimeEpisodes",
    value: function getAnimeEpisodes(mal_id) {
      var url = '/anime/' + mal_id + '/episodes';
      var request = new Request(url);
      return this.sendRequest(request);
    }
  }]);

  return Client;
}();

var Request = function Request(url) {
  _classCallCheck(this, Request);

  this.url = url;
};