/* Copyright (c) 2022 Read Write Tools. */
import expect from 'softlib/expect.js';

import aver from 'softlib/aver.js';

import Coords from 'gcsio/util/coords.class.js';

import GcsPointFeature from 'gcsio/gcs/gcs-point-feature.class.js';

import GcsLineFeature from 'gcsio/gcs/gcs-line-feature.class.js';

import { GcsPolygonFeature } from 'gcsio/gcs/gcs-polygon-feature.class.js';

import * as Options from '../util/options.js';

export function convertVertices(e, r, t) {
    expect(e, 'Map'), expect(r, 'Array'), expect(t, 'Object'), expect(t.properties, 'Array'), 
    Options.validateUniplexOptions(t), Options.validateWriteOptions(t);
    for (let s of e.values()) if (expect(s, 'Vertex'), s.terrasect >= t.minTerrasect && s.terrasect <= t.maxTerrasect) {
        var i = new GcsPointFeature;
        i.discretePoint = new Coords(s.longitude, s.latitude), i.kvPairs.uid = s.uid, i.kvPairs.terrasect = s.terrasect, 
        i.kvPairs.iceX = s.iceX, i.kvPairs.iceY = s.iceY, i.kvPairs.neighboringVertices = [ ...s.neighboringVertices ], 
        i.kvPairs.neighboringFaces = [ ...s.neighboringFaces ], r.push(i);
    }
}

export function convertEdges(e, r, t) {
    expect(e, 'Map'), expect(r, 'Array'), expect(t, 'Object'), expect(t.properties, 'Array'), 
    Options.validateUniplexOptions(t), Options.validateWriteOptions(t);
    for (let s of e.values()) if (expect(s, 'Edge'), s.terrasect >= t.minTerrasect && s.terrasect <= t.maxTerrasect) {
        var i = new GcsLineFeature;
        i.lineSegment.push(new Coords(s.vertexA.longitude, s.vertexA.latitude)), i.lineSegment.push(new Coords(s.vertexB.longitude, s.vertexB.latitude)), 
        i.kvPairs.uid = s.uid, i.kvPairs.terrasect = s.terrasect, i.kvPairs.vertexA = getUidOrNull(s.vertexA), 
        i.kvPairs.vertexB = getUidOrNull(s.vertexB), i.kvPairs.edgeLength = s.edgeLength, 
        i.kvPairs.bias = s.bias, i.kvPairs.neighboringFaces = [ ...s.neighboringFaces ], 
        r.push(i);
    }
}

export function convertFaces(e, r, t) {
    expect(e, 'Map'), expect(r, 'Array'), expect(t, 'Object'), expect(t.properties, 'Array'), 
    Options.validateUniplexOptions(t), Options.validateWriteOptions(t);
    for (let s of e.values()) if (expect(s, 'Face'), s.terrasect >= t.minTerrasect && s.terrasect <= t.maxTerrasect) {
        var i = new GcsPolygonFeature;
        i.outerRing.push(new Coords(s.vertexA.longitude, s.vertexA.latitude)), i.outerRing.push(new Coords(s.vertexB.longitude, s.vertexB.latitude)), 
        i.outerRing.push(new Coords(s.vertexC.longitude, s.vertexC.latitude)), i.closeTheRings(), 
        i.kvPairs.uid = s.uid, i.kvPairs.terrasect = s.terrasect, i.kvPairs.parentUID = s.uid, 
        i.kvPairs.vertexA = getUidOrNull(s.vertexA), i.kvPairs.vertexB = getUidOrNull(s.vertexB), 
        i.kvPairs.vertexC = getUidOrNull(s.vertexC), i.kvPairs.centroid = getUidOrNull(s.centroid), 
        i.kvPairs.triangularArea = s.triangularArea, i.kvPairs.bias = s.bias, i.kvPairs.neighboringEdges = [ ...s.neighboringEdges ], 
        i.kvPairs.neighboringFaces = [ ...s.neighboringFaces ], i.kvPairs.face1 = getUidOrNull(s.face1), 
        i.kvPairs.face2 = getUidOrNull(s.face2), i.kvPairs.face3 = getUidOrNull(s.face3), 
        i.kvPairs.face4 = getUidOrNull(s.face4), r.push(i);
    }
}

export function convertCentroids(e, r, t) {
    expect(e, 'Map'), expect(r, 'Array'), expect(t, 'Object'), expect(t.properties, 'Array'), 
    Options.validateUniplexOptions(t), Options.validateWriteOptions(t);
    for (let s of e.values()) if (expect(s, 'Centroid'), s.terrasect >= t.minTerrasect && s.terrasect <= t.maxTerrasect) {
        var i = new GcsPointFeature;
        i.discretePoint = new Coords(s.longitude, s.latitude), i.kvPairs.uid = s.uid, i.kvPairs.terrasect = s.terrasect, 
        i.kvPairs.iceX = s.iceX, i.kvPairs.iceY = s.iceY, i.kvPairs.bias = s.bias, i.kvPairs.enclosingFace = s.enclosingFace, 
        i.kvPairs.neighboringCentroids = [ ...s.neighboringCentroids ], r.push(i);
    }
}

function getUidOrNull(e) {
    return expect(e, [ 'Vertex', 'Centroid', 'Face', 'null' ]), null == e ? null : e.uid;
}