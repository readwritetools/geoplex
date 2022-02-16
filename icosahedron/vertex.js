/* Copyright (c) 2022 Read Write Tools. */
import GeojsonPoint from '../geojson/geojson-point.js';

import * as api from '../api.js';

import * as GeojsonWriter from '../geojson/geojson-writer.js';

import * as IceWriter from '../ice/ice-writer.js';

import expect from '../node_modules/softlib/expect.js';

import aver from '../node_modules/softlib/aver.js';

export default class Vertex {
    constructor(e, t, i, r, o) {
        expect(e, 'IndexedCoordinates'), expect(t, 'String'), expect(i, 'Number'), expect(r, 'Number'), 
        expect(o, 'Number'), this.indexedCoordinates = e, this.uid = t, this.terrasect = i, 
        this.iceX = r, this.iceY = o, this.neighboringVertices = [], this.neighboringFaces = [];
    }
    get formattedID() {
        return `V(${this.uid})`;
    }
    get longitude() {
        return this.indexedCoordinates.getLongitude(this.iceX);
    }
    get latitude() {
        return this.indexedCoordinates.getLatitude(this.iceY);
    }
    getPoint(e) {
        return [ this.longitude, this.latitude ];
    }
    crossesDateline(e) {
        return expect(e, 'Vertex'), !(Math.abs(this.positiveLongitude - e.positiveLongitude) > 180) && (this.longitude > 0 && e.longitude < 0 || this.longitude < 0 && e.longitude > 0);
    }
    get positiveLongitude() {
        return this.longitude >= 0 ? this.longitude : this.longitude + 360;
    }
    toGeojson(e, t) {
        expect(e, 'Number'), expect(t, 'Array');
        var i = {};
        for (let s = 0; s < t.length; s++) {
            var r = t[s], o = GeojsonWriter.formatGeojsonValue(r, this[r], e);
            i[r] = o;
        }
        return new GeojsonPoint(i, this.getPoint(e));
    }
    toIce(e, t, i, r) {
        expect(e, 'TextWriter'), expect(t, 'Number'), expect(i, 'Array'), expect(r, 'String'), 
        'ice' == r ? (IceWriter.toString(e, 'xCoord', this.iceX, t), IceWriter.toString(e, 'yCoord', this.iceY, t)) : 'icebin' == r ? (IceWriter.toBin(e, 'xCoord', this.iceX, this.indexedCoordinates.packedWidth), 
        IceWriter.toBin(e, 'yCoord', this.iceY, this.indexedCoordinates.packedWidth)) : 'gfe' == r ? (IceWriter.toString(e, 'lngCoord', this.longitude, t), 
        IceWriter.toString(e, 'latCoord', this.latitude, t)) : 'gfebin' == r && (IceWriter.toBin(e, 'lngCoord', this.longitude, this.indexedCoordinates.packedWidth), 
        IceWriter.toBin(e, 'latCoord', this.latitude, this.indexedCoordinates.packedWidth));
        for (let o = 0; o < i.length; o++) {
            let s = i[o];
            'ice' == r || 'gfe' == r ? IceWriter.toString(e, s, this[s], t) : 'icebin' != r && 'gfebin' != r || IceWriter.toBin(e, s, this[s]);
        }
    }
    accumulateVertexStatistics(e, t) {
        for (expect(e, 'Array'); this.terrasect > e.length - 1; ) e.push(0);
        e[this.terrasect]++;
    }
}