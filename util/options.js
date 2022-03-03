/* Copyright (c) 2022 Read Write Tools. */
import expect from 'softlib/expect.js';

import terminal from 'softlib/terminal.js';

export function validateUniplexOptions(e) {
    expect(e, 'Object'), e.outputFormat = e.outputFormat || 'geojson', e.maxTerrasect = null == e.maxTerrasect ? 3 : e.maxTerrasect, 
    e.minTerrasect = null == e.minTerrasect ? e.maxTerrasect : e.minTerrasect, expect(e.maxTerrasect, 'Number'), 
    expect(e.minTerrasect, 'Number');
}

export function validateWriteOptions(e) {
    expect(e, 'Object'), e.accuracy = null == e.accuracy ? 3 : e.accuracy, e.datasetId = null == e.datasetId ? 'unnamedDataset' : e.datasetId, 
    e.properties = e.properties || [ 'none' ], expect(e.accuracy, 'Number'), expect(e.datasetId, 'String'), 
    expect(e.properties, 'Array');
}

export function buildDeclarations(e) {
    expect(e, 'Object');
    var t = new Map;
    t.set('xCoord', 'xCoord'), t.set('yCoord', 'yCoord'), t.set('xSegment', 'xSegment'), 
    t.set('ySegment', 'ySegment'), t.set('xRings', 'xRings'), t.set('yRings', 'yRings'), 
    t.set('lngCoord', 'lngCoord'), t.set('latCoord', 'latCoord'), t.set('lngSegment', 'lngSegment'), 
    t.set('latSegment', 'latSegment'), t.set('lngRings', 'lngRings'), t.set('latRings', 'latRings'), 
    t.set('uid', 'string'), t.set('parentUID', 'string'), t.set('enclosingFace', 'string'), 
    t.set('terrasect', 'tinyUint'), t.set('bias', 'float'), t.set('edgeLength', 'float'), 
    t.set('triangularArea', 'float'), t.set('vertexA', 'string'), t.set('vertexB', 'string'), 
    t.set('vertexC', 'string'), t.set('centroid', 'string'), t.set('face1', 'string'), 
    t.set('face2', 'string'), t.set('face3', 'string'), t.set('face4', 'string'), t.set('neighboringVertices', 'string[]'), 
    t.set('neighboringEdges', 'string[]'), t.set('neighboringFaces', 'string[]'), t.set('neighboringCentroids', 'string[]'), 
    t.set('data', 'json'), e.declarations = t;
}

export function vertexPropertyNames(e) {
    return expect(e, 'Array'), determinePropertyNames(e, [ 'uid', 'terrasect', 'neighboringVertices', 'neighboringFaces' ]);
}

export function edgePropertyNames(e) {
    return expect(e, 'Array'), determinePropertyNames(e, [ 'uid', 'terrasect', 'vertexA', 'vertexB', 'edgeLength', 'bias', 'neighboringFaces' ]);
}

export function facePropertyNames(e) {
    return expect(e, 'Array'), determinePropertyNames(e, [ 'uid', 'terrasect', 'parentUID', 'vertexA', 'vertexB', 'vertexC', 'triangularArea', 'bias', 'neighboringEdges', 'neighboringFaces', 'face1', 'face2', 'face3', 'face4' ]);
}

export function centroidPropertyNames(e) {
    return expect(e, 'Array'), determinePropertyNames(e, [ 'uid', 'terrasect', 'bias', 'enclosingFace', 'neighboringCentroids' ]);
}

function determinePropertyNames(e, t) {
    if (expect(e, 'Array'), expect(t, 'Array'), 'all' == e[0]) return t;
    if ('none' == e[0]) return [];
    var r = [ ...e ];
    for (let e = r.length - 1; e >= 0; e--) t.includes(r[e]) || r.splice(e, 1);
    return r;
}