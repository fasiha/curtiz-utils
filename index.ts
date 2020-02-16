export * from './kana';

/**
 * Does an input string have any kanji? Applies XRegExp's '\Han' Unicode block test.
 * @param s string to test
 * See https://stackoverflow.com/questions/7344871/javascript-regular-expression-to-catch-kanji#comment91884309_7351856
 */
export function hasKanji(s: string): boolean {
  const k =
      /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FEF\uF900-\uFA6D\uFA70-\uFAD9]/;
  return k.test(s);
}

/**
 * Flatten once.
 * @param arr array of arrays
 */
export function flatten<T>(arr: T[][]): T[] { return arr.reduce((memo, curr) => memo.concat(curr), []); }

/**
 * Generates `[index, value]` 2-tuples, so you can `for (let [index, value] of enumerate(v) {...})`.
 * @param v array or iterable iterator to enumerate
 * @param n starting number (defaults to 0)
 *
 * Hat tip: https://docs.python.org/3/library/functions.html#enumerate
 */
export function* enumerate<T>(v: T[]|IterableIterator<T>, n: number = 0): IterableIterator<[number, T]> {
  for (let x of v) { yield [n++, x]; }
}

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
export function* zip(...arrs: any[][]) {
  const stop = Math.min(...arrs.map(v => v.length));
  for (let i = 0; i < stop; i++) { yield arrs.map(v => v[i]); }
}

/**
 * Apply a predicate to an array from its end, returning the continguously-passing sub-array.
 * @param arr Array to filter from the right (end)
 * @param predicate Function to apply to each element, defaults to boolean check
 *
 * See alo `filterLeft`.
 */
export function filterRight<T>(arr: T[], predicate: (element: T) => boolean = (element) => !!element): T[] {
  let ret: T[] = [];
  if (arr.length === 0) { return ret; }
  for (let idx = arr.length - 1; idx >= 0; idx--) {
    if (predicate(arr[idx])) {
      ret.push(arr[idx]);
    } else {
      break;
    }
  }
  return ret.reverse();
}
/**
 * Get the leading elements of an array that pass a predicate function.
 * @param arr Array to filter from the beginning (left)
 * @param predicate Function to apply to each element, defaults to boolean check
 *
 * See also `filterRight`.
 */
export function filterLeft<T>(arr: T[], predicate: (element: T) => boolean = (element) => !!element): T[] {
  let ret: T[] = [];
  for (let x of arr) {
    if (predicate(x)) {
      ret.push(x);
    } else {
      break;
    }
  }
  return ret;
}

export function argmin<T>(arr: T[]|IterableIterator<T>, map: (element: T) => number,
                          status?: {min?: T, argmin?: number, minmapped?: number}): number {
  let smallestElement: T|undefined = undefined;
  let smallestMapped = Infinity;
  let smallestIdx = -1;
  for (const [i, x] of enumerate(arr)) {
    const mapped = map(x)
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

export function fillHoles<T>(a: T[], b: T[], predicate: (a: T) => boolean = (o => !o)) {
  let bidx = 0;
  for (let aidx in a) {
    if (predicate(a[aidx])) { a[aidx] = b[bidx++]; }
  }
  return a;
}

export function setEq<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) { return false; }
  return isSuperset(a, b);
}

// From
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
export function isSuperset<T>(set: Set<T>, subset: Set<T>) {
  for (var elem of subset) {
    if (!set.has(elem)) { return false; }
  }
  return true;
}

export function union<T>(setA: Set<T>, setB: Set<T>) {
  var _union = new Set(setA);
  for (var elem of setB) { _union.add(elem); }
  return _union;
}

export function intersection<T>(setA: Set<T>, setB: Set<T>) {
  var _intersection = new Set();
  for (var elem of setB) {
    if (setA.has(elem)) { _intersection.add(elem); }
  }
  return _intersection;
}

export function difference<T>(setA: Set<T>, setB: Set<T>) {
  var _difference = new Set(setA);
  for (var elem of setB) { _difference.delete(elem); }
  return _difference;
}

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
export function partitionBy<T>(arr: T[], pred: (value: T, index?: number, arr?: T[]) => boolean): T[][] {
  let ret: T[][] = arr.length ? [[arr[0]]] : [[]];
  let retidx = 0;
  for (let i = 1; i < arr.length; i++) {
    if (pred(arr[i], i, arr)) {
      ret.push([arr[i]]);
      retidx++;
    } else {
      ret[retidx].push(arr[i]);
    }
  }
  return ret;
}

