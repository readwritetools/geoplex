/* Copyright (c) 2022 Read Write Tools. */
import * as st from '../spherical-earth/spherical-trigonometry.js';

import Vertex from './vertex.js';

import Edge from './edge.js';

import * as api from '../api/api.js';

import expect from 'softlib/expect.js';

import terminal from 'softlib/terminal.js';

const EARTH_RADIUS = 6371;

export default class Face {
    constructor(e, t, i, r, s, a, h) {
        expect(e, 'Icosahedron'), expect(t, 'String'), expect(i, 'Number'), expect(r, [ 'String', 'null' ]), 
        expect(s, 'Vertex'), expect(a, 'Vertex'), expect(h, 'Vertex'), this.icosahedron = e, 
        this.indexedCoordinates = this.icosahedron.indexedCoordinates, this.uid = t, this.terrasect = i, 
        this.parentUID = r, this.vertexA = s, this.vertexB = a, this.vertexC = h;
        var c = this.determineCenterPoint();
        this.centroid = this.icosahedron.createCentroid(this.terrasect, c.longitude, c.latitude), 
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
    determineCenterPoint() {
        return st.centroidOfEquilateralTriangle(this.vertexA.latitude, this.vertexA.longitude, this.vertexB.latitude, this.vertexB.longitude, this.vertexC.latitude, this.vertexC.longitude);
    }
    createSubFaces() {
        var e = this.vertexA, t = this.vertexB, i = this.vertexC, r = st.sphericalMidpoint(e.latitude, e.longitude, t.latitude, t.longitude), s = st.sphericalMidpoint(t.latitude, t.longitude, i.latitude, i.longitude), a = st.sphericalMidpoint(i.latitude, i.longitude, e.latitude, e.longitude), h = this.icosahedron.createVertex(this.terrasect + 1, r.longitude, r.latitude), c = this.icosahedron.createVertex(this.terrasect + 1, s.longitude, s.latitude), o = this.icosahedron.createVertex(this.terrasect + 1, a.longitude, a.latitude);
        this.icosahedron.createEdge(this.terrasect + 1, e, h), this.icosahedron.createEdge(this.terrasect + 1, h, t), 
        this.icosahedron.createEdge(this.terrasect + 1, t, c), this.icosahedron.createEdge(this.terrasect + 1, c, i), 
        this.icosahedron.createEdge(this.terrasect + 1, i, o), this.icosahedron.createEdge(this.terrasect + 1, o, e), 
        this.icosahedron.createEdge(this.terrasect + 1, h, c), this.icosahedron.createEdge(this.terrasect + 1, c, o), 
        this.icosahedron.createEdge(this.terrasect + 1, o, h), this.face1 = this.icosahedron.createFace(this.terrasect + 1, this.uid, e, h, o), 
        this.face2 = this.icosahedron.createFace(this.terrasect + 1, this.uid, h, t, c), 
        this.face3 = this.icosahedron.createFace(this.terrasect + 1, this.uid, o, c, i), 
        this.face4 = this.icosahedron.createFace(this.terrasect + 1, this.uid, h, c, o), 
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
        const r = this.triangularArea, s = (100 * this.bias).toFixed(0) + '%', a = Math.round(r), h = Math.round(r).toLocaleString() + 'km²';
        t && console.log(`terrasect:${this.terrasect}  area:${h}  bias:${s}`);
        var c = i.get(a);
        null == c && (c = 0), i.set(a, c + 1);
    }
}