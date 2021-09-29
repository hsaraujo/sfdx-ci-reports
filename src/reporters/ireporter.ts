import { DeployReport } from "../models/deploy/deployReport";

export default interface IReporter {

    generate(deployReport: DeployReport): void;
}