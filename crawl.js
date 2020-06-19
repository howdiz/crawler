const got = require('got');
const cheerio = require('cheerio');
const createTextVersion = require('textversionjs');

const url = 'https://www.moovweb.com/';

const keyword = /.{10}XDN/g;

const linksCrawled = [];

function outputKeywordContext(content, keyword) {
  const pageText = createTextVersion(content);
  const keywords = pageText.match(keyword);
  if (keywords) {
    console.log(keywords);
  }
}

function getLinks(content, url) {
  const $ = cheerio.load(content);
  const allLinks = $('a');
  $(allLinks).each((i, link) => {
    const href = $(link).attr('href');
    // TODO Handle relative links
    if (href && href.startsWith(url)) {
      getUrl(href);
    }
  });
}

function getUrl(url) {
  if (!linksCrawled.includes(url)) {
    console.log(url);
    linksCrawled.push(url);
    got(url)
      .then((response) => {
        const { body } = response;
        outputKeywordContext(body, keyword);
        getLinks(body, url);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

getUrl(url);
