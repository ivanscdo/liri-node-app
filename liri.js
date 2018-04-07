require("dotenv").config();

const os        = require('os'),
      userInfo  = os.userInfo(),

      keys      = require("./keys.js"),
      Twitter   = require("twitter"),
      // spotify   = new Spotify(keys.spotify),
      client    = new Twitter(keys.twitter),

      request   = require("request-promise"), 
      inquirer  = require("inquirer"),
      fs        = require("fs");

var command     = process.argv.slice(2, 3).join("+"),
    media       = process.argv.slice(3).join("+");

function myTweets(media){
    var params = {screen_name: media, count: 20};

    client.get('statuses/user_timeline', params)
    .then(function (tweets) {
        for (var i = 0; i < tweets.length; i++) {
            console.log(`${tweets[i].created_at}`);
            console.log(`${tweets[i].text}
            `)
        //END OF: for (var i = 0; i < tweets.length; i++) {
        }
    //END OF: .then(function (tweets) {
    })
    .catch(function (error) {
        console.log(``);        
        console.log(`Sorry, something went wrong ¯\\_(ツ)_/¯
        `);
        console.log(`Refer to error below:
        `);
        
        throw error;
    //END OF: .catch(function (error) {
    })
//END OF: function myTweets(){
}

function movieThis (media) {
    if(!media)
        media = "Mr Nobody";

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
    .catch(function (error) {
        console.log(``);
        console.log(`Sorry, something went wrong ¯\\_(ツ)_/¯
        `);        
        console.log(`Refer to the error below:
        `);
        
        throw error;
    //END OF: .catch(function (error) {
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

        if ( command === "movie-this"){
            command = movieThis;
            thatSoFetch(command, media);            
        } else if ( command === "my-tweets") {
            command = myTweets;
            thatSoFetch(command, media);
        } else {
            console.log(``);
            console.log(`Sorry, something went wrong in random.txt ¯\\_(ツ)_/¯`);
            console.log(`Use the following formats: movie-this,"<your favorite movie>"`);
            console.log(`                           my-tweets,"<any twitter username>"`);
            console.log(``);            
        }

    })
//END OF: function doWhatItSays () {
}

function inquirerPrompt () {
    inquirer.prompt([
        {
            type: "list", 
            message: `Hi ${userInfo.username}, choose one of the following:`,
            choices: ["my-tweets", "movie-this", "do-what-it-says"],
            name: "userChoice"
        }
    ]).then(answerMain => {
            if ( answerMain.userChoice === "my-tweets" ) {
                return inquirer.prompt(
                    {
                        type: "input", 
                        name: "tweetInput", 
                        message: `Give me a twitter username, for example: Trilogyedu.\n  Or simply hit enter to retrieve your tweets!`
                    }
                ).then( answerTweet => {
                    // myTweets(answerTweet.tweetInput);
                    thatSoFetch(myTweets, answerTweet.tweetInput);
                })
            } else if ( answerMain.userChoice === "movie-this" ) {
                return inquirer.prompt(
                    {
                        type: "input", 
                        name: "movieInput", 
                        message: "What's your favorite movie?"
                    }
                ).then( answerMovie => {
                    // movieThis(answerMovie.movieInput);
                    thatSoFetch(movieThis, answerMovie.movieInput);
                })
            } else if ( answerMain.userChoice === "do-what-it-says" ) {
                doWhatItSays();
                // thatSoFetch(doWhatItSays);
            }
        //END OF: ]).then(answer => {
        });
//END OF: function inquirerPrompt () {
}

function thatSoFetch(command, media) {
    
    let helloGoodbye = {
      hello: function () {
         console.log(`Hi ${userInfo.username}!`);
      },
      fetch: function () {
        console.log(`Let me fetch that for you. Just a moment.`);
      },
      load: function () {
        console.log('\033c'); 
        console.log(".");
      },
      loading: function () {
        console.log('\033c'); 
        console.log("..");
      }, 
      loaded: function () {
        console.log('\033c'); 
        console.log("...");
      }, 
      loadest: function () {
        console.log('\033c');
      }
    };

    // helloGoodbye.hello();
    setTimeout(helloGoodbye.fetch, 1000);
    setTimeout(helloGoodbye.load, 3000);
    setTimeout(helloGoodbye.loading, 4000);
    setTimeout(helloGoodbye.loaded, 5000);
    setTimeout(helloGoodbye.loadest, 6000);
    setTimeout(command, 6000, media);
    
};

function cobraCommander (command, media) {
    switch(command){
        case "my-tweets":
            // myTweets(media);
            console.log(`Hi ${userInfo.username}!`);
            thatSoFetch(myTweets, media);            
            break;
        case "movie-this":
            console.log(`Hi ${userInfo.username}!`);
            thatSoFetch(movieThis, media);                
            break;
        case "do-what-it-says":
            console.log(`Hi ${userInfo.username}!`); 
            doWhatItSays();
            // thatSoFetch(doWhatItSays);            
            break;
        default:
            inquirerPrompt();
            
    //END OF: switch(command){        
    };
//END OF: function cobraCommander (command, media) {
}

cobraCommander(command, media);