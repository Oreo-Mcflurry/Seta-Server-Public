const axios = require("axios");

function APIRequest(url, httpMethod, headers, callback) {
  axios({
    method: httpMethod,
    url: url,
    headers: headers,
  })
    .then((response) => {
      const decodedData = response.data;
      callback(decodedData);
    })
    .catch((error) => {
      console.error(error);
      callback(null);
    });
}

function searchArtistFromMusicbrainz(artistName, callback) {
  const url = `https://musicbrainz.org/ws/2/artist?query=${artistName}&fmt=json`;
  const headers = {
    Authorization: "API-Key",
  };

  APIRequest(url, "GET", headers, callback);
}

function searchArtistFromGenius(artistName, callback) {
  const url = `https://api.genius.com/search?q=${artistName}`;

  const headers = {
    Authorization:
      "Bearer API-Key",
  };

  APIRequest(url, "GET", headers, callback);
}

module.exports = {
    searchArtistFromMusicbrainz,
    searchArtistFromGenius,
  };