require("dotenv").config();
let keys    = require("keys.js"),
    spotify = new Spotify(keys.spotify),
    client  = new Twitter(keys.twitter);

