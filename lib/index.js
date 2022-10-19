"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
        (0, CleanUp_1.default)()
            .then(function () {
            process.exit(0);
        });
    }
    else {
        (0, InitialPrompt_1.default)()
            .then(function (results) {
            (0, DownloadAsset_1.default)(results)
                .then(function (paths) {
                Promise.resolve().then(function () { return __importStar(require("./parsers/".concat(results.iconSet.parser))); }).then(function (Parser) {
                    Parser.default(results, paths)
                        .then(function (parseResults) {
                        (0, BuildDist_1.default)(results, parseResults)
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
