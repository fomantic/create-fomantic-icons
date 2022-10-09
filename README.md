# [Fomantic-UI](https://github.com/fomantic/Fomantic-UI) Icon CLI Tool

Generate the `icon.variables` and `icon.html.eco` files for Fomantic-UI 2.9.0+

> If you need this tool for FUI <= 2.8.8 or SUI, use version 1.1.0

You can use this script to generate the icons for free and pro versions of [FontAwesome](https://fontawesome.com).

## Requirements
 - [nodejs](https://nodejs.org)
 - [npm](https://npmjs.com)
 - or [yarn](https://yarnpkg.com)

## Usage

#### npm
```console
$ npx create-fomantic-icons
```

#### yarn
```console
$ yarn create fomantic-icons
```

Once downloaded you will be prompt with a few questions which will allow you to generate the specific icon set you want.

Select which FontAweome icon set you want
```console
Which icons set would you like to generate?
  > FontAwesome 5 Free
    FontAwesome 6+ Free  
    FontAwesome Pro
```
> NOTE: You need a license to generate the icons from FontAwesome Pro


Next select which version you want to use
```console
Which version of FontAwesome 5 Free should we download?
  > 5.8.1
    5.8.0
    5.7.2
    5.7.1
    5.7.0
```


Now you need to specify where to save your icons
```console
Where would you like the dist saved? [C:\Users\Username\Documents\fui-icons]
```
> NOTE: The default location is `{pwd}/fui-icons`. When you specify your own location it is relative from your current pwd.
> For example if I enter `new-icons` my icons will be placed in `C:\Users\Username\Documents\new-icons`.


Once you have answered all the prompts the icon set you picked will be downloaded from GitHub and will be parsed. 
Once it is downloaded and parsed it will build the required files for the a FUI (or SUI) theme and the docs page in the location
you specified.
```console
i asset doesn't exist locally, starting download
√ downloaded (fontawesome-free-5.8.1-web.zip)
√ asset saved (C:\Users\Username\AppData\Local\Temp\fui-icon-script\fontawesome-free-5.8.1-web.zip)
√ asset extracted (C:\Users\Username\AppData\Local\Temp\fui-icon-script\fontawesome-free-5.8.1-web)
√ icons & categories parsed

  Results:
    Solid:   936
    Outline: 151
    Thin:    0
    Brand:   426
             1513

√ build all dist files
  Files saved to C:\Users\Username\Documents\new-icons
```
> NOTE: If the script detects you have already downloaded the icon set it will skip the download and use the local files.

## Remove downloaded files

If you want to delete the downloaded files its really simple.

#### npm
```console
$ npx create-fomantic-icons --clean
```

#### yarn

```console
$ yarn create fomantic-icons --clean
```
