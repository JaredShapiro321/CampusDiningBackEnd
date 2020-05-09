/*
 * Facility : A facility object
 * name : The facility name
 * description : The facility description
 * id : The facility id
 * selector : The HTML selector of the facility
 * script : The script to access the facility
 * subfacilities : An array of subfacilities
 */
class Facility {
    constructor(name, description, script, defaultImageURL) {
        this.name = name;
        this.description = description;
        this.id = script.match(/(\d+)/)[0];
        this.selector =
            "#cbo_nn_unitImages_" +
            this.id +
            " > div.card-header.unit__link-bar--horizontal > a";
        this.script = script;
        // this.defaultImageURL = defaultImageURL;
        this.subFacilities = [];
    }
    
    getName() {
        return this.name;
    }
    
    setName(name) {
        this.name = name;
    }
    
    getDescription() {
        return this.description;
    }
    
    setDescription(description) {
        this.description = description;
    }
    
    getID() {
        return this.id;
    }
    
    setID(id) {
        this.id = id;
    }
    
    getSubFacilities() {
        return this.subFacilities;
    }
    
    setSubFacilities(subFacilities) {
        this.subFacilities = subFacilities;
    }
}

module.exports = Facility;