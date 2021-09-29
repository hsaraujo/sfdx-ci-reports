ci-reports
==========

reports for ci

[![Version](https://img.shields.io/npm/v/ci-reports.svg)](https://npmjs.org/package/ci-reports)
[![CircleCI](https://circleci.com/gh/hsaraujo/ci-reports/tree/master.svg?style=shield)](https://circleci.com/gh/hsaraujo/ci-reports/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/hsaraujo/ci-reports?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/ci-reports/branch/master)
[![Codecov](https://codecov.io/gh/hsaraujo/ci-reports/branch/master/graph/badge.svg)](https://codecov.io/gh/hsaraujo/ci-reports)
[![Greenkeeper](https://badges.greenkeeper.io/hsaraujo/ci-reports.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/hsaraujo/ci-reports/badge.svg)](https://snyk.io/test/github/hsaraujo/ci-reports)
[![Downloads/week](https://img.shields.io/npm/dw/ci-reports.svg)](https://npmjs.org/package/ci-reports)
[![License](https://img.shields.io/npm/l/ci-reports.svg)](https://github.com/hsaraujo/ci-reports/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g ci-reports
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
ci-reports/0.0.10 darwin-x64 node-v15.6.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx sfci:coverage [-i <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-sfcicoverage--i-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx sfci:report [-i <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-sfcireport--i-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx sfci:coverage [-i <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

```
USAGE
  $ sfdx sfci:coverage [-i <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -i, --id=id                                                                       name to print

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/sfci/coverage.ts](https://github.com/hsaraujo/ci-reports/blob/v0.0.10/src/commands/sfci/coverage.ts)_

## `sfdx sfci:report [-i <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

```
USAGE
  $ sfdx sfci:report [-i <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -i, --id=id                                                                       name to print

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/sfci/report.ts](https://github.com/hsaraujo/ci-reports/blob/v0.0.10/src/commands/sfci/report.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
