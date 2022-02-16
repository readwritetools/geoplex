/* Copyright (c) 2022 Read Write Tools. */
import * as Options from '../options.js';

import * as IceMarker from '../ice/ice-marker.js';

import Pfile from '../node_modules/iolib/pfile.class.js';

import TextReader from '../node_modules/iolib/text-reader.class.js';

import TextWriter from '../node_modules/iolib/text-writer.class.js';

import expect from '../node_modules/softlib/expect.js';

import terminal from '../node_modules/softlib/terminal.js';

import aver from '../node_modules/softlib/aver.js';

export function writeAllToIce(e, t, r, i, n, a, c) {
    return writeToIce(e, t, c, ((e, t) => {
        expect(e, 'String'), expect(t, 'TextWriter'), expect(r, 'Map'), expect(i, 'Map'), 
        expect(n, 'Map'), expect(a, 'Map'), writeVertexDataset(t, `${e}-vertices`, r, c.properties, c.accuracy, c.minTerrasect, c.maxTerrasect, c.format), 
        writeEdgeDataset(t, `${e}-edges`, i, c.properties, c.accuracy, c.minTerrasect, c.maxTerrasect, c.format), 
        writeFaceDataset(t, `${e}-faces`, n, c.properties, c.accuracy, c.minTerrasect, c.maxTerrasect, c.format), 
        writeCentroidDataset(t, `${e}-centroids`, a, c.properties, c.accuracy, c.minTerrasect, c.maxTerrasect, c.format);
    }));
}

export function writeVerticesToIce(e, t, r, i) {
    return writeToIce(e, t, i, ((e, t) => {
        expect(e, 'String'), expect(t, 'TextWriter'), expect(r, 'Map'), writeVertexDataset(t, e, r, i.properties, i.accuracy, i.minTerrasect, i.maxTerrasect, i.format);
    }));
}

export function writeEdgesToIce(e, t, r, i) {
    return writeToIce(e, t, i, ((e, t) => {
        expect(e, 'String'), expect(t, 'TextWriter'), expect(r, 'Map'), writeEdgeDataset(t, e, r, i.properties, i.accuracy, i.minTerrasect, i.maxTerrasect, i.format);
    }));
}

export function writeFacesToIce(e, t, r, i) {
    return writeToIce(e, t, i, ((e, t) => {
        expect(e, 'String'), expect(t, 'TextWriter'), expect(r, 'Map'), writeFaceDataset(t, e, r, i.properties, i.accuracy, i.minTerrasect, i.maxTerrasect, i.format);
    }));
}

export function writeCentroidsToIce(e, t, r, i) {
    return writeToIce(e, t, i, ((e, t) => {
        expect(e, 'String'), expect(t, 'TextWriter'), expect(r, 'Map'), writeCentroidDataset(t, e, r, i.properties, i.accuracy, i.minTerrasect, i.maxTerrasect, i.format);
    }));
}

function writeToIce(e, t, r, i) {
    expect(e, 'IndexedCoordinates'), expect(t, 'String'), Options.validateWriteOptions(r), 
    expect(i, 'Function');
    let n = new Pfile(t).getStem();
    try {
        var a = new TextWriter;
        return a.open(t), a.isOpen() ? (writeProlog(a, r.format), writeCoordinates(a, e, r.accuracy, r.format), 
        i(n, a), a.close(), !0) : !1;
    } catch (e) {
        return terminal.caught(e.message), !1;
    }
}

function writeProlog(e, t) {
    switch (t) {
      case 'ice':
        return void e.putline(IceMarker.ICE_PROLOG[1]);

      case 'icebin':
        return void e.writeText(IceMarker.ICE_PROLOG[0]);

      case 'gfe':
        return void e.putline(IceMarker.GFE_PROLOG[1]);

      case 'gfebin':
        return void e.writeText(IceMarker.GFE_PROLOG[0]);

      default:
        terminal.logic(`expected 'ice', 'icebin', 'gfe' or 'gfebin' but got ${t}`);
    }
}

