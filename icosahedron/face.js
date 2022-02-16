/* Copyright (c) 2022 Read Write Tools. */
import GeojsonPolygon from '../geojson/geojson-polygon.js';

import GeojsonPoint from '../geojson/geojson-point.js';

import * as st from '../spherical-earth/spherical-trigonometry.js';

import Vertex from './vertex.js';

import Edge from './edge.js';

import * as api from '../api.js';

import * as GeojsonWriter from '../geojson/geojson-writer.js';

import * as IceWriter from '../ice/ice-writer.js';

import expect from '../node_modules/softlib/expect.js';

import terminal from '../node_modules/softlib/terminal.js';

const EARTH_RADIUS = 6371;

export default class Face {
    constructor(e, t, i, r, s, o, a) {
        expect(e, 'Icosahedron'), expect(t, 'String'), expect(i, 'Number'), expect(r, [ 'String', 'null' ]), 
        expect(s, 'Vertex'), expect(o, 'Vertex'), expect(a, 'Vertex'), this.icosahedron = e, 
        this.indexedCoordinates = this.icosahedron.indexedCoordinates, this.uid = t, this.terrasect = i, 
        this.parentUID = r, this.vertexA = s, this.vertexB = o, this.vertexC = a;
        var h = this.determineCenterPoint();
        this.centroid = this.icosahedron.createCentroid(this.terrasect, h.longitude, h.latitude), 
        this.triangularArea = this.determineTriangularArea(), this.bias = 1, this.neighboringEdges = [], 
        this.neighboringFaces = [], this.hasInnerFaces = !1, this.face1 = null, this.face2 = null, 
        this.face3 = null, this.face4 = null, this.terrasect < this.icosahedron.terrasect && this.createSubFaces(), 
        Object.seal(this);
    }
    get formattedID() {
        return `F(${this.uid})`;
    }
    getPoints(e) {
        return [ this.vertexA.getPoint(e), this.vertexB.getPoint(e), this.vertexC.getPoint(e) ];
    }
    toGeojson(e, t) {
        expect(e, 'Number'), expect(t, 'Array');
        var i = {};
        for (let o = 0; o < t.length; o++) {
            var r = t[o], s = GeojsonWriter.formatGeojsonValue(r, this[r], e);
            i[r] = s;
        }
        return new GeojsonPolygon(i, this.getPoints(e));
    }
    toIce(e, t, i, r) {
        expect(e, 'TextWriter'), expect(t, 'Number'), expect(i, 'Array'), expect(r, 'String'), 
        'ice' == r ? (IceWriter.toString(e, 'xRings', [ this.vertexA.iceX, this.vertexB.iceX, this.vertexC.iceX ], t), 
        IceWriter.toString(e, 'yRings', [ this.vertexA.iceY, this.vertexB.iceY, this.vertexC.iceY ], t)) : 'icebin' == r ? (IceWriter.toBin(e, 'xRings', [ this.vertexA.iceX, this.vertexB.iceX, this.vertexC.iceX ], this.indexedCoordinates.packedWidth), 
        IceWriter.toBin(e, 'yRings', [ this.vertexA.iceY, this.vertexB.iceY, this.vertexC.iceY ], this.indexedCoordinates.packedWidth)) : 'gfe' == r ? (IceWriter.toString(e, 'lngRings', [ this.vertexA.longitude, this.vertexB.longitude, this.vertexC.longitude ], t), 
        IceWriter.toString(e, 'latRings', [ this.vertexA.latitude, this.vertexB.latitude, this.vertexC.latitude ], t)) : 'gfebin' == r && (IceWriter.toBin(e, 'lngRings', [ this.vertexA.longitude, this.vertexB.longitude, this.vertexC.longitude ], this.indexedCoordinates.packedWidth), 
        IceWriter.toBin(e, 'latRings', [ this.vertexA.latitude, this.vertexB.latitude, this.vertexC.latitude ], this.indexedCoordinates.packedWidth));
        for (let s = 0; s < i.length; s++) {
            let o = i[s];
            'ice' == r || 'gfe' == r ? IceWriter.toString(e, o, this[o], t) : 'icebin' != r && 'gfebin' != r || IceWriter.toBin(e, o, this[o]);
        }
    }
    determineCenterPoint() {
        return st.centroidOfEquilateralTriangle(this.vertexA.latitude, this.vertexA.longitude, this.vertexB.latitude, this.vertexB.longitude, this.vertexC.latitude, this.vertexC.longitude);
    }
    createSubFaces() {
        var e = this.vertexA, t = this.vertexB, i = this.vertexC, r = st.sphericalMidpoint(e.latitude, e.longitude, t.latitude, t.longitude), s = st.sphericalMidpoint(t.latitude, t.longitude, i.latitude, i.longitude), o = st.sphericalMidpoint(i.latitude, i.longitude, e.latitude, e.longitude), a = this.icosahedron.createVertex(this.terrasect + 1, r.longitude, r.latitude), h = this.icosahedron.createVertex(this.terrasect + 1, s.longitude, s.latitude), n = this.icosahedron.createVertex(this.terrasect + 1, o.longitude, o.latitude);
        this.icosahedron.createEdge(this.terrasect + 1, e, a), this.icosahedron.createEdge(this.terrasect + 1, a, t), 
        this.icosahedron.createEdge(this.terrasect + 1, t, h), this.icosahedron.createEdge(this.terrasect + 1, h, i), 
        this.icosahedron.createEdge(this.terrasect + 1, i, n), this.icosahedron.createEdge(this.terrasect + 1, n, e), 
        this.icosahedron.createEdge(this.terrasect + 1, a, h), this.icosahedron.createEdge(this.terrasect + 1, h, n), 
        this.icosahedron.createEdge(this.terrasect + 1, n, a), this.face1 = this.icosahedron.createFace(this.terrasect + 1, this.uid, e, a, n), 
        this.face2 = this.icosahedron.createFace(this.terrasect + 1, this.uid, a, t, h), 
        this.face3 = this.icosahedron.createFace(this.terrasect + 1, this.uid, n, h, i), 
        this.face4 = this.icosahedron.createFace(this.terrasect + 1, this.uid, a, h, n), 
        this.hasInnerFaces = !0;
    }
    determineTriangularArea() {
        return st.triangularArea(this.vertexA.latitude, this.vertexA.longitude, this.vertexB.latitude, this.vertexB.longitude, this.vertexC.latitude, this.vertexC.longitude);
    }
    determineSphericalExcess() {
        return st.sphericalExcess(this.vertexA.latitude, this.vertexA.longitude, this.vertexB.latitude, this.vertexB.longitude, this.vertexC.latitude, this.vertexC.longitude);
    }
    crossesDateline() {
        return !!this.vertexA.crossesDateline(this.vertexB) || !!this.vertexB.crossesDateline(this.vertexC);
    }
    accumulateFaceStatistics(e, t) {
        for (expect(e, 'Array'), expect(t, 'Boolean'); this.terrasect > e.length - 1; ) e.push(new Map);
        var i = e[this.terrasect];
        const r = this.triangularArea, s = (100 * this.bias).toFixed(0) + '%', o = Math.round(r), a = Math.round(r).toLocaleString() + 'km²';
        t && console.log(`terrasect:${this.terrasect}  area:${a}  bias:${s}`);
        var h = i.get(o);
        null == h && (h = 0), i.set(o, h + 1);
    }
}