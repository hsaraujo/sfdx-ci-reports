import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import * as shell from 'shelljs'
import * as xml2js from 'xml2js'
import { DeployReport } from '../../models/deploy/deployReport';
import * as fs from 'fs'


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('ci-reports', 'org');

export default class Coverage extends SfdxCommand {

    static requiresUsername = true;
    static requiresDevhubUsername = false;

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)
        id: flags.string({char: 'i', description: messages.getMessage('nameFlagDescription')})
    };

    public async run(): Promise<any> {

        this.exec(`mkdir -p test-reports`, {});
        // this.ux.log(this.flags.targetusername)
        const deployReportJson = this.exec(`sfdx force:source:deploy:report -i ${this.flags.id} -u ${this.flags.targetusername} --json`, {trim: true});

        const deployReport: DeployReport = JSON.parse(deployReportJson)

        console.log(deployReport.status)

        let sourceFiles = [];
        for(const i in deployReport.result.details.runTestResult.codeCoverage){
            const classCoverage = deployReport.result.details.runTestResult.codeCoverage[i];

            let uncoveredLines = [];

            for(const j in classCoverage.locationsNotCovered){
                uncoveredLines.push(classCoverage.locationsNotCovered[j].line);
            }

            let lines = [];
            
            for(let line = 1; line <= classCoverage.numLocations; line++){

                const covered = uncoveredLines.indexOf(line) == -1;

                lines.push({
                    $: {'nr': line, 'mi': covered ? '0' : '1', 'ci' : covered ? '1' : '0', 'mb': '0', 'cb': '0'}
                })
            }


            sourceFiles.push({
                $: {'name' : classCoverage.name},
                line: lines,
                counter: [
                    { $ : { 'type': 'line', 'missed': classCoverage.numLocationsNotCovered, 'covered': classCoverage.numLocations - classCoverage.numLocationsNotCovered }},
                    { $ : { 'type': 'class', 'missed': '0', 'covered': '1' }}
                ]
            });

        }

        const builder = new xml2js.Builder();

        const xml = builder.buildObject({
            'report': {
                'package':{
                    $: {'name': 'salesforce'},
                    'sourcefile': sourceFiles
                }
            }
        });

        fs.writeFileSync(`test-reports/${this.flags.id}-jacoco.xml`, xml);

    }

    exec(cmd, options) {

        const defaultOptions = {silent: true};
        const output = shell.exec(cmd, {...defaultOptions, ...(options || {})});
        if (options && options.toString !== false) {
            let outputStr = output.toString();
            outputStr = options.trim ? output.trim() : output;
            return outputStr;
        }
        return output;
    }
}