// node
import { resolve as resolvePath } from 'path';
// npm
import qoa from 'qoa';
import chalk from 'chalk';
import axios from 'axios';
// utils
import Logger from '../util/Logger.js';
// icon sets
import IconSets from '../static/icon_sets.json' with { type: 'json' };
export function askForAccessToken() {
    Logger.log();
    return new Promise((resolve) => {
        qoa
            .secure({
            query: 'Enter your GitHub personal access token:',
            handle: 'accessToken',
        })
            .then(({ accessToken }) => {
            if (!accessToken || accessToken.length === 0) {
                Logger.warn('You must enter an access token to proceed.');
                askForAccessToken()
                    .then(resolve);
            }
            else {
                resolve(accessToken);
            }
        })
            .catch((err) => {
            Logger.error(err);
            process.exit(1);
        });
    });
}
export function askWhichIconSet() {
    Logger.log();
    return new Promise((resolve) => {
        qoa
            .interactive({
            handle: 'iconSetName',
            query: 'Which icons set would you like to generate?',
            menu: IconSets.map((s) => s.name),
        })
            .then(({ iconSetName }) => {
            // @ts-ignore
            resolve(IconSets.find((s) => s.name === iconSetName));
        })
            .catch((err) => {
            Logger.error(err);
            process.exit(1);
        });
    });
}
export function selectIconSetVersion(iconSet, accessToken) {
    Logger.log();
    const axiosConfig = accessToken === undefined ? {} : {
        headers: {
            Authorization: `token ${accessToken}`,
        },
    };
    return new Promise((resolve) => {
        axios
            .get(`https://api.github.com/repos/${iconSet.repo}/releases?page=1&per_page=50`, axiosConfig)
            .then(({ status, data }) => {
            if (status === 200) {
                const versions = [];
                data
                    .filter((release) => release.assets
                    .some((asset) => {
                    const regex = new RegExp(iconSet.assetMatch);
                    return regex.test(asset.name);
                }))
                    .forEach((release) => {
                    const asset = release.assets
                        .filter((a) => {
                        const regex = new RegExp(iconSet.assetMatch);
                        return regex.test(a.name);
                    })[0];
                    if (versions.length >= 10) {
                        return;
                    }
                    versions.push({
                        name: asset.name,
                        id: asset.id,
                        version: release.tag_name,
                        downloadUrl: asset.browser_download_url,
                    });
                });
                qoa
                    .interactive({
                    handle: 'setVersion',
                    query: `Which version of ${iconSet.name} should we download?`,
                    menu: versions.map((v) => v.version),
                })
                    .then(({ setVersion }) => {
                    // @ts-ignore
                    resolve(versions.find((v) => v.version === setVersion));
                })
                    .catch((err) => {
                    Logger.error(err);
                    process.exit(1);
                });
            }
            else {
                Logger.error(new Error('Failed to fetch releases from git repository.'));
                process.exit(1);
            }
        })
            .catch((err) => {
            Logger.error(err);
            process.exit(1);
        });
    });
}
export function askForDistPath() {
    return new Promise((resolve) => {
        Logger.log();
        const cwd = process.cwd();
        const defaultPath = resolvePath(cwd, 'fui-icons');
        qoa
            .input({
            type: 'input',
            query: `Where would you like the dist saved? [${defaultPath}]`,
            handle: 'distPath',
        })
            .then(({ distPath }) => {
            resolve(distPath === ''
                ? defaultPath : resolvePath(distPath));
        })
            .catch((err) => {
            Logger.error(err);
            process.exit(1);
        });
    });
}
export default function run() {
    return new Promise((resolve) => {
        qoa.clearScreen();
        Logger.log(chalk.cyan('Fomantic-UI Icon CLI'));
        askWhichIconSet()
            .then((iconSet) => {
            const selectVersion = (accessToken) => {
                selectIconSetVersion(iconSet, accessToken)
                    .then((asset) => {
                    askForDistPath()
                        .then((distPath) => {
                        resolve({
                            iconSet,
                            accessToken,
                            asset,
                            distPath,
                        });
                    });
                });
            };
            if (iconSet.requiresAuth) {
                Logger.log();
                Logger.note('The icon set you selected requires authentication to download.');
                Logger.note('Generate a personal access token here: https://github.com/settings/tokens');
                Logger.note('Your token must allow private repository viewing.');
                askForAccessToken()
                    .then((accessToken) => {
                    selectVersion(accessToken);
                });
            }
            else {
                selectVersion();
            }
        });
    });
}
