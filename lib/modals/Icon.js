// utils
import Converter from '../util/Converter.js';
// enums
import IconType from '../enums/IconType.js';
// static
import corrections from '../static/corrections.json' with { type: 'json' };
export default class Icon {
    data;
    constructor(data) {
        this.data = data;
    }
    hasCorrection(field) {
        const iconCorrection = corrections[this.rawName];
        if (iconCorrection !== undefined) {
            return iconCorrection[field] !== undefined;
        }
        return false;
    }
    correction(field) {
        return this.hasCorrection(field)
            ? corrections[this.rawName][field]
            : '';
    }
    get rawName() {
        return this.data.name;
    }
    get name() {
        let { name, } = this.data;
        if (this.type === IconType.OUTLINE) {
            name += '-outline';
        }
        if (this.type === IconType.THIN) {
            name += '-thin';
        }
        if (this.type === IconType.DUOTONE) {
            name += '-duotone';
        }
        return this.hasCorrection('name')
            ? this.correction('name')
            : Converter.iconName(name);
    }
    get className() {
        return this.hasCorrection('className')
            ? this.correction('className')
            : Converter.iconClassName(this.name);
    }
    get unicode() {
        return this.hasCorrection('unicode')
            ? this.correction('unicode')
            : `\\${this.data.unicode}`;
    }
    get secondaryUnicode() {
        return this.hasCorrection('unicode')
            ? this.correction('unicode')
            : `\\10${this.data.unicode}`;
    }
    get type() {
        return this.data.type;
    }
    get searchTerms() {
        return this.data.searchTerms.join(', ');
    }
}
