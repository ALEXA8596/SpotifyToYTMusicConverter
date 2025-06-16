var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
const { getData, getPreview, getTracks, getDetails } =
  require("spotify-url-info")(fetch);

/* GET convert. */
router.get("/", async function (req, res, next) {
  const queryParams = new URLSearchParams(req.query);

  if (queryParams.get("url")) {
    try {
      const data = await getData(queryParams.get("url"));
      console.log(data)
      return res.render("convert", {
        playlistData: data,
        playlistExists: true,
        title: "Spotify Converter"
      });
    } catch {}
  }
  res.render("convert", {
    playlistData: null,
    playlistExists: false,
    error: "No URL Provided",
    title: "Spotify Converter"
  });
});

module.exports = router;
