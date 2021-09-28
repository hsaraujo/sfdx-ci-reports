import { TestExecution } from "./testExecution";

export interface RunTestResult{
    
    numFailures: number;
    numTestsRun: number;
    totalTime: number;
    successes: TestExecution[];
    failures: TestExecution[];
}