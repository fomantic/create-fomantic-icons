import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import Footstep from '@hamistudios/footstep';
import Crather from '@hamistudios/crather';
import inq from 'inquirer';
import Config from './config.json';
import Mapper from './src/mapper';
import Icon from './src/models/Icon.mjs';


const logger = new Footstep.Logger();

logger.clear();

fs.readdir('./', (err, files) => {
  if (err) {
    process.exit(1);
  } else {
    let fa = files.filter((file) => {
      if (file.startsWith('fontawesome') && !file.endsWith('.zip')) {
        return file;
      }
      return false;
    });
    
    let createMap = (root_path, callback) => {
      fs.readFile(root_path + Config['paths']['metadata']['icons'], (err, iconContent) => {
        if (err) {
          logger.error(err);
          process.exit(1);
        } else {
          fs.readFile(root_path + Config['paths']['metadata']['categories'], (err, categoryContent) => {
            if (err) {
              logger.error(err);
              process.exit(1);
            } else {
              try {
                callback(Mapper.icon(
                  JSON.parse(iconContent.toString()),
                  categoryContent.toString()
                ));
              } catch (err) {
                logger.error(err);
                process.exit(1);
              }
            }
          });
        }
      });
    };
    
    let createDistFile = (data, templatePath, distPath, callback) => {
      let crather = new Crather({
        data: data,
        scripts: './templates/scripts'
      });
      
      crather.parse(templatePath, (err, result) => {
        if (err) {
          logger.error(err);
          process.exit(1);
        } else {
          let createFile = (callback) => {
            fs.writeFile(
              distPath,
              result.getRendered(),
              { encoding: 'utf8' },
              (err) => {
                if (err) {
                  logger.error(err);
                  process.exit(1);
                } else {
                  logger.notice(`${path.basename(distPath)} file generated.`);
                  callback();
                }
              }
            );
          };
          
          if (!fs.existsSync(path.dirname(distPath))) {
            fse.mkdirs(path.dirname(distPath), null, (err) => {
              if (err) {
                logger.error(err);
                process.exit(1);
              } else {
                createFile(callback);
              }
            });
          } else {
            createFile(callback);
          }
        }
      });
    };
    
    let createDistFonts = (filePath, files, distPath, callback) => {
      let cpFiles = (filePath, files) => {
        let rename = (file, newName) => {
          fse.copySync(filePath + file, distPath + newName + path.extname(file));
        };
        
        files.forEach((file) => {
          if (file.startsWith('fa-brands')) { // brands
            rename(file, 'brand-icons');
          } else if (file.startsWith('fa-regular')) { // outline
            rename(file, 'outline-icons');
          } else if (file.startsWith('fa-solid')) { // solid
            rename(file, 'icons');
          } else if (file.startsWith('fa-light')) { // light
            rename(file, 'thin-icons');
          }
        });
        
        callback();
      };
      
      if (!fs.existsSync(distPath)) {
        fse.mkdirs(distPath, null, (err) => {
          if (err) {
            logger.error(err);
            process.exit(1);
          } else {
            cpFiles(filePath, files);
          }
        });
      } else {
        cpFiles(filePath, files);
      }
    };
    
    let generateSrc = (icons, version, callback) => {
      logger.notice('Generating overrides file...');
      
      let aliases = JSON.parse(fs.readFileSync('./static/aliases.json')).map((icon) => {
        return new Icon(
          icon.faName,
          icon.fuiName,
          icon.className,
          icon.unicode,
          icon.solid,
          icon.outline,
          icon.brand,
          icon.thin,
          icon.categories,
          [],
        );
      });
      
      let lists = {
        solidDefinitions: [],
        solidAliases: [],
        outlineDefinitions: [],
        outlineAliases: [],
        brandsDefinitions: [],
        brandAliases: [],
        thinDefinitions: [],
        thinAliases: [],
      };
      
      icons.forEach((icon) => {
        if (icon.isSolid()) {
          lists.solidDefinitions.push(icon);
        }
        
        if (icon.isOutline()) {
          lists.outlineDefinitions.push(icon);
        }
        
        if (icon.isBrand()) {
          lists.brandsDefinitions.push(icon);
        }

        if (icon.isThin()) {
          lists.thinDefinitions.push(icon);
        }
      });
      
      aliases.forEach((icon) => {
        if (icon.isSolid()) {
          lists.solidAliases.push(icon);
        }
        
        if (icon.isOutline()) {
          lists.outlineAliases.push(icon);
        }
        
        if (icon.isBrand()) {
          lists.brandAliases.push(icon);
        }

        if (icon.isThin()) {
          lists.thinAliases.push(icon);
        }
      });
  
      let totalIcons = 0;
  
      let addTotal = (amount) => {
        totalIcons = totalIcons + amount;
    
        return amount;
      };
  
      logger
        .info('Icon Count:')
        .info(`  Solid:   ${addTotal(lists.solidDefinitions.length + lists.solidAliases.length)}`)
        .info(`  Outline: ${addTotal(lists.outlineDefinitions.length + lists.outlineAliases.length)}`)
        .info(`  Brands:  ${addTotal(lists.brandsDefinitions.length + lists.brandAliases.length)}`)
        .info(`  Thin:    ${addTotal(lists.thinDefinitions.length + lists.thinAliases.length)}`)
        .info(`           ${totalIcons}`)
      ;
      
      let css = {
        solid: {
          definitions: lists.solidDefinitions.map((icon) => {
            return `i.icon.${icon.getClassName()}:before { content: "\\${icon.getUnicode()}"; }`;
          }).join('\n'),
          aliases: lists.solidAliases.map((icon) => {
            return `i.icon.${icon.getClassName()}:before { content: "\\${icon.getUnicode()}"; }`;
          }).join('\n'),
        },
        outline: {
          definitions: lists.outlineDefinitions.map((icon) => {
            return `i.icon.${icon.getClassName()}:before { content: "\\${icon.getUnicode()}"; }`;
          }).join('\n  '),
          aliases: {
            font: lists.outlineAliases.map((icon) => {
              return `i.icon.${icon.getClassName()}`;
            }).join(',\n  '),
            definitions: lists.outlineAliases.map((icon) => {
              return `i.icon.${icon.getClassName()}:before { content: "\\${icon.getUnicode()}"; }`;
            }).join('\n  '),
          },
        },
        brand: {
          font: lists.brandsDefinitions.map((icon) => {
            return `i.icon.${icon.getClassName()}`;
          }).join(',\n  '),
          definitions: lists.brandsDefinitions.map((icon) => {
            return `i.icon.${icon.getClassName()}:before { content: "\\${icon.getUnicode()}"; }`;
          }).join('\n  '),
          aliases: {
            font: lists.brandAliases.map((icon) => {
              return `i.icon.${icon.getClassName()}`;
            }).join(',\n  '),
            definitions: lists.brandAliases.map((icon) => {
              return `i.icon.${icon.getClassName()}:before { content: "\\${icon.getUnicode()}"; }`;
            }).join('\n  '),
          },
        },
        thin: {
          font: lists.thinDefinitions.map((icon) => {
            return `i.icon.${icon.getClassName()}`;
          }).join(',\n  '),
          definitions: lists.thinDefinitions.map((icon) => {
            return `i.icon.${icon.getClassName()}:before { content: "\\${icon.getUnicode()}"; }`;
          }).join('\n  '),
          aliases: {
            font: lists.thinAliases.map((icon) => {
              return `i.icon.${icon.getClassName()}`;
            }).join(',\n  '),
            definitions: lists.thinAliases.map((icon) => {
              return `i.icon.${icon.getClassName()}:before { content: "\\${icon.getUnicode()}"; }`;
            }).join('\n  '),
          },
        },
      };
      
      createDistFile(
        {
          solid: {
            definitions: css.solid.definitions,
            aliases: css.solid.aliases,
          },
          outline: {
            definitions: css.outline.definitions,
            aliases: {
              font: css.outline.aliases.font,
              definitions: css.outline.aliases.definitions,
            },
          },
          brands: {
            font: css.brand.font,
            definitions: css.brand.definitions,
            aliases: {
              font: css.brand.aliases.font,
              definitions: css.brand.aliases.definitions,
            }
          },
          thin: {
            font: css.thin.font,
            definitions: css.thin.definitions,
            aliases: {
              font: css.thin.aliases.font,
              definitions: css.thin.aliases.definitions,
            },
          },
          version: version,
        },
        Config['paths']['templates']['src'],
        Config['paths']['dist']['src'],
        callback
      );
    };
    
    let generateDocs = (icons, version, callback) => {
      logger.notice('Generating docs page...');
      
      let categories = Mapper.category(icons);
      
      let categoryHTML = categories.map((category) => {
        let displayHTML = category.getIcons().map((icon) => {
          return `<div class="column"><i class="${icon.getFUIName()} icon" data-search-terms="${icon.getSearchTerms().join(', ')}"></i>${icon.getFUIName()}</div>`;
        }).join('\n        ');
        
        let codeHTML = category.getIcons().map((icon) => {
          return `<i class="${icon.getFUIName()} icon"></i>`;
        }).join('\n        ');
        
        return `<div class="icon example">
      <h4 class="ui header">${category.getFUIName()}</h4>
      <p>${category.getDescription()}</p>
      <div class="ui doubling five column grid">
        ${displayHTML}
      </div>
      <div class="existing code">
        ${codeHTML}
      </div>
    </div>`;
      }).join('\n\n    ');
      
      createDistFile(
        {
          categories: categoryHTML,
          version: version
        },
        Config['paths']['templates']['docs'],
        Config['paths']['dist']['docs'],
        callback
      );
    };
    
    let start = (dir) => {
      logger.notice(`Found FontAwesome directory '${dir}' gathering icon metadata...`);
      
      createMap(dir, (icons) => {
        
        if (!fs.existsSync(Config['paths']['dist']['map'])) {
          fse.mkdirs(path.dirname(Config['paths']['dist']['map']), null, (err) => {
            if (err) {
              logger.error(err);
              process.exit(1);
            } else {
              fs.writeFileSync(Config['paths']['dist']['map'], JSON.stringify(icons, null, 2));
            }
          });
        } else {
          fs.writeFileSync(Config['paths']['dist']['map'], JSON.stringify(icons, null, 2));
        }
        
        logger.notice('Icon map generated.');
        
        let version = dir.match(/\d+\.\d+\.\d+/)[0];
        
        generateSrc(icons, version, () => {
          generateDocs(icons, version, () => {
            
            logger.notice('Renaming font files...');
            
            let fontPath = dir + Config['paths']['fonts'];
            
            fs.readdir(
              fontPath,
              null,
              (err, files) => {
                if (err) {
                  logger.error(err);
                  process.exit(1);
                } else {
                  createDistFonts(
                    fontPath,
                    files,
                    Config['paths']['dist']['fonts'],
                    () => {
                      logger
                        .notice('Font files renamed.')
                        .notice('Script ran successfully.'.green)
                      ;
                    }
                  );
                }
              }
            );
          });
        });
      });
    };
    
    if (fa.length === 1) {
      let dir = fa[0];
      
      start(dir);
    } else if (fa.length > 1) {
      fa = fa.reverse();
      
      inq.prompt([
        {
          type: 'list',
          name: 'dir',
          message: 'Choose which FontAwesome directory you want to use',
          default: fa[0],
          choices: fa,
        }
      ])
        .then((answers) => {
          let dir = answers.dir;
          
          start(dir);
        })
        .catch((err) => {
          logger.error(err);
          process.exit(1);
        });
    } else {
      logger.error('No FontAwesome directories found.');
      process.exit(1);
    }
  }
});


// // execute icon map
// import Icons from './src/IconMap.mjs';
//
// console.log(Icons);
