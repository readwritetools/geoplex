/* Copyright (c) 2022 Read Write Tools. */
import GeojsonCollection from './geojson-collection.js';

import GeojsonFile from './geojson-file.js';

import * as Options from '../options.js';

import expect from '../node_modules/softlib/expect.js';

import terminal from '../node_modules/softlib/terminal.js';

import Pfile from '../node_modules/iolib/pfile.class.js';

export function writeAllToGeojson(e, t, o, r, n, a) {
    return writeToGeojson(e, a, (e => {
        expect(t, 'Map'), expect(o, 'Map'), expect(r, 'Map'), expect(n, 'Map');
        var s = [];
        for (let e of t.values()) e.terrasect >= a.minTerrasect && e.terrasect <= a.maxTerrasect && s.push(e.toGeojson(a.accuracy, Options.vertexPropertyNames(a.properties)));
        terminal.log(`Writing ${s.length} vertices`);
        var i = new GeojsonCollection('vertices');
        i.addFeatures(s), e.addCollection(i), s = [];
        for (let e of o.values()) e.terrasect >= a.minTerrasect && e.terrasect <= a.maxTerrasect && s.push(e.toGeojson(a.accuracy, Options.edgePropertyNames(a.properties)));
        terminal.log(`Writing ${s.length} edges`), (i = new GeojsonCollection('edges')).addFeatures(s), 
        e.addCollection(i), s = [];
        for (let e of r.values()) e.terrasect >= a.minTerrasect && e.terrasect <= a.maxTerrasect && s.push(e.toGeojson(a.accuracy, Options.facePropertyNames(a.properties)));
        terminal.log(`Writing ${s.length} faces`), (i = new GeojsonCollection('faces')).addFeatures(s), 
        e.addCollection(i), s = [];
        for (let e of n.values()) e.terrasect >= a.minTerrasect && e.terrasect <= a.maxTerrasect && s.push(e.toGeojson(a.accuracy, Options.centroidPropertyNames(a.properties)));
        terminal.log(`Writing ${s.length} centroids`), (i = new GeojsonCollection('centroids')).addFeatures(s), 
        e.addCollection(i);
    }));
}

export function writeVerticesToGeojson(e, t, o) {
    return writeToCollection(e, o, (e => {
        expect(t, 'Map');
        var r = [];
        for (let e of t.values()) e.terrasect >= o.minTerrasect && e.terrasect <= o.maxTerrasect && r.push(e.toGeojson(o.accuracy, Options.vertexPropertyNames(o.properties)));
        e.addFeatures(r);
    }));
}

export function writeEdgesToGeojson(e, t, o) {
    return writeToCollection(e, o, (e => {
        expect(t, 'Map');
        const r = new Array;
        for (let e of t.values()) e.terrasect >= o.minTerrasect && e.terrasect <= o.maxTerrasect && r.push(e.toGeojson(o.accuracy, Options.edgePropertyNames(o.properties)));
        e.addFeatures(r);
    }));
}

export function writeFacesToGeojson(e, t, o) {
    return writeToCollection(e, o, (e => {
        expect(t, 'Map');
        const r = new Array;
        for (let e of t.values()) e.terrasect >= o.minTerrasect && e.terrasect <= o.maxTerrasect && r.push(e.toGeojson(o.accuracy, Options.facePropertyNames(o.properties)));
        e.addFeatures(r);
    }));
}

export function writeCentroidsToGeojson(e, t, o) {
    return writeToCollection(e, o, (e => {
        expect(t, 'Map');
        const r = new Array;
        for (let e of t.values()) e.terrasect >= o.minTerrasect && e.terrasect <= o.maxTerrasect && r.push(e.toGeojson(o.accuracy, Options.centroidPropertyNames(o.properties)));
        e.addFeatures(r);
    }));
}

function writeToGeojson(e, t, o) {
    expect(e, 'String'), Options.validateWriteOptions(t), expect(o, 'Function');
    const r = new Pfile(e).getStem();
    var n = new GeojsonFile(r);
    o(n), n.write(e) ? terminal.log(`Wrote to ${e}`) : terminal.abnormal(`Failed to write to ${e}`);
}

function writeToCollection(e, t, o) {
    expect(e, 'String'), Options.validateWriteOptions(t), expect(o, 'Function');
    const r = new Pfile(e).getStem();
    var n = new GeojsonCollection(r);
    o(n), n.write(e) ? terminal.log(`Wrote to ${e}`) : terminal.abnormal(`Failed to write to ${e}`);
}

export function formatGeojsonValue(e, t, o) {
    return null != t && null != t ? [ 'xCoord', 'yCoord', 'xSegment', 'ySegment', 'xRings', 'yRings' ].includes(e) || [ 'lngCoord', 'latCoord', 'lngSegment', 'latSegment', 'lngRings', 'latRings' ].includes(e) ? Math.fround(t) : 'edgeLength' == e || 'triangularArea' == e ? Math.round(t) : 'bias' == e || 'longitude' == e ? Number(t.toFixed(2)) : 'vertexA' == e || 'vertexB' == e || 'vertexC' == e || 'face1' == e || 'face2' == e || 'face3' == e || 'face4' == e ? t.uid : t : 'data' != e ? '' : void 0;
}