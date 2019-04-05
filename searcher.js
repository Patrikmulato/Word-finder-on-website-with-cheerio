const request = require("request");
const cheerio = require("cheerio");
const colors = require("colors");

// Page url
const siteUrl = "#"; // Change site here IMPORTANT not include '/' at the end of the url

// Getting all the urls from home page
let urlList = [];
let filteredUrlList = [];

request(siteUrl, async (err, res, body) => {
  $ = cheerio.load(body);
  links = $("a");
  $(links).each((i, link) => {
    let href = $(link).attr("href");
    if (!href.includes("http") && href.includes("/")) {
      urlList.push(siteUrl + href);
    }
  });
  await filterUrls();
});

// Filter the list
const filterUrls = () => {
  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  filteredUrlList = urlList.filter(unique);
  scraper()
}

// Finding the word
let word = /#/i; // Change word here

const scraper = () => {
  console.log(colors.green(`Found ${filteredUrlList.length} page`));
  filteredUrlList.forEach(url =>
    request(url, (err, res, body) => {
      console.log(`requesting... ${url}`);
      $ = cheerio.load(body);
      let page = $(body).not('script').text();
      if (page.search(word) > 0) {
        console.log(colors.green(`Page contains the ${word} ${page.search(word)} time(s)`));
      }
    })
  );
};
