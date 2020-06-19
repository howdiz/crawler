const got = require('got');
const cheerio = require('cheerio');
const createTextVersion = require("textversionjs");

const url = "https://www.moovweb.com/";
const keyword = /.{10}XDN/g;

var linksCrawled = [];


function getUrl (url) {
    if (!linksCrawled.includes(url)) {
        console.log(url);
        linksCrawled.push(url);
        got(url)
        .then((response) => {
            const body =  response.body;
            outputKeywordContext(body, keyword);
            getLinks(body, url);
        })
        .catch((error) => {
            console.log(error);
        });
    }
}

  function outputKeywordContext(content, keyword ) {
    const pageText = createTextVersion(content);
    const keywords = pageText.match(keyword);
    console.log(keywords);
  }

  function getLinks (content, url) {
    $ = cheerio.load(content);
    allLinks = $('a');
    $(allLinks).each(function(i, link){
        let href = $(link).attr('href');
        //TODO Handle relative links
        if( href && href.startsWith(url) ) {
            getUrl(href);
        }
      });
}

getUrl(url);
