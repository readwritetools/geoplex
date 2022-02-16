/* Copyright (c) 2022 Read Write Tools. */
import fs from 'fs';

import expect from '../node_modules/softlib/expect.js';

import terminal from '../node_modules/softlib/terminal.js';

export default class GeojsonFile {
    constructor(e) {
        expect(e, 'String'), this.type = 'MultiFeatureCollection', this.id = e, this.collections = [];
    }
    addCollection(e) {
        expect(e, 'GeojsonCollection'), e.length > 0 && expect(e[0], [ 'GeojsonPoint', 'GeojsonLine', 'GeojsonPolygon' ]), 
        this.collections.push(e);
    }
    write(e) {
        if (expect(e, 'String'), 0 == this.collections.length) return terminal.trace('No feature collections to write'), 
        !1;
        try {
            return fs.writeFileSync(e, JSON.stringify(this, null, 4)), !0;
        } catch (e) {
            return terminal.abnormal(e.message), !1;
        }
    }
}