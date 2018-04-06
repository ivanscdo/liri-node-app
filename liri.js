require("dotenv").config();

const os = require('os');

let keys      = require("./keys.js"),
    Twitter   = require("twitter"),
    // spotify   = new Spotify(keys.spotify),
    client    = new Twitter(keys.twitter),

    request   = require("request-promise"), 
    inquirer  = require("inquirer"),
    fs        = require("fs");

var command   = process.argv.slice(2, 3).join("+"),
    media     = process.argv.slice(3).join("+");

function myTweets(media){
    var params = {screen_name: media, count: 20};
    client.get('statuses/user_timeline', params)
    .then(function (tweets) {
        for (var i = 0; i < tweets.length; i++) {
            console.log(`${tweets[i].created_at}
${tweets[i].text}
            `);
        //END OF: for (var i = 0; i < tweets.length; i++) {
        }
    //END OF: .then(function (tweets) {
    })
    .catch(function (error) {
        throw error;
    })
//END OF: function myTweets(){
}

function movieThis (media) { 
    request("http://www.omdbapi.com/?t=" + media + "&r=json&plot=short&apikey=d7c06f12")
    .then(response => {
        let data       = JSON.parse(response),
            plot       = data.Plot,
            lineLength = 45,
            plotLines = plot.length/lineLength,
            plotCeil   = Math.ceil(plotLines),
            subStart   = 0,
            subEnd     = lineLength,
            subCount   = 0;

        function plotMaker() {
            for ( let i = 0; i < plotCeil; i++ ) {
                let line_i   = plot.substring(subStart, subEnd);

                    subStart = subEnd;
                    subEnd   = subEnd + lineLength;

                if (subCount===0){
                    console.log(`            Plot:                  ${line_i}`);
                    subCount++;
                } else {
                    console.log(`                                   ${line_i}`);
                }
            //END OF: for ( let i = 0; i < plotCeil; i++ ) {
            }
        //END OF: function plotMaker() {
        }

        console.log(`
            Title:                 ${data.Title}
            Release Year:          ${data.Year} 
            IMBD:                  ${data.Ratings[0].Value}
            Rotten Tomatoes:       ${data.Ratings[1].Value}
            Country of Origin:     ${data.Country}
            Language:              ${data.Language}
            Actors:                ${data.Actors}`);
        plotMaker();
        console.log(`\n`);
    //END OF: .then(response => {
    }) 
//END OF: function movieThis (media) {
}

function doWhatItSays () {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) 
            return console.log(error);
        
        let dataArr = data.split(",");
        var command = dataArr[0],
            media   = dataArr[1];

        cobraCommander(command, media);        
    })
//END OF: function doWhatItSays () {
}

function inquirerPrompt () {
    inquirer.prompt([
        {
            type: "list", 
            message: "Choose one of the following:",
            choices: ["my-tweets", "movie-this", "do-what-it-says"],
            name: "userChoice"
        }
    ]).then(answerMain => {
            if ( answerMain.userChoice === "my-tweets" ) {
                // console.log(answer);
                // myTweets();
                return inquirer.prompt(
                    {
                        type: "input", 
                        name: "tweetInput", 
                        message: "Give me a twitter username, for example: Trilogyedu. Or simply hit enter to retrieve your tweets!"
                    }
                ).then( answerTweet => {
                    myTweets(answerTweet.tweetInput)
                })
            } else if ( answerMain.userChoice === "movie-this" ) {
                return inquirer.prompt(
                    {
                        type: "input", 
                        name: "movieInput", 
                        message: "What's your favorite movie?"
                    }
                ).then( answerMovie => {
                    movieThis(answerMovie.movieInput);
                })
                // movieThis("Mr. Nobody");
            } else if ( answerMain.userChoice === "do-what-it-says" ) {
                doWhatItSays();    
            }
        //END OF: ]).then(answer => {
        });
//END OF: function inquirerPrompt () {
}

function thatSoFetch() {
    var userInfo = os.userInfo();
    console.log(`Hi ${userInfo.username}!`);
    // function fetchThat () {
    //     console.log(`Let me fetch that for you. Just a moment.`);
    // }
    // function loading () {
    //     console.log(`...`);
    // }
    let fetchThat = setTimeout( function(){
        console.log(`Let me fetch that for you. Just a moment.`);
    }, 1000 * 2),
        loading = setInterval(function(){
        console.log(`...`);      
        }, 1000);
    // clearInterval(loading);
}

function cobraCommander (command, media) {
    switch(command){
        case "my-tweets":
            myTweets(media);
            break;
        case "movie-this":
            if (media) {
                movieThis(media);
            } else {
                movieThis("Mr. Nobody");
            };
            break;
        case "do-what-it-says": 
            doWhatItSays();    
            break;
        default:
            inquirerPrompt();
            
    //END OF: switch(command){        
    };
//END OF: function cobraCommander (command, media) {
}

// cobraCommander(command, media);

thatSoFetch();