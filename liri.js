require("dotenv").config();

let keys      = require("./keys.js"),
    Twitter   = require("twitter"),
    // spotify   = new Spotify(keys.spotify),
    client    = new Twitter(keys.twitter),

    request   = require("request-promise"), 
    inquirer  = require("inquirer"),
    fs        = require("fs"),

    command   = process.argv.slice(2, 3).join("+"),
    media     = process.argv.slice(3).join("+");

function cobraCommander (command, media) {
    switch(command){
        case "my-tweets":
            myTweets();
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
            inquirer.prompt([
                {
                    type: "list", 
                    message: "Choose one of the following:",
                    choices: ["my-tweets", "movie-this", "do-what-it-says"],
                    name: "userChoice"
                }
            ]).then(answer => {
                    if ( answer.userChoice === "my-tweets" ) {
                        myTweets();
                    } else if ( answer.userChoice === "movie-this" ) {
                        movieThis("Mr. Nobody");
                    } else if ( answer.userChoice === "do-what-it-says" ) {
                        doWhatItSays();    
                    }
                });
    //END OF: switch(command){        
    };
//END OF: function cobraCommander (command, media) {
}

cobraCommander(command, media);

function movieThis (media) { 
    request("http://www.omdbapi.com/?t=" + media + "&r=json&plot=short&apikey=d7c06f12")
    .then(response => {
        let data = JSON.parse(response);
        console.log(data.Title);
        console.log(data.Year);
        console.log(data.Ratings[0].Value);        
        console.log(data.Ratings[1].Value);
        console.log(data.Country);
        console.log(data.Language);
        console.log(data.Plot);
        console.log(data.Actors);
    }) 
//END OF: function movieThis (media) {
}

function myTweets(){
    var params = {screen_name: 'avian_escudo', count: 20};
    client.get('statuses/user_timeline', params)
    .then(function (tweets) {
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].created_at);
            console.log(tweets[i].text);
        }
    })
    .catch(function (error) {
        throw error;
    })
//END OF: function myTweets(){
}

function doWhatItSays () {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
            command = dataArr[0];
            media   = dataArr[1];
        cobraCommander(command, media);        
    })
//END OF: function doWhatItSays () {
}