export class Facility {
    constructor(name, description, script) {
        this.name = name;
        this.description = description;
        this.num = script.match(/(\d+)/)[0];
        this.selector =
            "#cbo_nn_unitImages_" +
            this.num +
            " > div.card-header.unit__link-bar--horizontal > a";
        this.script = script;
        this.subFacilities = [];
    }
}