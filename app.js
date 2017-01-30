var express = require('express');
var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');
var app = express();

var blizz_key = 'bggrux4vtw3yscw5n92cydvgrx8gycpz';

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log(' –\nApp listening on port 3000!')
})

function getAuctionHouseData(server = 'malganis') {
  var currentTime = Date.now();
  console.log("Request sent @ " + new Date().toLocaleTimeString('en-GB'));

  request('https://us.api.battle.net/wow/auction/data/' + server + '?locale=en_US&apikey=' + blizz_key,
            function(error, response, body) {
              var responseBody = JSON.parse(body);
              var lastModified = responseBody['files'][0]['lastModified'];
              var json_url = responseBody['files'][0]['url'];

              console.log(json_url);
              console.log("Seconds to AH update: " + (300 - ((currentTime - lastModified)/1000)));

              if (currentTime - lastModified > 300000) {
                console.log('\tPreparing to download AH data...');
                var currDate = new Date();
                var dateString = "" + currDate.getFullYear() + "."
                                    + currDate.toLocaleDateString('en-GB', { month: '2-digit' }) + "."
                                    + currDate.getDate() + "-"
                                    + currDate.toLocaleTimeString('en-GB', { hour12: false }).split(":").join("");

                var folder = './Auction Data/' + server + '/';
                var filename = dateString + ".json";

                /*** Make Server folder for AH data ***/
                mkdirp(folder, function (err) {
                  if (err) {
                    console.error(err)
                  } else {
                    console.log('\tCreating \'' + server + '\' server folder.');
                  }
                });

                /*** Download and write json data to file ***/
                request(json_url, function(error, response, body) {
                  fs.writeFile(folder + filename, body,
                    function(err) {
                      if(err) {
                        console.log(err);
                      }
                    });

                  console.log('\tFile written successfully.');
                });
              }

            });

  console.log('Sent.');

}

getAuctionHouseData();
// setInterval(getAuctionHouseData, 300000);
