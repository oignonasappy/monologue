(() => {
    /* 完全五度 */
    createFrequencyTexts(generateJustIntonationFrequency(10, 55, 3, 2), '#p5-box-ji');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 7, 12), '#p5-box-12');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 10, 17), '#p5-box-17');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 14, 24), '#p5-box-24');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 18, 31), '#p5-box-31');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 24, 41), '#p5-box-41');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 31, 53), '#p5-box-53');

    /* 完全四度 */
    createFrequencyTexts(generateJustIntonationFrequency(10, 55, 4, 3), '#p4-box-ji');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 5, 12), '#p4-box-12');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 7, 17), '#p4-box-17');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 10, 24), '#p4-box-24');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 13, 31), '#p4-box-31');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 17, 41), '#p4-box-41');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 22, 53), '#p4-box-53');

    /* 長三度 */
    createFrequencyTexts(generateJustIntonationFrequency(10, 55, 5, 4), '#maj3-box-ji');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 4, 12), '#maj3-box-12');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 5, 17), '#maj3-box-17');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 8, 24), '#maj3-box-24');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 10, 31), '#maj3-box-31');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 13, 41), '#maj3-box-41');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 17, 53), '#maj3-box-53');

    /* 短三度 */
    createFrequencyTexts(generateJustIntonationFrequency(10, 55, 6, 5), '#min3-box-ji');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 3, 12), '#min3-box-12');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 4, 17), '#min3-box-17');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 6, 24), '#min3-box-24');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 8, 31), '#min3-box-31');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 11, 41), '#min3-box-41');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 14, 53), '#min3-box-53');

    /* 自然七度 */
    createFrequencyTexts(generateJustIntonationFrequency(10, 55, 7, 4), '#n7-box-ji');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 10, 12), '#n7-box-12');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 14, 17), '#n7-box-17');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 19, 24), '#n7-box-24');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 25, 31), '#n7-box-31');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 33, 41), '#n7-box-41');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 43, 53), '#n7-box-53');

    /* 七限界の短三度 */
    createFrequencyTexts(generateJustIntonationFrequency(10, 55, 7, 6), '#nmin3-box-ji');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 3, 12), '#nmin3-box-12');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 4, 17), '#nmin3-box-17');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 5, 24), '#nmin3-box-24');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 7, 31), '#nmin3-box-31');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 9, 41), '#nmin3-box-41');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 12, 53), '#nmin3-box-53');

    /* 十一限界の三全音 */
    createFrequencyTexts(generateJustIntonationFrequency(10, 55, 11, 8), '#n11-box-ji');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 6, 12), '#n11-box-12');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 8, 17), '#n11-box-17');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 11, 24), '#n11-box-24');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 14, 31), '#n11-box-31');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 19, 41), '#n11-box-41');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 24, 53), '#n11-box-53');

    /* 十一限界の中立三度 */
    createFrequencyTexts(generateJustIntonationFrequency(10, 55, 11, 9), '#n3-box-ji');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 3, 12), '#n3-box-12');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 5, 17), '#n3-box-17');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 7, 24), '#n3-box-24');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 9, 31), '#n3-box-31');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 12, 41), '#n3-box-41');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 15, 53), '#n3-box-53');

    /* 十三限界の短六度 */
    createFrequencyTexts(generateJustIntonationFrequency(10, 55, 13, 8), '#nmin6-box-ji');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 8, 12), '#nmin6-box-12');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 12, 17), '#nmin6-box-17');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 17, 24), '#nmin6-box-24');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 22, 31), '#nmin6-box-31');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 29, 41), '#nmin6-box-41');
    createFrequencyTexts(generateEqualTemperamentFrequency(10, 55, 37, 53), '#nmin6-box-53');

})();

/**
 * 周波数テキストを生成する
 */
function createFrequencyTexts(generator, query) {
    for (const hz of generator) {
        document.querySelector(query).insertAdjacentElement('afterbegin', createHzText(hz));
    }
}

/**
 * 与えられたHzを表示するテキスト形式にする
 */
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