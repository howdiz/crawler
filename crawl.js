const got = require('got');
const cheerio = require('cheerio');
var createTextVersion = require("textversionjs");

const url = "https://www.moovweb.com/";
const keyword = /.{10}XDN/g;

got(url)
  .then((response) => {
    const body =  response.body;
    outputKeywordContext(body, keyword);
    $ = cheerio.load(body);
    links = $('a');
    $(links).each(function(i, link){
        console.log($(link).attr('href'));
      });
  })
  .catch((error) => {
    console.log(error);
  });

  function outputKeywordContext(content, keyword ) {
    const pageText = createTextVersion(content);
    const keywords = pageText.match(keyword);
    console.log(keywords);

  }