const Nightmare = require("../node_modules/nightmare");
const cheerio = require("../node_modules/cheerio");
const fs = require("fs");

const nightmare = Nightmare({ show: true });
const url = "https://miaminutrition.miamioh.edu/NetNutrition/MU";

const Facility = require("./objects/Facility");

// Request and pull data from base html

let facilities = [];

getData();

function getData() {
    nightmare
        .goto(url)
        .wait("body")
        .evaluate(() => document.querySelector("body").innerHTML)
        .end()
        .then(response => {
            facilities = parseData(response);

            facilities.sort(compare);

            getSubData();
        })
        .catch(err => {
            console.log(err);
        });
}

function getSubData() {
    let data = [];
    let count = 0;

    for (i = 0; i < facilities.length; i++) {
        const nightmare = Nightmare({ show: true });
        const selector = facilities[i].selector;
        nightmare
            .goto(url)
            .wait("body")
            .click(selector)
            .wait(3000)
            .evaluate(() => document.querySelector("body").innerHTML)
            .end()
            .then(response => {
                // Parse subFacilities data. Occurs asynchronously with nightmare evaluate.
                let subFacilities = parseSubData(response);

                // Push data parsed to local object
                data.push(subFacilities);

                // Counts the number of facilities evaluated with nightmare
                // console.log(count);
                count++;

                // If the number of facilities evaluated is equal to the total number of facilities, format the data with certain facilities containing subfacilities
                if (count == facilities.length) {
                    for (j = 0; j < facilities.length - 1; j++) {
                        // ID associated with current facility
                        let jID = parseInt(facilities[j].id);
                        // console.log("current id: " + jID);

                        // ID associated with next facility
                        let jIDNext = parseInt(facilities[j + 1].id);
                        // console.log("Next id: " + jIDNext);

                        // Search through local data to find where to put current facility based on object ID values
                        for (k = 0; k < data.length; k++) {
                            for (l = 0; l < data[k].length; l++) {
                                if (data[k].length > 0) {
                                    // ID associated with current facility in local data object
                                    dataID = parseInt(data[k][l].id);
                                    // console.log("Data id: " + dataID);
                                }
                                if (jID < dataID && dataID < jIDNext) {
                                    facilities[j].subFacilities = data[k];
                                }
                            }
                        }
                    }

                    const jsonString = JSON.stringify(facilities, null, 2);

                    fs.writeFile("./data/facilities.json", jsonString, err => {
                        if (err) {
                            console.log("Error writing file", err);
                        } else {
                            console.log("Successfully wrote file");
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
}

// Parsing data using cheerio

// Iterate over Facilities list

//create a looping function in order to iterate over items.

// check for key word "Menu List" at the top of the page to check whether the menu or other choices are displayed.

// if other choices iterate through

// both go through menu per day

// Parsing data using cheerio

let parseData = html => {
    data = [];
    const $ = cheerio.load(html);
    $("section#cbo_nn_unitDataList.pt-3")
        .children(".row")
        .each(function(row, raw_element) {
            $(raw_element)
                .find(":nth-child(1)")
                .each(function(i, elem) {
                    let name = $(elem)
                        .find("div.card-header.unit__link-bar--horizontal")
                        .find("a")
                        .text();
                    let script = $(elem)
                        .find("div.card-header.unit__link-bar--horizontal")
                        .find("a")
                        .attr("onclick");
                    let description = $(elem)
                        .find("div.list-group-item.unit__description")
                        .text();
                    //let defaultImageURL = $(elem).find("img").attr("src");

                    let obj = o => o.name === name;

                    if (data.findIndex(obj) == -1) {
                        if (name) {
                            data.push(
                                new Facility(
                                    name,
                                    description,
                                    script
                                )
                            );
                        }
                    }
                });
        });
    return data;
};

let parseSubData = html => {
    data = [];
    const $ = cheerio.load(html);
    $("#cbo_nn_childUnitDataList > div").each(function(row, raw_element) {
        $(raw_element)
            .find(":nth-child(1)")
            .each(function(i, elem) {
                let name = $(elem)
                    .find("div.card-header.unit__link-bar--horizontal")
                    .find("a")
                    .text();
                let script = $(elem)
                    .find("div.card-header.unit__link-bar--horizontal")
                    .find("a")
                    .attr("onclick");
                let description = $(elem)
                    .find("div.list-group-item.unit__description")
                    .text();
                //let defaultImageURL = $(elem).find("img").attr("src");

                let obj = o => o.name === name;

                if (data.findIndex(obj) == -1) {
                    if (name) {
                        data.push(
                            new Facility(
                                name,
                                description,
                                script
                            )
                        );
                    }
                }
            });
    });
    return data;
};

// Helper function. Compares two strings of numbers (A and B) and returns the whether A is greater, equal, or less than B.

function compare(a, b) {
    const numA = parseInt(a.id);
    const numB = parseInt(b.id);

    let comparison = 0;
    if (numA > numB) {
        comparison = 1;
    } else if (numA < numB) {
        comparison = -1;
    }
    return comparison;
}