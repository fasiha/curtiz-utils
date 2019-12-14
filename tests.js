"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tape_1 = __importDefault(require("tape"));
const shuffle = require('array-shuffle');
const _1 = require(".");
tape_1.default('partialSort', t => {
    const v = 'qwertyuioasdfghjklzxcvbnm'.split('');
    const sol = _1.partialSort(v, 5, (s) => s.charCodeAt(0));
    sol.forEach(({ x, y }) => t.equal(y, x.charCodeAt(0)));
    t.equal(sol.map(({ x }) => x).join(''), 'abcde');
    t.end();
});
tape_1.default('lowestHist', t => {
    const desc = (a, b) => b - a;
    {
        const v = [-1, -2, -3, 0, 1, 2, 3, 10, 11, 12, 20, 21, 22];
        t.deepEqual(_1.binLowest(v, [0, 10], x => x).sort(desc), [-1, -2, -3]);
        v.sort(desc);
        t.deepEqual(_1.binLowest(v, [0, 10], x => x).sort(desc), [-1, -2, -3]);
        const s = shuffle(v);
        t.deepEqual(_1.binLowest(s, [0, 10], x => x).sort(desc), [-1, -2, -3]);
    }
    {
        const v = [0, 1, 10, 11, 20, 21];
        t.deepEqual(_1.binLowest(v, [0, 10], x => x).sort(desc), [1, 0]);
    }
    {
        const v = [10, 11, 100];
        t.deepEqual(_1.binLowest(v, [0, 10], x => x).sort(desc), [100, 11, 10]);
    }
    t.end();
});
