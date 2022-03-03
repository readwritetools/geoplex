/* Copyright (c) 2022 Read Write Tools. */
import * as st from '../spherical-earth/spherical-trigonometry.js';

import * as api from '../api/api.js';

import expect from 'softlib/expect.js';

const EARTH_RADIUS = 6371;

export default class Edge {
    constructor(t, e, r, i, s) {
        expect(t, 'IndexedCoordinates'), expect(e, 'String'), expect(r, 'Number'), expect(i, 'Vertex'), 
        expect(s, 'Vertex'), this.indexedCoordinates = t, this.uid = e, this.terrasect = r, 
        this.vertexA = i, this.vertexB = s, this.edgeLength = this.determineEdgeLength(), 
        this.bias = 1, this.neighboringFaces = [];
    }
    get formattedID() {
        return `E(${this.uid})`;
    }
    getPoints(t) {
        return [ this.vertexA.getPoint(t), this.vertexB.getPoint(t) ];
    }
    determineEdgeLength() {
        return 6371 * st.lengthOfArc(this.vertexA.latitude, this.vertexA.longitude, this.vertexB.latitude, this.vertexB.longitude);
    }
    accumulateEdgeStatistics(t, e) {
        for (expect(t, 'Array'), expect(e, 'Boolean'); this.terrasect > t.length - 1; ) t.push(new Map);
        var r = t[this.terrasect];
        const i = this.edgeLength, s = (100 * this.bias).toFixed(0) + '%', o = Math.round(i), a = Math.round(i).toLocaleString() + 'km';
        e && console.log(`terrasect:${this.terrasect}  length:${a}  bias:${s}`);
        var h = r.get(o);
        null == h && (h = 0), r.set(o, h + 1);
    }
}