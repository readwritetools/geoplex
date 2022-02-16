/* Copyright (c) 2022 Read Write Tools. */
import expect from '../node_modules/softlib/expect.js';

export default class GeojsonLine {
    constructor(e, o) {
        expect(e, 'Object'), expect(o, 'Array'), o.length < 2 ? console.error('Lines should have two or more points') : (expect(o[0], 'Array'), 
        2 == o[0].length ? (this.properties = e, this.type = 'Feature', this.geometry = {
            type: 'LineString',
            coordinates: o
        }) : console.error('Each point should be an array of two numbers: lng, lat'));
    }
}