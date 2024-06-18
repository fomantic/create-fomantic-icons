// static
import categories from '../static/categories.json' with { type: 'json' };
export default class Category {
    data;
    constructor(data) {
        this.data = data;
    }
    get rawName() {
        return this.data.name;
    }
    get name() {
        return this.data.label;
    }
    get description() {
        return categories[this.rawName];
    }
    get icons() {
        return this.data.icons;
    }
}
