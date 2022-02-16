/* Copyright (c) 2022 Read Write Tools. */
import fs from 'fs';

import Vertex from './vertex.js';

import Edge from './edge.js';

import Face from './face.js';

import Centroid from './centroid.js';

import IndexedCoordinates from '../ice/indexed-coordinates.js';

import expect from '../node_modules/softlib/expect.js';

import terminal from '../node_modules/softlib/terminal.js';

import aver from '../node_modules/softlib/aver.js';

const PI = Math.PI, degreesToRadians = Math.PI / 180, radiansToDegrees = 180 / Math.PI;

export default class Icosahedron {
    constructor(e, t) {
        this.terrasect = e, this.primaryPoints = new Map, this.indexedCoordinates = new IndexedCoordinates, 
        this.vertices = new Map, this.edges = new Map, this.faces = new Map, this.centroids = new Map, 
        this.hasTopologyNetwork = !1, this.vertexToFaces = new Map, this.edgeToFaces = new Map, 
        this.vertexToVertices = new Map;
    }
    regularAll() {
        return this.initializePrimaryVertices(), this.initializePrimaryFaces(), this.initializePrimaryEdges(), 
        this.determineFaceAndCentroidBias(), this.determineEdgeBias(), this.buildVertexTopology(), 
        this.buildEdgeTopology(), this.buildFaceTopology(), this.buildCentroidTopology(), 
        null;
    }
    regularVertices() {
        return this.initializePrimaryVertices(), this.initializePrimaryFaces(), this.initializePrimaryEdges(), 
        this.buildVertexTopology(), this.vertices;
    }
    regularEdges() {
        return this.initializePrimaryVertices(), this.initializePrimaryFaces(), this.initializePrimaryEdges(), 
        this.determineEdgeBias(), this.buildEdgeTopology(), this.edges;
    }
    regularFaces() {
        return this.initializePrimaryVertices(), this.initializePrimaryFaces(), this.initializePrimaryEdges(), 
        this.determineFaceAndCentroidBias(), this.buildFaceTopology(), this.faces;
    }
    regularCentroids() {
        return this.initializePrimaryVertices(), this.initializePrimaryFaces(), this.determineFaceAndCentroidBias(), 
        this.buildCentroidTopology(), this.centroids;
    }
    initializePrimaryVertices() {
        const e = Math.atan2(1, 2) * radiansToDegrees;
        this.primaryPoints.set('A', this.createVertex(0, 0, 90)), this.primaryPoints.set('B', this.createVertex(0, 0, e)), 
        this.primaryPoints.set('C', this.createVertex(0, 72, e)), this.primaryPoints.set('D', this.createVertex(0, 144, e)), 
        this.primaryPoints.set('E', this.createVertex(0, -144, e)), this.primaryPoints.set('F', this.createVertex(0, -72, e)), 
        this.primaryPoints.set('G', this.createVertex(0, 36, -e)), this.primaryPoints.set('H', this.createVertex(0, 108, -e)), 
        this.primaryPoints.set('I', this.createVertex(0, 180, -e)), this.primaryPoints.set('J', this.createVertex(0, -108, -e)), 
        this.primaryPoints.set('K', this.createVertex(0, -36, -e)), this.primaryPoints.set('L', this.createVertex(0, 0, -90));
    }
    initializePrimaryFaces() {
        this.oneFace('ABC'), this.oneFace('ACD'), this.oneFace('ADE'), this.oneFace('AEF'), 
        this.oneFace('BFA'), this.oneFace('GCB'), this.oneFace('CGH'), this.oneFace('DCH'), 
        this.oneFace('DHI'), this.oneFace('EDI'), this.oneFace('EIJ'), this.oneFace('FEJ'), 
        this.oneFace('FJK'), this.oneFace('KFB'), this.oneFace('GKB'), this.oneFace('LHG'), 
        this.oneFace('LIH'), this.oneFace('LJI'), this.oneFace('LKJ'), this.oneFace('KGL');
    }
    oneFace(e) {
        var t = e.charAt(0), i = e.charAt(1), r = e.charAt(2), s = this.primaryPoints.get(t), o = this.primaryPoints.get(i), a = this.primaryPoints.get(r);
        this.createFace(0, null, s, o, a);
    }
    initializePrimaryEdges() {
        this.threeEdges('ABC'), this.threeEdges('ACD'), this.threeEdges('ADE'), this.threeEdges('AEF'), 
        this.threeEdges('BFA'), this.threeEdges('GCB'), this.threeEdges('CGH'), this.threeEdges('DCH'), 
        this.threeEdges('DHI'), this.threeEdges('EDI'), this.threeEdges('EIJ'), this.threeEdges('FEJ'), 
        this.threeEdges('FJK'), this.threeEdges('KFB'), this.threeEdges('GKB'), this.threeEdges('LHG'), 
        this.threeEdges('LIH'), this.threeEdges('LJI'), this.threeEdges('LKJ'), this.threeEdges('KGL');
    }
    threeEdges(e) {
        var t = e.charAt(0), i = e.charAt(1), r = e.charAt(2), s = this.primaryPoints.get(t), o = this.primaryPoints.get(i), a = this.primaryPoints.get(r);
        this.createEdge(0, s, o), this.createEdge(0, o, a), this.createEdge(0, a, s);
    }
    createVertex(e, t, i) {
        var [r, s] = this.indexedCoordinates.registerCoordinates(t, i), o = this.indexedCoordinates.uidFromIce(r, s), a = this.vertices.get(o);
        return null == a && (a = new Vertex(this.indexedCoordinates, o, e, r, s), this.vertices.set(o, a)), 
        a;
    }
    createEdge(e, t, i) {
        expect(e, 'Number'), expect(t, 'Vertex'), expect(i, 'Vertex');
        var r = `${t.uid}‖${i.uid}`, s = this.edges.get(r);
        return null == s && (r = `${i.uid}‖${t.uid}`, s = this.edges.get(r)), null == s && (s = new Edge(this.indexedCoordinates, r, e, t, i), 
        this.edges.set(r, s)), s;
    }
    createFace(e, t, i, r, s) {
        expect(e, 'Number'), expect(t, [ 'String', 'null' ]), expect(i, 'Vertex'), expect(r, 'Vertex'), 
        expect(s, 'Vertex');
        var o = `${i.uid}‖${r.uid}‖${s.uid}`, a = this.faces.get(o);
        return null == a && (o = `${r.uid}‖${s.uid}‖${i.uid}`, a = this.faces.get(o)), null == a && (o = `${s.uid}‖${i.uid}‖${r.uid}`, 
        a = this.faces.get(o)), null == a && (o = `${i.uid}‖${r.uid}‖${s.uid}`, a = new Face(this, o, e, t, i, r, s), 
        this.faces.set(o, a)), a;
    }
    createCentroid(e, t, i) {
        var [r, s] = this.indexedCoordinates.registerCoordinates(t, i), o = `${this.indexedCoordinates.uidFromIce(r, s)}@${e}`, a = this.centroids.get(o);
        return null == a && (a = new Centroid(this.indexedCoordinates, o, e, r, s), this.centroids.set(o, a)), 
        a;
    }
    determineFaceAndCentroidBias() {
        var e = new Array;
        for (let t of this.faces.values()) t.accumulateFaceStatistics(e, !1);
        var t = new Array;
        for (let a = 0; a < e.length; a++) {
            var i = e[a], r = 0, s = 0;
            for (let [e, t] of i.entries()) r += t, s += e * t;
            var o = s / r;
            t[a] = o;
        }
        for (let e of this.faces.values()) {
            o = t[e.terrasect];
            e.bias = e.triangularArea / o, e.centroid.bias = e.bias;
        }
    }
    determineEdgeBias() {
        var e = new Array;
        for (let t of this.edges.values()) t.accumulateEdgeStatistics(e, !1);
        var t = new Array;
        for (let a = 0; a < e.length; a++) {
            var i = e[a], r = 0, s = 0;
            for (let [e, t] of i.entries()) r += t, s += e * t;
            var o = s / r;
            t[a] = o;
        }
        for (let e of this.edges.values()) {
            o = t[e.terrasect];
            e.bias = e.edgeLength / o;
        }
    }
    buildVertexTopology() {
        this.hasTopologyNetwork || this.buildTopologyNetwork();
        for (let r of this.vertices.values()) {
            var e = `${r.uid}@${r.terrasect}`, t = this.vertexToFaces.get(e);
            if (null != t) for (let e = 0; e < t.length; e++) r.neighboringFaces.push(t[e]);
            e = `${r.uid}@${r.terrasect}`;
            var i = this.vertexToVertices.get(e);
            if (null != i) for (let e = 0; e < i.length; e++) r.neighboringVertices.push(i[e]);
        }
    }
    buildEdgeTopology() {
        this.hasTopologyNetwork || this.buildTopologyNetwork();
        for (let s of this.edges.values()) {
            var [e, t] = s.uid.split('‖', 2), i = this.determineEdgeFromEdgeVertices(e, t), r = this.edgeToFaces.get(i);
            if (null != r) for (let e = 0; e < r.length; e++) s.neighboringFaces.push(r[e]);
        }
    }
    buildFaceTopology() {
        this.hasTopologyNetwork || this.buildTopologyNetwork();
        for (let t of this.faces.values()) {
            var e = this.determineEdgeFromEdgeVertices(t.vertexA.uid, t.vertexB.uid);
            if (null != e) {
                t.neighboringEdges.push(e);
                let i = this.determineOppositeFaceFromEdge(e, t.uid);
                null != i && t.neighboringFaces.push(i);
            }
            if (null != (e = this.determineEdgeFromEdgeVertices(t.vertexB.uid, t.vertexC.uid))) {
                t.neighboringEdges.push(e);
                let i = this.determineOppositeFaceFromEdge(e, t.uid);
                null != i && t.neighboringFaces.push(i);
            }
            if (null != (e = this.determineEdgeFromEdgeVertices(t.vertexC.uid, t.vertexA.uid))) {
                t.neighboringEdges.push(e);
                let i = this.determineOppositeFaceFromEdge(e, t.uid);
                null != i && t.neighboringFaces.push(i);
            }
        }
    }
    buildCentroidTopology() {
        this.hasTopologyNetwork || this.buildTopologyNetwork();
        for (let t of this.faces.values()) {
            var e = this.determineEdgeFromEdgeVertices(t.vertexA.uid, t.vertexB.uid);
            if (null != e) {
                let i = this.determineOppositeCentroidFromEdge(e, t.uid);
                null != i && t.centroid.neighboringCentroids.push(i);
            }
            if (null != (e = this.determineEdgeFromEdgeVertices(t.vertexB.uid, t.vertexC.uid))) {
                let i = this.determineOppositeCentroidFromEdge(e, t.uid);
                null != i && t.centroid.neighboringCentroids.push(i);
            }
            if (null != (e = this.determineEdgeFromEdgeVertices(t.vertexC.uid, t.vertexA.uid))) {
                let i = this.determineOppositeCentroidFromEdge(e, t.uid);
                null != i && t.centroid.neighboringCentroids.push(i);
            }
            t.centroid.enclosingFace = t.uid;
        }
    }
    determineEdgeFromEdgeVertices(e, t) {
        expect(e, 'String'), expect(t, 'String');
        var i = `${e}‖${t}`, r = this.edgeToFaces.has(i);
        return r || (i = `${t}‖${e}`, r = this.edgeToFaces.has(i)), r ? i : null;
    }
    determineOppositeFaceFromEdge(e, t) {
        var i = this.edgeToFaces.get(e);
        if (null == i) return null;
        for (let e = 0; e < i.length; e++) if (i[e] != t) return i[e];
        return null;
    }
    determineOppositeCentroidFromEdge(e, t) {
        var i = this.edgeToFaces.get(e);
        if (null == i) return null;
        for (let e = 0; e < i.length; e++) if (i[e] != t) {
            let t = this.faces.get(i[e]);
            if (null != t) return t.centroid.uid;
        }
        return null;
    }
    buildTopologyNetwork() {
        for (let e of this.faces.values()) this.oneVertexToFaceRelationship(e.vertexA, e.terrasect, e.uid), 
        this.oneVertexToFaceRelationship(e.vertexB, e.terrasect, e.uid), this.oneVertexToFaceRelationship(e.vertexC, e.terrasect, e.uid), 
        this.oneEdgeToFaceRelationship(e.vertexA, e.vertexB, e.uid), this.oneEdgeToFaceRelationship(e.vertexB, e.vertexC, e.uid), 
        this.oneEdgeToFaceRelationship(e.vertexC, e.vertexA, e.uid);
        for (let e of this.edges.values()) this.oneEndpointToEndpointRelationship(e.vertexA, e.vertexB, e.terrasect), 
        this.oneEndpointToEndpointRelationship(e.vertexB, e.vertexA, e.terrasect);
        this.hasTopologyNetwork = !0;
    }
    oneVertexToFaceRelationship(e, t, i) {
        expect(e, 'Vertex'), expect(t, 'Number'), expect(i, 'String');
        var r = `${e.uid}@${t}`, s = this.vertexToFaces.get(r);
        null == s && (s = [], this.vertexToFaces.set(r, s)), s.push(i);
    }
    oneEdgeToFaceRelationship(e, t, i) {
        expect(e, 'Vertex'), expect(t, 'Vertex'), expect(i, 'String');
        var r = `${e.uid}‖${t.uid}`, s = this.edgeToFaces.get(r);
        null == s && (r = `${t.uid}‖${e.uid}`, s = this.edgeToFaces.get(r)), null == s && (s = [], 
        this.edgeToFaces.set(r, s)), s.push(i);
    }
    oneEndpointToEndpointRelationship(e, t, i) {
        expect(e, 'Vertex'), expect(t, 'Vertex'), expect(i, 'Number');
        var r = `${e.uid}@${i}`, s = this.vertexToVertices.get(r);
        null == s && (s = [], this.vertexToVertices.set(r, s)), s.push(t.uid);
    }
}