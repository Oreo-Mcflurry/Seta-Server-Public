var axios = require("axios");

async function fetchTags(value) {
    const kpopGenres = [
      "k-pop",
      "Kpop",
      "Korean",
      "Korean Pop",
      "Kpop Star",
      "korean indie",
      "korean rock",
    ];
  
    const popGenres = [
      "pop",
      "dance-pop",
      "pop rock",
      "alternative pop",
      "electro pop",
      "synthpop",
      "electropop",
      "power pop",
      "indie pop",
      "pop punk",
      "pop rap",
    ];
  
    const hipHopRapGenres = [
      "Hip-Hop",
      "rap",
      "hiphop",
      "trap",
      "emo rap",
      "southern hip hop",
      "hiphop",
      "hip hop",
      "drill",
      "UK Drill",
      "Grime",
      "Korean Hip-Hop",
      "Korean rap",
      "K-RAP",
      "khh",
      "k-hiphop",
    ];
  
    const rnbSoulGenres = [
      "rnb",
      "soul",
      "alternative rnb",
      "contemporary rnb",
      "r&b",
      "slow jams",
      "neo-soul",
    ];
  
    const rockAlternativeGenres = [
      "rock",
      "pop rock",
      "alternative",
      "indie",
      "indie rock",
      "alternative rock",
      "progressive rock",
      "post-rock",
      "korean indie",
      "korean rock",
    ];
  
    const metalGenres = [
      "melodic death metal",
      "black metal",
      "heavy metal",
      "metalcore",
      "doom metal",
      "death metal",
      "thrash metal",
      "punk",
      "punk rock",
      "post-punk",
      "hardcore",
      "post-hardcore",
    ];
  
    const electronicGenres = [
      "electronic",
      "techno",
      "house",
      "EDM",
      "electro house",
      "trance",
      "dubstep",
      "chillwave",
      "ambient",
      "minimal",
      "lo-fi",
      "drum and bass",
      "liquid funk",
      "synthwave",
    ];
  
    const countryFolkGenres = [
      "country",
      "country rap",
      "folk",
      "folk pop",
      "country pop",
    ];
  
    const jpopJrockGenres = [
      "j-pop",
      "japanese",
      "JPop",
      "J-rock",
      "J-urban",
      "J-Punk",
    ];
  
    try {
      const response = await axios.get(
        `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${value}&api_key=API-Key&format=json`
      );
      const data = response.data.artist.tags.tag;
      const tagNames = data.map((tag) => tag.name);
      var returnTags = new Set();
      for (const tag of tagNames) {
        if (kpopGenres.includes(tag)) {
          returnTags.add("K-Pop");
        } else if (popGenres.includes(tag)) {
          returnTags.add("Pop");
        } else if (hipHopRapGenres.includes(tag)) {
          returnTags.add("Hip-Hop");
        } else if (rnbSoulGenres.includes(tag)) {
          returnTags.add("R&B");
        } else if (rockAlternativeGenres.includes(tag)) {
          returnTags.add("Rock");
        } else if (metalGenres.includes(tag)) {
          returnTags.add("Metal");
        } else if (electronicGenres.includes(tag)) {
          returnTags.add("Electronic");
        } else if (countryFolkGenres.includes(tag)) {
          returnTags.add("Country/Folk");
        } else if (jpopJrockGenres.includes(tag)) {
          returnTags.add("J-Pop");
        } else {
          continue;
        }
      }

      if (returnTags.has("K-Pop") && returnTags.has("Pop")) {
        returnTags.delete("Pop");
      }
  
      return Array.from(new Set(returnTags));
    } catch (error) {
      console.error(`Error fetching data for ${value}:`, error.message);
    }
  }

  module.exports = fetchTags;