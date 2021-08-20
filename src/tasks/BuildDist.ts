// node
import { resolve as resolvePath } from 'path';

// npm
import Liquid from 'liquidjs';
import * as fse from 'fs-extra';

// tasks
import { PromptResults } from './InitialPrompt';
import { ParseResults } from '../parsers/FontAwesome';

// utils
import Logger, { spinner } from '../util/Logger';

export default function run(results: PromptResults, parseResults: ParseResults): Promise<void> {
  return new Promise((resolve) => {
    Logger.log();
    const distSpinner = spinner()
      .start('building dist');

    const engine = new Liquid({
      root: resolvePath(__dirname, '../../src/templates'),
      extname: '.liquid',
    });

    const ctx: { [key: string]: any } = parseResults;
    ctx.version = results.asset.version;

    const distFiles: { [key: string]: string } = {
      'icon.html.eco': 'docs/server/documents/elements/',
      'icon.overrides': 'ui/src/themes/default/elements/',
      'icon.variables': 'ui/src/themes/default/elements/',
    };

    const templateFileRenderFuncs = Object.keys(distFiles)
      .map(filename => new Promise((resolveRender, rejectRender) => {
        engine.renderFile(`${filename}.liquid`, ctx)
          .then((renderResult) => {
            const fileOutputDirectory = resolvePath(results.distPath, distFiles[filename]);
            fse.mkdirp(fileOutputDirectory)
              .then(() => {
                fse.writeFile(
                  resolvePath(fileOutputDirectory, filename),
                  renderResult,
                )
                  .then(() => resolveRender())
                  .catch(rejectRender);
              })
              .catch(rejectRender);
          })
          .catch(rejectRender);
      }));

    const copyAssetsFunc = new Promise((resolveAssetCopy, rejectAssetCopy) => {
      fse.readdir(parseResults.fontAssetsDirectory)
        .then((files) => {
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
                const filenameSplit = file.split('.');
                const newFileName = `${parseResults.fontFileNames[filenameSplit[0]]}.${filenameSplit[1]}`;
                const assetFilePath = resolvePath(
                  parseResults.fontAssetsDirectory,
                  file,
                );
                const assetDistPath = resolvePath(distPath, newFileName);
                fse.copyFile(assetFilePath, assetDistPath)
                  .then(() => {
                    copied();
                  })
                  .catch(rejectAssetCopy);
              });
            })
            .catch(rejectAssetCopy);
        })
        .catch(rejectAssetCopy);
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
