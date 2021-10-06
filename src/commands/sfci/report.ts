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

export default class Report extends SfdxCommand {

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

        let executionTime: number = 0;

        let testCases = [];
        for(const i in deployReport.result.details.runTestResult.successes){
            const testExecution = deployReport.result.details.runTestResult.successes[i];
            executionTime += Number(testExecution.time);
            testCases.push({
                $: {'name': testExecution.methodName, 'classname': testExecution.name, 'time': (testExecution.time / 100).toFixed(2), 'status' : 'SUCCESS'}
            })
        }
        for(const i in deployReport.result.details.runTestResult.failures){
            const testExecution = deployReport.result.details.runTestResult.failures[i];
            executionTime += Number(testExecution.time);
            testCases.push({
                $: {'name': testExecution.methodName, 'classname': testExecution.name, 'time': (testExecution.time / 100).toFixed(2), 'status' : 'FAIL'},
                failure: {
                    message: testExecution.message,
                    type: testExecution.type
                }
            })
        }

        // let executionTime: number = new Date(deployReport.result.completedDate).getTime() - new Date(deployReport.result.startDate).getTime();
        executionTime = executionTime / 100;

        const builder = new xml2js.Builder();

        const xml = builder.buildObject({
            'testsuites': {
                'testsuite':{
                    $: {'name': this.flags.id, 'timestamp':deployReport.result.completedDate, 'tests': deployReport.result.numberTestsTotal, 'failures': deployReport.result.numberTestErrors, 'time': executionTime.toFixed(2)},
                    properties: {
                        property: [{
                            $: {'name': 'outcome', 'value': deployReport.result.status}
                        }, {
                            $: {'name': 'testsRan','value': deployReport.result.numberTestsTotal}
                        }, {
                            $: {'name': 'passing','value': deployReport.result.numberTestsCompleted}
                        }, {
                            $: {'name': 'failing','value': deployReport.result.numberTestErrors}
                        }, {
                            $: {'name': 'passRate','value': ((deployReport.result.numberTestsCompleted * 100)/deployReport.result.numberTestsTotal).toFixed(2)}
                        }, {
                            $: {'name': 'failRate','value': ((deployReport.result.numberTestErrors * 100)/deployReport.result.numberTestsTotal).toFixed(2) }
                        }, {
                            $: {'name': 'testStartTime','value': deployReport.result.startDate}
                        }, {
                            $: {'name': 'deploymentId','value': deployReport.result.id}
                        }]
                    },
                    testcase: testCases
                }
            }
        });

        fs.writeFileSync(`test-reports/${this.flags.id}-junit.xml`, xml);

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