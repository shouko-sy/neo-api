const router = require("express").Router();
const cheerio = require("cheerio");
const replaceAnimePage = "https://neonime.watch/episode/";
const replaceMoviePage = "https://neonime.watch/";
const AxiosService = require("../helpers/axiosService");

// new anime list pagination  -------Done------
router.get("/episode/page/:pagenumber/", async (req, res) => {
  let pagenumber = req.params.pagenumber;
  let url =
    pagenumber === "1"
      ? "https://neonime.watch/episode/"
      : `https://neonime.watch/episode/page/${pagenumber}/`;

  try {
    const response = await AxiosService(url);
    console.log(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $("#episodes");
      let anime_list = [];
      let title, detailLink, endpoint, thumb;

      element.find(".list > tbody > tr").each((idx, el) => {
        title = $(el).find(".bb > a").text().trim();
        detailLink = $(el).find("a").attr("href");
        endpoint = $(el).find("a").attr("href").replace(replaceAnimePage, "");
        thumb = $(el).find(".imagen-td > a").find("img").attr("data-src");
        anime_list.push({
          title,
          detailLink,
          thumb,
          endpoint,
        });
      });
      return res.status(200).json({
        status: true,
        message: "success",
        anime_list,
      });
    }
    return res.send({
      message: response.status,
      anime_list: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      anime_list: [],
    });
  }
});
 
// detail anime page -------Done------
router.get("/episode/:endpoint", async (req, res) => {
  const endpoint = req.params.endpoint;
  console.log(endpoint);
  try {
    const response = await AxiosService(`/episode/${endpoint}`);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const elementA = $("#fixar");
      const elementB = $(".ladoB > .central > div:nth-child(8)");
      const obj = {};
      const list_link = [];
      const meta = {};

      let re = new RegExp(",", 'g');
      meta.thumb = elementA.find("img").attr("data-src");
      meta.releaseDate = elementA.find(".meta-a > p").text().trim();
      meta.season = elementA.find(".meta-b > span:nth-child(1)").text().split(" ")
        .reverse().toString().replace(re, " ").trim();
      meta.episode = elementA.find(".meta-b > span:nth-child(2)").text().split(" ")
        .reverse().toString().replace(re, " ").trim();

      elementB.find("ul:only-child > ul").each((idx, el) => {
        const label = $(el).find("li > label").text().trim();
        const type = label.toUpperCase().includes("MKV") ? "MKV" : "MP4";
        $(el).find("li > a").each((idx, el) => {
          list_link.push({
            type,
            label,
            name: $(el).text().trim(),
            link: $(el).attr("href"),
          });
        });
      });

      re = new RegExp("-", 'g');
      meta.title = endpoint.replace(re, " ");
      obj.meta = meta;
      obj.list_link = list_link;

      return res.status(200).json({
        status: true,
        message: "success",
        obj,
      });
    }
    return res.send({
      message: response.status,
      obj: {},
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      obj: {},
    });
  }
});

// Movie list pagination  -------Done------
router.get("/movies/page/:pagenumber/", async (req, res) => {
  let pagenumber = req.params.pagenumber;
  let url =
    pagenumber === "1"
      ? "https://neonime.watch/movies/"
      : `https://neonime.watch/movies/page/${pagenumber}/`;

  try {
    const response = await AxiosService(url);
    console.log(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(".peliculas");
      let movie_list = [];
      let title, detailLink, endpoint, thumb;

      element.find(".items > .item").each((idx, el) => {
        title = $(el).find(".fixyear > .judul-anime-movie > h2").text().trim();
        detailLink = $(el).find("a").attr("href");
        endpoint = $(el).find("a").attr("href").replace(replaceMoviePage, "");
        thumb = $(el).find("a").find("img").attr("data-src");
        movie_list.push({
          title,
          detailLink,
          thumb,
          endpoint,
        });
      });
      return res.status(200).json({
        status: true,
        message: "success",
        movie_list,
      });
    }
    return res.send({
      message: response.status,
      movie_list: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      movie_list: [],
    });
  }
});

// detail movie page -------Done------
router.get("/:endpoint", async (req, res) => {
  const endpoint = req.params.endpoint;
  console.log(endpoint);
  try {
    const response = await AxiosService(`/${endpoint}`);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const elementA = $("#uwee");
      const elementB = $(".s_left > div:nth-child(3)").first();
      const elementC = $(".s_left > div:nth-child(6) > div:last-child");
      const obj = {};
      const list_link = [];
      const meta = {};
      let genre = [];

      meta.title = elementA.find(".data > h1").text().trim();
      meta.thumb = elementA.find("img").attr("data-src");
      meta.type = elementA.find(".calidad2").text().trim();
      meta.releaseDate = elementA.find(".titulo_o > i:last-child").text().trim();
      meta.rating = `${elementA.find(".dato > a").text()} ${elementA.find(".dato > b:nth-child(2)").text()}${elementA.find(".dato > b:nth-child(3)").text()}`;
      elementA.find(".data > p:last-child > a").each((idx, el) => {
        genre.push($(el).text().trim());
      });
      meta.genre = genre;
      meta.desc = elementB.find("p").text().trim();


      elementC.find("ul:only-child > ul").each((idx, el) => {
        const label = $(el).find("li > label").text().trim();
        const type = label.toUpperCase().includes("MKV") ? "MKV" : "MP4";
        $(el).find("li > a").each((idx, el) => {
          list_link.push({
            type,
            label,
            name: $(el).text().trim(),
            link: $(el).attr("href"),
          });
        });
      });

      obj.meta = meta;
      obj.list_link = list_link;

      return res.status(200).json({
        status: true,
        message: "success",
        obj,
      });
    }
    return res.send({
      message: response.status,
      obj: {},
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      obj: {},
    });
  }
});

module.exports = router;
