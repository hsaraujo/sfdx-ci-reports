export interface TestSuiteAttribute {

    name: string;
    timestamp: string;
    hostname: string
    tests: number;
    failures: number;
    errors: number;
    time: number;

}