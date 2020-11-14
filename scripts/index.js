$(document).ready(function () {

    function disableButton(button) {
        $(button).attr("disabled", true);
        $(button).css('opacity', '0.5');
        setTimeout(function () {
            $(button).removeAttr("disabled");
            $(button).css('opacity', '1');
        }, 4000);
    }

    function updateListHeader(text) {
        $('#list_header').text(text);
    }

    function getScoreColor(score) {
        if (score > 0.0 && score <= 4.0) {
            return 'highlight_red';
        }
        if (score > 4.0 && score <= 6.0) {
            return 'highlight_orange';
        }
        if (score > 6.0 && score < 8.0) {
            return 'highlight_yellow';
        }
        if (score >= 8.0) {
            return 'highlight_green';
        }
    }

    function showTop() {
        var config = new Config();
        var client = new Client(config);
        var response = client.getTop();
        console.log(response);

        updateListHeader('Top results / popular right now');

        let type;
        let start_date;
        let episodes;
        let sb = '';

        console.log(response.top);
        $(response.top).each(function (index) {

            (response.top[index].type === 'Unknown') ? type = '?': type = response.top[index].type;
            (response.top[index].start_date === null) ? start_date = '?': start_date = response.top[index].start_date;
            (response.top[index].episodes === null) ? episodes = '?': episodes = response.top[index].episodes;

            sb += '<div class="item">' +
                '<div class="rank">' + response.top[index].rank + '</div>' +
                '<div class="title">' + response.top[index].title + '</div>' +
                '<div class="score ' + getScoreColor(response.top[index].score) + '"><i class="material-icons inline">grade</i>' + response.top[index].score + '</div>' +
                '<div class="type">' + type + '</div>' +
                '<div class="run_date">' + start_date + '</div>' +
                '<div class="episodes">' + episodes + ' episodes</div>' +
                '<div class="image"><img src="' + response.top[index].image_url + '"></div>' +
                '</div>';
        });

        $('#list').html(sb);
    }

    $("#clear_button").click(function () {
        $('#searchbar').val('');
        disableButton(this);
        showTop();
    });

    $("#search_button").click(function () {

        disableButton(this);

        let search_value = $('#searchbar').val();
        if (search_value.length < 3) {
            showTop();
        } else {
            let search_string = $.trim(search_value);
            search_string.replace(/ /g, "%20");

            var config = new Config();
            var client = new Client(config);
            var response = client.getSearch(search_string);
            console.log(response);

            updateListHeader('Top results / ' + search_value);

            let type;
            let start_date;
            let end_date;
            let episodes;
            let sb = '';
            $(response.results).each(function (index) {

                (response.results[index].type === 'Unknown') ? type = '?': type = response.results[index].type;
                (response.results[index].start_date === null) ? start_date = '?': start_date = response.results[index].start_date.substring(0, 7);
                (response.results[index].end_date === null) ? end_date = '?': end_date = response.results[index].end_date.substring(0, 7);
                (response.results[index].episodes === null) ? episodes = '?': episodes = response.results[index].episodes;

                sb += '<div class="item">' +
                    '<div class="rank">' + (index + 1) + '</div>' +
                    '<div class="title">' + response.results[index].title + '</div>' +
                    '<div class="score ' + getScoreColor(response.results[index].score) + '"><i class="material-icons inline">grade</i>' + response.results[index].score + '</div>' +
                    '<div class="type">' + type + '</div>' +
                    '<div class="run_date">' + start_date + ' - ' + end_date + '</div>' +
                    '<div class="episodes">' + episodes + ' episodes</div>' +
                    '<div class="image"><img src="' + response.results[index].image_url + '"></div>' +
                    '</div>';
            });
            $('#list').html(sb);
        }
    });

    showTop();
});