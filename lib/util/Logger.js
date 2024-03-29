"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinner = exports.LoggerInstance = void 0;
// npm
var signale_1 = require("signale");
var ora_1 = __importDefault(require("ora"));
exports.LoggerInstance = signale_1.Signale;
function spinner(options) {
    return (0, ora_1.default)(options);
}
exports.spinner = spinner;
exports.default = new signale_1.Signale();
