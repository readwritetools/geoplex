/* Copyright (c) 2022 Read Write Tools. */
import Icosahedron from './icosahedron/icosahedron.js';

import GeojsonPoint from './geojson/geojson-point.js';

import GeojsonLine from './geojson/geojson-line.js';

import GeojsonPolygon from './geojson/geojson-polygon.js';

import GeojsonCollection from './geojson/geojson-collection.js';

import GeojsonFile from './geojson/geojson-file.js';

import * as GeojsonWriter from './geojson/geojson-writer.js';

import * as IceWriter from './ice/ice-writer.js';

import * as Options from './options.js';

import expect from './node_modules/softlib/expect.js';

import terminal from './node_modules/softlib/terminal.js';

import Pfile from './node_modules/iolib/pfile.class.js';

import TextReader from './node_modules/iolib/text-reader.class.js';

import TextWriter from './node_modules/iolib/text-writer.class.js';

export function uniplexAll(e, o) {
    expect(e, 'String'), Options.validateUniplexOptions(o);
    const t = new Icosahedron(o.maxTerrasect);
    t.regularAll(), 'geojson' == o.format ? GeojsonWriter.writeAllToGeojson(e, t.vertices, t.edges, t.faces, t.centroids, o) : IceWriter.writeAllToIce(t.indexedCoordinates, e, t.vertices, t.edges, t.faces, t.centroids, o);
}

export function uniplexVertices(e, o) {
    expect(e, 'String'), Options.validateUniplexOptions(o);
    const t = new Icosahedron(o.maxTerrasect), n = t.regularVertices();
    return 'geojson' == o.format ? GeojsonWriter.writeVerticesToGeojson(e, n, o) : IceWriter.writeVerticesToIce(t.indexedCoordinates, e, n, o), 
    n;
}

export function uniplexEdges(e, o) {
    expect(e, 'String'), Options.validateUniplexOptions(o);
    const t = new Icosahedron(o.maxTerrasect), n = t.regularEdges();
    return 'geojson' == o.format ? GeojsonWriter.writeEdgesToGeojson(e, n, o) : IceWriter.writeEdgesToIce(t.indexedCoordinates, e, n, o), 
    n;
}

export function uniplexFaces(e, o) {
    expect(e, 'String'), Options.validateUniplexOptions(o);
    const t = new Icosahedron(o.maxTerrasect), n = t.regularFaces();
    return 'geojson' == o.format ? GeojsonWriter.writeFacesToGeojson(e, n, o) : IceWriter.writeFacesToIce(t.indexedCoordinates, e, n, o), 
    n;
}

export function uniplexCentroids(e, o) {
    expect(e, 'String'), Options.validateUniplexOptions(o);
    const t = new Icosahedron(o.maxTerrasect), n = t.regularCentroids();
    return 'geojson' == o.format ? GeojsonWriter.writeCentroidsToGeojson(e, n, o) : IceWriter.writeCentroidsToIce(t.indexedCoordinates, e, n, o), 
    n;
}

export function printVertexTopology(e, o) {
    expect(e, 'Map'), expect(o, 'Boolean'), console.log('\n---------------'), console.log('vertex topology');
    for (let t of e.values()) {
        if (console.log(`vertex ${t.formattedID} has ${t.neighboringFaces.length} neighboring faces`), 
        o) for (let e = 0; e < t.neighboringFaces.length; e++) console.log(`    F(${t.neighboringFaces[e]})`);
        if (console.log(`vertex ${t.formattedID} has ${t.neighboringVertices.length} neighboring vertices`), 
        o) for (let e = 0; e < t.neighboringVertices.length; e++) console.log(`    V(${t.neighboringVertices[e]})`);
    }
}

export function printEdgeTopology(e, o) {
    expect(e, 'Map'), expect(o, 'Boolean'), console.log('\n-------------'), console.log('edge topology');
    for (let t of e.values()) if (console.log(`edge ${t.formattedID} has ${t.neighboringFaces.length} neighboring faces`), 
    o) for (let e = 0; e < t.neighboringFaces.length; e++) console.log(`    F(${t.neighboringFaces[e]})`);
}

