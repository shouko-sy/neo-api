const router = require("express").Router();
const cheerio = require("cheerio");
const replaceAnimePage = "https://neonime.watch/episode/";
const AxiosService = require("../helpers/axiosService");

//newAnimeEps pagination  -------Done------
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


module.exports = router;
