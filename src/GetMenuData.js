const Nightmare = require("nightmare");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://miaminutrition.miamioh.edu/NetNutrition/MU";

const Facility = require("./objects/Facility");
const MenuItem = require("./objects/MenuItem");

let facilities = [];

// 2nd Step -- Getting javascript of next pages

try {
    const jsonString = fs.readFileSync("./data/facilities.json");
    facilities = JSON.parse(jsonString);
} catch (err) {
    console.log(err);
    return;
}

getData();

function getData() {
    let data = [];
    let count = 0;

    //for(i = 0; i < facilities.length; i++) {
    const nightmare = Nightmare({ show: true });
    const selector1 = facilities[2].selector;
    const selector2 = facilities[0].subFacilities[0].selector;
    nightmare
        .goto(url)
        .wait("body")
        .click(selector1)
        .wait(3000)
        .click(
            "#cbo_nn_menuDataList > div > div:nth-child(1) > section > div > div > div > a"
        )
        .wait(3000)
        .evaluate(() => document.querySelector("body").innerHTML)
        .end()
        .then(response => {
            // Call getSubData while passing in the (response) variable returned by evaluate
            let menu = getMenuData(response);

            // Writing menu to JSON file
            const jsonString = JSON.stringify(menu, null, 2);

            const regex = /([^\s]+)/g;
        
            fileName = facilities[2].name.match(/([^\s]+)/g).join("");
        
            fs.writeFile("./data/menus/" + fileName + ".json", jsonString, err => {
                if (err) {
                    console.log("Error writing file", err);
                } else {
                    console.log("Successfully wrote file");
                }
            });
        })
        .catch(err => {
            console.log(err);
        });
}

// Parsing data using cheerio

let getMenuData = html => {
    // Declaring variables
    let data = []; // Data variable returned
    let type = ""; // Type of menu item. Stored until a new item is iterated over, then updates

    const $ = cheerio.load(html);
    // Iterates over every tr in the table
    $(
        "#itemPanel > section > div.table-responsive.pt-3 > table > tbody > tr:nth-child(1n)"
    ).each(function(row, raw_element) {
        // Creates a new element variable that equals the link in the table. Only availible for menu items
        let element = $(raw_element).find("a");

        // Sets the name of the item.
        let name = $(element).text();

        // If the name is empty (a type on the table), then updates the type variable.
        // Else continues on pushing a new menu item.
        if (name == "") {
            type = $(raw_element).text();
        } else {
            // Finds the serving size element
            let servingSize = $(raw_element)
                .find(":nth-child(3)")
                .text();

            // Finds the first allergy element
            let allergyImg = $(element).find("img");

            // Declares an empty allergyInfo object
            let allergyInfo = [];

            // Pushes each allergy element into the allergyInfo object
            $(allergyImg).each(function(j, imager) {
                let title = $(imager).attr("title");
                allergyInfo.push(title);
            });

            // Pushes a new MenuItem element
            data.push(new MenuItem(name, type, allergyInfo, servingSize));
        }
    });
    return data;
};