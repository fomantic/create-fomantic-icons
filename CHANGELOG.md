# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] 2023-01-16

### Added
- Support Duotone icons
- Automatically fetch deprecated icons

## [1.2.0] 2022-09-29

Fomantic-UI 2.9.0+ support only. If you need this script for FUI <= 2.8.8 or SUI, use 1.1.0 instead

### Changed
- Adjusted templates to generate icon.variables for new LESS mapping as of FUI 2.9.0

## [1.1.0] 2022-09-28

This is the last minor version working with FUI < 2.9.0 and SUI 2.4.x

### Changed
- Ability to choose between FA 5 and FA 6+ for version preselection
- Increased number of choosable versions

### Fixed
- Match FUI 2.8.x
- Numbers > 9 were not converted into textual presentations
- Compilation errors

## [1.0.4] 2019-07-06
### Fixed
- Fixed issue in FA 5.9 causing the script to exit because the search terms where undefined (Fixes #16)

## [1.0.3] 2019-05-25
### Fixed
- Fixed issue with pro icon class names having numbers causing CSS errors.
- Fixed unnecessary space in file path

## [1.0.2] 2019-05-09
### Fixed
- Fixed issue with converter not coverting "*-v" to "vertical".

## [1.0.1] - 2019-05-08
### Changed
- Update icon template file description to better describe the integration between FUI and FA.

## [1.0.0] - 2019-05-04
### Added
- v1 CLI
