import Facility from "./Facility.js";

class SubFacility extends Facility {
    constructor(name, description, script, date) {
        super(name, description, script);
        //this.selector = '#cbo_nn_unitImages_' + super.script.match(/(\d+)/)[0] + ' > div.card-header.unit__link-bar--horizontal > a';
        //this.parentSelector = super.selector;
        //this.date = date;
    }
}