export function printFaceTopology(e, o) {
    console.log('\n-------------'), console.log('face topology');
    for (let t of e.values()) {
        if (console.log(`face ${t.formattedID} has ${t.neighboringFaces.length} neighboring faces`), 
        o) for (let e = 0; e < t.neighboringFaces.length; e++) console.log(`    F(${t.neighboringFaces[e]})`);
        if (console.log(`face ${t.formattedID} has ${t.neighboringEdges.length} neighboring edges`), 
        o) for (let e = 0; e < t.neighboringEdges.length; e++) console.log(`    E(${t.neighboringEdges[e]})`);
    }
}

export function printCentroidTopology(e, o) {
    console.log('\n-------------'), console.log('centroid topology');
    for (let t of e.values()) if (console.log(`centroid ${t.formattedID} has ${t.neighboringCentroids.length} neighboring centroids`), 
    o) for (let e = 0; e < t.neighboringCentroids.length; e++) console.log(`    C(${t.neighboringCentroids[e]})`);
}

export function printVertexStatistics(e, o) {
    expect(e, 'Map'), expect(o, 'Boolean');
    var t = new Array;
    for (let n of e.values()) n.accumulateVertexStatistics(t, o);
    for (let e = 0; e < t.length; e++) console.log(`Working set: ${t[e]} vertices at terrasect level ${e}`);
}

export function printEdgeStatistics(e, o) {
    expect(e, 'Map'), expect(o, 'Boolean');
    var t = new Array;
    for (let n of e.values()) n.accumulateEdgeStatistics(t, o);
    for (let e = 0; e < t.length; e++) {
        var n = t[e];
        console.log('\n----------------------------'), console.log(`Working set distribution at terrasect level ${e}:`);
        var r = 0, i = 0, s = new Map([ ...n.entries() ].sort());
        for (let [e, o] of s.entries()) {
            const t = Math.round(e).toLocaleString() + 'km';
            console.log(`${t}: ${o} edges`), r += o, i += e * o;
        }
        console.log(`Count: ${r} edges`);
        var l = i / r;
        const o = Math.round(l).toLocaleString() + 'km';
        console.log(`Average length: ${o}`);
    }
}

export function printFaceStatistics(e, o) {
    expect(e, 'Map'), expect(o, 'Boolean');
    var t = new Array;
    for (let n of e.values()) n.accumulateFaceStatistics(t, o);
    for (let e = 0; e < t.length; e++) {
        var n = t[e];
        console.log('\n----------------------------'), console.log(`Working set distribution at terrasect level ${e}:`);
        var r = 0, i = 0, s = new Map([ ...n.entries() ].sort());
        for (let [e, o] of s.entries()) {
            const t = Math.round(e).toLocaleString() + 'km²';
            console.log(`${t}: ${o} faces`), r += o, i += e * o;
        }
        const o = Math.round(i).toLocaleString() + 'km²';
        var l = i / r;
        const c = Math.round(l).toLocaleString() + 'km²';
        console.log(`Count: ${r} faces`), console.log(`Average area: ${c}`), console.log(`Total area: ${o}`);
    }
}

export function printCentroidStatistics(e, o) {
    expect(e, 'Map'), expect(o, 'Boolean');
    var t = new Array;
    for (let n of e.values()) n.accumulateCentroidStatistics(t, o);
    for (let e = 0; e < t.length; e++) {
        var n = t[e];
        console.log('\n----------------------------'), console.log(`Working set distribution at terrasect level ${e}:`);
        var r = 0, i = 0, s = new Map([ ...n.entries() ].sort());
        for (let [e, o] of s.entries()) {
            const t = (100 * e).toFixed(0) + '%';
            console.log(`${t}: ${o} centroids`), r += o, i += e * o;
        }
        const o = (100 * (i / r)).toFixed(0) + '%';
        console.log(`Count: ${r} centroids`), console.log(`Average bias: ${o}`);
    }
}