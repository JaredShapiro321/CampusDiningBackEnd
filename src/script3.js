const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const fs = require('fs');


const url = 'https://miaminutrition.miamioh.edu/NetNutrition/MU';

let facilities = [];

// 2nd Step -- Getting javascript of next pages

try {
  const jsonString = fs.readFileSync('./subFacilities.json');
  facilities = JSON.parse(jsonString);
} catch(err) {
  console.log(err);
  return
}

iterate();



function iterate() {
    let data = [];
    let count = 0;
    
    //for(i = 0; i < facilities.length; i++) {
    const nightmare = Nightmare({show: true});
    const selector1 = facilities[0].selector;
    const selector2 = facilities[0].subFacilities[0].selector;
    nightmare
    .goto(url)
    .wait('body')
    .click(selector1)
    .wait(3000)
    .click(selector2)
    .wait(3000)
    .evaluate(() => document.querySelector('body').innerHTML)
    .end()
    .then(response => {
        //console.log(facilities[0].indexOf(selector));
        let subFacilityDays = getSubData(response);
        //console.log(getSubData(response));
        data.push(subFacilityDays);
        //const jsonString = JSON.stringify(subFacilities, null, 2);
        //facilities[i].subFacilities.push(getSubData(response));
        console.log(count);

        // find the last one to finish when iterating. Not iterating atm.

        


        /*
        count++;
        if (count == facilities.length) {
            for(j = 0; j < facilities.length - 1; j++) {

                scriptNum = parseInt(facilities[j].num);
                console.log("num: " + scriptNum);
                scriptNum1 = parseInt(facilities[j + 1].num);
                console.log("num 1: " + scriptNum1);


                for(k = 0; k < data.length; k++) {
                    for(l = 0; l < data[k].length; l++) {
                        if(data[k].length > 0) {
                            scriptNumData = parseInt(data[k][l].num);
                            console.log("num data: " + scriptNumData);
                        }
                        if(scriptNum < scriptNumData && scriptNumData < scriptNum1) {
                            facilities[j].subFacilities = data[k];
                            //console.log("balls");
                        }
                    }

                }

            }
            //console.log(facilities);
            const jsonString = JSON.stringify(facilities, null, 2);

            fs.writeFile('./subFacilitiesDays.json', jsonString, err => {
                if (err) {
                    console.log("Error writing file", err);
                } else {
                    console.log("Successfully wrote file");
                }
            })
        }
        */
    }).catch(err => {
        console.log(err);
    });
    //}
}

// Parsing data using cheerio

let getSubData = html => {
  data = [];
  const $ = cheerio.load(html);
    $('#cbo_nn_childUnitDataList > div').each(function(row, raw_element) {
        $(raw_element).find(':nth-child(1)').each(function(i, elem) {
            let name = $(elem).find('div.card-header.unit__link-bar--horizontal').find('a').text(); 
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



// Declaring Classes

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

class FoodDate {
    constructor(title) {
        this.title = title;
        
        let titleArray = str.split(", ");
        
        this.date = date;
        this.time = time;
        this.day = split[0];
    }
}

class Time {
    constructor(num, selector) {
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
        this.selector = selector;
    }
}
