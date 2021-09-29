import { DeployReport } from "../models/deploy/deployReport";
import IReporter from "./ireporter";
import * as xml2js from 'xml2js';
import * as fs from 'fs';
import CodeCoverage from "../models/deploy/codeCoverage";

export default class CoberturaReporter implements IReporter{

    generate(deployReport: DeployReport): void {
        
        const builder = new xml2js.Builder({doctype: { 'ext': 'http://cobertura.sourceforge.net/xml/coverage-04.dtd'},
        xmldec: {'version': '1.0', 'encoding': 'UTF-8'}});

        const xml = builder.buildObject({
            'coverage': {
                $ : this.coverageAttributes(deployReport),
                'packages': {
                    'package': {
                        $ : this.packageAttributes(deployReport),
                        'classes': {
                            'class': this.classes(deployReport)
                        }
                    }
                }
            }
        });

        fs.writeFileSync(`test-reports/${deployReport.result.id}-cobertura.xml`, xml);
        
    }

    private classes(deployReport: DeployReport): any {

        let classesCoverage = [];

        deployReport.result.details.runTestResult.codeCoverage.forEach(classCoverage => {

            const linesCovered = classCoverage.numLocations - classCoverage.numLocationsNotCovered;
            const lineRate = (linesCovered / classCoverage.numLocations).toFixed(2)

            const clazz = {
                $: {'name': classCoverage.name, 'filename': `force-app/main/default/classes/${classCoverage.name}.cls`, 'line-rate': lineRate, 'branch-rate': 1},
                'methods': {},
                'lines': {
                    'line': this.lines(classCoverage)
                }
            }

            classesCoverage.push(clazz);
        });

        return classesCoverage;
    }
    
    private lines(classCoverage: CodeCoverage): any {

        let lines = [];
        let uncoveredLines = [];

        for(const i in classCoverage.locationsNotCovered){
            uncoveredLines.push(classCoverage.locationsNotCovered[i].line);
        }

        for(let i = 1; i <= classCoverage.numLocations; i++){

            const hits = uncoveredLines.indexOf(i.toString()) == -1 ? 1 : 0;
            lines.push({
                $: {'number': i, 'hits': hits, 'branch': 'false'}
            });
        }

        return lines;

    }

    private coverageAttributes(deployReport: DeployReport): any {

        let totalLines: number = 0;
        let totalLinesUncovered: number = 0;
        deployReport.result.details.runTestResult.codeCoverage.forEach(classCoverage => {
            totalLines += Number(classCoverage.numLocations)
            totalLinesUncovered += Number(classCoverage.numLocationsNotCovered);
        });

        const totalLinesCovered: number = totalLines - totalLinesUncovered;
        const lineRate: string = (totalLinesCovered / totalLines).toFixed(2);

        return {
            'lines-valid': totalLines,
            'lines-covered': totalLinesCovered,
            'line-rate': lineRate,
            'branches-valid': 1,
            'branches-covered': 1,
            'branch-rate': 1,
            'timestamp': '1500242087605',
            'complexity': '0',
            'version': '0.1'
        };
    }

    private packageAttributes(deployReport: DeployReport): any {

        let totalLines: number = 0;
        let totalLinesUncovered: number = 0;
        deployReport.result.details.runTestResult.codeCoverage.forEach(classCoverage => {
            totalLines += classCoverage.numLocations
            totalLinesUncovered += classCoverage.numLocationsNotCovered;
        });

        const totalLinesCovered = totalLines - totalLinesUncovered;
        const lineRate = (totalLinesCovered / totalLines).toFixed(2);

        return {
            'line-rate': lineRate,
            'branch-rate': 1,
        };
    }

}
