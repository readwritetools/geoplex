/* Copyright (c) 2022 Read Write Tools. */
import * as api from './api.js';

import fs from 'fs';

import { dirname } from 'path';

import { fileURLToPath } from 'url';

import expect from './node_modules/softlib/expect.js';

import terminal from './node_modules/softlib/terminal.js';

import Pfile from './node_modules/iolib/pfile.class.js';

export default class CLI {
    constructor() {
        this.command = 'generate', this.minTerrasect = 1, this.maxTerrasect = 3, this.accuracy = 3, 
        this.geometry = 'face', this.outputFile = '', this.format = 'geojson', this.properties = '', 
        this.topology = !1, this.statistics = !1, this.verbose = !1, Object.seal(this);
    }
    validateOptions() {
        var e = Array.from(process.argv);
        2 == e.length && this.usageAndExit(''), this.command = e[2];
        for (let i = e.length - 1; i > 2; i--) {
            var t = e[i];
            switch (t) {
              case '--version':
                return this.exit(this.showVersion()), !1;

              case '--help':
                return this.usageAndExit(''), !1;
            }
            if (0 == t.indexOf('--terrasect')) {
                let s = t.substr(12);
                if (-1 == s.indexOf(',')) this.minTerrasect = parseInt(s), this.maxTerrasect = parseInt(s); else {
                    let e = s.split(',');
                    this.minTerrasect = parseInt(e[0]), this.maxTerrasect = parseInt(e[1]);
                }
                e.splice(i, 1);
            } else 0 == t.indexOf('--accuracy') ? (this.accuracy = parseInt(t.substr(11)), e.splice(i, 1)) : 0 == t.indexOf('--geometry') ? (this.geometry = t.substr(11), 
            e.splice(i, 1)) : 0 == t.indexOf('--output') ? (this.outputFile = new Pfile(t.substr(9)), 
            e.splice(i, 1)) : 0 == t.indexOf('--format') ? (this.format = t.substr(9), e.splice(i, 1)) : 0 == t.indexOf('--properties') ? (this.properties = t.substr(13), 
            e.splice(i, 1)) : 0 == t.indexOf('--topology') ? (this.topology = !0, e.splice(i, 1)) : 0 == t.indexOf('--statistics') ? (this.statistics = !0, 
            e.splice(i, 1)) : 0 == t.indexOf('--verbose') && (this.verbose = !0, e.splice(i, 1));
        }
        e.length > 3 && this.usageAndExit(`Don't know how to handle "${e[3]}"`);
        const i = [ 'generate', 'convert' ];
        i.includes(this.command) || this.usageAndExit(`expected one of the commands ${JSON.stringify(i)} but got ${this.command}`), 
        (this.minTerrasect < 0 || this.minTerrasect > 6) && this.usageAndExit(`minimum terrasect must be from 0 to 6 but got ${this.minTerrasect}`), 
        (this.maxTerrasect < 0 || this.maxTerrasect > 6) && this.usageAndExit(`maximum terrasect must be from 0 to 6 but got ${this.maxTerrasect}`), 
        this.minTerrasect > this.maxTerrasect && this.usageAndExit(`minimum and maximum terrasect are not meaningful, got ${this.minTerrasect},${this.maxTerrasect}`);
        const s = [ 'all', 'vertex', 'edge', 'face', 'centroid' ];
        s.includes(this.geometry) || this.usageAndExit(`--geometry option expected ${JSON.stringify(s)} but got ${this.geometry}`), 
        (this.accuracy < 1 || this.accuracy > 7) && this.usageAndExit(`--accuracy option expected 1 to 6 (1=11km, 2=1100m, 3=110m, 4=11m, 5=1.1m, 6=11cm) but got ${this.accuracy}`), 
        null != this.outputFile && '' != this.outputFile || this.usageAndExit('Specify an output file'), 
        this.outputFile.isDirectory() && this.usageAndExit('Specify an output file, not a directory');
        var r = new Pfile(this.outputFile.getPath());
        r.exists() || this.usageAndExit(`Output directory does not exist "${r.name}"`);
        const a = [ 'geojson', 'ice', 'icebin', 'gfe', 'gfebin' ];
        a.includes(this.format) || this.usageAndExit(`--format option expected ${JSON.stringify(a)} but got ${this.format}`);
        const o = [ 'none', 'all', 'data', 'uid', 'parentUID,', 'terrasect', 'longitude', 'latitude', 'bias', 'neighboringVertices', 'neighboringEdges', 'neighboringFaces', 'enclosingFace', 'neighboringCentroids', 'edgeLength', 'triangularArea', 'vertexA', 'vertexB', 'vertexC', 'centroid', 'face1', 'face2', 'face3', 'face4' ];
        var n = this.properties.split(',');
        0 == this.properties.length && this.usageAndExit(`--properties option should specify a comma-separated list of names from this list: ${JSON.stringify(o)}`);
        for (let e = 0; e < n.length; e++) {
            let t = n[e];
            o.includes(t) || this.usageAndExit(`--properties option should be a comma-separated list of names from this list: ${JSON.stringify(o)} but got ${t}`);
        }
        return this.properties = n, !0;
    }
    usageAndExit(e) {
        var t = [];
        t.push(''), t.push('GEOPLEX creates geodetic triangles based on a regular icosahedron model of Earth'), 
        t.push('usage: geoplex generate [options]'), t.push('       geoplex convert  [options]'), 
        t.push(''), t.push('options:'), t.push('    --terrasect=min,max  minimum and maximum icosahedron cutting depth (from 0 to 6) to include in output files'), 
        t.push('    --output=     filename to write shapes to'), t.push('    --geometry=   which type of geometry to generate [\'all\', \'vertex\', \'edge\', \'face\', \'centroid\']'), 
        t.push('    --accuracy=   digits to use for latitude and longitude coordinates 1 to 6 (1=11km, 2=1100m, 3=110m, 4=11m, 5=1.1m, 6=11cm)'), 
        t.push('    --format=     which file format to use [\'geojson\', \'ice\', \'icebin\', \'gfe\', \'gfebin\']'), 
        t.push('                    \'geojson\' standard geoJSON encoding'), t.push('                    \'ice\'     indexed coordinate encoding'), 
        t.push('                    \'icebin\'  indexed coordinate encoding binary'), t.push('                    \'gfe\'     geographic feature encoding'), 
        t.push('                    \'gfebin\'  geographic feature encoding binary'), t.push('    --properties  which properties to include with each feature'), 
        t.push('                    \'none\',\'all\','), t.push('                    \'uid\',\'parentUID\','), 
        t.push('                    \'longitude\',\'latitude\','), t.push('                    \'terrasect\',\'edgeLength\',\'triangularArea\',\'bias\''), 
        t.push('                    \'neighboringVertices\',\'neighboringEdges\',\'neighboringFaces\',\'enclosingFace\',\'neighboringCentroids\','), 
        t.push('                    \'vertexA\',\'vertexB\',\'vertexC\',\'centroid\',\'face1\',\'face2\',\'face3\',\'face4\''), 
        t.push('    --topology    print topology relationships'), t.push('    --statistics  print statistical values'), 
        t.push('    --verbose     print extra topological and statistical details'), t.push('    --version'), 
        t.push('    --help'), t.push(''), t.push('† default'), t.push(''), t.push(e), t.push(''), 
        terminal.writeToConsoleOrStderr(t.join('\n')), process.exit(1);
    }
    showVersion() {
        try {
            const i = dirname(fileURLToPath(import.meta.url));
            var e = new Pfile(i).addPath('./package.json').name, t = fs.readFileSync(e, 'utf-8');
            return `version v${JSON.parse(t).version}`;
        } catch (e) {
            return `version unknown ${e.message}`;
        }
    }
    exit(e) {
        terminal.writeToConsoleOrStderr('\nGEOPLEX creates geodetic triangles based on a regular icosahedron model of Earth\n'), 
        terminal.writeToConsoleOrStderr(e + '\n'), process.exit(0);
    }
    execute() {
        switch (this.command) {
          case 'generate':
            this.generate();
            break;

          case 'convert':
            this.convert();
            break;

          default:
            terminal.writeToConsoleOrStderr('\nGEOPLEX nothing to do.\n');
        }
    }
    generate() {
        switch (this.geometry) {
          case 'all':
            api.uniplexAll(this.outputFile.name, {
                minTerrasect: this.minTerrasect,
                maxTerrasect: this.maxTerrasect,
                accuracy: this.accuracy,
                format: this.format,
                properties: this.properties
            });
            break;

          case 'vertex':
            var e = api.uniplexVertices(this.outputFile.name, {
                minTerrasect: this.minTerrasect,
                maxTerrasect: this.maxTerrasect,
                accuracy: this.accuracy,
                format: this.format,
                properties: this.properties
            });
            1 == this.statistics && api.printVertexStatistics(e, this.verbose), 1 == this.topology && api.printVertexTopology(e, this.verbose);
            break;

          case 'edge':
            var t = api.uniplexEdges(this.outputFile.name, {
                minTerrasect: this.minTerrasect,
                maxTerrasect: this.maxTerrasect,
                accuracy: this.accuracy,
                format: this.format,
                properties: this.properties
            });
            1 == this.statistics && api.printEdgeStatistics(t, this.verbose), 1 == this.topology && api.printEdgeTopology(t, this.verbose);
            break;

          case 'face':
            var i = api.uniplexFaces(this.outputFile.name, {
                minTerrasect: this.minTerrasect,
                maxTerrasect: this.maxTerrasect,
                accuracy: this.accuracy,
                format: this.format,
                properties: this.properties
            });
            1 == this.statistics && api.printFaceStatistics(i, this.verbose), 1 == this.topology && api.printFaceTopology(i, this.verbose);
            break;

          case 'centroid':
            var s = api.uniplexCentroids(this.outputFile.name, {
                minTerrasect: this.minTerrasect,
                maxTerrasect: this.maxTerrasect,
                accuracy: this.accuracy,
                format: this.format,
                properties: this.properties
            });
            1 == this.statistics && api.printCentroidStatistics(s, this.verbose), 1 == this.topology && api.printCentroidTopology(s, this.verbose);
            break;

          default:
            terminal.writeToConsoleOrStderr('\nGEOPLEX nothing to do.\n');
        }
    }
    convert() {}
}