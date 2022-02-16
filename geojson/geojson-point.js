/* Copyright (c) 2022 Read Write Tools. */
import expect from '../node_modules/softlib/expect.js';

export default class GeojsonPoint {
    constructor(e, t) {
        expect(e, 'Object'), expect(t, 'Array'), 2 == t.length ? (this.properties = e, this.type = 'Feature', 
        this.geometry = {
            type: 'Point',
            coordinates: t
        }) : console.error('Each point should be an array of two numbers: lng, lat');
    }
}