"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
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
