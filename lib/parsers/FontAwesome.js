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
        var parseSpinner = (0, Logger_1.spinner)()
            .start('parsing icons');
        var fontAwesomeDirectoryName = results.iconSet.name.toLowerCase()
            .replace(/\d+\+* /g, '')
            .replace(/\s/g, '-');
        var fontAwesomeDirectory = "".concat(fontAwesomeDirectoryName, "-").concat(asset.version, "-web");
        var iconsMetadataFilePath = (0, path_1.resolve)(paths.assetDirectoryPath, fontAwesomeDirectory, 'metadata', 'icons.json');
        var categoriesFilePath = (0, path_1.resolve)(paths.assetDirectoryPath, fontAwesomeDirectory, 'metadata', 'categories.yml');
        fse.readFile(iconsMetadataFilePath, function (iconsErr, iconsData) {
            if (!iconsErr) {
                var iconMetadata_1 = JSON.parse(iconsData.toString());
                var iconNames = Object.keys(iconMetadata_1);
                var deprecatedTester_1 = /(^|-)(in|out)(-|$)/;
                var icons_1 = [];
                var categories_1 = [];
                iconNames.forEach(function (iconName) {
                    var iconMeta = iconMetadata_1[iconName];
                    if (!iconMeta.private) {
                        var searchTerms = iconMeta.search
                            ? (iconMeta.search.terms || [])
                            : (iconMeta.terms || []);
                        // deprecated
                        if (deprecatedTester_1.test(iconName)) {
                            icons_1.push(new Icon_1.default({
                                name: iconName,
                                type: IconType_1.default.DEPRECATED,
                                unicode: iconMeta.unicode,
                                searchTerms: searchTerms,
                            }));
                        }
                        else {
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
                            // duotone
                            if (iconMeta.styles.includes('duotone')) {
                                icons_1.push(new Icon_1.default({
                                    name: iconName,
                                    type: IconType_1.default.DUOTONE,
                                    unicode: iconMeta.unicode,
                                    searchTerms: searchTerms,
                                }));
                            }
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
                // eslint-disable-next-line max-len
                var deprecatedAliases_1 = aliases_json_1.default.filter(function (alias) { return deprecatedTester_1.test(alias.rawName); }).sort(sortAz_1);
                icons_1 = icons_1.sort(sortAz_1);
                parseSpinner.text = 'parsing categories';
                fse.readFile(categoriesFilePath, function (categoriesErr, categoriesData) {
                    if (!categoriesErr) {
                        var categoriesMetadata_1 = (0, js_yaml_1.load)(categoriesData.toString());
                        // @ts-ignore
                        var categoryNames = Object.keys(categoriesMetadata_1);
                        categoryNames.forEach(function (categoryName) {
                            // @ts-ignore
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
                        categories_1.push(new Category_1.default({
                            name: 'duotone',
                            label: 'Duotone',
                            icons: icons_1
                                .filter(function (i) { return i.type === IconType_1.default.DUOTONE; })
                                .sort(sortAz_1),
                        }));
                        var deprecatedCategoryIcons_1 = icons_1.filter(function (i) { return i.type === IconType_1.default.DEPRECATED; });
                        deprecatedAliases_1.forEach(function (alias) {
                            deprecatedCategoryIcons_1.push(new Icon_1.default({
                                name: alias.name,
                                type: IconType_1.default.DEPRECATED,
                                unicode: alias.unicode,
                                searchTerms: [],
                            }));
                            deprecatedCategoryIcons_1.sort(sortAz_1);
                        });
                        categories_1.push(new Category_1.default({
                            name: 'deprecated',
                            label: 'Deprecated',
                            icons: deprecatedCategoryIcons_1,
                        }));
                        var parseResults = {
                            icons: {
                                solid: icons_1.filter(function (i) { return i.type === IconType_1.default.SOLID; }),
                                outline: icons_1.filter(function (i) { return i.type === IconType_1.default.OUTLINE; }),
                                thin: icons_1.filter(function (i) { return i.type === IconType_1.default.THIN; }),
                                brand: icons_1.filter(function (i) { return i.type === IconType_1.default.BRAND; }),
                                duotone: icons_1.filter(function (i) { return i.type === IconType_1.default.DUOTONE; }),
                                deprecated: icons_1.filter(function (i) { return i.type === IconType_1.default.DEPRECATED; }),
                            },
                            categories: categories_1,
                        };
                        var _a = parseResults.icons, solidIcons = _a.solid, outlineIcons = _a.outline, thinIcons = _a.thin, brandIcons = _a.brand, duotoneIcons = _a.duotone, deprecatedIcons = _a.deprecated;
                        var totalIcons = solidIcons.length + outlineIcons.length
                            + thinIcons.length + brandIcons.length + duotoneIcons.length
                            + deprecatedIcons.length + deprecatedAliases_1.length;
                        parseSpinner.succeed('icons & categories parsed');
                        Logger_1.default.log();
                        Logger_1.default.log(chalk_1.default.cyan('  Results:'));
                        Logger_1.default.log("    Solid:      ".concat(chalk_1.default.cyan(String(solidIcons.length))));
                        Logger_1.default.log("    Outline:    ".concat(chalk_1.default.cyan(String(outlineIcons.length))));
                        Logger_1.default.log("    Thin:       ".concat(chalk_1.default.cyan(String(thinIcons.length))));
                        Logger_1.default.log("    Brand:      ".concat(chalk_1.default.cyan(String(brandIcons.length))));
                        Logger_1.default.log("    Duotone:    ".concat(chalk_1.default.cyan(String(duotoneIcons.length))));
                        Logger_1.default.log("    Deprecated: ".concat(chalk_1.default.cyan(String(deprecatedIcons.length + deprecatedAliases_1.length))));
                        Logger_1.default.log("    ----------------");
                        Logger_1.default.log("    TOTAL:      ".concat(chalk_1.default.cyan(String(totalIcons))));
                        resolve({
                            icons: {
                                solid: {
                                    icons: solidIcons,
                                    aliases: aliases_json_1.default.filter(function (alias) { return alias.type === 'solid' && !deprecatedTester_1.test(alias.rawName); })
                                        .sort(sortAz_1),
                                },
                                outline: {
                                    icons: outlineIcons,
                                    aliases: aliases_json_1.default.filter(function (alias) { return alias.type === 'outline' && !deprecatedTester_1.test(alias.rawName); })
                                        .sort(sortAz_1),
                                },
                                thin: {
                                    icons: thinIcons,
                                    aliases: aliases_json_1.default.filter(function (alias) { return alias.type === 'thin' && !deprecatedTester_1.test(alias.rawName); })
                                        .sort(sortAz_1),
                                },
                                brand: {
                                    icons: brandIcons,
                                    aliases: aliases_json_1.default.filter(function (alias) { return alias.type === 'brand' && !deprecatedTester_1.test(alias.rawName); })
                                        .sort(sortAz_1),
                                },
                                duotone: {
                                    icons: duotoneIcons,
                                    aliases: aliases_json_1.default.filter(function (alias) { return alias.type === 'duotone' && !deprecatedTester_1.test(alias.rawName); })
                                        .sort(sortAz_1),
                                },
                                deprecated: {
                                    icons: deprecatedIcons,
                                    aliases: deprecatedAliases_1,
                                },
                            },
                            categories: categories_1,
                            fontAssetsDirectory: (0, path_1.resolve)(paths.assetDirectoryPath, fontAwesomeDirectory, 'webfonts'),
                            fontFileNames: {
                                'fa-solid-900': 'icons',
                                'fa-regular-400': 'outline-icons',
                                'fa-light-300': 'thin-icons',
                                'fa-brands-400': 'brand-icons',
                                'fa-duotone-900': 'duotone-icons',
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
