const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");

const { connectToMongoDB, closeMongoDBConnection, overwriteCollection } = require("./mongodb");
const { searchArtistFromMusicbrainz, searchArtistFromGenius } = require("./apiRequests");
const { delay } = require("./utils");
const getImageUrl = require("./getImageUrl");
const fetchTags = require("./fetchTags");

const fs = require("fs");
const { resolve } = require("path");
const { isPromise } = require("util/types");
const { time } = require("console");

var parsing_artists = new Set();

async function crawlingArtist(database) {
    const korea_url = "https://kworb.net/spotify/country/kr_daily_totals.html";
    await request(korea_url, function (error, response, html) {
      if (!error) {
        var $ = cheerio.load(html);
        $("tbody tr").each(function (index, element) {
          var artistElement = $(element).find("td:eq(0) a");
          var artistName = artistElement.contents().first().text().trim();
          parsing_artists.add(artistName);
        });
      }
      fetchdata(database);
    });
  }
  
  async function fetchdata(database) {
    for (item of parsing_artists) {
      var mbid = "";
      var alias = "";
      var url = "";
      var gid = 0;
      var country = "";
      var tags = await fetchTags(item);
      console.log(item,tags);

      // Musicbrainz API 호출
      await new Promise((resolve) => {
        searchArtistFromMusicbrainz(item, (data) => {
          if (data) {
            mbid = data.artists[0].id;
            country = data.artists[0].area.name;
            alias = data.artists[0].aliases[0].name;
          } else {
            console.log("Error fetching data from Musicbrainz.");
          }
          resolve();
        });
      });
  
      if (mbid == "") {
        continue;
      }
  
    // Genius API 호출
      await new Promise((resolve) => {
      for (const searchItem of [item, alias]) {
        searchArtistFromGenius(searchItem, (data) => {
          if (data) {
            gid = data.response.hits[0].result.primary_artist.id;
            for (const hit of data.response.hits) {
              const name = hit.result.primary_artist.name.toLowerCase().replace(/\s+/g, '');
              const itemLower = item.toLowerCase().replace(/\s+/g, '');
              const aliasLower = alias.toLowerCase().replace(/\s+/g, '');
              console.log(name, itemLower, aliasLower);
              if(name == itemLower || name == aliasLower || 
                extractTextBeforeParentheses(name, itemLower) || 
                extractTextBeforeParentheses(name, aliasLower) || 
                extractTextInsideFirstParentheses(name, itemLower) || 
                extractTextInsideFirstParentheses(name, aliasLower) ||
                removeFirstParentheses(name, itemLower) || 
                removeFirstParentheses(name, aliasLower)) {
                url = hit.result.primary_artist.image_url;
                console.log(url);
                break;
              }
            }
          } else {
            console.log("Error fetching data from Genius.");
          }
          resolve();
        });

        if (url != "") {
          break;
        } else {
          delay(2000);
        }
      }
      });

      if (url == "") {
        url = await getImageUrl(item);
      }

      await new Promise((resolve) => {
        insertDataIntoMongoDB(database, {
            name: item,
            mbid,
            alias,
            url,
            gid,
            country,
            tags,
          });
          resolve();
      });
      console.log("-------------------------");
      await delay(2000);
    }
    overwriteCollection();
  }

  async function main() {
    const database = await connectToMongoDB();
    try {
      await new Promise((resolve) => {
       crawlingArtist(database);
       resolve();
      });
    } finally {
      
    }
  }

  async function insertDataIntoMongoDB(database, data) {
    const collection = database.collection("TempArtist");
    try {
      const result = await collection.insertOne(data);
      console.log(`Inserted document with _id: ${result.insertedId}`);
    } catch (error) {
      console.error("Error inserting data into MongoDB:", error.message);
    }
  }

// 첫 번째 괄호 이전의 텍스트를 추출
function extractTextBeforeParentheses(input, item) {
  const openingParenIndex = input.indexOf("(");
  if (openingParenIndex !== -1) {
    const textBeforeParentheses = input.substring(0, openingParenIndex).trim();
    console.log(textBeforeParentheses, item);
    return textBeforeParentheses == item;
  } else {
    return input == item;
  }
}

// 첫 번째 괄호 사이의 텍스트를 추출
function extractTextInsideFirstParentheses(input, item) {
  const openingParenIndex = input.indexOf("(");
  const closingParenIndex = input.indexOf(")");

  if (openingParenIndex !== -1 && closingParenIndex !== -1 && openingParenIndex < closingParenIndex) {
    const textInsideParentheses = input.substring(openingParenIndex + 1, closingParenIndex).trim();
    console.log(textInsideParentheses, item);
    return textInsideParentheses == item;
  } else {
    return input == item;
  }
}

//  첫 번째 괄호를 제거
function removeFirstParentheses(input, item) {
  const openingParenIndex = input.indexOf("(");
  const closingParenIndex = input.indexOf(")");

  if (openingParenIndex !== -1 && closingParenIndex !== -1 && openingParenIndex < closingParenIndex) {
    const modifiedString = input.slice(0, openingParenIndex) + input.slice(closingParenIndex + 1);
    console.log(modifiedString.trim(), item);
    return modifiedString.trim() == item;
  } else {
    return input == item;
  }
}


module.exports = main;