/* Copyright (c) 2022 Read Write Tools. */
import * as api from './api.js';

import fs from 'fs';

import { dirname } from 'path';

import { fileURLToPath } from 'url';

import expect from 'softlib/expect.js';

import terminal from 'softlib/terminal.js';

import Pfile from 'iolib/pfile.class.js';

export default class CLI {
    constructor() {
        this.command = 'generate', this.minTerrasect = 1, this.maxTerrasect = 3, this.accuracy = 3, 
        this.datasetId = '', this.geometry = 'face', this.outputFile = '', this.outputFormat = '', 
        this.properties = 'all', this.topology = !1, this.statistics = !1, this.verbose = !1, 
        Object.seal(this);
    }
    validateOptions() {
        var t = Array.from(process.argv);
        switch (2 == t.length && this.usageAndExit(''), this.command = t[2], this.command) {
          case '--version':
            return this.exit(this.showVersion()), !1;

          case '--help':
            return this.usageAndExit(''), !1;
        }
        for (let i = t.length - 1; i > 2; i--) {
            var e = t[i];
            switch (e) {
              case '--version':
                return this.exit(this.showVersion()), !1;

              case '--help':
                return this.usageAndExit(''), !1;
            }
            if (0 == e.indexOf('--terrasect')) {
                let s = e.substr(12);
                if (-1 == s.indexOf(',')) this.minTerrasect = parseInt(s), this.maxTerrasect = parseInt(s); else {
                    let t = s.split(',');
                    this.minTerrasect = parseInt(t[0]), this.maxTerrasect = parseInt(t[1]);
                }
                t.splice(i, 1);
            } else 0 == e.indexOf('--accuracy') ? (this.accuracy = parseInt(e.substr(11)), t.splice(i, 1)) : 0 == e.indexOf('--dataset-id') ? (this.datasetId = e.substr(13), 
            t.splice(i, 1)) : 0 == e.indexOf('--geometry') ? (this.geometry = e.substr(11), 
            t.splice(i, 1)) : 0 == e.indexOf('--output') ? (this.outputFile = new Pfile(e.substr(9)), 
            t.splice(i, 1)) : 0 == e.indexOf('--format') ? (this.outputFormat = e.substr(9), 
            t.splice(i, 1)) : 0 == e.indexOf('--properties') ? (this.properties = e.substr(13), 
            t.splice(i, 1)) : 0 == e.indexOf('--topology') ? (this.topology = !0, t.splice(i, 1)) : 0 == e.indexOf('--statistics') ? (this.statistics = !0, 
            t.splice(i, 1)) : 0 == e.indexOf('--verbose') && (this.verbose = !0, t.splice(i, 1));
        }
        t.length > 3 && this.usageAndExit(`Don't know how to handle "${t[3]}"`);
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
        r.exists() || this.usageAndExit(`Output directory does not exist "${r.name}"`), 
        '' == this.datasetId && (this.datasetId = this.outputFile.getStem()), '' == this.outputFormat && (this.outputFormat = this.outputFile.getExtension());
        const a = [ 'geojson', 'gfe', 'gfebin', 'ice', 'icebin', 'tae', 'taebin' ];
        a.includes(this.outputFormat) || this.usageAndExit(`--format option expected ${JSON.stringify(a)} but got ${this.outputFormat}`);
        const o = [ 'none', 'all', 'data', 'uid', 'parentUID', 'iceX', 'iceY', 'terrasect', 'edgeLength', 'triangularArea', 'bias', 'neighboringVertices', 'neighboringEdges', 'neighboringFaces', 'enclosingFace', 'neighboringCentroids', 'vertexA', 'vertexB', 'vertexC', 'centroid', 'face1', 'face2', 'face3', 'face4' ];
        var n = this.properties.split(',');
        0 == this.properties.length && this.usageAndExit(`--properties option should specify a comma-separated list of names from this list: ${JSON.stringify(o)}`);
        for (let t = 0; t < n.length; t++) {
            let e = n[t];
            o.includes(e) || this.usageAndExit(`--properties option should be a comma-separated list of names from this list: ${JSON.stringify(o)} but got ${e}`);
        }
        return this.properties = n, !0;
    }
    usageAndExit(t) {
        var e = [];
        e.push(''), e.push('GEOPLEX creates nested spherical triangles based on a regular icosahedron model of Earth.'), 
        e.push('usage: geoplex generate [options]'), e.push('       geoplex convert  [options]'), 
        e.push(''), e.push('options:'), e.push('    --terrasect=min,max  minimum and maximum icosahedron cutting depth to include in output files'), 
        e.push('                    valid range is \'0,6\''), e.push('                    † default is \'1,3\''), 
        e.push('    --output=     filename to write shapes to'), e.push('    --geometry=   which type of geometry to generate [\'all\', \'vertex\', \'edge\', \'face†\', \'centroid\']'), 
        e.push('    --accuracy=   digits to use for latitude and longitude coordinates 1 to 6 (1=11km, 2=1100m, 3†=110m, 4=11m, 5=1.1m, 6=11cm)'), 
        e.push('    --dataset-id= identifier for the collection of points, lines or polygons'), 
        e.push('    --format=     which file format to use [\'geojson\', \'gfe\', \'gfebin\', \'ice\', \'icebin\', \'tae\', \'taebin\']'), 
        e.push('                    \'geojson†\' standard geoJSON encoding'), e.push('                    \'gfe\'      geographic feature encoding'), 
        e.push('                    \'gfebin\'   geographic feature encoding binary'), e.push('                    \'ice\'      indexed coordinate encoding'), 
        e.push('                    \'icebin\'   indexed coordinate encoding binary'), e.push('                    \'tae\'      topological arc encoding (faces only)'), 
        e.push('                    \'taebin\'   topological arc encoding binary (faces only)'), 
        e.push('    --properties  which properties to include with each feature'), e.push('                    \'none\',\'all†\',\'data\','), 
        e.push('                    \'uid\',\'parentUID\','), e.push('                    \'iceX\',\'iceY\','), 
        e.push('                    \'terrasect\',\'edgeLength\',\'triangularArea\',\'bias\''), 
        e.push('                    \'neighboringVertices\',\'neighboringEdges\',\'neighboringFaces\',\'enclosingFace\',\'neighboringCentroids\','), 
        e.push('                    \'vertexA\',\'vertexB\',\'vertexC\',\'centroid\',\'face1\',\'face2\',\'face3\',\'face4\''), 
        e.push('    --topology    print topology relationships'), e.push('    --statistics  print statistical values'), 
        e.push('    --verbose     print extra topological and statistical details'), e.push('    --version'), 
        e.push('    --help'), e.push(''), e.push('† default'), e.push(''), e.push(t), e.push(''), 
        terminal.writeToConsoleOrStderr(e.join('\n')), process.exit(1);
    }
    showVersion() {
        try {
            const i = dirname(fileURLToPath(import.meta.url));
            var t = new Pfile(i).addPath('../package.json').name, e = fs.readFileSync(t, 'utf-8');
            return `version v${JSON.parse(e).version}`;
        } catch (t) {
            return `version unknown ${t.message}`;
        }
    }
    exit(t) {
        terminal.writeToConsoleOrStderr('\nGEOPLEX creates nested spherical triangles based on a regular icosahedron model of Earth.\n'), 
        terminal.writeToConsoleOrStderr(t + '\n'), process.exit(0);
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
        var t = {
            minTerrasect: this.minTerrasect,
            maxTerrasect: this.maxTerrasect,
            accuracy: this.accuracy,
            datasetId: this.datasetId,
            outputFormat: this.outputFormat,
            properties: this.properties
        };
        switch (this.geometry) {
          case 'all':
            api.uniplexAll(this.outputFile.name, t);
            break;

          case 'vertex':
            var e = api.uniplexVertices(this.outputFile.name, t);
            1 == this.statistics && api.printVertexStatistics(e, this.verbose), 1 == this.topology && api.printVertexTopology(e, this.verbose);
            break;

          case 'edge':
            var i = api.uniplexEdges(this.outputFile.name, t);
            1 == this.statistics && api.printEdgeStatistics(i, this.verbose), 1 == this.topology && api.printEdgeTopology(i, this.verbose);
            break;

          case 'face':
            var s = api.uniplexFaces(this.outputFile.name, t);
            1 == this.statistics && api.printFaceStatistics(s, this.verbose), 1 == this.topology && api.printFaceTopology(s, this.verbose);
            break;

          case 'centroid':
            var r = api.uniplexCentroids(this.outputFile.name, t);
            1 == this.statistics && api.printCentroidStatistics(r, this.verbose), 1 == this.topology && api.printCentroidTopology(r, this.verbose);
            break;

          default:
            terminal.writeToConsoleOrStderr('\nGEOPLEX nothing to do.\n');
        }
    }
    convert() {}
}