import { Detail } from "./detail";

export interface Result {

    checkOnly: boolean;
    status: string;
    success: boolean;
    id: string;
    completedDate: string;
    startDate: string;
    numberComponentErrors: number;
    numberComponentsDeployed: number;
    numberComponentsTotal: number;
    numberTestErrors: number;
    numberTestsCompleted: number;
    numberTestsTotal: number;
    details: Detail
}