function writeCoordinates(e, t, r, i) {
    if (expect(e, 'TextWriter'), expect(t, 'IndexedCoordinates'), expect(r, 'Number'), 
    'ice' == i) {
        const r = IceMarker.toString(IceMarker.MERIDIANS), i = t.meridians.length;
        e.putline(`${r} ${i}`);
        for (let r = 0; r < i; r++) {
            var n = Math.fround(t.meridians[r]);
            e.putline(n);
        }
        const a = IceMarker.toString(IceMarker.PARALLELS), c = t.parallels.length;
        e.putline(`${a} ${c}`);
        for (let r = 0; r < c; r++) {
            n = Math.fround(t.parallels[r]);
            e.putline(n);
        }
    } else if ('icebin' == i) {
        const r = IceMarker.toBin(IceMarker.MERIDIANS);
        e.writeBytes(r), e.writeUint32(t.meridians.length);
        for (let r = 0; r < t.meridians.length; r++) {
            n = Math.fround(t.meridians[r]);
            e.writeFloat32(n);
        }
        const i = IceMarker.toBin(IceMarker.PARALLELS);
        e.writeBytes(i), e.writeUint32(t.parallels.length);
        for (let r = 0; r < t.parallels.length; r++) {
            n = Math.fround(t.parallels[r]);
            e.writeFloat32(n);
        }
    } else {
        if ('gfe' == i || 'gfebin' == i) return;
        terminal.logic(`expected 'ice', 'icebin', 'gfe' or 'gfebin' but got ${i}`);
    }
}

function writeDatasetPreliminaries(e, t, r, i, n) {
    if (expect(e, 'TextWriter'), expect(t, 'String'), expect(r, 'String'), expect(i, 'Array'), 
    'ice' == n || 'gfe' == n) {
        const a = IceMarker.toString(IceMarker.DATASET);
        e.putline(`${a} ${t}`);
        const c = IceMarker.toString(IceMarker.GEOMETRY);
        e.putline(`${c} ${r}`);
        const o = IceMarker.toString(IceMarker.PROPERTIES), s = propertyNamesWithCoords(i, r, n), l = s.length, u = s.map((e => Options.icePropertyType(e)));
        e.putline(`${o} ${l}`), e.putline(s.join(',')), e.putline(u.join(','));
    } else if ('icebin' == n || 'gfebin' == n) {
        const a = IceMarker.toBin(IceMarker.DATASET);
        e.writeBytes(a), e.writeLenPrefixedText(t);
        const c = IceMarker.toBin(IceMarker.GEOMETRY);
        e.writeBytes(c), e.writeLenPrefixedText(r);
        const o = IceMarker.toBin(IceMarker.PROPERTIES), s = propertyNamesWithCoords(i, r, n), l = s.length, u = s.map((e => Options.icePropertyType(e)));
        e.writeBytes(o), e.writeUint8(l);
        for (let t = 0; t < s.length; t++) e.writeLenPrefixedText(s[t]);
        for (let t = 0; t < u.length; t++) e.writeLenPrefixedText(u[t]);
    } else terminal.logic(`expected 'ice', 'icebin', 'gfe' or 'gfebin' but got ${n}`);
}

function propertyNamesWithCoords(e, t, r) {
    if ('ice' == r || 'icebin' == r) {
        if ('Point' == t) return [ 'xCoord', 'yCoord', ...e ];
        if ('Line' == t) return [ 'xSegment', 'ySegment', ...e ];
        if ('Polygon' == t) return [ 'xRings', 'yRings', ...e ];
    } else {
        if ('gfe' != r && 'gfebin' != r) return terminal.logic(`expected 'ice', 'icebin', 'gfe' or 'gfebin' but got ${r}`), 
        e;
        if ('Point' == t) return [ 'lngCoord', 'latCoord', ...e ];
        if ('Line' == t) return [ 'lngSegment', 'latSegment', ...e ];
        if ('Polygon' == t) return [ 'lngRings', 'latRings', ...e ];
    }
}

