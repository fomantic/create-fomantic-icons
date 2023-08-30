"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var num_words_1 = __importDefault(require("num-words"));
var Converter = /** @class */ (function () {
    function Converter() {
    }
    Converter.iconClassName = function (name) {
        return name
            .toLowerCase()
            .replace(/-alt$/, '-alternate')
            .replace(/-alt-/, '-alternate-')
            .replace(/-h$/, '-horizontal')
            .replace(/-h-/, '-horizontal-')
            .replace(/-v$/, '-vertical')
            .replace(/-v-/, '-vertical-')
            .replace(/-alpha$/, '-alphabet')
            .replace(/-alpha-/, '-alphabet-')
            .replace(/-asc$/, '-ascending')
            .replace(/-asc-/, '-ascending-')
            .replace(/-desc$/, '-descending')
            .replace(/-desc-/, '-descending-')
            .replace(/-/g, '.')
            .replace(/\s/g, '.')
            .split('.')
            .map(function (entity) { return (Converter.NUMERIC_ONLY.test(entity)
            ? (0, num_words_1.default)(parseInt(entity, 10))
            : entity); })
            .join('.');
    };
    Converter.iconName = function (name) {
        return Converter.iconClassName(name)
            .replace(/\./g, ' ');
    };
    Converter.NUMERIC_ONLY = /^\d+$/;
    return Converter;
}());
exports.default = Converter;
