const Nightmare = require('nightmare');
const cheerio = require('cheerio');

const nightmare = Nightmare({ show: true })
const url = 'https://miaminutrition.miamioh.edu/NetNutrition/MU';

// Request making using nightmare
nightmare
  .goto(url)
  .wait('body')
  .click('#cbo_nn_unitImages_11 > div.card-header.unit__link-bar--horizontal > a')
    .wait(3000)
  .evaluate(() => document.querySelector('body').innerHTML)
  .end()
  .then(response => {
    console.log(getData(response));
  }).catch(err => {
    console.log(err);
  });

// Parsing data using cheerio
let getData = html => {
  data = [];
  const $ = cheerio.load(html);
    $('#cbo_nn_childUnitDataList > div').each(function(row, raw_element) {
        $(raw_element).find(':nth-child(1)').each(function(i, elem) {
            let name = $(elem).find('div.card-header.unit__link-bar--horizontal').find('a').text(); //////// YOU GOT THIS WORKING KINDA BUT NOW IT JUST HAS TO FIND THE ACTUAL INFORMATION LOL JUST RUN IT AGAIN
            let script = $(elem).find('div.card-header.unit__link-bar--horizontal').find('a').attr('onclick');
            let description = $(elem).find('div.list-group-item.unit__description').text();

            let obj = (o => o.name === name);
            
            if(data.findIndex(obj) == -1) {
                if(name) {
                    data.push(new Facility(name, description, script))
                }
            }
        })
    })
  return data;
}

class Facility {
    constructor(name, description, script) {
        this.name = name;
        this.description = description;
        this.selector = '#cbo_nn_unitImages_' + script.match(/(\d+)/)[0] + ' > div.card-header.unit__link-bar--horizontal > a';
        this.script = script;
        this.subFacilities = [];
    }
}