// node
import { resolve as resolvePath } from 'path';

// npm
import * as fse from 'fs-extra';
import { safeLoad as parseYAML } from 'js-yaml';
import chalk from 'chalk';

// tasks
import { PromptResults } from '../tasks/InitialPrompt';
import { PathResults } from '../tasks/DownloadAsset';

// utils
import Logger, { spinner } from '../util/Logger';

// modals
import Icon from '../modals/Icon';
import Category from '../modals/Category';

// enums
import IconType from '../enums/IconType';

// static
import aliases from '../static/aliases.json';

export interface IconMeta {
  search: {
    terms: string[];
  };
  terms?: string[];
  styles: string[];
  unicode: string;
  private: boolean;
}

export interface CategoryMeta {
  icons: string[];
  label: string;
}

export interface ParseResults {
  icons: {
    solid: {
      icons:Icon[];
      aliases: object[];
    };
    outline: {
      icons: Icon[];
      aliases: object[];
    }
    thin: {
      icons: Icon[];
      aliases: object[];
    }
    brand: {
      icons: Icon[];
      aliases: object[];
    }
  };
  categories: Category[];
  fontAssetsDirectory: string;
  fontFileNames: { [key: string]: string };
}

export default function parse(results: PromptResults, paths: PathResults): Promise<ParseResults> {
  return new Promise((resolve) => {
    const {
      asset,
    } = results;

    const parseSpinner = spinner()
      .start('parsing icons');

    const fontAwesomeDirectoryName = results.iconSet.name.toLowerCase()
      .replace(/\s/g, '-');
    const fontAwesomeDirectory = `${fontAwesomeDirectoryName}-${asset.version}-web`;

    const iconsMetadataFilePath = resolvePath(
      paths.assetDirectoryPath,
      fontAwesomeDirectory,
      'metadata',
      'icons.json',
    );
    const categoriesFilePath = resolvePath(
      paths.assetDirectoryPath,
      fontAwesomeDirectory,
      'metadata',
      'categories.yml',
    );

    fse.readFile(iconsMetadataFilePath, (iconsErr, iconsData) => {
      if (!iconsErr) {
        const iconMetadata = JSON.parse(iconsData.toString());
        const iconNames = Object.keys(iconMetadata);
        let icons: Icon[] = [];
        let categories: Category[] = [];

        iconNames.forEach((iconName) => {
          const iconMeta: IconMeta = iconMetadata[iconName];

          if (!iconMeta.private) {
            const searchTerms: string[] = iconMeta.search
              ? (iconMeta.search.terms || [])
              : (iconMeta.terms || []);

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
          }
        });

        const sortAz = (a: {[key: string]: any}, b: {[key: string]: any}) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        };

        icons = icons.sort(sortAz);

        parseSpinner.text = 'parsing categories';

        fse.readFile(categoriesFilePath, (categoriesErr, categoriesData) => {
          if (!categoriesErr) {
            const categoriesMetadata = parseYAML(categoriesData.toString());
            const categoryNames = Object.keys(categoriesMetadata);

            categoryNames.forEach((categoryName) => {
              const categoryMeta: CategoryMeta = categoriesMetadata[categoryName];

              const categoryIcons: Icon[] = [];

              categoryMeta.icons.forEach((iconName) => {
                icons.filter(i => i.rawName === iconName)
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
                .filter(i => i.type === IconType.BRAND)
                .sort(sortAz),
            }));

            const parseResults = {
              icons: {
                solid: icons.filter(i => i.type === IconType.SOLID),
                outline: icons.filter(i => i.type === IconType.OUTLINE),
                thin: icons.filter(i => i.type === IconType.THIN),
                brand: icons.filter(i => i.type === IconType.BRAND),
              },
              categories,
            };

            const {
              solid: solidIcons,
              outline: outlineIcons,
              thin: thinIcons,
              brand: brandIcons,
            } = parseResults.icons;

            const totalIcons = solidIcons.length + outlineIcons.length
              + thinIcons.length + brandIcons.length;

            parseSpinner.succeed('icons & categories parsed');
            Logger.log();
            Logger.log(chalk.cyan('  Results:'));
            Logger.log(`    Solid:   ${chalk.cyan(String(solidIcons.length))}`);
            Logger.log(`    Outline: ${chalk.cyan(String(outlineIcons.length))}`);
            Logger.log(`    Thin:    ${chalk.cyan(String(thinIcons.length))}`);
            Logger.log(`    Brand:   ${chalk.cyan(String(brandIcons.length))}`);
            Logger.log(`             ${chalk.cyan(String(totalIcons))}`);

            resolve({
              icons: {
                solid: {
                  icons: solidIcons,
                  aliases: aliases.filter(alias => alias.type === 'solid')
                    .sort(sortAz),
                },
                outline: {
                  icons: outlineIcons,
                  aliases: aliases.filter(alias => alias.type === 'outline')
                    .sort(sortAz),
                },
                thin: {
                  icons: thinIcons,
                  aliases: aliases.filter(alias => alias.type === 'thin')
                    .sort(sortAz),
                },
                brand: {
                  icons: brandIcons,
                  aliases: aliases.filter(alias => alias.type === 'brand')
                    .sort(sortAz),
                },
              },
              categories,
              fontAssetsDirectory: resolvePath(
                paths.assetDirectoryPath,
                fontAwesomeDirectory,
                'webfonts',
              ),
              fontFileNames: {
                'fa-solid-900': 'icons',
                'fa-regular-400': 'outline-icons',
                'fa-light-300': 'thin-icons',
                'fa-brands-400': 'brand-icons',
              },
            });
          } else {
            parseSpinner.stop();
            Logger.error(categoriesErr);
            process.exit(1);
          }
        });
      } else {
        parseSpinner.stop();
        Logger.error(iconsErr);
        process.exit(1);
      }
    });
  });
}
