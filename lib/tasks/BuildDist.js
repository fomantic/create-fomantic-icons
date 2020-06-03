"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
// node
var path_1 = require("path");
// npm
var liquidjs_1 = __importDefault(require("liquidjs"));
var fse = __importStar(require("fs-extra"));
// utils
var Logger_1 = __importStar(require("../util/Logger"));
function run(results, parseResults) {
    return new Promise(function (resolve) {
        Logger_1.default.log();
        var distSpinner = Logger_1.spinner()
            .start('building dist');
        var engine = new liquidjs_1.default({
            root: path_1.resolve(__dirname, '../../src/templates'),
            extname: '.liquid',
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
            engine.renderFile(filename + ".liquid", ctx)
                .then(function (renderResult) {
                var fileOutputDirectory = path_1.resolve(results.distPath, distFiles[filename]);
                fse.mkdirp(fileOutputDirectory)
                    .then(function () {
                    fse.writeFile(path_1.resolve(fileOutputDirectory, filename), renderResult)
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
                var distPath = path_1.resolve(results.distPath, 'ui/src/themes/default/assets/fonts');
                fse.mkdirp(distPath)
                    .then(function () {
                    files.forEach(function (file) {
                        var filenameSplit = file.split('.');
                        var newFileName = parseResults.fontFileNames[filenameSplit[0]] + "." + filenameSplit[1];
                        var assetFilePath = path_1.resolve(parseResults.fontAssetsDirectory, file);
                        var assetDistPath = path_1.resolve(distPath, newFileName);
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
                .all(__spreadArrays(templateFileRenderFuncs, [
                copyAssetsFunc,
            ]))
                .then(function () {
                distSpinner.succeed('build all dist files');
                Logger_1.default.log("  Files saved to " + results.distPath);
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
