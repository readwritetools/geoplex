/* Copyright (c) 2022 Read Write Tools. */
import expect from '../node_modules/softlib/expect.js';

export default class GeojsonPolygon {
    constructor(e, o) {
        if (expect(e, 'Object'), expect(o, 'Array'), o.length < 3) console.error('Polygons should have three or more points'); else if (expect(o[0], 'Array'), 
        2 == o[0].length) {
            this.properties = e, this.type = 'Feature', this.geometry = {
                type: 'Polygon',
                coordinates: []
            };
            var t = o[0], r = o[o.length - 1];
            r[0] == t[0] && r[1] == t[1] || o.push(t), this.rewindRing(e, o, !1), this.geometry.coordinates.push(o);
        } else console.error('Each point should be an array of two numbers: lng, lat');
    }
    rewindRing(e, o, t) {
        expect(e, 'Object'), expect(o, 'Array'), expect(t, 'Boolean');
        for (var r = 0, s = 0, n = 0, a = o.length, l = a - 1; n < a; l = n++) {
            var c = (o[n][0] - o[l][0]) * (o[l][1] + o[n][1]), h = r + c;
            s += Math.abs(r) >= Math.abs(c) ? r - h + c : c - h + r, r = h;
        }
        r + s >= 0 != !!t && o.reverse();
    }
}