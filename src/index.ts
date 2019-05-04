// tasks
import InitialPrompt from './tasks/InitialPrompt';
import DownloadAsset from './tasks/DownloadAsset';
import BuildDist from './tasks/BuildDist';
import CleanUp from './tasks/CleanUp';

// utils
import Logger from './util/Logger';

// parses
import { ParseResults } from './parsers/FontAwesome';

export default function run() {
  if (process.argv.includes('--clean')) {
    CleanUp()
      .then(() => {
        process.exit(0);
      });
  } else {
    InitialPrompt()
      .then((results) => {
        DownloadAsset(results)
          .then((paths) => {
            import(`./parsers/${results.iconSet.parser}`)
              .then((Parser) => {
                Parser.default(results, paths)
                  .then((parseResults: ParseResults) => {
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
