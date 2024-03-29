"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./kana"));
/**
 * Does an input string have any kanji? Applies XRegExp's '\Han' Unicode block test.
 * @param s string to test
 * See https://stackoverflow.com/questions/7344871/javascript-regular-expression-to-catch-kanji#comment91884309_7351856
 */
function hasKanji(s) {
    const k = /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FEF\uF900-\uFA6D\uFA70-\uFAD9]/;
    return k.test(s);
}
exports.hasKanji = hasKanji;
/**
 * Flatten once.
 * @param arr array of arrays
 */
function flatten(arr) { return arr.reduce((memo, curr) => memo.concat(curr), []); }
exports.flatten = flatten;
/**
 * Generates `[index, value]` 2-tuples, so you can `for (let [index, value] of enumerate(v) {...})`.
 * @param v array or iterable iterator to enumerate
 * @param n starting number (defaults to 0)
 *
 * Hat tip: https://docs.python.org/3/library/functions.html#enumerate
 */
function* enumerate(v, n = 0) {
    for (let x of v) {
        yield [n++, x];
    }
}
exports.enumerate = enumerate;
/**
 * Generates tuples slicing across each of the input arrays, like Python's zip.
 * @param arrs arrays to zip over
 *
 * Outputs only as many times as the *shortest* input array.
 * Example:
 * `for (let [num, let] of zip([1, 2, 3], ['one', 'two', 'three', 'four'])) { console.log(num, let); }` produces the
 * following:
 * - `[1, 'one']`
 * - `[2, 'two']`
 * - `[3, 'three']`
 *
 * Hat tip: https://docs.python.org/3/library/functions.html#zip
 */
function* zip(...arrs) {
    const stop = Math.min(...arrs.map(v => v.length));
    for (let i = 0; i < stop; i++) {
        yield arrs.map(v => v[i]);
    }
}
exports.zip = zip;
/**
 * Apply a predicate to an array from its end, returning the continguously-passing sub-array.
 * @param arr Array to filter from the right (end)
 * @param predicate Function to apply to each element, defaults to boolean check
 *
 * See alo `filterLeft`.
 */
function filterRight(arr, predicate = (element) => !!element) {
    let ret = [];
    if (arr.length === 0) {
        return ret;
    }
    for (let idx = arr.length - 1; idx >= 0; idx--) {
        if (predicate(arr[idx])) {
            ret.push(arr[idx]);
        }
        else {
            break;
        }
    }
    return ret.reverse();
}
exports.filterRight = filterRight;
/**
 * Get the leading elements of an array that pass a predicate function.
 * @param arr Array to filter from the beginning (left)
 * @param predicate Function to apply to each element, defaults to boolean check
 *
 * See also `filterRight`.
 */
