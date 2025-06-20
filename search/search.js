const { PlayerSearchResult } = require("./types/types");
const { Track } = require("./Structures/Track");
const { Innertube, UniversalCache } = require("youtubei.js");
const e = require("express");

/** CODE TAKEN FROM DISCORD MUSIC PLAYER */
/**
 * Search tracks
 * @param {string|Track} query The search query
 * @returns {Promise<PlayerSearchResult>}
 */
async function search(query, verbose = false) {
  try {
    const innertube = await Innertube.create({
      cache: new UniversalCache(true),
    });
    const ytMusic = innertube.music;
    //   console.log(query)
    const data = await ytMusic.search(query, {
      type: "song",
    });
    //   const videos = data["contents"][0]["contents"];
    const musicShelf = data["contents"].filter(
      (el) =>
        el.type == "MusicShelf" &&
        el.title &&
        Array.isArray(el.title.runs) &&
        el.title.runs.some((run) => run.text == "Songs")
    )[0];

    const videos = musicShelf?.contents;

    //   console.log(query);

    //   fs.writeFileSync('data.json', JSON.stringify(videos, null, 2))

    //   console.log(JSON.stringify(videos, null, 2));

      if(verbose) require("fs").writeFileSync("data.json", JSON.stringify(data, null, 2));

    //   return videos

    if (!videos || videos.length === 0) {
      return { playlist: null, tracks: [] };
    }

    const tracks = videos.map((m) => {
      // console.log(JSON.stringify(m))
      return new Track({
        title: m.title,
        description: m.description || "",
        author: m.artists.map((artist) => artist.name).join(", "),
        url: m.url || `https://music.youtube.com/watch?v=${m.id}`,
        id: m.id,
        requestedBy: null,
        thumbnail:
          m?.thumbnail?.contents?.sort(
            (a, b) => a.height * a.width > b.height * b.width
          )[0].url || "",
        views: m.views || 0,
        duration: m.duration.text || "0:00",
        source: "youtube-music",
        album: {
          name: m.album.name,
          id: m.album.id,
        },
        raw: m,
      });
    });

    return { playlist: null, tracks };
  } catch (e) {
    console.log(e);
    return { playlist: null, tracks: [] };
  }
}

// If the file is run directly, run the function
if (require.main === module) {
  const query = "Taylor Swift - Champagne Problems";
  search(query, true).then((res) => {
    console.log(res);
  });
}

module.exports = {
  search,
};
