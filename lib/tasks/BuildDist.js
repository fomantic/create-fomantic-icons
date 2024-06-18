// node
import { resolve as resolvePath } from 'path';
// npm
import { Liquid } from 'liquidjs';
import * as fs from 'fs';
import * as fse from 'fs-extra';
// utils
import Logger, { spinner } from '../util/Logger.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(fileURLToPath(import.meta.url));
export default function run(results, parseResults) {
    return new Promise((resolve) => {
        Logger.log();
        const distSpinner = spinner()
            .start('building dist');
        const engine = new Liquid({
            root: resolvePath(__dirname, '../../src/templates'),
            extname: '.liquid',
            ownPropertyOnly: false,
        });
        const ctx = parseResults;
        ctx.version = results.asset.version;
        const distFiles = {
            'icon.html.eco': 'docs/server/documents/elements/',
            'icon.overrides': 'ui/src/themes/default/elements/',
            'icon.variables': 'ui/src/themes/default/elements/',
        };
        const templateFileRenderFuncs = Object.keys(distFiles)
            .map((filename) => new Promise((resolveRender, rejectRender) => {
            engine.renderFile(`${filename}.liquid`, ctx)
                .then((renderResult) => {
                const fileOutputDirectory = resolvePath(results.distPath, distFiles[filename]);
                fse.mkdirp(fileOutputDirectory)
                    .then(() => {
                    fs.writeFile(resolvePath(fileOutputDirectory, filename), renderResult, (err) => {
                        if (err) {
                            return rejectRender();
                        }
                        resolveRender();
                    });
                })
                    .catch(rejectRender);
            })
                .catch(rejectRender);
        }));
        const copyAssetsFunc = new Promise((resolveAssetCopy, rejectAssetCopy) => {
            fs.readdir(parseResults.fontAssetsDirectory, (err, files) => {
                if (err) {
                    return rejectAssetCopy();
                }
                let copiedFiles = 0;
                const copied = () => {
                    copiedFiles += 1;
                    if (copiedFiles >= files.length) {
                        resolveAssetCopy();
                    }
                };
                const distPath = resolvePath(results.distPath, 'ui/src/themes/default/assets/fonts');
                fse.mkdirp(distPath)
                    .then(() => {
                    files.forEach((file) => {
                        const [fileName, fileExtension] = file.split('.');
                        let newFileName = parseResults.fontFileNames[fileName];
                        if (newFileName && fileExtension && fileExtension.toLowerCase().startsWith('woff')) {
                            newFileName += `.${fileExtension}`;
                            const assetFilePath = resolvePath(parseResults.fontAssetsDirectory, file);
                            const assetDistPath = resolvePath(distPath, newFileName);
                            fs.copyFile(assetFilePath, assetDistPath, (err2) => {
                                if (err2) {
                                    return rejectAssetCopy();
                                }
                                copied();
                            });
                        }
                        else {
                            copied();
                        }
                    });
                })
                    .catch(rejectAssetCopy);
            });
        });
        fse.mkdirp(results.distPath)
            .then(() => {
            Promise
                .all([
                ...templateFileRenderFuncs,
                copyAssetsFunc,
            ])
                .then(() => {
                distSpinner.succeed('build all dist files');
                Logger.log(`  Files saved to ${results.distPath}`);
                resolve();
            })
                .catch((err) => {
                distSpinner.stop();
                Logger.error(err);
                process.exit(1);
            });
        })
            .catch((err) => {
            distSpinner.stop();
            Logger.error(err);
            process.exit(1);
        });
    });
}
