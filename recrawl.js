/* eslint-disable no-debugger, no-console */
const got = require('got');
const cheerio = require('cheerio');
const createTextVersion = require('textversionjs');

var site = 'https://www.apple.com';
const keyWord = 'pro';

var pages = {};


console.log(site);

function getKeywordInstances(content, word) {
  const wordReg = new RegExp('.{3}' + word + '.{3}', 'gi');
  const pageText = createTextVersion(content);
  return pageText.match(wordReg);
}

function getLinks(content, url) {
  const $ = cheerio.load(content);
  const anchors = $('a');
  const links = [];
  $(anchors).each((i, link) => {
    const href = $(link).attr('href');
    if (href && !links.includes(href)) { 
      if (href.startsWith(url)) {
        links.push(href);
      } else if (href.indexOf('//') === -1) {
        links.push(site + href);
      }
    }
  });
  return links;
}

got(site)
  .then((response) => {
    pages[site] = getKeywordInstances(response.body, keyWord);
    return getLinks(response.body, site);
  })
  .then((l1Links) => {
    for (const url of l1Links) {
      got(url).then((response) => {
        console.log(url);
        console.log(getKeywordInstances(response.body, keyWord));
      });
    }
  })
  .catch((error) => {
    console.log(error);
  });
