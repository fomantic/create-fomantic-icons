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
// node
var path_1 = require("path");
var os_1 = require("os");
// npm
var axios_1 = __importDefault(require("axios"));
var fse = __importStar(require("fs-extra"));
var unzipper_1 = require("unzipper");
// utils
var Logger_1 = __importStar(require("../util/Logger"));
function extractAsset(asset, filePath) {
    return new Promise(function (resolve) {
        var extractSpinner = Logger_1.spinner()
            .start("extracting asset zip (" + asset.name + ")");
        var assetDirectory = path_1.resolve(os_1.tmpdir(), 'fui-icon-script', asset.name
            .split('.').slice(0, -1).join('.'));
        var assetReadStream = fse.createReadStream(filePath);
        assetReadStream
            .pipe(unzipper_1.Extract({
            path: assetDirectory,
        }));
        assetReadStream
            .once('error', function (err) {
            extractSpinner.stop();
            Logger_1.default.error(err);
            process.exit(1);
        });
        assetReadStream
            .once('close', function () {
            extractSpinner.succeed("asset extracted (" + assetDirectory + ")");
            resolve(assetDirectory);
        });
    });
}
exports.extractAsset = extractAsset;
function saveAssetFile(asset, data) {
    return new Promise(function (resolve) {
        var saveSpinner = Logger_1.spinner()
            .start("saving asset (" + asset.name + ")");
        var filePath = path_1.resolve(os_1.tmpdir(), 'fui-icon-script', asset.name);
        fse.outputFile(filePath, data, function (saveErr) {
            if (!saveErr) {
                saveSpinner.succeed("asset saved (" + filePath + ")");
                resolve(filePath);
            }
            else {
                saveSpinner.stop();
                Logger_1.default.error(saveErr);
                process.exit(1);
            }
        });
    });
}
exports.saveAssetFile = saveAssetFile;
function downloadAsset(results) {
    return new Promise(function (resolve) {
        var asset = results.asset;
        var downloadSpinner = Logger_1.spinner()
            .start("downloading (" + asset.name + ")");
        var axiosConfig = {
            responseType: 'arraybuffer',
            headers: {
                Accept: 'application/octet-stream',
                'User-Agent': 'request-module',
            },
            encoding: null,
        };
        if (results.iconSet.requiresAuth) {
            axiosConfig.headers.Authorization = "token " + results.accessToken;
        }
        var apiDownloadUrl = "https://" + results.accessToken + ":@api.github.com/repos/" + results.iconSet.repo + "/releases/assets/" + results.asset.id;
        var isDownloading = true;
        var downloadTextTimer = setTimeout(function () {
            if (isDownloading) {
                downloadSpinner.text = downloadSpinner.text + " [still downloading, hold on]";
            }
        }, 1000 * 120 /* 2mins */);
        axios_1.default
            .get(apiDownloadUrl, axiosConfig)
            .then(function (_a) {
            var data = _a.data, status = _a.status;
            isDownloading = false;
            clearTimeout(downloadTextTimer);
            if (status === 200) {
                downloadSpinner.succeed("downloaded (" + asset.name + ")");
                resolve(data);
            }
            else {
                downloadSpinner.stop();
                Logger_1.default.error(new Error('Failed to download asset file.'));
                process.exit(1);
            }
        })
            .catch(function (err) {
            downloadSpinner.stop();
            Logger_1.default.error(err);
            process.exit(1);
        });
    });
}
exports.downloadAsset = downloadAsset;
function startDownload(results) {
    return new Promise(function (resolve) {
        downloadAsset(results)
            .then(function (downloadData) {
            saveAssetFile(results.asset, downloadData)
                .then(function (assetFilePath) {
                extractAsset(results.asset, assetFilePath)
                    .then(function (assetDirectoryPath) {
                    resolve({
                        assetFilePath: assetFilePath,
                        assetDirectoryPath: assetDirectoryPath,
                    });
                });
            });
        });
    });
}
exports.startDownload = startDownload;
function run(results) {
    return new Promise(function (resolve) {
        Logger_1.default.log();
        var assetCheckSpinner = Logger_1.spinner()
            .start('checking if asset already exists');
        var assetFilePath = path_1.resolve(os_1.tmpdir(), 'fui-icon-script', results.asset.name);
        var assetDirectoryPath = path_1.resolve(os_1.tmpdir(), 'fui-icon-script', results.asset.name
            .split('.').slice(0, -1).join('.'));
        fse.pathExists(assetFilePath)
            .then(function (assetExists) {
            if (assetExists) {
                fse.pathExists(assetFilePath)
                    .then(function (directoryExists) {
                    if (directoryExists) {
                        assetCheckSpinner.succeed('asset already exists');
                        resolve({
                            assetFilePath: assetFilePath,
                            assetDirectoryPath: assetDirectoryPath,
                        });
                    }
                    else {
                        assetCheckSpinner.info('asset doesn\'t exist locally, starting download')
                            .stop();
                        startDownload(results)
                            .then(resolve);
                    }
                })
                    .catch(function (err) {
                    Logger_1.default.error(err);
                    process.exit(1);
                });
            }
            else {
                assetCheckSpinner.info('asset doesn\'t exist locally, starting download')
                    .stop();
                startDownload(results)
                    .then(resolve);
            }
        })
            .catch(function (err) {
            Logger_1.default.error(err);
            process.exit(1);
        });
    });
}
exports.default = run;
