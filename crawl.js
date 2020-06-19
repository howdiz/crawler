const got = require('got');
const cheerio = require('cheerio');
var createTextVersion = require("textversionjs");

const url = "https://www.moovweb.com/";

got(url)
  .then((response) => {
    const pageText = createTextVersion(response.body);
    const keywords = pageText.match(/XDN/g);
    console.log(keywords);
  })
  .catch((error) => {
    console.log(error);
  });
