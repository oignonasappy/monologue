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