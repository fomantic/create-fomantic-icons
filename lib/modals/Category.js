"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// static
var categories_json_1 = __importDefault(require("../static/categories.json"));
var Category = /** @class */ (function () {
    function Category(data) {
        this.data = data;
    }
    Object.defineProperty(Category.prototype, "rawName", {
        get: function () {
            return this.data.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "name", {
        get: function () {
            return this.data.label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "description", {
        get: function () {
            return categories_json_1.default[this.rawName];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "icons", {
        get: function () {
            return this.data.icons;
        },
        enumerable: true,
        configurable: true
    });
    return Category;
}());
exports.default = Category;
