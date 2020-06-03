"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// node
var path_1 = require("path");
// npm
var qoa_1 = __importDefault(require("qoa"));
var chalk_1 = __importDefault(require("chalk"));
var axios_1 = __importDefault(require("axios"));
// utils
var Logger_1 = __importDefault(require("../util/Logger"));
// icon sets
var icon_sets_json_1 = __importDefault(require("../static/icon_sets.json"));
function askForAccessToken() {
    Logger_1.default.log();
    return new Promise(function (resolve) {
        qoa_1.default
            .secure({
            query: 'Enter your GitHub personal access token:',
            handle: 'accessToken',
        })
            .then(function (_a) {
            var accessToken = _a.accessToken;
            if (!accessToken || accessToken.length === 0) {
                Logger_1.default.warn('You must enter an access token to proceed.');
                askForAccessToken()
                    .then(resolve);
            }
            else {
                resolve(accessToken);
            }
        })
            .catch(function (err) {
            Logger_1.default.error(err);
            process.exit(1);
        });
    });
}
exports.askForAccessToken = askForAccessToken;
function askWhichIconSet() {
    Logger_1.default.log();
    return new Promise(function (resolve) {
        qoa_1.default
            .interactive({
            handle: 'iconSetName',
            query: 'Which icons set would you like to generate?',
            menu: icon_sets_json_1.default.map(function (s) { return s.name; }),
        })
            .then(function (_a) {
            var iconSetName = _a.iconSetName;
            resolve(icon_sets_json_1.default.find(function (s) { return s.name === iconSetName; }));
        })
            .catch(function (err) {
            Logger_1.default.error(err);
            process.exit(1);
        });
    });
}
exports.askWhichIconSet = askWhichIconSet;
function selectIconSetVersion(iconSet, accessToken) {
    Logger_1.default.log();
    var axiosConfig = accessToken === undefined ? {} : {
        headers: {
            Authorization: "token " + accessToken,
        },
    };
    return new Promise(function (resolve) {
        axios_1.default
            .get("https://api.github.com/repos/" + iconSet.repo + "/releases?page=1&per_page=5", axiosConfig)
            .then(function (_a) {
            var status = _a.status, data = _a.data;
            if (status === 200) {
                var versions_1 = [];
                data
                    .filter(function (release) { return release.assets
                    .some(function (asset) {
                    var regex = new RegExp(iconSet.assetMatch);
                    return regex.test(asset.name);
                }); })
                    .forEach(function (release) {
                    var asset = release.assets
                        .filter(function (a) {
                        var regex = new RegExp(iconSet.assetMatch);
                        return regex.test(a.name);
                    })[0];
                    versions_1.push({
                        name: asset.name,
                        id: asset.id,
                        version: release.tag_name,
                        downloadUrl: asset.browser_download_url,
                    });
                });
                qoa_1.default
                    .interactive({
                    handle: 'setVersion',
                    query: "Which version of " + iconSet.name + " should we download?",
                    menu: versions_1.map(function (v) { return v.version; }),
                })
                    .then(function (_a) {
                    var setVersion = _a.setVersion;
                    resolve(versions_1.find(function (v) { return v.version === setVersion; }));
                })
                    .catch(function (err) {
                    Logger_1.default.error(err);
                    process.exit(1);
                });
            }
            else {
                Logger_1.default.error(new Error('Failed to fetch releases from git repository.'));
                process.exit(1);
            }
        })
            .catch(function (err) {
            Logger_1.default.error(err);
            process.exit(1);
        });
    });
}
exports.selectIconSetVersion = selectIconSetVersion;
function askForDistPath() {
    return new Promise(function (resolve) {
        Logger_1.default.log();
        var cwd = process.cwd();
        var defaultPath = path_1.resolve(cwd, 'fui-icons');
        qoa_1.default
            .input({
            type: 'input',
            query: "Where would you like the dist saved? [" + defaultPath + "]",
            handle: 'distPath',
        })
            .then(function (_a) {
            var distPath = _a.distPath;
            resolve(distPath === ''
                ? defaultPath : path_1.resolve(distPath));
        })
            .catch(function (err) {
            Logger_1.default.error(err);
            process.exit(1);
        });
    });
}
exports.askForDistPath = askForDistPath;
function run() {
    return new Promise(function (resolve) {
        qoa_1.default.clearScreen();
        Logger_1.default.log(chalk_1.default.cyan('Fomantic-UI Icon CLI'));
        askWhichIconSet()
            .then(function (iconSet) {
            var selectVersion = function (accessToken) {
                selectIconSetVersion(iconSet, accessToken)
                    .then(function (asset) {
                    askForDistPath()
                        .then(function (distPath) {
                        resolve({
                            iconSet: iconSet,
                            accessToken: accessToken,
                            asset: asset,
                            distPath: distPath,
                        });
                    });
                });
            };
            if (iconSet.requiresAuth) {
                Logger_1.default.log();
                Logger_1.default.note('The icon set you selected requires authentication to download.');
                Logger_1.default.note('Generate a personal access token here: https://github.com/settings/tokens');
                Logger_1.default.note('Your token must allow private repository viewing.');
                askForAccessToken()
                    .then(function (accessToken) {
                    selectVersion(accessToken);
                });
            }
            else {
                selectVersion();
            }
        });
    });
}
exports.default = run;
