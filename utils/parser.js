import cheerio from 'cheerio';

export default class DataParsing {

    getDataTimeTable(html) {
        console.log(html);
        const $ = cheerio.load(html);
        let header = $('body > div.navbar.navbar-static-top').text();
        return header;
    }
}
