// node
import { resolve as resolvePath } from 'path';
// npm
import * as fs from 'fs';
import { load as parseYAML } from 'js-yaml';
import chalk from 'chalk';
// utils
import Logger, { spinner } from '../util/Logger.js';
// modals
import Icon from '../modals/Icon.js';
import Category from '../modals/Category.js';
// enums
import IconType from '../enums/IconType.js';
// static
import aliases from '../static/aliases.json' with { type: 'json' };
export default function parse(results, paths) {
    return new Promise((resolve) => {
        const { asset, } = results;
        const parseSpinner = spinner()
            .start('parsing icons');
        const fontAwesomeDirectoryName = results.iconSet.name.toLowerCase()
            .replace(/\d+\+* /g, '')
            .replace(/\s/g, '-');
        const fontAwesomeDirectory = `${fontAwesomeDirectoryName}-${asset.version}-web`;
        const iconsMetadataFilePath = resolvePath(paths.assetDirectoryPath, fontAwesomeDirectory, 'metadata', 'icons.json');
        const categoriesFilePath = resolvePath(paths.assetDirectoryPath, fontAwesomeDirectory, 'metadata', 'categories.yml');
        fs.readFile(iconsMetadataFilePath, (iconsErr, iconsData) => {
            if (!iconsErr) {
                const iconMetadata = JSON.parse(iconsData.toString());
                const iconNames = Object.keys(iconMetadata);
                const deprecatedTester = /(^|-)(in|out)(-|$)/;
                let icons = [];
                let categories = [];
                iconNames.forEach((iconName) => {
                    const iconMeta = iconMetadata[iconName];
                    if (!iconMeta.private) {
                        const searchTerms = iconMeta.search
                            ? (iconMeta.search.terms || [])
                            : (iconMeta.terms || []);
                        // deprecated
                        if (deprecatedTester.test(iconName)) {
                            icons.push(new Icon({
                                name: iconName,
                                type: IconType.DEPRECATED,
                                unicode: iconMeta.unicode,
                                searchTerms,
                            }));
                        }
                        else {
                            // solid
                            if (iconMeta.styles.includes('solid')) {
                                icons.push(new Icon({
                                    name: iconName,
                                    type: IconType.SOLID,
                                    unicode: iconMeta.unicode,
                                    searchTerms,
                                }));
                            }
                            // outline
                            if (iconMeta.styles.includes('regular')) {
                                icons.push(new Icon({
                                    name: iconName,
                                    type: IconType.OUTLINE,
                                    unicode: iconMeta.unicode,
                                    searchTerms,
                                }));
                            }
                            // thin
                            if (iconMeta.styles.includes('light')) {
                                icons.push(new Icon({
                                    name: iconName,
                                    type: IconType.THIN,
                                    unicode: iconMeta.unicode,
                                    searchTerms,
                                }));
                            }
                            // brand
                            if (iconMeta.styles.includes('brands')) {
                                icons.push(new Icon({
                                    name: iconName,
                                    type: IconType.BRAND,
                                    unicode: iconMeta.unicode,
                                    searchTerms,
                                }));
                            }
                            // duotone
                            if (iconMeta.styles.includes('duotone')) {
                                icons.push(new Icon({
                                    name: iconName,
                                    type: IconType.DUOTONE,
                                    unicode: iconMeta.unicode,
                                    searchTerms,
                                }));
                            }
                        }
                    }
                });
                const sortAz = (a, b) => {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                };
                // eslint-disable-next-line max-len
                const deprecatedAliases = aliases.filter((alias) => deprecatedTester.test(alias.rawName)).sort(sortAz);
                icons = icons.sort(sortAz);
                parseSpinner.text = 'parsing categories';
                fs.readFile(categoriesFilePath, (categoriesErr, categoriesData) => {
                    if (!categoriesErr) {
                        const categoriesMetadata = parseYAML(categoriesData.toString());
                        // @ts-ignore
                        const categoryNames = Object.keys(categoriesMetadata);
                        categoryNames.forEach((categoryName) => {
                            // @ts-ignore
                            const categoryMeta = categoriesMetadata[categoryName];
                            const categoryIcons = [];
                            categoryMeta.icons.forEach((iconName) => {
                                icons.filter((i) => i.rawName === iconName)
                                    .forEach((icon) => {
                                    categoryIcons.push(icon);
                                });
                            });
                            categories.push(new Category({
                                name: categoryName,
                                label: categoryMeta.label,
                                icons: categoryIcons.sort(sortAz),
                            }));
                        });
                        categories = categories
                            .sort(sortAz);
                        categories.push(new Category({
                            name: 'brands',
                            label: 'Brands',
                            icons: icons
                                .filter((i) => i.type === IconType.BRAND)
                                .sort(sortAz),
                        }));
                        categories.push(new Category({
                            name: 'duotone',
                            label: 'Duotone',
                            icons: icons
                                .filter((i) => i.type === IconType.DUOTONE)
                                .sort(sortAz),
                        }));
                        const deprecatedCategoryIcons = icons.filter((i) => i.type === IconType.DEPRECATED);
                        deprecatedAliases.forEach((alias) => {
                            deprecatedCategoryIcons.push(new Icon({
                                name: alias.name,
                                type: IconType.DEPRECATED,
                                unicode: alias.unicode,
                                searchTerms: [],
                            }));
                            deprecatedCategoryIcons.sort(sortAz);
                        });
                        categories.push(new Category({
                            name: 'deprecated',
                            label: 'Deprecated',
                            icons: deprecatedCategoryIcons,
                        }));
                        const parseResults = {
                            icons: {
                                solid: icons.filter((i) => i.type === IconType.SOLID),
                                outline: icons.filter((i) => i.type === IconType.OUTLINE),
                                thin: icons.filter((i) => i.type === IconType.THIN),
                                brand: icons.filter((i) => i.type === IconType.BRAND),
                                duotone: icons.filter((i) => i.type === IconType.DUOTONE),
                                deprecated: icons.filter((i) => i.type === IconType.DEPRECATED),
                            },
                            categories,
                        };
                        const { solid: solidIcons, outline: outlineIcons, thin: thinIcons, brand: brandIcons, duotone: duotoneIcons, deprecated: deprecatedIcons } = parseResults.icons;
                        const totalIcons = solidIcons.length + outlineIcons.length
                            + thinIcons.length + brandIcons.length + duotoneIcons.length
                            + deprecatedIcons.length + deprecatedAliases.length;
                        parseSpinner.succeed('icons & categories parsed');
                        Logger.log();
                        Logger.log(chalk.cyan('  Results:'));
                        Logger.log(`    Solid:      ${chalk.cyan(String(solidIcons.length))}`);
                        Logger.log(`    Outline:    ${chalk.cyan(String(outlineIcons.length))}`);
                        Logger.log(`    Thin:       ${chalk.cyan(String(thinIcons.length))}`);
                        Logger.log(`    Brand:      ${chalk.cyan(String(brandIcons.length))}`);
                        Logger.log(`    Duotone:    ${chalk.cyan(String(duotoneIcons.length))}`);
                        Logger.log(`    Deprecated: ${chalk.cyan(String(deprecatedIcons.length + deprecatedAliases.length))}`);
                        Logger.log(`    ----------------`);
                        Logger.log(`    TOTAL:      ${chalk.cyan(String(totalIcons))}`);
                        resolve({
                            icons: {
                                solid: {
                                    icons: solidIcons,
                                    aliases: aliases.filter((alias) => alias.type === 'solid' && !deprecatedTester.test(alias.rawName))
                                        .sort(sortAz),
                                },
                                outline: {
                                    icons: outlineIcons,
                                    aliases: aliases.filter((alias) => alias.type === 'outline' && !deprecatedTester.test(alias.rawName))
                                        .sort(sortAz),
                                },
                                thin: {
                                    icons: thinIcons,
                                    aliases: aliases.filter((alias) => alias.type === 'thin' && !deprecatedTester.test(alias.rawName))
                                        .sort(sortAz),
                                },
                                brand: {
                                    icons: brandIcons,
                                    aliases: aliases.filter((alias) => alias.type === 'brand' && !deprecatedTester.test(alias.rawName))
                                        .sort(sortAz),
                                },
                                duotone: {
                                    icons: duotoneIcons,
                                    aliases: aliases.filter((alias) => alias.type === 'duotone' && !deprecatedTester.test(alias.rawName))
                                        .sort(sortAz),
                                },
                                deprecated: {
                                    icons: deprecatedIcons,
                                    aliases: deprecatedAliases,
                                },
                            },
                            categories,
                            fontAssetsDirectory: resolvePath(paths.assetDirectoryPath, fontAwesomeDirectory, 'webfonts'),
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
                        Logger.error(categoriesErr);
                        process.exit(1);
                    }
                });
            }
            else {
                parseSpinner.stop();
                Logger.error(iconsErr);
                process.exit(1);
            }
        });
    });
}
