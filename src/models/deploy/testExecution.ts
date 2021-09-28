export interface TestExecution {
    id: string;
    methodName: string;
    name: string;
    time: number;
    message: string;
    type: string;
    stackTrace: string;
}