function beginFeatures(e, t, r) {
    if ('ice' == r || 'gfe' == r) {
        const r = IceMarker.toString(IceMarker.FEATURES);
        e.putline(`${r} ${t}`);
    } else if ('icebin' == r || 'gfebin' == r) {
        const r = IceMarker.toBin(IceMarker.FEATURES);
        e.writeBytes(r), e.writeUint32(t);
    } else terminal.logic(`expected 'ice', 'icebin', 'gfe' or 'gfebin' but got ${r}`);
}

function endFeatures(e, t) {
    if ('ice' == t || 'gfe' == t) {
        const t = IceMarker.toString(IceMarker.END);
        e.putline(t);
    } else if ('icebin' == t || 'gfebin' == t) {
        const t = IceMarker.toBin(IceMarker.END);
        e.writeBytes(t);
    } else terminal.logic(`expected 'ice', 'icebin', 'gfe' or 'gfebin' but got ${t}`);
}

function writeVertexDataset(e, t, r, i, n, a, c, o) {
    expect(r, 'Map'), expect(i, 'Array');
    const s = Options.vertexPropertyNames(i);
    writeDatasetPreliminaries(e, t, 'Point', s, o);
    var l = 0;
    for (let e of r.values()) e.terrasect >= a && e.terrasect <= c && l++;
    beginFeatures(e, l, o);
    for (let t of r.values()) t.terrasect >= a && t.terrasect <= c && t.toIce(e, n, s, o);
    endFeatures(e, o);
}

function writeEdgeDataset(e, t, r, i, n, a, c, o) {
    expect(r, 'Map'), expect(i, 'Array');
    const s = Options.edgePropertyNames(i);
    writeDatasetPreliminaries(e, t, 'Line', s, o);
    var l = 0;
    for (let e of r.values()) e.terrasect >= a && e.terrasect <= c && l++;
    beginFeatures(e, l, o);
    for (let t of r.values()) t.terrasect >= a && t.terrasect <= c && t.toIce(e, n, s, o);
    endFeatures(e, o);
}

function writeFaceDataset(e, t, r, i, n, a, c, o) {
    expect(r, 'Map'), expect(i, 'Array');
    const s = Options.facePropertyNames(i);
    writeDatasetPreliminaries(e, t, 'Polygon', s, o);
    var l = 0;
    for (let e of r.values()) e.terrasect >= a && e.terrasect <= c && l++;
    beginFeatures(e, l, o);
    for (let t of r.values()) t.terrasect >= a && t.terrasect <= c && t.toIce(e, n, s, o);
    endFeatures(e, o);
}

function writeCentroidDataset(e, t, r, i, n, a, c, o) {
    expect(r, 'Map'), expect(i, 'Array');
    const s = Options.centroidPropertyNames(i);
    writeDatasetPreliminaries(e, t, 'Point', s, o);
    var l = 0;
    for (let e of r.values()) e.terrasect >= a && e.terrasect <= c && l++;
    beginFeatures(e, l, o);
    for (let t of r.values()) t.terrasect >= a && t.terrasect <= c && t.toIce(e, n, s, o);
    endFeatures(e, o);
}

