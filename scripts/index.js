$(document).ready(function () {

    var sad_face = ['(ಥ﹏ಥ)', 'o(TヘTo)', '(｡•́︿•̀｡)', '(っ˘̩╭╮˘̩)っ'];

    function disableButton(button) {
        $(button).attr("disabled", true);
        $(button).css('opacity', '0.5');
        setTimeout(function () {
            $(button).removeAttr("disabled");
            $(button).css('opacity', '1');
        }, 4000);
    }

    function updateContentHeader(text) {
        $('#content_header').css('display', 'block');
        $('#content_header').html(text);
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

        updateContentHeader('Top results<span class="highlight_purple"> / </span>popular right now');

        let type;
        let start_date;
        let episodes;
        let url;
        let sb = '';

        console.log(response.top);
        $(response.top).each(function (index) {

            (response.top[index].type === 'Unknown') ? type = '?': type = response.top[index].type;
            (response.top[index].start_date === null) ? start_date = '?': start_date = response.top[index].start_date;
            (response.top[index].episodes === null) ? episodes = '?': episodes = response.top[index].episodes;

            url = 'anime.html?mal_id=' + encodeURI(response.top[index].mal_id) + '&title=' + encodeURI(response.top[index].title);

            sb += '<a class="anime_button" style="text-decoration: none;">' +
                '<div class="item">' +
                '<div class="rank">' + response.top[index].rank + '</div>' +
                '<div class="title">' + response.top[index].title + '</div>' +
                '<div class="score ' + getScoreColor(response.top[index].score) + '"><i class="material-icons inline">grade</i>' + response.top[index].score + '</div>' +
                '<div class="type">' + type + '</div>' +
                '<div class="run_date">' + start_date + '</div>' +
                '<div class="episodes">' + episodes + ' episodes</div>' +
                '<div class="image"><img src="' + response.top[index].image_url + '"></div>' +
                '</div><div class="mal_id" style="display: none;">' + response.top[index].mal_id + '</div></a>';
        });
        $('#anime').html('');
        $('#list').html(sb);
    }

    $("#clear_button").click(function () {
        $('#searchbar').val('');
        disableButton(this);
        showTop();
    });

    function search() {

        disableButton($('#search_button'));

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

            updateContentHeader('Top results<span class="highlight_purple"> / </span>' + search_value);

            let type;
            let start_date;
            let end_date;
            let episodes;
            let url;
            let sb = '';
            $(response.results).each(function (index) {

                (response.results[index].type === 'Unknown') ? type = '?': type = response.results[index].type;
                (response.results[index].start_date === null) ? start_date = '?': start_date = response.results[index].start_date.substring(0, 7);
                (response.results[index].end_date === null) ? end_date = '?': end_date = response.results[index].end_date.substring(0, 7);
                (response.results[index].episodes === null) ? episodes = '?': episodes = response.results[index].episodes;

                url = 'anime.html?mal_id=' + encodeURI(response.results[index].mal_id) + '&title=' + encodeURI(response.results[index].title);

                sb += '<a class="anime_button" style="text-decoration: none;">' +
                    '<div class="item">' +
                    '<div class="rank">' + (index + 1) + '</div>' +
                    '<div class="title">' + response.results[index].title + '</div>' +
                    '<div class="score ' + getScoreColor(response.results[index].score) + '"><i class="material-icons inline">grade</i>' + response.results[index].score + '</div>' +
                    '<div class="type">' + type + '</div>' +
                    '<div class="run_date">' + start_date + ' - ' + end_date + '</div>' +
                    '<div class="episodes">' + episodes + ' episodes</div>' +
                    '<div class="image"><img src="' + response.results[index].image_url + '"></div>' +
                    '</div><div class="mal_id" style="display: none;">' + response.results[index].mal_id + '</div></a>';
            });
            $('#anime').html('');
            $('#list').html(sb);
        }
    }



    $('#list').on('click', '.anime_button', function () {

        $('#content_header').css('display', 'none');

        let title = $(this).find('.title')[0].innerHTML;
        let score = $(this).find('.score')[0].innerText.substring(5);
        let type = $(this).find('.type')[0].innerHTML;
        let episodes = $(this).find('.episodes')[0].innerText;
        let run_date = $(this).find('.run_date')[0].innerHTML;
        let image = $(this).find('.image')[0].innerHTML;
        let mal_id = $(this).find('.mal_id')[0].innerText;

        $('#searchbar').val(title);

        var config = new Config();
        var client = new Client(config);
        var response = client.getAnimeEpisodes(mal_id);

        let sb = '';

        sb += '<div class="title">' + title + '</div>' +
            '<div class="title_detail"><span class="' + getScoreColor(Number(score)) + '">' +
            '<i class="material-icons inline">grade</i>' + score + '</span>' +
            '<span class="highlight_purple"> / </span>' + type +
            '<span class="highlight_purple"> / </span>' + episodes +
            '<span class="highlight_purple"> / </span>' + run_date +
            '</div>' +
            '<div class="section1">' +
            '<div class="image">' + image + '</div>' +
            '<div class="episodes">';

        if (response.episodes.length === 0) {
            sb += '<div class="content_status highlight_faded">' +
                '<p class="face">' + sad_face[Math.floor(Math.random() * sad_face.length)] + '</p>' +
                '<p class="status_message">no episodes to display</p>' +
                '</div>';
        } else {
            $(response.episodes).each(function (index) {

                sb += '<div class="episode">' +
                    '<div class="index">' + response.episodes[index].episode_id + '</div>' +
                    '<div class="title">' + response.episodes[index].title + '</div>' +
                    '<div class="title_japanese">' + response.episodes[index].title_japanese + '</div>' +
                    '<div class="title_romanji">' + response.episodes[index].title_romanji + '</div>' +
                    '<div class="aired">' + response.episodes[index].aired.substring(0, 10) + '</div>' +
                    '</div>';
            });
        }

        sb += '</div>' +
            '</div>' +
            '<div class="section2">' +
            '<div class="lds-ellipsis" id="loading_animation"><div></div><div></div><div></div><div></div></div>' +
            '<div class="chart" id="chart_rating" style="position: relative; height: 320px; width: 50%;">' +
            '<canvas id="chartRating"></canvas>' +
            '</div>' +
            '<div class="chart" style="position: relative; height: 320px; width:50%;">' +
            '<canvas id="chartStats"></canvas>' +
            '</div></div>';


        setTimeout(function () {

            var config = new Config();
            var client = new Client(config);
            var response = client.getAnimeStats(mal_id);
            console.log(response);

            $('#loading_animation').css('display', 'none');

            if (response.scores.length !== 0) {
                var ctx1 = document.getElementById("chartRating").getContext('2d');
                var chart_rating = new Chart(ctx1, {
                    type: 'bar',
                    data: {
                        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        datasets: [{
                            label: 'User ratings',
                            data: [response.scores[1].votes, response.scores[2].votes, response.scores[3].votes, response.scores[4].votes, response.scores[5].votes, response.scores[6].votes, response.scores[7].votes, response.scores[8].votes, response.scores[9].votes, response.scores[10].votes],
                            backgroundColor: [
                                'rgba(124, 77, 255, 0.3)',
                                'rgba(124, 77, 255, 0.3)',
                                'rgba(124, 77, 255, 0.3)',
                                'rgba(124, 77, 255, 0.3)',
                                'rgba(124, 77, 255, 0.3)',
                                'rgba(124, 77, 255, 0.3)',
                                'rgba(124, 77, 255, 0.3)',
                                'rgba(124, 77, 255, 0.3)',
                                'rgba(124, 77, 255, 0.3)',
                                'rgba(124, 77, 255, 0.3)'
                            ],
                            borderColor: [
                                'rgba(124, 77, 255,1)',
                                'rgba(124, 77, 255,1)',
                                'rgba(124, 77, 255,1)',
                                'rgba(124, 77, 255,1)',
                                'rgba(124, 77, 255,1)',
                                'rgba(124, 77, 255,1)',
                                'rgba(124, 77, 255,1)',
                                'rgba(124, 77, 255,1)',
                                'rgba(124, 77, 255,1)',
                                'rgba(124, 77, 255,1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
            } else {

                let sb_no_rating = '<div class="content_status highlight_faded">' +
                    '<p class="face">' + sad_face[Math.floor(Math.random() * sad_face.length)] + '</p>' +
                    '<p class="status_message">no ratings to display</p>' +
                    '</div>';

                $('#chart_rating').html(sb_no_rating)
            }

            var ctx2 = document.getElementById("chartStats").getContext('2d');
            var chart_stats = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Completed', 'Dropped', 'Watching', 'Plan to watch', 'On hold'],
                    datasets: [{
                        label: 'User stats',
                        data: [response.completed, response.dropped, response.watching, response.plan_to_watch, response.on_hold],
                        backgroundColor: [
                            'rgba(124, 77, 255, 0.3)',
                            'rgba(124, 77, 255, 0.3)',
                            'rgba(124, 77, 255, 0.3)',
                            'rgba(124, 77, 255, 0.3)',
                            'rgba(124, 77, 255, 0.3)'
                        ],
                        borderColor: [
                            'rgba(124, 77, 255,1)',
                            'rgba(124, 77, 255,1)',
                            'rgba(124, 77, 255,1)',
                            'rgba(124, 77, 255,1)',
                            'rgba(124, 77, 255,1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

        }, 2000);

        $('#list').html('');
        $('#anime').html(sb);

    });

    $(document).on('keypress', function (e) {
        if (e.which == 13) {

            search($('#search_button'));
            e.preventDefault();

            setTimeout(function () {
                e.preventDefault();
                return false;
            }, 2000);
        }
    });

    $("#search_button").on('click', search);

    showTop();

});