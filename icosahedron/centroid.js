/* Copyright (c) 2022 Read Write Tools. */
import GeojsonPoint from '../geojson/geojson-point.js';

import * as api from '../api.js';

import * as GeojsonWriter from '../geojson/geojson-writer.js';

import * as IceWriter from '../ice/ice-writer.js';

import expect from '../node_modules/softlib/expect.js';

import aver from '../node_modules/softlib/aver.js';

export default class Centroid {
    constructor(e, t, i, o, r) {
        expect(e, 'IndexedCoordinates'), expect(t, 'String'), expect(i, 'Number'), expect(o, 'Number'), 
        expect(r, 'Number'), this.indexedCoordinates = e, this.uid = t, this.terrasect = i, 
        this.iceX = o, this.iceY = r, this.bias = 1, this.enclosingFace = null, this.neighboringCentroids = [];
    }
    get formattedID() {
        return `C(${this.uid})`;
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
        return expect(e, 'Centroid'), !(Math.abs(this.positiveLongitude - e.positiveLongitude) > 180) && (this.longitude > 0 && e.longitude < 0 || this.longitude < 0 && e.longitude > 0);
    }
    get positiveLongitude() {
        return this.longitude >= 0 ? this.longitude : this.longitude + 360;
    }
    toGeojson(e, t) {
        expect(e, 'Number'), expect(t, 'Array');
        var i = {};
        for (let s = 0; s < t.length; s++) {
            var o = t[s], r = GeojsonWriter.formatGeojsonValue(o, this[o], e);
            i[o] = r;
        }
        return new GeojsonPoint(i, this.getPoint(e));
    }
    toIce(e, t, i, o) {
        expect(e, 'TextWriter'), expect(t, 'Number'), expect(i, 'Array'), expect(o, 'String'), 
        'ice' == o ? (IceWriter.toString(e, 'xCoord', this.iceX, t), IceWriter.toString(e, 'yCoord', this.iceY, t)) : 'icebin' == o ? (IceWriter.toBin(e, 'xCoord', this.iceX, this.indexedCoordinates.packedWidth), 
        IceWriter.toBin(e, 'yCoord', this.iceY, this.indexedCoordinates.packedWidth)) : 'gfe' == o ? (IceWriter.toString(e, 'lngCoord', this.longitude, t), 
        IceWriter.toString(e, 'latCoord', this.latitude, t)) : 'gfebin' == o && (IceWriter.toBin(e, 'lngCoord', this.longitude, this.indexedCoordinates.packedWidth), 
        IceWriter.toBin(e, 'latCoord', this.latitude, this.indexedCoordinates.packedWidth));
        for (let r = 0; r < i.length; r++) {
            let s = i[r];
            'ice' == o || 'gfe' == o ? IceWriter.toString(e, s, this[s], t) : 'icebin' != o && 'gfebin' != o || IceWriter.toBin(e, s, this[s]);
        }
    }
    accumulateCentroidStatistics(e, t) {
        for (expect(e, 'Array'), expect(t, 'Boolean'); this.terrasect > e.length - 1; ) e.push(new Map);
        var i = e[this.terrasect];
        const o = this.bias.toFixed(2), r = (100 * this.bias).toFixed(0) + '%';
        t && console.log(`terrasect:${this.terrasect}  bias:${r}`);
        var s = i.get(o);
        null == s && (s = 0), i.set(o, s + 1);
    }
}