export function toString(e, t, r, i) {
    if ('null' != r && 'undefined' != r || 'data' == t) switch (t) {
      case 'xCoord':
      case 'yCoord':
        return void e.putline(r);

      case 'xSegment':
      case 'ySegment':
        return expect(r, 'Array'), void e.putline(r.join(','));

      case 'xRings':
      case 'yRings':
        return expect(r, 'Array'), void e.putline(r.join(','));

      case 'lngCoord':
      case 'latCoord':
        return void e.putline(Math.fround(r));

      case 'lngSegment':
      case 'latSegment':
        return expect(r, 'Array'), void e.putline(r.map((e => Math.fround(e).toString())).join(','));

      case 'lngRings':
      case 'latRings':
        return expect(r, 'Array'), void e.putline(r.map((e => Math.fround(e).toString())).join(','));

      case 'uid':
      case 'parentUID':
      case 'enclosingFace':
        return void (null == r ? e.putline('') : e.putline(r));

      case 'terrasect':
        return void e.putline(r);

      case 'bias':
        return void e.putline(r.toFixed(i));

      case 'edgeLength':
      case 'triangularArea':
        return void e.putline(r.toFixed(1));

      case 'vertexA':
      case 'vertexB':
      case 'vertexC':
      case 'centroid':
      case 'face1':
      case 'face2':
      case 'face3':
      case 'face4':
        return expect(r, [ 'Vertex', 'Centroid', 'Face', 'null' ]), void (null == r || null == r.uid ? e.putline('') : e.putline(r.uid));

      case 'neighboringVertices':
      case 'neighboringEdges':
      case 'neighboringFaces':
      case 'neighboringCentroids':
        return void e.putline(JSON.stringify(r));

      case 'data':
        return void (null == r || null == r ? e.putline('{}') : e.putline(JSON.stringify(r)));

      default:
        return terminal.trace(`Ignoring unknown property name ${t} with value ${r}`), void e.putline('');
    } else this.stringBuilder.putline('');
}

export function toBin(e, t, r, i) {
    switch (t) {
      case 'xCoord':
      case 'yCoord':
        return void (2 == i ? e.writeUint16(r) : e.writeUint32(r));

      case 'xSegment':
      case 'ySegment':
        expect(r, 'Array'), aver(r.length <= 65536), e.writeUint16(r.length);
        for (let t = 0; t < r.length; t++) 2 == i ? e.writeUint16(r[t]) : e.writeUint32(r[t]);
        return;

      case 'xRings':
      case 'yRings':
        expect(r, 'Array'), aver(r.length <= 65536), e.writeUint16(r.length);
        for (let t = 0; t < r.length; t++) 2 == i ? e.writeUint16(r[t]) : e.writeUint32(r[t]);
        return;

      case 'lngCoord':
      case 'latCoord':
        var n = Number(r.toFixed(5));
        return void e.writeFloat32(n);

      case 'lngSegment':
      case 'latSegment':
        return expect(r, 'Array'), aver(r.length <= 65536), e.writeUint16(r.length), void r.forEach((t => e.writeFloat32(Number(t.toFixed(5)))));

      case 'lngRings':
      case 'latRings':
        return expect(r, 'Array'), aver(r.length <= 65536), e.writeUint16(r.length), void r.forEach((t => e.writeFloat32(Number(t.toFixed(5)))));

      case 'uid':
      case 'parentUID':
      case 'enclosingFace':
        return void (null == r ? e.writeUint8(0) : e.writeLenPrefixedText(r));

      case 'terrasect':
        return void e.writeUint8(r);

      case 'bias':
      case 'edgeLength':
      case 'triangularArea':
        return void e.writeFloat32(r);

      case 'vertexA':
      case 'vertexB':
      case 'vertexC':
      case 'centroid':
      case 'face1':
      case 'face2':
      case 'face3':
      case 'face4':
        return expect(r, [ 'Vertex', 'Centroid', 'Face', 'null' ]), void (null == r || null == r.uid ? e.writeUint8(0) : e.writeLenPrefixedText(r.uid));

      case 'neighboringVertices':
      case 'neighboringEdges':
      case 'neighboringFaces':
      case 'neighboringCentroids':
        expect(r, 'Array'), e.writeUint8(r.length);
        for (let t = 0; t < r.length; t++) e.writeLenPrefixedText(r[t]);
        return;

      case 'data':
        return void (null == r || null == r ? e.writeLenPrefixedText('{}') : e.writeLenPrefixedText(JSON.stringify(r)));

      default:
        return terminal.trace(`Ignoring unknown property name ${t} with value ${r}`), void e.writeUint8(0);
    }
}