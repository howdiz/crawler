/* eslint-disable no-debugger, no-console */
const got = require('got');
const cheerio = require('cheerio');
const createTextVersion = require('textversionjs');

const site = 'https://www.moovweb.com/';

const keyWord = /.{10}XDN/g;

const l1 = { url: site };

function getKeywordInstanes(content, key) {
  const pageText = createTextVersion(content);
  return pageText.match(key);
}

function getLinks(content, url) {
  const $ = cheerio.load(content);
  const anchors = $('a');

  const links = [];
  $(anchors).each((i, link) => {
    const href = $(link).attr('href');
    if (href && href.startsWith(url)) {
      links.push(href);
    }
  });
  return links;
}

got(site)
  .then((response) => {
    const { body } = response;
    l1.keyInstances = getKeywordInstanes(body, keyWord);
    l1.links = getLinks(body, site);
    console.log(l1);
  })
  .catch((error) => {
    console.log(error);
  });
