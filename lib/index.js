// tasks
import InitialPrompt from './tasks/InitialPrompt.js';
import DownloadAsset from './tasks/DownloadAsset.js';
import BuildDist from './tasks/BuildDist.js';
import CleanUp from './tasks/CleanUp.js';
// utils
import Logger from './util/Logger.js';
export default function run() {
    if (process.argv.includes('--clean')) {
        CleanUp()
            .then(() => {
            process.exit(0);
        });
    }
    else {
        InitialPrompt()
            .then((results) => {
            DownloadAsset(results)
                .then((paths) => {
                import(`./parsers/${results.iconSet.parser}.js`)
                    .then((Parser) => {
                    Parser.default(results, paths)
                        .then((parseResults) => {
                        BuildDist(results, parseResults)
                            .then(() => {
                            process.exit(0);
                        });
                    });
                })
                    .catch((err) => {
                    Logger.error(err);
                    process.exit(1);
                });
            });
        });
    }
}
