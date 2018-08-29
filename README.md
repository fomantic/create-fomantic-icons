# [Fomantic-UI](https://github.com/fomantic/Fomantic-UI) Icon Generation Script

Generate the `icons.overrides` and `icon.html.eco` files for Fomantic-UI and Semantic-UI.

You can use this script to generate the icons for free and pro versions of [FontAwesome](https://fontawesome.com).


## Usage

First clone the repository and install the npm dependencies.
```console
$ git clone git@github.com:fomantic/icon-script.git
$ cd icon-script
$ npm install 
```

Now download the latest version of FontAwesome from their website [fontawesome.com](https://fontawesome.com) (if you have a pro license you can use the pro version).

Once you have downloaded the latest `.zip` file extract it to the root directory of the repository. You should end up with a structure similar to the following.
```text
fontawesome-free-x.x.x-web.zip
fontawesome-free-x.x.x-web/
node_modules/
src/
static/
templates/
index.mjs
config.json
```

Once the FontAwesome `.zip` is extracted you can now generate the icon files, simply run `npm start` to start the generation.

```console
$ npm start
```

Once the script has finished running you will see a new directory called `dist/` was created. This is where the `icon.overrides` and `icon.html.eco` files are created. These files are created in a directory structure the same as their main repositories, this can help transport them to the correct place.

```text
dist/
  server/
  src/
```

The `dist/server/` directory contains the `icon.html.eco` file used for the docs page. The `dist/src/` directory is the Fomantic-UI src code file. There is also another file created inside `dist/` called `icon-map.json` this is a simple JSON file containing a map of all the icons generated from the metadata. The font files are also inside `dist/src/` ready to drop into the FUI src with the correct names.

## Customization

To customize the script you can modify the files inside `templates/`, `static/` and the `config.json` file. These files can help you create custom output. The templates use [Crather](https://github.com/HamiStudios/crather) which is a simple render engine which is used to simply add the icon variables into the template files.
