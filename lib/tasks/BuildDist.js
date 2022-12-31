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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// node
var path_1 = require("path");
// npm
var liquidjs_1 = require("liquidjs");
var fse = __importStar(require("fs-extra"));
// utils
var Logger_1 = __importStar(require("../util/Logger"));
function run(results, parseResults) {
    return new Promise(function (resolve) {
        Logger_1.default.log();
        var distSpinner = (0, Logger_1.spinner)()
            .start('building dist');
        var engine = new liquidjs_1.Liquid({
            root: (0, path_1.resolve)(__dirname, '../../src/templates'),
            extname: '.liquid',
            ownPropertyOnly: false,
        });
        var ctx = parseResults;
        ctx.version = results.asset.version;
        var distFiles = {
            'icon.html.eco': 'docs/server/documents/elements/',
            'icon.overrides': 'ui/src/themes/default/elements/',
            'icon.variables': 'ui/src/themes/default/elements/',
        };
        var templateFileRenderFuncs = Object.keys(distFiles)
            .map(function (filename) { return new Promise(function (resolveRender, rejectRender) {
            engine.renderFile("".concat(filename, ".liquid"), ctx)
                .then(function (renderResult) {
                var fileOutputDirectory = (0, path_1.resolve)(results.distPath, distFiles[filename]);
                fse.mkdirp(fileOutputDirectory)
                    .then(function () {
                    fse.writeFile((0, path_1.resolve)(fileOutputDirectory, filename), renderResult)
                        .then(function () { return resolveRender(); })
                        .catch(rejectRender);
                })
                    .catch(rejectRender);
            })
                .catch(rejectRender);
        }); });
        var copyAssetsFunc = new Promise(function (resolveAssetCopy, rejectAssetCopy) {
            fse.readdir(parseResults.fontAssetsDirectory)
                .then(function (files) {
                var copiedFiles = 0;
                var copied = function () {
                    copiedFiles += 1;
                    if (copiedFiles >= files.length) {
                        resolveAssetCopy();
                    }
                };
                var distPath = (0, path_1.resolve)(results.distPath, 'ui/src/themes/default/assets/fonts');
                fse.mkdirp(distPath)
                    .then(function () {
                    files.forEach(function (file) {
                        var filenameSplit = file.split('.');
                        var newFileName = "".concat(parseResults.fontFileNames[filenameSplit[0]], ".").concat(filenameSplit[1]);
                        var assetFilePath = (0, path_1.resolve)(parseResults.fontAssetsDirectory, file);
                        var assetDistPath = (0, path_1.resolve)(distPath, newFileName);
                        fse.copyFile(assetFilePath, assetDistPath)
                            .then(function () {
                            copied();
                        })
                            .catch(rejectAssetCopy);
                    });
                })
                    .catch(rejectAssetCopy);
            })
                .catch(rejectAssetCopy);
        });
        fse.mkdirp(results.distPath)
            .then(function () {
            Promise
                .all(__spreadArray(__spreadArray([], templateFileRenderFuncs, true), [
                copyAssetsFunc,
            ], false))
                .then(function () {
                distSpinner.succeed('build all dist files');
                Logger_1.default.log("  Files saved to ".concat(results.distPath));
                resolve();
            })
                .catch(function (err) {
                distSpinner.stop();
                Logger_1.default.error(err);
                process.exit(1);
            });
        })
            .catch(function (err) {
            distSpinner.stop();
            Logger_1.default.error(err);
            process.exit(1);
        });
    });
}
exports.default = run;
