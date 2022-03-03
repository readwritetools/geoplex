/* Copyright (c) 2022 Read Write Tools. */
import * as api from '../api/api.js';

import expect from 'softlib/expect.js';

import aver from 'softlib/aver.js';

export default class Centroid {
    constructor(t, e, i, s, o) {
        expect(t, 'IndexedCoordinates'), expect(e, 'String'), expect(i, 'Number'), expect(s, 'Number'), 
        expect(o, 'Number'), this.indexedCoordinates = t, this.uid = e, this.terrasect = i, 
        this.iceX = s, this.iceY = o, this.bias = 1, this.enclosingFace = null, this.neighboringCentroids = [];
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
    getPoint(t) {
        return [ this.longitude, this.latitude ];
    }
    crossesDateline(t) {
        return expect(t, 'Centroid'), !(Math.abs(this.positiveLongitude - t.positiveLongitude) > 180) && (this.longitude > 0 && t.longitude < 0 || this.longitude < 0 && t.longitude > 0);
    }
    get positiveLongitude() {
        return this.longitude >= 0 ? this.longitude : this.longitude + 360;
    }
    accumulateCentroidStatistics(t, e) {
        for (expect(t, 'Array'), expect(e, 'Boolean'); this.terrasect > t.length - 1; ) t.push(new Map);
        var i = t[this.terrasect];
        const s = this.bias.toFixed(2), o = (100 * this.bias).toFixed(0) + '%';
        e && console.log(`terrasect:${this.terrasect}  bias:${o}`);
        var r = i.get(s);
        null == r && (r = 0), i.set(s, r + 1);
    }
}