/**
 * Returns initial block of elements of array that all evaluate true for predicate
 * @param arr array to return initial subarray of
 * @param f predicate to apply: when evaluates false, stop processing elements
 */
export function takeWhile<T>(arr: T[], f: (x: T) => boolean): T[] {
  let n = 0;
  for (; n < arr.length; n++) {
    if (!f(arr[n])) { break; }
  }
  return arr.slice(0, n);
}

/**
 * Map over an iterator, e.g., `mapIterator(set.values(), x=>x.trim())`.
 * @param it iterator
 * @param f mapper
 */
export function* mapIterator<T, U>(it: IterableIterator<T>|T[], f: (x: T) => U): IterableIterator<U> {
  for (let x of it) { yield f(x); }
}

/**
 * Flatmap over an iterator with a function that yields iterators.
 *
 * E.g., if you have a map whose values are sets:
 * `flatMapIterator(mapOfSets.values(), set=>set.values())`
 * @param it iterator
 * @param f mapper yielding another iterator
 */
export function*
    flatMapIterator<T, U>(it: IterableIterator<T>|T[], f: (x: T) => IterableIterator<U>| U[]): IterableIterator<U> {
  for (let x of it) { yield* f(x); }
}

/**
 * Simple flatmap operator, same arguments as `flatMapIterator` above but returns array
 */
export function flatmap<T, U>(it: IterableIterator<T>|T[], f: (x: T) => IterableIterator<U>| U[]): U[] {
  return Array.from(flatMapIterator(it, f));
}

/**
 * Like `Array.prototype.map` but produces reversed output (using indexing).
 * @param v Array
 * @param mapper Function, same as `Array.prototype.map`.
 */
export function mapRight<T, U>(v: T[], mapper: (x: T, i?: number, v?: T[]) => U): U[] {
  const N = v.length;
  return Array.from(Array(N), (_, i) => mapper(v[N - i - 1], N - i - 1, v));
}

export function groupBy<T, U>(arr: T[], f: (x: T) => U): Map<U, T[]> {
  const ret: Map<U, T[]> = new Map();
  for (const x of arr) {
    const y = f(x);
    const hit = ret.get(y);
    if (hit) {
      hit.push(x);
    } else {
      ret.set(y, [x]);
    }
  }
  return ret;
}

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
export function binLowest<T>(it: IterableIterator<T>|T[], binMaxs: number[], f: (t: T) => number): T[] {
  binMaxs = binMaxs.slice().sort((a, b) => a - b);
  if (binMaxs[binMaxs.length - 1] !== Infinity) { binMaxs.push(Infinity); }
  const hits: T[][] = Array.from(Array(binMaxs.length), _ => []);
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

/**
 * Returns the lowest `K` entries in iterator/array `it`, with each entry mapped to `f`.
 * @param it
 * @param K
 * @param f
 */
export function partialSort<T>(it: IterableIterator<T>|T[], K: number, f: (t: T) => number) {
  if (it instanceof Array) { it = it.values(); }
  const ret: ({x: T, y: number})[] = [];
  if (K <= 0) { return ret; }
  // fill the bag with the first N items from the iterator
  for (let i = 0; i < K; i++) {
    const {value, done} = it.next();
    ret.push({x: value, y: f(value)});
    if (done) { return ret; }
  }
  // Loop through the rest of the iterator, adding it to the bag and kicking out the previous largest if it's smaller
  // than the largest
  const cmp = (a: typeof ret[0], b: typeof ret[0]) => a.y - b.y;
  ret.sort(cmp);
  const last = K - 1;
  for (const x of it) {
    const y = f(x);
    if (y < ret[last].y) {
      ret[last] = {x, y};
      ret.sort(cmp);
    }
  }
  return ret;
}

/**
 * Remove duplicates given a function mapping elements to a unique ID
 *
 * Examples:
 * `dedupe([1, 2, 3, 2, 1], x => x)` returns `[1, 2, 3]`
 * `dedupe([1, -1, 2, -2, -3, -4, 3, 4], x => x**2)` returns `[1, 2, -3, -4]`.
 */
export function dedupe<T, U>(v: T[], f: (x: T, i: number, arr: T[]) => U): T[] {
  const seen: Set<U> = new Set();
  const ret: T[] = [];
  for (const [i, x] of v.entries()) {
    const y = f(x, i, v);
    if (!seen.has(y)) {
      ret.push(x);
      seen.add(y);
    }
  }
  return ret;
}
