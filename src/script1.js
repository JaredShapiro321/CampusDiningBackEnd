const Nightmare = require('./node_modules/nightmare');
const cheerio = require('./node_modules/cheerio');
const fs = require('./node_modules/fs');

const nightmare = Nightmare({show: true});
const url = 'https://miaminutrition.miamioh.edu/NetNutrition/MU';

// Request and pull data from base html

nightmare
    .goto(url)
    .wait('body')
    .evaluate(() => document.querySelector('body').innerHTML)
    .end()
    .then(response => {
        let facilities = getData(response);
    
        facilities.sort(compare);
    
        const jsonString = JSON.stringify(facilities, null, 2);
    
        fs.writeFile('./facilities.json', jsonString, err => {
            if (err) {
                console.log("Error writing file", err)
            } else {
                console.log("Successfully wrote file")
            }
        })
    })
    .catch(err => {
        console.log(err);
    });

// Iterate over Facilities list




//create a looping function in order to iterate over items.

// check for key word "Menu List" at the top of the page to check whether the menu or other choices are displayed.

// if other choices iterate through

// both go through menu per day


function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const numA = parseInt(a.num);
  const numB = parseInt(b.num);

  let comparison = 0;
  if (numA > numB) {
    comparison = 1;
  } else if (numA < numB) {
    comparison = -1;
  }
  return comparison;
}


// Parsing data using cheerio

let getData = html => {
    data = [];
    const $ = cheerio.load(html);
    $('section#cbo_nn_unitDataList.pt-3').children('.row').each(function(row, raw_element) {
        $(raw_element).find(':nth-child(1)').each(function(i, elem) {
            let name = $(elem).find('div.card-header.unit__link-bar--horizontal').find('a').text();
            let script = $(elem).find('div.card-header.unit__link-bar--horizontal').find('a').attr('onclick');
            let description = $(elem).find('div.list-group-item.unit__description').text();
            
            let obj = (o => o.name === name);
                
            if(data.findIndex(obj) == -1) {
                if(name) {
                    data.push(new Facility(name, description, script));
                }
            }
        })
    });
    return data;
}

// Object Definitions

/*
* Facility : A facility object
* name : The name of the facility
* description : The description of the facility
* script : The script to access the facility
* subfacilities : An array of subfacilities
*/

class Facility {
    constructor(name, description, script) {
        this.name = name;
        this.description = description;
        this.num = script.match(/(\d+)/)[0];
        this.selector = '#cbo_nn_unitImages_' + this.num + ' > div.card-header.unit__link-bar--horizontal > a';
        this.script = script;
        this.subFacilities = [];
    }
}

class SubFacility extends Facility {
    constructor(name, description, script, date) {
        super(name, description, script);
        this.date = date;
    }
}

class FoodDate {
    constructor(date, time) {
        this.date = date;
        this.time = time;
    }
}

class Time {
    constructor(num) {
        switch(num) {
            case 0:
                this.display = "All Day";
                break;
            case 1:
                this.display = "Breakfast";
                break;
            case 2:
                this.display = "Lunch";
                break;
            case 3:
                this.display = "Dinner";
                break;
            case 4:
                this.display = "Lunch + Dinner";
                break;
            default:
                this.display = "IDK"
                break;
        }
        this.num = num;
    }
}

