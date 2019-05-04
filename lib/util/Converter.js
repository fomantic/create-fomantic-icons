"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Converter = /** @class */ (function () {
    function Converter() {
    }
    Converter.iconClassName = function (name) {
        return name
            .replace(/-alt$/, '-alternate')
            .replace(/-alt-/, '-alternate-')
            .replace(/-h$/, '-horizontal')
            .replace(/-h-/, '-horizontal-')
            .replace(/-V$/, '-vertical')
            .replace(/-V-/, '-vertical-')
            .replace(/-alpha$/, '-alphabet')
            .replace(/-alpha-/, '-alphabet-')
            .replace(/-asc$/, '-ascending')
            .replace(/-asc-/, '-ascending-')
            .replace(/-desc$/, '-descending')
            .replace(/-desc-/, '-descending-')
            .replace(/-/g, '.')
            .replace(/\s/g, '.');
    };
    Converter.iconName = function (name) {
        return Converter.iconClassName(name)
            .replace(/\./g, ' ');
    };
    return Converter;
}());
exports.default = Converter;
