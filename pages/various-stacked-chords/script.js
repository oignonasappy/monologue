function playStackedChord(sequence) {
    const first = 12 + Math.floor(Math.random() * 12);
    sequencer(
        (value) => {
            playKeys('main-piano', value);
        },
        new Array([...stackedChordGenerator(sequence, first, undefined)].length - 1)
            .fill(0.1),
        [...stackedChordGenerator(sequence, first, undefined)]
            .map((midi) => [midi]),
        240,
        'main-piano'
    );
}

/**
 * 堆積和音をmidi番号で生成するジェネレータ
 * @param {Array} sequence 堆積和音のパターン。増分するstep
 * @param {number} first このmidi番号から始めて
 * @param {number} last これを超えたら終了
 */
function* stackedChordGenerator(sequence, first = 12, last = 91) {
    let midi = first;
    let i = 0;
    while (midi <= last) {
        yield midi;
        midi += sequence[i];
        i = (i + 1) % sequence.length;
    }
}



// 末尾再帰の最適化はブラウザ上のJavaScriptでは基本的に行われないため、スタックオーバーフローが発生します
/**
 * @param {number} n 
 * @param {Function} f 
 * @returns 0
 */
const fFor1 = (n, f) => {
    if (n <= 0) return n;
    f(n - 1);
    return fFor1(n - 1, f);
};
console.log("> " + fFor1(5, n => console.log(n)));

/**
 * @param {number} from 
 * @param {number} to
 * @param {Function} f
 * @returns to
 */
const fFor2 = (from, to, f) => {
    if (from >= to) return from;
    f(from);
    return fFor2(from + 1, to, f);
};
console.log("> " + fFor2(2, 6, n => console.log(n)));

/**
 * @param {number} initialization 
 * @param {Function} condition predicate
 * @param {Function} afterthought 
 * @param {Function} f
 * @returns The last value that was not operated on by f
 */
const fFor3 = (initialization, condition, afterthought, f) => {
    if (!condition(initialization)) return initialization;
    f(initialization);
    return fFor3(afterthought(initialization), condition, afterthought, f);
};
console.log("> " + fFor3(10, n => n < 15, n => ++n, n => console.log(n)));

const fWhile = (condition, f) => {
    if (!condition(f())) return;
    fWhile(condition, f);
};