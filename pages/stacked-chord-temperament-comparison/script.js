(() => {
    /* 完全五度 */
    for (const hz of generateJustIntonationFrequency(9, 55, 3, 2)) {
        document.querySelector('#p5-box-ji').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(9, 55, 7, 12)) {
        document.querySelector('#p5-box-12').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(9, 55, 10, 17)) {
        document.querySelector('#p5-box-17').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(9, 55, 18, 31)) {
        document.querySelector('#p5-box-31').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(9, 55, 24, 41)) {
        document.querySelector('#p5-box-41').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(9, 55, 31, 53)) {
        document.querySelector('#p5-box-53').insertAdjacentElement('afterbegin', createHzText(hz));
    }

    /* 完全四度 */
    for (const hz of generateJustIntonationFrequency(13, 55, 4, 3)) {
        document.querySelector('#p4-box-ji').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(13, 55, 5, 12)) {
        document.querySelector('#p4-box-12').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(13, 55, 7, 17)) {
        document.querySelector('#p4-box-17').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(13, 55, 13, 31)) {
        document.querySelector('#p4-box-31').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(13, 55, 17, 41)) {
        document.querySelector('#p4-box-41').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(13, 55, 22, 53)) {
        document.querySelector('#p4-box-53').insertAdjacentElement('afterbegin', createHzText(hz));
    }

    /* 長三度 */
    for (const hz of generateJustIntonationFrequency(17, 55, 5, 4)) {
        document.querySelector('#maj3-box-ji').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(17, 55, 4, 12)) {
        document.querySelector('#maj3-box-12').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(17, 55, 5, 17)) {
        document.querySelector('#maj3-box-17').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(17, 55, 10, 31)) {
        document.querySelector('#maj3-box-31').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(17, 55, 13, 41)) {
        document.querySelector('#maj3-box-41').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(17, 55, 17, 53)) {
        document.querySelector('#maj3-box-53').insertAdjacentElement('afterbegin', createHzText(hz));
    }

    /* 短三度 */
    for (const hz of generateJustIntonationFrequency(20, 55, 6, 5)) {
        document.querySelector('#min3-box-ji').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(20, 55, 3, 12)) {
        document.querySelector('#min3-box-12').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(20, 55, 4, 17)) {
        document.querySelector('#min3-box-17').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(20, 55, 8, 31)) {
        document.querySelector('#min3-box-31').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(20, 55, 11, 41)) {
        document.querySelector('#min3-box-41').insertAdjacentElement('afterbegin', createHzText(hz));
    }
    for (const hz of generateEqualTemperamentFrequency(20, 55, 14, 53)) {
        document.querySelector('#min3-box-53').insertAdjacentElement('afterbegin', createHzText(hz));
    }
})();

/**
 * 与えられたHzを表示するテキスト形式にする
 * */
function createHzText(hz) {
    const hzText = document.createElement('div');
    hzText.textContent = `${hz.toString().substring(0, 9)} Hz`;
    hzText.className = "hz-text";
    return hzText;
}

/**
 * 純正律の周波数を生成するジェネレータ
 */
function* generateJustIntonationFrequency(count = 1, start = 440, numerator = 3, denominator = 2) {
    let hz = start;

    let i = 0
    while (i++ < count) {
        yield hz;
        hz *= numerator / denominator;
    }
}

/**
 * 平均律の周波数を生成するジェネレータ
*/
function* generateEqualTemperamentFrequency(count = 1, start = 440, step = 7, division = 12) {
    let hz = start;

    let i = 0;
    while (i++ < count) {
        yield hz;
        hz *= Math.pow(2, step / division);
    }
}

/**
 * 与えられたジェネレータでsequencerを実行する
 * piano.jsに依存
 */
function sequenceGenerator([...generatorArray]) {
    sequencer((value) => {
        playNote(hzToMidi(value, 440), 0.2, 2, 'square', 440);
    },
        new Array(generatorArray.length).fill(0.1),
        generatorArray,
        240,
    );
}