function filterLeft(arr, predicate = (element) => !!element) {
    let ret = [];
    for (let x of arr) {
        if (predicate(x)) {
            ret.push(x);
        }
        else {
            break;
        }
    }
    return ret;
}
exports.filterLeft = filterLeft;
function argmin(arr, map, status) {
    let smallestElement = undefined;
    let smallestMapped = Infinity;
    let smallestIdx = -1;
    for (const [i, x] of enumerate(arr)) {
        const mapped = map(x);
        if (mapped < smallestMapped) {
            smallestElement = x;
            smallestMapped = mapped;
            smallestIdx = i;
        }
    }
    if (status) {
        status.min = smallestElement;
        status.argmin = smallestIdx;
        status.minmapped = smallestMapped;
    }
    return smallestIdx;
}
exports.argmin = argmin;
function fillHoles(a, b, predicate = (o => !o)) {
    let bidx = 0;
    for (let aidx in a) {
        if (predicate(a[aidx])) {
            a[aidx] = b[bidx++];
        }
    }
    return a;
}
exports.fillHoles = fillHoles;
function setEq(a, b) {
    if (a.size !== b.size) {
        return false;
    }
    return isSuperset(a, b);
}
exports.setEq = setEq;
// From
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
function isSuperset(set, subset) {
    for (var elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}
exports.isSuperset = isSuperset;
function union(setA, setB) {
    var _union = new Set(setA);
    for (var elem of setB) {
        _union.add(elem);
    }
    return _union;
}
exports.union = union;
function intersection(setA, setB) {
    var _intersection = new Set();
    for (var elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}
exports.intersection = intersection;
function difference(setA, setB) {
    var _difference = new Set(setA);
    for (var elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}
exports.difference = difference;
/**
 * This is a riff off the Clojure function partition-by,
 * see http://clojure.github.io/clojure/clojure.core-api.html#clojure.core/partition-by
 * `partitionBy([ 0, 0, 0, 1, 2, 3, 0, 1, 2, 3, 4, 5, 0, 0, 1, 0, 1, 0 ], x => !x)` =>
 * ```
 * [ [ 0 ],
 *   [ 0 ],
 *   [ 0, 1, 2, 3 ],
 *   [ 0, 1, 2, 3, 4, 5 ],
 *   [ 0 ],
 *   [ 0, 1 ],
 *   [ 0, 1 ],
 *   [ 0 ] ]
 * ```
 *
 * @param arr array to split
 * @param pred predicate to split at: when evaluates true, new subarray begins
 */
function partitionBy(arr, pred) {
    let ret = arr.length ? [[arr[0]]] : [[]];
    let retidx = 0;
    for (let i = 1; i < arr.length; i++) {
        if (pred(arr[i], i, arr)) {
            ret.push([arr[i]]);
            retidx++;
        }
        else {
            ret[retidx].push(arr[i]);
        }
    }
    return ret;
}
exports.partitionBy = partitionBy;
/**
 * Returns initial block of elements of array that all evaluate true for predicate
 * @param arr array to return initial subarray of
 * @param f predicate to apply: when evaluates false, stop processing elements
 */
function takeWhile(arr, f) {
    let n = 0;
    for (; n < arr.length; n++) {
        if (!f(arr[n])) {
            break;
        }
    }
    return arr.slice(0, n);
}
exports.takeWhile = takeWhile;
/**
 * Map over an iterator, e.g., `mapIterator(set.values(), x=>x.trim())`.
 * @param it iterator
 * @param f mapper
 */
function* mapIterator(it, f) {
    for (let x of it) {
        yield f(x);
    }
}
exports.mapIterator = mapIterator;
/**
 * Flatmap over an iterator with a function that yields iterators.
 *
 * E.g., if you have a map whose values are sets:
 * `flatMapIterator(mapOfSets.values(), set=>set.values())`
 * @param it iterator
 * @param f mapper yielding another iterator
 */
function* flatMapIterator(it, f) {
    for (let x of it) {
        yield* f(x);
    }
}
exports.flatMapIterator = flatMapIterator;
/**
 * Simple flatmap operator, same arguments as `flatMapIterator` above but returns array
 */
function flatmap(it, f) {
    return Array.from(flatMapIterator(it, f));
}
exports.flatmap = flatmap;
/**
 * Like `Array.prototype.map` but produces reversed output (using indexing).
 * @param v Array
 * @param mapper Function, same as `Array.prototype.map`.
 */
function mapRight(v, mapper) {
    const N = v.length;
    return Array.from(Array(N), (_, i) => mapper(v[N - i - 1], N - i - 1, v));
}
exports.mapRight = mapRight;
function groupBy(arr, f) {
    const ret = new Map();
    for (const x of arr) {
        const y = f(x);
        const hit = ret.get(y);
        if (hit) {
            hit.push(x);
        }
        else {
            ret.set(y, [x]);
        }
    }
    return ret;
}
exports.groupBy = groupBy;
/**
 * Bins entries of `it` into bins with maxs `binMaxs` and returns smallest bin with anything in it.
 *
 * Assuming N finite entries in `binMaxs`, imagine N+1 bins, where a square bracket implies closed (inclusive) interval
 * and parens imply open (excluded) interval:
 *
 * 1. `(-Infinity, binMaxs[0])`
 * 2. `[binMaxs[0], binMaxs[1])`
 * 3. `[binMaxs[1], binMaxs[2])` ...
 * N+1. `[binMaxs[N-1], Infinity)`
 *
 * The the smallest bin (in terms of its start, say) with any items in it will be returned.
 * @param it
 * @param binMaxs
 * @param f
 */
function binLowest(it, binMaxs, f) {
    binMaxs = binMaxs.slice().sort((a, b) => a - b);
    if (binMaxs[binMaxs.length - 1] !== Infinity) {
        binMaxs.push(Infinity);
    }
    const hits = Array.from(Array(binMaxs.length), _ => []);
    let hitsIdx = binMaxs.length - 1;
    for (const x of it) {
        const y = f(x);
        if (y < binMaxs[hitsIdx]) {
            hitsIdx = binMaxs.findIndex(max => y < max);
            hits[hitsIdx].push(x);
        }
    }
    return hits[hitsIdx];
}
exports.binLowest = binLowest;
/**
 * Returns the lowest `K` entries in iterator/array `it`, with each entry mapped to `f`.
 * @param it
 * @param K
 * @param f
 */
function partialSort(it, K, f) {
    if (it instanceof Array) {
        it = it.values();
    }
    const ret = [];
    if (K <= 0) {
        return ret;
    }
    // fill the bag with the first N items from the iterator
    for (let i = 0; i < K; i++) {
        const { value, done } = it.next();
        ret.push({ x: value, y: f(value) });
        if (done) {
            return ret;
        }
    }
    // Loop through the rest of the iterator, adding it to the bag and kicking out the previous largest if it's smaller
    // than the largest
    const cmp = (a, b) => a.y - b.y;
    ret.sort(cmp);
    const last = K - 1;
    for (const x of it) {
        const y = f(x);
        if (y < ret[last].y) {
            ret[last] = { x, y };
            ret.sort(cmp);
        }
    }
    return ret;
}
exports.partialSort = partialSort;
/**
 * Remove duplicates given a function mapping elements to a unique ID
 *
 * Examples:
 * `dedupe([1, 2, 3, 2, 1], x => x)` returns `[1, 2, 3]`
 * `dedupe([1, -1, 2, -2, -3, -4, 3, 4], x => x**2)` returns `[1, 2, -3, -4]`.
 */
function dedupe(v, f) {
    const seen = new Set();
    const ret = [];
    for (const [i, x] of v.entries()) {
        const y = f(x, i, v);
        if (!seen.has(y)) {
            ret.push(x);
            seen.add(y);
        }
    }
    return ret;
}
exports.dedupe = dedupe;
function dedupeLimit(v, f, limit) {
    const seen = new Set();
    const ret = [];
    for (const [i, x] of v.entries()) {
        const y = f(x, i, v);
        if (!seen.has(y)) {
            ret.push(x);
            seen.add(y);
            if (ret.length === limit) {
                break;
            }
        }
    }
    return ret;
}
exports.dedupeLimit = dedupeLimit;
function allSubstrings(s) {
    const slen = s.length;
    let ret = new Set();
    for (let start = 0; start < slen; start++) {
        for (let length = 1; length <= slen - start; length++) {
            ret.add(s.substr(start, length));
        }
    }
    return ret;
}
exports.allSubstrings = allSubstrings;
/**
 * Given three consecutive substrings (the arguments), return `{left: left2, cloze, right: right2}` where
 * `left2` and `right2` are as short as possible and `${left2}${cloze}${right2}` is unique in the full string.
 * @param left left string, possibly empty
 * @param cloze middle string
 * @param right right string, possible empty
 * @throws in the unlikely event that such a return string cannot be build (I cannot think of an example though)
 */
function generateContextClozed(left, cloze, right) {
    const sentence = left + cloze + right;
    let leftContext = '';
    let rightContext = '';
    let contextLength = 0;
    while (!appearsExactlyOnce(sentence, leftContext + cloze + rightContext)) {
        contextLength++;
        if (contextLength > left.length && contextLength > right.length) {
            console.error({ sentence, left, cloze, right, leftContext, rightContext, contextLength });
            throw new Error('Ran out of context to build unique cloze');
        }
        leftContext = left.slice(-contextLength);
        rightContext = right.slice(0, contextLength);
    }
    return { left: leftContext, cloze, right: rightContext };
}
exports.generateContextClozed = generateContextClozed;
/**
 * Ensure needle is found in haystack only once
 * @param haystack big string
 * @param needle little string
 */
function appearsExactlyOnce(haystack, needle) {
    const hit = haystack.indexOf(needle);
    return hit >= 0 && haystack.indexOf(needle, hit + 1) < 0;
}
exports.appearsExactlyOnce = appearsExactlyOnce;
/**
 * Find a string when it's exactly some contiguous sub-array
 *
 * substringInArray('hi my name is bob'.split(' '), 'hi') // { startIdx: 0, endIdx: 1 }
 * substringInArray('hi my name is bob'.split(' '), 'himy') // { startIdx: 0, endIdx: 2 }
 * substringInArray('hi my name is bob'.split(' '), 'my') // { startIdx: 1, endIdx: 2 }
 * substringInArray('hi my name is bob'.split(' '), 'myname') // { startIdx: 1, endIdx: 3 }
 * substringInArray('hi my name is bob'.split(' '), 'isbob') // { startIdx: 3, endIdx: 5 }
 * substringInArray('hi my name is bob'.split(' '), 'bob') // { startIdx: 4, endIdx: 5 }
 */
function substringInArray(v, target) {
    // this is a prefix scan of `v`'s elements' lengths
    const cumLengths = v.map((s) => s.length).reduce((p, x) => p.concat(x + p[p.length - 1]), [0]);
    const haystack = v.join("");
    const match = haystack.indexOf(target);
    if (match >= 0) {
        const startIdx = cumLengths.indexOf(match);
        const endIdx = cumLengths.indexOf(match + target.length);
        if (startIdx >= 0 && endIdx >= 0) {
            return { startIdx, endIdx };
        }
    }
}
exports.substringInArray = substringInArray;
