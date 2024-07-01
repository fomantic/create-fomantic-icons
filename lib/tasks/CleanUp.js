// node
import { resolve as resolvePath } from 'path';
import { tmpdir } from 'os';
// npm
import * as fse from 'fs-extra';
// utils
import Logger, { spinner } from '../util/Logger.js';
export default function run() {
    return new Promise((resolve) => {
        Logger.log();
        const cleanUpSpinner = spinner()
            .start('cleaning up asset files');
        fse.remove(resolvePath(tmpdir(), 'fui-icon-script'))
            .then(() => {
            cleanUpSpinner.succeed('all assets cleaned up');
            resolve();
        })
            .catch((err) => {
            cleanUpSpinner.stop();
            Logger.error(err);
        });
    });
}
