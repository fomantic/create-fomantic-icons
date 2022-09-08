"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var numWords = __importStar(require("num-words"));
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
            .map(function (entity) {
            return Converter.NUMERIC_ONLY.test(entity)
                ? numWords(entity)
                : entity;
        })
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
