/* Copyright (c) 2022 Read Write Tools. */
import * as api from '../api/api.js';

import expect from 'softlib/expect.js';

import aver from 'softlib/aver.js';

export default class Vertex {
    constructor(t, e, i, s, r) {
        expect(t, 'IndexedCoordinates'), expect(e, 'String'), expect(i, 'Number'), expect(s, 'Number'), 
        expect(r, 'Number'), this.indexedCoordinates = t, this.uid = e, this.terrasect = i, 
        this.iceX = s, this.iceY = r, this.neighboringVertices = [], this.neighboringFaces = [];
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
    getPoint(t) {
        return [ this.longitude, this.latitude ];
    }
    crossesDateline(t) {
        return expect(t, 'Vertex'), !(Math.abs(this.positiveLongitude - t.positiveLongitude) > 180) && (this.longitude > 0 && t.longitude < 0 || this.longitude < 0 && t.longitude > 0);
    }
    get positiveLongitude() {
        return this.longitude >= 0 ? this.longitude : this.longitude + 360;
    }
    accumulateVertexStatistics(t, e) {
        for (expect(t, 'Array'); this.terrasect > t.length - 1; ) t.push(0);
        t[this.terrasect]++;
    }
}