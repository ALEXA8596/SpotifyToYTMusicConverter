var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
const { getData } = require("spotify-url-info")(fetch);
const { search } = require("../search/search.js");
const { v4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// Use a JSON file as a database
const dbFilePath = path.join(__dirname, "db.json");

// Initialize the database file if it doesn't exist
if (!fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, JSON.stringify({}));
}

// Helper functions to interact with the JSON database
const db = {
  read: () => {
    const data = fs.readFileSync(dbFilePath, "utf-8");
    return JSON.parse(data);
  },
  write: (newData) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(newData, null, 2));
  },
};

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
          error:
            "The URL Provided isn't a Playlist, or there's been an error with the API",
          title: "Spotify Converter",
        });
      }
      // console.log(data);
      const trackList = await Promise.all(
        data.trackList
          ?.filter((track) => track.entityType == "track")
          .map(async (el) => {
            let results = (await search(`${el.subtitle} - ${el.title}`))[
              "tracks"
            ];

            if (!results || results.length === 0) {
              console.log(
                `${el.title} wasn't found the first time, retrying...`
              );
              results = (await search(`${el.title} - ${el.subtitle}`))[
                "tracks"
              ];
            }
            if (!results || results.length === 0) {
              console.log(
                `${el.title} wasn't found the second time, retrying...`
              );
              results = (await search(`${el.title} - ${el.subtitle}`))[
                "tracks"
              ];
            }
            if (!results || results.length === 0) {
              console.log(
                `${el.title} wasn't found the third time, giving up...`
              );
              results = [];
            }
            return {
              title: el.title,
              artist: el.subtitle,
              results,
            };
          })
      );

      // console.log(await JSON.stringify(trackList, null, 2))

      return res.render("convert", {
        playlistData: {
          trackList,
          raw: data,
        },
        playlistExists: true,
        title: "Spotify Converter",
      });
    } catch (e) {
      throw e;
    }
  }
  res.render("convert", {
    playlistData: null,
    playlistExists: false,
    error: "No URL Provided",
    title: "Spotify Converter",
  });
});

router.post("/save", async function (req, res, next) {
  const playlistData = req.body;

  if (!playlistData || !Array.isArray(playlistData.trackList)) {
    return res.status(400).json({ error: "Invalid playlist data" });
  }

  const playlistId = `playlist_${v4()}`;
  const existingData = await db.read();
  existingData[playlistId] = playlistData;
  db.write(existingData);

  res.status(200).json({ message: "Playlist saved successfully", playlistId });
});

router.get("/callback", async function (req, res, next) {
  // this is the callback for the youtube playlist creation
  // https://oauth2.example.com/callback#access_token=4/P7q7W91&token_type=Bearer&expires_in=3600&state=state

  res.status(200).render("create", {
    title: "Create YouTube Playlist",
  });
});

router.get("/getPlaylistData/:playlistId", async function (req, res, next) {
  var { playlistId } = req.params;

  playlistId = "playlist_" + playlistId;

  const existingData = await db.read();

  if (!playlistId || !existingData[playlistId]) {
    console.log("Error");
    return res.status(404).json({ error: "Playlist not found" });
  }

  res.status(200).json({ playlistData: existingData[playlistId] });
});

module.exports = router;
