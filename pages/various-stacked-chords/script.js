/**
 * 堆積和音をmidi番号で生成するジェネレータ
 * @param {Array} sequence 堆積和音のパターン。増分するstep
 * @param {number} first このmidi番号から始めて
 * @param {number} last これを超えたら終了
 */
function* stackedChordGenerator(sequence, first = 12, last = 100) {
    let midi = first;
    let i = 0;
    while (midi <= last) {
        yield midi;
        midi += sequence[i];
        i = (i + 1) % sequence.length;
    }
}