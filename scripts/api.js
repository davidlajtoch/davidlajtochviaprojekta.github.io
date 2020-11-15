class Config {
    constructor() {}

    getSettings(request) {
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
}

class Client {
    constructor(config) {
        this.config = config;
    }

    sendRequest(request) {
        var ajax = $.ajax(this.config.getSettings(request)).done(function (response) {});
        return ajax.responseJSON;

    }

    getTop() {
        let request = new Request('/top/anime/1/upcoming');
        return this.sendRequest(request);

    }

    getSearch(search_string) {
        let url = '/search/anime?q=' + search_string;
        let request = new Request(url);
        return this.sendRequest(request);
    }

    getAnimeStats(mal_id) {
        let url = '/anime/' + mal_id + '/stats';
        let request = new Request(url);
        return this.sendRequest(request);
    }

    getAnimeEpisodes(mal_id) {
        let url = '/anime/' + mal_id + '/episodes';
        let request = new Request(url);
        return this.sendRequest(request);
    }
}

class Request {
    constructor(url) {
        this.url = url;
    }
}