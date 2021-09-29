import CoverageLocation from "./coverageLocation";

export default interface CodeCoverage {

    id: string;
    name: string;
    locationsNotCovered: CoverageLocation[];
    numLocations: number;
    numLocationsNotCovered: number;
    type: string;
}