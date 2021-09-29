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
        id: flags.string({char: 'i', description: messages.getMessage('nameFlagDescription')})
    };

    public async run(): Promise<any> {

        this.exec(`mkdir -p test-reports`, {});
        // this.ux.log(this.flags.targetusername)
        const deployReportJson = this.exec(`sfdx force:source:deploy:report -i ${this.flags.id} -u ${this.flags.targetusername} --json`, {trim: true});

        const deployReport: DeployReport = JSON.parse(deployReportJson)

        new JacocoReporter().generate(deployReport);
        new CoberturaReporter().generate(deployReport);

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