import tape from 'tape';
const shuffle = require('array-shuffle');

import {binLowest, partialSort, dedupe, substringInArray} from '.';

tape('partialSort', t => {
  const v = 'qwertyuioasdfghjklzxcvbnm'.split('');
  const sol = partialSort(v, 5, (s: string) => s.charCodeAt(0));
  sol.forEach(({x, y}) => t.equal(y, x.charCodeAt(0)));
  t.equal(sol.map(({x}) => x).join(''), 'abcde');
  t.end();
});

tape('lowestHist', t => {
  const desc = (a: number, b: number) => b - a;
  {
    const v = [-1, -2, -3, 0, 1, 2, 3, 10, 11, 12, 20, 21, 22];
    t.deepEqual(binLowest(v, [0, 10], x => x).sort(desc), [-1, -2, -3]);

    v.sort(desc);
    t.deepEqual(binLowest(v, [0, 10], x => x).sort(desc), [-1, -2, -3]);

    const s: typeof v = shuffle(v);
    t.deepEqual(binLowest(s, [0, 10], x => x).sort(desc), [-1, -2, -3]);
  }
  {
    const v = [0, 1, 10, 11, 20, 21];
    t.deepEqual(binLowest(v, [0, 10], x => x).sort(desc), [1, 0]);
  }
  {
    const v = [10, 11, 100];
    t.deepEqual(binLowest(v, [0, 10], x => x).sort(desc), [100, 11, 10]);
  }
  t.end();
});

tape('dedupe', t => {
  t.deepEqual(dedupe([1, 2, 3, 2, 1], x => x), [1, 2, 3]);
  t.deepEqual(dedupe([1, -1, 2, -2, -3, -4, 3, 4], x => x ** 2), [1, 2, -3, -4]);
  t.end();
})

tape('substringInArray', t => {
  t.deepEqual(substringInArray('hi my name is bob'.split(' '), 'hi'), {startIdx: 0, endIdx: 1})
  t.deepEqual(substringInArray('hi my name is bob'.split(' '), 'himy'), {startIdx: 0, endIdx: 2})
  t.deepEqual(substringInArray('hi my name is bob'.split(' '), 'my'), {startIdx: 1, endIdx: 2})
  t.deepEqual(substringInArray('hi my name is bob'.split(' '), 'myname'), {startIdx: 1, endIdx: 3})
  t.deepEqual(substringInArray('hi my name is bob'.split(' '), 'isbob'), {startIdx: 3, endIdx: 5})
  t.deepEqual(substringInArray('hi my name is bob'.split(' '), 'bob'), {startIdx: 4, endIdx: 5})
  t.ok(substringInArray('hi my name is bob'.split(' '), ''))
  t.equal(substringInArray('hi my name is bob'.split(' '), 'h'), undefined)
  t.equal(substringInArray('hi my name is bob'.split(' '), 'him'), undefined)

  t.end();
})