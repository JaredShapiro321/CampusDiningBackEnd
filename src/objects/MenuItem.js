class MenuItem {
    constructor(name, type, allergyInfo, servingSize) {
        this.name = name; // String name
        this.type = type.substring(5, type.length); // String type
        this.allergyInfo = allergyInfo; // Array of allergy information
        this.servingSize = servingSize.substring(0, servingSize.length - 1); // String serving size // This still returns a dropdown menu if its available!!!!
    }
    
    getName() {
        return this.name;
    }
    
    setName(name) {
        this.name = name;
    }
    
    getType() {
        return this.type;
    }
    
    setType(type) {
        this.type = type;
    }
    
    getAllergyInfo() {
        return this.allergyInfo;
    }
    
    setAllergyInfo(allergyInfo) {
        this.allergyInfo = allergyInfo;
    }
    
    getServingSize() {
        return this.servingSize;
    }
    
    setServingSize(servingSize) {
        this.servingSize = servingSize;
    }
    
}