import pianist from "./pianist";
import partner from "./pianist/keys";

var requestor = function() {
  throw new Error("Request is not set");
};

export function login(email, password) {
  return new Promise(function(resolve, reject) {
    pianist(partner, email, password).then(function(doRequest) {
      requestor = doRequest;
      resolve();
    });
  });
}

export function stationList() {
  return new Promise(function(resolve, reject) {
    requestor(false, "user.getStationList", {}).then(function(res) {
      var simpleStations = res.stations.map(simpleStation);
      resolve(simpleStations);
    });
  });
}

export function getPlaylist(stationToken) {
  return new Promise(function(resolve, reject) {
    var data = {
      additionalAudioUrl: "HTTP_128_MP3",
      stationToken: stationToken,
    };
    requestor(true, "station.getPlaylist", data).then(function(res) {
      var songs = res.items.map(simpleSong);
      resolve(songs);
    });
  });
}

// Private helper functions

function simpleStation(raw) {
  return {
    dateCreated: new Date(raw.dateCreated.time),
    detailUrl: raw.stationDetailUrl,
    id: raw.stationId,
    name: raw.stationName,
    token: raw.stationToken,
  };
}

function simpleSong(raw) {
  return {
    album: {
      detailUrl: raw.albumDetailUrl,
      id: raw.albumIdentity,
      imageUrl: raw.albumArtUrl,
      name: raw.albumName,
    },
    artist: {
      detailUrl: raw.artistDetailUrl,
      name: raw.artistName,
    },
    detailUrl: raw.songDetailUrl,
    id: raw.songIdentity,
    name: raw.songName,
    rating: raw.songRating,
    url: raw.additionalAudioUrl,
  };
}
