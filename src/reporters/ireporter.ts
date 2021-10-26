import { DeployReport } from "../models/deploy/deployReport";
import { ReportOption } from "../models/deploy/reportOption";

export default interface IReporter {

    generate(deployReport: DeployReport, options: ReportOption): void;
}