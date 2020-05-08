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
    const selector1 = facilities[2].selector;
    const selector2 = facilities[0].subFacilities[0].selector;
    nightmare
    .goto(url)
    .wait('body')
    .click(selector1)
    .wait(3000)
    .click('#cbo_nn_menuDataList > div > div:nth-child(1) > section > div > div > div > a')
    .wait(3000)
    .evaluate(() => document.querySelector('body').innerHTML)
    .end()
    .then(response => {
        
        // Call getSubData while passing in the (response) variable returned by evaluate
        let menu = getMenuData(response);
        
        // Writing menu to JSON file
        const jsonString = JSON.stringify(menu, null, 2);

        fs.writeFile('./menu.json', jsonString, err => {
            if (err) {
                console.log("Error writing file", err);
            } else {
                console.log("Successfully wrote file");
            }
        })
    }).catch(err => {
        console.log(err);
    });
}

// Parsing data using cheerio

let getMenuData = html => {
    // Declaring variables
    let data = []; // Data variable returned
    let type = ''; // Type of menu item. Stored until a new item is iterated over, then updates
    
    const $ = cheerio.load(html);
    // Iterates over every tr in the table
    $('#itemPanel > section > div.table-responsive.pt-3 > table > tbody > tr:nth-child(1n)').each(function(row, raw_element) {
        // Creates a new element variable that equals the link in the table. Only availible for menu items
        let element = $(raw_element).find('a');
        
        // Sets the name of the item.
        let name = $(element).text();
        
        // If the name is empty (a type on the table), then updates the type variable.
        // Else continues on pushing a new menu item.
        if(name == '') {
            type = $(raw_element).text();
        } else {
            // Finds the serving size element
            let servingSize = $(raw_element).find(':nth-child(3)').text();
            
            // Finds the first allergy element
            let allergyImg = $(element).find('img');
            
            // Declares an empty allergyInfo object
            let allergyInfo = [];
            
            // Pushes each allergy element into the allergyInfo object
            $(allergyImg).each(function(j, imager) {
                let title = $(imager).attr('title'); 
                allergyInfo.push(title);
            })
            
            // Pushes a new MenuItem element
            data.push(new MenuItem(name, type, allergyInfo, servingSize))
        }
        
        
        
        
       /* $(raw_element).find(':nth-child(1)').each(function(i, elem) {
            
            .filter('cbo_nn_itemPrimaryRow')
            #itemPanel > section > div.table-responsive.pt-3 > table > tbody > tr:nth-child(1)
            #itemPanel > section > div.table-responsive.pt-3 > table > tbody > tr:nth-child(2)
            
            let name = $(elem).text(); //.find(':nth-child(2)')
            //console.log(name);
            //let script = $(elem).find('div.card-header.unit__link-bar--horizontal').find('a').attr('onclick');
            //let description = $(elem).find('div.list-group-item.unit__description').text();
           
            let allergyInfo = [];
            
            $(elem).each(function(j, element) {
                let cock = $(raw_element).text(); 
                allergyInfo.push(cock);
            })
            
            
            //let obj = (o => o.name === name);
            
            //if(data.findIndex(obj) == -1) {
            if(name != "" && name != "1" && name != "12345" && name != "Check this item in order to compare its nutrition info against other items.") {
                data.push(new MenuItem(name, allergyInfo)) /// MAKE THIS THING PUSH A NEW MENU ITEM TO data WHICH WILL THEN BE RETURNED.
            }
        })
        */
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

class MenuItem {
    constructor(name, type, allergyInfo, servingSize) {
        this.name = name; // String name
        this.type = type.substring(5, type.length);; // String type
        this.allergyInfo = allergyInfo; // Array of allergy information
        this.servingSize = servingSize.substring(0, servingSize.length - 1); // String serving size // This still returns a dropdown menu if its available!!!!
    }
}
