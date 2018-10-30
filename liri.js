require("dotenv").config();

var keys = require("./keys");

var Spotify = require("node-spotify-api");

var request = require("request");

var moment = require("moment");

var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var getArtistNames = function(artist) {
    return artist.name;
  };

  var getMeSpotify = function(songName) {
    if (songName === undefined) {
      songName = "Just Friends";
    }
  
    spotify.search(
      {
        type: "track",
        query: songName
      },
      function(err, data) {
        if (err) {
          console.log("Error occurred: " + err);
          return;
        }
  
        var songs = data.tracks.items;
  
        for (var i = 0; i < songs.length; i++) {
          console.log(i);
          console.log("artist(s): " + songs[i].artists.map(getArtistNames));
          console.log("song name: " + songs[i].name);
          console.log("preview song: " + songs[i].preview_url);
          console.log("album: " + songs[i].album.name);
          console.log("-----------------------------------");
        }
      }
    );
  };

  var getMyBands = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=d181df70f029efe5fb5706bae3492a47";
  
    request(queryURL, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
  
        if (!jsonData.length) {
          console.log("No results found for " + artist);
          return;
        }
  
        console.log("Upcoming concerts for " + artist + ":");
  
        for (var i = 0; i < jsonData.length; i++) {
          var show = jsonData[i];
  
          // Print data about each concert
          // If a concert doesn't have a region, display the country instead
          // Use moment to format the date
          console.log(
            show.venue.city +
              "," +
              (show.venue.region || show.venue.country) +
              " at " +
              show.venue.name +
              " " +
              moment(show.datetime).format("MM/DD/YYYY")
          );
        }
      }
    });
  };

  var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
  
      var dataArr = data.split(",");
  
      if (dataArr.length === 2) {
        pick(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        pick(dataArr[0]);
      }
    });
  };
  
  // Function for determining which command is executed
  var pick = function(caseData, functionData) {
    switch (caseData) {
    case "concert-this":
      getMyBands(functionData);
      break;
    case "spotify-this-song":
      getMeSpotify(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
    }
  };
  
  // Function which takes in command line arguments and executes correct function accordingly
  var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
  };
  
  // MAIN PROCESS
  // =====================================
  runThis(process.argv[2], process.argv.slice(3).join(" "));
  