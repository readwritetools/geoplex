/* Copyright (c) 2022 Read Write Tools. */
import GeojsonLine from '../geojson/geojson-line.js';

import * as st from '../spherical-earth/spherical-trigonometry.js';

import * as api from '../api.js';

import * as GeojsonWriter from '../geojson/geojson-writer.js';

import * as IceWriter from '../ice/ice-writer.js';

import expect from '../node_modules/softlib/expect.js';

const EARTH_RADIUS = 6371;

export default class Edge {
    constructor(e, t, i, r, s) {
        expect(e, 'IndexedCoordinates'), expect(t, 'String'), expect(i, 'Number'), expect(r, 'Vertex'), 
        expect(s, 'Vertex'), this.indexedCoordinates = e, this.uid = t, this.terrasect = i, 
        this.vertexA = r, this.vertexB = s, this.edgeLength = this.determineEdgeLength(), 
        this.bias = 1, this.neighboringFaces = [];
    }
    get formattedID() {
        return `E(${this.uid})`;
    }
    getPoints(e) {
        return [ this.vertexA.getPoint(e), this.vertexB.getPoint(e) ];
    }
    toGeojson(e, t) {
        expect(e, 'Number'), expect(t, 'Array');
        var i = {};
        for (let o = 0; o < t.length; o++) {
            var r = t[o], s = GeojsonWriter.formatGeojsonValue(r, this[r], e);
            i[r] = s;
        }
        return new GeojsonLine(i, this.getPoints(e));
    }
    toIce(e, t, i, r) {
        expect(e, 'TextWriter'), expect(t, 'Number'), expect(i, 'Array'), expect(r, 'String'), 
        'ice' == r ? (IceWriter.toString(e, 'xSegment', [ this.vertexA.iceX, this.vertexB.iceX ], t), 
        IceWriter.toString(e, 'ySegment', [ this.vertexA.iceY, this.vertexB.iceY ], t)) : 'icebin' == r ? (IceWriter.toBin(e, 'xSegment', [ this.vertexA.iceX, this.vertexB.iceX ], this.indexedCoordinates.packedWidth), 
        IceWriter.toBin(e, 'ySegment', [ this.vertexA.iceY, this.vertexB.iceY ], this.indexedCoordinates.packedWidth)) : 'gfe' == r ? (IceWriter.toString(e, 'lngSegment', [ this.vertexA.longitude, this.vertexB.longitude ], t), 
        IceWriter.toString(e, 'latSegment', [ this.vertexA.latitude, this.vertexB.latitude ], t)) : 'gfebin' == r && (IceWriter.toBin(e, 'lngSegment', [ this.vertexA.longitude, this.vertexB.longitude ], this.indexedCoordinates.packedWidth), 
        IceWriter.toBin(e, 'latSegment', [ this.vertexA.latitude, this.vertexB.latitude ], this.indexedCoordinates.packedWidth));
        for (let s = 0; s < i.length; s++) {
            let o = i[s];
            'ice' == r || 'gfe' == r ? IceWriter.toString(e, o, this[o], t) : 'icebin' != r && 'gfebin' != r || IceWriter.toBin(e, o, this[o]);
        }
    }
    determineEdgeLength() {
        return 6371 * st.lengthOfArc(this.vertexA.latitude, this.vertexA.longitude, this.vertexB.latitude, this.vertexB.longitude);
    }
    accumulateEdgeStatistics(e, t) {
        for (expect(e, 'Array'), expect(t, 'Boolean'); this.terrasect > e.length - 1; ) e.push(new Map);
        var i = e[this.terrasect];
        const r = this.edgeLength, s = (100 * this.bias).toFixed(0) + '%', o = Math.round(r), n = Math.round(r).toLocaleString() + 'km';
        t && console.log(`terrasect:${this.terrasect}  length:${n}  bias:${s}`);
        var h = i.get(o);
        null == h && (h = 0), i.set(o, h + 1);
    }
}