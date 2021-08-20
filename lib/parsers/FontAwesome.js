"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// node
var path_1 = require("path");
// npm
var fse = __importStar(require("fs-extra"));
var js_yaml_1 = require("js-yaml");
var chalk_1 = __importDefault(require("chalk"));
// utils
var Logger_1 = __importStar(require("../util/Logger"));
// modals
var Icon_1 = __importDefault(require("../modals/Icon"));
var Category_1 = __importDefault(require("../modals/Category"));
// enums
var IconType_1 = __importDefault(require("../enums/IconType"));
// static
var aliases_json_1 = __importDefault(require("../static/aliases.json"));
function parse(results, paths) {
    return new Promise(function (resolve) {
        var asset = results.asset;
        var parseSpinner = Logger_1.spinner()
            .start('parsing icons');
        var fontAwesomeDirectoryName = results.iconSet.name.toLowerCase()
            .replace(/\s/g, '-');
        var fontAwesomeDirectory = fontAwesomeDirectoryName + "-" + asset.version + "-web";
        var iconsMetadataFilePath = path_1.resolve(paths.assetDirectoryPath, fontAwesomeDirectory, 'metadata', 'icons.json');
        var categoriesFilePath = path_1.resolve(paths.assetDirectoryPath, fontAwesomeDirectory, 'metadata', 'categories.yml');
        fse.readFile(iconsMetadataFilePath, function (iconsErr, iconsData) {
            if (!iconsErr) {
                var iconMetadata_1 = JSON.parse(iconsData.toString());
                var iconNames = Object.keys(iconMetadata_1);
                var icons_1 = [];
                var categories_1 = [];
                iconNames.forEach(function (iconName) {
                    var iconMeta = iconMetadata_1[iconName];
                    if (!iconMeta.private) {
                        var searchTerms = iconMeta.search
                            ? (iconMeta.search.terms || [])
                            : (iconMeta.terms || []);
                        // solid
                        if (iconMeta.styles.includes('solid')) {
                            icons_1.push(new Icon_1.default({
                                name: iconName,
                                type: IconType_1.default.SOLID,
                                unicode: iconMeta.unicode,
                                searchTerms: searchTerms,
                            }));
                        }
                        // outline
                        if (iconMeta.styles.includes('regular')) {
                            icons_1.push(new Icon_1.default({
                                name: iconName,
                                type: IconType_1.default.OUTLINE,
                                unicode: iconMeta.unicode,
                                searchTerms: searchTerms,
                            }));
                        }
                        // thin
                        if (iconMeta.styles.includes('light')) {
                            icons_1.push(new Icon_1.default({
                                name: iconName,
                                type: IconType_1.default.THIN,
                                unicode: iconMeta.unicode,
                                searchTerms: searchTerms,
                            }));
                        }
                        // brand
                        if (iconMeta.styles.includes('brands')) {
                            icons_1.push(new Icon_1.default({
                                name: iconName,
                                type: IconType_1.default.BRAND,
                                unicode: iconMeta.unicode,
                                searchTerms: searchTerms,
                            }));
                        }
                    }
                });
                var sortAz_1 = function (a, b) {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                };
                icons_1 = icons_1.sort(sortAz_1);
                parseSpinner.text = 'parsing categories';
                fse.readFile(categoriesFilePath, function (categoriesErr, categoriesData) {
                    if (!categoriesErr) {
                        var categoriesMetadata_1 = js_yaml_1.safeLoad(categoriesData.toString());
                        var categoryNames = Object.keys(categoriesMetadata_1);
                        categoryNames.forEach(function (categoryName) {
                            var categoryMeta = categoriesMetadata_1[categoryName];
                            var categoryIcons = [];
                            categoryMeta.icons.forEach(function (iconName) {
                                icons_1.filter(function (i) { return i.rawName === iconName; })
                                    .forEach(function (icon) {
                                    categoryIcons.push(icon);
                                });
                            });
                            categories_1.push(new Category_1.default({
                                name: categoryName,
                                label: categoryMeta.label,
                                icons: categoryIcons.sort(sortAz_1),
                            }));
                        });
                        categories_1 = categories_1
                            .sort(sortAz_1);
                        categories_1.push(new Category_1.default({
                            name: 'brands',
                            label: 'Brands',
                            icons: icons_1
                                .filter(function (i) { return i.type === IconType_1.default.BRAND; })
                                .sort(sortAz_1),
                        }));
                        var parseResults = {
                            icons: {
                                solid: icons_1.filter(function (i) { return i.type === IconType_1.default.SOLID; }),
                                outline: icons_1.filter(function (i) { return i.type === IconType_1.default.OUTLINE; }),
                                thin: icons_1.filter(function (i) { return i.type === IconType_1.default.THIN; }),
                                brand: icons_1.filter(function (i) { return i.type === IconType_1.default.BRAND; }),
                            },
                            categories: categories_1,
                        };
                        var _a = parseResults.icons, solidIcons = _a.solid, outlineIcons = _a.outline, thinIcons = _a.thin, brandIcons = _a.brand;
                        var totalIcons = solidIcons.length + outlineIcons.length
                            + thinIcons.length + brandIcons.length;
                        parseSpinner.succeed('icons & categories parsed');
                        Logger_1.default.log();
                        Logger_1.default.log(chalk_1.default.cyan('  Results:'));
                        Logger_1.default.log("    Solid:   " + chalk_1.default.cyan(String(solidIcons.length)));
                        Logger_1.default.log("    Outline: " + chalk_1.default.cyan(String(outlineIcons.length)));
                        Logger_1.default.log("    Thin:    " + chalk_1.default.cyan(String(thinIcons.length)));
                        Logger_1.default.log("    Brand:   " + chalk_1.default.cyan(String(brandIcons.length)));
                        Logger_1.default.log("             " + chalk_1.default.cyan(String(totalIcons)));
                        resolve({
                            icons: {
                                solid: {
                                    icons: solidIcons,
                                    aliases: aliases_json_1.default.filter(function (alias) { return alias.type === 'solid'; })
                                        .sort(sortAz_1),
                                },
                                outline: {
                                    icons: outlineIcons,
                                    aliases: aliases_json_1.default.filter(function (alias) { return alias.type === 'outline'; })
                                        .sort(sortAz_1),
                                },
                                thin: {
                                    icons: thinIcons,
                                    aliases: aliases_json_1.default.filter(function (alias) { return alias.type === 'thin'; })
                                        .sort(sortAz_1),
                                },
                                brand: {
                                    icons: brandIcons,
                                    aliases: aliases_json_1.default.filter(function (alias) { return alias.type === 'brand'; })
                                        .sort(sortAz_1),
                                },
                            },
                            categories: categories_1,
                            fontAssetsDirectory: path_1.resolve(paths.assetDirectoryPath, fontAwesomeDirectory, 'webfonts'),
                            fontFileNames: {
                                'fa-solid-900': 'icons',
                                'fa-regular-400': 'outline-icons',
                                'fa-light-300': 'thin-icons',
                                'fa-brands-400': 'brand-icons',
                            },
                        });
                    }
                    else {
                        parseSpinner.stop();
                        Logger_1.default.error(categoriesErr);
                        process.exit(1);
                    }
                });
            }
            else {
                parseSpinner.stop();
                Logger_1.default.error(iconsErr);
                process.exit(1);
            }
        });
    });
}
exports.default = parse;
