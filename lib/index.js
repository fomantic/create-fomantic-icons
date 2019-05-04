"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tasks
var InitialPrompt_1 = __importDefault(require("./tasks/InitialPrompt"));
var DownloadAsset_1 = __importDefault(require("./tasks/DownloadAsset"));
var BuildDist_1 = __importDefault(require("./tasks/BuildDist"));
var CleanUp_1 = __importDefault(require("./tasks/CleanUp"));
// utils
var Logger_1 = __importDefault(require("./util/Logger"));
function run() {
    if (process.argv.includes('--clean')) {
        CleanUp_1.default()
            .then(function () {
            process.exit(0);
        });
    }
    else {
        InitialPrompt_1.default()
            .then(function (results) {
            DownloadAsset_1.default(results)
                .then(function (paths) {
                Promise.resolve().then(function () { return __importStar(require("./parsers/" + results.iconSet.parser)); }).then(function (Parser) {
                    Parser.default(results, paths)
                        .then(function (parseResults) {
                        BuildDist_1.default(results, parseResults)
                            .then(function () {
                            process.exit(0);
                        });
                    });
                })
                    .catch(function (err) {
                    Logger_1.default.error(err);
                    process.exit(1);
                });
            });
        });
    }
}
exports.default = run;
