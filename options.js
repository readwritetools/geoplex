/* Copyright (c) 2022 Read Write Tools. */
import expect from './node_modules/softlib/expect.js';

import terminal from './node_modules/softlib/terminal.js';

export function validateUniplexOptions(e) {
    expect(e, 'Object'), e.format = e.format || 'geojson', e.maxTerrasect = null == e.maxTerrasect ? 3 : e.maxTerrasect, 
    e.minTerrasect = null == e.minTerrasect ? e.maxTerrasect : e.minTerrasect, expect(e.maxTerrasect, 'Number'), 
    expect(e.minTerrasect, 'Number');
}

export function validateWriteOptions(e) {
    expect(e, 'Object'), e.accuracy = null == e.accuracy ? 3 : e.accuracy, e.properties = e.properties || [ 'none' ], 
    expect(e.accuracy, 'Number'), expect(e.properties, 'Array');
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

function determinePropertyNames(e, r) {
    if (expect(e, 'Array'), expect(r, 'Array'), 'all' == e[0]) return r;
    if ('none' == e[0]) return [];
    var t = [ ...e ];
    for (let e = t.length - 1; e >= 0; e--) r.includes(t[e]) || t.splice(e, 1);
    return t;
}

export function icePropertyType(e) {
    switch (e) {
      case 'xCoord':
      case 'yCoord':
      case 'xSegment':
      case 'ySegment':
      case 'xRings':
      case 'yRings':
        return e;

      case 'lngCoord':
      case 'latCoord':
      case 'lngSegment':
      case 'latSegment':
      case 'lngRings':
      case 'latRings':
        return e;

      case 'uid':
      case 'parentUID':
      case 'enclosingFace':
        return 'string';

      case 'terrasect':
        return 'tinyUint';

      case 'bias':
        return 'float';

      case 'edgeLength':
      case 'triangularArea':
        return 'float';

      case 'vertexA':
      case 'vertexB':
      case 'vertexC':
      case 'centroid':
      case 'face1':
      case 'face2':
      case 'face3':
      case 'face4':
        return 'string';

      case 'neighboringVertices':
      case 'neighboringEdges':
      case 'neighboringFaces':
      case 'neighboringCentroids':
        return 'string[]';

      case 'data':
        return 'json';

      default:
        return terminal.abnormal(`Unknown property name ${e}`), 'unknown';
    }
}