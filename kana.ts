let hiragana = "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなに" +
               "ぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ";
let katakana = "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニ" +
               "ヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ";

if (hiragana.length !== katakana.length) { throw new Error('Kana strings not same length?'); }

export let kata2hiraMap: Map<string, string> = new Map([]);
export let hira2kataMap: Map<string, string> = new Map([]);
hiragana.split('').forEach((h, i) => {
  kata2hiraMap.set(katakana[i], h);
  hira2kataMap.set(h, katakana[i])
});

export function kata2hira(s: string) { return s.split('').map(c => kata2hiraMap.get(c) || c).join(''); }
export function hira2kata(s: string) { return s.split('').map(c => hira2kataMap.get(c) || c).join(''); }

const hiraganaRe = /[ぁ-ゖ]/;
const katakanaRe = /[ァ-ヺ]/;
/**
 * Omits nakaguro (・), chouonpu (ー), and コト (ヿ)!
 */
export function hasKatakana(s: string): boolean { return katakanaRe.test(s); }
export function hasHiragana(s: string): boolean { return hiraganaRe.test(s); }
export function hasKana(s: string): boolean { return /[ぁ-ゖァ-ヺ]/.test(s); }

/*
There are other ways of doing this. In Unicode, katakana is 96 codepoints above hiragana. So
`String.fromCharCode(hiragana.charCodeAt(0) + 96)` will produce katakana. In speed tests though, the above Map-based
approach had the least variability in runtime (200 to 800 microseconds), while arithmetic-based approaches used 100 to
1500 microseconds.
*/
