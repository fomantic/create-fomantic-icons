"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// utils
var Converter_1 = __importDefault(require("../util/Converter"));
// enums
var IconType_1 = __importDefault(require("../enums/IconType"));
// static
var corrections_json_1 = __importDefault(require("../static/corrections.json"));
var Icon = /** @class */ (function () {
    function Icon(data) {
        this.data = data;
    }
    Icon.prototype.hasCorrection = function (field) {
        var iconCorrection = corrections_json_1.default[this.rawName];
        if (iconCorrection !== undefined) {
            return iconCorrection[field] !== undefined;
        }
        return false;
    };
    Icon.prototype.correction = function (field) {
        return this.hasCorrection(field)
            ? corrections_json_1.default[this.rawName][field]
            : '';
    };
    Object.defineProperty(Icon.prototype, "rawName", {
        get: function () {
            return this.data.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Icon.prototype, "name", {
        get: function () {
            var name = this.data.name;
            if (this.type === IconType_1.default.OUTLINE) {
                name += '-outline';
            }
            if (this.type === IconType_1.default.THIN) {
                name += '-thin';
            }
            return this.hasCorrection('name')
                ? this.correction('name')
                : Converter_1.default.iconName(name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Icon.prototype, "className", {
        get: function () {
            return this.hasCorrection('className')
                ? this.correction('className')
                : Converter_1.default.iconClassName(this.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Icon.prototype, "unicode", {
        get: function () {
            return this.hasCorrection('unicode')
                ? this.correction('unicode')
                : "\\" + this.data.unicode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Icon.prototype, "type", {
        get: function () {
            return this.data.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Icon.prototype, "searchTerms", {
        get: function () {
            return this.data.searchTerms.join(', ');
        },
        enumerable: true,
        configurable: true
    });
    return Icon;
}());
exports.default = Icon;
