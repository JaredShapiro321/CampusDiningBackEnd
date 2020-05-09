class Time {
    constructor(num, selector) {
        switch (num) {
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
                this.display = "IDK";
                break;
        }
        this.num = num;
        this.selector = selector;
    }
}