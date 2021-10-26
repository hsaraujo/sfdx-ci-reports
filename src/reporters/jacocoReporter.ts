import { DeployReport } from "../models/deploy/deployReport";
import IReporter from "./ireporter";
import * as xml2js from 'xml2js';
import * as fs from 'fs';
import { ReportOption } from "../models/deploy/reportOption";

export default class JacocoReporter implements IReporter{

    generate(deployReport: DeployReport, options: ReportOption): void {
        
        let sourceFiles = [];
        let totalLinesCovered: number = 0;
        let totalLinesUncovered: number = 0;

        for(const i in deployReport.result.details.runTestResult.codeCoverage){
            const classCoverage = deployReport.result.details.runTestResult.codeCoverage[i];

            let uncoveredLines = [];

            for(const j in classCoverage.locationsNotCovered){
                uncoveredLines.push(classCoverage.locationsNotCovered[j].line);
            }

            let lines = [];
            
            for(let line = 1; line <= classCoverage.numLocations; line++){

                const covered = uncoveredLines.indexOf(line.toString()) == -1;

                lines.push({
                    $: {'nr': line, 'mi': covered ? '0' : '1', 'ci' : covered ? '1' : '0', 'mb': '0', 'cb': '0'}
                })
            }

            totalLinesCovered += Number(classCoverage.numLocations - classCoverage.numLocationsNotCovered);
            totalLinesUncovered += Number(classCoverage.numLocationsNotCovered);

            sourceFiles.push({
                $: {'name' : classCoverage.name},
                line: lines,
                counter: [
                    { $ : { 'type': 'line', 'missed': classCoverage.numLocationsNotCovered, 'covered': classCoverage.numLocations - classCoverage.numLocationsNotCovered }},
                    { $ : { 'type': 'class', 'missed': '0', 'covered': '1' }}
                ]
            });

        }

        const builder = new xml2js.Builder();

        const xml = builder.buildObject({
            'report': {
                $ : {'name': deployReport.result.id},
                'package':{
                    $: {'name': 'salesforce'},
                    'sourcefile': sourceFiles,
                    'counter': [
                        { $: {'type': 'line', 'missed': totalLinesUncovered, 'covered': totalLinesCovered}}
                    ]
                },
                'counter': [
                    { $: {'type': 'line', 'missed': totalLinesUncovered, 'covered': totalLinesCovered}}
                ]
            }
        });

        fs.writeFileSync(options.outputFile, xml);
        
    }

}
