var req = require('request');
var sfcinemacity = require('sfcinemacity');

//fetch major

function major(id, date) {
    return new Promise((resolve, reject) => {
        const baseURL = "http://onlinepayment.majorcineplex.com/api/1.0/showtime";

        //sample query: http://onlinepayment.majorcineplex.com/api/1.0/showtime?cinema_id=79&date=2017-03-28


        /* Options:
        cinema_id: int
        date: YYYY-MM-DD
        movie_id: int
        callback: string
        */
        var options = {
            cinema_id: id,
            date: date,
            movie_id: null,
            callback: null,
        }
        console.log("options for get are: ");
        console.dir(options);
        req.get({ url: baseURL, qs: options }, function(err, res, body) {
            if (err) reject(err);

            console.log("now getting");
            console.log("body is" + body.length);
            //console.dir(JSON.parse(body));

            body = JSON.parse(body);


            //build our cinema object using preferred format
            var cinema = {

            };

            cinema.name = {
                en: body.cinema.en,
                th: body.cinema.th
            }

            cinema.movies = [

            ];
            for (var i = 0; i < body.movies.length; i++) {
                var movie = body.movies[i];
                cinema.movies.push({
                    title: {
                        en: movie.name.en,
                        th: movie.name.th
                    },
                    duration: movie.detail.duration,
                    theatres: movie.theatres.map(function(val, idx) {
                        var theatre = {
                            name: val.name,
                            lang: val.lang,
                            showtimes: val.showtimes,
                        }
                        return theatre;
                    })
                })
            }

            resolve(cinema);

        });
    })

}


major(79, '2017-03-28').then(function(val) {
    //console.log("success!");
    //console.log(val);
});



sfcinemacity.getShowtimes(9901).then(function(movieShowTimes) {
    //console.log(movieShowTimes);
});


function todayShowtime() {

    //get today's major showtimes
    //until i find a way to parse all ids here's a hardcoded list of theatres in bkk
    const bkkids = [
        79, //mega cineplex
        107, // imax quartier
        106, // quartier cineart
        1, //  paragon cineplex
        38, //imax paragon
        10, // major sukhumvit
        13, //major rama 3
        33, //egv seacon
        14, // major bangna
        56, //paradise park
        25, // major samrong
        48 //major lotus srinakarin
    ];

    var today = new Date(Date.now());
    var date = today.getFullYear() + '-' + pad(2, today.getMonth() + 1) + '-' + today.getDate();
    console.log("date is" + date);
    var fulfilled = [];
    for (var i = 0; i < 4; i++) {
        major(bkkids[i], date).then(function(val) {
            console.log("val gotten");
            console.log(val);
            fulfilled.push(val);
        }).catch(function(err) {
            console.log("error");
            console.log(err);
        });
    }

}


function pad(length, val) {
    var str = val.toString();
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

todayShowtime();