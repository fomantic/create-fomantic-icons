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
// node
var path_1 = require("path");
var os_1 = require("os");
// npm
var fse = __importStar(require("fs-extra"));
// utils
var Logger_1 = __importStar(require("../util/Logger"));
function run() {
    return new Promise(function (resolve) {
        Logger_1.default.log();
        var cleanUpSpinner = Logger_1.spinner()
            .start('cleaning up asset files');
        fse.remove(path_1.resolve(os_1.tmpdir(), 'fui-icon-script'))
            .then(function () {
            cleanUpSpinner.succeed('all assets cleaned up');
            resolve();
        })
            .catch(function (err) {
            cleanUpSpinner.stop();
            Logger_1.default.error(err);
        });
    });
}
exports.default = run;
