var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
const { getData, getPreview, getTracks, getDetails } =
  require("spotify-url-info")(fetch);
const { Innertube } = require('youtubei.js')

/* GET convert. */
router.get("/", async function (req, res, next) {
  const queryParams = new URLSearchParams(req.query);

  if (queryParams.get("url")) {
    try {
      const data = await getData(queryParams.get("url"));

      if (data.type != "playlist") {
        return res.render("convert", {
          playlistData: null,
          playlistExists: false,
          error: "The URL Provided isn't a Playlist, or there's been an error with the API",
          title: "Spotify Converter",
        });
      }
      console.log(data);
      const trackList = data.trackList?.filter(track => track.entityType == "track");


      return res.render("convert", {
        playlistData: data,
        playlistExists: true,
        title: "Spotify Converter",
      });
    } catch {}
  }
  res.render("convert", {
    playlistData: null,
    playlistExists: false,
    error: "No URL Provided",
    title: "Spotify Converter",
  });
});

module.exports = router;
