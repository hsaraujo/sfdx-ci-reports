import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import * as shell from 'shelljs'
import { DeployReport } from '../../models/deploy/deployReport';
import CoberturaReporter from '../../reporters/coberturaReporter';
import JacocoReporter from '../../reporters/jacocoReporter';


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
        id: flags.string({char: 'i', required: true, description: messages.getMessage('nameFlagDescription')}),
        result : flags.string({char: 'r', required: true, description: messages.getMessage('resultsFlagDescription')})
    };

    public async run(): Promise<any> {

        this.exec(`mkdir -p test-reports`, {});
        // this.ux.log(this.flags.targetusername)
        const deployReportJson = this.exec(`sfdx force:source:deploy:report -i ${this.flags.id} -u ${this.flags.targetusername} --json`, {trim: true});

        const deployReport: DeployReport = JSON.parse(deployReportJson)

        if(this.flags.result == 'cobertura')
            new CoberturaReporter().generate(deployReport);
        else if(this.flags.result == 'jacoco')
            new JacocoReporter().generate(deployReport);

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