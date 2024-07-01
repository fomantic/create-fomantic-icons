// node
import { resolve as resolvePath } from 'path';
import { tmpdir } from 'os';
// npm
import axios from 'axios';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { Extract as extractZip } from 'unzipper';
// utils
import Logger, { spinner } from '../util/Logger.js';
export function extractAsset(asset, filePath) {
    return new Promise((resolve) => {
        const extractSpinner = spinner()
            .start(`extracting asset zip (${asset.name})`);
        const assetDirectory = resolvePath(tmpdir(), 'fui-icon-script', asset.name
            .split('.').slice(0, -1).join('.'));
        const assetReadStream = fs.createReadStream(filePath);
        assetReadStream
            .pipe(extractZip({
            path: assetDirectory,
        }));
        assetReadStream
            .once('error', (err) => {
            extractSpinner.stop();
            Logger.error(err);
            process.exit(1);
        });
        assetReadStream
            .once('close', () => {
            extractSpinner.succeed(`asset extracted (${assetDirectory})`);
            resolve(assetDirectory);
        });
    });
}
export function saveAssetFile(asset, data) {
    return new Promise((resolve) => {
        const saveSpinner = spinner()
            .start(`saving asset (${asset.name})`);
        const filePath = resolvePath(tmpdir(), 'fui-icon-script', asset.name);
        // @ts-ignore
        fse.outputFile(filePath, data, (saveErr) => {
            if (!saveErr) {
                saveSpinner.succeed(`asset saved (${filePath})`);
                resolve(filePath);
            }
            else {
                saveSpinner.stop();
                Logger.error(saveErr);
                process.exit(1);
            }
        });
    });
}
export function downloadAsset(results) {
    return new Promise((resolve) => {
        const { asset, } = results;
        const downloadSpinner = spinner()
            .start(`downloading (${asset.name})`);
        const axiosConfig = {
            responseType: 'arraybuffer',
            headers: {
                Accept: 'application/octet-stream',
                'User-Agent': 'request-module',
            },
            encoding: null,
        };
        if (results.iconSet.requiresAuth) {
            axiosConfig.headers.Authorization = `token ${results.accessToken}`;
        }
        const apiDownloadUrl = `https://${results.accessToken}:@api.github.com/repos/${results.iconSet.repo}/releases/assets/${results.asset.id}`;
        let isDownloading = true;
        const downloadTextTimer = setTimeout(() => {
            if (isDownloading) {
                downloadSpinner.text = `${downloadSpinner.text} [still downloading, hold on]`;
            }
        }, 1000 * 120 /* 2mins */);
        axios
            .get(apiDownloadUrl, axiosConfig)
            .then(({ data, status }) => {
            isDownloading = false;
            clearTimeout(downloadTextTimer);
            if (status === 200) {
                downloadSpinner.succeed(`downloaded (${asset.name})`);
                resolve(data);
            }
            else {
                downloadSpinner.stop();
                Logger.error(new Error('Failed to download asset file.'));
                process.exit(1);
            }
        })
            .catch((err) => {
            downloadSpinner.stop();
            Logger.error(err);
            process.exit(1);
        });
    });
}
export function startDownload(results) {
    return new Promise((resolve) => {
        downloadAsset(results)
            .then((downloadData) => {
            saveAssetFile(results.asset, downloadData)
                .then((assetFilePath) => {
                extractAsset(results.asset, assetFilePath)
                    .then((assetDirectoryPath) => {
                    resolve({
                        assetFilePath,
                        assetDirectoryPath,
                    });
                });
            });
        });
    });
}
export default function run(results) {
    return new Promise((resolve) => {
        Logger.log();
        const assetCheckSpinner = spinner()
            .start('checking if asset already exists');
        const assetFilePath = resolvePath(tmpdir(), 'fui-icon-script', results.asset.name);
        const assetDirectoryPath = resolvePath(tmpdir(), 'fui-icon-script', results.asset.name
            .split('.').slice(0, -1).join('.'));
        fse.pathExists(assetFilePath)
            .then((assetExists) => {
            if (assetExists) {
                fse.pathExists(assetFilePath)
                    .then((directoryExists) => {
                    if (directoryExists) {
                        assetCheckSpinner.succeed('asset already exists');
                        resolve({
                            assetFilePath,
                            assetDirectoryPath,
                        });
                    }
                    else {
                        assetCheckSpinner.info('asset doesn\'t exist locally, starting download')
                            .stop();
                        startDownload(results)
                            .then(resolve);
                    }
                })
                    .catch((err) => {
                    Logger.error(err);
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
            .catch((err) => {
            Logger.error(err);
            process.exit(1);
        });
    });
}
