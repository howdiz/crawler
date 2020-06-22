/* eslint-disable no-debugger, no-console */
const got = require('got');
const cheerio = require('cheerio');
const createTextVersion = require('textversionjs');
const async = require('async');

const site = 'https://www.apple.com';
const keyWord = 'new';

const pages = {};

function getKeywordInstances(content, word) {
  const wordReg = new RegExp(`.{3}${word}.{3}`, 'gi');
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
      } else if (href.indexOf('//') === -1 && href.indexOf('tel') === -1) {
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
    async.each(l1Links,
      (url, callback) => {
        got(url)
          .then((response) => {
            pages[url] = getKeywordInstances(response.body, keyWord);
            callback();
          }).catch((error) => {
            console.log(error);
          });
      },
      (error) => {
        let pagesWithTerm = 0;
        for (const page in pages) {
          if (pages[page]) {
            pagesWithTerm++;
          }
        }
        console.log(`Crawled ${Object.keys(pages).length} pages.`);
        console.log(`Found ${pagesWithTerm} pages with the term: ${keyWord}`);
        console.log(pages);
      });
  })
  .catch((error) => {
    console.log(error);
  });
